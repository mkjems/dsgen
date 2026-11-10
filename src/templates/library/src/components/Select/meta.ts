import type { ComponentMeta } from '../../../../../core/meta';

export const meta: ComponentMeta = {
  name: 'Select',
  category: 'Forms',
  summary: 'Lets users choose one option from a list.',
  description:
    'Select is a styled native `<select>`, which gives you robust keyboard support, mobile pickers and form integration for free. Pass options as an array of `{ value, label, disabled? }` objects.',
  extends: '<select> attributes (except `size`)',
  props: [
    { name: 'label', type: 'string', required: true, control: 'text', description: 'Visible label linked to the select.' },
    { name: 'options', type: 'SelectOption[]', required: true, description: 'Array of `{ value: string; label: string; disabled?: boolean }`. Values must be unique.' },
    { name: 'placeholder', type: 'string', control: 'text', description: 'Adds an empty, disabled first option (e.g. "Choose a country") that is selected until the user picks a value.' },
    { name: 'hint', type: 'ReactNode', control: 'text', description: 'Helper text below the select.' },
    { name: 'error', type: 'ReactNode', control: 'text', description: 'Validation message; sets `aria-invalid`.' },
    { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", values: ['sm', 'md', 'lg'], control: 'select', description: 'Control height.' },
    { name: 'hideLabel', type: 'boolean', default: 'false', control: 'boolean', description: 'Visually hides the label.' },
    { name: 'disabled', type: 'boolean', default: 'false', control: 'boolean', description: 'Disables the select.' },
    { name: 'value / onChange', type: 'string / ChangeEventHandler', description: 'Use for a controlled select, or `defaultValue` for uncontrolled.' },
  ],
  examples: [
    { title: 'Basic', code: `<Select\n  label="Country"\n  placeholder="Choose a country"\n  options={[\n    { value: 'dk', label: 'Denmark' },\n    { value: 'se', label: 'Sweden' },\n    { value: 'no', label: 'Norway' },\n  ]}\n/>` },
    { title: 'Controlled', code: `function Demo() {\n  const [role, setRole] = useState('editor');\n  return (\n    <Stack gap={2}>\n      <Select\n        label="Role"\n        value={role}\n        onChange={(e) => setRole(e.target.value)}\n        options={[\n          { value: 'viewer', label: 'Viewer' },\n          { value: 'editor', label: 'Editor' },\n          { value: 'owner', label: 'Owner', disabled: true },\n        ]}\n      />\n      <Text variant="small" tone="muted">Selected: {role}</Text>\n    </Stack>\n  );\n}` },
    { title: 'Error', code: `<Select label="Plan" placeholder="Select a plan" error="Please choose a plan." options={[{ value: 'free', label: 'Free' }, { value: 'pro', label: 'Pro' }]} />` },
  ],
  playground: {
    template: `<Select {...props} options={[{ value: 'a', label: 'Option A' }, { value: 'b', label: 'Option B' }, { value: 'c', label: 'Option C' }]} />`,
    initial: { label: 'Choose an option', placeholder: 'Select…', hint: '', error: '', size: 'md', disabled: false, hideLabel: false },
  },
  accessibility: [
    'Uses the native `<select>` so screen readers and mobile OS pickers work out of the box.',
    'Label, hint and error are wired with `htmlFor` and `aria-describedby`.',
  ],
  guidelines: {
    do: ['Use for 5–15 options.', 'Order options logically (alphabetical, by frequency, or natural order).'],
    dont: ['Use for 2–4 options — prefer RadioGroup so all choices are visible.', 'Use for very long lists without search.'],
  },
};
