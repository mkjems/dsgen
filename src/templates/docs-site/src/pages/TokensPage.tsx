import { useState } from 'react';
import { config, cssVar, system } from '../data';
import { Swatch, VarName } from './Swatch';

const isColor = (v: string) => /^#|^rgb/.test(v);

export function TokensPage() {
  const [query, setQuery] = useState('');
  const q = query.trim().toLowerCase();
  const total = system.tokens.groups.reduce((n, g) => n + g.tokens.length, 0);
  return (
    <article className="docs-page">
      <p className="docs-eyebrow">Foundations</p>
      <h1>All tokens</h1>
      <p className="docs-lead">
        {total} tokens, available in three formats: CSS custom properties (<code className="docs-inline-code">styles.css</code>),
        W3C design-token JSON (<code className="docs-inline-code">{config.identity.packageName}/tokens.json</code>) and a typed
        TypeScript object (<code className="docs-inline-code">import {'{ tokens }'} from '{config.identity.packageName}'</code>).
      </p>
      <label className="docs-visually-hidden" htmlFor="token-search">Search tokens</label>
      <input id="token-search" className="docs-search" type="search" placeholder="Search tokens by name, value or description…" value={query} onChange={(e) => setQuery(e.target.value)} />
      {system.tokens.groups.map((g) => {
        const rows = g.tokens
          .map((t, i) => ({ t, dark: g.dark?.[i] }))
          .filter(({ t }) => !q || `${t.name} ${t.value} ${t.description}`.toLowerCase().includes(q));
        if (!rows.length) return null;
        return (
          <section key={g.id}>
            <h2>{g.title}</h2>
            <p className="docs-muted">{g.description}</p>
            <div className="docs-table-wrap">
              <table className="docs-table">
                <thead>
                  <tr>
                    <th scope="col">Custom property</th>
                    <th scope="col">Value</th>
                    {g.dark && <th scope="col">Dark value</th>}
                    <th scope="col">Description</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map(({ t, dark }) => (
                    <tr key={t.name}>
                      <td><VarName name={cssVar(t.name)} /></td>
                      <td>{isColor(t.value) ? <Swatch color={t.value} /> : <code className="docs-token-value">{t.value}</code>}</td>
                      {g.dark && <td>{dark && (isColor(dark.value) ? <Swatch color={dark.value} /> : <code>{dark.value}</code>)}</td>}
                      <td>{t.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        );
      })}
    </article>
  );
}
