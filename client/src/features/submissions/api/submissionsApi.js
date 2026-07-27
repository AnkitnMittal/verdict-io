import axiosInstance from '../../../api/axiosInstance';

export const submissionsApi = {
  submitCode: async (payload) => {
    const response = await axiosInstance.post('/submissions', payload);
    return response.data;
  },
  getSubmission: async (id) => {
    const response = await axiosInstance.get(`/submissions/${id}`);
    return response.data;
  },
};
