import { useState, useEffect } from 'react';
import { problemsApi } from '../api/problemsApi';

/**
 * Custom hook to fetch details of a single problem by its ID.
 * @param {string} problemId - The ID of the problem to fetch.
 */
export const useProblemDetail = (problemId) => {
  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!problemId) return;

    const fetchProblemDetail = async () => {
      try {
        setLoading(true);
        const response = await problemsApi.getProblemById(problemId);
        setProblem(response.data.problem);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch problem details:', err);
        setError(err.response?.data?.message || 'Failed to load problem.');
      } finally {
        setLoading(false);
      }
    };

    fetchProblemDetail();
  }, [problemId]);

  /* Returns the skeleton code for a specific programming language */
  const getSkeletonCode = (targetLanguage = 'cpp') => {
    if (!problem || !problem.skeletonCode || problem.skeletonCode.length === 0) {
      return '';
    }

    const found = problem.skeletonCode.find((item) => item.language.toLowerCase() === targetLanguage.toLowerCase());
    return found ? found.code : '';
  };

  return {
    title: problem?.title || '',
    statement: problem?.statement || '',
    difficulty: problem?.difficulty || 'Easy',
    timeLimit: problem?.timeLimit || 2,
    memoryLimit: problem?.memoryLimit || 256,
    getSkeletonCode,
    loading,
    error,
  };
};
