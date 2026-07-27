import 'dotenv/config';
import mongoose from 'mongoose';
import { Worker } from 'bullmq';

import connectDB from './config/db.js';
import { redisConnection } from './config/redis.js';
import { Submission } from './models/Submission.js';
import { executeDockerSandbox } from './sandbox/dockerRunner.js';

/* Initialize the database connection */
connectDB()
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

/* Initialize the BullMQ worker */
const worker = new Worker(
  'submissions',
  async (job) => {
    const { submissionId, problemId, language, code } = job.data;
    console.log(`Processing submission ${submissionId}`);

    try {
      /**
       * Execute the code in a Docker sandbox and get the result.
       * const result = await executeDockerSandbox(language, code, testCases);
       */
      const result = { verdict: 'AC', runtime: 45, memory: 12.5 };

      await Submission.findByIdAndUpdate(submissionId, {
        verdict: result.verdict,
        runtime: result.runtime,
        memory: result.memory,
      });
    } catch (error) {
      console.error(`Error processing submission ${submissionId}:`, error);
      await Submission.findByIdAndUpdate(submissionId, { verdict: 'RE' });
    }
  },
  { connection: redisConnection },
);

worker.on('completed', (job) => {
  console.log(`Job ${job.id} completed successfully`);
});

worker.on('failed', (job, err) => {
  console.error(`Job ${job.id} failed with error:`, err);
});
