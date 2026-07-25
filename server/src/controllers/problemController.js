import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { Problem } from '../models/Problem.js';
import { TestCase } from '../models/TestCase.js';

/**
 * @desc    Get all problems with pagination, filtering, and search
 * @route   GET /api/problems
 * @access  Public
 */
export const getProblems = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, difficulty, topic, search } = req.query;

  const query = {};
  if (difficulty) query.difficulty = difficulty;
  if (topic) query.topics = topic;
  if (search) query.title = { $regex: search, $options: 'i' };

  const pageNumber = Number(page);
  const limitNumber = Number(limit);

  const problems = await Problem.find(query)
    .select('-statement -skeletonCode')
    .limit(limitNumber)
    .skip((pageNumber - 1) * limitNumber)
    .sort({ createdAt: -1 });

  const total = await Problem.countDocuments(query);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        problems,
        totalPages: Math.ceil(total / limitNumber),
        currentPage: pageNumber,
        totalProblems: total,
      },
      'Problems fetched successfully',
    ),
  );
});

/**
 * @desc    Get a single problem by ID
 * @route   GET /api/problems/:problemId
 * @access  Public
 */
export const getProblemById = asyncHandler(async (req, res) => {
  const { problemId } = req.params;
  const problem = await Problem.findOne({ problemId });

  if (!problem) {
    throw new ApiError(404, 'Problem not found');
  }

  const sampleTestCases = await TestCase.find({
    problemId: problem._id,
    isHidden: false,
  }).select('input expectedOutput -_id');

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        problem,
        sampleTestCases,
      },
      'Problem details fetched successfully',
    ),
  );
});

/**
 * @desc    Create a new problem
 * @route   POST /api/problems
 * @access  Private (Admin)
 */
export const createProblem = asyncHandler(async (req, res) => {
  const {
    problemId,
    title,
    statement,
    difficulty,
    topics,
    timeLimit,
    memoryLimit,
    skeletonCode,
    testCases,
  } = req.body;

  if (!problemId || !title || !statement || !difficulty) {
    throw new ApiError(400, 'Missing required fields');
  }

  const existingProblem = await Problem.findOne({ problemId: problemId.toLowerCase() });
  if (existingProblem) {
    throw new ApiError(400, 'Problem with this ID already exists');
  }

  const problem = await Problem.create({
    problemId: problemId.toLowerCase(),
    title,
    statement,
    difficulty,
    topics,
    timeLimit,
    memoryLimit,
    skeletonCode,
  });

  if (testCases && testCases.length > 0) {
    const testCaseDocs = testCases.map((tc) => ({
      ...tc,
      problemId: problem._id,
    }));
    await TestCase.insertMany(testCaseDocs);
  }

  return res
    .status(201)
    .json(new ApiResponse(201, problem, 'Problem and test cases created successfully'));
});
