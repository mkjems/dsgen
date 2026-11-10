import type { ComponentMeta } from '../../../../../core/meta';

export const meta: ComponentMeta = {
  name: 'Badge',
  category: 'Data display',
  summary: 'A compact label for status, counts or categories.',
  description:
    'Badges highlight a short piece of metadata — a status, a count or a tag. Tones map directly onto the semantic status colours, so they adapt to dark mode automatically.',
  extends: '<span> attributes',
  props: [
    { name: 'tone', type: "'neutral' | 'primary' | 'success' | 'warning' | 'danger' | 'info'", default: "'neutral'", values: ['neutral', 'primary', 'success', 'warning', 'danger', 'info'], control: 'select', description: 'Semantic colour of the badge.' },
    { name: 'variant', type: "'subtle' | 'solid' | 'outline'", default: "'subtle'", values: ['subtle', 'solid', 'outline'], control: 'select', description: 'Fill style. Use `solid` sparingly for high-attention states.' },
    { name: 'size', type: "'sm' | 'md'", default: "'md'", values: ['sm', 'md'], control: 'select', description: 'Badge height and font size.' },
    { name: 'dot', type: 'boolean', default: 'false', control: 'boolean', description: 'Adds a leading dot, useful for live statuses.' },
    { name: 'children', type: 'ReactNode', required: true, control: 'text', description: 'Badge text. Keep it to one or two words.' },
  ],
  examples: [
    { title: 'Tones', code: `<Stack direction="row" gap={2} wrap>\n  <Badge>Neutral</Badge>\n  <Badge tone="primary">Primary</Badge>\n  <Badge tone="success">Success</Badge>\n  <Badge tone="warning">Warning</Badge>\n  <Badge tone="danger">Danger</Badge>\n  <Badge tone="info">Info</Badge>\n</Stack>` },
    { title: 'Variants', code: `<Stack direction="row" gap={2}>\n  <Badge tone="success" variant="subtle">Subtle</Badge>\n  <Badge tone="success" variant="solid">Solid</Badge>\n  <Badge tone="success" variant="outline">Outline</Badge>\n</Stack>` },
    { title: 'Status with dot', code: `<Stack direction="row" gap={2}>\n  <Badge tone="success" dot>Online</Badge>\n  <Badge tone="warning" dot>Degraded</Badge>\n  <Badge tone="danger" dot size="sm">Down</Badge>\n</Stack>` },
  ],
  playground: {
    template: '<Badge {...props} />',
    initial: { children: 'Badge', tone: 'primary', variant: 'subtle', size: 'md', dot: false },
  },
  accessibility: [
    'Badges are plain text; colour is never the only signal — the text carries the meaning.',
    'For counts that update live, wrap the region in `aria-live="polite"`.',
  ],
  guidelines: {
    do: ['Use consistent tones for the same status across the product.', 'Keep text short.'],
    dont: ['Make badges interactive — use a Button.', 'Rely on colour alone to convey state.'],
  },
};
