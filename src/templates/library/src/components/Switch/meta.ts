import type { ComponentMeta } from '../../../../../core/meta';

export const meta: ComponentMeta = {
  name: 'Switch',
  category: 'Forms',
  summary: 'Turns a setting on or off with an immediate effect.',
  description:
    'Switch is a `role="switch"` button for settings that take effect immediately, like enabling notifications. It supports controlled (`checked` + `onCheckedChange`) and uncontrolled (`defaultChecked`) usage.',
  extends: '<button> attributes',
  props: [
    { name: 'label', type: 'ReactNode', required: true, control: 'text', description: 'Describes the setting being toggled.' },
    { name: 'description', type: 'ReactNode', control: 'text', description: 'Secondary text explaining the effect of the setting.' },
    { name: 'checked', type: 'boolean', description: 'Controlled state. Pair with `onCheckedChange`.' },
    { name: 'defaultChecked', type: 'boolean', default: 'false', control: 'boolean', description: 'Initial state when uncontrolled.' },
    { name: 'onCheckedChange', type: '(checked: boolean) => void', description: 'Called with the new state whenever the user toggles the switch.' },
    { name: 'size', type: "'sm' | 'md'", default: "'md'", values: ['sm', 'md'], control: 'select', description: 'Size of the track.' },
    { name: 'labelPosition', type: "'start' | 'end'", default: "'end'", values: ['start', 'end'], control: 'select', description: 'Put the label before (settings lists) or after (inline) the switch.' },
    { name: 'disabled', type: 'boolean', default: 'false', control: 'boolean', description: 'Disables the switch.' },
  ],
  examples: [
    { title: 'Basic', code: `<Stack gap={3}>\n  <Switch label="Enable notifications" defaultChecked />\n  <Switch label="Compact mode" size="sm" />\n  <Switch label="Unavailable" disabled />\n</Stack>` },
    { title: 'Controlled', code: `function Demo() {\n  const [on, setOn] = useState(true);\n  return (\n    <Stack gap={2}>\n      <Switch label="Auto-save" description="Save drafts every 30 seconds." checked={on} onCheckedChange={setOn} />\n      <Text variant="small" tone="muted">Auto-save is {on ? 'on' : 'off'}.</Text>\n    </Stack>\n  );\n}` },
    { title: 'Settings list', code: `<Stack gap={4} style={{ maxWidth: 420 }}>\n  <Switch label="Product updates" labelPosition="start" defaultChecked />\n  <Switch label="Security alerts" labelPosition="start" defaultChecked />\n  <Switch label="Marketing email" labelPosition="start" />\n</Stack>` },
  ],
  playground: {
    template: '<Switch {...props} />',
    initial: { label: 'Dark mode', description: '', defaultChecked: false, size: 'md', labelPosition: 'end', disabled: false },
  },
  accessibility: [
    'Uses `role="switch"` with `aria-checked`, announced as "switch, on/off".',
    'Toggles with Space and Enter; the label is linked so clicking it toggles too.',
  ],
  guidelines: {
    do: ['Use for settings that apply immediately.', 'Label the setting, not the state ("Notifications", not "Turn on").'],
    dont: ['Use inside a form that needs a submit button — use Checkbox.', 'Change unrelated settings when toggled.'],
  },
};
