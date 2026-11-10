import type { ComponentMeta } from '../../../../../core/meta';

export const meta: ComponentMeta = {
  name: 'Avatar',
  category: 'Data display',
  summary: 'Represents a person or organisation with an image or initials.',
  description:
    'Avatar shows a profile image and falls back to initials on a colour derived from the name when the image is missing or fails to load. The same name always produces the same colour.',
  extends: '<span> attributes',
  props: [
    { name: 'name', type: 'string', required: true, control: 'text', description: 'Full name. Used as the accessible label and to derive initials and colour.' },
    { name: 'src', type: 'string', control: 'text', description: 'Image URL. If it fails to load, initials are shown instead.' },
    { name: 'size', type: "'xs' | 'sm' | 'md' | 'lg' | 'xl'", default: "'md'", values: ['xs', 'sm', 'md', 'lg', 'xl'], control: 'select', description: 'Diameter: 24, 32, 40, 56 or 80px.' },
    { name: 'shape', type: "'circle' | 'square'", default: "'circle'", values: ['circle', 'square'], control: 'select', description: 'Use circles for people and squares for teams or organisations.' },
    { name: 'status', type: "'online' | 'away' | 'busy' | 'offline'", values: ['online', 'away', 'busy', 'offline'], control: 'select', description: 'Shows a presence dot; also added to the accessible label.' },
  ],
  examples: [
    { title: 'Sizes', code: `<Stack direction="row" gap={3} align="center">\n  <Avatar name="Ada Lovelace" size="xs" />\n  <Avatar name="Ada Lovelace" size="sm" />\n  <Avatar name="Ada Lovelace" size="md" />\n  <Avatar name="Ada Lovelace" size="lg" />\n  <Avatar name="Ada Lovelace" size="xl" />\n</Stack>` },
    { title: 'Initials fallback and status', code: `<Stack direction="row" gap={3}>\n  <Avatar name="Grace Hopper" status="online" />\n  <Avatar name="Alan Turing" status="away" />\n  <Avatar name="Katherine Johnson" status="busy" />\n  <Avatar name="Linus" status="offline" />\n  <Avatar name="Acme Corp" shape="square" />\n</Stack>` },
    { title: 'Broken image', description: 'A failing image falls back to initials automatically.', code: `<Avatar name="Margaret Hamilton" src="https://example.invalid/missing.png" size="lg" />` },
  ],
  playground: {
    template: '<Avatar {...props} />',
    initial: { name: 'Ada Lovelace', src: '', size: 'lg', shape: 'circle', status: 'online' },
  },
  accessibility: [
    'Rendered with `role="img"` and an `aria-label` containing the name (and status if set).',
    'The inner image has an empty alt to avoid double announcement.',
  ],
  guidelines: {
    do: ['Always pass a real name so the fallback and label are meaningful.'],
    dont: ['Rely on the status colour alone to convey presence in critical flows.'],
  },
};
