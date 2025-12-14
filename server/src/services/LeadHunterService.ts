import prisma from '../utils/prisma';
import { Lead } from '@prisma/client';

export interface LeadSearchCriteria {
    industry: string;
    location: string;
    companySize?: string;
}

export class LeadHunterService {
    async findLeads(criteria: LeadSearchCriteria, campaignId: string): Promise<Lead[]> {
        console.log(`Hunting leads for campaign ${campaignId} with criteria:`, criteria);

        // Mocked Lead Generation for MVP
        // In a real production app, this would query a B2B database API (Clearbit, Apollo, etc.)
        // or perform targeted scraping (via additional scraping services).

        const mockedLeads = this.generateMockLeads(criteria, 5);

        const createdLeads: Lead[] = [];

        for (const mock of mockedLeads) {
            // Check if lead already exists for this campaign to prevent dupes
            const existing = await prisma.lead.findFirst({
                where: {
                    email: mock.email,
                    campaignId: campaignId
                }
            });

            if (!existing) {
                const lead = await prisma.lead.create({
                    data: {
                        ...mock,
                        campaignId,
                        status: 'NEW'
                    }
                });
                createdLeads.push(lead);
            }
        }

        return createdLeads;
    }

    private generateMockLeads(criteria: LeadSearchCriteria, count: number) {
        const leads = [];
        const industries = [criteria.industry, 'Software', 'Technology', 'Consulting'];

        for (let i = 0; i < count; i++) {
            const companyName = `${criteria.industry} Agency ${i + 1}`;
            const domain = `agency${i + 1}.example.com`;

            leads.push({
                email: `contact@${domain}`,
                companyName: companyName,
                website: `https://${domain}`,
                name: `Founder ${i + 1}`
            });
        }
        return leads;
    }
}
