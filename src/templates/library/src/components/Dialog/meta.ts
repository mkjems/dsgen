import type { ComponentMeta } from '../../../../../core/meta';

export const meta: ComponentMeta = {
  name: 'Dialog',
  category: 'Overlays',
  summary: 'A modal window that focuses the user on a single task or decision.',
  description:
    'Dialog is built on the native `<dialog>` element with `showModal()`, which provides a real focus trap, Escape-to-close, an inert background and top-layer rendering without portals. It is fully controlled: you own the `open` state and close it in `onClose`.',
  props: [
    { name: 'open', type: 'boolean', required: true, control: 'boolean', description: 'Shows or hides the dialog.' },
    { name: 'onClose', type: '() => void', required: true, description: 'Called on Escape, the close button or a backdrop click. Set `open` to `false` here.' },
    { name: 'title', type: 'ReactNode', required: true, control: 'text', description: 'Heading; also used as the accessible name via `aria-labelledby`.' },
    { name: 'description', type: 'ReactNode', control: 'text', description: 'Supporting text, linked via `aria-describedby`.' },
    { name: 'children', type: 'ReactNode', description: 'Body content such as a form.' },
    { name: 'footer', type: 'ReactNode', description: 'Action buttons. Put the primary action last.' },
    { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", values: ['sm', 'md', 'lg'], control: 'select', description: 'Maximum width: 400, 520 or 720px.' },
    { name: 'closeOnBackdropClick', type: 'boolean', default: 'true', control: 'boolean', description: 'Close when the backdrop is clicked. Disable for forms where data could be lost.' },
    { name: 'hideCloseButton', type: 'boolean', default: 'false', control: 'boolean', description: 'Hides the × button. Make sure the footer offers a way out.' },
  ],
  examples: [
    { title: 'Confirmation', code: `function Demo() {\n  const [open, setOpen] = useState(false);\n  return (\n    <>\n      <Button variant="danger" onClick={() => setOpen(true)}>Delete project</Button>\n      <Dialog\n        open={open}\n        onClose={() => setOpen(false)}\n        size="sm"\n        title="Delete project?"\n        description="This permanently deletes the project and all of its data. This cannot be undone."\n        footer={<>\n          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>\n          <Button variant="danger" onClick={() => setOpen(false)}>Delete</Button>\n        </>}\n      />\n    </>\n  );\n}` },
    { title: 'With a form', code: `function Demo() {\n  const [open, setOpen] = useState(false);\n  return (\n    <>\n      <Button onClick={() => setOpen(true)}>Invite member</Button>\n      <Dialog open={open} onClose={() => setOpen(false)} closeOnBackdropClick={false}\n        title="Invite a team member" description="They will receive an email invitation."\n        footer={<>\n          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>\n          <Button onClick={() => setOpen(false)}>Send invite</Button>\n        </>}>\n        <Stack gap={4}>\n          <TextField label="Email" type="email" placeholder="name@company.com" />\n        </Stack>\n      </Dialog>\n    </>\n  );\n}` },
  ],
  accessibility: [
    'Native `<dialog>` + `showModal()` traps focus, makes the page inert and closes on Escape.',
    'Focus moves into the dialog when opened and returns to the trigger when closed.',
    'The title and description are linked with `aria-labelledby` / `aria-describedby`.',
  ],
  guidelines: {
    do: ['Use for decisions that need full attention.', 'Label buttons with the action ("Delete"), not "OK".'],
    dont: ['Open a dialog on page load.', 'Stack dialogs on top of each other.'],
  },
};
