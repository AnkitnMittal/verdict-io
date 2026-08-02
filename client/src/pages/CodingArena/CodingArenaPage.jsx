import { useState } from 'react';
import { useParams } from 'react-router-dom';

import DOMPurify from 'dompurify';
import md from '../../lib/render.js';

import { DifficultyBadge } from '../../components/ui/DifficultyBadge.jsx';
import { SplitPanels } from '../../features/coding-arena/components/SplitPanels';
import { LanguageSelector } from '../../features/coding-arena/components/LanguageSelector';
import { MonacoEditorWrapper } from '../../features/coding-arena/components/MonacoEditorWrapper';
import { ConsoleOutput } from '../../features/coding-arena/components/ConsoleOutput';
import { AICoachPanel } from '../../features/ai-coach/components/AICoachPanel.jsx';

/* Expand this hook to fetch a single problem */
import { useProblemDetail } from '../../features/problems/hooks/useProblemDetail.js';
import { useCodeRunner } from '../../features/coding-arena/hooks/useCodeRunner';
import { useSubmissionStatus } from '../../features/coding-arena/hooks/useSubmissionStatus';

export const CodingArenaPage = () => {
  const { id } = useParams();
  const [showAiCoach, setShowAiCoach] = useState(false);

  const { title, statement, difficulty, timeLimit, memoryLimit, getSkeletonCode, loading, error } = useProblemDetail(id);
  const { language, code, setCode, handleLanguageChange } = useCodeRunner(id, 'cpp', getSkeletonCode('cpp'));
  const { isSubmitting, verdictData, submitCode } = useSubmissionStatus();

  if (loading) {
    return <div className='p-6 text-slate-200'>Loading problem details...</div>;
  }

  if (error) {
    return <div className='p-6 text-red-400'>Error loading problem details: {error.message}</div>;
  }

  /* Left Panel Content (Problem Statement) */
  const LeftPanel = (
    <div className='p-6 text-slate-200 overflow-y-auto h-full'>
      <div className='space-y-3 border-b border-slate-800 pb-4'>
        <h1 className='text-2xl font-bold text-slate-50 mb-2'>{title || `Problem ${id}`}</h1>

        <div className='flex flex-wrap items-center gap-3 text-xs text-slate-400'>
          <DifficultyBadge difficulty={difficulty} />

          <div className='flex items-center gap-1 bg-slate-800/80 px-2.5 py-1 rounded border border-slate-700/50'>
            <span className='text-slate-400'>Time Limit:</span>
            <span className='text-slate-200 font-mono'>{timeLimit}s</span>
          </div>

          <div className='flex items-center gap-1 bg-slate-800/80 px-2.5 py-1 rounded border border-slate-700/50'>
            <span className='text-slate-400'>Memory Limit:</span>
            <span className='text-slate-200 font-mono'>{memoryLimit}MB</span>
          </div>
        </div>
      </div>
      <div className='prose prose-invert max-w-none font-sans' dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(md.render(statement)) }} />
    </div>
  );

  /* Right Panel Content (Editor) */
  const RightPanelTop = (
    <div className='flex flex-col h-full bg-slate-900'>
      <div className='flex items-center justify-between px-3 py-1 bg-slate-900 border-b border-slate-800'>
        <LanguageSelector
          language={language}
          onLanguageChange={(newLanguage) => {
            const newSkeleton = getSkeletonCode(newLanguage);
            handleLanguageChange(newLanguage, newSkeleton);
          }}
        />
        <button
          onClick={() => setShowAiCoach(!showAiCoach)}
          className={`px-2.5 py-1 text-xs rounded border transition-colors ${
            showAiCoach ? 'bg-blue-600/20 text-blue-400 border-blue-500/40' : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200'
          }`}
        >
          {showAiCoach ? 'Hide AI Coach' : 'Show AI Coach'}
        </button>
      </div>
      <div className='flex-1'>
        <MonacoEditorWrapper language={language} code={code} onChange={setCode} />
      </div>
    </div>
  );

  /* Right Panel Content (Console) */
  const RightPanelBottom = <ConsoleOutput problemId={id} language={language} code={code} submissionStatus={{ isSubmitting, verdictData, submitCode }} />;

  return (
    <div className='flex h-[calc(100vh-4rem)] bg-slate-900 overflow-hidden'>
      <div className='flex-1 h-full'>
        <SplitPanels leftPanel={LeftPanel} rightPanelTop={RightPanelTop} rightPanelBottom={RightPanelBottom} />
      </div>

      {showAiCoach && (
        <div className='w-80 h-full shrink-0'>
          <AICoachPanel problemTitle={title} problemStatement={statement} userCode={code} language={language} latestSubmission={verdictData} />
        </div>
      )}
    </div>
  );
};
