/**
 * Generate a design system from a config file.
 *   npm run generate -- <config.json> <out-dir> [--force]
 */
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { generateProject } from '../core/generate';
import { normalizeConfig, validateConfig } from '../core/defaults';
import { loadTemplates } from './load-templates';

const args = process.argv.slice(2);
const force = args.includes('--force');
const [configPath, outDir] = args.filter((a) => !a.startsWith('--'));
if (!configPath || !outDir) {
  console.error('Usage: npm run generate -- <config.json> <out-dir> [--force]');
  process.exit(1);
}

const raw = JSON.parse(readFileSync(configPath, 'utf8'));
// Accept either a bare config or a wizard state export ({ config: … }).
const config = normalizeConfig(raw.config ?? raw);

let hasErrors = false;
for (const [section, issues] of Object.entries(validateConfig(config))) {
  for (const i of issues) {
    console.log(`${i.severity === 'error' ? '✖' : '⚠'} ${section}.${i.field}: ${i.message}`);
    if (i.severity === 'error') hasErrors = true;
  }
}
if (hasErrors) process.exit(1);

const out = resolve(outDir);
if (existsSync(out) && readdirSync(out).length > 0) {
  if (!force) {
    console.error(`${out} is not empty. Pass --force to replace generated files (node_modules is kept).`);
    process.exit(1);
  }
  for (const entry of readdirSync(out)) if (entry !== 'node_modules') rmSync(join(out, entry), { recursive: true, force: true });
}

const { files, notes } = generateProject(config, loadTemplates());
for (const [path, contents] of Object.entries(files)) {
  const target = join(out, path);
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, contents);
}
for (const n of notes) console.log(`ℹ ${n}`);
console.log(`✔ Generated ${Object.keys(files).length} files for "${config.identity.name}" in ${out}`);
