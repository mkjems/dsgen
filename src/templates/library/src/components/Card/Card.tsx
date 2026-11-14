import type { ComponentPropsWithRef, ElementType } from 'react';
import { cx } from '../../utils/cx';
import './Card.css';

/*
 * Card is composed from parts rather than configured with props:
 *
 *   <Card>
 *     <CardHeader>
 *       <CardTitle>…</CardTitle>
 *       <CardDescription>…</CardDescription>
 *       <CardActions>…</CardActions>
 *     </CardHeader>
 *     …body…
 *     <CardFooter>…</CardFooter>
 *   </Card>
 *
 * Every part styles and places itself (no `.card > .part` selectors), so the layout keeps working
 * when tools or wrappers sit between the parts, and each part can be used or left out on its own.
 */

export interface CardProps extends ComponentPropsWithRef<'div'> {
  /** Visual style of the container. */
  variant?: 'outlined' | 'elevated' | 'filled';
  /** Inner spacing. */
  padding?: 'none' | 'sm' | 'md' | 'lg';
  /** Adds hover feedback for clickable cards. */
  interactive?: boolean;
}

export function Card({ variant = 'outlined', padding = 'md', interactive = false, className, ...rest }: CardProps) {
  return (
    <div
      className={cx('ds-card', `ds-card--${variant}`, `ds-card--pad-${padding}`, interactive && 'ds-card--interactive', className)}
      {...rest}
    />
  );
}

export type CardHeaderProps = ComponentPropsWithRef<'div'>;

/** Groups the title, description and actions at the top of a card. */
export function CardHeader({ className, ...rest }: CardHeaderProps) {
  return <div className={cx('ds-card__header', className)} {...rest} />;
}

export interface CardTitleProps extends ComponentPropsWithRef<'h3'> {
  /** Heading element; pick the level that fits the page outline. */
  as?: ElementType;
}

export function CardTitle({ as: Component = 'h3', className, ...rest }: CardTitleProps) {
  return <Component className={cx('ds-card__title', className)} {...rest} />;
}

export type CardDescriptionProps = ComponentPropsWithRef<'p'>;

export function CardDescription({ className, ...rest }: CardDescriptionProps) {
  return <p className={cx('ds-card__description', className)} {...rest} />;
}

export type CardActionsProps = ComponentPropsWithRef<'div'>;

/** Elements aligned to the end of the header, such as a button or menu. */
export function CardActions({ className, ...rest }: CardActionsProps) {
  return <div className={cx('ds-card__actions', className)} {...rest} />;
}

export type CardFooterProps = ComponentPropsWithRef<'div'>;

/** Footer separated by a divider; typically the card's buttons. */
export function CardFooter({ className, ...rest }: CardFooterProps) {
  return <div className={cx('ds-card__footer', className)} {...rest} />;
}
