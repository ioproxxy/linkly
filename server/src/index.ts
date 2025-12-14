import 'dotenv/config';
import express from 'express';
import cors from 'cors';

// dotenv.config(); // Removed

const app = express();
const PORT = process.env.PORT || 3000;

import authRoutes from './routes/authRoutes';
import campaignRoutes from './routes/campaignRoutes';
import dashboardRoutes from './routes/dashboardRoutes';

import path from 'path';

// ... (existing imports)

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/campaigns', campaignRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Serve Static Frontend (Production)
const clientBuildPath = path.join(__dirname, '../../client/dist');
app.use(express.static(clientBuildPath));

// Handle React Routing (SPA) - redirect all unknown routes to index.html
app.get('*', (req, res) => {
    // Skip /api routes to allow 404 for API
    if (req.path.startsWith('/api')) {
        return res.status(404).json({ error: 'API Not Found' });
    }
    res.sendFile(path.join(clientBuildPath, 'index.html'));
});

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
