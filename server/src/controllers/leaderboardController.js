import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { User } from '../models/User.js';

export const getLeaderboard = asyncHandler(async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;

    const leaderboard = await User.find({ role: { $ne: 'admin' } }, 'username stats.score stats.solvedCount stats.currentStreak')
      .sort({ 'stats.score': -1, 'stats.solvedCount': -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const totalUsers = await User.countDocuments({ role: { $ne: 'admin' } });

    res.status(200).json(
      new ApiResponse(
        200,
        {
          success: true,
          data: leaderboard,
          meta: {
            total: totalUsers,
            page: page,
            pages: Math.ceil(totalUsers / limit),
          },
        },
        'Leaderboard fetched successfully',
      ),
    );
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json(new ApiError(500, 'Internal Server Error', 'An error occurred while fetching the leaderboard'));
  }
});
