import { useState, useEffect } from 'react';
import { profileApi } from '../api/profileApi';

export const useProfileStats = (username) => {
  const [profileData, setProfileData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const loadProfile = async () => {
      if (!username) return;
      try {
        setIsLoading(true);
        setError(null);
        const data = await profileApi.getProfile(username);

        if (isMounted) setProfileData(data.data);
      } catch (error) {
        if (isMounted) setError(error.message);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    loadProfile();
    return () => (isMounted = false);
  }, [username]);

  return { profileData, isLoading, error };
};
