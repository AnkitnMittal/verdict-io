import 'dotenv/config';
import mongoose from 'mongoose';
import { Worker } from 'bullmq';

import connectDB from './config/db.js';
import { redisConnection } from './config/redis.js';

import { ApiError } from './utils/ApiError.js';
import { Submission } from './models/Submission.js';
import { TestCase } from './models/TestCase.js';
import { Problem } from './models/Problem.js';
import { User } from './models/User.js';

import { languageConfigs } from './languages/index.js';
import { executeDockerSandbox } from './sandbox/dockerRunner.js';
import { evaluateOutput } from './judge/evaluator.js';

/* Initialize the database connection */
connectDB()
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('Error connecting to MongoDB:', error));

/* Initialize the BullMQ worker */
const worker = new Worker(
  'submissions',
  async (job) => {
    const { submissionId, problemId, language, code } = job.data;
    console.log(`Processing submission ${submissionId}`);

    try {
      const submission = await Submission.findById(submissionId);
      if (!submission) throw new ApiError(404, `Submission not found: ${submissionId}`);

      const problem = await Problem.findById(problemId);
      const user = await User.findById(submission.userId);
      const testCases = await TestCase.find({ problemId });

      if (!testCases || testCases.length === 0) {
        throw new ApiError(404, `No test cases found for problem ID: ${problemId}`);
      }

      const langConfig = languageConfigs[language];
      if (!langConfig) throw new ApiError(400, `Unsupported language: ${language}`);

      // Pass the entire array of testCases for batched execution
      const results = await executeDockerSandbox(langConfig, code, testCases);

      let finalVerdict = 'AC';
      let maxRuntime = 0;
      let maxMemory = 0;
      let failingDiagnostics = '';

      for (let i = 0; i < testCases.length; i++) {
        // Handle Compilation Errors that halt execution instantly
        if (results[0]?.verdict === 'CE') {
          finalVerdict = 'CE';
          failingDiagnostics = results[0].stderr;
          break;
        }

        const testCase = testCases[i];
        const result = results[i];

        if (result.runtime > maxRuntime) maxRuntime = result.runtime;
        if (result.memory > maxMemory) maxMemory = result.memory;

        /* Docker limits triggered an error (TLE, MLE, RE) */
        if (result.verdict !== 'AC') {
          finalVerdict = result.verdict;
          failingDiagnostics = result.stderr || `Execution failed on Test Case ${i + 1}`;
          break;
        }

        const evaluationVerdict = evaluateOutput(result.stdout, testCase.expectedOutput);

        if (evaluationVerdict !== 'AC') {
          finalVerdict = 'WA';
          if (testCase.isHidden) {
            failingDiagnostics = `Failed on Hidden Test Case ${i + 1}. Review your algorithm's edge cases.`;
          } else {
            failingDiagnostics = `Failed on Public Test Case ${i + 1}\nInput:\n${testCase.input}\nExpected:\n${testCase.expectedOutput}\nGot:\n${result.stdout}`;
          }
          break;
        }
      }

      /* --- Update the Submission Model --- */
      submission.verdict = finalVerdict;
      submission.runtime = maxRuntime;
      submission.memory = maxMemory;
      submission.aiReport = failingDiagnostics;
      await submission.save();

      /* --- Update the Problem Model --- */
      problem.totalSubmissions += 1;
      if (finalVerdict === 'AC') {
        problem.acceptedSubmissions += 1;
      }
      await problem.save();

      /* --- Update the User Model Stats --- */
      user.stats.totalSubmissions += 1;

      const today = new Date();
      today.setUTCHours(0, 0, 0, 0);

      const lastActive = user.stats.lastActiveDate ? new Date(user.stats.lastActiveDate) : null;
      if (lastActive) lastActive.setUTCHours(0, 0, 0, 0);

      if (!lastActive) {
        user.stats.currentStreak = 1;
        user.stats.longestStreak = 1;
      } else {
        const diffTime = today.getTime() - lastActive.getTime();
        const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 1) {
          user.stats.currentStreak += 1;
          if (user.stats.currentStreak > user.stats.longestStreak) {
            user.stats.longestStreak = user.stats.currentStreak;
          }
        } else if (diffDays > 1) {
          user.stats.currentStreak = 1;
        }
      }
      user.stats.lastActiveDate = new Date();

      if (finalVerdict === 'AC') {
        user.stats.acceptedSubmissions += 1;

        if (!user.solvedProblems.includes(problemId)) {
          user.solvedProblems.push(problemId);
          user.stats.solvedCount += 1;

          if (problem.difficulty === 'Easy') {
            user.stats.easySolved += 1;
            user.stats.score += 10;
          } else if (problem.difficulty === 'Medium') {
            user.stats.mediumSolved += 1;
            user.stats.score += 30;
          } else if (problem.difficulty === 'Hard') {
            user.stats.hardSolved += 1;
            user.stats.score += 50;
          }
        }
      }

      await user.save();
    } catch (error) {
      console.error(`Error processing submission ${submissionId}:`, error);
      await Submission.findByIdAndUpdate(submissionId, { verdict: 'RE', aiReport: `System Error: ${error.message}` }).catch(console.error);
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
