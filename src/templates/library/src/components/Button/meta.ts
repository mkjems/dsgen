import type { ComponentMeta } from '../../../../../core/meta';

export const meta: ComponentMeta = {
  name: 'Button',
  category: 'Actions',
  summary: 'Triggers an action or event, such as submitting a form or opening a dialog.',
  description:
    'Buttons communicate actions users can take. Use one solid button per view for the primary action, and outline or ghost buttons for secondary actions. Buttons forward every native `<button>` attribute, so `onClick`, `type="submit"`, `form` and ARIA attributes work as expected.',
  extends: '<button> attributes',
  props: [
    { name: 'variant', type: "'solid' | 'outline' | 'ghost' | 'danger'", default: "'solid'", values: ['solid', 'outline', 'ghost', 'danger'], control: 'select', description: 'Visual emphasis. `solid` for the primary action, `outline` for secondary, `ghost` for low-emphasis, `danger` for destructive actions.' },
    { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", values: ['sm', 'md', 'lg'], control: 'select', description: 'Height and padding, mapped to the control-height tokens.' },
    { name: 'loading', type: 'boolean', default: 'false', control: 'boolean', description: 'Shows a spinner, disables the button and sets `aria-busy="true"`. The button keeps its width so layouts do not shift.' },
    { name: 'fullWidth', type: 'boolean', default: 'false', control: 'boolean', description: 'Stretches the button to fill its container.' },
    { name: 'disabled', type: 'boolean', default: 'false', control: 'boolean', description: 'Prevents interaction. Prefer explaining why an action is unavailable over disabling silently.' },
    { name: 'startIcon', type: 'ReactNode', description: 'Icon rendered before the label. Hidden from assistive technology.' },
    { name: 'endIcon', type: 'ReactNode', description: 'Icon rendered after the label. Hidden from assistive technology.' },
    { name: 'type', type: "'button' | 'submit' | 'reset'", default: "'button'", values: ['button', 'submit', 'reset'], description: 'Native button type. Defaults to `button` (not `submit`) to avoid accidental form submissions.' },
    { name: 'children', type: 'ReactNode', required: true, control: 'text', description: 'The visible label. Use a short verb phrase such as "Save changes".' },
  ],
  examples: [
    { title: 'Variants', description: 'Use variant to communicate hierarchy.', code: `<Stack direction="row" gap={3} wrap>\n  <Button>Solid</Button>\n  <Button variant="outline">Outline</Button>\n  <Button variant="ghost">Ghost</Button>\n  <Button variant="danger">Delete</Button>\n</Stack>` },
    { title: 'Sizes', code: `<Stack direction="row" gap={3} align="center">\n  <Button size="sm">Small</Button>\n  <Button size="md">Medium</Button>\n  <Button size="lg">Large</Button>\n</Stack>` },
    { title: 'Loading state', description: 'Loading disables the button and announces the busy state.', code: `function Demo() {\n  const [loading, setLoading] = useState(false);\n  return (\n    <Button loading={loading} onClick={() => { setLoading(true); setTimeout(() => setLoading(false), 1500); }}>\n      Save changes\n    </Button>\n  );\n}` },
    { title: 'With icons', code: `<Stack direction="row" gap={3}>\n  <Button startIcon={<span>＋</span>}>New project</Button>\n  <Button variant="outline" endIcon={<span>→</span>}>Continue</Button>\n</Stack>` },
  ],
  playground: {
    template: '<Button {...props} />',
    initial: { children: 'Button', variant: 'solid', size: 'md', loading: false, fullWidth: false, disabled: false },
  },
  accessibility: [
    'Renders a native `<button>`, so it is focusable and activates with Enter and Space.',
    'Visible focus ring uses the `color-focus-ring` token with a 2px offset.',
    'When `loading`, `aria-busy="true"` is set and the button is disabled to prevent double submission.',
    'Icon-only buttons must have an `aria-label`.',
  ],
  guidelines: {
    do: ['Use a single solid button for the main action in a view.', 'Write labels as verbs: "Save", "Invite member".', 'Use `type="submit"` inside forms.'],
    dont: ['Use buttons for navigation — use a link instead.', 'Place two danger buttons next to each other.', 'Truncate button labels.'],
  },
};
