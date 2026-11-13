/**
 * Shared machinery for the responsive layout components (Stack, Grid).
 *
 * A component resolves each prop to one CSS value per breakpoint and hands it
 * to `responsiveStyles`, which emits a modifier class plus one custom property
 * per breakpoint. The component's stylesheet reads those properties inside
 * media queries. Because the property is set through a class, not inline,
 * `className` overrides keep working.
 */
import type { CSSProperties } from 'react';
import { cx } from './cx';

/**
 * Screen sizes, mobile first: `sm` applies from 0px, `md` from 768px, `lg`
 * from 1024px. A breakpoint you leave out inherits the next smaller one.
 * Media queries can't read custom properties, so the stylesheets repeat these
 * values (48em and 64em) — keep them in sync.
 */
export const breakpoints = { sm: 0, md: 768, lg: 1024 } as const;
export type Breakpoint = keyof typeof breakpoints;

/** One value for every screen size, or one per breakpoint, e.g. `{ sm: 1, md: 3 }`. */
export type Responsive<T> = T | Partial<Record<Breakpoint, T>>;

const BPS: Breakpoint[] = ['sm', 'md', 'lg'];

/** Steps on the spacing scale, mapped to the `--ds-space-*` tokens. */
export type SpaceStep = 0 | 0.5 | 1 | 1.5 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12 | 16;

export const space = (step: SpaceStep) => `var(--ds-space-${String(step).replace('.', '_')})`;

/** A value resolved for `[sm, md, lg]`; `undefined` means "not set". */
export type PerBreakpoint<T> = (T | undefined)[];

function isPerBreakpoint<T>(value: Responsive<T>): value is Partial<Record<Breakpoint, T>> {
  return typeof value === 'object' && value !== null && !Array.isArray(value) && BPS.some((bp) => bp in value);
}

/** Expand a responsive value to `[sm, md, lg]`, filling gaps mobile first, then map each value. */
export function resolve<T, R = T>(value: Responsive<T> | undefined, map?: (v: T) => R): PerBreakpoint<R> {
  let values: PerBreakpoint<T>;
  if (value === undefined) values = [undefined, undefined, undefined];
  else if (!isPerBreakpoint(value)) values = [value, value, value];
  else {
    let last: T | undefined;
    values = BPS.map((bp) => (last = value[bp] ?? last));
  }
  return values.map((v) => (v === undefined ? undefined : map ? map(v) : (v as unknown as R)));
}

/** Collects modifier classes and custom properties for one element. */
export function responsiveStyles(block: string) {
  const classes: string[] = [block];
  const vars: Record<string, string | number> = {};
  return {
    /** Set a property for each breakpoint. Does nothing if no breakpoint has a value. */
    set(key: string, values: PerBreakpoint<string | number>) {
      if (values.every((v) => v === undefined)) return;
      classes.push(`${block}--${key}`);
      // Always set all three so a nested element never inherits its parent's
      // values. `initial` makes the CSS property fall back to its default.
      values.forEach((v, i) => {
        vars[`--${block}-${key}-${BPS[i]}`] = v ?? 'initial';
      });
    },
    /** Add `--hide-<bp>` classes for the breakpoints where the value is true. */
    hide(values: PerBreakpoint<boolean>) {
      values.forEach((h, i) => h && classes.push(`${block}--hide-${BPS[i]}`));
    },
    className: (extra?: string) => cx(...classes, extra),
    style: (extra?: CSSProperties) => ({ ...vars, ...extra }) as CSSProperties,
  };
}
