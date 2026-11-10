import type { ComponentMeta } from '../../../../../core/meta';

export const meta: ComponentMeta = {
  name: 'Checkbox',
  category: 'Forms',
  summary: 'Toggles a single option on or off, or selects several items from a list.',
  description:
    'Checkbox is a native checkbox input with a custom visual, a clickable label, an optional description and an indeterminate state for "select all" patterns. Use `checked` + `onChange` for controlled usage or `defaultChecked` for uncontrolled.',
  extends: '<input type="checkbox"> attributes',
  props: [
    { name: 'label', type: 'ReactNode', required: true, control: 'text', description: 'Clickable label next to the box.' },
    { name: 'description', type: 'ReactNode', control: 'text', description: 'Secondary explanation below the label, linked with `aria-describedby`.' },
    { name: 'indeterminate', type: 'boolean', default: 'false', control: 'boolean', description: 'Shows a dash to indicate a partially selected group. Visual only — set `checked` separately.' },
    { name: 'error', type: 'ReactNode', control: 'text', description: 'Validation message, e.g. for a required terms checkbox.' },
    { name: 'checked', type: 'boolean', description: 'Controlled checked state. Pair with `onChange`.' },
    { name: 'defaultChecked', type: 'boolean', control: 'boolean', description: 'Initial state for uncontrolled usage.' },
    { name: 'disabled', type: 'boolean', default: 'false', control: 'boolean', description: 'Disables the checkbox.' },
  ],
  examples: [
    { title: 'Basic', code: `<Stack gap={3}>\n  <Checkbox label="Email me about product updates" defaultChecked />\n  <Checkbox label="Send weekly digest" description="A summary of activity every Monday." />\n  <Checkbox label="Disabled option" disabled />\n</Stack>` },
    { title: 'Select all (indeterminate)', code: `function Demo() {\n  const [items, setItems] = useState([true, false, true]);\n  const all = items.every(Boolean);\n  const some = items.some(Boolean) && !all;\n  return (\n    <Stack gap={2}>\n      <Checkbox label="Select all" checked={all} indeterminate={some}\n        onChange={() => setItems(items.map(() => !all))} />\n      <Stack gap={2} style={{ paddingLeft: 28 }}>\n        {['Design', 'Engineering', 'Marketing'].map((name, i) => (\n          <Checkbox key={name} label={name} checked={items[i]}\n            onChange={() => setItems(items.map((v, j) => (j === i ? !v : v)))} />\n        ))}\n      </Stack>\n    </Stack>\n  );\n}` },
    { title: 'Error', code: `<Checkbox label="I accept the terms and conditions" error="You must accept the terms to continue." />` },
  ],
  playground: {
    template: '<Checkbox {...props} />',
    initial: { label: 'Remember me', description: '', indeterminate: false, error: '', defaultChecked: false, disabled: false },
  },
  accessibility: [
    'A native checkbox input keeps keyboard (Space) and screen reader support.',
    'The `indeterminate` DOM property is set so assistive tech announces "mixed".',
    'The whole label is clickable, giving a large hit area.',
  ],
  guidelines: {
    do: ['Use positive phrasing: "Send me updates" rather than "Don\'t send me updates".', 'Use for independent options where several can be selected.'],
    dont: ['Use a checkbox for an immediate on/off setting — use Switch.', 'Use for mutually exclusive choices — use RadioGroup.'],
  },
};
