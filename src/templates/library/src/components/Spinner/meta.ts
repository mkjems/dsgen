import type { ComponentMeta } from '../../../../../core/meta';

export const meta: ComponentMeta = {
  name: 'Spinner',
  category: 'Feedback',
  summary: 'Indicates that content or an action is loading.',
  description:
    'Spinner is an animated indicator for indeterminate waits. It renders with `role="status"` and a visually hidden label so screen reader users know something is loading.',
  extends: '<span> attributes',
  props: [
    { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", values: ['sm', 'md', 'lg'], control: 'select', description: 'Diameter: 16, 24 or 40px.' },
    { name: 'label', type: 'string', default: "'Loading'", control: 'text', description: 'Screen reader text. Make it specific, e.g. "Loading invoices".' },
    { name: 'tone', type: "'current' | 'primary'", default: "'primary'", values: ['current', 'primary'], control: 'select', description: '`primary` uses the brand colour; `current` inherits the text colour (useful inside buttons).' },
  ],
  examples: [
    { title: 'Sizes', code: `<Stack direction="row" gap={4} align="center">\n  <Spinner size="sm" />\n  <Spinner size="md" />\n  <Spinner size="lg" />\n</Stack>` },
    { title: 'Inline loading message', code: `<Stack direction="row" gap={2} align="center">\n  <Spinner size="sm" tone="current" label="Loading invoices" />\n  <Text tone="muted">Loading invoices…</Text>\n</Stack>` },
  ],
  playground: { template: '<Spinner {...props} />', initial: { size: 'md', tone: 'primary', label: 'Loading' } },
  accessibility: ['`role="status"` with a visually hidden label announces the loading state politely.', 'Animation is disabled for users who prefer reduced motion.'],
  guidelines: {
    do: ['Show a spinner only if the wait is longer than ~300ms.'],
    dont: ['Use spinners for whole-page loads where skeletons communicate layout better.'],
  },
};
