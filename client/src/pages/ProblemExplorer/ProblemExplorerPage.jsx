import { useState } from 'react';
import { useProblems } from '../../features/problems/hooks/useProblems';
import { ProblemList } from '../../features/problems/components/ProblemList';

export const ProblemExplorerPage = () => {
  const [filters, setFilters] = useState({
    page: 1,
    difficulty: '',
    search: '',
  });

  const { problems, totalPages, isLoading, error } = useProblems(filters);

  const handleSearchChange = (e) => {
    setFilters((prev) => ({ ...prev, search: e.target.value, page: 1 }));
  };

  const handleDifficultyChange = (e) => {
    setFilters((prev) => ({ ...prev, difficulty: e.target.value, page: 1 }));
  };

  return (
    <div className='max-w-6xl mx-auto px-4 py-8'>
      <div className='mb-8'>
        <h1 className='text-3xl font-bold text-slate-50 tracking-tight'>Problem Explorer</h1>
        <p className='text-slate-400 mt-2'>
          Browse and solve algorithmic challenges to improve your skills.
        </p>
      </div>

      {/* Filter Controls */}
      <div className='flex flex-col md:flex-row gap-4 mb-6'>
        <input
          type='text'
          placeholder='Search problems...'
          value={filters.search}
          onChange={handleSearchChange}
          className='flex-1 bg-slate-900 border border-slate-700 rounded-md px-4 py-2 text-slate-50 focus:outline-none focus:border-blue-500'
        />
        <select
          value={filters.difficulty}
          onChange={handleDifficultyChange}
          className='bg-slate-900 border border-slate-700 rounded-md px-4 py-2 text-slate-50 focus:outline-none focus:border-blue-500'
        >
          <option value=''>All Difficulties</option>
          <option value='Easy'>Easy</option>
          <option value='Medium'>Medium</option>
          <option value='Hard'>Hard</option>
        </select>
      </div>

      <ProblemList problems={problems} isLoading={isLoading} error={error} />

      {/* Pagination */}
      {!isLoading && totalPages > 1 && (
        <div className='flex justify-center items-center gap-4 mt-8'>
          <button
            disabled={filters.page === 1}
            onClick={() => setFilters((prev) => ({ ...prev, page: prev.page - 1 }))}
            className='px-4 py-2 bg-slate-800 text-slate-300 rounded-md hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
          >
            Previous
          </button>
          <span className='text-slate-400 text-sm'>
            Page {filters.page} of {totalPages}
          </span>
          <button
            disabled={filters.page === totalPages}
            onClick={() => setFilters((prev) => ({ ...prev, page: prev.page + 1 }))}
            className='px-4 py-2 bg-slate-800 text-slate-300 rounded-md hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};
