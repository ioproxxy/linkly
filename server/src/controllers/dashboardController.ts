import { Request, Response } from 'express';
import prisma from '../utils/prisma';

export const getDashboardStats = async (req: Request, res: Response) => {
    try {
        const [
            totalLeads,
            emailsSent,
            replies,
            meetingsBooked
        ] = await Promise.all([
            prisma.lead.count(),
            prisma.emailMessage.count({ where: { status: 'SENT' } }), // Assuming we track sent emails this way or similar
            prisma.reply.count(),
            prisma.meeting.count()
        ]);

        // Recent Activity (Replies)
        const recentActivity = await prisma.reply.findMany({
            take: 5,
            orderBy: { createdAt: 'desc' },
            include: { lead: true }
        });

        res.json({
            metrics: {
                totalLeads,
                emailsSent,
                replies,
                meetingsBooked
            },
            recentActivity
        });
    } catch (error) {
        console.error("Error fetching stats:", error);
        res.status(500).json({ error: 'Failed to fetch dashboard stats' });
    }
};

export const getChartData = async (req: Request, res: Response) => {
    try {
        // Mocking time-series for now as we might not have historical timestamps on all events in MVP
        // In real app, we would group by createdAt date.

        const data = [
            { name: 'Mon', replies: 2, sent: 10 },
            { name: 'Tue', replies: 5, sent: 15 },
            { name: 'Wed', replies: 3, sent: 20 },
            { name: 'Thu', replies: 8, sent: 25 },
            { name: 'Fri', replies: 4, sent: 18 },
            { name: 'Sat', replies: 1, sent: 5 },
            { name: 'Sun', replies: 0, sent: 2 },
        ];
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch chart data' });
    }
};

export const getLeads = async (req: Request, res: Response) => {
    try {
        const { search, status } = req.query as any;

        const where: any = {};
        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { companyName: { contains: search, mode: 'insensitive' } },
                { email: { contains: search, mode: 'insensitive' } }
            ];
        }
        if (status) {
            where.status = status;
        }

        const leads = await prisma.lead.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            include: { campaign: true }
        });

        res.json(leads);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch leads' });
    }
};
