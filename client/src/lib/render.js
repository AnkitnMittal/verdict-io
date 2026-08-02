import MarkdownIt from 'markdown-it';

import mk from '@vscode/markdown-it-katex';
import 'katex/dist/katex.min.css';

import hljs from 'highlight.js';
import 'highlight.js/styles/github-dark.css';

import container from 'markdown-it-container';
import attrs from 'markdown-it-attrs';

const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
  breaks: true,

  highlight(str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return `<pre class="hljs"><code>${hljs.highlight(str, { language: lang }).value}</code></pre>`;
      } catch (error) {
        console.error('Error highlighting code:', error);
      }
    }
    return `<pre class="hljs"><code>${md.utils.escapeHtml(str)}</code></pre>`;
  },
});

/* Plugin Configuration */
md.use(mk.default, { throwOnError: false, errorColor: '#cc0000' });
md.use(attrs);
md.use(container, 'note');
md.use(container, 'warning');
md.use(container, 'tip');
md.use(container, 'info');

/* Link Renderer */
const defaultLinkRender = md.renderer.rules.link_open ?? ((tokens, idx, options, env, self) => self.renderToken(tokens, idx, options));
md.renderer.rules.link_open = (tokens, idx, options, env, self) => {
  const token = tokens[idx];
  const href = token.attrGet('href');

  if (href?.startsWith('http')) {
    token.attrSet('target', '_blank');
    token.attrSet('rel', 'noopener noreferrer');
  }

  return defaultLinkRender(tokens, idx, options, env, self);
};

export default md;
