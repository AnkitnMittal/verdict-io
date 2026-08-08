export const RankingsTable = ({ leaderboard, loading, error }) => {
  if (loading) {
    return (
      <div className='flex justify-center items-center h-64'>
        <div className='animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500'></div>
      </div>
    );
  }

  if (error) {
    return <div className='text-center p-8 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl'>{error}</div>;
  }

  const getRankBadgeStyle = (rank) => {
    if (rank === 1) return 'bg-amber-500/20 text-amber-400 border border-amber-500/30';
    if (rank === 2) return 'bg-slate-300/20 text-slate-300 border border-slate-300/30';
    if (rank === 3) return 'bg-amber-700/20 text-amber-600 border border-amber-700/30';
    return 'text-slate-400 bg-slate-800/50 border border-slate-700/50';
  };

  return (
    <div className='bg-slate-900 border border-slate-800 shadow-xl rounded-2xl overflow-hidden'>
      <div className='overflow-x-auto'>
        <table className='min-w-full text-left border-collapse'>
          <thead>
            <tr className='border-b border-slate-800 bg-slate-950/60 text-slate-400 text-xs uppercase tracking-wider font-semibold'>
              <th className='py-4 px-6 '>Rank</th>
              <th className='py-4 px-6'>User</th>
              <th className='py-4 px-6 text-center'>Score</th>
              <th className='py-4 px-6 text-center'>Solved</th>
              <th className='py-4 px-6 text-center'>Streak</th>
            </tr>
          </thead>
          <tbody className='divide-y divide-slate-800/60 text-slate-200 text-sm'>
            {leaderboard.map((user, index) => {
              const rank = index + 1;
              const initial = user.username ? user.username.charAt(0).toUpperCase() : 'U';

              return (
                <tr key={user._id} className='hover:bg-slate-800/40 transition-colors group'>
                  <td className='py-4 px-6 whitespace-nowrap'>
                    <span className={`inline-flex items-center justify-center w-8 h-8 rounded-lg font-bold text-xs ${getRankBadgeStyle(rank)}`}>
                      {rank === 1 ? '1' : rank === 2 ? '2' : rank === 3 ? '3' : `#${rank}`}
                    </span>
                  </td>
                  <td className='py-4 px-6 whitespace-nowrap'>
                    <div className='flex items-center gap-3'>
                      <div className='w-9 h-9 rounded-full bg-blue-600/20 border border-blue-500/30 text-blue-400 font-semibold text-sm flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all'>
                        {initial}
                      </div>
                      <span className='font-semibold text-slate-100 group-hover:text-blue-400 transition-colors'>{user.username}</span>
                    </div>
                  </td>
                  <td className='py-4 px-6 whitespace-nowrap font-bold text-blue-400 text-center'>{user.stats?.score || 0}</td>
                  <td className='py-4 px-6 whitespace-nowrap text-slate-300 font-medium text-center'>{user.stats?.solvedCount || 0}</td>
                  <td className='py-4 px-6 whitespace-nowrap font-medium text-center'>
                    <div className='inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs'>
                      <span>{user.stats?.currentStreak || 0} days</span>
                    </div>
                  </td>
                </tr>
              );
            })}

            {leaderboard.length === 0 && (
              <tr>
                <td colSpan='5' className='py-12 text-center text-slate-500'>
                  No participants found on the leaderboard yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
