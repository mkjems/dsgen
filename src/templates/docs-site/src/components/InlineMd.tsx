import { Fragment, type ReactNode } from 'react';

/** Render `code` and **bold** spans inside documentation strings. */
export function InlineMd({ text }: { text: string }) {
  const parts: ReactNode[] = [];
  const re = /(`[^`]+`|\*\*[^*]+\*\*)/g;
  let last = 0;
  let i = 0;
  for (const m of text.matchAll(re)) {
    if (m.index! > last) parts.push(<Fragment key={i++}>{text.slice(last, m.index)}</Fragment>);
    const token = m[0];
    parts.push(token.startsWith('`') ? <code key={i++} className="docs-inline-code">{token.slice(1, -1)}</code> : <strong key={i++}>{token.slice(2, -2)}</strong>);
    last = m.index! + token.length;
  }
  if (last < text.length) parts.push(<Fragment key={i++}>{text.slice(last)}</Fragment>);
  return <>{parts}</>;
}
