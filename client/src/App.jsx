import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Navbar } from './components/layout/Navbar';
import { fetchCurrentUser } from './features/auth/authSlice';

function App() {
  const dispatch = useDispatch();

  /**
   * Fetch the current user on initial app load to check if the user is authenticated.
   * Relies on httpOnly cookie present from previous session
   */
  useEffect(() => {
    dispatch(fetchCurrentUser());
  }, [dispatch]);

  return (
    <div className='min-h-screen bg-slate-900 text-slate-50 font-sans selection:bg-blue-500/30'>
      <Navbar />
      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default App;
