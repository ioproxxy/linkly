import { GoogleGenerativeAI } from '@google/generative-ai';
import prisma from '../utils/prisma';
import { OutreachService } from './OutreachService';

export class ReplyHandlerService {
    private genAI: GoogleGenerativeAI | null = null;
    private model: any = null;
    private outreachService: OutreachService;

    constructor() {
        if (process.env.GEMINI_API_KEY) {
            this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
            this.model = this.genAI.getGenerativeModel({ model: "gemini-pro" });
        }
        this.outreachService = new OutreachService();
    }

    async handleReply(leadEmail: string, replyBody: string) {
        console.log(`Handling reply from ${leadEmail}`);

        const lead = await prisma.lead.findFirst({
            where: { email: leadEmail },
            include: { campaign: true }
        });

        if (!lead) {
            console.error("Lead not found");
            return;
        }

        // record reply
        await prisma.reply.create({
            data: {
                subject: "Re: Outreach",
                body: replyBody,
                leadId: lead.id
            }
        });

        // Classify
        const classification = await this.classifyReply(replyBody);
        console.log(`Classification: ${classification}`);

        // Update lead status
        let newStatus = 'REPLIED';
        if (classification === 'INTERESTED') newStatus = 'INTERESTED';
        if (classification === 'NOT_INTERESTED') newStatus = 'NOT_INTERESTED';

        await prisma.lead.update({
            where: { id: lead.id },
            data: { status: newStatus }
        });

        // Action based on classification
        if (classification === 'INTERESTED' || classification === 'QUESTION') {
            const response = await this.generateResponse(replyBody, lead, classification);
            await this.outreachService.sendEmail(lead, `Re: ${lead.companyName}`, response);
        }
    }

    private async classifyReply(body: string): Promise<string> {
        if (!this.model) return 'INTERESTED'; // Default mock

        try {
            const prompt = `Classify this sales email reply into one of these categories: INTERESTED, NOT_INTERESTED, QUESTION. Reply ONLY with the category name.\n\nEmail Body:\n${body}`;
            const result = await this.model.generateContent(prompt);
            const response = await result.response;
            return response.text().trim().toUpperCase();
        } catch (e) {
            return 'INTERESTED';
        }
    }

    private async generateResponse(originalBody: string, lead: any, classification: string): Promise<string> {
        if (!this.model) return "Thanks for your interest! When are you free to chat?";

        try {
            const prompt = `You are an SDR. A lead (${lead.name}) just replied: "${originalBody}". Classification: ${classification}. Write a short, professional response. If they are INTERESTED, ask for a meeting time. If they have a QUESTION, answer it generically and ask for a meeting. Keep it under 3 sentences.`;
            const result = await this.model.generateContent(prompt);
            const response = await result.response;
            return response.text().trim();
        } catch (e) {
            return "Thanks for your note. Would you be open to a quick call this week?";
        }
    }
}
