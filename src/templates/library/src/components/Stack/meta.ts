import type { ComponentMeta } from '../../../../../core/meta';

const responsive = (t: string) => `${t} | { sm?, md?, lg? }`;
const SPACE = ['0', '0.5', '1', '1.5', '2', '3', '4', '5', '6', '8', '10', '12', '16'];
const ALIGN = ['start', 'center', 'end', 'stretch', 'baseline'];
const alignType = responsive("'start' | 'center' | 'end' | 'stretch' | 'baseline'");

export const meta: ComponentMeta = {
  name: 'Stack',
  category: 'Layout',
  foundation: true,
  summary: 'Arranges children in a row or column with consistent spacing.',
  description:
    'Stack is the basic layout primitive: a flex container whose `gap` is always a step on the spacing scale, which keeps spacing consistent across the product. Rows centre their children vertically by default. Wrap a child in `StackItem` to let it grow, shrink or align on its own. Every layout prop is **responsive**: pass one value, or an object such as `{ sm: \'column\', md: \'row\' }`. Breakpoints are mobile first — `sm` from 0px, `md` from 768px, `lg` from 1024px — and a breakpoint you leave out inherits the next smaller one.',
  props: [
    { name: 'direction', type: responsive("'row' | 'column' | 'row-reverse' | 'column-reverse'"), default: "'column'", values: ['row', 'column', 'row-reverse', 'column-reverse'], control: 'select', description: 'Main axis.' },
    { name: 'gap', type: responsive('SpaceStep'), default: '4', values: SPACE, control: 'select', description: 'Spacing between children, as a multiple of the spacing unit (maps to `--space-*` tokens).' },
    { name: 'rowGap', type: responsive('SpaceStep'), description: 'Spacing between wrapped lines. Overrides `gap`.' },
    { name: 'columnGap', type: responsive('SpaceStep'), description: 'Spacing between items on the same line. Overrides `gap`.' },
    { name: 'align', type: alignType, values: ALIGN, control: 'select', description: 'Cross-axis alignment. Rows default to `center`, columns to `stretch`.' },
    { name: 'justify', type: responsive("'start' | 'center' | 'end' | 'between' | 'around' | 'evenly'"), values: ['start', 'center', 'end', 'between', 'around', 'evenly'], control: 'select', description: 'Main-axis distribution.' },
    { name: 'wrap', type: responsive('boolean'), default: 'false', control: 'boolean', description: 'Allow children to wrap.' },
    { name: 'as', type: 'ElementType', default: "'div'", description: 'Render as another element, e.g. `"ul"`, `"nav"` or `"form"`.' },
    { name: 'children', type: 'ReactNode', description: 'Items to lay out. Plain elements work; wrap them in `StackItem` to control sizing.' },
  ],
  subcomponents: [
    {
      name: 'StackItem',
      description: 'Controls how one child of a Stack is sized and aligned. Every prop is responsive. An empty `<StackItem grow />` works as a spacer that pushes the following items to the end.',
      props: [
        { name: 'grow', type: responsive('boolean | number'), description: 'Take up free space. `true` is `1`; a number sets this item\'s share relative to other growing items.' },
        { name: 'shrink', type: responsive('boolean | number'), description: 'Whether the item may shrink below `basis` when space runs out. `false` keeps its size. CSS default is `true`.' },
        { name: 'basis', type: responsive('number | string'), description: 'Starting size before growing or shrinking. Numbers are pixels; strings are CSS lengths such as `\'30%\'`.' },
        { name: 'align', type: alignType, description: 'Cross-axis alignment of this item. Overrides the Stack\'s `align`.' },
        { name: 'order', type: responsive('number'), description: 'Visual order; lower comes first.' },
        { name: 'hide', type: responsive('boolean'), description: 'Hide the item, e.g. `{ sm: true, md: false }` hides it on phones only.' },
        { name: 'as', type: 'ElementType', default: "'div'", description: 'Render as another element, e.g. `"li"`.' },
      ],
    },
  ],
  examples: [
    { title: 'Column (default)', code: `<Stack gap={3}>\n  <Card padding="sm">One</Card>\n  <Card padding="sm">Two</Card>\n  <Card padding="sm">Three</Card>\n</Stack>` },
    { title: 'Row with justify', code: `<Stack direction="row" justify="between">\n  <Text weight="medium">Invoices</Text>\n  <Button size="sm">New invoice</Button>\n</Stack>` },
    {
      title: 'Responsive direction',
      description: 'Stacked on phones, side by side from `md`. Resize the window to see it change.',
      code: `<Stack direction={{ sm: 'column', md: 'row' }} gap={{ sm: 2, md: 4 }} align={{ sm: 'stretch', md: 'center' }}>\n  <Card padding="sm">Plan</Card>\n  <Card padding="sm">Billing</Card>\n  <Card padding="sm">Usage</Card>\n</Stack>`,
    },
    {
      title: 'Fill the remaining space',
      description: 'A growing item takes whatever room is left; the button keeps its natural width.',
      code: `<Stack direction="row" gap={2} align="end">\n  <StackItem grow>\n    <TextField label="Search" placeholder="Search invoices" />\n  </StackItem>\n  <Button>Search</Button>\n</Stack>`,
    },
    {
      title: 'Spacer',
      description: 'An empty growing item pushes everything after it to the end of the row.',
      code: `<Stack direction="row" gap={2}>\n  <Text weight="medium">Acme</Text>\n  <Badge>Beta</Badge>\n  <StackItem grow />\n  <Button variant="ghost" size="sm">Docs</Button>\n  <Button size="sm">Sign in</Button>\n</Stack>`,
    },
    {
      title: 'Sidebar layout',
      description: 'A fixed-width sidebar that does not shrink, beside content that grows. On phones the sidebar is hidden.',
      code: `<Stack direction="row" gap={4} align="stretch">\n  <StackItem basis={180} shrink={false} hide={{ sm: true, md: false }}>\n    <Card variant="filled" padding="sm" style={{ height: '100%' }}>Sidebar</Card>\n  </StackItem>\n  <StackItem grow>\n    <Card padding="sm">Content</Card>\n  </StackItem>\n</Stack>`,
    },
    { title: 'Semantic list', description: 'Use `as` to render meaningful markup.', code: `<Stack as="ul" gap={2} style={{ margin: 0, paddingLeft: 20 }}>\n  <li><Text>Design tokens</Text></li>\n  <li><Text>Components</Text></li>\n  <li><Text>Documentation</Text></li>\n</Stack>` },
  ],
  playground: {
    template: `<Stack {...props} style={{ border: '1px dashed var(--ds-color-border-strong)', padding: 12, minHeight: 120 }}>\n  <Badge>One</Badge><Badge tone="primary">Two</Badge><Badge tone="success">Three</Badge>\n</Stack>`,
    initial: { direction: 'row', gap: 4, align: 'center', justify: 'start', wrap: false },
  },
  accessibility: [
    'Stack adds no semantics; use `as` to render meaningful elements such as `ul`, `nav` or `section`.',
    'Reverse directions and `order` change only the visual order. Screen readers and keyboard focus follow the DOM, so keep the source order logical.',
    '`hide` uses `display: none`, which removes content for everyone. Don\'t hide information that small-screen users need.',
  ],
  guidelines: {
    do: [
      'Use Stack instead of ad-hoc margins between siblings.',
      'Use `StackItem grow` instead of `style={{ flex: 1 }}`.',
      'Set responsive values mobile first: give `sm`, then override only what changes.',
    ],
    dont: [
      'Use arbitrary pixel gaps — stick to the spacing scale.',
      'Build two-dimensional layouts from nested Stacks — use Grid.',
    ],
  },
};
