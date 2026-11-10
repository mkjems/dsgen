import type { ComponentPropsWithRef, ReactNode } from 'react';
import { cx } from '../../utils/cx';
import './Alert.css';

export type AlertTone = 'info' | 'success' | 'warning' | 'danger';

export interface AlertProps extends Omit<ComponentPropsWithRef<'div'>, 'title'> {
  /** Meaning of the message; sets colour, icon and ARIA role. */
  tone?: AlertTone;
  /** Short summary in bold. */
  title?: ReactNode;
  /** Shows a close button and calls this when clicked. */
  onClose?: () => void;
  /** Action element (e.g. a Button) shown below the message. */
  action?: ReactNode;
  /** Hide the leading icon. */
  hideIcon?: boolean;
}

const ICONS: Record<AlertTone, ReactNode> = {
  info: <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm0-11.5V6m0 8V9" />,
  success: <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM6.5 10.5l2.3 2.2 4.7-5" />,
  warning: <path d="M10 3l8 14H2L10 3zm0 5.5v3.5m0 2.5v.01" />,
  danger: <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm0-12v5m0 3v.01" />,
};

export function Alert({ tone = 'info', title, onClose, action, hideIcon = false, className, children, ...rest }: AlertProps) {
  return (
    <div
      role={tone === 'danger' || tone === 'warning' ? 'alert' : 'status'}
      className={cx('ds-alert', `ds-alert--${tone}`, className)}
      {...rest}
    >
      {!hideIcon && (
        <svg className="ds-alert__icon" viewBox="0 0 20 20" aria-hidden="true">
          <g fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">{ICONS[tone]}</g>
        </svg>
      )}
      <div className="ds-alert__content">
        {title && <p className="ds-alert__title">{title}</p>}
        {children && <div className="ds-alert__message">{children}</div>}
        {action && <div className="ds-alert__action">{action}</div>}
      </div>
      {onClose && (
        <button type="button" className="ds-alert__close" onClick={onClose} aria-label="Dismiss">
          <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
        </button>
      )}
    </div>
  );
}
