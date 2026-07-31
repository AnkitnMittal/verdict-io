import 'dotenv/config';
import mongoose from 'mongoose';
import { Worker } from 'bullmq';

import connectDB from './config/db.js';
import { redisConnection } from './config/redis.js';

import { ApiError } from './utils/ApiError.js';
import { Submission } from './models/Submission.js';
import { TestCase } from './models/TestCase.js';

import { executeDockerSandbox } from './sandbox/dockerRunner.js';
import { evaluateOutput } from './judge/evaluator.js';

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
      const testCases = await TestCase.find({ problemId });
      if (!testCases || testCases.length === 0) {
        throw new ApiError(404, `No test cases found for problem ID: ${problemId}`);
      }

      let finalVerdict = 'AC';
      let maxRuntime = 0;
      let maxMemory = 0;
      let failingDiagnostics = '';

      for (const testCase of testCases) {
        const result = await executeDockerSandbox(language, code, testCase.input);

        if (result.runtime > maxRuntime) maxRuntime = result.runtime;
        if (result.memory > maxMemory) maxMemory = result.memory;

        /* Docker limits triggered an error (TLE, MLE, RE, CE) */
        if (result.verdict !== 'AC') {
          finalVerdict = result.verdict;
          failingDiagnostics = result.stderr || `Execution failed on Test Case ${i + 1}`;
          break;
        }

        const evaluationVerdict = evaluateOutput(result.stdout, testCase.expectedOutput);

        if (evaluationVerdict !== 'AC') {
          finalVerdict = 'WA';
          failingDiagnostics = `Failed on Test Case ${i + 1}\nExpected:\n{testCase.expectedOutput}\nGot:\n${result.stdout}`;
          break;
        }
      }

      await Submission.findByIdAndUpdate(submissionId, {
        verdict: finalVerdict,
        runtime: maxRuntime,
        memory: maxMemory || 0,
        aiReport: failingDiagnostics,
      });
    } catch (error) {
      console.error(`Error processing submission ${submissionId}:`, error);
      await Submission.findByIdAndUpdate(submissionId, { verdict: 'RE', aiReport: `System Error: ${error.message}` });
    }
  },
  { connection: redisConnection, concurrency: 5 },
);

worker.on('completed', (job) => {
  console.log(`Job ${job.id} completed successfully`);
});

worker.on('failed', (job, err) => {
  console.error(`Job ${job.id} failed with error:`, err);
});
