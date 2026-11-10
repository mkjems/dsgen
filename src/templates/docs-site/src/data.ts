import raw from './generated/system.json';
import type { SystemData } from './types';

export const system = raw as unknown as SystemData;
export const { config } = system;
export const prefix = config.identity.prefix;

export const CATEGORY_ORDER = ['Layout', 'Typography', 'Actions', 'Forms', 'Data display', 'Feedback', 'Overlays'];

export function componentsByCategory() {
  const groups = new Map<string, SystemData['components']>();
  for (const cat of CATEGORY_ORDER) groups.set(cat, []);
  for (const c of system.components) {
    if (!groups.has(c.category)) groups.set(c.category, []);
    groups.get(c.category)!.push(c);
  }
  return [...groups].filter(([, list]) => list.length > 0);
}

export const slug = (name: string) => name.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
export const findComponent = (s: string) => system.components.find((c) => slug(c.name) === s);
export const cssVar = (name: string) => `--${prefix}-${name}`;
