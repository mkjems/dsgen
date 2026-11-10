import type { CSSProperties, ElementType, ReactNode } from 'react';
import { cx } from '../../utils/cx';
import './Text.css';

export type TextVariant = 'display' | 'h1' | 'h2' | 'h3' | 'h4' | 'lead' | 'body' | 'small' | 'caption' | 'code';

export interface TextProps {
  /** Typographic style from the type scale. */
  variant?: TextVariant;
  /** Element to render. Defaults to the semantic element for the variant. */
  as?: ElementType;
  /** Text colour. */
  tone?: 'default' | 'muted' | 'primary' | 'success' | 'warning' | 'danger';
  /** Font weight override. */
  weight?: 'regular' | 'medium' | 'bold';
  /** Text alignment. */
  align?: 'start' | 'center' | 'end';
  /** Truncate overflowing text with an ellipsis on one line. */
  truncate?: boolean;
  className?: string;
  style?: CSSProperties;
  id?: string;
  children?: ReactNode;
}

const ELEMENT: Record<TextVariant, ElementType> = {
  display: 'h1', h1: 'h1', h2: 'h2', h3: 'h3', h4: 'h4',
  lead: 'p', body: 'p', small: 'p', caption: 'span', code: 'code',
};

export function Text({
  variant = 'body',
  as,
  tone = 'default',
  weight,
  align,
  truncate = false,
  className,
  style,
  children,
  ...rest
}: TextProps & Record<string, unknown>) {
  const Component = as ?? ELEMENT[variant];
  return (
    <Component
      className={cx(
        'ds-text',
        `ds-text--${variant}`,
        tone !== 'default' && `ds-text--tone-${tone}`,
        weight && `ds-text--weight-${weight}`,
        truncate && 'ds-text--truncate',
        className,
      )}
      style={align ? { textAlign: align, ...style } : style}
      {...rest}
    >
      {children}
    </Component>
  );
}
