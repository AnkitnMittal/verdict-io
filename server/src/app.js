import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';

import authRoutes from './routes/authRoutes.js';

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

/* Authentication routes */
app.use('/api/auth', authRoutes);

/* Health check Route to verify if the API is running */
app.get('/health', (req, res) => {
  res.status(200).json({ success: true, message: 'VerdictIO API is running healthy.' });
});

/* Global Error Handling Middleware */
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  return res.status(statusCode).json({
    statusCode,
    success: false,
    message,
    errors: err.errors || [],
    data: null,
  });
});

export { app };
