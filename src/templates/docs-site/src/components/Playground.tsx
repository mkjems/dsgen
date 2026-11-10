import { useMemo, useState } from 'react';
import type { ComponentDoc, PropDoc } from '../types';
import { CodeBlock } from './CodeBlock';
import { ErrorBoundary } from './ErrorBoundary';
import { playgrounds } from '../generated/demos';

type Value = string | number | boolean;

const isNumericType = (p: PropDoc) => p.control === 'number' || (p.values?.every((v) => /^[\d.]+$/.test(v)) && !p.type.includes("'"));

function toRuntime(props: Record<string, Value>, docs: PropDoc[]) {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(props)) {
    const doc = docs.find((d) => d.name === k);
    if (v === '') continue;
    out[k] = doc && isNumericType(doc) && typeof v === 'string' ? Number(v) : v;
  }
  return out;
}

function stripQuotes(v?: string) {
  return v?.replace(/^'(.*)'$/, '$1');
}

/** Build the JSX source that corresponds to the current playground state. */
function toJsx(component: ComponentDoc, props: Record<string, Value>): string {
  const attrs: string[] = [];
  let children: string | undefined;
  for (const [k, v] of Object.entries(props)) {
    const doc = component.props.find((d) => d.name === k);
    if (v === '' || v === undefined) continue;
    if (k === 'children') { children = String(v); continue; }
    if (doc?.default !== undefined && stripQuotes(doc.default) === String(v)) continue;
    if (v === false && doc?.default === undefined) continue;
    if (typeof v === 'boolean') attrs.push(v ? k : `${k}={false}`);
    else if (typeof v === 'number' || (doc && isNumericType(doc))) attrs.push(`${k}={${v}}`);
    else attrs.push(`${k}="${String(v).replace(/"/g, '&quot;')}"`);
  }
  const template = component.playground!.template;
  const attrText = attrs.join(' ');
  const selfClosing = template.match(/^<(\w+) \{\.\.\.props\} \/>$/);
  if (selfClosing && children) return `<${selfClosing[1]}${attrText ? ' ' + attrText : ''}>${children}</${selfClosing[1]}>`;
  return template.replace(' {...props}', attrText ? ' ' + attrText : '');
}

export function Playground({ component }: { component: ComponentDoc }) {
  const initial = component.playground!.initial;
  const [props, setProps] = useState<Record<string, Value>>(initial);
  const render = playgrounds[component.name];
  const controls = component.props.filter((p) => p.control && p.name in initial);
  const runtime = useMemo(() => toRuntime(props, component.props), [props, component.props]);
  const set = (name: string, v: Value) => setProps((prev) => ({ ...prev, [name]: v }));

  if (!render) return null;
  return (
    <div className="docs-playground">
      <div className="docs-playground__stage">
        <ErrorBoundary key={JSON.stringify(props)}>{render(runtime)}</ErrorBoundary>
      </div>
      <form className="docs-playground__controls" onSubmit={(e) => e.preventDefault()} aria-label={`${component.name} props`}>
        {controls.map((p) => {
          const id = `pg-${component.name}-${p.name}`;
          const v = props[p.name];
          if (p.control === 'boolean') {
            return (
              <label key={p.name} className="docs-control docs-control--bool" htmlFor={id}>
                <input id={id} type="checkbox" checked={Boolean(v)} onChange={(e) => set(p.name, e.target.checked)} />
                <code>{p.name}</code>
              </label>
            );
          }
          return (
            <div key={p.name} className="docs-control">
              <label htmlFor={id}><code>{p.name}</code></label>
              {p.control === 'select' && p.values ? (
                <select id={id} value={String(v ?? '')} onChange={(e) => set(p.name, e.target.value)}>
                  {!p.default && <option value="">—</option>}
                  {p.values.map((val) => <option key={val} value={val}>{val}</option>)}
                </select>
              ) : p.control === 'number' ? (
                <input id={id} type="number" value={Number(v ?? 0)} onChange={(e) => set(p.name, Number(e.target.value))} />
              ) : (
                <input id={id} type="text" value={String(v ?? '')} onChange={(e) => set(p.name, e.target.value)} />
              )}
            </div>
          );
        })}
        <button type="button" className="docs-link-button" onClick={() => setProps(initial)}>Reset</button>
      </form>
      <CodeBlock code={toJsx(component, props)} />
    </div>
  );
}
