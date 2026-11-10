import { useId, type ComponentPropsWithRef, type ReactNode } from 'react';
import { cx } from '../../utils/cx';
import './Select.css';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends Omit<ComponentPropsWithRef<'select'>, 'size'> {
  /** Visible label. */
  label: string;
  /** The options to choose from. */
  options: SelectOption[];
  /** Text of an empty first option shown before a choice is made. */
  placeholder?: string;
  /** Helper text shown below the select. */
  hint?: ReactNode;
  /** Error message. */
  error?: ReactNode;
  /** Control height. */
  size?: 'sm' | 'md' | 'lg';
  /** Visually hide the label. */
  hideLabel?: boolean;
}

export function Select({
  label,
  options,
  placeholder,
  hint,
  error,
  size = 'md',
  hideLabel = false,
  id,
  required,
  className,
  ...rest
}: SelectProps) {
  const autoId = useId();
  const selectId = id ?? autoId;
  const messageId = `${selectId}-message`;

  return (
    <div className={cx('ds-field', 'ds-select', className)}>
      <label htmlFor={selectId} className={cx('ds-field__label', hideLabel && 'ds-visually-hidden')}>
        {label}
        {required && <span className="ds-field__required" aria-hidden="true">*</span>}
      </label>
      <div className={cx('ds-select__control', `ds-select__control--${size}`, error && 'ds-select__control--invalid')}>
        <select
          id={selectId}
          className="ds-select__native"
          aria-invalid={error ? true : undefined}
          aria-describedby={error || hint ? messageId : undefined}
          required={required}
          defaultValue={rest.value === undefined && rest.defaultValue === undefined && placeholder ? '' : undefined}
          {...rest}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((o) => (
            <option key={o.value} value={o.value} disabled={o.disabled}>
              {o.label}
            </option>
          ))}
        </select>
        <svg className="ds-select__chevron" viewBox="0 0 16 16" aria-hidden="true">
          <path d="M4 6l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      {error ? (
        <p id={messageId} className="ds-field__error" role="alert">{error}</p>
      ) : hint ? (
        <p id={messageId} className="ds-field__hint">{hint}</p>
      ) : null}
    </div>
  );
}
