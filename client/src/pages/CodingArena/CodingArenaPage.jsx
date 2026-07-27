import { useParams } from 'react-router-dom';

import { SplitPanels } from '../../features/coding-arena/components/SplitPanels';
import { LanguageSelector } from '../../features/coding-arena/components/LanguageSelector';
import { MonacoEditorWrapper } from '../../features/coding-arena/components/MonacoEditorWrapper';
import { ConsoleOutput } from '../../features/coding-arena/components/ConsoleOutput';

/* Expand this hook to fetch a single problem */
import { useCodeRunner } from '../../features/coding-arena/hooks/useCodeRunner';

export const CodingArenaPage = () => {
  const { id } = useParams();

  /* For now, we mock the problem statement */
  const { language, code, setCode, handleLanguageChange } = useCodeRunner(id, 'cpp', '');

  /* Left Panel Content (Problem Statement) */
  const LeftPanel = (
    <div className='p-6 text-slate-200'>
      <h1 className='text-2xl font-bold text-slate-50 mb-4'>Problem {id}</h1>
      <div className='prose prose-invert max-w-none font-sans'>
        <p className='text-slate-400'>
          The problem statement, constraints, and public examples will be rendered here via
          Markdown.
        </p>
      </div>
    </div>
  );

  /* Right Panel Content (Editor) */
  const RightPanelTop = (
    <div className='flex flex-col h-full'>
      <LanguageSelector language={language} onLanguageChange={handleLanguageChange} />
      <div className='flex-1'>
        <MonacoEditorWrapper language={language} code={code} onChange={setCode} />
      </div>
    </div>
  );

  /* Right Panel Content (Console) */
  const RightPanelBottom = <ConsoleOutput problemId={id} language={language} code={code} />;

  return (
    <SplitPanels
      leftPanel={LeftPanel}
      rightPanelTop={RightPanelTop}
      rightPanelBottom={RightPanelBottom}
    />
  );
};
