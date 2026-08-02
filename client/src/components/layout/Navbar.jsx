import { Link } from 'react-router-dom';
import { useAuth } from '../../features/auth/hooks/useAuth';

export const Navbar = () => {
  /* useAuth hook to access authentication state and functions */
  const { isAuthenticated, user, logout } = useAuth();
  const isAdmin = user?.role === 'admin';

  return (
    <nav className='bg-slate-900 border-b border-slate-800 text-slate-50 h-16'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between'>
        {/* Logo & Main Navigation */}
        <div className='flex items-center gap-8'>
          <Link to='/' className='text-xl font-bold text-blue-500 tracking-tight'>
            VerdictIO
          </Link>

          <div className='hidden md:flex gap-4 items-center'>
            {/* Show Problems link to all or authenticated users */}
            {isAuthenticated && (
              <>
                <Link to='/problems' className='text-slate-400 hover:text-slate-50 transition-colors'>
                  Problems
                </Link>

                <Link to='/leaderboard' className='text-slate-400 hover:text-slate-50 transition-colors'>
                  Leaderboard
                </Link>

                {/* Dynamically shown option for Admin users */}
                {isAdmin && (
                  <Link
                    to='/admin/problems/new'
                    className='text-sm bg-blue-500/10 text-blue-400 border border-blue-500/30 hover:bg-blue-500/20 px-3 py-1.5 rounded-md transition-colors font-medium'
                  >
                    + Add Problem
                  </Link>
                )}
              </>
            )}
          </div>
        </div>

        {/* User Authentication Section */}
        <div className='flex items-center gap-4'>
          {isAuthenticated ? (
            <>
              <span className='text-sm text-slate-400 hidden sm:block'>
                Welcome, <span className='text-slate-50 font-medium'>{user?.fullName}</span>
              </span>
              <button onClick={logout} className='text-sm text-slate-400 hover:text-red-500 transition-colors px-3 py-2'>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to='/login' className='text-sm text-slate-400 hover:text-slate-50 transition-colors font-medium'>
                Log in
              </Link>
              <Link to='/register' className='text-sm bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-md font-medium transition-colors'>
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};
