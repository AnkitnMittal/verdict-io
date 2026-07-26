import { useSelector, useDispatch } from 'react-redux';
import { authApi } from '../api/authApi';
import { setAuth, clearAuth } from '../authSlice';

/**
 * Custom hook for handling authentication logic
 * Provides functions for login, registration, and logout,
 * as well as access to the current authentication state.
 */
export const useAuth = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated, isLoading, isInitialized, error } = useSelector(
    (state) => state.auth,
  );

  const login = async (credentials) => {
    const res = await authApi.login(credentials);
    dispatch(setAuth(res.data.user));
    return res;
  };

  const register = async (userData) => {
    const res = await authApi.register(userData);
    return res;
  };

  const logout = async () => {
    await authApi.logout();
    dispatch(clearAuth());
  };

  return { user, isAuthenticated, isLoading, isInitialized, error, login, register, logout };
};
