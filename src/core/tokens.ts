/**
 * Token engine: derives the full token set (palettes, semantic colours,
 * typography, spacing, radii, shadows, control sizes) from a config and
 * serialises it to CSS custom properties, JSON and TypeScript.
 */
import type { DesignSystemConfig } from './config';
import {
  bestContrast, contrastRatio, generateScale, stepOffset,
  type ColorScale, type ScaleStep,
} from './color';

export type PaletteName = 'primary' | 'neutral' | 'success' | 'warning' | 'danger' | 'info';
export const PALETTES: PaletteName[] = ['primary', 'neutral', 'success', 'warning', 'danger', 'info'];

export interface TokenEntry {
  /** CSS custom property name without prefix, e.g. "color-bg". */
  name: string;
  value: string;
  description: string;
}

export interface TokenGroup {
  id: string;
  title: string;
  description: string;
  tokens: TokenEntry[];
  /** For colour groups with a dark variant. */
  dark?: TokenEntry[];
}

export interface TokenSet {
  palettes: Record<PaletteName, ColorScale>;
  baseSteps: Record<PaletteName, ScaleStep>;
  groups: TokenGroup[];
  contrastChecks: ContrastCheck[];
}

export interface ContrastCheck {
  label: string;
  theme: 'light' | 'dark';
  foreground: string;
  background: string;
  ratio: number;
  /** WCAG level reached for normal text. */
  level: 'AAA' | 'AA' | 'AA Large' | 'Fail';
}

const WHITE = '#ffffff';

function level(ratio: number): ContrastCheck['level'] {
  if (ratio >= 7) return 'AAA';
  if (ratio >= 4.5) return 'AA';
  if (ratio >= 3) return 'AA Large';
  return 'Fail';
}

const RADIUS = {
  sharp: { sm: 0, md: 0, lg: 2, xl: 4 },
  subtle: { sm: 2, md: 4, lg: 6, xl: 10 },
  rounded: { sm: 4, md: 8, lg: 12, xl: 18 },
  pill: { sm: 6, md: 999, lg: 16, xl: 24 },
} as const;

const SHADOWS = {
  none: { sm: 'none', md: 'none', lg: 'none' },
  soft: {
    sm: '0 1px 2px rgb(15 23 42 / 0.06)',
    md: '0 2px 4px rgb(15 23 42 / 0.06), 0 4px 12px rgb(15 23 42 / 0.08)',
    lg: '0 8px 16px rgb(15 23 42 / 0.08), 0 20px 40px rgb(15 23 42 / 0.12)',
  },
  strong: {
    sm: '0 1px 3px rgb(15 23 42 / 0.16)',
    md: '0 4px 8px rgb(15 23 42 / 0.14), 0 8px 20px rgb(15 23 42 / 0.16)',
    lg: '0 12px 24px rgb(15 23 42 / 0.18), 0 28px 56px rgb(15 23 42 / 0.24)',
  },
} as const;

const DENSITY = {
  compact: { sm: 28, md: 32, lg: 40 },
  comfortable: { sm: 32, md: 40, lg: 48 },
  spacious: { sm: 36, md: 44, lg: 56 },
} as const;

const round = (n: number, d = 3) => Number(n.toFixed(d));

export function buildTokens(config: DesignSystemConfig): TokenSet {
  const c = config.colors;
  const palettes = {} as Record<PaletteName, ColorScale>;
  const baseSteps = {} as Record<PaletteName, ScaleStep>;
  for (const name of PALETTES) {
    const { scale, baseStep } =
      name === 'neutral' ? generateScale(c.neutral, { maxChroma: 0.03 }) : generateScale(c[name]);
    palettes[name] = scale;
    baseSteps[name] = baseStep;
  }
  const n = palettes.neutral;
  const p = palettes.primary;

  // Light primary: the brand colour itself, unless it is too light to carry text.
  let primaryStep = baseSteps.primary;
  if (primaryStep < 400) primaryStep = 600;
  const onPrimary = bestContrast(p[primaryStep], [WHITE, n[950]]);
  const onPrimaryDark = bestContrast(p[400], [WHITE, n[950]]);

  const status = (name: 'success' | 'warning' | 'danger' | 'info', theme: 'light' | 'dark'): TokenEntry[] => {
    const s = palettes[name];
    if (theme === 'light') {
      return [
        { name: `color-${name}`, value: s[600], description: `Solid ${name} colour for fills and icons.` },
        { name: `color-on-${name}`, value: bestContrast(s[600], [WHITE, n[950]]), description: `Text placed on the solid ${name} colour.` },
        { name: `color-${name}-subtle`, value: s[50], description: `Subtle ${name} background.` },
        { name: `color-${name}-border`, value: s[200], description: `Border for ${name} surfaces.` },
        { name: `color-${name}-text`, value: s[800], description: `Readable ${name} text on subtle backgrounds.` },
      ];
    }
    return [
      { name: `color-${name}`, value: s[400], description: `Solid ${name} colour for fills and icons.` },
      { name: `color-on-${name}`, value: bestContrast(s[400], [WHITE, n[950]]), description: `Text placed on the solid ${name} colour.` },
      { name: `color-${name}-subtle`, value: s[950], description: `Subtle ${name} background.` },
      { name: `color-${name}-border`, value: s[800], description: `Border for ${name} surfaces.` },
      { name: `color-${name}-text`, value: s[200], description: `Readable ${name} text on subtle backgrounds.` },
    ];
  };

  const semanticLight: TokenEntry[] = [
    { name: 'color-bg', value: WHITE, description: 'Page background.' },
    { name: 'color-surface', value: n[50], description: 'Subtle surface, e.g. sidebars and wells.' },
    { name: 'color-surface-raised', value: WHITE, description: 'Raised surfaces such as cards, dialogs and menus.' },
    { name: 'color-surface-hover', value: n[100], description: 'Hover background for neutral interactive elements.' },
    { name: 'color-border', value: n[200], description: 'Default border and divider colour.' },
    { name: 'color-border-strong', value: n[400], description: 'Borders of form controls.' },
    { name: 'color-text', value: n[900], description: 'Primary text colour.' },
    { name: 'color-text-muted', value: n[600], description: 'Secondary text, hints and captions.' },
    { name: 'color-text-disabled', value: n[400], description: 'Text of disabled controls.' },
    { name: 'color-primary', value: p[primaryStep], description: 'Brand colour for primary actions and selected states.' },
    { name: 'color-primary-hover', value: p[stepOffset(primaryStep, 1)], description: 'Hover state of the primary colour.' },
    { name: 'color-primary-active', value: p[stepOffset(primaryStep, 2)], description: 'Pressed state of the primary colour.' },
    { name: 'color-on-primary', value: onPrimary, description: 'Text and icons placed on the primary colour.' },
    { name: 'color-primary-subtle', value: p[50], description: 'Tinted background for selected or highlighted items.' },
    { name: 'color-primary-text', value: p[700], description: 'Primary-coloured text such as links.' },
    { name: 'color-focus-ring', value: p[500], description: 'Keyboard focus outline.' },
    { name: 'color-overlay', value: 'rgb(15 23 42 / 0.5)', description: 'Backdrop behind modal dialogs.' },
    ...status('success', 'light'), ...status('warning', 'light'), ...status('danger', 'light'), ...status('info', 'light'),
  ];

  const semanticDark: TokenEntry[] = [
    { name: 'color-bg', value: n[950], description: 'Page background.' },
    { name: 'color-surface', value: n[900], description: 'Subtle surface, e.g. sidebars and wells.' },
    { name: 'color-surface-raised', value: n[900], description: 'Raised surfaces such as cards, dialogs and menus.' },
    { name: 'color-surface-hover', value: n[800], description: 'Hover background for neutral interactive elements.' },
    { name: 'color-border', value: n[800], description: 'Default border and divider colour.' },
    { name: 'color-border-strong', value: n[600], description: 'Borders of form controls.' },
    { name: 'color-text', value: n[50], description: 'Primary text colour.' },
    { name: 'color-text-muted', value: n[400], description: 'Secondary text, hints and captions.' },
    { name: 'color-text-disabled', value: n[600], description: 'Text of disabled controls.' },
    { name: 'color-primary', value: p[400], description: 'Brand colour for primary actions and selected states.' },
    { name: 'color-primary-hover', value: p[300], description: 'Hover state of the primary colour.' },
    { name: 'color-primary-active', value: p[200], description: 'Pressed state of the primary colour.' },
    { name: 'color-on-primary', value: onPrimaryDark, description: 'Text and icons placed on the primary colour.' },
    { name: 'color-primary-subtle', value: p[950], description: 'Tinted background for selected or highlighted items.' },
    { name: 'color-primary-text', value: p[300], description: 'Primary-coloured text such as links.' },
    { name: 'color-focus-ring', value: p[400], description: 'Keyboard focus outline.' },
    { name: 'color-overlay', value: 'rgb(0 0 0 / 0.6)', description: 'Backdrop behind modal dialogs.' },
    ...status('success', 'dark'), ...status('warning', 'dark'), ...status('danger', 'dark'), ...status('info', 'dark'),
  ];

  const t = config.typography;
  const sizes: [string, number, string][] = [
    ['xs', -2, 'Fine print and badges.'],
    ['sm', -1, 'Secondary text, labels and compact controls.'],
    ['md', 0, 'Body text.'],
    ['lg', 1, 'Lead paragraphs and large controls.'],
    ['xl', 2, 'Heading level 4.'],
    ['2xl', 3, 'Heading level 3.'],
    ['3xl', 4, 'Heading level 2.'],
    ['4xl', 5, 'Heading level 1.'],
    ['5xl', 6, 'Display text.'],
  ];
  const typography: TokenEntry[] = [
    { name: 'font-body', value: t.bodyFont, description: 'Font family for body text and controls.' },
    { name: 'font-heading', value: t.headingFont, description: 'Font family for headings.' },
    { name: 'font-mono', value: t.monoFont, description: 'Font family for code.' },
    ...sizes.map(([k, exp, d]) => ({
      name: `font-size-${k}`,
      value: `${round((t.baseSize * t.scaleRatio ** exp) / 16)}rem`,
      description: `${d} (${round(t.baseSize * t.scaleRatio ** exp, 1)}px)`,
    })),
    { name: 'line-height-body', value: String(t.lineHeight), description: 'Line height for running text.' },
    { name: 'line-height-heading', value: String(round(Math.max(1.1, t.lineHeight - 0.35), 2)), description: 'Line height for headings.' },
    { name: 'font-weight-regular', value: '400', description: 'Regular weight.' },
    { name: 'font-weight-medium', value: '500', description: 'Medium weight for labels and buttons.' },
    { name: 'font-weight-heading', value: String(t.headingWeight), description: 'Weight for headings.' },
  ];

  const s = config.shape;
  const spacing: TokenEntry[] = [0, 0.5, 1, 1.5, 2, 3, 4, 5, 6, 8, 10, 12, 16].map((m) => ({
    name: `space-${String(m).replace('.', '_')}`,
    value: `${(m * s.spacingUnit) / 16}rem`,
    description: `${m} × ${s.spacingUnit}px = ${m * s.spacingUnit}px`,
  }));

  const r = RADIUS[s.radius];
  const radii: TokenEntry[] = [
    { name: 'radius-sm', value: `${r.sm}px`, description: 'Small elements: checkboxes, badges, tooltips.' },
    { name: 'radius-md', value: r.md === 999 ? '999px' : `${r.md}px`, description: 'Controls: buttons, inputs, selects.' },
    { name: 'radius-lg', value: `${r.lg}px`, description: 'Containers: cards and alerts.' },
    { name: 'radius-xl', value: `${r.xl}px`, description: 'Large containers: dialogs.' },
    { name: 'radius-full', value: '999px', description: 'Fully rounded: avatars, switches, pills.' },
  ];

  const sh = SHADOWS[s.shadows];
  const shadows: TokenEntry[] = [
    { name: 'shadow-sm', value: sh.sm, description: 'Resting elevation for controls.' },
    { name: 'shadow-md', value: sh.md, description: 'Cards and popovers.' },
    { name: 'shadow-lg', value: sh.lg, description: 'Dialogs and overlays.' },
  ];

  const d = DENSITY[s.density];
  const sizing: TokenEntry[] = [
    { name: 'control-height-sm', value: `${d.sm / 16}rem`, description: `Small control height (${d.sm}px).` },
    { name: 'control-height-md', value: `${d.md / 16}rem`, description: `Medium control height (${d.md}px).` },
    { name: 'control-height-lg', value: `${d.lg / 16}rem`, description: `Large control height (${d.lg}px).` },
    { name: 'border-width', value: `${s.borderWidth}px`, description: 'Default border width.' },
    { name: 'focus-ring-width', value: '3px', description: 'Width of the keyboard focus outline.' },
    { name: 'duration-fast', value: '120ms', description: 'Hover and press transitions.' },
    { name: 'duration-normal', value: '200ms', description: 'Enter and exit transitions.' },
    { name: 'easing-standard', value: 'cubic-bezier(0.2, 0, 0, 1)', description: 'Default easing curve.' },
  ];

  const paletteTokens: TokenEntry[] = PALETTES.flatMap((name) =>
    (Object.entries(palettes[name]) as [string, string][]).map(([step, value]) => ({
      name: `${name}-${step}`,
      value,
      description: `${name} palette, step ${step}${Number(step) === baseSteps[name] && name !== 'neutral' ? ' (your base colour)' : ''}.`,
    })),
  );

  const groups: TokenGroup[] = [
    { id: 'semantic', title: 'Semantic colours', description: 'Role-based colours. Components only ever use these, which is what makes theming work.', tokens: semanticLight, dark: c.darkMode ? semanticDark : undefined },
    { id: 'palette', title: 'Palettes', description: 'Raw 11-step scales generated in the OKLCH colour space. Use semantic tokens in components; use palettes for illustrations and charts.', tokens: paletteTokens },
    { id: 'typography', title: 'Typography', description: `Modular type scale with a ${t.scaleRatio} ratio from a ${t.baseSize}px base.`, tokens: typography },
    { id: 'spacing', title: 'Spacing', description: `Spacing scale built on a ${s.spacingUnit}px unit.`, tokens: spacing },
    { id: 'radius', title: 'Radius', description: `"${s.radius}" corner style.`, tokens: radii },
    { id: 'shadow', title: 'Shadows', description: `"${s.shadows}" elevation style.`, tokens: shadows },
    { id: 'sizing', title: 'Sizing & motion', description: `"${s.density}" density, borders and motion.`, tokens: sizing },
  ];

  const find = (list: TokenEntry[], name: string) => list.find((e) => e.name === name)!.value;
  const pairs: [string, string, string][] = [
    ['Body text on background', 'color-text', 'color-bg'],
    ['Muted text on background', 'color-text-muted', 'color-bg'],
    ['Text on primary', 'color-on-primary', 'color-primary'],
    ['Primary text (links) on background', 'color-primary-text', 'color-bg'],
    ['Danger text on danger subtle', 'color-danger-text', 'color-danger-subtle'],
    ['Text on danger', 'color-on-danger', 'color-danger'],
  ];
  const contrastChecks: ContrastCheck[] = [];
  for (const [theme, list] of [['light', semanticLight], ['dark', semanticDark]] as const) {
    if (theme === 'dark' && !c.darkMode) continue;
    for (const [label, fg, bg] of pairs) {
      const ratio = contrastRatio(find(list, fg), find(list, bg));
      contrastChecks.push({ label, theme, foreground: find(list, fg), background: find(list, bg), ratio: round(ratio, 2), level: level(ratio) });
    }
  }

  return { palettes, baseSteps, groups, contrastChecks };
}

/** Serialise tokens to CSS custom properties. */
export function tokensToCss(
  tokens: TokenSet,
  prefix: string,
  opts: { selector?: string; darkSelector?: string; includeMediaQuery?: boolean } = {},
): string {
  const selector = opts.selector ?? ':root';
  const darkSelector = opts.darkSelector ?? '[data-theme="dark"]';
  const decl = (e: TokenEntry) => `  --${prefix}-${e.name}: ${e.value};`;
  const light = tokens.groups.flatMap((g) => g.tokens).map(decl).join('\n');
  let css = `${selector} {\n  color-scheme: light;\n${light}\n}\n`;
  const darkEntries = tokens.groups.flatMap((g) => g.dark ?? []);
  if (darkEntries.length) {
    const dark = darkEntries.map(decl).join('\n');
    css += `\n${darkSelector} {\n  color-scheme: dark;\n${dark}\n}\n`;
    if (opts.includeMediaQuery) {
      css += `\n@media (prefers-color-scheme: dark) {\n  ${selector}:not([data-theme="light"]) {\n    color-scheme: dark;\n${darkEntries.map((e) => '  ' + decl(e)).join('\n')}\n  }\n}\n`;
    }
  }
  return css;
}

/** Design-tokens JSON in the W3C community-group format ($value / $description). */
export function tokensToJson(tokens: TokenSet): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const g of tokens.groups) {
    const group: Record<string, unknown> = { $description: g.description };
    for (const e of g.tokens) group[e.name] = { $value: e.value, $description: e.description };
    if (g.dark) {
      const dark: Record<string, unknown> = {};
      for (const e of g.dark) dark[e.name] = { $value: e.value, $description: e.description };
      group.$dark = dark;
    }
    out[g.id] = group;
  }
  return out;
}

/** A typed TS module where each token maps to its `var(--prefix-…)` reference. */
export function tokensToTs(tokens: TokenSet, prefix: string): string {
  const camel = (s: string) => s.replace(/[-_](\w)/g, (_, ch: string) => ch.toUpperCase());
  const lines = tokens.groups.map((g) => {
    const entries = g.tokens
      .map((e) => `    /** ${e.description.replace(/\*\//g, '')} Value: \`${e.value.replace(/`/g, "'")}\` */\n    ${camel(e.name)}: 'var(--${prefix}-${e.name})',`)
      .join('\n');
    return `  ${camel(g.id)}: {\n${entries}\n  },`;
  });
  return `/**\n * Design tokens as CSS variable references. Generated — edit the generator config instead.\n * Usage: style={{ color: tokens.semantic.colorPrimary }}\n */\nexport const tokens = {\n${lines.join('\n')}\n} as const;\n\nexport type Tokens = typeof tokens;\n`;
}
