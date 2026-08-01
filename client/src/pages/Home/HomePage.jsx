import { Link } from 'react-router-dom';

export const HomePage = () => {
  return (
    <div className='min-h-[calc(100vh-4rem)] bg-slate-900 flex flex-col items-center justify-center text-center px-4'>
      <h1 className='text-5xl md:text-6xl font-extrabold text-slate-50 tracking-tight mb-6'>
        Master Algorithms with <span className='text-blue-500'>VerdictIO</span>
      </h1>
      <p className='text-lg text-slate-400 max-w-2xl mb-10'>
        The ultimate sandboxed code execution engine. Solve complex programming challenges, get real-time evaluations, and leverage AI coaching to elevate your
        skills.
      </p>

      <div className='flex gap-4'>
        <Link to='/problems' className='bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-8 rounded-md transition-colors text-lg'>
          Start Coding
        </Link>
      </div>
    </div>
  );
};
