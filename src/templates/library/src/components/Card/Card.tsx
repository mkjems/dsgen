import type { ComponentPropsWithRef, ReactNode } from 'react';
import { cx } from '../../utils/cx';
import './Card.css';

export interface CardProps extends Omit<ComponentPropsWithRef<'div'>, 'title'> {
  /** Heading shown at the top of the card. */
  title?: ReactNode;
  /** Text shown under the title. */
  description?: ReactNode;
  /** Elements placed at the end of the header, e.g. a menu button. */
  actions?: ReactNode;
  /** Content rendered in a separated footer area. */
  footer?: ReactNode;
  /** Visual style of the container. */
  variant?: 'outlined' | 'elevated' | 'filled';
  /** Inner spacing. */
  padding?: 'none' | 'sm' | 'md' | 'lg';
  /** Adds hover feedback for clickable cards. */
  interactive?: boolean;
}

export function Card({
  title,
  description,
  actions,
  footer,
  variant = 'outlined',
  padding = 'md',
  interactive = false,
  className,
  children,
  ...rest
}: CardProps) {
  const hasHeader = title || description || actions;
  return (
    <div
      className={cx('ds-card', `ds-card--${variant}`, `ds-card--pad-${padding}`, interactive && 'ds-card--interactive', className)}
      {...rest}
    >
      {hasHeader && (
        <div className="ds-card__header">
          <div className="ds-card__heading">
            {title && <h3 className="ds-card__title">{title}</h3>}
            {description && <p className="ds-card__description">{description}</p>}
          </div>
          {actions && <div className="ds-card__actions">{actions}</div>}
        </div>
      )}
      {children !== undefined && <div className="ds-card__body">{children}</div>}
      {footer && <div className="ds-card__footer">{footer}</div>}
    </div>
  );
}
