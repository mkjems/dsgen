import type { ComponentPropsWithRef, ReactNode } from 'react';
import { cx } from '../../utils/cx';
import './Button.css';

export type ButtonVariant = 'solid' | 'outline' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends ComponentPropsWithRef<'button'> {
  /** Visual emphasis of the button. */
  variant?: ButtonVariant;
  /** Height and padding of the button. */
  size?: ButtonSize;
  /** Shows a spinner, disables interaction and sets `aria-busy`. */
  loading?: boolean;
  /** Stretch to the width of the container. */
  fullWidth?: boolean;
  /** Icon rendered before the label. */
  startIcon?: ReactNode;
  /** Icon rendered after the label. */
  endIcon?: ReactNode;
}

export function Button({
  variant = 'solid',
  size = 'md',
  loading = false,
  fullWidth = false,
  startIcon,
  endIcon,
  disabled,
  type = 'button',
  className,
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cx(
        'ds-button',
        `ds-button--${variant}`,
        `ds-button--${size}`,
        fullWidth && 'ds-button--full',
        loading && 'ds-button--loading',
        className,
      )}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...rest}
    >
      {loading && <span className="ds-button__spinner" aria-hidden="true" />}
      {startIcon && <span className="ds-button__icon" aria-hidden="true">{startIcon}</span>}
      <span className="ds-button__label">{children}</span>
      {endIcon && <span className="ds-button__icon" aria-hidden="true">{endIcon}</span>}
    </button>
  );
}
