import { useId, useState, type ComponentPropsWithoutRef, type ReactNode } from 'react';
import { cx } from '../../utils/cx';
import './Switch.css';

export interface SwitchProps extends Omit<ComponentPropsWithoutRef<'button'>, 'onChange' | 'value'> {
  /** Label describing the setting. */
  label: ReactNode;
  /** Secondary text below the label. */
  description?: ReactNode;
  /** Controlled on/off state. */
  checked?: boolean;
  /** Initial state when uncontrolled. */
  defaultChecked?: boolean;
  /** Called with the new state when toggled. */
  onCheckedChange?: (checked: boolean) => void;
  /** Track size. */
  size?: 'sm' | 'md';
  /** Place the label before or after the switch. */
  labelPosition?: 'start' | 'end';
}

export function Switch({
  label,
  description,
  checked,
  defaultChecked = false,
  onCheckedChange,
  size = 'md',
  labelPosition = 'end',
  disabled,
  id,
  className,
  ...rest
}: SwitchProps) {
  const autoId = useId();
  const switchId = id ?? autoId;
  const [internal, setInternal] = useState(defaultChecked);
  const isControlled = checked !== undefined;
  const on = isControlled ? checked : internal;

  const toggle = () => {
    if (!isControlled) setInternal(!on);
    onCheckedChange?.(!on);
  };

  return (
    <div className={cx('ds-switch', `ds-switch--${size}`, labelPosition === 'start' && 'ds-switch--label-start', disabled && 'ds-switch--disabled', className)}>
      <button
        id={switchId}
        type="button"
        role="switch"
        aria-checked={on}
        aria-describedby={description ? `${switchId}-desc` : undefined}
        disabled={disabled}
        className="ds-switch__track"
        onClick={toggle}
        {...rest}
      >
        <span className="ds-switch__thumb" />
      </button>
      <span className="ds-switch__text">
        <label htmlFor={switchId} className="ds-switch__label">{label}</label>
        {description && <span id={`${switchId}-desc`} className="ds-switch__description">{description}</span>}
      </span>
    </div>
  );
}
