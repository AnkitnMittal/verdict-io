import { useState } from 'react';
import { Terminal, Play, Send } from 'lucide-react';

export const ConsoleOutput = () => {
  const [activeTab, setActiveTab] = useState('testcases');

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
          <button className='flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium rounded transition-colors'>
            <Play className='w-4 h-4 text-emerald-500' /> Run Code
          </button>
          <button className='flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium rounded transition-colors'>
            <Send className='w-4 h-4' /> Submit
          </button>
        </div>
      </div>

      {/* Console Body */}
      <div className='flex-1 overflow-y-auto p-4 font-mono text-sm'>
        {activeTab === 'testcases' ? (
          <div className='text-slate-400'>
            <p>Custom test case inputs will appear here.</p>
            {/* Phase 6 will populate this with actual test case UI */}
          </div>
        ) : (
          <div className='text-slate-500 flex items-center gap-2'>
            <Terminal className='w-4 h-4' />
            <span>Run your code to see outputs and verdicts.</span>
          </div>
        )}
      </div>
    </div>
  );
};
