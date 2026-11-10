import { ColorInput, StepHeader, Toggle } from '../ui';
import { issuesFor, type StepProps } from './types';

const PRESETS = [
  { name: 'Indigo', primary: '#4f46e5', neutral: '#64748b' },
  { name: 'Ocean', primary: '#0369a1', neutral: '#64748b' },
  { name: 'Teal', primary: '#0f766e', neutral: '#6b7280' },
  { name: 'Forest', primary: '#15803d', neutral: '#71717a' },
  { name: 'Rose', primary: '#e11d48', neutral: '#78716c' },
  { name: 'Violet', primary: '#7c3aed', neutral: '#6b7280' },
  { name: 'Amber', primary: '#b45309', neutral: '#78716c' },
  { name: 'Graphite', primary: '#18181b', neutral: '#71717a' },
];

const FIELDS = [
  ['primary', 'Primary (brand)', 'Buttons, links, focus rings and selected states.'],
  ['neutral', 'Neutral', 'Tints the greys for text, borders and surfaces. Chroma is capped so greys stay grey.'],
  ['success', 'Success', 'Confirmations and positive status.'],
  ['warning', 'Warning', 'Caution states that need attention.'],
  ['danger', 'Danger', 'Errors and destructive actions.'],
  ['info', 'Info', 'Neutral, informative messages.'],
] as const;

export function ColorsStep({ config, issues, update }: StepProps) {
  const c = config.colors;
  return (
    <>
      <StepHeader title="Colours">
        Pick base colours. Each one becomes an 11-step palette generated in the OKLCH colour space, then mapped to semantic roles for light{c.darkMode ? ' and dark' : ''} themes. The preview shows contrast checks as you edit.
      </StepHeader>
      <div className="wz-form">
        <div className="wz-field">
          <span className="wz-label">Presets</span>
          <div className="wz-presets">
            {PRESETS.map((p) => (
              <button key={p.name} type="button" className={`wz-preset${c.primary === p.primary ? ' wz-preset--active' : ''}`}
                onClick={() => update('colors', { primary: p.primary, neutral: p.neutral }, `Applied “${p.name}” preset`)}>
                <span style={{ background: p.primary }} />
                {p.name}
              </button>
            ))}
          </div>
        </div>
        <div className="wz-row">
          {FIELDS.map(([key, label, hint]) => (
            <ColorInput key={key} label={label} hint={hint} value={c[key]} issues={issuesFor(issues, key)}
              onChange={(v) => update('colors', { [key]: v }, `${label} → ${v}`)} />
          ))}
        </div>
        <Toggle label="Dark mode" description="Generate a dark theme. It activates with prefers-color-scheme or data-theme=&quot;dark&quot;."
          checked={c.darkMode} onChange={(v) => update('colors', { darkMode: v }, `Dark mode ${v ? 'on' : 'off'}`)} />
      </div>
    </>
  );
}
