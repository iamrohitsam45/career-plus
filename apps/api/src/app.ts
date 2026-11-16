import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { ENV } from './config/env';
import { generalLimiter } from './middleware/rateLimiter';
import { errorHandler } from './middleware/errorHandler';

import authRoutes from './routes/authRoutes';
import jobRoutes from './routes/jobRoutes';
import companyRoutes from './routes/companyRoutes';
import salaryRoutes from './routes/salaryRoutes';
import resumeRoutes from './routes/resumeRoutes';
import aiRoutes from './routes/aiRoutes';
import applicationRoutes from './routes/applicationRoutes';
import mentorshipRoutes from './routes/mentorshipRoutes';
import subscriptionRoutes from './routes/subscriptionRoutes';
import recruiterRoutes from './routes/recruiterRoutes';

export function createApp(): Express {
  const app = express();

  // Security Headers
  app.use(helmet({
    contentSecurityPolicy: false, // allow modern SPA headers
    crossOriginEmbedderPolicy: false,
  }));

  // CORS
  const allowedOrigins = [
    ENV.FRONTEND_URL,
    'http://localhost:3000',
    'http://127.0.0.1:3000',
  ];

  app.use(
    cors({
      origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(null, true); // Permissive in development
        }
      },
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    })
  );

  // Body Parsers
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Logging
  if (ENV.NODE_ENV !== 'test') {
    app.use(morgan('dev'));
  }

  // Rate Limiting
  app.use('/api/', generalLimiter);

  // Health check
  app.get('/api/v1/health', (req: Request, res: Response) => {
    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      service: 'CareerPulse AI Backend',
      version: '1.0.0',
    });
  });

  // Mount Feature Routes
  app.use('/api/v1/users', authRoutes);
  app.use('/api/v1/jobs', jobRoutes);
  app.use('/api/v1/companies', companyRoutes);
  app.use('/api/v1/salaries', salaryRoutes);
  app.use('/api/v1/resumes', resumeRoutes);
  app.use('/api/v1/ai', aiRoutes);
  app.use('/api/v1/applications', applicationRoutes);
  app.use('/api/v1/mentors', mentorshipRoutes);
  app.use('/api/v1/subscriptions', subscriptionRoutes);
  app.use('/api/v1/recruiter', recruiterRoutes);

  // 404 Handler
  app.use((req: Request, res: Response) => {
    res.status(404).json({
      success: false,
      error: `Route not found: ${req.method} ${req.originalUrl}`,
    });
  });

  // Centralized Error Handler
  app.use(errorHandler);

  return app;
}
