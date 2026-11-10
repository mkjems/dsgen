import type { ComponentMeta } from '../../../../../core/meta';

export const meta: ComponentMeta = {
  name: 'RadioGroup',
  category: 'Forms',
  summary: 'Lets users pick exactly one option from a small, visible set.',
  description:
    'RadioGroup renders a `<fieldset>` with a `<legend>` and native radio inputs, so arrow-key navigation and form submission work automatically. Options can include a description for richer choices such as plans.',
  props: [
    { name: 'label', type: 'string', required: true, control: 'text', description: 'Group label, rendered as the fieldset `<legend>`.' },
    { name: 'options', type: 'RadioOption[]', required: true, description: 'Array of `{ value: string; label: ReactNode; description?: ReactNode; disabled?: boolean }`.' },
    { name: 'value', type: 'string', description: 'Controlled selected value. Pair with `onValueChange`.' },
    { name: 'defaultValue', type: 'string', control: 'text', description: 'Initially selected value when uncontrolled.' },
    { name: 'onValueChange', type: '(value: string) => void', description: 'Called with the value of the newly selected option.' },
    { name: 'name', type: 'string', description: 'Form field name. A unique name is generated when omitted.' },
    { name: 'orientation', type: "'vertical' | 'horizontal'", default: "'vertical'", values: ['vertical', 'horizontal'], control: 'select', description: 'Stack options vertically or lay them out in a row.' },
    { name: 'disabled', type: 'boolean', default: 'false', control: 'boolean', description: 'Disables every option.' },
    { name: 'error', type: 'ReactNode', control: 'text', description: 'Validation message for the group.' },
    { name: 'required', type: 'boolean', default: 'false', control: 'boolean', description: 'Requires a selection before the form can submit.' },
  ],
  examples: [
    { title: 'Basic', code: `<RadioGroup\n  label="Notification frequency"\n  defaultValue="daily"\n  options={[\n    { value: 'realtime', label: 'Real-time' },\n    { value: 'daily', label: 'Daily digest' },\n    { value: 'weekly', label: 'Weekly digest' },\n  ]}\n/>` },
    { title: 'With descriptions', code: `<RadioGroup\n  label="Plan"\n  defaultValue="pro"\n  options={[\n    { value: 'free', label: 'Free', description: 'Up to 3 projects.' },\n    { value: 'pro', label: 'Pro', description: 'Unlimited projects and priority support.' },\n    { value: 'enterprise', label: 'Enterprise', description: 'Contact sales.', disabled: true },\n  ]}\n/>` },
    { title: 'Horizontal, controlled', code: `function Demo() {\n  const [size, setSize] = useState('m');\n  return (\n    <RadioGroup label="T-shirt size" orientation="horizontal" value={size} onValueChange={setSize}\n      options={['s', 'm', 'l', 'xl'].map((v) => ({ value: v, label: v.toUpperCase() }))} />\n  );\n}` },
  ],
  playground: {
    template: `<RadioGroup {...props} options={[{ value: 'one', label: 'Option one' }, { value: 'two', label: 'Option two' }, { value: 'three', label: 'Option three' }]} />`,
    initial: { label: 'Pick one', defaultValue: 'one', orientation: 'vertical', disabled: false, error: '', required: false },
  },
  accessibility: [
    'Fieldset and legend give the group an accessible name.',
    'Native radios provide arrow-key navigation within the group and Tab to enter/leave it.',
  ],
  guidelines: {
    do: ['Use for 2–5 mutually exclusive options.', 'Pre-select a sensible default when one exists.'],
    dont: ['Use when users may pick several options — use Checkbox.', 'Use for long lists — use Select.'],
  },
};
