import type { ComponentMeta } from '../../../../../core/meta';

export const meta: ComponentMeta = {
  name: 'Stack',
  category: 'Layout',
  foundation: true,
  summary: 'Arranges children in a row or column with consistent spacing.',
  description:
    'Stack is the basic layout primitive. It is a flex container whose `gap` is always a step on the spacing scale, which keeps spacing consistent across the product. Rows centre their children vertically by default.',
  props: [
    { name: 'direction', type: "'row' | 'column'", default: "'column'", values: ['row', 'column'], control: 'select', description: 'Main axis.' },
    { name: 'gap', type: '0 | 0.5 | 1 | 1.5 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12 | 16', default: '4', values: ['0', '0.5', '1', '1.5', '2', '3', '4', '5', '6', '8', '10', '12', '16'], control: 'select', description: 'Spacing between children, as a multiple of the spacing unit (maps to `--space-*` tokens).' },
    { name: 'align', type: "'start' | 'center' | 'end' | 'stretch' | 'baseline'", values: ['start', 'center', 'end', 'stretch', 'baseline'], control: 'select', description: 'Cross-axis alignment. Rows default to `center`.' },
    { name: 'justify', type: "'start' | 'center' | 'end' | 'between'", values: ['start', 'center', 'end', 'between'], control: 'select', description: 'Main-axis distribution.' },
    { name: 'wrap', type: 'boolean', default: 'false', control: 'boolean', description: 'Allow children to wrap.' },
    { name: 'as', type: 'ElementType', default: "'div'", description: 'Render as another element, e.g. `"ul"`, `"nav"` or `"form"`.' },
    { name: 'children', type: 'ReactNode', description: 'Items to lay out.' },
  ],
  examples: [
    { title: 'Column (default)', code: `<Stack gap={3}>\n  <Card padding="sm">One</Card>\n  <Card padding="sm">Two</Card>\n  <Card padding="sm">Three</Card>\n</Stack>` },
    { title: 'Row with justify', code: `<Stack direction="row" justify="between">\n  <Text weight="medium">Invoices</Text>\n  <Button size="sm">New invoice</Button>\n</Stack>` },
    { title: 'Semantic list', description: 'Use `as` to render meaningful markup.', code: `<Stack as="ul" gap={2} style={{ margin: 0, paddingLeft: 20 }}>\n  <li><Text>Design tokens</Text></li>\n  <li><Text>Components</Text></li>\n  <li><Text>Documentation</Text></li>\n</Stack>` },
  ],
  playground: {
    template: `<Stack {...props} style={{ border: '1px dashed var(--ds-color-border-strong)', padding: 12, minHeight: 120 }}>\n  <Badge>One</Badge><Badge tone="primary">Two</Badge><Badge tone="success">Three</Badge>\n</Stack>`,
    initial: { direction: 'row', gap: 4, align: 'center', justify: 'start', wrap: false },
  },
  accessibility: ['Stack adds no semantics; use `as` to render meaningful elements such as `ul`, `nav` or `section`.'],
  guidelines: {
    do: ['Use Stack instead of ad-hoc margins between siblings.'],
    dont: ['Use arbitrary pixel gaps — stick to the spacing scale.'],
  },
};
