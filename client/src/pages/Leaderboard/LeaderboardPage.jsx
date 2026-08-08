import { useLeaderboard } from '../../features/leaderboard/hooks/useLeaderboard';
import { RankingsTable } from '../../features/leaderboard/components/RankingsTable';

export const LeaderboardPage = () => {
  const { leaderboard, loading, error } = useLeaderboard();

  return (
    <div className='max-w-5xl mx-auto p-4 sm:p-6 lg:p-8'>
      <div className='mb-8'>
        <div className='flex items-center gap-3 mb-2'>
          <h1 className='text-3xl font-extrabold text-slate-100 tracking-tight'>Global Leaderboard</h1>
        </div>
        <p className='text-slate-400 text-sm'>See how you rank against top developers and competitive programmers worldwide.</p>
      </div>

      <RankingsTable leaderboard={leaderboard} loading={loading} error={error} />
    </div>
  );
};
