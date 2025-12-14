import { Request, Response } from 'express';
import { ReplyHandlerService } from '../services/ReplyHandlerService';

const replyHandler = new ReplyHandlerService();

// Mock webhook endpoint to simulate receiving a reply
export const handleIncomingReply = async (req: Request, res: Response) => {
    try {
        const { email, body } = req.body;

        if (!email || !body) {
            return res.status(400).json({ message: 'Missing email or body' });
        }

        // Process in background
        replyHandler.handleReply(email, body);

        res.json({ message: 'Reply received and processing', status: 'queued' });
    } catch (error) {
        res.status(500).json({ message: 'Error processing reply', error });
    }
};
