import type { ComponentMeta } from '../../../../../core/meta';

export const meta: ComponentMeta = {
  name: 'TextField',
  category: 'Forms',
  summary: 'A labelled single-line text input with hint and error states.',
  description:
    'TextField wraps a native `<input>` with a label, optional helper text and validation message, wired together with the correct ARIA attributes. Every native input attribute (`type`, `name`, `value`, `onChange`, `autoComplete`, …) is forwarded to the input element.',
  extends: '<input> attributes (except `size` and `prefix`)',
  props: [
    { name: 'label', type: 'string', required: true, control: 'text', description: 'Visible label, linked to the input with `htmlFor`. Required — use `hideLabel` if the design has no visible label.' },
    { name: 'hint', type: 'ReactNode', control: 'text', description: 'Helper text below the input, connected via `aria-describedby`.' },
    { name: 'error', type: 'ReactNode', control: 'text', description: 'Validation message. Sets `aria-invalid`, colours the border and replaces the hint. Announced to screen readers.' },
    { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", values: ['sm', 'md', 'lg'], control: 'select', description: 'Control height.' },
    { name: 'prefix', type: 'ReactNode', description: 'Content inside the field before the text, e.g. a currency symbol or icon.' },
    { name: 'suffix', type: 'ReactNode', description: 'Content inside the field after the text, e.g. a unit.' },
    { name: 'hideLabel', type: 'boolean', default: 'false', control: 'boolean', description: 'Visually hides the label but keeps it for assistive technology.' },
    { name: 'required', type: 'boolean', default: 'false', control: 'boolean', description: 'Marks the field required (native validation + visual asterisk).' },
    { name: 'disabled', type: 'boolean', default: 'false', control: 'boolean', description: 'Disables the input.' },
    { name: 'placeholder', type: 'string', control: 'text', description: 'Example input. Never use a placeholder as a replacement for the label.' },
  ],
  examples: [
    { title: 'Basic', code: `<TextField label="Full name" placeholder="Ada Lovelace" />` },
    { title: 'With hint and required', code: `<TextField label="Email" type="email" required hint="We will never share your email." />` },
    { title: 'Error state', code: `<TextField label="Username" defaultValue="ad" error="Username must be at least 3 characters." />` },
    { title: 'Prefix and suffix', code: `<Stack gap={4}>\n  <TextField label="Price" prefix="$" suffix="USD" inputMode="decimal" />\n  <TextField label="Search" hideLabel prefix="🔍" placeholder="Search…" />\n</Stack>` },
    { title: 'Controlled', code: `function Demo() {\n  const [value, setValue] = useState('');\n  return (\n    <TextField\n      label="Project name"\n      value={value}\n      onChange={(e) => setValue(e.target.value)}\n      hint={\`\${value.length}/40 characters\`}\n      maxLength={40}\n    />\n  );\n}` },
  ],
  playground: {
    template: '<TextField {...props} />',
    initial: { label: 'Email', placeholder: 'you@example.com', hint: 'We will never share your email.', error: '', size: 'md', required: false, disabled: false, hideLabel: false },
  },
  accessibility: [
    'The label is a real `<label>` linked to the input via a generated id.',
    'Hint and error messages are connected with `aria-describedby`.',
    'Errors set `aria-invalid="true"` and use `role="alert"` so they are announced when they appear.',
  ],
  guidelines: {
    do: ['Keep labels short and specific.', 'Validate on blur or submit, not on every keystroke.', 'Use the right `type` and `autoComplete` for better mobile keyboards and autofill.'],
    dont: ['Use placeholder text as a label.', 'Show an error before the user has interacted with the field.'],
  },
};
