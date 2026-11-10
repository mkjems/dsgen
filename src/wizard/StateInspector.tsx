import { useState } from 'react';
import { STEPS, type Action, type StepId, type StepView, type WizardState } from './state';

const fmt = (iso?: string) => (iso ? new Date(iso).toLocaleString() : '—');

export function StateInspector({ state, views, dispatch, onClose }: { state: WizardState; views: StepView[]; dispatch: (a: Action) => void; onClose: () => void }) {
  const [tab, setTab] = useState<'steps' | 'timeline' | 'raw'>('steps');
  const [openStep, setOpenStep] = useState<StepId>(state.currentStep);
  const raw = JSON.stringify(state, null, 2);

  return (
    <aside className="wz-inspector" aria-label="Interface state">
      <div className="wz-inspector__head">
        <strong>Interface state</strong>
        <div className="wz-segment" role="tablist" aria-label="State views">
          {(['steps', 'timeline', 'raw'] as const).map((t) => (
            <button key={t} type="button" role="tab" aria-selected={tab === t} aria-pressed={tab === t} onClick={() => setTab(t)}>
              {t === 'steps' ? 'Steps' : t === 'timeline' ? `Timeline (${state.timeline.length})` : 'Raw JSON'}
            </button>
          ))}
        </div>
        <button type="button" className="wz-icon" onClick={onClose} aria-label="Close state panel">✕</button>
      </div>

      {tab === 'steps' && (
        <div className="wz-inspector__body">
          <p className="wz-hint">
            Started {fmt(state.createdAt)} · last change {fmt(state.updatedAt)} · undo {state.past.length} / redo {state.future.length}
          </p>
          {STEPS.map((def) => {
            const st = state.steps[def.id];
            const view = views.find((v) => v.id === def.id)!;
            const open = openStep === def.id;
            return (
              <section key={def.id} className={`wz-state-step${state.currentStep === def.id ? ' is-current' : ''}`}>
                <button type="button" className="wz-state-step__head" aria-expanded={open} onClick={() => setOpenStep(open ? ('' as StepId) : def.id)}>
                  <span className={`wz-dot wz-dot--${view.errors ? 'error' : st.status === 'complete' ? 'ok' : st.status === 'in-progress' ? 'progress' : 'pending'}`} aria-hidden="true" />
                  <strong>{def.title}</strong>
                  <span className="wz-chip">{st.status}{view.dirty ? ' · edited' : ''}{view.needsAttention ? ' · needs attention' : ''}</span>
                </button>
                {open && (
                  <div className="wz-state-step__body">
                    <dl className="wz-kv">
                      <dt>Visits</dt><dd>{st.visits}</dd>
                      <dt>Edits</dt><dd>{st.edits}</dd>
                      <dt>First visited</dt><dd>{fmt(st.firstVisitedAt)}</dd>
                      <dt>Completed</dt><dd>{fmt(st.completedAt)}</dd>
                      <dt>Issues</dt><dd>{view.errors} errors, {view.warnings} warnings</dd>
                    </dl>
                    {def.section && (
                      <>
                        <p className="wz-label">Current data · <code>config.{def.section}</code></p>
                        <pre className="wz-json">{JSON.stringify(state.config[def.section], null, 2)}</pre>
                        <p className="wz-label">Completion snapshots ({st.snapshots.length})</p>
                        {st.snapshots.length === 0 && <p className="wz-hint">A snapshot is saved each time you press Continue on this step.</p>}
                        <ol className="wz-snapshots">
                          {st.snapshots.map((s, i) => (
                            <li key={s.at}>
                              <span>{fmt(s.at)}</span>
                              <button type="button" className="wz-btn wz-btn--ghost wz-btn--sm" onClick={() => dispatch({ type: 'restoreSnapshot', step: def.id, index: i })}>Restore</button>
                            </li>
                          ))}
                        </ol>
                      </>
                    )}
                    <button type="button" className="wz-btn wz-btn--sm" onClick={() => dispatch({ type: 'goTo', step: def.id })}>Go to step</button>
                  </div>
                )}
              </section>
            );
          })}
        </div>
      )}

      {tab === 'timeline' && (
        <ol className="wz-inspector__body wz-timeline" reversed>
          {[...state.timeline].reverse().map((e, i) => (
            <li key={`${e.at}-${i}`} className={`wz-timeline__item wz-timeline__item--${e.kind}`}>
              <span className="wz-timeline__kind">{e.kind}</span>
              <span className="wz-timeline__text">{e.summary}</span>
              <span className="wz-timeline__meta">{STEPS.find((s) => s.id === e.step)?.title} · {new Date(e.at).toLocaleTimeString()}</span>
            </li>
          ))}
        </ol>
      )}

      {tab === 'raw' && (
        <div className="wz-inspector__body">
          <button type="button" className="wz-btn wz-btn--sm" onClick={() => navigator.clipboard?.writeText(raw)}>Copy JSON</button>
          <pre className="wz-json wz-json--full">{raw}</pre>
        </div>
      )}
    </aside>
  );
}
