import { GoogleGenerativeAI } from '@google/generative-ai';
import prisma from '../utils/prisma';

export class PersonalizationService {
    private genAI: GoogleGenerativeAI | null = null;
    private model: any = null;

    constructor() {
        if (process.env.GEMINI_API_KEY) {
            this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
            this.model = this.genAI.getGenerativeModel({ model: "gemini-pro" });
        } else {
            console.warn("Gemini API Key missing. Personalization will use mock templates.");
        }
    }

    async generateIntro(lead: any, campaign: any): Promise<string> {
        if (!this.model) {
            return `Hi ${lead.name || 'there'}, I noticed ${lead.companyName} is doing great work in ${campaign.industry || 'your industry'}.`;
        }

        try {
            const prompt = `Write a short, personalized intro for an email to ${lead.name} at ${lead.companyName}. Mention something generic but complimenting about their website ${lead.website}. Keep it strictly under 2 sentences.`;

            const result = await this.model.generateContent(prompt);
            const response = await result.response;
            return response.text().trim();
        } catch (e) {
            console.error("Gemini Error:", e);
            return `Hi ${lead.name}, potential synergies with ${lead.companyName}.`;
        }
    }

    async generateEmailBody(lead: any, campaign: any): Promise<{ subject: string, body: string }> {
        const intro = await this.generateIntro(lead, campaign);

        const subject = `Quick question for ${lead.companyName}`;
        const body = `${intro}\n\nWe help agencies like yours scale outbound without the hassle. Would you be open to a quick chat?`;

        return { subject, body };
    }
}
