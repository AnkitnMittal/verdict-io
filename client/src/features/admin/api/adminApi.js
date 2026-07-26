import axiosInstance from '../../../api/axiosInstance';

/* Admin API functions */
export const adminApi = {
  createProblem: async (problemData) => {
    const response = await axiosInstance.post('/problems', problemData);
    return response.data;
  },
  /* Future methods: updateProblem, deleteProblem, etc. */
};
