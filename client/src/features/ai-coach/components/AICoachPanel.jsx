import { Sparkles, Bug, Lightbulb, RefreshCw, AlertTriangle } from 'lucide-react';
import DOMPurify from 'dompurify';

import md from '../../../lib/render.js';
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
    <div className='flex flex-col h-full bg-slate-900 border-l border-slate-800 text-slate-100 font-sans'>
      {/* Header & Tabs */}
      <div className='flex items-center justify-between px-4 py-3 border-b border-slate-800 bg-slate-900/50'>
        <div className='flex items-center gap-2'>
          <Sparkles className='w-5 h-5 text-blue-500' />
          <h3 className='font-semibold text-slate-100'>AI Coach</h3>
        </div>

        <div className='flex bg-slate-800 rounded-lg p-1 border border-slate-700/50'>
          <button
            onClick={() => setActiveTab('hint')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-colors ${
              activeTab === 'hint' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Lightbulb className='w-3.5 h-3.5' />
            Hints
          </button>
          <button
            onClick={() => setActiveTab('debug')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-colors ${
              activeTab === 'debug' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Bug className='w-3.5 h-3.5' />
            Debugger
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className='flex-1 p-4 overflow-y-auto space-y-4'>
        {error && (
          <div className='flex items-center gap-2 p-3 bg-red-900/30 border border-red-500/50 rounded-md text-red-300 text-sm'>
            <AlertTriangle className='w-4 h-4 shrink-0' />
            <span>{error}</span>
          </div>
        )}

        {/* TAB 1: SOCRATIC HINTS */}
        {activeTab === 'hint' && (
          <div className='space-y-4'>
            <div className='space-y-2'>
              <label className='text-xs text-slate-400 font-medium'>Select Hint Level:</label>
              <div className='grid grid-cols-3 gap-2'>
                {[
                  { level: 1, label: '1. Intuition' },
                  { level: 2, label: '2. Approach' },
                  { level: 3, label: '3. Edge Cases' },
                ].map((item) => (
                  <button
                    key={item.level}
                    onClick={() => setHintLevel(item.level)}
                    className={`py-1.5 text-xs rounded-md border font-medium transition-all ${
                      hintLevel === item.level
                        ? 'bg-blue-500/10 border-blue-500 text-blue-400'
                        : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-600'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleGenerateHint}
              disabled={loading}
              className='w-full py-2 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 disabled:cursor-not-allowed text-white font-medium text-xs rounded-md transition-colors flex items-center justify-center gap-2'
            >
              {loading ? (
                <>
                  <RefreshCw className='w-4 h-4 animate-spin' />
                  Generating Hint...
                </>
              ) : (
                <>
                  <Sparkles className='w-4 h-4' />
                  Get Level {hintLevel} Hint
                </>
              )}
            </button>

            {hintText && (
              <div className='mt-4 p-4 bg-slate-800/80 border border-slate-700/60 rounded-lg text-slate-200 text-sm leading-relaxed prose prose-invert max-w-none'>
                <div
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(md.render(hintText)),
                  }}
                />
              </div>
            )}
          </div>
        )}

        {/* TAB 2: DEBUG DIAGNOSTICS */}
        {activeTab === 'debug' && (
          <div className='space-y-4'>
            <p className='text-xs text-slate-400'>Analyze compilation, memory, or logical execution errors based on your latest submission verdict.</p>

            <button
              onClick={handleGenerateDebug}
              disabled={loading}
              className='w-full py-2 bg-red-600/90 hover:bg-red-500 disabled:bg-red-900 disabled:cursor-not-allowed text-white font-medium text-xs rounded-md transition-colors flex items-center justify-center gap-2'
            >
              {loading ? (
                <>
                  <RefreshCw className='w-4 h-4 animate-spin' />
                  Analyzing Output...
                </>
              ) : (
                <>
                  <Bug className='w-4 h-4' />
                  Analyze Code & Stderr
                </>
              )}
            </button>

            {debugReport && (
              <div className='mt-4 p-4 bg-slate-800/80 border border-slate-700/60 rounded-lg text-slate-200 text-sm leading-relaxed prose prose-invert max-w-none'>
                <div
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(md.render(debugReport)),
                  }}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
