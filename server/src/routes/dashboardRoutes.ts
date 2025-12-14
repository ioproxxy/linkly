import { Router } from 'express';
import { getDashboardStats, getChartData, getLeads } from '../controllers/dashboardController';
import { handleChatQuery } from '../controllers/chatController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

router.use(authMiddleware);

router.get('/stats', getDashboardStats);
router.get('/chart-data', getChartData);
router.get('/leads', getLeads);
router.post('/chat', handleChatQuery);

export default router;
