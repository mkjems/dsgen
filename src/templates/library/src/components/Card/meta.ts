import type { ComponentMeta } from '../../../../../core/meta';

export const meta: ComponentMeta = {
  name: 'Card',
  category: 'Layout',
  summary: 'A container that groups related content and actions.',
  description:
    'Cards group information about a single subject. The optional `title`, `description`, `actions` and `footer` props produce a consistent header and footer layout, while `children` holds the body.',
  extends: '<div> attributes (except `title`)',
  props: [
    { name: 'title', type: 'ReactNode', control: 'text', description: 'Card heading (rendered as `<h3>`).' },
    { name: 'description', type: 'ReactNode', control: 'text', description: 'Supporting text under the title.' },
    { name: 'actions', type: 'ReactNode', description: 'Elements aligned to the end of the header, such as a button or menu.' },
    { name: 'footer', type: 'ReactNode', description: 'Footer content separated by a divider; typically buttons.' },
    { name: 'variant', type: "'outlined' | 'elevated' | 'filled'", default: "'outlined'", values: ['outlined', 'elevated', 'filled'], control: 'select', description: 'Border, shadow or tinted background.' },
    { name: 'padding', type: "'none' | 'sm' | 'md' | 'lg'", default: "'md'", values: ['none', 'sm', 'md', 'lg'], control: 'select', description: 'Inner spacing, mapped to the spacing scale.' },
    { name: 'interactive', type: 'boolean', default: 'false', control: 'boolean', description: 'Adds hover elevation for clickable cards. Also add `role`, `tabIndex` and a keyboard handler, or wrap a link.' },
    { name: 'children', type: 'ReactNode', control: 'text', description: 'Body content.' },
  ],
  examples: [
    { title: 'Variants', code: `<Stack direction="row" gap={4} wrap>\n  <Card title="Outlined" description="Default style" style={{ width: 200 }}>Body content</Card>\n  <Card variant="elevated" title="Elevated" description="Casts a shadow" style={{ width: 200 }}>Body content</Card>\n  <Card variant="filled" title="Filled" description="Tinted surface" style={{ width: 200 }}>Body content</Card>\n</Stack>` },
    { title: 'Header actions and footer', code: `<Card\n  title="Monthly report"\n  description="Updated 2 hours ago"\n  actions={<Button size="sm" variant="ghost">Export</Button>}\n  footer={<><Button variant="outline">Cancel</Button><Button>Publish</Button></>}\n  style={{ maxWidth: 440 }}\n>\n  <Text tone="muted">Revenue grew 12% compared with last month, driven by new enterprise accounts.</Text>\n</Card>` },
    { title: 'Interactive', code: `<Card interactive variant="elevated" role="button" tabIndex={0} title="Open project" description="Click anywhere on the card" style={{ maxWidth: 280 }} onClick={() => alert('Card clicked')} />` },
  ],
  playground: {
    template: '<Card {...props} style={{ maxWidth: 360 }} />',
    initial: { title: 'Card title', description: 'A short description', children: 'Card body content goes here.', variant: 'outlined', padding: 'md', interactive: false },
  },
  accessibility: [
    'The title renders as an `<h3>`; make sure it fits the heading hierarchy of the page.',
    'Interactive cards need a role or a link inside, a `tabIndex`, and keyboard activation.',
  ],
  guidelines: {
    do: ['Keep one subject per card.', 'Use the footer for the card\'s main actions.'],
    dont: ['Nest cards inside cards.', 'Put several unrelated primary actions in one card.'],
  },
};
