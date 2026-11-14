import { createContext, use, useId, useMemo, useState, type ReactNode } from 'react';
import { cx } from '../../utils/cx';
import './RadioGroup.css';

/*
 * RadioGroup is composed from its items:
 *
 *   <RadioGroup label="Plan" defaultValue="pro">
 *     <RadioGroupItem value="free">Free</RadioGroupItem>
 *     <RadioGroupItem value="pro" description="Unlimited projects.">Pro</RadioGroupItem>
 *   </RadioGroup>
 *
 * The items share the group's state through context and render native radio inputs with a shared
 * `name`, so arrow-key navigation and form submission come from the browser. No part inspects its
 * children, so items keep working when other elements sit between them.
 */

interface RadioGroupContextValue {
  name: string;
  selected: string | undefined;
  disabled: boolean;
  required: boolean | undefined;
  select: (value: string) => void;
}

const RadioGroupContext = createContext<RadioGroupContextValue | null>(null);

export interface RadioGroupProps {
  /** Group label, rendered as a `<legend>`. */
  label: string;
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
  /** The `RadioGroupItem`s. */
  children?: ReactNode;
}

export function RadioGroup({
  label,
  value,
  defaultValue,
  onValueChange,
  name,
  orientation = 'vertical',
  disabled = false,
  error,
  required,
  className,
  children,
}: RadioGroupProps) {
  const autoId = useId();
  const groupName = name ?? autoId;
  const [internal, setInternal] = useState(defaultValue);
  const controlled = value !== undefined;
  const selected = controlled ? value : internal;

  const ctx = useMemo<RadioGroupContextValue>(
    () => ({
      name: groupName,
      selected,
      disabled,
      required,
      select: (next) => {
        if (!controlled) setInternal(next);
        onValueChange?.(next);
      },
    }),
    [groupName, selected, disabled, required, controlled, onValueChange],
  );

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
      <RadioGroupContext value={ctx}>
        <div className="ds-radiogroup__options">{children}</div>
      </RadioGroupContext>
      {error && <p id={`${autoId}-error`} className="ds-field__error" role="alert">{error}</p>}
    </fieldset>
  );
}

export interface RadioGroupItemProps {
  /** The value submitted and passed to `onValueChange` when this option is chosen. */
  value: string;
  /** Supporting text under the label. */
  description?: ReactNode;
  /** Shown but not selectable. */
  disabled?: boolean;
  className?: string;
  /** The label. */
  children?: ReactNode;
}

/** One option in a RadioGroup. Its children are the label. */
export function RadioGroupItem({ value, description, disabled = false, className, children }: RadioGroupItemProps) {
  const ctx = use(RadioGroupContext);
  if (!ctx) throw new Error('<RadioGroupItem> must be used inside <RadioGroup>.');
  const id = useId();
  return (
    <div className={cx('ds-radio', (ctx.disabled || disabled) && 'ds-radio--disabled', className)}>
      <input
        id={id}
        type="radio"
        className="ds-radio__input"
        name={ctx.name}
        value={value}
        checked={ctx.selected === value}
        disabled={disabled}
        required={ctx.required}
        onChange={() => ctx.select(value)}
      />
      <span className="ds-radio__dot" aria-hidden="true" />
      <span className="ds-radio__text">
        <label htmlFor={id} className="ds-radio__label">{children}</label>
        {description && <span className="ds-radio__description">{description}</span>}
      </span>
    </div>
  );
}
