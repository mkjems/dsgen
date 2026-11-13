import type { CSSProperties, ElementType, ReactNode } from 'react';
import { resolve, responsiveStyles, space, type Responsive, type SpaceStep } from '../../utils/layout';
import './Stack.css';

export type { SpaceStep };

type Direction = 'row' | 'column' | 'row-reverse' | 'column-reverse';
type Align = 'start' | 'center' | 'end' | 'stretch' | 'baseline';

const ALIGN = { start: 'flex-start', center: 'center', end: 'flex-end', stretch: 'stretch', baseline: 'baseline' } as const;
const JUSTIFY = {
  start: 'flex-start',
  center: 'center',
  end: 'flex-end',
  between: 'space-between',
  around: 'space-around',
  evenly: 'space-evenly',
} as const;

export interface StackProps {
  /** Main axis. E.g. `{ sm: 'column', md: 'row' }` stacks on phones and lines up from tablets. */
  direction?: Responsive<Direction>;
  /** Gap between children, as a step on the spacing scale. */
  gap?: Responsive<SpaceStep>;
  /** Gap between wrapped lines. Overrides `gap`. */
  rowGap?: Responsive<SpaceStep>;
  /** Gap between items on the same line. Overrides `gap`. */
  columnGap?: Responsive<SpaceStep>;
  /** Cross-axis alignment. Rows default to `center`. */
  align?: Responsive<Align>;
  /** Main-axis distribution. */
  justify?: Responsive<keyof typeof JUSTIFY>;
  /** Allow children to wrap onto multiple lines. */
  wrap?: Responsive<boolean>;
  /** Element to render. */
  as?: ElementType;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

export function Stack({
  direction = 'column',
  gap = 4,
  rowGap,
  columnGap,
  align,
  justify,
  wrap,
  as: Component = 'div',
  className,
  style,
  children,
  ...rest
}: StackProps & Record<string, unknown>) {
  const css = responsiveStyles('ds-stack');
  const directions = resolve(direction);
  const gaps = resolve(gap, space);

  css.set('direction', directions);
  css.set('row-gap', resolve(rowGap, space).map((g, i) => g ?? gaps[i]));
  css.set('column-gap', resolve(columnGap, space).map((g, i) => g ?? gaps[i]));
  // Rows centre their children by default; columns keep the CSS default (stretch).
  css.set('align', resolve(align, (a) => ALIGN[a]).map((a, i) => a ?? (directions[i]?.startsWith('row') ? 'center' : undefined)));
  css.set('justify', resolve(justify, (j) => JUSTIFY[j]));
  css.set('wrap', resolve(wrap, (w) => (w ? 'wrap' : 'nowrap')));

  return (
    <Component className={css.className(className)} style={css.style(style)} {...rest}>
      {children}
    </Component>
  );
}

export interface StackItemProps {
  /** Take up free space. `true` is `1`; a number sets the share relative to other growing items. */
  grow?: Responsive<boolean | number>;
  /** Allow shrinking below `basis`. `false` keeps the item from shrinking. Defaults to `true` (CSS default). */
  shrink?: Responsive<boolean | number>;
  /** Starting size before growing or shrinking. Numbers are pixels; strings are CSS lengths such as `'30%'`. */
  basis?: Responsive<number | string>;
  /** Cross-axis alignment of this item. Overrides the Stack's `align`. */
  align?: Responsive<Align>;
  /** Visual order; lower comes first. Keep DOM order meaningful for keyboard and screen-reader users. */
  order?: Responsive<number>;
  /** Hide the item, e.g. `{ sm: true, md: false }` to hide it on phones only. */
  hide?: Responsive<boolean>;
  /** Element to render. */
  as?: ElementType;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

const factor = (v: boolean | number) => (typeof v === 'number' ? v : v ? 1 : 0);

export function StackItem({
  grow,
  shrink,
  basis,
  align,
  order,
  hide,
  as: Component = 'div',
  className,
  style,
  children,
  ...rest
}: StackItemProps & Record<string, unknown>) {
  const css = responsiveStyles('ds-stack-item');
  css.set('grow', resolve(grow, factor));
  css.set('shrink', resolve(shrink, factor));
  css.set('basis', resolve(basis, (b) => (typeof b === 'number' ? `${b}px` : b)));
  css.set('align', resolve(align, (a) => ALIGN[a]));
  css.set('order', resolve(order));
  css.hide(resolve(hide));

  return (
    <Component className={css.className(className)} style={css.style(style)} {...rest}>
      {children}
    </Component>
  );
}
