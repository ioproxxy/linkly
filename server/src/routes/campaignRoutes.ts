import { Router } from 'express';
import { createCampaign, getCampaigns, getCampaign, startCampaign } from '../controllers/campaignController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

router.use(authMiddleware);

router.post('/', createCampaign);
router.get('/', getCampaigns);
router.get('/:id', getCampaign);
router.post('/:id/start', startCampaign);

export default router;
