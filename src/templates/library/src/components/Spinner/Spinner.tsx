import type { ComponentPropsWithRef } from 'react';
import { cx } from '../../utils/cx';
import './Spinner.css';

export interface SpinnerProps extends ComponentPropsWithRef<'span'> {
  /** Diameter of the spinner. */
  size?: 'sm' | 'md' | 'lg';
  /** Text announced to screen readers. */
  label?: string;
  /** Colour: the current text colour or the primary colour. */
  tone?: 'current' | 'primary';
}

export function Spinner({ size = 'md', label = 'Loading', tone = 'primary', className, ...rest }: SpinnerProps) {
  return (
    <span role="status" className={cx('ds-spinner', `ds-spinner--${size}`, `ds-spinner--${tone}`, className)} {...rest}>
      <svg className="ds-spinner__svg" viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="9.5" fill="none" stroke="currentColor" strokeWidth="3" opacity="0.2" />
        <path d="M21.5 12a9.5 9.5 0 00-9.5-9.5" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      </svg>
      <span className="ds-visually-hidden">{label}</span>
    </span>
  );
}
