import { useMemo } from 'react';

export const SubmissionHeatmap = ({ heatmapData = [] }) => {
  const { days, totalSubmissionsYear } = useMemo(() => {
    const dataMap = new Map(heatmapData.map((item) => [item.date, item.count]));
    const daysArr = [];
    const today = new Date();
    let totalCount = 0;

    for (let i = 364; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const count = dataMap.get(dateStr) || 0;
      totalCount += count;
      daysArr.push({ date: dateStr, count });
    }
    return { days: daysArr, totalSubmissionsYear: totalCount };
  }, [heatmapData]);

  const getIntensityColor = (count) => {
    if (count === 0) return 'bg-slate-800/40 border-slate-800/60';
    if (count <= 2) return 'bg-emerald-950/80 border-emerald-800/60';
    if (count <= 5) return 'bg-emerald-700 border-emerald-600';
    if (count <= 8) return 'bg-emerald-500 border-emerald-400';
    return 'bg-emerald-400 border-emerald-300';
  };

  return (
    <div className='bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl space-y-4'>
      <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-2'>
        <h3 className='text-lg font-semibold text-slate-100'>
          {totalSubmissionsYear} <span className='text-sm font-normal text-slate-400'>submissions in the last year</span>
        </h3>
        <div className='flex items-center gap-2 text-xs text-slate-400'>
          <span>Less</span>
          <div className='flex gap-1'>
            <span className='w-3 h-3 rounded-sm bg-slate-800/40 border border-slate-800/60' />
            <span className='w-3 h-3 rounded-sm bg-emerald-950/80 border border-emerald-800/60' />
            <span className='w-3 h-3 rounded-sm bg-emerald-700 border border-emerald-600' />
            <span className='w-3 h-3 rounded-sm bg-emerald-500 border border-emerald-400' />
            <span className='w-3 h-3 rounded-sm bg-emerald-400 border border-emerald-300' />
          </div>
          <span>More</span>
        </div>
      </div>

      <div className='overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-700'>
        <div className='grid grid-rows-7 grid-flow-col gap-1.5 min-w-180'>
          {days.map((day) => (
            <div
              key={day.date}
              title={`${day.count} submission(s) on ${day.date}`}
              className={`w-3.5 h-3.5 rounded-sm border transition-colors cursor-pointer hover:ring-1 hover:ring-slate-300 ${getIntensityColor(day.count)}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
