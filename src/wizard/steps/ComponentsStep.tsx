import { CATALOG } from '../../core/catalog';
import { SHOWCASES } from '../../core/config';
import { StepHeader } from '../ui';
import { issuesFor, type StepProps } from './types';

export function ComponentsStep({ config, issues, update }: StepProps) {
  const selected = new Set(config.components.selected);
  const optional = CATALOG.filter((c) => !c.foundation);
  const categories = [...new Set(CATALOG.map((c) => c.category))];
  const setSelected = (names: string[], summary: string) => update('components', { selected: names }, summary);
  const toggle = (name: string) => {
    const next = new Set(selected);
    if (next.has(name)) next.delete(name); else next.add(name);
    setSelected(optional.filter((c) => next.has(c.name)).map((c) => c.name), `${next.has(name) ? 'Added' : 'Removed'} ${name}`);
  };

  return (
    <>
      <StepHeader title="Components">
        Choose the components to generate. Each one comes with styles, TypeScript types, live examples, a playground and a props reference. Foundation components are always included because the others build on them.
      </StepHeader>
      <div className="wz-form">
        <div className="wz-toolbar">
          <span>{optional.filter((c) => selected.has(c.name)).length} of {optional.length} selected</span>
          <button type="button" className="wz-btn wz-btn--ghost" onClick={() => setSelected(optional.map((c) => c.name), 'Selected all components')}>Select all</button>
          <button type="button" className="wz-btn wz-btn--ghost" onClick={() => setSelected([], 'Cleared component selection')}>Clear</button>
        </div>
        {issuesFor(issues, 'selected').map((i) => <p key={i.message} className="wz-msg wz-msg--warn">⚠ {i.message}</p>)}
        {categories.map((cat) => (
          <fieldset key={cat} className="wz-catalog">
            <legend>{cat}</legend>
            {CATALOG.filter((c) => c.category === cat).map((c) => {
              const usedBy = SHOWCASES.filter((s) => config.docs.showcases.includes(s.id) && s.requires.includes(c.name));
              const on = c.foundation || selected.has(c.name);
              return (
                <label key={c.name} className={`wz-component${on ? ' wz-component--on' : ''}${c.foundation ? ' wz-component--locked' : ''}`}>
                  <input type="checkbox" checked={on} disabled={c.foundation} onChange={() => toggle(c.name)} />
                  <span className="wz-component__body">
                    <strong>{c.name}{c.foundation && <em> · foundation</em>}</strong>
                    <span>{c.summary}</span>
                    <small>{c.props.length} props · {c.examples.length} examples{c.playground ? ' · playground' : ''}{usedBy.length ? ` · used by ${usedBy.map((s) => s.title).join(', ')}` : ''}</small>
                  </span>
                </label>
              );
            })}
          </fieldset>
        ))}
      </div>
    </>
  );
}
