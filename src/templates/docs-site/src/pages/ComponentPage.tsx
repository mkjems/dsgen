import { config, system, slug } from '../data';
import type { ComponentDoc } from '../types';
import { Link } from '../router';
import { CodeBlock } from '../components/CodeBlock';
import { Example } from '../components/Example';
import { InlineMd } from '../components/InlineMd';
import { Playground } from '../components/Playground';
import { PropsTable } from '../components/PropsTable';
import { demos } from '../generated/demos';

export function ComponentPage({ component }: { component: ComponentDoc }) {
  const index = system.components.indexOf(component);
  const prev = system.components[index - 1];
  const next = system.components[index + 1];
  const renders = demos[component.name] ?? [];
  const hasPlayground = Boolean(component.playground);
  const toc = [
    ['examples', 'Examples'],
    ...(hasPlayground ? [['playground', 'Playground']] : []),
    ['props', 'Props'],
    ['accessibility', 'Accessibility'],
    ['guidelines', 'Usage guidelines'],
  ];

  return (
    <article className="docs-page docs-page--with-toc">
      <div className="docs-page__body">
        <p className="docs-eyebrow">{component.category}{component.foundation ? ' · Foundation' : ''}</p>
        <h1>{component.name}</h1>
        <p className="docs-lead">{component.summary}</p>
        <p><InlineMd text={component.description} /></p>
        <CodeBlock code={`import { ${component.name} } from '${config.identity.packageName}';`} />

        <h2 id="examples">Examples</h2>
        {component.examples.map((ex, i) => (
          <Example key={ex.title} example={ex} Render={renders[i]} id={`example-${slug(ex.title)}`} />
        ))}

        {hasPlayground && (
          <>
            <h2 id="playground">Playground</h2>
            <p className="docs-muted">Change the props below to see how {component.name} responds. The code updates as you go.</p>
            <Playground component={component} />
          </>
        )}

        <h2 id="props">Props</h2>
        <PropsTable component={component} />

        <h2 id="accessibility">Accessibility</h2>
        <ul className="docs-list">
          {component.accessibility.map((a) => <li key={a}><InlineMd text={a} /></li>)}
        </ul>

        <h2 id="guidelines">Usage guidelines</h2>
        <div className="docs-dodont">
          <div className="docs-dodont__col docs-dodont__col--do">
            <h3>Do</h3>
            <ul>{component.guidelines.do.map((d) => <li key={d}><InlineMd text={d} /></li>)}</ul>
          </div>
          <div className="docs-dodont__col docs-dodont__col--dont">
            <h3>Don’t</h3>
            <ul>{component.guidelines.dont.map((d) => <li key={d}><InlineMd text={d} /></li>)}</ul>
          </div>
        </div>

        <nav className="docs-pager" aria-label="Component pages">
          {prev ? <Link to={`/components/${slug(prev.name)}`}>← {prev.name}</Link> : <span />}
          {next ? <Link to={`/components/${slug(next.name)}`}>{next.name} →</Link> : <span />}
        </nav>
      </div>
      <aside className="docs-toc" aria-label="On this page">
        <p className="docs-nav__heading">On this page</p>
        <ul>
          {toc.map(([id, title]) => (
            <li key={id}><a href={`#/components/${slug(component.name)}`} onClick={(e) => { e.preventDefault(); document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }); }}>{title}</a></li>
          ))}
        </ul>
      </aside>
    </article>
  );
}
