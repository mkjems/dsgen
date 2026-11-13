import type { CSSProperties, ElementType, ReactNode } from 'react';
import { resolve, responsiveStyles, space, type Responsive, type SpaceStep } from '../../utils/layout';
import './Grid.css';

const track = (value: number | string, unit: string) =>
  typeof value === 'number' ? `repeat(${value}, ${unit})` : value;

type Align = 'start' | 'center' | 'end' | 'stretch' | 'baseline';

export interface GridProps {
  /**
   * Column template. A number creates that many equal columns; a string is
   * used as `grid-template-columns`, e.g. `'240px 1fr'` or `'1fr 2fr 1fr'`.
   */
  columns?: Responsive<number | string>;
  /** Row template. A number creates that many auto-height rows; a string is used as-is. */
  rows?: Responsive<number | string>;
  /**
   * Fluid columns: fit as many columns as possible, each at least this wide
   * (a number is pixels). Needs no breakpoints and overrides `columns`.
   */
  minItemWidth?: Responsive<number | string>;
  /**
   * Named areas, one string per row, e.g. `['header header', 'nav main']`.
   * Place children with `<GridItem area="main">`. Use `.` for an empty cell.
   */
  areas?: Responsive<string[]>;
  /** Gap between rows and columns, as a step on the spacing scale. */
  gap?: Responsive<SpaceStep>;
  /** Gap between rows only. Overrides `gap`. */
  rowGap?: Responsive<SpaceStep>;
  /** Gap between columns only. Overrides `gap`. */
  columnGap?: Responsive<SpaceStep>;
  /** How auto-placed items fill the grid. `dense` back-fills holes. */
  flow?: Responsive<'row' | 'column' | 'row dense' | 'column dense'>;
  /** Size of implicitly created rows, e.g. `'minmax(120px, auto)'`. */
  autoRows?: Responsive<string>;
  /** Vertical alignment of every item within its cell. */
  align?: Responsive<Align>;
  /** Horizontal alignment of every item within its cell. */
  justify?: Responsive<Exclude<Align, 'baseline'>>;
  /** Element to render. */
  as?: ElementType;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

export function Grid({
  columns,
  rows,
  minItemWidth,
  areas,
  gap = 4,
  rowGap,
  columnGap,
  flow,
  autoRows,
  align,
  justify,
  as: Component = 'div',
  className,
  style,
  children,
  ...rest
}: GridProps & Record<string, unknown>) {
  const css = responsiveStyles('ds-grid');

  const fluid = resolve(minItemWidth, (w) => `repeat(auto-fill, minmax(min(${typeof w === 'number' ? `${w}px` : w}, 100%), 1fr))`);
  css.set('columns', resolve(columns, (c) => track(c, 'minmax(0, 1fr)')).map((c, i) => fluid[i] ?? c));
  css.set('rows', resolve(rows, (r) => track(r, 'auto')));
  css.set('areas', resolve(areas, (a) => a.map((row) => `"${row}"`).join(' ')));
  const gaps = resolve(gap, space);
  css.set('row-gap', resolve(rowGap, space).map((g, i) => g ?? gaps[i]));
  css.set('column-gap', resolve(columnGap, space).map((g, i) => g ?? gaps[i]));
  css.set('flow', resolve(flow));
  css.set('auto-rows', resolve(autoRows));
  css.set('align', resolve(align));
  css.set('justify', resolve(justify));

  return (
    <Component className={css.className(className)} style={css.style(style)} {...rest}>
      {children}
    </Component>
  );
}

export interface GridItemProps {
  /** Number of columns to span, or `'full'` to stretch across the whole row. */
  span?: Responsive<number | 'full'>;
  /** Column line to start at (1-based; negative counts from the end). */
  start?: Responsive<number>;
  /** Number of rows to span. */
  rowSpan?: Responsive<number>;
  /** Row line to start at (1-based). */
  rowStart?: Responsive<number>;
  /** Named area from the parent Grid's `areas`. */
  area?: Responsive<string>;
  /** Vertical alignment within the cell. Overrides the Grid's `align`. */
  align?: Responsive<Align>;
  /** Horizontal alignment within the cell. Overrides the Grid's `justify`. */
  justify?: Responsive<Exclude<Align, 'baseline'>>;
  /** Visual order; lower comes first. Keep DOM order meaningful for keyboard and screen-reader users. */
  order?: Responsive<number>;
  /** Hide the item, e.g. `{ sm: true, lg: false }` to show it only on large screens. */
  hide?: Responsive<boolean>;
  /** Element to render. */
  as?: ElementType;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

/** `grid-column` / `grid-row` value from a start line and a span. */
function placement(start: number | undefined, span: number | 'full' | undefined): string | undefined {
  if (span === 'full') return '1 / -1';
  if (start !== undefined) return `${start} / span ${span ?? 1}`;
  if (span !== undefined) return `span ${span}`;
  return undefined;
}

export function GridItem({
  span,
  start,
  rowSpan,
  rowStart,
  area,
  align,
  justify,
  order,
  hide,
  as: Component = 'div',
  className,
  style,
  children,
  ...rest
}: GridItemProps & Record<string, unknown>) {
  const css = responsiveStyles('ds-grid-item');
  const spans = resolve(span);
  const starts = resolve(start);
  const rowSpans = resolve(rowSpan);
  const rowStarts = resolve(rowStart);
  const areas = resolve(area);

  // A named area works as a column/row value too (`grid-column: main`), so
  // explicit placement and areas can be mixed per breakpoint.
  css.set('column', spans.map((_, i) => placement(starts[i], spans[i]) ?? areas[i]));
  css.set('row', rowSpans.map((_, i) => placement(rowStarts[i], rowSpans[i]) ?? areas[i]));
  css.set('align', resolve(align));
  css.set('justify', resolve(justify));
  css.set('order', resolve(order));
  css.hide(resolve(hide));

  return (
    <Component className={css.className(className)} style={css.style(style)} {...rest}>
      {children}
    </Component>
  );
}
