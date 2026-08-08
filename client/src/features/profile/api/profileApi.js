import axiosInstance from '../../../api/axiosInstance';

/* API functions for managing user profiles */
export const profileApi = {
  getProfile: async (username) => {
    const response = await axiosInstance.get(`/profile/${username}`);
    return response.data;
  },
};
