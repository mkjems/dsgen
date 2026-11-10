import { config, cssVar, system } from '../data';
import { Swatch, VarName } from './Swatch';

function contrastLevelClass(level: string) {
  return level === 'Fail' ? 'docs-level docs-level--fail' : level === 'AA Large' ? 'docs-level docs-level--warn' : 'docs-level docs-level--pass';
}

export function ColorsPage() {
  const semantic = system.tokens.groups.find((g) => g.id === 'semantic')!;
  const palettes = system.tokens.palettes;
  return (
    <article className="docs-page">
      <p className="docs-eyebrow">Foundations</p>
      <h1>Colours</h1>
      <p className="docs-lead">
        Colours are organised in two layers. <strong>Palettes</strong> are raw 11-step scales generated in OKLCH from your brand colours.
        <strong> Semantic tokens</strong> give those colours a role — background, text, primary action — and are the only colours components use.
        {config.colors.darkMode && ' Dark mode swaps the semantic layer; components never change.'}
      </p>

      <h2>Palettes</h2>
      <p className="docs-muted">The outlined step is your exact base colour. Steps run from 50 (lightest) to 950 (darkest).</p>
      <div className="docs-palettes">
        {Object.entries(palettes).map(([name, scale]) => (
          <div key={name} className="docs-palette">
            <div className="docs-palette__name">{name}</div>
            <div className="docs-palette__steps">
              {Object.entries(scale).map(([step, hex]) => (
                <div key={step} className={`docs-palette__step${Number(step) === system.tokens.baseSteps[name] && name !== 'neutral' ? ' docs-palette__step--base' : ''}`}>
                  <span className="docs-palette__chip" style={{ background: hex }} />
                  <span className="docs-palette__label">{step}</span>
                  <code className="docs-palette__hex">{hex}</code>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <h2>Semantic colours</h2>
      <p className="docs-muted">Use these in your own CSS through the custom property, e.g. <code className="docs-inline-code">color: var({cssVar('color-text')})</code>.</p>
      <div className="docs-table-wrap">
        <table className="docs-table">
          <thead>
            <tr>
              <th scope="col">Token</th>
              <th scope="col">Light</th>
              {semantic.dark && <th scope="col">Dark</th>}
              <th scope="col">Role</th>
            </tr>
          </thead>
          <tbody>
            {semantic.tokens.map((t, i) => (
              <tr key={t.name}>
                <td><VarName name={cssVar(t.name)} /></td>
                <td><Swatch color={t.value} /></td>
                {semantic.dark && <td><Swatch color={semantic.dark[i].value} /></td>}
                <td>{t.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2>Contrast checks</h2>
      <p className="docs-muted">WCAG 2 contrast ratios for key text/background pairs. AA requires 4.5:1 for normal text and 3:1 for large text.</p>
      <div className="docs-contrast">
        {system.tokens.contrastChecks.map((c) => (
          <div key={c.label + c.theme} className="docs-contrast__item">
            <div className="docs-contrast__sample" style={{ background: c.background, color: c.foreground }}>Aa</div>
            <div className="docs-contrast__info">
              <strong>{c.label}</strong>
              <span className="docs-muted">{c.theme} theme · {c.ratio}:1</span>
            </div>
            <span className={contrastLevelClass(c.level)}>{c.level}</span>
          </div>
        ))}
      </div>
    </article>
  );
}
