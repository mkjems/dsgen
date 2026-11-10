import { useMemo, useState } from 'react';
import { strToU8, zipSync } from 'fflate';
import type { DesignSystemConfig } from '../../core/config';
import { generateProject } from '../../core/generate';
import { TEMPLATES } from '../templates';
import type { StepId, StepView } from '../state';
import { StepHeader } from '../ui';

function download(name: string, data: BlobPart, type: string) {
  const url = URL.createObjectURL(new Blob([data], { type }));
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

interface TreeNode { name: string; path: string; children?: TreeNode[] }

function buildTree(paths: string[]): TreeNode[] {
  const root: TreeNode = { name: '', path: '', children: [] };
  for (const p of paths.sort()) {
    let node = root;
    p.split('/').forEach((part, i, arr) => {
      const path = arr.slice(0, i + 1).join('/');
      let child = node.children!.find((c) => c.name === part);
      if (!child) {
        child = { name: part, path, children: i < arr.length - 1 ? [] : undefined };
        node.children!.push(child);
      }
      node = child;
    });
  }
  const sort = (n: TreeNode[]): TreeNode[] =>
    n.sort((a, b) => Number(!a.children) - Number(!b.children) || a.name.localeCompare(b.name)).map((c) => (c.children ? { ...c, children: sort(c.children) } : c));
  return sort(root.children!);
}

function Tree({ nodes, selected, onSelect, depth = 0 }: { nodes: TreeNode[]; selected: string; onSelect: (p: string) => void; depth?: number }) {
  return (
    <ul className="wz-tree" role={depth === 0 ? 'tree' : 'group'}>
      {nodes.map((n) =>
        n.children ? (
          <li key={n.path} role="treeitem" aria-expanded="true">
            <details open={depth < 1 || n.path === 'src' || n.path === 'docs'}>
              <summary>{n.name}/</summary>
              <Tree nodes={n.children} selected={selected} onSelect={onSelect} depth={depth + 1} />
            </details>
          </li>
        ) : (
          <li key={n.path} role="treeitem" aria-selected={selected === n.path}>
            <button type="button" className={selected === n.path ? 'is-selected' : undefined} onClick={() => onSelect(n.path)}>{n.name}</button>
          </li>
        ),
      )}
    </ul>
  );
}

export function ReviewStep({ config, views, goTo, exportState }: { config: DesignSystemConfig; views: StepView[]; goTo: (s: StepId) => void; exportState: () => void }) {
  const result = useMemo(() => generateProject(config, TEMPLATES), [config]);
  const paths = Object.keys(result.files);
  const [selected, setSelected] = useState('README.md');
  const errors = views.reduce((n, v) => n + v.errors, 0);
  const warnings = views.reduce((n, v) => n + v.warnings, 0);
  const incomplete = views.filter((v) => v.id !== 'review' && v.status !== 'complete');
  const slug = config.identity.packageName.replace(/^@/, '').replace(/\//g, '-') || 'design-system';
  const bytes = Object.values(result.files).reduce((n, f) => n + f.length, 0);

  const downloadZip = () => {
    const entries = Object.fromEntries(Object.entries(result.files).map(([p, c]) => [`${slug}/${p}`, strToU8(c)]));
    download(`${slug}.zip`, zipSync(entries, { level: 6 }) as BlobPart, 'application/zip');
  };

  return (
    <>
      <StepHeader title="Review & export">
        Check every step, browse the exact files that will be generated, then download the project. Unzip it and run <code>npm install && npm run docs</code>.
      </StepHeader>
      <div className="wz-form">
        <div className="wz-summary">
          {views.filter((v) => v.id !== 'review').map((v) => (
            <button key={v.id} type="button" className="wz-summary__item" onClick={() => goTo(v.id)}>
              <span className={`wz-dot wz-dot--${v.errors ? 'error' : v.status === 'complete' ? 'ok' : 'pending'}`} aria-hidden="true" />
              <span className="wz-summary__title">{v.title}</span>
              <span className="wz-summary__meta">
                {v.errors ? `${v.errors} error${v.errors > 1 ? 's' : ''}` : v.status === 'complete' ? 'Complete' : 'Not completed'}
                {v.warnings ? ` · ${v.warnings} warning${v.warnings > 1 ? 's' : ''}` : ''}
              </span>
            </button>
          ))}
        </div>

        {errors > 0 ? (
          <p className="wz-msg wz-msg--error" role="alert">✖ Fix {errors} error{errors > 1 ? 's' : ''} before exporting.</p>
        ) : incomplete.length > 0 ? (
          <p className="wz-msg wz-msg--warn">⚠ Not yet confirmed: {incomplete.map((v) => v.title).join(', ')}. Defaults will be used — you can still export.</p>
        ) : (
          <p className="wz-msg wz-msg--ok">✔ All steps complete and valid.</p>
        )}
        {warnings > 0 && <p className="wz-hint">{warnings} warning{warnings > 1 ? 's' : ''} — advisory only.</p>}

        <div className="wz-export">
          <button type="button" className="wz-btn wz-btn--primary" disabled={errors > 0} onClick={downloadZip}>Download project (.zip)</button>
          <button type="button" className="wz-btn" onClick={() => download('design-system.config.json', JSON.stringify(config, null, 2), 'application/json')}>Download config</button>
          <button type="button" className="wz-btn" onClick={exportState}>Download wizard state</button>
        </div>
        <p className="wz-hint">{paths.length} files · {(bytes / 1024).toFixed(0)} KB. Or generate from the command line: <code>npm run generate -- design-system.config.json ./{slug}</code></p>
        {result.notes.length > 0 && (
          <details className="wz-notes">
            <summary>{result.notes.length} generation note{result.notes.length > 1 ? 's' : ''}</summary>
            <ul>{result.notes.map((n) => <li key={n}>{n}</li>)}</ul>
          </details>
        )}

        <div className="wz-files">
          <nav aria-label="Generated files"><Tree nodes={buildTree(paths)} selected={selected} onSelect={setSelected} /></nav>
          <div className="wz-file">
            <div className="wz-file__bar"><code>{selected}</code></div>
            <pre><code>{result.files[selected] ?? 'Select a file'}</code></pre>
          </div>
        </div>
      </div>
    </>
  );
}
