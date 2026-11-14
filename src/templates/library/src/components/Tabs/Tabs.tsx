import {
  createContext,
  use,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ComponentPropsWithoutRef,
  type ComponentPropsWithRef,
  type KeyboardEvent,
} from 'react';
import { cx } from '../../utils/cx';
import './Tabs.css';

/*
 * Tabs is composed from parts that share state through context:
 *
 *   <Tabs defaultValue="a">
 *     <TabList aria-label="…">
 *       <Tab value="a">First</Tab>
 *       <Tab value="b">Second</Tab>
 *     </TabList>
 *     <TabPanel value="a">…</TabPanel>
 *     <TabPanel value="b">…</TabPanel>
 *   </Tabs>
 *
 * No part inspects its children, so the parts keep working when other elements sit between them
 * (wrappers, editors, conditional rendering). Keyboard navigation reads the rendered tabs from the DOM.
 */

interface TabsContextValue {
  baseId: string;
  active: string | undefined;
  controlled: boolean;
  select: (value: string) => void;
  /** Picks the initial tab when uncontrolled and nothing (valid) is selected. */
  initialize: (value: string) => void;
}

const TabsContext = createContext<TabsContextValue | null>(null);

function useTabs(part: string): TabsContextValue {
  const ctx = use(TabsContext);
  if (!ctx) throw new Error(`<${part}> must be used inside <Tabs>.`);
  return ctx;
}

const domId = (base: string, kind: 'tab' | 'panel', value: string) => `${base}-${kind}-${value.replace(/[^\w-]/g, '_')}`;

export interface TabsProps extends Omit<ComponentPropsWithRef<'div'>, 'defaultValue' | 'onChange'> {
  /** Controlled active tab value. */
  value?: string;
  /** Initially active tab when uncontrolled. Defaults to the first enabled tab. */
  defaultValue?: string;
  /** Called with the value of the newly selected tab. */
  onValueChange?: (value: string) => void;
  /** Visual style of the tab list. */
  variant?: 'line' | 'pill';
  /** Stretch tabs to fill the width. */
  fullWidth?: boolean;
}

export function Tabs({
  value,
  defaultValue,
  onValueChange,
  variant = 'line',
  fullWidth = false,
  className,
  ...rest
}: TabsProps) {
  const baseId = useId();
  const [internal, setInternal] = useState(defaultValue);
  const controlled = value !== undefined;
  const active = controlled ? value : internal;

  const ctx = useMemo<TabsContextValue>(
    () => ({
      baseId,
      active,
      controlled,
      select: (next) => {
        if (!controlled) setInternal(next);
        onValueChange?.(next);
      },
      initialize: (next) => {
        if (!controlled) setInternal(next);
      },
    }),
    [baseId, active, controlled, onValueChange],
  );

  return (
    <TabsContext value={ctx}>
      <div className={cx('ds-tabs', `ds-tabs--${variant}`, fullWidth && 'ds-tabs--full', className)} {...rest} />
    </TabsContext>
  );
}

export type TabListProps = ComponentPropsWithoutRef<'div'>;

/** The row of tabs. Give it an `aria-label` when there is no visible heading. */
export function TabList({ className, onKeyDown, ...rest }: TabListProps) {
  const ctx = useTabs('TabList');
  const ref = useRef<HTMLDivElement>(null);

  const tabs = () => {
    const list = ref.current;
    if (!list) return [];
    return [...list.querySelectorAll<HTMLButtonElement>('[role="tab"]')].filter((t) => !t.disabled && t.closest('[role="tablist"]') === list);
  };

  // Uncontrolled and nothing (still) selected, e.g. no defaultValue or the active tab was removed:
  // fall back to the first enabled tab.
  useLayoutEffect(() => {
    if (ctx.controlled) return;
    const all = tabs();
    if (all.some((t) => t.dataset.value === ctx.active)) return;
    const first = all[0]?.dataset.value;
    if (first !== undefined) ctx.initialize(first);
  });

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(e);
    if (e.defaultPrevented) return;
    const all = tabs();
    const idx = all.findIndex((t) => t === document.activeElement || t.dataset.value === ctx.active);
    let next: HTMLButtonElement | undefined;
    if (e.key === 'ArrowRight') next = all[(idx + 1) % all.length];
    else if (e.key === 'ArrowLeft') next = all[(idx - 1 + all.length) % all.length];
    else if (e.key === 'Home') next = all[0];
    else if (e.key === 'End') next = all[all.length - 1];
    if (next?.dataset.value !== undefined) {
      e.preventDefault();
      next.focus();
      ctx.select(next.dataset.value);
    }
  };

  return <div ref={ref} role="tablist" className={cx('ds-tabs__list', className)} onKeyDown={handleKeyDown} {...rest} />;
}

export interface TabProps extends Omit<ComponentPropsWithRef<'button'>, 'value'> {
  /** Identifies the tab; the TabPanel with the same value is shown when it is active. */
  value: string;
}

export function Tab({ value, className, onClick, ...rest }: TabProps) {
  const ctx = useTabs('Tab');
  const selected = ctx.active === value;
  return (
    <button
      type="button"
      role="tab"
      id={domId(ctx.baseId, 'tab', value)}
      aria-selected={selected}
      aria-controls={domId(ctx.baseId, 'panel', value)}
      tabIndex={selected ? 0 : -1}
      data-value={value}
      className={cx('ds-tabs__tab', className)}
      onClick={(e) => {
        onClick?.(e);
        if (!e.defaultPrevented) ctx.select(value);
      }}
      {...rest}
    />
  );
}

export interface TabPanelProps extends ComponentPropsWithRef<'div'> {
  /** The value of the Tab that shows this panel. */
  value: string;
}

/** Content for one tab. Inactive panels render nothing, so expensive content loads on demand. */
export function TabPanel({ value, className, children, ...rest }: TabPanelProps) {
  const ctx = useTabs('TabPanel');
  const selected = ctx.active === value;
  return (
    <div
      role="tabpanel"
      id={domId(ctx.baseId, 'panel', value)}
      aria-labelledby={domId(ctx.baseId, 'tab', value)}
      hidden={!selected}
      tabIndex={0}
      className={cx('ds-tabs__panel', className)}
      {...rest}
    >
      {selected && children}
    </div>
  );
}
