import { useId, useState, type ReactNode } from 'react';
import { cx } from '../../utils/cx';
import './RadioGroup.css';

export interface RadioOption {
  value: string;
  label: ReactNode;
  description?: ReactNode;
  disabled?: boolean;
}

export interface RadioGroupProps {
  /** Group label, rendered as a `<legend>`. */
  label: string;
  /** The choices. */
  options: RadioOption[];
  /** Controlled selected value. */
  value?: string;
  /** Initial value when uncontrolled. */
  defaultValue?: string;
  /** Called with the newly selected value. */
  onValueChange?: (value: string) => void;
  /** Form field name. Generated if omitted. */
  name?: string;
  /** Layout direction of the options. */
  orientation?: 'vertical' | 'horizontal';
  /** Disable every option. */
  disabled?: boolean;
  /** Error message for the group. */
  error?: ReactNode;
  /** Mark the group as required. */
  required?: boolean;
  className?: string;
}

export function RadioGroup({
  label,
  options,
  value,
  defaultValue,
  onValueChange,
  name,
  orientation = 'vertical',
  disabled = false,
  error,
  required,
  className,
}: RadioGroupProps) {
  const autoId = useId();
  const groupName = name ?? autoId;
  const [internal, setInternal] = useState(defaultValue);
  const selected = value !== undefined ? value : internal;

  const select = (v: string) => {
    if (value === undefined) setInternal(v);
    onValueChange?.(v);
  };

  return (
    <fieldset
      className={cx('ds-radiogroup', `ds-radiogroup--${orientation}`, className)}
      disabled={disabled}
      aria-invalid={error ? true : undefined}
      aria-describedby={error ? `${autoId}-error` : undefined}
    >
      <legend className="ds-field__label">
        {label}
        {required && <span className="ds-field__required" aria-hidden="true">*</span>}
      </legend>
      <div className="ds-radiogroup__options">
        {options.map((o) => {
          const id = `${autoId}-${o.value}`;
          return (
            <div key={o.value} className={cx('ds-radio', (disabled || o.disabled) && 'ds-radio--disabled')}>
              <input
                id={id}
                type="radio"
                className="ds-radio__input"
                name={groupName}
                value={o.value}
                checked={selected === o.value}
                disabled={o.disabled}
                required={required}
                onChange={() => select(o.value)}
              />
              <span className="ds-radio__dot" aria-hidden="true" />
              <span className="ds-radio__text">
                <label htmlFor={id} className="ds-radio__label">{o.label}</label>
                {o.description && <span className="ds-radio__description">{o.description}</span>}
              </span>
            </div>
          );
        })}
      </div>
      {error && <p id={`${autoId}-error`} className="ds-field__error" role="alert">{error}</p>}
    </fieldset>
  );
}
