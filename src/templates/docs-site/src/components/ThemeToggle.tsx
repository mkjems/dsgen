import { useEffect, useState } from 'react';

type Mode = 'system' | 'light' | 'dark';
const KEY = 'docs-theme';

function read(): Mode {
  try {
    const v = localStorage.getItem(KEY);
    return v === 'light' || v === 'dark' ? v : 'system';
  } catch {
    return 'system';
  }
}

export function ThemeToggle() {
  const [mode, setMode] = useState<Mode>(read);
  useEffect(() => {
    const root = document.documentElement;
    if (mode === 'system') delete root.dataset.theme;
    else root.dataset.theme = mode;
    try {
      localStorage.setItem(KEY, mode);
    } catch {
      /* storage unavailable */
    }
  }, [mode]);
  const next: Record<Mode, Mode> = { system: 'light', light: 'dark', dark: 'system' };
  const icon = { system: '◐', light: '☀', dark: '☾' }[mode];
  return (
    <button type="button" className="docs-icon-button" onClick={() => setMode(next[mode])} aria-label={`Theme: ${mode}. Switch to ${next[mode]}.`} title={`Theme: ${mode}`}>
      <span aria-hidden="true">{icon}</span>
      <span className="docs-icon-button__label">{mode}</span>
    </button>
  );
}
