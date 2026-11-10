import { config, cssVar, system } from '../data';
import { VarName } from './Swatch';

export function SpacingPage() {
  const group = (id: string) => system.tokens.groups.find((g) => g.id === id)!;
  return (
    <article className="docs-page">
      <p className="docs-eyebrow">Foundations</p>
      <h1>Spacing, radius & elevation</h1>
      <p className="docs-lead">
        All spacing is a multiple of a {config.shape.spacingUnit}px unit. Token names describe the multiple, so <code className="docs-inline-code">space-4</code> is 4 × {config.shape.spacingUnit}px = {4 * config.shape.spacingUnit}px.
        The <code className="docs-inline-code">Stack</code> component's <code className="docs-inline-code">gap</code> prop uses the same steps.
      </p>

      <h2>Spacing scale</h2>
      <div className="docs-spacing">
        {group('spacing').tokens.map((t) => (
          <div key={t.name} className="docs-spacing__row">
            <VarName name={cssVar(t.name)} />
            <span className="docs-spacing__bar" style={{ width: `var(${cssVar(t.name)})` }} />
            <span className="docs-muted">{t.description}</span>
          </div>
        ))}
      </div>

      <h2>Corner radius</h2>
      <p className="docs-muted">Style: “{config.shape.radius}”.</p>
      <div className="docs-shape-grid">
        {group('radius').tokens.map((t) => (
          <div key={t.name} className="docs-shape">
            <span className="docs-shape__box" style={{ borderRadius: `var(${cssVar(t.name)})` }} />
            <VarName name={cssVar(t.name)} />
            <span className="docs-muted">{t.value} · {t.description}</span>
          </div>
        ))}
      </div>

      <h2>Elevation</h2>
      <p className="docs-muted">Style: “{config.shape.shadows}”.</p>
      <div className="docs-shape-grid">
        {group('shadow').tokens.map((t) => (
          <div key={t.name} className="docs-shape">
            <span className="docs-shape__box docs-shape__box--shadow" style={{ boxShadow: `var(${cssVar(t.name)})` }} />
            <VarName name={cssVar(t.name)} />
            <span className="docs-muted">{t.description}</span>
          </div>
        ))}
      </div>

      <h2>Sizing & motion</h2>
      <p className="docs-muted">Density: “{config.shape.density}”. Control heights are shared by buttons, inputs and selects so they align in a row.</p>
      <div className="docs-table-wrap">
        <table className="docs-table">
          <thead><tr><th scope="col">Token</th><th scope="col">Value</th><th scope="col">Usage</th></tr></thead>
          <tbody>
            {group('sizing').tokens.map((t) => (
              <tr key={t.name}><td><VarName name={cssVar(t.name)} /></td><td><code>{t.value}</code></td><td>{t.description}</td></tr>
            ))}
          </tbody>
        </table>
      </div>
    </article>
  );
}
