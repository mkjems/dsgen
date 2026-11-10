import { system, slug } from '../data';
import { Link } from '../router';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { showcaseComponents } from '../generated/showcases';
import { NotFound } from './NotFound';

export function ShowcasePage({ id }: { id: string }) {
  const meta = system.showcases.find((s) => s.id === id);
  const Showcase = showcaseComponents[id];
  if (!meta || !Showcase) return <NotFound />;
  return (
    <article className="docs-page docs-page--wide">
      <p className="docs-eyebrow">Showcase</p>
      <h1>{meta.title}</h1>
      <p className="docs-lead">{meta.description}</p>
      <p className="docs-uses">
        Built with:{' '}
        {meta.requires.map((name) => (
          <Link key={name} to={`/components/${slug(name)}`} className="docs-pill">{name}</Link>
        ))}
      </p>
      <div className="docs-showcase">
        <ErrorBoundary>
          <Showcase />
        </ErrorBoundary>
      </div>
    </article>
  );
}
