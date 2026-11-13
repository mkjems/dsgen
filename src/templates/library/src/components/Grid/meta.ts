import type { ComponentMeta } from '../../../../../core/meta';

const responsive = (t: string) => `${t} | { sm?, md?, lg? }`;
const SPACE = ['0', '0.5', '1', '1.5', '2', '3', '4', '5', '6', '8', '10', '12', '16'];

export const meta: ComponentMeta = {
  name: 'Grid',
  category: 'Layout',
  foundation: true,
  summary: 'Two-dimensional, responsive layouts built on CSS grid.',
  description:
    'Grid lays out children in rows and columns, and `GridItem` places a child within it. Every layout prop is **responsive**: pass one value for all screens, or an object such as `{ sm: 1, md: 2, lg: 4 }`. Breakpoints are mobile first — `sm` applies from 0px, `md` from 768px and `lg` from 1024px — and a breakpoint you leave out inherits the next smaller one. Use `columns` for a fixed number of tracks, `minItemWidth` for fluid card grids that need no breakpoints, and `areas` for named page layouts. Gaps are always steps on the spacing scale.',
  props: [
    { name: 'columns', type: responsive('number | string'), control: 'number', description: 'A number creates that many equal columns; a string is a `grid-template-columns` value such as `"240px 1fr"`.' },
    { name: 'minItemWidth', type: responsive('number | string'), control: 'number', description: 'Fluid columns: as many as fit, each at least this wide (numbers are pixels). Overrides `columns`.' },
    { name: 'rows', type: responsive('number | string'), description: 'A number creates that many auto-height rows; a string is a `grid-template-rows` value.' },
    { name: 'areas', type: responsive('string[]'), description: 'Named template areas, one string per row, e.g. `[\'header header\', \'nav main\']`. Use `.` for an empty cell.' },
    { name: 'gap', type: responsive('SpaceStep'), default: '4', values: SPACE, control: 'select', description: 'Gap between rows and columns, as a step on the spacing scale (maps to `--space-*` tokens).' },
    { name: 'rowGap', type: responsive('SpaceStep'), description: 'Gap between rows. Overrides `gap`.' },
    { name: 'columnGap', type: responsive('SpaceStep'), description: 'Gap between columns. Overrides `gap`.' },
    { name: 'flow', type: responsive("'row' | 'column' | 'row dense' | 'column dense'"), default: "'row'", values: ['row', 'column', 'row dense', 'column dense'], control: 'select', description: 'How auto-placed items fill the grid. `dense` back-fills holes left by larger items.' },
    { name: 'autoRows', type: responsive('string'), description: 'Size of implicitly created rows, e.g. `"minmax(120px, auto)"`.' },
    { name: 'align', type: responsive("'start' | 'center' | 'end' | 'stretch' | 'baseline'"), default: "'stretch'", values: ['start', 'center', 'end', 'stretch', 'baseline'], control: 'select', description: 'Vertical alignment of items within their cells.' },
    { name: 'justify', type: responsive("'start' | 'center' | 'end' | 'stretch'"), default: "'stretch'", values: ['start', 'center', 'end', 'stretch'], control: 'select', description: 'Horizontal alignment of items within their cells.' },
    { name: 'as', type: 'ElementType', default: "'div'", description: 'Render as another element, e.g. `"ul"`, `"main"` or `"section"`.' },
    { name: 'children', type: 'ReactNode', description: 'Grid items. Plain elements work; wrap them in `GridItem` to control placement.' },
  ],
  subcomponents: [
    {
      name: 'GridItem',
      description: 'Places a child within a Grid. Every prop is responsive.',
      props: [
        { name: 'span', type: responsive("number | 'full'"), description: 'Columns to span. `\'full\'` stretches across the whole row.' },
        { name: 'start', type: responsive('number'), description: 'Column line to start at, 1-based. Negative numbers count from the end.' },
        { name: 'rowSpan', type: responsive('number'), description: 'Rows to span.' },
        { name: 'rowStart', type: responsive('number'), description: 'Row line to start at, 1-based.' },
        { name: 'area', type: responsive('string'), description: 'Name of an area from the parent Grid\'s `areas`. `span`/`start` win where both are set.' },
        { name: 'align', type: responsive("'start' | 'center' | 'end' | 'stretch' | 'baseline'"), description: 'Vertical alignment within the cell. Overrides the Grid\'s `align`.' },
        { name: 'justify', type: responsive("'start' | 'center' | 'end' | 'stretch'"), description: 'Horizontal alignment within the cell. Overrides the Grid\'s `justify`.' },
        { name: 'order', type: responsive('number'), description: 'Visual order; lower comes first.' },
        { name: 'hide', type: responsive('boolean'), description: 'Hide the item, e.g. `{ sm: true, lg: false }` shows it only on large screens.' },
        { name: 'as', type: 'ElementType', default: "'div'", description: 'Render as another element, e.g. `"li"` or `"aside"`.' },
      ],
    },
  ],
  examples: [
    {
      title: 'Responsive columns',
      description: 'One column on phones, two on tablets, four on desktops. Resize the window to see it change.',
      code: `<Grid columns={{ sm: 1, md: 2, lg: 4 }} gap={4}>\n  <Card padding="sm">One</Card>\n  <Card padding="sm">Two</Card>\n  <Card padding="sm">Three</Card>\n  <Card padding="sm">Four</Card>\n</Grid>`,
    },
    {
      title: 'Fluid card grid',
      description: '`minItemWidth` fits as many columns as there is room for — no breakpoints needed.',
      code: `<Grid minItemWidth={180} gap={3}>\n  {['Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon', 'Zeta'].map((name) => (\n    <Card key={name} padding="sm"><Text weight="medium">{name}</Text></Card>\n  ))}\n</Grid>`,
    },
    {
      title: '12-column grid with spans',
      description: 'Items span different widths per breakpoint. `span="full"` covers the whole row.',
      code: `<Grid columns={12} gap={3}>\n  <GridItem span="full"><Card padding="sm">Full width</Card></GridItem>\n  <GridItem span={{ sm: 12, md: 8 }}><Card padding="sm">8 of 12 on md+</Card></GridItem>\n  <GridItem span={{ sm: 12, md: 4 }}><Card padding="sm">4 of 12 on md+</Card></GridItem>\n  <GridItem span={{ sm: 6, lg: 3 }}><Card padding="sm">6 → 3</Card></GridItem>\n  <GridItem span={{ sm: 6, lg: 3 }}><Card padding="sm">6 → 3</Card></GridItem>\n  <GridItem span={{ sm: 12, lg: 6 }}><Card padding="sm">12 → 6</Card></GridItem>\n</Grid>`,
    },
    {
      title: 'Page layout with named areas',
      description: 'The sidebar stacks under the header on small screens and moves beside the content from `md`. The aside is hidden until `lg`.',
      code: `<Grid\n  columns={{ sm: 1, md: '200px 1fr', lg: '200px 1fr 200px' }}\n  areas={{\n    sm: ['header', 'nav', 'main', 'footer'],\n    md: ['header header', 'nav main', 'footer footer'],\n    lg: ['header header header', 'nav main aside', 'footer footer footer'],\n  }}\n  gap={3}\n>\n  <GridItem area="header"><Card variant="filled" padding="sm">Header</Card></GridItem>\n  <GridItem area="nav"><Card padding="sm">Navigation</Card></GridItem>\n  <GridItem area="main"><Card padding="sm" style={{ minHeight: 120 }}>Main content</Card></GridItem>\n  <GridItem area="aside" hide={{ sm: true, lg: false }}><Card padding="sm">Aside</Card></GridItem>\n  <GridItem area="footer"><Card variant="filled" padding="sm">Footer</Card></GridItem>\n</Grid>`,
    },
    {
      title: 'Bento layout',
      description: 'Items span rows and columns; `flow="row dense"` fills the gaps.',
      code: `<Grid columns={{ sm: 2, md: 4 }} autoRows="80px" flow="row dense" gap={3}>\n  <GridItem span={2} rowSpan={2}><Card variant="elevated" padding="sm" style={{ height: '100%' }}>Feature</Card></GridItem>\n  <GridItem><Card padding="sm" style={{ height: '100%' }}>A</Card></GridItem>\n  <GridItem rowSpan={2}><Card padding="sm" style={{ height: '100%' }}>Tall</Card></GridItem>\n  <GridItem><Card padding="sm" style={{ height: '100%' }}>B</Card></GridItem>\n  <GridItem span={2}><Card padding="sm" style={{ height: '100%' }}>Wide</Card></GridItem>\n  <GridItem><Card padding="sm" style={{ height: '100%' }}>C</Card></GridItem>\n</Grid>`,
    },
  ],
  playground: {
    template: `<Grid {...props} style={{ border: '1px dashed var(--ds-color-border-strong)', padding: 12 }}>\n  <Badge>One</Badge><Badge tone="primary">Two</Badge><Badge tone="success">Three</Badge>\n  <Badge>Four</Badge><Badge tone="primary">Five</Badge><Badge tone="success">Six</Badge>\n</Grid>`,
    initial: { columns: 3, gap: 4, align: 'stretch', justify: 'stretch', flow: 'row' },
  },
  accessibility: [
    'Grid adds no semantics; use `as` to render meaningful elements such as `ul`/`li`, `main` or `section`.',
    'Screen readers and keyboard focus follow DOM order, not visual order. Keep the source order logical, and use `order` and `areas` for rearrangement only when the reading order still makes sense.',
    '`hide` uses `display: none`, which removes content for everyone. Don\'t hide information that small-screen users need.',
  ],
  guidelines: {
    do: [
      'Design mobile first: set `sm`, then override only what changes at `md` and `lg`.',
      'Use `minItemWidth` for collections of similar items such as cards or tiles.',
      'Use `areas` for page-level layouts so the structure reads like a map.',
    ],
    dont: [
      'Use Grid for a single row or column of items — Stack is simpler.',
      'Reorder content so the visual order contradicts the reading order.',
    ],
  },
};
