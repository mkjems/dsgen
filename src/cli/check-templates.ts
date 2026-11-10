/**
 * Self-checks for the generator. Run with `npm run check:templates`.
 *  1. Every documented prop exists in the component source.
 *  2. Every example and playground compiles.
 *  3. Generated output contains no leftover template prefix.
 *  4. Generation respects component selection.
 *  5. The wizard state reducer behaves (merge, undo/redo, snapshots).
 */
import { transform } from 'sucrase';
import { CATALOG } from '../core/catalog';
import { DEFAULT_CONFIG, validateConfig } from '../core/defaults';
import { generateProject } from '../core/generate';
import { initialState, reducer } from '../wizard/state';
import { loadTemplates } from './load-templates';

const templates = loadTemplates();
let failures = 0;
const fail = (msg: string) => { failures++; console.log(`✖ ${msg}`); };
const pass = (msg: string) => console.log(`✔ ${msg}`);

// Native attributes documented for completeness but forwarded via ...rest.
const NATIVE = new Set(['children', 'disabled', 'type', 'placeholder', 'required', 'checked', 'defaultChecked', 'value / onChange', 'aria-label']);

// 1. props ↔ source
for (const meta of CATALOG) {
  const src = templates[`library/src/components/${meta.name}/${meta.name}.tsx`];
  if (!src) { fail(`${meta.name}: missing source`); continue; }
  const missing = meta.props.filter((p) => !NATIVE.has(p.name) && !new RegExp(`\\b${p.name}\\??:`).test(src));
  if (missing.length) fail(`${meta.name}: documented props not in source: ${missing.map((p) => p.name).join(', ')}`);
  if (!templates[`library/src/components/${meta.name}/${meta.name}.css`]) fail(`${meta.name}: missing CSS`);
}
pass(`Props documented for ${CATALOG.length} components match their sources`);

// 2. examples compile
let compiled = 0;
for (const meta of CATALOG) {
  const snippets = [...meta.examples.map((e) => e.code), ...(meta.playground ? [meta.playground.template] : [])];
  for (const code of snippets) {
    const wrapped = /^\s*function Demo/.test(code) ? code : `const X = () => (<>\n${code}\n</>);`;
    try {
      transform(wrapped, { transforms: ['jsx', 'typescript'] });
      compiled++;
    } catch (e) {
      fail(`${meta.name}: snippet does not compile: ${(e as Error).message}`);
    }
  }
}
pass(`${compiled} examples and playgrounds compile`);

// 3. prefix rewriting
const cfg = { ...DEFAULT_CONFIG, identity: { ...DEFAULT_CONFIG.identity, prefix: 'zz' } };
const { files } = generateProject(cfg, templates);
const leftovers = Object.entries(files).filter(([p, c]) => /\.(tsx?|css|mdx)$/.test(p) && /(\.|--|["'`\s])ds-/.test(c)).map(([p]) => p);
if (leftovers.length) fail(`Template prefix left in: ${leftovers.join(', ')}`);
else pass(`No "ds-" prefix left in ${Object.keys(files).length} generated files`);
if (!files['src/tokens/tokens.css'].includes('--zz-color-primary')) fail('tokens.css lacks the custom prefix');

// 4. selection
const small = generateProject({ ...DEFAULT_CONFIG, components: { selected: ['Button'] } }, templates);
const comps = Object.keys(small.files).filter((p) => p.startsWith('src/components/')).map((p) => p.split('/')[2]);
const unique = [...new Set(comps)].sort().join(',');
if (unique !== 'Button,Stack,Text') fail(`Selection not respected: ${unique}`);
else pass('Only selected + foundation components are generated');
if (small.notes.length === 0) fail('Expected notes about skipped showcases/examples');
if (Object.values(validateConfig(DEFAULT_CONFIG)).flat().some((i) => i.severity === 'error')) fail('Default config has errors');

// 5. reducer
let s = initialState();
s = reducer(s, { type: 'update', section: 'identity', patch: { name: 'A' }, summary: 'a' });
s = reducer(s, { type: 'update', section: 'identity', patch: { name: 'AB' }, summary: 'ab' });
if (s.past.length !== 1) fail(`Rapid edits should merge into one undo entry (got ${s.past.length})`);
s = reducer(s, { type: 'complete', step: 'identity' });
s = reducer(s, { type: 'update', section: 'colors', patch: { primary: '#000000' }, summary: 'c' });
s = reducer(s, { type: 'undo' });
if (s.config.colors.primary !== DEFAULT_CONFIG.colors.primary) fail('Undo did not restore colours');
s = reducer(s, { type: 'redo' });
if (s.config.colors.primary !== '#000000') fail('Redo did not re-apply colours');
s = reducer(s, { type: 'update', section: 'identity', patch: { name: 'Changed later' }, summary: 'x' });
s = reducer(s, { type: 'restoreSnapshot', step: 'identity', index: 0 });
if (s.config.identity.name !== 'AB') fail('Snapshot restore failed');
if (s.steps.identity.status !== 'complete' || s.steps.identity.snapshots.length !== 1) fail('Step bookkeeping wrong');
pass('Wizard reducer: merge, undo/redo and snapshot restore');

console.log(failures ? `\n${failures} check(s) failed` : '\nAll checks passed');
process.exit(failures ? 1 : 0);
