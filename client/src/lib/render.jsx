import { memo, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Check, Copy } from 'lucide-react';

import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeHighlight from 'rehype-highlight';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';

import 'katex/dist/katex.min.css';
import 'highlight.js/styles/github-dark.css';

const remarkPlugins = [remarkGfm, remarkMath];
const rehypePlugins = [
  [rehypeKatex, { throwOnError: false, errorColor: '#f87171' }],
  rehypeHighlight,
  rehypeSlug,
  [
    rehypeAutolinkHeadings,
    {
      behavior: 'append',
      properties: {
        className: ['markdown-anchor'],
        ariaLabel: 'Link to section',
      },
    },
  ],
];

function CodeRenderer({ className, children, ...props }) {
  const match = /language-([^\s]+)/.exec(className || '');
  if (!match) {
    return (
      <code className='bg-slate-800 text-blue-300 px-1.5 py-0.5 rounded font-mono text-xs' {...props}>
        {children}
      </code>
    );
  }

  const language = match[1];
  const code = String(children).replace(/\n$/, '');

  return (
    <CodeBlock language={language} className={className} code={code} {...props}>
      {children}
    </CodeBlock>
  );
}

function CodeBlock({ language, className, code, children, ...props }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch {
      // Ignore clipboard failures
    }
  };

  return (
    <div className='relative my-4 overflow-hidden rounded-lg border border-slate-800 bg-slate-950'>
      <div className='flex items-center justify-between border-b border-slate-800 bg-slate-900/80 px-4 py-2 text-xs font-mono text-slate-400'>
        <span>{language}</span>

        <button type='button' onClick={handleCopy} className='flex items-center gap-1 rounded bg-slate-800/50 px-2 py-1 transition-colors hover:text-slate-200'>
          {copied ? (
            <>
              <Check className='h-3.5 w-3.5 text-green-400' />
              <span>Copied</span>
            </>
          ) : (
            <>
              <Copy className='h-3.5 w-3.5' />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      <pre className='overflow-x-auto p-4 text-sm leading-relaxed'>
        <code className={className} {...props}>
          {children}
        </code>
      </pre>
    </div>
  );
}

function LinkRenderer({ href, children, ...props }) {
  const isExternal = href?.startsWith('http://') || href?.startsWith('https://');

  return (
    <a
      href={href}
      target={isExternal ? '_blank' : undefined}
      rel={isExternal ? 'noopener noreferrer' : undefined}
      className='text-blue-400 underline underline-offset-2 transition-colors hover:text-blue-300'
      {...props}
    >
      {children}
    </a>
  );
}

function ImageRenderer({ src, alt }) {
  return <img src={src} alt={alt} loading='lazy' decoding='async' className='my-4 max-w-full rounded-lg' />;
}

function TableRenderer({ children }) {
  return (
    <div className='my-4 overflow-x-auto rounded-lg border border-slate-800'>
      <table className='w-full border-collapse text-left text-sm'>{children}</table>
    </div>
  );
}

const HeadingRenderers = {
  h1: ({ children, ...props }) => (
    <h1 className='mt-8 mb-4 border-b border-slate-800 pb-2 text-3xl font-bold tracking-tight text-slate-100' {...props}>
      {children}
    </h1>
  ),
  h2: ({ children, ...props }) => (
    <h2 className='mt-6 mb-3 border-b border-slate-800/60 pb-1 text-2xl font-semibold tracking-tight text-slate-100' {...props}>
      {children}
    </h2>
  ),
  h3: ({ children, ...props }) => (
    <h3 className='mt-5 mb-2 text-xl font-semibold text-slate-200' {...props}>
      {children}
    </h3>
  ),
  h4: ({ children, ...props }) => (
    <h4 className='mt-4 mb-2 text-lg font-medium text-slate-200' {...props}>
      {children}
    </h4>
  ),
  h5: ({ children, ...props }) => (
    <h5 className='mt-3 mb-1 text-base font-medium text-slate-300' {...props}>
      {children}
    </h5>
  ),
  h6: ({ children, ...props }) => (
    <h6 className='mt-3 mb-1 text-sm font-medium uppercase tracking-wider text-slate-400' {...props}>
      {children}
    </h6>
  ),
};

const components = {
  ...HeadingRenderers,
  code: CodeRenderer,
  a: LinkRenderer,
  img: ImageRenderer,
  table: TableRenderer,
};

function MarkdownRenderer({ content }) {
  return (
    <ReactMarkdown remarkPlugins={remarkPlugins} rehypePlugins={rehypePlugins} components={components}>
      {content}
    </ReactMarkdown>
  );
}

const MemoizedMarkdownRenderer = memo(MarkdownRenderer);
MemoizedMarkdownRenderer.displayName = 'MarkdownRenderer';
export default MemoizedMarkdownRenderer;
