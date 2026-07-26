import { ProblemForm } from '../../features/admin/components/ProblemForm';

/* Page for managing algorithmic problems */
export const ProblemManagerPage = () => {
  return (
    <div className='max-w-4xl mx-auto px-4 py-8'>
      <div className='mb-8'>
        <h1 className='text-3xl font-bold text-slate-50 tracking-tight'>Problem Management</h1>
        <p className='text-slate-400 mt-2'>
          Create new algorithmic challenges and configure their evaluation constraints.
        </p>
      </div>

      <ProblemForm />
    </div>
  );
};
