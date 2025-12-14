import { GoogleGenerativeAI } from '@google/generative-ai';
import prisma from '../utils/prisma';

export class ChatService {
    private genAI: GoogleGenerativeAI | null = null;
    private model: any = null;

    constructor() {
        if (process.env.GEMINI_API_KEY) {
            this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
            this.model = this.genAI.getGenerativeModel({ model: "gemini-pro" });
        }
    }

    async processQuery(query: string, userId: string) {
        if (!this.model) {
            return "AI Service is not configured (Missing API Key).";
        }

        try {
            // 1. Gather Context
            const context = await this.gatherContext(userId);

            // 2. Construct Prompt
            const prompt = `
      You are an intelligent Sales Ops Assistant for "Linkly".
      
      CONTEXT DATA:
      ${JSON.stringify(context, null, 2)}
      
      USER QUERY: "${query}"
      
      INSTRUCTIONS:
      - Answer the query based ONLY on the context data.
      - Be concise, professional, and actionable.
      - If you don't have the data, say "I don't have that information."
      `;

            // 3. specific questions about specific leads could be handled by searching, 
            // but for MVP we load high level context. 
            // If prompt is too large, we would need RAG or search.
            // For MVP with small data, full dump is fine.

            const result = await this.model.generateContent(prompt);
            const response = await result.response;
            return response.text();

        } catch (error) {
            console.error("Chat Error:", error);
            return "I encountered an error processing your request.";
        }
    }

    private async gatherContext(userId: string) {
        // Fetch relevant data for the user
        const [campaigns, recentLeads, stats] = await Promise.all([
            prisma.campaign.findMany({ where: { userId }, include: { _count: { select: { leads: true } } } }),
            prisma.lead.findMany({
                where: { campaign: { userId } },
                take: 20,
                orderBy: { updatedAt: 'desc' },
                select: { name: true, companyName: true, status: true, email: true }
            }),
            prisma.reply.findMany({
                where: { lead: { campaign: { userId } } },
                take: 10,
                orderBy: { createdAt: 'desc' },
                include: { lead: { select: { companyName: true } } }
            })
        ]);

        return {
            overview: {
                totalCampaigns: campaigns.length,
            },
            campaigns: campaigns.map(c => ({ name: c.name, status: c.status, leadCount: c._count.leads })),
            recentLeads,
            recentReplies: stats.map(r => ({ from: r.lead.companyName, date: r.createdAt }))
        };
    }
}
