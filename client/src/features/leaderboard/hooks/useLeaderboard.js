import { useState, useEffect } from 'react';
import { leaderboardApi } from '../api/leaderboardApi';

export const useLeaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [meta, setMeta] = useState({ total: 0, page: 1, pages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const response = await leaderboardApi.getLeaderboard();
        const responseData = response.data;

        setLeaderboard(responseData.data || []);
        setMeta(responseData.meta || { total: 0, page: 1, pages: 1 });
      } catch (error) {
        setError(`Error fetching leaderboard data: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return { leaderboard, meta, loading, error };
};
