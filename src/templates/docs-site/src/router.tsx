import { useEffect, useState, type AnchorHTMLAttributes } from 'react';

/** Minimal hash router so the static build works on any host (no server rewrites needed). */
function current() {
  const hash = window.location.hash.replace(/^#/, '');
  const [path] = hash.split('?');
  return path || '/';
}

export function useRoute(): string {
  const [route, setRoute] = useState(current);
  useEffect(() => {
    const onChange = () => setRoute(current());
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);
  return route;
}

export function navigate(path: string) {
  window.location.hash = path;
}

export function Link({ to, ...rest }: AnchorHTMLAttributes<HTMLAnchorElement> & { to: string }) {
  return <a href={`#${to}`} {...rest} />;
}
