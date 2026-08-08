import { useParams } from 'react-router-dom';
import { useProfileStats } from '../../features/profile/hooks/useProfileStats';
import { StatsPanel } from '../../features/profile/components/StatsPanel';
import { SubmissionHeatmap } from '../../features/profile/components/SubmissionHeatmap';
import { ActivityChart } from '../../features/profile/components/ActivityChart';

export const ProfilePage = () => {
  const { username } = useParams();
  const { profileData, isLoading, error } = useProfileStats(username);

  if (isLoading) {
    return (
      <div className='min-h-[70vh] flex flex-col items-center justify-center space-y-4'>
        <div className='w-10 h-10 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin' />
        <p className='text-slate-400 text-sm font-medium animate-pulse'>Loading developer profile...</p>
      </div>
    );
  }

  if (error || !profileData || !profileData?.user) {
    return (
      <div className='max-w-lg mx-auto my-16 p-8 bg-slate-900 border border-rose-500/20 rounded-xl text-center space-y-3 shadow-2xl'>
        <div className='w-16 h-16 bg-rose-500/10 rounded-full flex items-center justify-center mx-auto mb-4'>
          <span className='text-2xl'>🔍</span>
        </div>
        <h2 className='text-xl font-bold text-slate-100'>User Not Found</h2>
        <p className='text-slate-400'>{error || 'The requested profile data is incomplete or could not be found.'}</p>
      </div>
    );
  }

  const { user, stats = {}, heatmap = [] } = profileData;

  return (
    <div className='max-w-7xl mx-auto px-4 py-8 space-y-8'>
      {/* Header Profile Card */}
      <div className='bg-slate-900 border border-slate-800 rounded-xl p-8 flex flex-col sm:flex-row items-center sm:items-start gap-6 shadow-xl relative overflow-hidden'>
        {/* Subtle background glow */}
        <div className='absolute -top-24 -right-24 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none' />

        <div className='w-24 h-24 bg-linear-to-br from-emerald-500 to-emerald-700 rounded-2xl flex items-center justify-center text-4xl font-extrabold text-white uppercase shadow-lg shadow-emerald-900/40 shrink-0 z-10'>
          {user.username.slice(0, 2)}
        </div>
        <div className='text-center sm:text-left space-y-2 flex-1 z-10'>
          <div className='flex flex-col sm:flex-row sm:items-center gap-3'>
            <h1 className='text-3xl font-bold text-slate-100 tracking-tight'>{user.username}</h1>
            <span className='inline-block px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-md bg-slate-800 text-emerald-400 border border-slate-700/50 self-center sm:self-auto shadow-sm'>
              {user.role}
            </span>
          </div>
          <p className='text-sm text-slate-400 font-mono'>
            Joined {new Date(user.joinedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        </div>
      </div>

      {/* Main Grid Interface */}
      <div className='grid grid-cols-1 xl:grid-cols-3 gap-8'>
        {/* Left Column: Core Stats */}
        <div className='xl:col-span-1 space-y-8'>
          <StatsPanel stats={stats} />
        </div>

        {/* Right Column: Visualizations */}
        <div className='xl:col-span-2 space-y-8'>
          <SubmissionHeatmap heatmapData={heatmap} />
          <ActivityChart heatmapData={heatmap} />
        </div>
      </div>
    </div>
  );
};
