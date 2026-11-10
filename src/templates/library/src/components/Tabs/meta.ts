import type { ComponentMeta } from '../../../../../core/meta';

export const meta: ComponentMeta = {
  name: 'Tabs',
  category: 'Data display',
  summary: 'Switches between related views within the same context.',
  description:
    'Tabs follow the WAI-ARIA tabs pattern: arrow keys move between tabs, Home/End jump to the first/last tab, and only the active tab is in the tab order. Inactive panels are not rendered, so expensive content loads on demand.',
  props: [
    { name: 'items', type: 'TabItem[]', required: true, description: 'Array of `{ id: string; label: ReactNode; content: ReactNode; disabled?: boolean }`. Ids must be unique.' },
    { name: 'value', type: 'string', description: 'Controlled active tab id. Pair with `onValueChange`.' },
    { name: 'defaultValue', type: 'string', control: 'text', description: 'Initially active tab when uncontrolled. Defaults to the first enabled tab.' },
    { name: 'onValueChange', type: '(id: string) => void', description: 'Called when the user selects a tab.' },
    { name: 'variant', type: "'line' | 'pill'", default: "'line'", values: ['line', 'pill'], control: 'select', description: '`line` for page-level navigation, `pill` for compact segmented switching.' },
    { name: 'fullWidth', type: 'boolean', default: 'false', control: 'boolean', description: 'Stretch tabs to fill the available width.' },
    { name: 'aria-label', type: 'string', description: 'Accessible name for the tab list when there is no visible heading.' },
  ],
  examples: [
    { title: 'Line (default)', code: `<Tabs aria-label="Project" items={[\n  { id: 'overview', label: 'Overview', content: <Text>Project overview and key metrics.</Text> },\n  { id: 'activity', label: 'Activity', content: <Text>Recent commits and comments.</Text> },\n  { id: 'settings', label: 'Settings', content: <Text>Project configuration.</Text> },\n  { id: 'billing', label: 'Billing', content: null, disabled: true },\n]} />` },
    { title: 'Pill', code: `<Tabs variant="pill" items={[\n  { id: 'day', label: 'Day', content: <Text>Today’s numbers.</Text> },\n  { id: 'week', label: 'Week', content: <Text>This week’s numbers.</Text> },\n  { id: 'month', label: 'Month', content: <Text>This month’s numbers.</Text> },\n]} />` },
    { title: 'Controlled', code: `function Demo() {\n  const [tab, setTab] = useState('b');\n  return (\n    <Stack gap={3}>\n      <Tabs value={tab} onValueChange={setTab} items={[\n        { id: 'a', label: 'First', content: <Text>First panel</Text> },\n        { id: 'b', label: 'Second', content: <Text>Second panel</Text> },\n      ]} />\n      <Text variant="small" tone="muted">Active tab: {tab}</Text>\n    </Stack>\n  );\n}` },
  ],
  playground: {
    template: `<Tabs {...props} items={[{ id: 'one', label: 'Account', content: <Text>Account settings</Text> }, { id: 'two', label: 'Security', content: <Text>Security settings</Text> }, { id: 'three', label: 'Billing', content: <Text>Billing details</Text> }]} />`,
    initial: { variant: 'line', fullWidth: false, defaultValue: 'one' },
  },
  accessibility: [
    'Implements `role="tablist"`, `role="tab"` and `role="tabpanel"` with `aria-selected`, `aria-controls` and `aria-labelledby`.',
    'Roving tab index: Arrow Left/Right, Home and End move focus and selection.',
    'Panels are focusable so keyboard users can reach content without interactive elements.',
  ],
  guidelines: {
    do: ['Use short, parallel labels.', 'Keep the most used tab first.'],
    dont: ['Use tabs for sequential steps — use a stepper or wizard.', 'Nest tabs inside tabs.'],
  },
};
