import { Link } from '../router';

export function NotFound() {
  return (
    <article className="docs-page">
      <h1>Page not found</h1>
      <p className="docs-lead">That page does not exist in this documentation.</p>
      <Link to="/" className="docs-cta docs-cta--primary">Back to overview</Link>
    </article>
  );
}
