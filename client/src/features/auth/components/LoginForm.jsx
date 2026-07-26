import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export const LoginForm = () => {
  /* useLocation hook to access the state passed from the RegisterPage */
  const location = useLocation();
  const defaultEmail = location.state?.email || '';

  /* State variables for email, password, and error message */
  const [email, setEmail] = useState(defaultEmail);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  /* useAuth hook to access the login function & useNavigate hook for navigation after successful login */
  const { login } = useAuth();
  const navigate = useNavigate();

  /* Handle form submission for login */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      await login({ email, password });
      navigate('/problems');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className='space-y-6'>
      {/* Error message display */}
      {error && (
        <div className='p-3 bg-red-500/10 border border-red-500 rounded text-red-500 text-sm'>
          {error}
        </div>
      )}

      {/* Email input field */}
      <div>
        <label className='block text-slate-400 text-sm font-medium mb-2'>Email Address</label>
        <input
          type='email'
          required
          className='w-full bg-slate-900 border border-slate-700 rounded-md px-4 py-2 text-slate-50 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors'
          value={email}
          placeholder='you@example.com'
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      {/* Password input field */}
      <div>
        <label className='block text-slate-400 text-sm font-medium mb-2'>Password</label>
        <input
          type='password'
          required
          className='w-full bg-slate-900 border border-slate-700 rounded-md px-4 py-2 text-slate-50 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      {/* Submit button */}
      <button
        type='submit'
        className='w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2.5 rounded-md transition-colors'
      >
        Sign In
      </button>
    </form>
  );
};
