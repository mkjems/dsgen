import { cloneElement, isValidElement, useId, useRef, useState, type ReactElement, type ReactNode } from 'react';
import { cx } from '../../utils/cx';
import './Tooltip.css';

export interface TooltipProps {
  /** Text shown in the tooltip. Keep it short and non-interactive. */
  content: ReactNode;
  /** A single focusable element that triggers the tooltip. */
  children: ReactElement<{ 'aria-describedby'?: string }>;
  /** Side of the trigger where the tooltip appears. */
  placement?: 'top' | 'bottom' | 'left' | 'right';
  /** Delay in ms before showing on hover. */
  delay?: number;
}

export function Tooltip({ content, children, placement = 'top', delay = 300 }: TooltipProps) {
  const id = useId();
  const [visible, setVisible] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const show = (immediate = false) => {
    clearTimeout(timer.current);
    if (immediate) setVisible(true);
    else timer.current = setTimeout(() => setVisible(true), delay);
  };
  const hide = () => {
    clearTimeout(timer.current);
    setVisible(false);
  };

  const trigger = isValidElement(children)
    ? cloneElement(children, { 'aria-describedby': visible ? id : undefined })
    : children;

  return (
    <span
      className="ds-tooltip"
      onMouseEnter={() => show()}
      onMouseLeave={hide}
      onFocus={() => show(true)}
      onBlur={hide}
      onKeyDown={(e) => { if (e.key === 'Escape') hide(); }}
    >
      {trigger}
      <span
        id={id}
        role="tooltip"
        className={cx('ds-tooltip__bubble', `ds-tooltip__bubble--${placement}`, visible && 'ds-tooltip__bubble--visible')}
      >
        {content}
      </span>
    </span>
  );
}
