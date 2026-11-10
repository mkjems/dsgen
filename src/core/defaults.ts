import type { ConfigSection, DesignSystemConfig } from './config';
import { FONT_OPTIONS, MONO_OPTIONS, SHOWCASES } from './config';
import { CATALOG, CATALOG_BY_NAME, FOUNDATION_COMPONENTS } from './catalog';
import { isHex } from './color';

export const DEFAULT_CONFIG: DesignSystemConfig = {
  schemaVersion: 1,
  identity: {
    name: 'Acme UI',
    packageName: '@acme/ui',
    prefix: 'acme',
    description: 'The design system for Acme products.',
    version: '0.1.0',
    author: 'Acme Design Team',
    license: 'MIT',
  },
  colors: {
    primary: '#4f46e5',
    neutral: '#64748b',
    success: '#16a34a',
    warning: '#d97706',
    danger: '#dc2626',
    info: '#0284c7',
    darkMode: true,
  },
  typography: {
    bodyFont: FONT_OPTIONS[1].value,
    headingFont: FONT_OPTIONS[1].value,
    monoFont: MONO_OPTIONS[1].value,
    baseSize: 16,
    scaleRatio: 1.25,
    lineHeight: 1.55,
    headingWeight: 700,
  },
  shape: {
    spacingUnit: 4,
    radius: 'rounded',
    shadows: 'soft',
    density: 'comfortable',
    borderWidth: 1,
  },
  components: {
    selected: CATALOG.filter((c) => !c.foundation).map((c) => c.name),
  },
  docs: {
    title: 'Acme UI',
    tagline: 'Build consistent, accessible Acme products faster.',
    repositoryUrl: '',
    showcases: ['signup', 'settings', 'dashboard'],
    includePlayground: true,
    includeHowItWorks: true,
  },
};

export interface ValidationIssue {
  field: string;
  message: string;
  severity: 'error' | 'warning';
}

/** Validate one section of the config. Errors block export; warnings are advisory. */
export function validateSection(config: DesignSystemConfig, section: ConfigSection): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const err = (field: string, message: string) => issues.push({ field, message, severity: 'error' });
  const warn = (field: string, message: string) => issues.push({ field, message, severity: 'warning' });

  switch (section) {
    case 'identity': {
      const i = config.identity;
      if (!i.name.trim()) err('name', 'Give your design system a name.');
      if (!/^(@[a-z0-9-~][a-z0-9-._~]*\/)?[a-z0-9-~][a-z0-9-._~]*$/.test(i.packageName))
        err('packageName', 'Must be a valid npm package name, e.g. "@acme/ui" (lowercase, no spaces).');
      if (!/^[a-z][a-z0-9]{1,11}$/.test(i.prefix))
        err('prefix', 'Use 2–12 lowercase letters or digits, starting with a letter (e.g. "acme").');
      if (i.prefix === 'ds') warn('prefix', '"ds" is generic — a brand-specific prefix avoids clashes with other libraries.');
      if (!/^\d+\.\d+\.\d+(-[\w.]+)?$/.test(i.version)) err('version', 'Use semantic versioning, e.g. 0.1.0.');
      if (!i.description.trim()) warn('description', 'A description appears in package.json and on the docs home page.');
      break;
    }
    case 'colors': {
      const c = config.colors;
      for (const key of ['primary', 'neutral', 'success', 'warning', 'danger', 'info'] as const) {
        if (!isHex(c[key])) err(key, `${key} must be a hex colour like #4f46e5.`);
      }
      break;
    }
    case 'typography': {
      const t = config.typography;
      if (t.baseSize < 12 || t.baseSize > 22) err('baseSize', 'Base size should be between 12 and 22px.');
      if (t.baseSize < 14) warn('baseSize', 'Body text below 14px is hard to read for many users.');
      if (t.scaleRatio < 1.05 || t.scaleRatio > 1.65) err('scaleRatio', 'Scale ratio should be between 1.05 and 1.65.');
      if (t.lineHeight < 1.2 || t.lineHeight > 2) err('lineHeight', 'Line height should be between 1.2 and 2.');
      if (t.lineHeight < 1.4) warn('lineHeight', 'WCAG recommends a body line height of at least 1.5.');
      break;
    }
    case 'shape': {
      const s = config.shape;
      if (![2, 4, 6, 8].includes(s.spacingUnit)) err('spacingUnit', 'Spacing unit must be 2, 4, 6 or 8px.');
      if (s.borderWidth < 0 || s.borderWidth > 3) err('borderWidth', 'Border width should be 0–3px.');
      break;
    }
    case 'components': {
      const sel = config.components.selected;
      for (const name of sel) if (!CATALOG_BY_NAME[name]) err('selected', `Unknown component "${name}".`);
      if (sel.filter((n) => !FOUNDATION_COMPONENTS.includes(n)).length === 0)
        warn('selected', 'Only foundation components are selected. Add at least one component.');
      break;
    }
    case 'docs': {
      const d = config.docs;
      if (!d.title.trim()) err('title', 'The docs site needs a title.');
      if (d.repositoryUrl && !/^https?:\/\//.test(d.repositoryUrl)) err('repositoryUrl', 'Repository URL must start with http:// or https://');
      const available = new Set([...config.components.selected, ...FOUNDATION_COMPONENTS]);
      for (const id of d.showcases) {
        const sc = SHOWCASES.find((s) => s.id === id);
        const missing = sc?.requires.filter((r) => !available.has(r)) ?? [];
        if (missing.length) warn('showcases', `"${sc?.title}" will be skipped: it needs ${missing.join(', ')}.`);
      }
      break;
    }
  }
  return issues;
}

export function validateConfig(config: DesignSystemConfig): Record<ConfigSection, ValidationIssue[]> {
  const sections: ConfigSection[] = ['identity', 'colors', 'typography', 'shape', 'components', 'docs'];
  return Object.fromEntries(sections.map((s) => [s, validateSection(config, s)])) as Record<ConfigSection, ValidationIssue[]>;
}

/** Fill in missing fields of an imported (possibly older or partial) config. */
export function normalizeConfig(input: Partial<DesignSystemConfig>): DesignSystemConfig {
  return {
    schemaVersion: 1,
    identity: { ...DEFAULT_CONFIG.identity, ...input.identity },
    colors: { ...DEFAULT_CONFIG.colors, ...input.colors },
    typography: { ...DEFAULT_CONFIG.typography, ...input.typography },
    shape: { ...DEFAULT_CONFIG.shape, ...input.shape },
    components: { ...DEFAULT_CONFIG.components, ...input.components },
    docs: { ...DEFAULT_CONFIG.docs, ...input.docs },
  };
}
