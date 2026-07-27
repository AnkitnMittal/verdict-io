import { Queue } from 'bullmq';
import { redisConnection } from '../config/redis.js';

/* Submission queue for handling submission processing */
export const submissionQueue = new Queue('submissions', {
  connection: redisConnection,
  defaultJobOptions: {
    attempts: 3,
    backoff: { type: 'exponential', delay: 1000 },
    removeOnComplete: true,
    removeOnFail: 100,
  },
});
