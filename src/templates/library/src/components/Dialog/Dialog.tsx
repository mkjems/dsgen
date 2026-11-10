import { useEffect, useId, useRef, type ReactNode } from 'react';
import { cx } from '../../utils/cx';
import './Dialog.css';

export interface DialogProps {
  /** Whether the dialog is shown. */
  open: boolean;
  /** Called when the user requests to close (Escape, close button or backdrop click). */
  onClose: () => void;
  /** Dialog heading; also its accessible name. */
  title: ReactNode;
  /** Supporting text under the title. */
  description?: ReactNode;
  /** Body content. */
  children?: ReactNode;
  /** Action buttons, right-aligned at the bottom. */
  footer?: ReactNode;
  /** Maximum width. */
  size?: 'sm' | 'md' | 'lg';
  /** Close when clicking outside the dialog. */
  closeOnBackdropClick?: boolean;
  /** Hide the × button in the corner. */
  hideCloseButton?: boolean;
  className?: string;
}

export function Dialog({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  size = 'md',
  closeOnBackdropClick = true,
  hideCloseButton = false,
  className,
}: DialogProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const id = useId();

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      className={cx('ds-dialog', `ds-dialog--${size}`, className)}
      aria-labelledby={`${id}-title`}
      aria-describedby={description ? `${id}-desc` : undefined}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClick={(e) => {
        if (closeOnBackdropClick && e.target === e.currentTarget) onClose();
      }}
    >
      <div className="ds-dialog__surface">
        <div className="ds-dialog__header">
          <h2 id={`${id}-title`} className="ds-dialog__title">{title}</h2>
          {!hideCloseButton && (
            <button type="button" className="ds-dialog__close" aria-label="Close" onClick={onClose}>
              <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
            </button>
          )}
        </div>
        {description && <p id={`${id}-desc`} className="ds-dialog__description">{description}</p>}
        {children && <div className="ds-dialog__body">{children}</div>}
        {footer && <div className="ds-dialog__footer">{footer}</div>}
      </div>
    </dialog>
  );
}
