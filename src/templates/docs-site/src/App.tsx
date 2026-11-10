import { useEffect, useState } from 'react';
import { componentsByCategory, config, findComponent, system, slug } from './data';
import { Link, useRoute } from './router';
import { ThemeToggle } from './components/ThemeToggle';
import { HomePage } from './pages/HomePage';
import { ComponentPage } from './pages/ComponentPage';
import { ColorsPage } from './pages/ColorsPage';
import { TypographyPage } from './pages/TypographyPage';
import { SpacingPage } from './pages/SpacingPage';
import { TokensPage } from './pages/TokensPage';
import { ContentPage } from './pages/ContentPage';
import { ShowcasePage } from './pages/ShowcasePage';
import { NotFound } from './pages/NotFound';

const FOUNDATIONS = [
  { id: 'colors', title: 'Colours' },
  { id: 'typography', title: 'Typography' },
  { id: 'spacing', title: 'Spacing, radius & elevation' },
  { id: 'tokens', title: 'All tokens' },
];

function Page({ route }: { route: string }) {
  const [, section, id] = route.split('/');
  if (route === '/' || route === '') return <HomePage />;
  if (section === 'docs' && id) return <ContentPage id={id} />;
  if (section === 'foundations') {
    if (id === 'colors') return <ColorsPage />;
    if (id === 'typography') return <TypographyPage />;
    if (id === 'spacing') return <SpacingPage />;
    if (id === 'tokens') return <TokensPage />;
  }
  if (section === 'components' && id) {
    const c = findComponent(id);
    if (c) return <ComponentPage key={c.name} component={c} />;
  }
  if (section === 'showcases' && id) return <ShowcasePage key={id} id={id} />;
  return <NotFound />;
}

export function App() {
  const route = useRoute();
  const [navOpen, setNavOpen] = useState(false);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    setNavOpen(false);
    window.scrollTo(0, 0);
    const main = document.getElementById('main');
    main?.focus({ preventScroll: true });
  }, [route]);

  const isActive = (path: string) => route === path;
  const match = (text: string) => text.toLowerCase().includes(filter.trim().toLowerCase());

  return (
    <div className="docs-shell">
      <a href="#main" className="docs-skip" onClick={(e) => { e.preventDefault(); document.getElementById('main')?.focus(); }}>
        Skip to content
      </a>
      <header className="docs-header">
        <button type="button" className="docs-icon-button docs-menu" aria-expanded={navOpen} aria-controls="docs-nav" onClick={() => setNavOpen(!navOpen)}>
          <span aria-hidden="true">☰</span>
          <span className="docs-visually-hidden">Menu</span>
        </button>
        <Link to="/" className="docs-brand">
          <span className="docs-brand__mark" aria-hidden="true">{config.docs.title.charAt(0)}</span>
          <span>{config.docs.title}</span>
        </Link>
        <span className="docs-version">v{config.identity.version}</span>
        <div className="docs-header__spacer" />
        {config.docs.repositoryUrl && (
          <a className="docs-header__link" href={config.docs.repositoryUrl} target="_blank" rel="noreferrer">Repository</a>
        )}
        {config.colors.darkMode && <ThemeToggle />}
      </header>

      <nav id="docs-nav" className={`docs-nav${navOpen ? ' docs-nav--open' : ''}`} aria-label="Documentation">
        <label className="docs-visually-hidden" htmlFor="docs-filter">Filter navigation</label>
        <input id="docs-filter" className="docs-nav__filter" type="search" placeholder="Filter…" value={filter} onChange={(e) => setFilter(e.target.value)} />

        <div className="docs-nav__group">
          <p className="docs-nav__heading">Guides</p>
          <ul>
            {match('Overview') && <li><Link to="/" aria-current={isActive('/') ? 'page' : undefined}>Overview</Link></li>}
            {system.pages.filter((p) => match(p.title)).map((p) => (
              <li key={p.id}><Link to={`/docs/${p.id}`} aria-current={isActive(`/docs/${p.id}`) ? 'page' : undefined}>{p.title}</Link></li>
            ))}
          </ul>
        </div>

        <div className="docs-nav__group">
          <p className="docs-nav__heading">Foundations</p>
          <ul>
            {FOUNDATIONS.filter((f) => match(f.title)).map((f) => (
              <li key={f.id}><Link to={`/foundations/${f.id}`} aria-current={isActive(`/foundations/${f.id}`) ? 'page' : undefined}>{f.title}</Link></li>
            ))}
          </ul>
        </div>

        {componentsByCategory().map(([category, list]) => {
          const visible = list.filter((c) => match(c.name) || match(category));
          if (!visible.length) return null;
          return (
            <div className="docs-nav__group" key={category}>
              <p className="docs-nav__heading">{category}</p>
              <ul>
                {visible.map((c) => (
                  <li key={c.name}><Link to={`/components/${slug(c.name)}`} aria-current={isActive(`/components/${slug(c.name)}`) ? 'page' : undefined}>{c.name}</Link></li>
                ))}
              </ul>
            </div>
          );
        })}

        {system.showcases.length > 0 && (
          <div className="docs-nav__group">
            <p className="docs-nav__heading">Showcases</p>
            <ul>
              {system.showcases.filter((s) => match(s.title)).map((s) => (
                <li key={s.id}><Link to={`/showcases/${s.id}`} aria-current={isActive(`/showcases/${s.id}`) ? 'page' : undefined}>{s.title}</Link></li>
              ))}
            </ul>
          </div>
        )}
      </nav>
      {navOpen && <div className="docs-scrim" onClick={() => setNavOpen(false)} aria-hidden="true" />}

      <main id="main" className="docs-main" tabIndex={-1}>
        <Page route={route} />
        <footer className="docs-footer">
          {config.identity.name} {config.identity.version} · {config.identity.license} · Generated {new Date(system.generatedAt).toLocaleDateString()}
        </footer>
      </main>
    </div>
  );
}
