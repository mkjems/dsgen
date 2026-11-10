import type { CSSProperties, ElementType, ReactNode } from 'react';
import { cx } from '../../utils/cx';
import './Stack.css';

export type SpaceStep = 0 | 0.5 | 1 | 1.5 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12 | 16;

export interface StackProps {
  /** Main axis. */
  direction?: 'row' | 'column';
  /** Gap between children, as a step on the spacing scale. */
  gap?: SpaceStep;
  /** Cross-axis alignment. */
  align?: 'start' | 'center' | 'end' | 'stretch' | 'baseline';
  /** Main-axis distribution. */
  justify?: 'start' | 'center' | 'end' | 'between';
  /** Allow children to wrap onto multiple lines. */
  wrap?: boolean;
  /** Element to render. */
  as?: ElementType;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

const JUSTIFY = { start: 'flex-start', center: 'center', end: 'flex-end', between: 'space-between' } as const;
const ALIGN = { start: 'flex-start', center: 'center', end: 'flex-end', stretch: 'stretch', baseline: 'baseline' } as const;

export function Stack({
  direction = 'column',
  gap = 4,
  align,
  justify,
  wrap = false,
  as: Component = 'div',
  className,
  style,
  children,
  ...rest
}: StackProps & Record<string, unknown>) {
  return (
    <Component
      className={cx('ds-stack', className)}
      style={{
        flexDirection: direction,
        gap: `var(--ds-space-${String(gap).replace('.', '_')})`,
        alignItems: align ? ALIGN[align] : direction === 'row' ? 'center' : undefined,
        justifyContent: justify ? JUSTIFY[justify] : undefined,
        flexWrap: wrap ? 'wrap' : undefined,
        ...style,
      }}
      {...rest}
    >
      {children}
    </Component>
  );
}
