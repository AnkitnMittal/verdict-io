import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

const app = express();

/* Middleware setup for security, CORS, and request parsing */
app.use(helmet());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true,
  }),
);
app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true, limit: '16kb' }));

/* Health check endpoint to verify if the API is running */
app.get('/health', (req, res) => {
  res.status(200).json({ success: true, message: 'VerdictIO API is running healthy.' });
});

export { app };
