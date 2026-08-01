import Editor from '@monaco-editor/react';

/* Component that wraps the Monaco Editor, providing a code editing environment */
export const MonacoEditorWrapper = ({ language, code, onChange }) => {
  return (
    <div className='w-full h-full bg-dark-bg'>
      <Editor
        height='100%'
        language={language}
        value={code}
        onChange={onChange}
        theme='vs-dark'
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          fontFamily: "'Fira Code', 'JetBrains Mono', monospace",
          fontLigatures: true,
          wordWrap: 'on',
          padding: { top: 16 },
          scrollBeyondLastLine: false,
          smoothScrolling: true,
          cursorBlinking: 'smooth',
        }}
        loading={<div className='flex items-center justify-center h-full text-slate-400 text-sm'>Loading Editor Environment...</div>}
      />
    </div>
  );
};
