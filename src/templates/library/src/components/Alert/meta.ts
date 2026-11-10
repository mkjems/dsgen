import type { ComponentMeta } from '../../../../../core/meta';

export const meta: ComponentMeta = {
  name: 'Alert',
  category: 'Feedback',
  summary: 'Displays an important message inline, with an optional action.',
  description:
    'Alerts communicate a status that affects the current view: confirmations, warnings, errors or neutral information. Danger and warning alerts use `role="alert"` so they are announced immediately; info and success use the politer `role="status"`.',
  extends: '<div> attributes (except `title`)',
  props: [
    { name: 'tone', type: "'info' | 'success' | 'warning' | 'danger'", default: "'info'", values: ['info', 'success', 'warning', 'danger'], control: 'select', description: 'Sets the colour, icon and ARIA role.' },
    { name: 'title', type: 'ReactNode', control: 'text', description: 'Bold one-line summary.' },
    { name: 'children', type: 'ReactNode', control: 'text', description: 'Message body.' },
    { name: 'action', type: 'ReactNode', description: 'An action to resolve the message, typically a small Button.' },
    { name: 'onClose', type: '() => void', description: 'When provided, a dismiss button is shown and this is called on click. You control visibility.' },
    { name: 'hideIcon', type: 'boolean', default: 'false', control: 'boolean', description: 'Hides the tone icon.' },
  ],
  examples: [
    { title: 'Tones', code: `<Stack gap={3}>\n  <Alert tone="info" title="New version available">Refresh to get the latest features.</Alert>\n  <Alert tone="success" title="Payment received">Your invoice has been paid.</Alert>\n  <Alert tone="warning" title="Storage almost full">You have used 92% of your storage.</Alert>\n  <Alert tone="danger" title="Deployment failed">The build exited with code 1.</Alert>\n</Stack>` },
    { title: 'Dismissible with action', code: `function Demo() {\n  const [open, setOpen] = useState(true);\n  if (!open) return <Button variant="outline" onClick={() => setOpen(true)}>Show alert</Button>;\n  return (\n    <Alert tone="warning" title="Your trial ends in 3 days" onClose={() => setOpen(false)}\n      action={<Button size="sm">Upgrade now</Button>}>\n      Upgrade to keep access to all projects.\n    </Alert>\n  );\n}` },
  ],
  playground: {
    template: '<Alert {...props} />',
    initial: { tone: 'info', title: 'Heads up', children: 'This is the alert message.', hideIcon: false },
  },
  accessibility: [
    'Danger and warning use `role="alert"` (assertive); info and success use `role="status"` (polite).',
    'The dismiss button has `aria-label="Dismiss"`.',
    'Meaning is conveyed by title text and icon, not colour alone.',
  ],
  guidelines: {
    do: ['Explain what happened and what the user can do next.', 'Place alerts close to the content they relate to.'],
    dont: ['Use alerts for marketing messages.', 'Stack many alerts at once.'],
  },
};
