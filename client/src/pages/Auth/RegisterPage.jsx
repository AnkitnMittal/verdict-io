import { Link } from 'react-router-dom';
import { RegisterForm } from '../../features/auth/components/RegisterForm';

export const RegisterPage = () => {
  return (
    <div className='min-h-[calc(100vh-4rem)] flex items-center justify-center bg-slate-900 px-4'>
      <div className='w-full max-w-md bg-slate-800 rounded-lg shadow-xl p-8 border border-slate-700'>
        {/* Page Title */}
        <div className='mb-8 text-center'>
          <h2 className='text-2xl font-bold text-slate-50'>Create an account</h2>
          <p className='text-slate-400 mt-2 text-sm'>Enter your details to get started</p>
        </div>

        {/* Register Form */}
        <RegisterForm />

        {/* Sign up link */}
        <div className='mt-6 text-center text-sm text-slate-400'>
          Already have an account?{' '}
          <Link to='/login' className='text-blue-500 hover:text-blue-400 font-medium'>
            Sign in here
          </Link>
        </div>
      </div>
    </div>
  );
};
