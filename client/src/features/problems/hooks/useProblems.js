import { useState, useEffect } from 'react';
import { problemsApi } from '../api/problemsApi';

/**
 * Custom hook to fetch problems with optional filters.
 * @param {Object} filters - Optional filters for fetching problems.
 */
export const useProblems = (filters = {}) => {
  const [data, setData] = useState([
    { problems: [], totalPages: 1, currentPage: 1, totalProblems: 0 },
  ]);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProblems = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await problemsApi.getProblems(filters);
        setData(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch problems');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProblems();
  }, [filters.page, filters.difficulty, filters.topic, filters.search]);

  return { ...data, isLoading, error };
};
