import type { ReactNode } from 'react';

/**
 * A tiny syntax highlighter for TSX/TS/CSS/shell snippets. Good enough for
 * documentation, with zero dependencies.
 */
const RULES: [string, RegExp][] = [
  ['comment', /^(\/\/[^\n]*|\/\*[\s\S]*?\*\/|#[^\n]*(?=\n|$))/],
  ['string', /^("(?:[^"\\\n]|\\.)*"|'(?:[^'\\\n]|\\.)*'|`(?:[^`\\]|\\.)*`)/],
  ['tag', /^(<\/?[A-Za-z][\w.]*|\/?>)/],
  ['attr', /^[A-Za-z_][\w-]*(?==)/],
  ['keyword', /^\b(import|from|export|default|const|let|var|function|return|if|else|true|false|null|undefined|new|type|interface|extends|as|await|async|npm|install|run)\b/],
  ['number', /^\b\d+(\.\d+)?(px|rem|em|ms|%)?\b/],
  ['property', /^--[\w-]+/],
  ['punct', /^[{}()[\];,.=:+\-*/!?&|]/],
];

export function highlight(code: string, language = 'tsx'): ReactNode[] {
  const out: ReactNode[] = [];
  let rest = code;
  let plain = '';
  let key = 0;
  const flush = () => {
    if (plain) out.push(plain);
    plain = '';
  };
  while (rest.length) {
    let matched = false;
    for (const [type, re] of RULES) {
      if (type === 'comment' && language !== 'bash' && language !== 'sh' && rest.startsWith('#')) continue;
      const m = rest.match(re);
      if (m && m[0].length) {
        flush();
        out.push(<span key={key++} className={`docs-tok-${type}`}>{m[0]}</span>);
        rest = rest.slice(m[0].length);
        matched = true;
        break;
      }
    }
    if (!matched) {
      const word = rest.match(/^[A-Za-z_$][\w$]*/);
      const chunk = word ? word[0] : rest[0];
      plain += chunk;
      rest = rest.slice(chunk.length);
    }
  }
  flush();
  return out;
}
