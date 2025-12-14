import 'dotenv/config';
import express from 'express';
import cors from 'cors';

// dotenv.config(); // Removed

const app = express();
const PORT = process.env.PORT || 3000;

import authRoutes from './routes/authRoutes';
import campaignRoutes from './routes/campaignRoutes';
import dashboardRoutes from './routes/dashboardRoutes';

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/campaigns', campaignRoutes);
app.use('/api/dashboard', dashboardRoutes);

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
