import { Request, Response } from 'express';
import prisma from '../utils/prisma';
import { LeadHunterService } from '../services/LeadHunterService';
import { PersonalizationService } from '../services/PersonalizationService';
import { OutreachService } from '../services/OutreachService';

// Extended Request interface to include user from auth middleware
interface AuthRequest extends Request {
    user?: { userId: string };
}

const leadHunter = new LeadHunterService();
const personalizationService = new PersonalizationService();
const outreachService = new OutreachService();

export const createCampaign = async (req: AuthRequest, res: Response) => {
    try {
        const { name, industry, location } = req.body;
        const userId = req.user?.userId;

        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const campaign = await prisma.campaign.create({
            data: {
                name,
                userId,
                status: 'DRAFT'
            }
        });

        // Trigger Lead Hunter immediately for MVP simplicity
        const leads = await leadHunter.findLeads({ industry, location }, campaign.id);

        res.status(201).json({ campaign, leadsCount: leads.length });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating campaign', error });
    }
};

export const getCampaigns = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.userId;
        const campaigns = await prisma.campaign.findMany({
            where: { userId },
            include: { _count: { select: { leads: true } } },
            orderBy: { createdAt: 'desc' }
        });
        res.json(campaigns);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching campaigns', error });
    }
};

export const getCampaign = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const userId = req.user?.userId;

        const campaign = await prisma.campaign.findFirst({
            where: { id, userId },
            include: { leads: true }
        });

        if (!campaign) return res.status(404).json({ message: 'Campaign not found' });

        res.json(campaign);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching campaign', error });
    }
};

export const startCampaign = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const userId = req.user?.userId;

        const campaign = await prisma.campaign.findFirst({
            where: { id, userId },
            include: { leads: true }
        });

        if (!campaign) return res.status(404).json({ message: 'Campaign not found' });

        // Update status
        await prisma.campaign.update({ where: { id }, data: { status: 'ACTIVE' } });

        // Process leads
        let sentCount = 0;
        for (const lead of campaign.leads) {
            if (lead.status === 'NEW') {
                const { subject, body } = await personalizationService.generateEmailBody(lead, campaign);
                const sent = await outreachService.sendEmail(lead, subject, body);

                if (sent) {
                    await prisma.lead.update({ where: { id: lead.id }, data: { status: 'CONTACTED' } });
                    await prisma.emailMessage.create({
                        data: {
                            subject,
                            body,
                            leadId: lead.id,
                            campaignId: campaign.id
                        }
                    });
                    sentCount++;
                }
            }
        }

        res.json({ message: `Campaign started. Sent ${sentCount} emails.` });
    } catch (error) {
        res.status(500).json({ message: 'Error starting campaign', error });
    }
};
