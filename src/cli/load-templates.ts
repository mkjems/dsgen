import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { TemplateSources } from '../core/generate';

const TEMPLATE_ROOT = fileURLToPath(new URL('../templates', import.meta.url));

/** Read every template file from disk, keyed like the browser's import.meta.glob. */
export function loadTemplates(root = TEMPLATE_ROOT): TemplateSources {
  const out: TemplateSources = {};
  const walk = (dir: string) => {
    for (const name of readdirSync(dir)) {
      const full = join(dir, name);
      if (statSync(full).isDirectory()) walk(full);
      else out[relative(root, full).split(sep).join('/')] = readFileSync(full, 'utf8');
    }
  };
  walk(root);
  return out;
}
