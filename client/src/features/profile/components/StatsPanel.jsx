const DifficultyBar = ({ label, solved, total, colorClass, textClass }) => {
  const percentage = total > 0 ? Math.round((solved / total) * 100) : 0;

  return (
    <div className='space-y-1.5'>
      <div className='flex justify-between items-center text-sm'>
        <span className='font-medium text-slate-300'>{label}</span>
        <span className='text-xs text-slate-400 font-mono'>
          <strong className={`font-semibold ${textClass}`}>{solved}</strong> / {total}
        </span>
      </div>
      <div className='w-full bg-slate-800/80 rounded-full h-2 overflow-hidden'>
        <div className={`h-full rounded-full ${colorClass} transition-all duration-700 ease-out`} style={{ width: `${percentage}%` }} />
      </div>
    </div>
  );
};

export const StatsPanel = ({ stats }) => {
  const { easy, medium, hard } = stats.difficultyBreakdown;
  const acceptanceRate = stats.totalSubmissions > 0 ? ((stats.acceptedSubmissions / stats.totalSubmissions) * 100).toFixed(1) : '0.0';

  return (
    <div className='bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl space-y-6'>
      <div className='flex items-center justify-between border-b border-slate-800/80 pb-4'>
        <h3 className='text-lg font-semibold text-slate-100'>Performance Stats</h3>
        <span className='text-xs font-mono font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-1 rounded-full'>
          {stats.score} PTS
        </span>
      </div>

      <div className='flex items-center gap-6 p-4 rounded-lg bg-slate-950/50 border border-slate-800/50'>
        <div className='relative flex items-center justify-center w-24 h-24 rounded-full border-4 border-emerald-500/20 bg-emerald-500/5 shrink-0'>
          <div className='text-center'>
            <span className='block text-2xl font-extrabold text-emerald-400 leading-none'>{stats.solvedCount}</span>
            <span className='text-[10px] uppercase tracking-wider font-semibold text-slate-400 mt-1 block'>Solved</span>
          </div>
        </div>

        <div className='space-y-2 flex-1'>
          <div>
            <span className='text-xs text-slate-400 block'>Acceptance Rate</span>
            <span className='text-lg font-bold text-slate-200'>{acceptanceRate}%</span>
          </div>
          <div className='flex items-center gap-4 text-xs text-slate-400 border-t border-slate-800/60 pt-2'>
            <div>
              <span className='block text-slate-500 text-[10px]'>CURRENT STREAK</span>
              <span className='font-semibold text-amber-400'>🔥 {stats.streak.current} Days</span>
            </div>
            <div>
              <span className='block text-slate-500 text-[10px]'>BEST STREAK</span>
              <span className='font-semibold text-slate-200'>⚡ {stats.streak.longest} Days</span>
            </div>
          </div>
        </div>
      </div>

      <div className='space-y-4 pt-2'>
        <h4 className='text-xs uppercase tracking-wider font-semibold text-slate-400'>Difficulty Breakdown</h4>
        <DifficultyBar label='Easy' solved={easy.solved} total={easy.total} colorClass='bg-emerald-500' textClass='text-emerald-400' />
        <DifficultyBar label='Medium' solved={medium.solved} total={medium.total} colorClass='bg-amber-500' textClass='text-amber-400' />
        <DifficultyBar label='Hard' solved={hard.solved} total={hard.total} colorClass='bg-rose-500' textClass='text-rose-400' />
      </div>
    </div>
  );
};
