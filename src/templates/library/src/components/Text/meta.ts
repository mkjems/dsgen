import type { ComponentMeta } from '../../../../../core/meta';

export const meta: ComponentMeta = {
  name: 'Text',
  category: 'Typography',
  foundation: true,
  summary: 'Renders text using the type scale, from display headings to captions.',
  description:
    'Text applies a style from the type scale and picks the right semantic element automatically (`h1`–`h4` for headings, `p` for paragraphs). Use `as` to decouple visual style from document structure, e.g. an `h2` that looks like `h4`.',
  props: [
    { name: 'variant', type: "'display' | 'h1' | 'h2' | 'h3' | 'h4' | 'lead' | 'body' | 'small' | 'caption' | 'code'", default: "'body'", values: ['display', 'h1', 'h2', 'h3', 'h4', 'lead', 'body', 'small', 'caption', 'code'], control: 'select', description: 'Typographic style. Maps to the font-size tokens.' },
    { name: 'as', type: 'ElementType', description: 'Override the rendered element while keeping the visual style.' },
    { name: 'tone', type: "'default' | 'muted' | 'primary' | 'success' | 'warning' | 'danger'", default: "'default'", values: ['default', 'muted', 'primary', 'success', 'warning', 'danger'], control: 'select', description: 'Text colour from the semantic palette.' },
    { name: 'weight', type: "'regular' | 'medium' | 'bold'", values: ['regular', 'medium', 'bold'], control: 'select', description: 'Overrides the default weight of the variant.' },
    { name: 'align', type: "'start' | 'center' | 'end'", values: ['start', 'center', 'end'], control: 'select', description: 'Text alignment.' },
    { name: 'truncate', type: 'boolean', default: 'false', control: 'boolean', description: 'Single line with ellipsis when it overflows.' },
    { name: 'children', type: 'ReactNode', control: 'text', description: 'The text.' },
  ],
  examples: [
    { title: 'Type scale', code: `<Stack gap={2}>\n  <Text variant="display">Display</Text>\n  <Text variant="h1">Heading 1</Text>\n  <Text variant="h2">Heading 2</Text>\n  <Text variant="h3">Heading 3</Text>\n  <Text variant="h4">Heading 4</Text>\n  <Text variant="lead">Lead paragraph that introduces a section.</Text>\n  <Text>Body text for running paragraphs.</Text>\n  <Text variant="small">Small text for secondary information.</Text>\n  <Text variant="caption">CAPTION</Text>\n</Stack>` },
    { title: 'Tones', code: `<Stack gap={1}>\n  <Text>Default</Text>\n  <Text tone="muted">Muted</Text>\n  <Text tone="primary">Primary</Text>\n  <Text tone="success">Success</Text>\n  <Text tone="warning">Warning</Text>\n  <Text tone="danger">Danger</Text>\n</Stack>` },
    { title: 'Semantic override', description: 'An `h2` element styled as h4.', code: `<Text variant="h4" as="h2">Section title</Text>` },
    { title: 'Inline code', code: `<Text>Run <Text variant="code">npm install</Text> to get started.</Text>` },
  ],
  playground: { template: '<Text {...props} />', initial: { children: 'The quick brown fox', variant: 'h3', tone: 'default', truncate: false } },
  accessibility: ['Headings must follow a logical order; use `as` to keep the outline correct when the visual size differs.'],
  guidelines: {
    do: ['Use one `h1` per page.', 'Use `muted` for secondary information, not for disabled states.'],
    dont: ['Skip heading levels for visual reasons — use `as`.'],
  },
};
