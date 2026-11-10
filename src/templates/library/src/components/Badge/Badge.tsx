import type { ComponentPropsWithRef } from 'react';
import { cx } from '../../utils/cx';
import './Badge.css';

export type BadgeTone = 'neutral' | 'primary' | 'success' | 'warning' | 'danger' | 'info';

export interface BadgeProps extends ComponentPropsWithRef<'span'> {
  /** Colour/meaning of the badge. */
  tone?: BadgeTone;
  /** Fill style. */
  variant?: 'subtle' | 'solid' | 'outline';
  /** Badge size. */
  size?: 'sm' | 'md';
  /** Show a leading status dot. */
  dot?: boolean;
}

export function Badge({ tone = 'neutral', variant = 'subtle', size = 'md', dot = false, className, children, ...rest }: BadgeProps) {
  return (
    <span className={cx('ds-badge', `ds-badge--${tone}`, `ds-badge--${variant}`, `ds-badge--${size}`, className)} {...rest}>
      {dot && <span className="ds-badge__dot" aria-hidden="true" />}
      {children}
    </span>
  );
}
