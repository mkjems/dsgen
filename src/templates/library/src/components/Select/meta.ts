import type { ComponentMeta } from '../../../../../core/meta';

export const meta: ComponentMeta = {
  name: 'Select',
  category: 'Forms',
  summary: 'Lets users choose one option from a list.',
  description:
    'Select is a styled native `<select>`, which gives you robust keyboard support, mobile pickers and form integration for free. Its options are `SelectItem` children; each renders a native `<option>`.',
  extends: '<select> attributes (except `size`)',
  props: [
    { name: 'label', type: 'string', required: true, control: 'text', description: 'Visible label linked to the select.' },
    { name: 'placeholder', type: 'string', control: 'text', description: 'Adds an empty, disabled first option (e.g. "Choose a country") that is selected until the user picks a value.' },
    { name: 'hint', type: 'ReactNode', control: 'text', description: 'Helper text below the select.' },
    { name: 'error', type: 'ReactNode', control: 'text', description: 'Validation message; sets `aria-invalid`.' },
    { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", values: ['sm', 'md', 'lg'], control: 'select', description: 'Control height.' },
    { name: 'hideLabel', type: 'boolean', default: 'false', control: 'boolean', description: 'Visually hides the label.' },
    { name: 'disabled', type: 'boolean', default: 'false', control: 'boolean', description: 'Disables the select.' },
    { name: 'value / onChange', type: 'string / ChangeEventHandler', description: 'Use for a controlled select, or `defaultValue` for uncontrolled.' },
    { name: 'children', type: 'ReactNode', description: 'The `SelectItem`s. Values must be unique.' },
  ],
  subcomponents: [
    {
      name: 'SelectItem',
      description: 'One choice. Renders a native `<option>`, so it must be a direct child of `Select` with nothing wrapped around it.',
      extends: '<option> attributes',
      props: [
        { name: 'value', type: 'string', required: true, control: 'text', description: 'The value submitted, and matched by the Select’s `value`/`defaultValue`.' },
        { name: 'disabled', type: 'boolean', default: 'false', control: 'boolean', description: 'Shown but not selectable.' },
        { name: 'children', type: 'string', control: 'text', description: 'The visible label. Plain text only: `<option>` cannot hold elements.' },
      ],
    },
  ],
  examples: [
    { title: 'Basic', code: `<Select label="Country" placeholder="Choose a country">\n  <SelectItem value="dk">Denmark</SelectItem>\n  <SelectItem value="se">Sweden</SelectItem>\n  <SelectItem value="no">Norway</SelectItem>\n</Select>` },
    { title: 'Controlled', code: `function Demo() {\n  const [role, setRole] = useState('editor');\n  return (\n    <Stack gap={2}>\n      <Select label="Role" value={role} onChange={(e) => setRole(e.target.value)}>\n        <SelectItem value="viewer">Viewer</SelectItem>\n        <SelectItem value="editor">Editor</SelectItem>\n        <SelectItem value="owner" disabled>Owner</SelectItem>\n      </Select>\n      <Text variant="small" tone="muted">Selected: {role}</Text>\n    </Stack>\n  );\n}` },
    { title: 'Error', code: `<Select label="Plan" placeholder="Select a plan" error="Please choose a plan.">\n  <SelectItem value="free">Free</SelectItem>\n  <SelectItem value="pro">Pro</SelectItem>\n</Select>` },
  ],
  playground: {
    template: `<Select {...props}>\n  <SelectItem value="a">Option A</SelectItem>\n  <SelectItem value="b">Option B</SelectItem>\n  <SelectItem value="c">Option C</SelectItem>\n</Select>`,
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
