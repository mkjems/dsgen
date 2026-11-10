import { useId, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import { cx } from '../../utils/cx';
import './Tabs.css';

export interface TabItem {
  id: string;
  label: ReactNode;
  content: ReactNode;
  disabled?: boolean;
}

export interface TabsProps {
  /** Tabs and their panels. */
  items: TabItem[];
  /** Controlled active tab id. */
  value?: string;
  /** Initially active tab id when uncontrolled. Defaults to the first enabled tab. */
  defaultValue?: string;
  /** Called with the id of the newly selected tab. */
  onValueChange?: (id: string) => void;
  /** Visual style of the tab list. */
  variant?: 'line' | 'pill';
  /** Stretch tabs to fill the width. */
  fullWidth?: boolean;
  /** Accessible label for the tab list. */
  'aria-label'?: string;
  className?: string;
}

export function Tabs({
  items,
  value,
  defaultValue,
  onValueChange,
  variant = 'line',
  fullWidth = false,
  className,
  ...aria
}: TabsProps) {
  const baseId = useId();
  const firstEnabled = items.find((i) => !i.disabled)?.id;
  const [internal, setInternal] = useState(defaultValue ?? firstEnabled);
  const active = value !== undefined ? value : internal;
  const refs = useRef<Record<string, HTMLButtonElement | null>>({});

  const select = (id: string) => {
    if (value === undefined) setInternal(id);
    onValueChange?.(id);
  };

  const onKeyDown = (e: KeyboardEvent) => {
    const enabled = items.filter((i) => !i.disabled);
    const idx = enabled.findIndex((i) => i.id === active);
    let next: TabItem | undefined;
    if (e.key === 'ArrowRight') next = enabled[(idx + 1) % enabled.length];
    else if (e.key === 'ArrowLeft') next = enabled[(idx - 1 + enabled.length) % enabled.length];
    else if (e.key === 'Home') next = enabled[0];
    else if (e.key === 'End') next = enabled[enabled.length - 1];
    if (next) {
      e.preventDefault();
      select(next.id);
      refs.current[next.id]?.focus();
    }
  };

  return (
    <div className={cx('ds-tabs', `ds-tabs--${variant}`, fullWidth && 'ds-tabs--full', className)}>
      <div role="tablist" className="ds-tabs__list" aria-label={aria['aria-label']} onKeyDown={onKeyDown}>
        {items.map((item) => {
          const selected = item.id === active;
          return (
            <button
              key={item.id}
              ref={(el) => { refs.current[item.id] = el; }}
              type="button"
              role="tab"
              id={`${baseId}-tab-${item.id}`}
              aria-selected={selected}
              aria-controls={`${baseId}-panel-${item.id}`}
              tabIndex={selected ? 0 : -1}
              disabled={item.disabled}
              className="ds-tabs__tab"
              onClick={() => select(item.id)}
            >
              {item.label}
            </button>
          );
        })}
      </div>
      {items.map((item) => (
        <div
          key={item.id}
          role="tabpanel"
          id={`${baseId}-panel-${item.id}`}
          aria-labelledby={`${baseId}-tab-${item.id}`}
          hidden={item.id !== active}
          tabIndex={0}
          className="ds-tabs__panel"
        >
          {item.id === active && item.content}
        </div>
      ))}
    </div>
  );
}
