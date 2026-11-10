/**
 * The complete, serialisable description of a design system.
 * Every wizard step edits exactly one section of this object, and the
 * generator turns it into a project (library + docs site).
 */

export interface IdentityConfig {
  /** Human readable name, e.g. "Acme UI". */
  name: string;
  /** npm package name, e.g. "@acme/ui". */
  packageName: string;
  /** Prefix used for CSS classes and custom properties, e.g. "acme" → `.acme-button`, `--acme-color-primary`. */
  prefix: string;
  description: string;
  version: string;
  author: string;
  license: string;
}

export interface ColorConfig {
  primary: string;
  /** Neutral base colour; its hue tints the grey scale. */
  neutral: string;
  success: string;
  warning: string;
  danger: string;
  info: string;
  /** Emit a dark theme alongside the light theme. */
  darkMode: boolean;
}

export interface TypographyConfig {
  bodyFont: string;
  headingFont: string;
  monoFont: string;
  /** Base font size in px. */
  baseSize: number;
  /** Modular scale ratio, e.g. 1.25 (major third). */
  scaleRatio: number;
  lineHeight: number;
  headingWeight: number;
}

export type RadiusStyle = 'sharp' | 'subtle' | 'rounded' | 'pill';
export type ShadowStyle = 'none' | 'soft' | 'strong';
export type Density = 'compact' | 'comfortable' | 'spacious';

export interface ShapeConfig {
  /** Base spacing unit in px (4 or 8 are common). */
  spacingUnit: number;
  radius: RadiusStyle;
  shadows: ShadowStyle;
  density: Density;
  borderWidth: number;
}

export interface ComponentsConfig {
  /** Names of included components (foundation components are always included). */
  selected: string[];
}

export type ShowcaseId = 'signup' | 'settings' | 'dashboard';

export interface DocsConfig {
  title: string;
  tagline: string;
  repositoryUrl: string;
  showcases: ShowcaseId[];
  includePlayground: boolean;
  includeHowItWorks: boolean;
}

export interface DesignSystemConfig {
  schemaVersion: 1;
  identity: IdentityConfig;
  colors: ColorConfig;
  typography: TypographyConfig;
  shape: ShapeConfig;
  components: ComponentsConfig;
  docs: DocsConfig;
}

export type ConfigSection = Exclude<keyof DesignSystemConfig, 'schemaVersion'>;

export const FONT_OPTIONS: { label: string; value: string; google?: string }[] = [
  { label: 'System UI', value: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif' },
  { label: 'Inter', value: '"Inter", system-ui, sans-serif', google: 'Inter:wght@400;500;600;700' },
  { label: 'IBM Plex Sans', value: '"IBM Plex Sans", system-ui, sans-serif', google: 'IBM+Plex+Sans:wght@400;500;600;700' },
  { label: 'Manrope', value: '"Manrope", system-ui, sans-serif', google: 'Manrope:wght@400;500;600;700;800' },
  { label: 'Source Serif 4', value: '"Source Serif 4", Georgia, serif', google: 'Source+Serif+4:wght@400;600;700' },
  { label: 'Fraunces', value: '"Fraunces", Georgia, serif', google: 'Fraunces:wght@400;600;700' },
  { label: 'Space Grotesk', value: '"Space Grotesk", system-ui, sans-serif', google: 'Space+Grotesk:wght@400;500;600;700' },
];

export const MONO_OPTIONS: { label: string; value: string; google?: string }[] = [
  { label: 'System mono', value: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace' },
  { label: 'JetBrains Mono', value: '"JetBrains Mono", ui-monospace, monospace', google: 'JetBrains+Mono:wght@400;600' },
  { label: 'IBM Plex Mono', value: '"IBM Plex Mono", ui-monospace, monospace', google: 'IBM+Plex+Mono:wght@400;600' },
];

/** Google Fonts stylesheet URL for the fonts used by a config, or null if none are web fonts. */
export function googleFontsUrl(t: TypographyConfig): string | null {
  const families = new Set<string>();
  for (const f of [t.bodyFont, t.headingFont, t.monoFont]) {
    const opt = [...FONT_OPTIONS, ...MONO_OPTIONS].find((o) => o.value === f);
    if (opt?.google) families.add(opt.google);
  }
  if (families.size === 0) return null;
  return `https://fonts.googleapis.com/css2?${[...families].map((f) => `family=${f}`).join('&')}&display=swap`;
}

export const SHOWCASES: { id: ShowcaseId; title: string; description: string; requires: string[] }[] = [
  {
    id: 'signup',
    title: 'Sign-up form',
    description: 'A complete account creation flow with validation states.',
    requires: ['Button', 'TextField', 'Checkbox', 'Card', 'Alert'],
  },
  {
    id: 'settings',
    title: 'Settings page',
    description: 'Tabs, switches, selects and a confirmation dialog.',
    requires: ['Button', 'Tabs', 'Switch', 'Select', 'RadioGroup', 'Dialog', 'Card'],
  },
  {
    id: 'dashboard',
    title: 'Team dashboard',
    description: 'Cards, badges, avatars and status indicators working together.',
    requires: ['Card', 'Badge', 'Avatar', 'Button', 'Tooltip', 'Spinner'],
  },
];
