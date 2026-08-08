import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';

import { User } from '../models/User.js';
import { Submission } from '../models/Submission.js';
import { Problem } from '../models/Problem.js';

/**
 * @desc    Get user profile by username
 * @route   GET /api/users/:username
 * @access  Public
 */
export const getUserProfile = asyncHandler(async (req, res) => {
  try {
    const { username } = req.params;

    const user = await User.findOne({ username }).select('-password -refreshToken');
    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

    const [totalEasy, totalMedium, totalHard, heatmapAggregation] = await Promise.all([
      Problem.countDocuments({ difficulty: 'Easy' }),
      Problem.countDocuments({ difficulty: 'Medium' }),
      Problem.countDocuments({ difficulty: 'Hard' }),
      Submission.aggregate([
        {
          $match: {
            userId: user._id,
            submittedAt: { $gte: oneYearAgo },
          },
        },
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m-%d', date: '$submittedAt' } },
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]),
    ]);

    const formattedHeatmap = heatmapAggregation.map((item) => ({
      date: item._id,
      count: item.count,
    }));

    return res.status(200).json(
      new ApiResponse(200, {
        user: {
          id: user._id,
          username: user.username,
          role: user.role,
          joinedAt: user.createdAt,
        },
        stats: {
          score: user.stats.score || 0,
          solvedCount: user.stats.solvedCount || 0,
          totalSubmissions: user.stats.totalSubmissions || 0,
          acceptedSubmissions: user.stats.acceptedSubmissions || 0,
          streak: {
            current: user.stats.currentStreak || 0,
            longest: user.stats.longestStreak || 0,
          },
          difficultyBreakdown: {
            easy: {
              solved: user.stats.easySolved || 0,
              total: totalEasy,
            },
            medium: {
              solved: user.stats.mediumSolved || 0,
              total: totalMedium,
            },
            hard: {
              solved: user.stats.hardSolved || 0,
              total: totalHard,
            },
          },
        },
        heatmap: formattedHeatmap,
      }),
      'User profile fetched successfully',
    );
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw new ApiError(500, 'Internal Server Error while fetching user profile');
  }
});
