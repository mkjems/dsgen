import { useId, type ReactNode } from 'react';
import type { ValidationIssue } from '../core/defaults';
import { isHex } from '../core/color';

export function Field({ label, hint, issues = [], children, id }: { label: string; hint?: ReactNode; issues?: ValidationIssue[]; children: ReactNode; id: string }) {
  return (
    <div className="wz-field">
      <label className="wz-label" htmlFor={id}>{label}</label>
      {children}
      {issues.map((i) => (
        <p key={i.message} className={i.severity === 'error' ? 'wz-msg wz-msg--error' : 'wz-msg wz-msg--warn'} role={i.severity === 'error' ? 'alert' : undefined}>
          {i.severity === 'error' ? '✖' : '⚠'} {i.message}
        </p>
      ))}
      {hint && issues.length === 0 && <p className="wz-hint">{hint}</p>}
    </div>
  );
}

export function TextInput(props: { label: string; value: string; onChange: (v: string) => void; hint?: ReactNode; issues?: ValidationIssue[]; placeholder?: string; mono?: boolean }) {
  const id = useId();
  return (
    <Field id={id} label={props.label} hint={props.hint} issues={props.issues}>
      <input id={id} className={`wz-input${props.mono ? ' wz-input--mono' : ''}`} value={props.value} placeholder={props.placeholder}
        aria-invalid={props.issues?.some((i) => i.severity === 'error') || undefined} onChange={(e) => props.onChange(e.target.value)} />
    </Field>
  );
}

export function TextArea(props: { label: string; value: string; onChange: (v: string) => void; hint?: ReactNode; issues?: ValidationIssue[] }) {
  const id = useId();
  return (
    <Field id={id} label={props.label} hint={props.hint} issues={props.issues}>
      <textarea id={id} className="wz-input wz-textarea" rows={2} value={props.value} onChange={(e) => props.onChange(e.target.value)} />
    </Field>
  );
}

export function SelectInput<T extends string | number>(props: { label: string; value: T; options: { label: string; value: T }[]; onChange: (v: T) => void; hint?: ReactNode; issues?: ValidationIssue[] }) {
  const id = useId();
  return (
    <Field id={id} label={props.label} hint={props.hint} issues={props.issues}>
      <select id={id} className="wz-input" value={String(props.value)}
        onChange={(e) => {
          const opt = props.options.find((o) => String(o.value) === e.target.value);
          if (opt) props.onChange(opt.value);
        }}>
        {props.options.map((o) => <option key={String(o.value)} value={String(o.value)}>{o.label}</option>)}
      </select>
    </Field>
  );
}

export function Slider(props: { label: string; value: number; min: number; max: number; step: number; unit?: string; onChange: (v: number) => void; hint?: ReactNode; issues?: ValidationIssue[] }) {
  const id = useId();
  return (
    <Field id={id} label={props.label} hint={props.hint} issues={props.issues}>
      <div className="wz-slider">
        <input id={id} type="range" min={props.min} max={props.max} step={props.step} value={props.value} onChange={(e) => props.onChange(Number(e.target.value))} />
        <output htmlFor={id}>{props.value}{props.unit}</output>
      </div>
    </Field>
  );
}

export function Toggle(props: { label: string; description?: string; checked: boolean; onChange: (v: boolean) => void }) {
  const id = useId();
  return (
    <div className="wz-toggle">
      <button id={id} type="button" role="switch" aria-checked={props.checked} className="wz-toggle__switch" onClick={() => props.onChange(!props.checked)}>
        <span />
      </button>
      <label htmlFor={id}>
        <strong>{props.label}</strong>
        {props.description && <span>{props.description}</span>}
      </label>
    </div>
  );
}

export function ColorInput(props: { label: string; value: string; onChange: (v: string) => void; hint?: string; issues?: ValidationIssue[] }) {
  const id = useId();
  const valid = isHex(props.value);
  return (
    <Field id={id} label={props.label} hint={props.hint} issues={props.issues}>
      <div className="wz-color">
        <input type="color" aria-label={`${props.label} colour picker`} value={valid ? normalizeHex(props.value) : '#000000'} onChange={(e) => props.onChange(e.target.value)} />
        <input id={id} className="wz-input wz-input--mono" value={props.value} spellCheck={false} onChange={(e) => props.onChange(e.target.value.trim())} />
      </div>
    </Field>
  );
}

function normalizeHex(hex: string) {
  const h = hex.replace('#', '');
  return '#' + (h.length === 3 ? h.split('').map((c) => c + c).join('') : h).toLowerCase();
}

export function ChoiceCards<T extends string | number>(props: { label: string; value: T; options: { value: T; title: string; description?: string; visual?: ReactNode }[]; onChange: (v: T) => void }) {
  const name = useId();
  return (
    <fieldset className="wz-choices">
      <legend className="wz-label">{props.label}</legend>
      <div className="wz-choices__grid">
        {props.options.map((o) => (
          <label key={String(o.value)} className={`wz-choice${o.value === props.value ? ' wz-choice--selected' : ''}`}>
            <input type="radio" name={name} checked={o.value === props.value} onChange={() => props.onChange(o.value)} />
            {o.visual && <span className="wz-choice__visual" aria-hidden="true">{o.visual}</span>}
            <span className="wz-choice__title">{o.title}</span>
            {o.description && <span className="wz-choice__desc">{o.description}</span>}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

export function StepHeader({ title, children }: { title: string; children: ReactNode }) {
  return (
    <header className="wz-step-header">
      <h1>{title}</h1>
      <p>{children}</p>
    </header>
  );
}
