import Redis from 'ioredis';

/* Redis connection configuration */
export const redisConnection = new Redis(process.env.REDIS_URI || 'redis://127.0.0.1:6379', {
  maxRetriesPerRequest: null,
});

redisConnection.on('connect', (err) => console.error('Redis connection error:', err));
