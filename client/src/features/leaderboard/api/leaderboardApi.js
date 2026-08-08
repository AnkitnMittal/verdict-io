import axiosInstance from '../../../api/axiosInstance';

export const leaderboardApi = {
  getLeaderboard: async (page = 1, limit = 50) => {
    const response = await axiosInstance.get(`/leaderboard?page=${page}&limit=${limit}`);
    return response.data;
  },
};
