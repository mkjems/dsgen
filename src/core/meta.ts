/**
 * Documentation metadata for a component template. This single source feeds
 * the wizard's component picker, the generated props tables, the live
 * examples and the interactive playground in the docs site.
 */

export type ComponentCategory = 'Actions' | 'Forms' | 'Feedback' | 'Data display' | 'Overlays' | 'Layout' | 'Typography';

export interface PropDoc {
  name: string;
  /** TypeScript type as shown to readers, e.g. `'sm' | 'md' | 'lg'`. */
  type: string;
  description: string;
  default?: string;
  required?: boolean;
  /** Accepted literal values, used for docs and playground controls. */
  values?: string[];
  /** How the playground edits this prop. Omit to hide it from the playground. */
  control?: 'select' | 'boolean' | 'text' | 'number';
}

export interface ExampleDoc {
  title: string;
  description?: string;
  /**
   * Either a JSX expression (rendered inside a fragment) or the source of a
   * function component named `Demo` (for examples that need state).
   * Components and `React` hooks (`useState`) are in scope.
   */
  code: string;
}

export interface PlaygroundDoc {
  /** JSX that spreads `{...props}` onto the component under test. */
  template: string;
  /** Initial prop values. Keys must be props with a `control`. */
  initial: Record<string, string | number | boolean>;
}

export interface ComponentMeta {
  name: string;
  category: ComponentCategory;
  /** One sentence used in lists. */
  summary: string;
  /** Longer explanation for the component page. */
  description: string;
  /** Foundation components are always included in a generated system. */
  foundation?: boolean;
  /** Native element/props the component forwards remaining props to. */
  extends?: string;
  props: PropDoc[];
  examples: ExampleDoc[];
  playground?: PlaygroundDoc;
  accessibility: string[];
  guidelines: { do: string[]; dont: string[] };
}
