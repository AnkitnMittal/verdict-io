import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';

import { Problem } from '../models/Problem.js';
import { Submission } from '../models/Submission.js';
import { submissionQueue } from '../queues/submissionQueue.js';

/**
 * @desc    Create a new submission and add it to the submission queue for processing.
 * @route   POST /api/submissions
 * @access  Private
 */
export const createSubmission = asyncHandler(async (req, res) => {
  const { problemId, language, code } = req.body;

  if (!problemId || !language || !code) {
    throw new ApiError(400, 'Missing required fields: problemId, language, and code are required.');
  }

  const problem = await Problem.findOne({ problemId });
  if (!problem) {
    throw new ApiError(404, 'Problem not found');
  }

  const submission = await Submission.create({
    userId: req.user._id,
    problemId: problem._id,
    language,
    code,
  });

  await submissionQueue.add('evaluate', {
    submissionId: submission._id,
    problemId: problem._id,
    language,
    code,
  });

  return res.status(201).json(new ApiResponse(201, { submissionId: submission._id }, 'Submission created successfully'));
});

/**
 * @desc    Get a submission by ID.
 * @route   GET /api/submissions/:id
 * @access  Private
 */
export const getSubmission = asyncHandler(async (req, res) => {
  const submission = await Submission.findById(req.params.id);

  if (!submission) {
    throw new ApiError(404, 'Submission not found');
  }

  /* Check if the user is the owner of the submission or an admin */
  if (submission.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    throw new ApiError(403, 'You do not have permission to view this submission');
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        verdict: submission.verdict,
        runtime: submission.runtime,
        memory: submission.memory,
        code: submission.getDecodedCode(),
      },
      'Submission retrieved successfully',
    ),
  );
});
