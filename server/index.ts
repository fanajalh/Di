import express from 'express';
import cors from 'cors';
import { initDb } from './db.js';
import authRoutes from './auth.js';
import dataRoutes from './api.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Initialize Postgres DB
initDb().catch(console.error);

app.use('/api/auth', authRoutes);
app.use('/api/data', dataRoutes);

// Vercel Serverless Fallback Routes
// In serverless environments with rewrites, req.url might be stripped of /api
app.use('/auth', authRoutes);
app.use('/data', dataRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'KOSTIN Backend is running' });
});

app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'KOSTIN Backend is running' });
});

export default app;

if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Backend server listening on port ${PORT}`);
  });
}
