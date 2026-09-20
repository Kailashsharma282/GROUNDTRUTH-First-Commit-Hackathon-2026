import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { apiRouter } from './routes/api.routes.js';
import { AWS_CONFIG } from './config/aws.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// Request Logging
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[HTTP] ${req.method} ${req.originalUrl} ${res.statusCode} (${duration}ms)`);
  });
  next();
});

// Root & Health info
app.get('/', (req, res) => {
  res.json({
    message: 'GroundTruth — AI Reality Verification Engine API',
    status: 'ACTIVE',
    version: '1.0.0',
    docs: '/api/v1/health',
    track: 'SHIP IT (AWS First Commit 2026)',
    builder: 'Pochiraju Kailash Ram Markandeya Sharma (@kailashsharma)'
  });
});

// API Routes
app.use('/api/v1', apiRouter);

// Global Error Handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('[API Error]', err);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal Server Error'
  });
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`=======================================================`);
    console.log(` GroundTruth API Server Running on port ${PORT}`);
    console.log(` AWS Region: ${AWS_CONFIG.region}`);
    console.log(` AI Provider: ${AWS_CONFIG.aiProvider.toUpperCase()}`);
    console.log(` Health: http://localhost:${PORT}/api/v1/health`);
    console.log(`=======================================================`);
  });
}

export { app };
