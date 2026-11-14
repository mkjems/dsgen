import type { ComponentMeta } from '../../../../../core/meta';

export const meta: ComponentMeta = {
  name: 'Tabs',
  category: 'Data display',
  summary: 'Switches between related views within the same context.',
  description:
    'Tabs are composed from parts: a `TabList` of `Tab`s and one `TabPanel` per tab, matched by `value`. They follow the WAI-ARIA tabs pattern: arrow keys move between tabs, Home/End jump to the first/last tab, and only the active tab is in the tab order. Inactive panels are not rendered, so expensive content loads on demand.',
  extends: '<div> attributes',
  props: [
    { name: 'value', type: 'string', description: 'Controlled active tab value. Pair with `onValueChange`.' },
    { name: 'defaultValue', type: 'string', control: 'text', description: 'Initially active tab when uncontrolled. Defaults to the first enabled tab.' },
    { name: 'onValueChange', type: '(value: string) => void', description: 'Called when the user selects a tab.' },
    { name: 'variant', type: "'line' | 'pill'", default: "'line'", values: ['line', 'pill'], control: 'select', description: '`line` for page-level navigation, `pill` for compact segmented switching.' },
    { name: 'fullWidth', type: 'boolean', default: 'false', control: 'boolean', description: 'Stretch tabs to fill the available width.' },
    { name: 'children', type: 'ReactNode', description: 'A `TabList` followed by the `TabPanel`s.' },
  ],
  subcomponents: [
    {
      name: 'TabList',
      description: 'The row of tabs. Give it an `aria-label` when there is no visible heading.',
      extends: '<div> attributes',
      props: [
        { name: 'aria-label', type: 'string', description: 'Accessible name for the tab list.' },
        { name: 'children', type: 'ReactNode', description: 'The `Tab`s.' },
      ],
    },
    {
      name: 'Tab',
      parent: 'TabList',
      description: 'One tab. Its label is its children, so it can hold an icon or a badge.',
      extends: '<button> attributes',
      props: [
        { name: 'value', type: 'string', required: true, control: 'text', description: 'Identifies the tab; the `TabPanel` with the same value is shown when it is active.' },
        { name: 'disabled', type: 'boolean', default: 'false', control: 'boolean', description: 'Skip this tab.' },
        { name: 'children', type: 'ReactNode', control: 'text', description: 'The label.' },
      ],
    },
    {
      name: 'TabPanel',
      description: 'The content shown while the tab with the same `value` is active.',
      extends: '<div> attributes',
      props: [
        { name: 'value', type: 'string', required: true, control: 'text', description: 'The value of the `Tab` that shows this panel.' },
        { name: 'children', type: 'ReactNode', description: 'Panel content.' },
      ],
    },
  ],
  examples: [
    {
      title: 'Line (default)',
      code: `<Tabs>\n  <TabList aria-label="Project">\n    <Tab value="overview">Overview</Tab>\n    <Tab value="activity">Activity</Tab>\n    <Tab value="settings">Settings</Tab>\n    <Tab value="billing" disabled>Billing</Tab>\n  </TabList>\n  <TabPanel value="overview"><Text>Project overview and key metrics.</Text></TabPanel>\n  <TabPanel value="activity"><Text>Recent commits and comments.</Text></TabPanel>\n  <TabPanel value="settings"><Text>Project configuration.</Text></TabPanel>\n</Tabs>`,
    },
    {
      title: 'Pill',
      code: `<Tabs variant="pill" defaultValue="week">\n  <TabList aria-label="Period">\n    <Tab value="day">Day</Tab>\n    <Tab value="week">Week</Tab>\n    <Tab value="month">Month</Tab>\n  </TabList>\n  <TabPanel value="day"><Text>Today’s numbers.</Text></TabPanel>\n  <TabPanel value="week"><Text>This week’s numbers.</Text></TabPanel>\n  <TabPanel value="month"><Text>This month’s numbers.</Text></TabPanel>\n</Tabs>`,
    },
    {
      title: 'Rich labels',
      description: 'Tab labels are children, so they can hold other components.',
      code: `<Tabs>\n  <TabList aria-label="Mail">\n    <Tab value="inbox">Inbox <Badge size="sm" tone="primary">3</Badge></Tab>\n    <Tab value="archive">Archive</Tab>\n  </TabList>\n  <TabPanel value="inbox"><Text>Three unread messages.</Text></TabPanel>\n  <TabPanel value="archive"><Text>Nothing archived yet.</Text></TabPanel>\n</Tabs>`,
    },
    {
      title: 'Controlled',
      code: `function Demo() {\n  const [tab, setTab] = useState('b');\n  return (\n    <Stack gap={3}>\n      <Tabs value={tab} onValueChange={setTab}>\n        <TabList aria-label="Demo">\n          <Tab value="a">First</Tab>\n          <Tab value="b">Second</Tab>\n        </TabList>\n        <TabPanel value="a"><Text>First panel</Text></TabPanel>\n        <TabPanel value="b"><Text>Second panel</Text></TabPanel>\n      </Tabs>\n      <Text variant="small" tone="muted">Active tab: {tab}</Text>\n    </Stack>\n  );\n}`,
    },
  ],
  playground: {
    template: `<Tabs {...props}>\n  <TabList aria-label="Account">\n    <Tab value="one">Account</Tab>\n    <Tab value="two">Security</Tab>\n    <Tab value="three">Billing</Tab>\n  </TabList>\n  <TabPanel value="one"><Text>Account settings</Text></TabPanel>\n  <TabPanel value="two"><Text>Security settings</Text></TabPanel>\n  <TabPanel value="three"><Text>Billing details</Text></TabPanel>\n</Tabs>`,
    initial: { variant: 'line', fullWidth: false, defaultValue: 'one' },
  },
  accessibility: [
    'Implements `role="tablist"`, `role="tab"` and `role="tabpanel"` with `aria-selected`, `aria-controls` and `aria-labelledby`.',
    'Roving tab index: Arrow Left/Right, Home and End move focus and selection.',
    'Panels are focusable so keyboard users can reach content without interactive elements.',
  ],
  guidelines: {
    do: ['Use short, parallel labels.', 'Keep the most used tab first.', 'Give every `Tab` a matching `TabPanel`.'],
    dont: ['Use tabs for sequential steps — use a stepper or wizard.', 'Nest tabs inside tabs.'],
  },
};
