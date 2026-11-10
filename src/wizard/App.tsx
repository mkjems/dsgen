import { useCallback, useEffect, useMemo, useReducer, useRef, useState } from 'react';
import type { ConfigSection } from '../core/config';
import { loadState, parseState, reducer, saveState, STEPS, stepViews, type StepId } from './state';
import { StepPreview } from './Preview';
import { StateInspector } from './StateInspector';
import { IdentityStep } from './steps/IdentityStep';
import { ColorsStep } from './steps/ColorsStep';
import { TypographyStep } from './steps/TypographyStep';
import { ShapeStep } from './steps/ShapeStep';
import { ComponentsStep } from './steps/ComponentsStep';
import { DocsStep } from './steps/DocsStep';
import { ReviewStep } from './steps/ReviewStep';

export function App() {
  const [state, dispatch] = useReducer(reducer, undefined, loadState);
  const [inspectorOpen, setInspectorOpen] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const mainRef = useRef<HTMLElement>(null);
  const views = useMemo(() => stepViews(state), [state]);

  // Persist (debounced) so a reload resumes exactly where the user left off.
  useEffect(() => {
    const t = setTimeout(() => saveState(state), 250);
    return () => clearTimeout(t);
  }, [state]);

  useEffect(() => {
    mainRef.current?.scrollTo({ top: 0 });
  }, [state.currentStep]);

  // Undo/redo shortcuts outside text fields (inside them the browser's own undo applies).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('input, textarea, select, [contenteditable]')) return;
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        dispatch({ type: e.shiftKey ? 'redo' : 'undo' });
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const update = useCallback(
    (section: ConfigSection, patch: Record<string, unknown>, summary: string) => dispatch({ type: 'update', section, patch, summary }),
    [],
  );
  const goTo = useCallback((step: StepId) => dispatch({ type: 'goTo', step }), []);

  const exportState = () => {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${state.config.identity.prefix || 'design-system'}-wizard-state.json`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const onImport = async (file: File) => {
    try {
      dispatch({ type: 'import', state: parseState(JSON.parse(await file.text())) });
      setImportError(null);
    } catch (err) {
      setImportError((err as Error).message);
    }
  };

  const index = STEPS.findIndex((s) => s.id === state.currentStep);
  const current = views[index];
  const next = STEPS[index + 1];
  const prev = STEPS[index - 1];
  const props = { config: state.config, issues: current.issues, update };
  const completedCount = views.filter((v) => v.id !== 'review' && v.status === 'complete').length;

  return (
    <div className={`wz-app${inspectorOpen ? ' wz-app--inspector' : ''}${state.currentStep === 'review' ? ' wz-app--wide' : ''}`}>
      <header className="wz-topbar">
        <div className="wz-brand"><span aria-hidden="true">◆</span> Design System Generator</div>
        <span className="wz-project" title="Current design system">{state.config.identity.name || 'Untitled'}</span>
        <div className="wz-topbar__spacer" />
        <div className="wz-topbar__group" role="group" aria-label="History">
          <button type="button" className="wz-btn wz-btn--sm" disabled={!state.past.length} onClick={() => dispatch({ type: 'undo' })} title="Undo (⌘Z)">↶ Undo</button>
          <button type="button" className="wz-btn wz-btn--sm" disabled={!state.future.length} onClick={() => dispatch({ type: 'redo' })} title="Redo (⇧⌘Z)">↷ Redo</button>
        </div>
        <div className="wz-topbar__group">
          <button type="button" className="wz-btn wz-btn--sm" onClick={() => fileRef.current?.click()}>Import…</button>
          <button type="button" className="wz-btn wz-btn--sm" onClick={exportState}>Save state</button>
          <button type="button" className="wz-btn wz-btn--sm wz-btn--ghost" onClick={() => { if (confirm('Reset all steps to the defaults? Export your state first if you want to keep it.')) dispatch({ type: 'reset' }); }}>Reset</button>
          <button type="button" className="wz-btn wz-btn--sm" aria-pressed={inspectorOpen} onClick={() => setInspectorOpen(!inspectorOpen)}>{'{ }'} State</button>
        </div>
        <input ref={fileRef} type="file" accept="application/json,.json" hidden onChange={(e) => { const f = e.target.files?.[0]; if (f) onImport(f); e.target.value = ''; }} />
      </header>
      {importError && <div className="wz-banner" role="alert">Import failed: {importError} <button type="button" className="wz-icon" onClick={() => setImportError(null)} aria-label="Dismiss">✕</button></div>}

      <nav className="wz-steps" aria-label="Creation steps">
        <div className="wz-progress" aria-label={`${completedCount} of ${STEPS.length - 1} steps complete`}>
          <span style={{ width: `${(completedCount / (STEPS.length - 1)) * 100}%` }} />
        </div>
        <ol>
          {views.map((v, i) => {
            const icon = v.errors ? '!' : v.status === 'complete' ? '✓' : String(i + 1);
            return (
              <li key={v.id}>
                <button type="button" className={`wz-step wz-step--${v.errors ? 'error' : v.status}${v.id === state.currentStep ? ' is-current' : ''}`}
                  aria-current={v.id === state.currentStep ? 'step' : undefined} onClick={() => goTo(v.id)}>
                  <span className="wz-step__icon" aria-hidden="true">{icon}</span>
                  <span className="wz-step__text">
                    <span className="wz-step__title">{v.title}</span>
                    <span className="wz-step__blurb">
                      {v.errors ? `${v.errors} error${v.errors > 1 ? 's' : ''}` : v.dirty ? 'Edited since completed' : v.blurb}
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
      </nav>

      <main ref={mainRef} className="wz-main" id="main">
        {state.currentStep === 'identity' && <IdentityStep {...props} />}
        {state.currentStep === 'colors' && <ColorsStep {...props} />}
        {state.currentStep === 'typography' && <TypographyStep {...props} />}
        {state.currentStep === 'shape' && <ShapeStep {...props} />}
        {state.currentStep === 'components' && <ComponentsStep {...props} />}
        {state.currentStep === 'docs' && <DocsStep {...props} />}
        {state.currentStep === 'review' && <ReviewStep config={state.config} views={views} goTo={goTo} exportState={exportState} />}

        <footer className="wz-nav">
          {prev ? <button type="button" className="wz-btn" onClick={() => goTo(prev.id)}>← {prev.title}</button> : <span />}
          {next && (
            <button type="button" className="wz-btn wz-btn--primary" disabled={current.errors > 0}
              onClick={() => { dispatch({ type: 'complete', step: current.id }); goTo(next.id); }}>
              {current.errors > 0 ? `Fix ${current.errors} error${current.errors > 1 ? 's' : ''} to continue` : `Continue to ${next.title} →`}
            </button>
          )}
        </footer>
      </main>

      {state.currentStep !== 'review' && (
        <div className="wz-preview-col">
          <StepPreview step={state.currentStep} config={state.config} />
        </div>
      )}

      {inspectorOpen && <StateInspector state={state} views={views} dispatch={dispatch} onClose={() => setInspectorOpen(false)} />}
    </div>
  );
}
