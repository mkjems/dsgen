import { componentsByCategory, config, system, slug } from '../data';
import { Link } from '../router';
import { CodeBlock } from '../components/CodeBlock';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { demos } from '../generated/demos';

export function HomePage() {
  const tokenCount = system.tokens.groups.reduce((n, g) => n + g.tokens.length, 0);
  const firstPage = system.pages[0];
  return (
    <article className="docs-page">
      <section className="docs-hero">
        <p className="docs-eyebrow">Design system · v{config.identity.version}</p>
        <h1 className="docs-hero__title">{config.docs.title}</h1>
        <p className="docs-hero__tagline">{config.docs.tagline}</p>
        <p className="docs-hero__desc">{config.identity.description}</p>
        <div className="docs-hero__actions">
          {firstPage && <Link className="docs-cta docs-cta--primary" to={`/docs/${firstPage.id}`}>Get started</Link>}
          <Link className="docs-cta" to={`/components/${slug(system.components.find((c) => !c.foundation)?.name ?? system.components[0].name)}`}>Browse components</Link>
        </div>
        <dl className="docs-stats">
          <div><dt>Components</dt><dd>{system.components.length}</dd></div>
          <div><dt>Design tokens</dt><dd>{tokenCount}</dd></div>
          <div><dt>Themes</dt><dd>{config.colors.darkMode ? 'Light + dark' : 'Light'}</dd></div>
          <div><dt>Showcases</dt><dd>{system.showcases.length}</dd></div>
        </dl>
      </section>

      <section className="docs-section">
        <h2>Quick start</h2>
        <CodeBlock language="bash" code={`npm install ${config.identity.packageName}`} />
        <CodeBlock code={`import '${config.identity.packageName}/styles.css';\nimport { ${system.components.filter((c) => !c.foundation).slice(0, 2).map((c) => c.name).concat('Stack').join(', ')} } from '${config.identity.packageName}';`} />
      </section>

      <section className="docs-section">
        <h2>Components</h2>
        <p className="docs-lead">Every component ships with live examples, an interactive playground, a complete props reference and accessibility notes.</p>
        {componentsByCategory().map(([category, list]) => (
          <div key={category} className="docs-gallery-group">
            <h3 className="docs-gallery-group__title">{category}</h3>
            <div className="docs-gallery">
              {list.map((c) => {
                const Preview = demos[c.name]?.[0];
                return (
                  <Link key={c.name} to={`/components/${slug(c.name)}`} className="docs-gallery__card">
                    <div className="docs-gallery__preview" aria-hidden="true" inert>
                      {Preview ? <ErrorBoundary><Preview /></ErrorBoundary> : null}
                    </div>
                    <div className="docs-gallery__meta">
                      <strong>{c.name}</strong>
                      <span>{c.summary}</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </section>

      <section className="docs-section">
        <h2>Foundations</h2>
        <div className="docs-cards">
          <Link to="/foundations/colors" className="docs-card-link">
            <div className="docs-mini-palette" aria-hidden="true">
              {Object.values(system.tokens.palettes.primary).map((hex) => <span key={hex} style={{ background: hex }} />)}
            </div>
            <strong>Colours</strong><span>Palettes, semantic roles and contrast checks.</span>
          </Link>
          <Link to="/foundations/typography" className="docs-card-link">
            <span className="docs-type-sample" aria-hidden="true">Aa</span>
            <strong>Typography</strong><span>Fonts and a {config.typography.scaleRatio} modular scale.</span>
          </Link>
          <Link to="/foundations/spacing" className="docs-card-link">
            <span className="docs-space-sample" aria-hidden="true"><i /><i /><i /><i /></span>
            <strong>Spacing & shape</strong><span>{config.shape.spacingUnit}px grid, {config.shape.radius} corners, {config.shape.shadows} shadows.</span>
          </Link>
        </div>
      </section>

      {system.showcases.length > 0 && (
        <section className="docs-section">
          <h2>See it in action</h2>
          <div className="docs-cards">
            {system.showcases.map((s) => (
              <Link key={s.id} to={`/showcases/${s.id}`} className="docs-card-link">
                <strong>{s.title}</strong><span>{s.description}</span>
              </Link>
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
