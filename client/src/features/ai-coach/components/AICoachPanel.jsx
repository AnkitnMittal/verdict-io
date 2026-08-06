import { Sparkles, Bug, Lightbulb, RefreshCw, AlertTriangle } from 'lucide-react';

import MarkdownRenderer from '../../../lib/render.jsx';
import { useAiCoach } from '../hooks/useAiCoach.js';

export const AICoachPanel = ({ problemTitle, problemStatement, userCode, language, latestSubmission }) => {
  const { activeTab, setActiveTab, hintLevel, setHintLevel, hintText, debugReport, loading, error, requestHint, requestDebugReport } = useAiCoach();

  const handleGenerateHint = () => {
    requestHint({ problemTitle, problemStatement, userCode, language });
  };

  const handleGenerateDebug = () => {
    requestDebugReport({ problemTitle, problemStatement, userCode, language, submissionDetails: latestSubmission });
  };

  return (
    <div className='flex flex-col h-full bg-slate-900 text-slate-100 font-sans border-l border-slate-800 shadow-2xl overflow-hidden'>
      {/* Panel Header */}
      <div className='px-5 pt-4 pb-3 border-b border-slate-800/80 bg-slate-950/40 space-y-3 shrink-0'>
        {/* Title Block */}
        <div className='flex items-center gap-2.5 pr-10'>
          <div className='p-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400'>
            <Sparkles className='w-4 h-4' />
          </div>
          <div>
            <h3 className='font-semibold text-sm text-slate-100 leading-none'>AI Coach</h3>
            <p className='text-[11px] text-slate-400 mt-1 font-normal'>Socratic guidance & runtime diagnostic</p>
          </div>
        </div>

        {/* Tab Navigation Controls */}
        <div className='grid grid-cols-2 gap-1 p-1 bg-slate-950/80 rounded-lg border border-slate-800'>
          <button
            onClick={() => setActiveTab('hint')}
            className={`flex items-center justify-center gap-2 py-1.5 rounded-md text-xs font-medium transition-all duration-150 ${
              activeTab === 'hint' ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Lightbulb className='w-3.5 h-3.5' />
            Hints
          </button>
          <button
            onClick={() => setActiveTab('debug')}
            className={`flex items-center justify-center gap-2 py-1.5 rounded-md text-xs font-medium transition-all duration-150 ${
              activeTab === 'debug' ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Bug className='w-3.5 h-3.5' />
            Debugger
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className='flex-1 p-5 overflow-y-auto space-y-5 custom-scrollbar'>
        {error && (
          <div className='flex items-start gap-2.5 p-3.5 bg-red-950/40 border border-red-500/30 rounded-lg text-red-300 text-xs leading-relaxed animate-in fade-in duration-150'>
            <AlertTriangle className='w-4 h-4 shrink-0 text-red-400 mt-0.5' />
            <span>{error}</span>
          </div>
        )}

        {/* TAB 1: SOCRATIC HINTS */}
        {activeTab === 'hint' && (
          <div className='space-y-4 animate-in fade-in duration-200'>
            <div className='space-y-2'>
              <label className='text-[11px] uppercase tracking-wider text-slate-400 font-semibold'>Select Hint Depth:</label>
              <div className='grid grid-cols-3 gap-2'>
                {[
                  { level: 1, label: 'Intuition' },
                  { level: 2, label: 'Approach' },
                  { level: 3, label: 'Edge Cases' },
                ].map((item) => (
                  <button
                    key={item.level}
                    onClick={() => setHintLevel(item.level)}
                    className={`py-2 px-1 text-center rounded-lg border text-xs font-medium transition-all duration-150 ${
                      hintLevel === item.level
                        ? 'bg-blue-500/15 border-blue-500/80 text-blue-300 shadow-sm shadow-blue-500/10'
                        : 'bg-slate-800/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-300'
                    }`}
                  >
                    <span className='block text-[10px] opacity-60 font-mono mb-0.5'>Lvl {item.level}</span>
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleGenerateHint}
              disabled={loading}
              className='w-full py-2.5 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 disabled:bg-blue-900/50 disabled:text-slate-400 disabled:cursor-not-allowed text-white font-medium text-xs rounded-lg transition-all shadow-lg shadow-blue-600/15 flex items-center justify-center gap-2'
            >
              {loading ? (
                <>
                  <RefreshCw className='w-4 h-4 animate-spin' />
                  <span>Generating Hint...</span>
                </>
              ) : (
                <>
                  <Sparkles className='w-4 h-4' />
                  <span>Get Level {hintLevel} Hint</span>
                </>
              )}
            </button>

            {hintText && (
              <div className='mt-5 p-4 bg-slate-950/60 border border-slate-800 rounded-xl text-slate-200 text-sm leading-relaxed prose prose-invert max-w-none shadow-inner'>
                <MarkdownRenderer content={hintText || ''} />
              </div>
            )}
          </div>
        )}

        {/* TAB 2: DEBUG DIAGNOSTICS */}
        {activeTab === 'debug' && (
          <div className='space-y-4 animate-in fade-in duration-200'>
            <p className='text-xs text-slate-400 leading-relaxed bg-slate-950/40 p-3 rounded-lg border border-slate-800/60'>
              Analyze compilation details, memory usage, or logical execution flaws against your latest code submission.
            </p>

            <button
              onClick={handleGenerateDebug}
              disabled={loading}
              className='w-full py-2.5 bg-red-600/90 hover:bg-red-500 active:bg-red-700 disabled:bg-red-950/40 disabled:text-slate-500 disabled:cursor-not-allowed text-white font-medium text-xs rounded-lg transition-all shadow-lg shadow-red-600/10 flex items-center justify-center gap-2'
            >
              {loading ? (
                <>
                  <RefreshCw className='w-4 h-4 animate-spin' />
                  <span>Analyzing Execution...</span>
                </>
              ) : (
                <>
                  <Bug className='w-4 h-4' />
                  <span>Analyze Code & Stderr</span>
                </>
              )}
            </button>

            {debugReport && (
              <div className='mt-5 p-4 bg-slate-950/60 border border-slate-800 rounded-xl text-slate-200 text-sm leading-relaxed prose prose-invert max-w-none shadow-inner'>
                <MarkdownRenderer content={debugReport || ''} />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
