import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

/**
 * ProtectedRoute component to restrict access to certain routes
 * based on user authentication and roles.
 */
export const ProtectedRoute = ({ allowedRoles = [] }) => {
  const { isAuthenticated, isInitialized, user } = useAuth();

  if (!isInitialized) {
    return (
      <div className='min-h-screen bg-slate-900 flex items-center justify-center'>
        <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500'></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to='/login' replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    return <Navigate to='/problems' replace />;
  }

  return <Outlet />;
};
