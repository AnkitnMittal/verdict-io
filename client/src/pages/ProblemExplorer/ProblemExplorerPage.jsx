import { useState, useEffect } from 'react';
import { Search, Filter, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useProblems } from '../../features/problems/hooks/useProblems';
import { ProblemList } from '../../features/problems/components/ProblemList';

export const ProblemExplorerPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    page: 1,
    difficulty: '',
    search: '',
  });

  const { problems, totalPages, isLoading, error } = useProblems(filters);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters((prev) => ({ ...prev, search: searchTerm, page: 1 }));
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleDifficultyChange = (e) => {
    setFilters((prev) => ({ ...prev, difficulty: e.target.value, page: 1 }));
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    setFilters((prev) => ({ ...prev, search: '', page: 1 }));
  };

  return (
    <div className='max-w-6xl mx-auto px-4 py-8 space-y-6'>
      {/* Header */}
      <div>
        <h1 className='text-3xl font-bold text-slate-50 tracking-tight'>Problem Explorer</h1>
        <p className='text-slate-400 mt-1 text-sm'>Browse and solve algorithmic challenges to improve your skills.</p>
      </div>

      {/* Filter Bar */}
      <div className='flex flex-col sm:flex-row gap-3 items-center justify-between bg-slate-900/50 p-3 rounded-xl border border-slate-800 backdrop-blur-sm'>
        {/* Search Bar */}
        <div className='relative flex-1 w-full'>
          <Search className='w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none' />
          <input
            type='text'
            placeholder='Search problems by title or topic...'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className='w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-8 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all'
          />
          {searchTerm && (
            <button onClick={handleClearSearch} className='absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 p-0.5'>
              <X className='w-3.5 h-3.5' />
            </button>
          )}
        </div>

        {/* Difficulty Dropdown with Styled Options */}
        <div className='relative w-full sm:w-48 shrink-0'>
          <Filter className='w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none z-10' />
          <select
            value={filters.difficulty}
            onChange={handleDifficultyChange}
            className='w-full appearance-none bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-8 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all cursor-pointer'
          >
            {/* Explicit option styling ensures dark dropdown options on all OS platforms */}
            <option value='' className='bg-slate-900 text-slate-200 py-1'>
              All Difficulties
            </option>
            <option value='Easy' className='bg-slate-900 text-emerald-400 py-1'>
              Easy
            </option>
            <option value='Medium' className='bg-slate-900 text-amber-400 py-1'>
              Medium
            </option>
            <option value='Hard' className='bg-slate-900 text-rose-400 py-1'>
              Hard
            </option>
          </select>
          {/* Custom Dropdown Caret Icon */}
          <div className='absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-slate-400 w-0 h-0' />
        </div>
      </div>

      {/* Main Problem List */}
      <ProblemList problems={problems} isLoading={isLoading} error={error} />

      {/* Pagination */}
      {!isLoading && totalPages > 1 && (
        <div className='flex justify-center items-center gap-3 pt-4 border-t border-slate-800/60'>
          <button
            disabled={filters.page === 1}
            onClick={() => setFilters((prev) => ({ ...prev, page: prev.page - 1 }))}
            className='px-3.5 py-2 bg-slate-900 border border-slate-800 text-slate-300 text-sm font-medium rounded-lg hover:bg-slate-800 hover:text-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-1'
          >
            <ChevronLeft className='w-4 h-4' /> Previous
          </button>

          <span className='text-slate-400 text-xs px-2 font-mono'>
            Page {filters.page} of {totalPages}
          </span>

          <button
            disabled={filters.page === totalPages}
            onClick={() => setFilters((prev) => ({ ...prev, page: prev.page + 1 }))}
            className='px-3.5 py-2 bg-slate-900 border border-slate-800 text-slate-300 text-sm font-medium rounded-lg hover:bg-slate-800 hover:text-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-1'
          >
            Next <ChevronRight className='w-4 h-4' />
          </button>
        </div>
      )}
    </div>
  );
};
