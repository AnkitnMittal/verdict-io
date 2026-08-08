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
          <Link className='text-xl font-bold text-blue-500 tracking-tight' to='/'>
            VerdictIO
          </Link>

          <div className='hidden md:flex gap-4 items-center'>
            {/* Show Problems link to all or authenticated users */}
            {isAuthenticated && (
              <>
                <Link className='text-slate-400 hover:text-slate-50 transition-colors' to='/problems'>
                  Problems
                </Link>

                {/* Dynamically shown option for Admin users */}
                {isAdmin && (
                  <Link
                    className='text-sm bg-blue-500/10 text-blue-400 border border-blue-500/30 hover:bg-blue-500/20 px-3 py-1.5 rounded-md transition-colors font-medium'
                    to='/admin/problems/new'
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
            <div className='flex items-center gap-3'>
              {/* Profile Link */}
              <Link
                className='flex items-center gap-2.5 bg-slate-800 border border-slate-700 hover:bg-slate-700 hover:border-slate-600 cursor-pointer transition-all rounded-full py-1 pl-1 pr-4 shadow-sm'
                to={`/profile/${user?.username}`}
              >
                <div className='w-8 h-8 rounded-full bg-blue-600 text-white font-semibold text-sm flex items-center justify-center border border-blue-400'>
                  {user?.username ? user.username.charAt(0).toUpperCase() : 'U'}
                </div>

                <span className='text-sm font-medium text-slate-100 hidden sm:block'>{user?.username}</span>
              </Link>

              <button
                onClick={logout}
                className='text-sm text-slate-300 hover:text-red-400 hover:bg-slate-800 border border-transparent hover:border-red-500/30 px-3 py-1.5 rounded-lg transition-all font-medium'
              >
                Logout
              </button>
            </div>
          ) : (
            <>
              <Link className='text-sm text-slate-400 hover:text-slate-50 transition-colors font-medium' to='/login'>
                Log in
              </Link>
              <Link className='text-sm bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-md font-medium transition-colors' to='/register'>
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};
