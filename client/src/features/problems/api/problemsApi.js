import axiosInstance from '../../../api/axiosInstance';

/* API functions for managing problems */
export const problemsApi = {
  getProblems: async (params) => {
    const response = await axiosInstance.get('/problems', { params });
    return response.data;
  },
  getProblemById: async (problemId) => {
    const response = await axiosInstance.get(`/problems/${problemId}`);
    return response.data;
  },
};
