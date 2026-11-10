import type { ReactElement, ReactNode } from 'react';
import { system } from '../data';
import { contentPages } from '../generated/content';
import { CodeBlock } from '../components/CodeBlock';
import { NotFound } from './NotFound';

/** Map MDX elements onto docs styles; fenced code gets syntax highlighting and a copy button. */
const mdxComponents = {
  pre: ({ children }: { children?: ReactNode }) => {
    const code = children as ReactElement<{ className?: string; children?: string }>;
    const language = code?.props?.className?.replace('language-', '') ?? 'tsx';
    return <CodeBlock code={String(code?.props?.children ?? '')} language={language} />;
  },
  table: (props: { children?: ReactNode }) => (
    <div className="docs-table-wrap"><table className="docs-table" {...props} /></div>
  ),
};

export function ContentPage({ id }: { id: string }) {
  const Content = contentPages[id];
  const meta = system.pages.find((p) => p.id === id);
  if (!Content || !meta) return <NotFound />;
  return (
    <article className="docs-page docs-prose">
      <p className="docs-eyebrow">Guide</p>
      <Content components={mdxComponents} />
    </article>
  );
}
