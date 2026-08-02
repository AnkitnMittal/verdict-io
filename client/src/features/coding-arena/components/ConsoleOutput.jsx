import { useState } from 'react';
import { Terminal, Play, Send, Loader2 } from 'lucide-react';
import { getVerdictColor } from '../../../constants/verdict';

export const ConsoleOutput = ({ problemId, language, code, submissionStatus }) => {
  const [activeTab, setActiveTab] = useState('testcases');
  const { isSubmitting, verdictData, submitCode } = submissionStatus;

  const handleSubmit = () => {
    setActiveTab('results');
    submitCode({ problemId, language, code });
  };

  return (
    <div className='flex flex-col h-full bg-dark-bg'>
      {/* Console Header / Tabs */}
      <div className='flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-[#334155]'>
        <div className='flex gap-4'>
          <button
            onClick={() => setActiveTab('testcases')}
            className={`text-sm font-medium transition-colors ${activeTab === 'testcases' ? 'text-slate-50' : 'text-slate-400 hover:text-slate-300'}`}
          >
            Test Cases
          </button>
          <button
            onClick={() => setActiveTab('results')}
            className={`text-sm font-medium transition-colors ${activeTab === 'results' ? 'text-slate-50' : 'text-slate-400 hover:text-slate-300'}`}
          >
            Execution Results
          </button>
        </div>

        {/* Action Buttons */}
        <div className='flex gap-2'>
          <button
            disabled={isSubmitting}
            className='flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium rounded transition-colors disabled:opacity-50'
          >
            <Play className='w-4 h-4 text-emerald-500' /> Run Code
          </button>

          <button
            disabled={isSubmitting}
            onClick={handleSubmit}
            className='flex items-center gap-1.5 px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded transition-colors disabled:opacity-50'
          >
            {isSubmitting ? <Loader2 className='w-4 h-4 animate-spin' /> : <Send className='w-4 h-4' />} Submit
          </button>
        </div>
      </div>

      {/* Console Body */}
      <div className='flex-1 overflow-y-auto p-4 font-mono text-sm'>
        {activeTab === 'results' && verdictData ? (
          <div className='space-y-2 p-4 bg-slate-800/50 border border-slate-700 rounded-md'>
            <div className='text-slate-300'>
              Verdict: <span className={getVerdictColor(verdictData.verdict)}>{verdictData.verdict}</span>
            </div>

            {verdictData.runtime && (
              <div className='text-slate-400'>
                Runtime: <span className='text-slate-200'>{verdictData.runtime} ms</span>
              </div>
            )}

            {verdictData.memory && (
              <div className='text-slate-400'>
                Memory: <span className='text-slate-200'>{verdictData.memory} MB</span>
              </div>
            )}

            {verdictData.verdict === 'CE' && verdictData.aiReport && (
              <div className='mt-4 pt-4 border-t border-slate-700 text-slate-300'>
                <strong className='text-red-400 block mb-1'>Compiler Error Output:</strong>
                <pre className='whitespace-pre-wrap'>{verdictData.aiReport}</pre>
              </div>
            )}
          </div>
        ) : activeTab === 'testcases' ? (
          <div className='text-slate-400'>
            <p>Custom test case configurations will be mounted here.</p>
          </div>
        ) : (
          <div className='text-slate-500 flex items-center gap-2'>
            <Terminal className='w-4 h-4' />
            <span>Ready. Run or submit your code to see outputs and verdicts.</span>
          </div>
        )}
      </div>
    </div>
  );
};
