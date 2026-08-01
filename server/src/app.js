import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';

import { ApiError } from './utils/ApiError.js';
import { logger } from './utils/logger.js';
import authRoutes from './routes/authRoutes.js';
import problemRoutes from './routes/problemRoutes.js';
import submissionRoutes from './routes/submissionsRoutes.js';

const app = express();

/* Middleware setup for security, CORS, and request parsing */
app.use(helmet());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true,
  }),
);
app.use(cookieParser());
app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true, limit: '16kb' }));

/* Route handlers */
app.use('/api/auth', authRoutes);
app.use('/api/problems', problemRoutes);
app.use('/api/submissions', submissionRoutes);

/* Health check Route to verify if the API is running */
app.get('/health', (req, res) => {
  res.status(200).json({ success: true, message: 'VerdictIO API is running healthy.' });
});

/* Handle 404 errors for undefined routes */
app.use((req, res, next) => {
  next(new ApiError(404, `Route ${req.originalUrl} not found`));
});

/* Global Error Handling Middleware */
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  if (statusCode >= 500) {
    console.error('\n========== SERVER ERROR ==========');
    console.error(`${req.method} ${req.originalUrl}`);
    console.error(err.stack);
    console.error('==================================\n');
  } else {
    console.warn(`${req.method} ${req.originalUrl} -> ${statusCode} : ${message}`);
  }

  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
    errors: err.errors || [],
    data: null,
  });
});

export { app };
