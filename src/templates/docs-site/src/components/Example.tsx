import { useState, type ComponentType } from 'react';
import type { ExampleDoc } from '../types';
import { CodeBlock } from './CodeBlock';
import { ErrorBoundary } from './ErrorBoundary';
import { InlineMd } from './InlineMd';

export function Example({ example, Render, id }: { example: ExampleDoc; Render: ComponentType; id: string }) {
  const [showCode, setShowCode] = useState(false);
  return (
    <section className="docs-example" aria-labelledby={id}>
      <div className="docs-example__head">
        <h3 id={id} className="docs-example__title">{example.title}</h3>
        {example.description && <p className="docs-example__desc"><InlineMd text={example.description} /></p>}
      </div>
      <div className="docs-example__frame">
        <div className="docs-example__preview">
          <ErrorBoundary>
            <Render />
          </ErrorBoundary>
        </div>
        <div className="docs-example__toolbar">
          {example.stateful && <span className="docs-pill">Interactive</span>}
          <button type="button" className="docs-link-button" aria-expanded={showCode} onClick={() => setShowCode(!showCode)}>
            {showCode ? 'Hide code' : 'Show code'}
          </button>
        </div>
        {showCode && <CodeBlock code={example.code} />}
      </div>
    </section>
  );
}
