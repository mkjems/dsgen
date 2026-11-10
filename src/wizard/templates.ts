import type { TemplateSources } from '../core/generate';

/** All template files as raw strings, bundled by Vite. Keys match the Node loader. */
const modules = import.meta.glob('../templates/**/*', { query: '?raw', import: 'default', eager: true }) as Record<string, string>;

export const TEMPLATES: TemplateSources = Object.fromEntries(
  Object.entries(modules).map(([path, source]) => [path.replace('../templates/', ''), source]),
);
