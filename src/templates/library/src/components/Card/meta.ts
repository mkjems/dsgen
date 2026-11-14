import type { ComponentMeta } from '../../../../../core/meta';

export const meta: ComponentMeta = {
  name: 'Card',
  category: 'Layout',
  summary: 'A container that groups related content and actions.',
  description:
    'Cards group information about a single subject. They are composed from parts: an optional `CardHeader` with `CardTitle`, `CardDescription` and `CardActions`, the body as plain children, and an optional `CardFooter`. Every part is a child element, so headers and footers can hold any content and each part can be left out.',
  extends: '<div> attributes',
  props: [
    { name: 'variant', type: "'outlined' | 'elevated' | 'filled'", default: "'outlined'", values: ['outlined', 'elevated', 'filled'], control: 'select', description: 'Border, shadow or tinted background.' },
    { name: 'padding', type: "'none' | 'sm' | 'md' | 'lg'", default: "'md'", values: ['none', 'sm', 'md', 'lg'], control: 'select', description: 'Inner spacing, mapped to the spacing scale.' },
    { name: 'interactive', type: 'boolean', default: 'false', control: 'boolean', description: 'Adds hover elevation for clickable cards. Also add `role`, `tabIndex` and a keyboard handler, or wrap a link.' },
    { name: 'children', type: 'ReactNode', description: 'The card parts and body content, stacked with consistent spacing.' },
  ],
  subcomponents: [
    {
      name: 'CardHeader',
      description: 'Top area of a card: title and description on the left, actions on the right.',
      extends: '<div> attributes',
      props: [{ name: 'children', type: 'ReactNode', description: '`CardTitle`, `CardDescription` and `CardActions`.' }],
    },
    {
      name: 'CardTitle',
      parent: 'CardHeader',
      description: 'The card heading. Renders an `<h3>` by default.',
      extends: '<h3> attributes',
      props: [
        { name: 'as', type: 'ElementType', default: "'h3'", description: 'Heading element; pick the level that fits the page outline.' },
        { name: 'children', type: 'ReactNode', control: 'text', description: 'Heading text.' },
      ],
    },
    {
      name: 'CardDescription',
      parent: 'CardHeader',
      description: 'Supporting text under the title.',
      extends: '<p> attributes',
      props: [{ name: 'children', type: 'ReactNode', control: 'text', description: 'Description text.' }],
    },
    {
      name: 'CardActions',
      parent: 'CardHeader',
      description: 'Elements aligned to the end of the header, such as a button or menu.',
      extends: '<div> attributes',
      props: [{ name: 'children', type: 'ReactNode', description: 'Buttons or other controls.' }],
    },
    {
      name: 'CardFooter',
      description: 'Footer separated by a divider. Its children line up at the end, typically the card’s buttons.',
      extends: '<div> attributes',
      props: [{ name: 'children', type: 'ReactNode', description: 'Footer content.' }],
    },
  ],
  examples: [
    {
      title: 'Variants',
      code: `<Stack direction="row" gap={4} wrap>\n  <Card style={{ width: 200 }}>\n    <CardHeader>\n      <CardTitle>Outlined</CardTitle>\n      <CardDescription>Default style</CardDescription>\n    </CardHeader>\n    Body content\n  </Card>\n  <Card variant="elevated" style={{ width: 200 }}>\n    <CardHeader>\n      <CardTitle>Elevated</CardTitle>\n      <CardDescription>Casts a shadow</CardDescription>\n    </CardHeader>\n    Body content\n  </Card>\n  <Card variant="filled" style={{ width: 200 }}>\n    <CardHeader>\n      <CardTitle>Filled</CardTitle>\n      <CardDescription>Tinted surface</CardDescription>\n    </CardHeader>\n    Body content\n  </Card>\n</Stack>`,
    },
    {
      title: 'Header actions and footer',
      code: `<Card style={{ maxWidth: 440 }}>\n  <CardHeader>\n    <CardTitle>Monthly report</CardTitle>\n    <CardDescription>Updated 2 hours ago</CardDescription>\n    <CardActions>\n      <Button size="sm" variant="ghost">Export</Button>\n    </CardActions>\n  </CardHeader>\n  <Text tone="muted">Revenue grew 12% compared with last month, driven by new enterprise accounts.</Text>\n  <CardFooter>\n    <Button variant="outline">Cancel</Button>\n    <Button>Publish</Button>\n  </CardFooter>\n</Card>`,
    },
    {
      title: 'Body only',
      description: 'Every part is optional; a card can be just a padded surface.',
      code: `<Card padding="sm" style={{ maxWidth: 280 }}>\n  <Text>Just some content in a card.</Text>\n</Card>`,
    },
    {
      title: 'Interactive',
      code: `<Card interactive variant="elevated" role="button" tabIndex={0} style={{ maxWidth: 280 }} onClick={() => alert('Card clicked')}>\n  <CardHeader>\n    <CardTitle>Open project</CardTitle>\n    <CardDescription>Click anywhere on the card</CardDescription>\n  </CardHeader>\n</Card>`,
    },
  ],
  playground: {
    template:
      '<Card {...props} style={{ maxWidth: 360 }}>\n  <CardHeader>\n    <CardTitle>Card title</CardTitle>\n    <CardDescription>A short description</CardDescription>\n  </CardHeader>\n  Card body content goes here.\n</Card>',
    initial: { variant: 'outlined', padding: 'md', interactive: false },
  },
  accessibility: [
    '`CardTitle` renders an `<h3>`; use `as` to pick the level that fits the heading hierarchy of the page.',
    'Interactive cards need a role or a link inside, a `tabIndex`, and keyboard activation.',
  ],
  guidelines: {
    do: ['Keep one subject per card.', 'Put the card’s main actions in `CardFooter`.'],
    dont: ['Nest cards inside cards.', 'Put several unrelated primary actions in one card.'],
  },
};
