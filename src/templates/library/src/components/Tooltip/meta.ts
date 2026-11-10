import type { ComponentMeta } from '../../../../../core/meta';

export const meta: ComponentMeta = {
  name: 'Tooltip',
  category: 'Overlays',
  summary: 'Shows a short hint when an element is hovered or focused.',
  description:
    'Tooltip wraps a single focusable trigger and shows a non-interactive label on hover (after a delay) and immediately on keyboard focus. Escape dismisses it. The trigger gets `aria-describedby` pointing at the tooltip while visible.',
  props: [
    { name: 'content', type: 'ReactNode', required: true, control: 'text', description: 'Tooltip text. Keep it short; never put links or buttons inside.' },
    { name: 'children', type: 'ReactElement', required: true, description: 'Exactly one focusable element (e.g. a Button) that triggers the tooltip.' },
    { name: 'placement', type: "'top' | 'bottom' | 'left' | 'right'", default: "'top'", values: ['top', 'bottom', 'left', 'right'], control: 'select', description: 'Side of the trigger where the tooltip appears.' },
    { name: 'delay', type: 'number', default: '300', control: 'number', description: 'Hover delay in milliseconds. Keyboard focus shows it immediately.' },
  ],
  examples: [
    { title: 'Placements', code: `<Stack direction="row" gap={4} style={{ padding: '48px 0' }} justify="center">\n  <Tooltip content="Top" placement="top"><Button variant="outline">Top</Button></Tooltip>\n  <Tooltip content="Bottom" placement="bottom"><Button variant="outline">Bottom</Button></Tooltip>\n  <Tooltip content="Left" placement="left"><Button variant="outline">Left</Button></Tooltip>\n  <Tooltip content="Right" placement="right"><Button variant="outline">Right</Button></Tooltip>\n</Stack>` },
    { title: 'Icon button hint', code: `<Tooltip content="Copy link to clipboard">\n  <Button variant="ghost" aria-label="Copy link">⧉</Button>\n</Tooltip>` },
  ],
  playground: {
    template: '<div style={{ padding: 48, display: "flex", justifyContent: "center" }}><Tooltip {...props}><Button variant="outline">Hover or focus me</Button></Tooltip></div>',
    initial: { content: 'Helpful hint', placement: 'top', delay: 300 },
  },
  accessibility: [
    'The bubble has `role="tooltip"` and is referenced by the trigger\'s `aria-describedby` while visible.',
    'Appears on keyboard focus without delay and closes with Escape (WCAG 1.4.13).',
    'Tooltips supplement — never replace — a visible or `aria-label` name.',
  ],
  guidelines: {
    do: ['Use for brief clarifications of icons and controls.'],
    dont: ['Put essential information only in a tooltip.', 'Wrap disabled buttons (they cannot receive focus).'],
  },
};
