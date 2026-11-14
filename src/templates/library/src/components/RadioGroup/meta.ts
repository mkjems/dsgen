import type { ComponentMeta } from '../../../../../core/meta';

export const meta: ComponentMeta = {
  name: 'RadioGroup',
  category: 'Forms',
  summary: 'Lets users pick exactly one option from a small, visible set.',
  description:
    'RadioGroup renders a `<fieldset>` with a `<legend>` and native radio inputs, so arrow-key navigation and form submission work automatically. Each option is a `RadioGroupItem` child whose children are its label; add a `description` for richer choices such as plans.',
  props: [
    { name: 'label', type: 'string', required: true, control: 'text', description: 'Group label, rendered as the fieldset `<legend>`.' },
    { name: 'value', type: 'string', description: 'Controlled selected value. Pair with `onValueChange`.' },
    { name: 'defaultValue', type: 'string', control: 'text', description: 'Initially selected value when uncontrolled.' },
    { name: 'onValueChange', type: '(value: string) => void', description: 'Called with the value of the newly selected option.' },
    { name: 'name', type: 'string', description: 'Form field name. A unique name is generated when omitted.' },
    { name: 'orientation', type: "'vertical' | 'horizontal'", default: "'vertical'", values: ['vertical', 'horizontal'], control: 'select', description: 'Stack options vertically or lay them out in a row.' },
    { name: 'disabled', type: 'boolean', default: 'false', control: 'boolean', description: 'Disables every option.' },
    { name: 'error', type: 'ReactNode', control: 'text', description: 'Validation message for the group.' },
    { name: 'required', type: 'boolean', default: 'false', control: 'boolean', description: 'Requires a selection before the form can submit.' },
    { name: 'children', type: 'ReactNode', description: 'The `RadioGroupItem`s. Values must be unique.' },
  ],
  subcomponents: [
    {
      name: 'RadioGroupItem',
      description: 'One option. Its children are the label.',
      props: [
        { name: 'value', type: 'string', required: true, control: 'text', description: 'The value submitted and passed to `onValueChange` when this option is chosen.' },
        { name: 'description', type: 'ReactNode', control: 'text', description: 'Supporting text under the label.' },
        { name: 'disabled', type: 'boolean', default: 'false', control: 'boolean', description: 'Shown but not selectable.' },
        { name: 'children', type: 'ReactNode', control: 'text', description: 'The label.' },
      ],
    },
  ],
  examples: [
    { title: 'Basic', code: `<RadioGroup label="Notification frequency" defaultValue="daily">\n  <RadioGroupItem value="realtime">Real-time</RadioGroupItem>\n  <RadioGroupItem value="daily">Daily digest</RadioGroupItem>\n  <RadioGroupItem value="weekly">Weekly digest</RadioGroupItem>\n</RadioGroup>` },
    { title: 'With descriptions', code: `<RadioGroup label="Plan" defaultValue="pro">\n  <RadioGroupItem value="free" description="Up to 3 projects.">Free</RadioGroupItem>\n  <RadioGroupItem value="pro" description="Unlimited projects and priority support.">Pro</RadioGroupItem>\n  <RadioGroupItem value="enterprise" description="Contact sales." disabled>Enterprise</RadioGroupItem>\n</RadioGroup>` },
    { title: 'Horizontal, controlled', code: `function Demo() {\n  const [size, setSize] = useState('m');\n  return (\n    <RadioGroup label="T-shirt size" orientation="horizontal" value={size} onValueChange={setSize}>\n      {['s', 'm', 'l', 'xl'].map((v) => (\n        <RadioGroupItem key={v} value={v}>{v.toUpperCase()}</RadioGroupItem>\n      ))}\n    </RadioGroup>\n  );\n}` },
  ],
  playground: {
    template: `<RadioGroup {...props}>\n  <RadioGroupItem value="one">Option one</RadioGroupItem>\n  <RadioGroupItem value="two">Option two</RadioGroupItem>\n  <RadioGroupItem value="three">Option three</RadioGroupItem>\n</RadioGroup>`,
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
