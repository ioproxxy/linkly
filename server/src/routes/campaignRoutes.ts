import { Router } from 'express';
import { createCampaign, getCampaigns, getCampaign, startCampaign } from '../controllers/campaignController';
import { handleIncomingReply } from '../controllers/replyController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

// Public webhook (unprotected) for demo purposes
router.post('/webhook/reply', handleIncomingReply);

router.use(authMiddleware);

router.post('/', createCampaign);
router.get('/', getCampaigns);
router.get('/:id', getCampaign);
router.post('/:id/start', startCampaign);

export default router;
