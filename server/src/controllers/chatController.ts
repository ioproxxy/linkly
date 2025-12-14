import { Request, Response } from 'express';
import { ChatService } from '../services/ChatService';

const chatService = new ChatService();

export const handleChatQuery = async (req: Request, res: Response) => {
    try {
        const { query } = req.body;
        const userId = (req as any).user.userId; // Provided by authMiddleware

        if (!query) {
            return res.status(400).json({ error: "Query is required" });
        }

        const answer = await chatService.processQuery(query, userId);
        res.json({ answer });
    } catch (error) {
        res.status(500).json({ error: "Chat processing failed" });
    }
};
