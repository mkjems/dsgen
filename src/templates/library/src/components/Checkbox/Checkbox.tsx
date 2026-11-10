import { useEffect, useId, useRef, type ComponentPropsWithoutRef, type ReactNode } from 'react';
import { cx } from '../../utils/cx';
import './Checkbox.css';

export interface CheckboxProps extends Omit<ComponentPropsWithoutRef<'input'>, 'type' | 'size'> {
  /** Label shown next to the checkbox. */
  label: ReactNode;
  /** Secondary text below the label. */
  description?: ReactNode;
  /** Shows a dash for a "partially selected" state (e.g. select-all). */
  indeterminate?: boolean;
  /** Error message shown below the checkbox. */
  error?: ReactNode;
}

export function Checkbox({ label, description, indeterminate = false, error, id, className, disabled, ...rest }: CheckboxProps) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (ref.current) ref.current.indeterminate = indeterminate;
  }, [indeterminate]);

  const descId = description ? `${inputId}-desc` : undefined;
  const errId = error ? `${inputId}-error` : undefined;

  return (
    <div className={cx('ds-checkbox', disabled && 'ds-checkbox--disabled', className)}>
      <input
        ref={ref}
        id={inputId}
        type="checkbox"
        className="ds-checkbox__input"
        disabled={disabled}
        aria-invalid={error ? true : undefined}
        aria-describedby={[descId, errId].filter(Boolean).join(' ') || undefined}
        {...rest}
      />
      <span className="ds-checkbox__box" aria-hidden="true">
        <svg viewBox="0 0 16 16" className="ds-checkbox__check">
          <path d="M3.5 8.5l3 3 6-7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span className="ds-checkbox__dash" />
      </span>
      <span className="ds-checkbox__text">
        <label htmlFor={inputId} className="ds-checkbox__label">{label}</label>
        {description && <span id={descId} className="ds-checkbox__description">{description}</span>}
        {error && <span id={errId} className="ds-field__error" role="alert">{error}</span>}
      </span>
    </div>
  );
}
