import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { X, Sparkles } from 'lucide-react';

import MarkdownRenderer from '../../lib/render.jsx';

import { DifficultyBadge } from '../../components/ui/DifficultyBadge.jsx';
import { SplitPanels } from '../../features/coding-arena/components/SplitPanels';
import { LanguageSelector } from '../../features/coding-arena/components/LanguageSelector';
import { MonacoEditorWrapper } from '../../features/coding-arena/components/MonacoEditorWrapper';
import { ConsoleOutput } from '../../features/coding-arena/components/ConsoleOutput';
import { AICoachPanel } from '../../features/ai-coach/components/AICoachPanel.jsx';

import { useProblemDetail } from '../../features/problems/hooks/useProblemDetail.js';
import { useCodeRunner } from '../../features/coding-arena/hooks/useCodeRunner';
import { useSubmissionStatus } from '../../features/submissions/hooks/useSubmissionStatus.js';

export const CodingArenaPage = () => {
  const { id } = useParams();
  const [showAiCoach, setShowAiCoach] = useState(false);

  const { title, statement, difficulty, timeLimit, memoryLimit, getSkeletonCode, loading, error } = useProblemDetail(id);
  const { language, code, setCode, handleLanguageChange } = useCodeRunner(id, 'cpp', getSkeletonCode('cpp'));
  const { isSubmitting, verdictData, submitCode } = useSubmissionStatus();

  if (loading) {
    return (
      <div className='flex items-center justify-center h-[calc(100vh-4rem)] bg-slate-950 text-slate-400 font-mono text-sm'>Loading problem workspace...</div>
    );
  }

  if (error) {
    return <div className='p-6 bg-slate-950 text-red-400 h-[calc(100vh-4rem)]'>Error loading problem details: {error.message}</div>;
  }

  /* Left Panel Content */
  const LeftPanel = (
    <div className='p-6 text-slate-200 overflow-y-auto h-full bg-slate-900/60 leading-relaxed'>
      <div className='space-y-4 border-b border-slate-800 pb-5 mb-5'>
        <h1 className='text-2xl font-bold text-slate-50 tracking-tight'>{title || `Problem ${id}`}</h1>

        <div className='flex flex-wrap items-center gap-3 text-xs text-slate-400'>
          <DifficultyBadge difficulty={difficulty} />

          <div className='flex items-center gap-1.5 bg-slate-800/80 px-3 py-1 rounded-md border border-slate-700/50 font-mono'>
            <span className='text-slate-400'>Time:</span>
            <span className='text-slate-200'>{timeLimit}s</span>
          </div>

          <div className='flex items-center gap-1.5 bg-slate-800/80 px-3 py-1 rounded-md border border-slate-700/50 font-mono'>
            <span className='text-slate-400'>Memory:</span>
            <span className='text-slate-200'>{memoryLimit}MB</span>
          </div>
        </div>
      </div>
      <div className='prose prose-invert max-w-none font-sans text-slate-300 text-sm leading-relaxed'>
        <MarkdownRenderer content={statement || ''} />
      </div>
    </div>
  );

  /* Right Panel Content (Top: Editor) */
  const RightPanelTop = (
    <div className='flex flex-col h-full bg-slate-950'>
      <div className='flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-800'>
        <LanguageSelector
          language={language}
          onLanguageChange={(newLanguage) => {
            const newSkeleton = getSkeletonCode(newLanguage);
            handleLanguageChange(newLanguage, newSkeleton);
          }}
        />
        <button
          onClick={() => setShowAiCoach(!showAiCoach)}
          className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all flex items-center gap-1.5 ${
            showAiCoach
              ? 'bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-500/20'
              : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700 hover:text-white'
          }`}
        >
          <Sparkles className='w-3.5 h-3.5 text-blue-400' />
          {showAiCoach ? 'Close AI Coach' : 'AI Coach'}
        </button>
      </div>
      <div className='flex-1 overflow-hidden'>
        <MonacoEditorWrapper language={language} code={code} onChange={setCode} />
      </div>
    </div>
  );

  /* Right Panel Content (Bottom: Console) */
  const RightPanelBottom = <ConsoleOutput problemId={id} language={language} code={code} submissionStatus={{ isSubmitting, verdictData, submitCode }} />;

  return (
    <div className='relative h-[calc(100vh-4rem)] w-full bg-slate-950 overflow-hidden'>
      {/* Resizable Base Workspace */}
      <SplitPanels leftPanel={LeftPanel} rightPanelTop={RightPanelTop} rightPanelBottom={RightPanelBottom} />

      {/* Floating AI Coach Overlay Modal */}
      {showAiCoach && (
        <div className='fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex justify-end transition-all animate-in fade-in duration-200'>
          <div className='w-full max-w-lg h-full bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col relative'>
            <button
              onClick={() => setShowAiCoach(false)}
              className='absolute top-3.5 right-4 z-10 p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors'
            >
              <X className='w-5 h-5' />
            </button>
            <div className='h-full overflow-hidden'>
              <AICoachPanel problemTitle={title} problemStatement={statement} userCode={code} language={language} latestSubmission={verdictData} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
