import type { CSSProperties, ElementType, ReactNode } from 'react';
import { cx } from '../../utils/cx';
import type { SpaceStep } from '../Stack/Stack';
import './Grid.css';

/**
 * Screen sizes, mobile first. `sm` applies from 0px, `md` from 768px and `lg`
 * from 1024px. A breakpoint you leave out inherits the next smaller one.
 * Keep these in sync with the media queries in Grid.css.
 */
export const breakpoints = { sm: 0, md: 768, lg: 1024 } as const;
export type Breakpoint = keyof typeof breakpoints;

/** A single value for every screen size, or one per breakpoint. */
export type Responsive<T> = T | Partial<Record<Breakpoint, T>>;

const BPS: Breakpoint[] = ['sm', 'md', 'lg'];

function isPerBreakpoint<T>(value: Responsive<T>): value is Partial<Record<Breakpoint, T>> {
  return typeof value === 'object' && value !== null && !Array.isArray(value) && BPS.some((bp) => bp in value);
}

/** Expand a responsive value to one value per breakpoint, filling gaps mobile first. */
function resolve<T>(value: Responsive<T> | undefined): (T | undefined)[] {
  if (value === undefined) return [undefined, undefined, undefined];
  if (!isPerBreakpoint(value)) return [value, value, value];
  let last: T | undefined;
  return BPS.map((bp) => (last = value[bp] ?? last));
}

/**
 * Turn a set of CSS values (one per breakpoint) into a modifier class plus
 * custom properties. The modifier class makes the stylesheet apply the
 * property only when it was set, so className/style overrides keep working.
 */
function apply(
  block: string,
  key: string,
  values: (string | number | undefined)[],
  classes: string[],
  vars: Record<string, string | number>,
) {
  if (values.every((v) => v === undefined)) return;
  classes.push(`${block}--${key}`);
  // Always set all three so a nested grid never inherits its parent's values.
  // `initial` makes the property fall back to its CSS default.
  values.forEach((v, i) => {
    vars[`--${block}-${key}-${BPS[i]}`] = v ?? 'initial';
  });
}

const space = (step: SpaceStep) => `var(--ds-space-${String(step).replace('.', '_')})`;

const track = (value: number | string, unit: string) =>
  typeof value === 'number' ? `repeat(${value}, ${unit})` : value;

const ALIGN = { start: 'start', center: 'center', end: 'end', stretch: 'stretch', baseline: 'baseline' } as const;
type Align = keyof typeof ALIGN;

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
  const block = 'ds-grid';
  const classes: string[] = [];
  const vars: Record<string, string | number> = {};

  const fluid = resolve(minItemWidth).map((w) =>
    w === undefined ? undefined : `repeat(auto-fill, minmax(min(${typeof w === 'number' ? `${w}px` : w}, 100%), 1fr))`,
  );
  const cols = resolve(columns).map((c, i) => fluid[i] ?? (c === undefined ? undefined : track(c, 'minmax(0, 1fr)')));

  apply(block, 'columns', cols, classes, vars);
  apply(block, 'rows', resolve(rows).map((r) => (r === undefined ? undefined : track(r, 'auto'))), classes, vars);
  apply(block, 'areas', resolve(areas).map((a) => a?.map((row) => `"${row}"`).join(' ')), classes, vars);
  const gaps = resolve(gap);
  const rowGaps = resolve(rowGap).map((g, i) => g ?? gaps[i]);
  const columnGaps = resolve(columnGap).map((g, i) => g ?? gaps[i]);
  apply(block, 'row-gap', rowGaps.map((g) => (g === undefined ? undefined : space(g))), classes, vars);
  apply(block, 'column-gap', columnGaps.map((g) => (g === undefined ? undefined : space(g))), classes, vars);
  apply(block, 'flow', resolve(flow), classes, vars);
  apply(block, 'auto-rows', resolve(autoRows), classes, vars);
  apply(block, 'align', resolve(align).map((a) => a && ALIGN[a]), classes, vars);
  apply(block, 'justify', resolve(justify).map((j) => j && ALIGN[j]), classes, vars);

  return (
    <Component className={cx(block, ...classes, className)} style={{ ...vars, ...style }} {...rest}>
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
  const block = 'ds-grid-item';
  const classes: string[] = [];
  const vars: Record<string, string | number> = {};

  const spans = resolve(span);
  const starts = resolve(start);
  const rowSpans = resolve(rowSpan);
  const rowStarts = resolve(rowStart);
  const areas = resolve(area);

  // A named area works as a column/row value too (`grid-column: main`), so
  // explicit placement and areas can be mixed per breakpoint.
  apply(block, 'column', BPS.map((_, i) => placement(starts[i], spans[i]) ?? areas[i]), classes, vars);
  apply(block, 'row', BPS.map((_, i) => placement(rowStarts[i], rowSpans[i]) ?? areas[i]), classes, vars);
  apply(block, 'align', resolve(align).map((a) => a && ALIGN[a]), classes, vars);
  apply(block, 'justify', resolve(justify).map((j) => j && ALIGN[j]), classes, vars);
  apply(block, 'order', resolve(order), classes, vars);
  resolve(hide).forEach((h, i) => h && classes.push(`${block}--hide-${BPS[i]}`));

  return (
    <Component className={cx(block, ...classes, className)} style={{ ...vars, ...style }} {...rest}>
      {children}
    </Component>
  );
}
