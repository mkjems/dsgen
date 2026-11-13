// Shapes of the generated documentation data (src/generated/system.json).

export interface TokenEntry { name: string; value: string; description: string }
export interface TokenGroup { id: string; title: string; description: string; tokens: TokenEntry[]; dark?: TokenEntry[] }
export interface ContrastCheck { label: string; theme: 'light' | 'dark'; foreground: string; background: string; ratio: number; level: string }

export interface PropDoc {
  name: string;
  type: string;
  description: string;
  default?: string;
  required?: boolean;
  values?: string[];
  control?: 'select' | 'boolean' | 'text' | 'number';
}

export interface ExampleDoc { title: string; description?: string; code: string; stateful: boolean }

export interface ComponentDoc {
  name: string;
  category: string;
  summary: string;
  description: string;
  foundation?: boolean;
  extends?: string;
  props: PropDoc[];
  subcomponents?: { name: string; description: string; extends?: string; props: PropDoc[] }[];
  examples: ExampleDoc[];
  playground?: { template: string; initial: Record<string, string | number | boolean> };
  accessibility: string[];
  guidelines: { do: string[]; dont: string[] };
}

export interface SystemConfig {
  identity: { name: string; packageName: string; prefix: string; description: string; version: string; author: string; license: string };
  colors: { primary: string; neutral: string; success: string; warning: string; danger: string; info: string; darkMode: boolean };
  typography: { bodyFont: string; headingFont: string; monoFont: string; baseSize: number; scaleRatio: number; lineHeight: number; headingWeight: number };
  shape: { spacingUnit: number; radius: string; shadows: string; density: string; borderWidth: number };
  components: { selected: string[] };
  docs: { title: string; tagline: string; repositoryUrl: string; showcases: string[]; includePlayground: boolean; includeHowItWorks: boolean };
}

export interface SystemData {
  generatedAt: string;
  config: SystemConfig;
  tokens: {
    groups: TokenGroup[];
    palettes: Record<string, Record<string, string>>;
    baseSteps: Record<string, number>;
    contrastChecks: ContrastCheck[];
  };
  components: ComponentDoc[];
  showcases: { id: string; title: string; description: string; requires: string[] }[];
  pages: { id: string; title: string }[];
}
