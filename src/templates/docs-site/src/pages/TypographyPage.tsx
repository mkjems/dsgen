import { config, cssVar, system } from '../data';
import { VarName } from './Swatch';

export function TypographyPage() {
  const group = system.tokens.groups.find((g) => g.id === 'typography')!;
  const sizes = group.tokens.filter((t) => t.name.startsWith('font-size-')).reverse();
  const families = group.tokens.filter((t) => ['font-body', 'font-heading', 'font-mono'].includes(t.name));
  const t = config.typography;
  return (
    <article className="docs-page">
      <p className="docs-eyebrow">Foundations</p>
      <h1>Typography</h1>
      <p className="docs-lead">
        A modular type scale: each step is {t.scaleRatio}× the previous one, starting from a {t.baseSize}px base. Body text uses a line height of {t.lineHeight}.
        Use the <code className="docs-inline-code">Text</code> component rather than styling text by hand.
      </p>

      <h2>Font families</h2>
      <div className="docs-cards">
        {families.map((f) => (
          <div key={f.name} className="docs-font-card">
            <span className="docs-font-card__sample" style={{ fontFamily: `var(${cssVar(f.name)})` }}>Ag</span>
            <VarName name={cssVar(f.name)} />
            <span className="docs-muted">{f.description}</span>
            <code className="docs-font-card__stack">{f.value}</code>
          </div>
        ))}
      </div>

      <h2>Type scale</h2>
      <div className="docs-scale">
        {sizes.map((s) => (
          <div key={s.name} className="docs-scale__row">
            <div className="docs-scale__meta">
              <VarName name={cssVar(s.name)} />
              <span className="docs-muted">{s.value} · {s.description}</span>
            </div>
            <div className="docs-scale__sample" style={{ fontSize: `var(${cssVar(s.name)})`, fontFamily: `var(${cssVar(Number.parseFloat(s.value) >= 1.2 ? 'font-heading' : 'font-body')})` }}>
              The quick brown fox
            </div>
          </div>
        ))}
      </div>

      <h2>Weights & line heights</h2>
      <div className="docs-table-wrap">
        <table className="docs-table">
          <thead><tr><th scope="col">Token</th><th scope="col">Value</th><th scope="col">Usage</th></tr></thead>
          <tbody>
            {group.tokens.filter((tk) => tk.name.startsWith('font-weight') || tk.name.startsWith('line-height')).map((tk) => (
              <tr key={tk.name}><td><VarName name={cssVar(tk.name)} /></td><td><code>{tk.value}</code></td><td>{tk.description}</td></tr>
            ))}
          </tbody>
        </table>
      </div>
    </article>
  );
}
