import { Link } from 'react-router-dom';
import { DifficultyBadge } from '../../../components/ui/DifficultyBadge';

export const ProblemList = ({ problems, isLoading, error }) => {
  if (isLoading) {
    return (
      <div className='flex justify-center items-center h-48'>
        <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500'></div>
      </div>
    );
  }

  if (error) {
    return <div className='text-red-500 text-center py-8'>{error}</div>;
  }

  if (!problems || problems.length === 0) {
    return <div className='text-slate-400 text-center py-8'>No problems found matching your criteria.</div>;
  }

  return (
    <div className='overflow-x-auto rounded-lg border border-slate-700 bg-slate-800/50'>
      <table className='w-full text-left border-collapse'>
        <thead>
          <tr className='bg-slate-800 border-b border-slate-700 text-slate-400 text-sm'>
            <th className='p-4 font-medium'>Title</th>
            <th className='p-4 font-medium w-32'>Difficulty</th>
            <th className='p-4 font-medium hidden md:table-cell'>Topics</th>
            <th className='p-4 font-medium w-24 text-right'>Action</th>
          </tr>
        </thead>

        <tbody className='divide-y divide-slate-700'>
          {problems.map((problem) => (
            <tr key={problem._id} className='hover:bg-slate-700/50 transition-colors group'>
              <td className='p-4'>
                <Link to={`/problems/${problem.problemId}`} className='text-slate-200 font-medium group-hover:text-blue-400 transition-colors'>
                  {problem.title}
                </Link>
              </td>
              <td className='p-4'>
                <DifficultyBadge difficulty={problem.difficulty} />
              </td>
              <td className='p-4 hidden md:table-cell'>
                <div className='flex gap-2 flex-wrap'>
                  {(problem.topics ?? []).slice(0, 3).map((topic) => (
                    <span key={topic} className='text-xs bg-slate-700 text-slate-300 px-2 py-1 rounded'>
                      {topic}
                    </span>
                  ))}
                  {problem.topics?.length > 3 && <span className='text-xs bg-slate-700 text-slate-300 px-2 py-1 rounded'>+{problem.topics.length - 3}</span>}
                </div>
              </td>
              <td className='p-4 text-right'>
                <Link to={`/problems/${problem.problemId}`} className='text-blue-500 hover:text-blue-400 text-sm font-medium'>
                  Solve
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
