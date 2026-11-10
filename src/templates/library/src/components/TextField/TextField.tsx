import { useId, type ComponentPropsWithRef, type ReactNode } from 'react';
import { cx } from '../../utils/cx';
import './TextField.css';

export interface TextFieldProps extends Omit<ComponentPropsWithRef<'input'>, 'size' | 'prefix'> {
  /** Visible label. Always required for accessibility. */
  label: string;
  /** Helper text shown below the input. */
  hint?: ReactNode;
  /** Error message. Marks the input invalid and replaces the hint. */
  error?: ReactNode;
  /** Control height. */
  size?: 'sm' | 'md' | 'lg';
  /** Content rendered inside the input, before the text (e.g. an icon or currency). */
  prefix?: ReactNode;
  /** Content rendered inside the input, after the text (e.g. a unit). */
  suffix?: ReactNode;
  /** Visually hide the label while keeping it available to screen readers. */
  hideLabel?: boolean;
}

export function TextField({
  label,
  hint,
  error,
  size = 'md',
  prefix,
  suffix,
  hideLabel = false,
  id,
  required,
  disabled,
  className,
  ...rest
}: TextFieldProps) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const hintId = `${inputId}-hint`;
  const errorId = `${inputId}-error`;
  const describedBy = [error ? errorId : null, hint && !error ? hintId : null].filter(Boolean).join(' ') || undefined;

  return (
    <div className={cx('ds-field', 'ds-textfield', className)}>
      <label htmlFor={inputId} className={cx('ds-field__label', hideLabel && 'ds-visually-hidden')}>
        {label}
        {required && <span className="ds-field__required" aria-hidden="true">*</span>}
      </label>
      <div
        className={cx(
          'ds-textfield__control',
          `ds-textfield__control--${size}`,
          error && 'ds-textfield__control--invalid',
          disabled && 'ds-textfield__control--disabled',
        )}
      >
        {prefix && <span className="ds-textfield__affix">{prefix}</span>}
        <input
          id={inputId}
          className="ds-textfield__input"
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          required={required}
          disabled={disabled}
          {...rest}
        />
        {suffix && <span className="ds-textfield__affix">{suffix}</span>}
      </div>
      {error ? (
        <p id={errorId} className="ds-field__error" role="alert">{error}</p>
      ) : hint ? (
        <p id={hintId} className="ds-field__hint">{hint}</p>
      ) : null}
    </div>
  );
}
