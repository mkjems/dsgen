/**
 * The generator: turns a DesignSystemConfig plus the raw template files into
 * a complete project (component library + documentation site) as a map of
 * path → file contents. Pure and synchronous, so it runs in the browser
 * (wizard export) and in Node (CLI) alike.
 */
import type { DesignSystemConfig } from './config';
import { SHOWCASES, googleFontsUrl } from './config';
import { CATALOG, resolveComponents } from './catalog';
import type { ComponentMeta, ExampleDoc } from './meta';
import { buildTokens, tokensToCss, tokensToJson, tokensToTs } from './tokens';
import { VERSIONS } from './versions';

/** Raw template files keyed by path relative to `src/templates`, e.g. `library/src/utils/cx.ts`. */
export type TemplateSources = Record<string, string>;
export type FileMap = Record<string, string>;

export interface GenerateResult {
  files: FileMap;
  /** Human-readable notes, e.g. examples that were skipped. */
  notes: string[];
}

const TEMPLATE_PREFIX = 'ds';

/** Replace the template's `ds-` class / custom property prefix with the system prefix. */
export function applyPrefix(source: string, prefix: string): string {
  if (prefix === TEMPLATE_PREFIX) return source;
  return source.replace(/\bds-/g, `${prefix}-`);
}

/** Replace `%%key%%` placeholders (used in Markdown/HTML templates). */
function fillPlaceholders(source: string, values: Record<string, string>): string {
  return source.replace(/%%(\w+)%%/g, (m, key: string) => (key in values ? values[key] : m));
}

/** Names of catalog components referenced as JSX tags in a snippet. */
export function componentsUsedIn(code: string): string[] {
  const names = new Set<string>();
  for (const m of code.matchAll(/<([A-Z][A-Za-z]+)/g)) names.add(m[1]);
  return [...names].filter((n) => CATALOG.some((c) => c.name === n));
}

/** True when the example is a `function Demo()` component rather than a JSX expression. */
export function isComponentExample(ex: ExampleDoc): boolean {
  return /^\s*function Demo\s*\(/.test(ex.code);
}

function exampleRenderSource(ex: ExampleDoc): string {
  if (isComponentExample(ex)) return `(() => {\n${indent(ex.code, 6)}\n      return Demo;\n    })()`;
  return `function Example() {\n      return (\n        <>\n${indent(ex.code, 10)}\n        </>\n      );\n    }`;
}

function indent(text: string, spaces: number): string {
  const pad = ' '.repeat(spaces);
  return text.split('\n').map((l) => (l ? pad + l : l)).join('\n');
}

export function generateProject(config: DesignSystemConfig, templates: TemplateSources): GenerateResult {
  const notes: string[] = [];
  const files: FileMap = {};
  const { identity, docs } = config;
  const prefix = identity.prefix;
  const components = resolveComponents(config.components.selected);
  const available = new Set(components.map((c) => c.name));
  const tokens = buildTokens(config);
  const fontsUrl = googleFontsUrl(config.typography);

  const placeholders: Record<string, string> = {
    name: identity.name,
    packageName: identity.packageName,
    prefix,
    description: identity.description,
    version: identity.version,
    author: identity.author,
    license: identity.license,
    docsTitle: docs.title,
    tagline: docs.tagline,
    componentCount: String(components.length),
    componentList: components.map((c) => c.name).join(', '),
    fontsLink: fontsUrl
      ? `<link rel="preconnect" href="https://fonts.googleapis.com" />\n    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />\n    <link rel="stylesheet" href="${fontsUrl}" />`
      : '',
    firstComponent: components.find((c) => !c.foundation)?.name ?? 'Text',
  };

  // ---------------------------------------------------------------- library
  for (const [path, source] of Object.entries(templates)) {
    if (!path.startsWith('library/')) continue;
    const rel = path.slice('library/'.length);
    const compMatch = rel.match(/^src\/components\/([^/]+)\//);
    if (compMatch && !available.has(compMatch[1])) continue;
    if (rel.endsWith('/meta.ts')) continue; // docs metadata is emitted as JSON instead
    files[rel] = applyPrefix(source, prefix);
  }

  files['src/tokens/tokens.css'] = `/* Generated design tokens for ${identity.name}. Regenerate rather than editing by hand. */\n${tokensToCss(tokens, prefix, { includeMediaQuery: config.colors.darkMode })}`;
  files['src/tokens/tokens.json'] = JSON.stringify(tokensToJson(tokens), null, 2) + '\n';
  files['src/tokens/tokens.ts'] = tokensToTs(tokens, prefix);
  files['src/styles/index.css'] = `@import '../tokens/tokens.css';\n@import './base.css';\n`;

  const exportLines = components.map((c) => `export * from './components/${c.name}/${c.name}';`);
  files['src/index.ts'] = [
    `/**`,
    ` * ${identity.name} — ${identity.description}`,
    ` * Import the stylesheet once in your app: import '${identity.packageName}/styles.css';`,
    ` */`,
    `import './styles/index.css';`,
    ``,
    ...exportLines,
    `export { tokens } from './tokens/tokens';`,
    `export type { Tokens } from './tokens/tokens';`,
    `export { cx } from './utils/cx';`,
    ``,
  ].join('\n');

  files['package.json'] = JSON.stringify(
    {
      name: identity.packageName,
      version: identity.version,
      description: identity.description,
      author: identity.author,
      license: identity.license,
      type: 'module',
      main: './dist/index.js',
      module: './dist/index.js',
      types: './dist/index.d.ts',
      exports: {
        '.': { types: './dist/index.d.ts', import: './dist/index.js' },
        './styles.css': './dist/styles.css',
        './tokens.json': './dist/tokens.json',
      },
      files: ['dist'],
      sideEffects: ['**/*.css'],
      scripts: {
        build: 'vite build && tsc -p tsconfig.build.json',
        typecheck: 'tsc --noEmit && tsc --noEmit -p docs',
        docs: 'vite --config docs/vite.config.ts',
        'docs:build': 'vite build --config docs/vite.config.ts',
        'docs:preview': 'vite preview --config docs/vite.config.ts',
      },
      peerDependencies: { react: '>=19', 'react-dom': '>=19' },
      devDependencies: {
        '@mdx-js/rollup': VERSIONS.mdxRollup,
        'remark-gfm': VERSIONS.remarkGfm,
        '@types/mdx': VERSIONS.typesMdx,
        '@types/node': VERSIONS.typesNode,
        '@types/react': VERSIONS.typesReact,
        '@types/react-dom': VERSIONS.typesReactDom,
        '@vitejs/plugin-react': VERSIONS.pluginReact,
        react: VERSIONS.react,
        'react-dom': VERSIONS.react,
        typescript: VERSIONS.typescript,
        vite: VERSIONS.vite,
      },
    },
    null,
    2,
  ) + '\n';

  files['tsconfig.json'] = JSON.stringify(
    {
      compilerOptions: {
        target: 'ES2022',
        lib: ['ES2023', 'DOM', 'DOM.Iterable'],
        module: 'ESNext',
        moduleResolution: 'Bundler',
        jsx: 'react-jsx',
        strict: true,
        skipLibCheck: true,
        isolatedModules: true,
        resolveJsonModule: true,
        noEmit: true,
        types: ['vite/client'],
      },
      include: ['src'],
    },
    null,
    2,
  ) + '\n';

  files['tsconfig.build.json'] = JSON.stringify(
    {
      extends: './tsconfig.json',
      compilerOptions: { noEmit: false, declaration: true, emitDeclarationOnly: true, outDir: 'dist', rootDir: 'src' },
      include: ['src'],
    },
    null,
    2,
  ) + '\n';

  files['vite.config.ts'] = `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { readFileSync } from 'node:fs';

// Library build: dist/index.js (ESM), dist/styles.css and dist/tokens.json.
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'emit-tokens-json',
      generateBundle() {
        this.emitFile({ type: 'asset', fileName: 'tokens.json', source: readFileSync('src/tokens/tokens.json', 'utf8') });
      },
    },
  ],
  build: {
    lib: { entry: 'src/index.ts', formats: ['es'], fileName: 'index', cssFileName: 'styles' },
    rollupOptions: { external: ['react', 'react-dom', 'react/jsx-runtime'] },
    sourcemap: true,
  },
});
`;

  files['design-system.config.json'] = JSON.stringify(config, null, 2) + '\n';
  files['.gitignore'] = 'node_modules\ndist\ndocs/dist\n*.log\n.DS_Store\n';

  // ---------------------------------------------------------------- docs site
  const showcases = SHOWCASES.filter((s) => docs.showcases.includes(s.id)).filter((s) => {
    const missing = s.requires.filter((r) => !available.has(r));
    if (missing.length) notes.push(`Showcase "${s.title}" skipped (needs ${missing.join(', ')}).`);
    return missing.length === 0;
  });

  const contentPages = [
    { id: 'getting-started', title: 'Getting started', file: 'getting-started.mdx', include: true },
    { id: 'how-it-works', title: 'How it works', file: 'how-it-works.mdx', include: docs.includeHowItWorks },
    { id: 'theming', title: 'Theming & dark mode', file: 'theming.mdx', include: true },
  ].filter((p) => p.include);

  for (const [path, source] of Object.entries(templates)) {
    if (!path.startsWith('docs-site/')) continue;
    const rel = path.slice('docs-site/'.length);
    const showcaseMatch = rel.match(/^src\/showcases\/(\w+)\.tsx$/);
    if (showcaseMatch && !showcases.some((s) => s.id === showcaseMatch[1].toLowerCase())) continue;
    const contentMatch = rel.match(/^content\/(.+)\.mdx$/);
    if (contentMatch && !contentPages.some((p) => p.file === `${contentMatch[1]}.mdx`)) continue;
    let out = applyPrefix(source, prefix);
    if (/\.(mdx|md|html)$/.test(rel)) out = fillPlaceholders(out, placeholders);
    files[`docs/${rel}`] = out;
  }

  // Docs data: config, tokens and component metadata.
  const docComponents = components.map((c) => docsComponent(c, available, notes, prefix, docs.includePlayground));
  files['docs/src/generated/system.json'] = JSON.stringify(
    {
      generatedAt: new Date().toISOString(),
      config,
      tokens: { groups: tokens.groups, palettes: tokens.palettes, baseSteps: tokens.baseSteps, contrastChecks: tokens.contrastChecks },
      components: docComponents,
      showcases: showcases.map(({ id, title, description, requires }) => ({ id, title, description, requires })),
      pages: contentPages.map(({ id, title }) => ({ id, title })),
    },
    null,
    2,
  ) + '\n';

  files['docs/src/generated/demos.tsx'] = demosModule(components, docComponents);
  files['docs/src/generated/content.ts'] = [
    `// Generated: MDX content pages included in this docs site.`,
    `import type { MDXContent } from 'mdx/types';`,
    ...contentPages.map((p, i) => `import Page${i} from '../../content/${p.file}';`),
    ``,
    `export const contentPages: Record<string, MDXContent> = {`,
    ...contentPages.map((p, i) => `  '${p.id}': Page${i},`),
    `};`,
    ``,
  ].join('\n');
  files['docs/src/generated/showcases.ts'] = [
    `// Generated: showcase pages composed from the selected components.`,
    `import type { ComponentType } from 'react';`,
    ...showcases.map((s) => `import ${pascal(s.id)} from '../showcases/${pascal(s.id)}';`),
    ``,
    `export const showcaseComponents: Record<string, ComponentType> = {`,
    ...showcases.map((s) => `  '${s.id}': ${pascal(s.id)},`),
    `};`,
    ``,
  ].join('\n');

  files['README.md'] = readme(config, components, showcases.map((s) => s.title));
  return { files, notes };
}

const pascal = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export interface DocsComponent extends Omit<ComponentMeta, 'examples' | 'playground'> {
  examples: (ExampleDoc & { stateful: boolean })[];
  playground?: ComponentMeta['playground'];
}

function docsComponent(
  meta: ComponentMeta,
  available: Set<string>,
  notes: string[],
  prefix: string,
  includePlayground: boolean,
): DocsComponent {
  const examples = meta.examples.filter((ex) => {
    const missing = componentsUsedIn(ex.code).filter((n) => !available.has(n));
    if (missing.length) notes.push(`${meta.name} example "${ex.title}" skipped (uses ${missing.join(', ')}).`);
    return missing.length === 0;
  });
  let playground = includePlayground ? meta.playground : undefined;
  if (playground && componentsUsedIn(playground.template).some((n) => !available.has(n))) playground = undefined;
  return {
    ...meta,
    description: applyPrefix(meta.description, prefix),
    examples: examples.map((ex) => ({ ...ex, code: applyPrefix(ex.code, prefix), stateful: isComponentExample(ex) })),
    playground: playground && { ...playground, template: applyPrefix(playground.template, prefix) },
  };
}

function demosModule(components: ComponentMeta[], docs: DocsComponent[]): string {
  const names = components.map((c) => c.name);
  const lines: string[] = [
    `// Generated: live renderers for every documented example and playground.`,
    `// Each example's source is also stored as a string in system.json for display.`,
    `import { useState, type ComponentType, type ReactElement } from 'react';`,
    `import { ${names.join(', ')} } from '@lib';`,
    ``,
    `void useState;`,
    ``,
    `export const demos: Record<string, ComponentType[]> = {`,
  ];
  for (const d of docs) {
    lines.push(`  ${d.name}: [`);
    for (const ex of d.examples) lines.push(`    ${exampleRenderSource(ex)},`);
    lines.push(`  ],`);
  }
  lines.push(`};`, ``);
  lines.push(`// eslint-disable-next-line @typescript-eslint/no-explicit-any`);
  lines.push(`export const playgrounds: Record<string, (props: any) => ReactElement> = {`);
  for (const d of docs) {
    if (d.playground) lines.push(`  ${d.name}: (props) => (\n${indent(d.playground.template, 4)}\n  ),`);
  }
  lines.push(`};`, ``);
  return lines.join('\n');
}

function readme(config: DesignSystemConfig, components: ComponentMeta[], showcases: string[]): string {
  const { identity } = config;
  const byCategory = new Map<string, string[]>();
  for (const c of components) byCategory.set(c.category, [...(byCategory.get(c.category) ?? []), c.name]);
  return `# ${identity.name}

${identity.description}

This package was generated by **Design System Generator** from \`design-system.config.json\`.
It contains a React component library, design tokens and a documentation site.

## Install & use

\`\`\`bash
npm install ${identity.packageName}
\`\`\`

\`\`\`tsx
import '${identity.packageName}/styles.css';
import { Button } from '${identity.packageName}';

export function App() {
  return <Button variant="solid">Hello</Button>;
}
\`\`\`

## Develop

\`\`\`bash
npm install
npm run docs        # documentation site with live examples at http://localhost:5173
npm run build       # library → dist/ (ESM, types, styles.css, tokens.json)
npm run docs:build  # static docs site → docs/dist/
npm run typecheck
\`\`\`

## What's inside

| Path | Contents |
| --- | --- |
| \`src/components/\` | ${components.length} components, each a \`.tsx\` file plus a \`.css\` file |
| \`src/tokens/\` | Design tokens as CSS custom properties, W3C JSON and a typed TS module |
| \`src/styles/\` | Global base styles and the stylesheet entry |
| \`docs/\` | Vite + MDX documentation site |
| \`design-system.config.json\` | The configuration this system was generated from |

### Components

${[...byCategory].map(([cat, names]) => `- **${cat}:** ${names.join(', ')}`).join('\n')}

${showcases.length ? `### Showcase pages\n\n${showcases.map((s) => `- ${s}`).join('\n')}\n` : ''}
## Conventions

- Every class and custom property is prefixed with \`${identity.prefix}-\` (e.g. \`.${identity.prefix}-button\`, \`--${identity.prefix}-color-primary\`).
- Components only use **semantic** tokens (\`--${identity.prefix}-color-text\`, \`--${identity.prefix}-color-primary\`, …), so themes are swapped by redefining those variables.
${config.colors.darkMode ? `- Dark mode: set \`data-theme="dark"\` on \`<html>\`, or rely on \`prefers-color-scheme\`.\n` : ''}- All components forward unknown props to their root element and support \`className\`.

## License

${identity.license}
`;
}
