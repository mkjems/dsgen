import { useState } from 'react';
import { highlight } from './highlight';

export function CopyButton({ text, label = 'Copy' }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      className="docs-copy"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        } catch {
          /* clipboard unavailable */
        }
      }}
    >
      {copied ? 'Copied ✓' : label}
    </button>
  );
}

export function CodeBlock({ code, language = 'tsx', title }: { code: string; language?: string; title?: string }) {
  const trimmed = code.replace(/\n$/, '');
  return (
    <div className="docs-code">
      <div className="docs-code__bar">
        <span className="docs-code__lang">{title ?? language}</span>
        <CopyButton text={trimmed} />
      </div>
      <pre className="docs-code__pre">
        <code>{highlight(trimmed, language)}</code>
      </pre>
    </div>
  );
}
