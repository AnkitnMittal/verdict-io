import { useMemo } from 'react';

export const ActivityChart = ({ heatmapData = [] }) => {
  const recentDays = useMemo(() => {
    const dataMap = new Map(heatmapData.map((item) => [item.date, item.count]));
    const daysArr = [];
    const today = new Date();

    let maxCount = 1;

    for (let i = 13; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const count = dataMap.get(dateStr) || 0;

      if (count > maxCount) maxCount = count;

      daysArr.push({
        date: dateStr,
        label: d.toLocaleDateString('en-US', { weekday: 'short' }),
        count,
      });
    }

    return { daysArr, maxCount };
  }, [heatmapData]);

  return (
    <div className='bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl space-y-6 h-full'>
      <h3 className='text-lg font-semibold text-slate-100'>Recent Activity (14 Days)</h3>

      <div className='flex items-end justify-between h-40 gap-2 mt-4'>
        {recentDays.daysArr.map((day, index) => {
          const heightPercent = (day.count / recentDays.maxCount) * 100;
          return (
            <div key={day.date} className='flex flex-col items-center flex-1 gap-2 group'>
              <div className='relative w-full flex justify-center h-full items-end'>
                {/* Tooltip */}
                <div className='absolute -top-8 bg-slate-800 text-slate-200 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10'>
                  {day.count} subs
                </div>
                {/* Bar */}
                <div
                  className='w-full max-w-6 bg-emerald-500/80 hover:bg-emerald-400 rounded-t-sm transition-all duration-500'
                  style={{ height: `${Math.max(heightPercent, 2)}%` }}
                />
              </div>
              <span className='text-[10px] text-slate-500 group-hover:text-slate-300'>{index % 2 === 0 ? day.label : ''}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
