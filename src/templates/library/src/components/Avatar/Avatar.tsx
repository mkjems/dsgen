import { useState, type ComponentPropsWithRef } from 'react';
import { cx } from '../../utils/cx';
import './Avatar.css';

export interface AvatarProps extends Omit<ComponentPropsWithRef<'span'>, 'children'> {
  /** Person or entity name. Used for the alt text and fallback initials. */
  name: string;
  /** Image URL. Falls back to initials if missing or broken. */
  src?: string;
  /** Avatar diameter. */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  /** Circle for people, square for organisations. */
  shape?: 'circle' | 'square';
  /** Presence indicator. */
  status?: 'online' | 'away' | 'busy' | 'offline';
}

function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  const first = parts[0][0];
  const last = parts.length > 1 ? parts[parts.length - 1][0] : '';
  return (first + last).toUpperCase();
}

/** Deterministic hue so the same name always gets the same colour. */
function hue(name: string) {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) % 360;
  return h;
}

export function Avatar({ name, src, size = 'md', shape = 'circle', status, className, style, ...rest }: AvatarProps) {
  const [failed, setFailed] = useState(false);
  const showImage = src && !failed;
  return (
    <span
      className={cx('ds-avatar', `ds-avatar--${size}`, `ds-avatar--${shape}`, className)}
      style={{ ['--ds-avatar-hue' as string]: hue(name), ...style }}
      role="img"
      aria-label={status ? `${name} (${status})` : name}
      {...rest}
    >
      {showImage ? (
        <img className="ds-avatar__image" src={src} alt="" onError={() => setFailed(true)} />
      ) : (
        <span className="ds-avatar__initials" aria-hidden="true">{initials(name)}</span>
      )}
      {status && <span className={cx('ds-avatar__status', `ds-avatar__status--${status}`)} aria-hidden="true" />}
    </span>
  );
}
