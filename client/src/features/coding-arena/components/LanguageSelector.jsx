import { Code2 } from 'lucide-react';

/* Component for selecting the programming language for the code editor */
export const LanguageSelector = ({ language, onLanguageChange }) => {
  return (
    <div className='flex items-center gap-2 px-4 py-2 bg-slate-900 border-b border-[#334155]'>
      <Code2 className='w-4 h-4 text-slate-400' />
      <select
        value={language}
        onChange={(e) => onLanguageChange(e.target.value)}
        className='bg-transparent text-sm text-slate-200 focus:outline-none cursor-pointer'
      >
        <option value='javascript'>JavaScript</option>
        <option value='python'>Python</option>
        <option value='cpp'>C++</option>
        <option value='java'>Java</option>
      </select>
    </div>
  );
};
