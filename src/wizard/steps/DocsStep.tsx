import { SHOWCASES, type ShowcaseId } from '../../core/config';
import { FOUNDATION_COMPONENTS } from '../../core/catalog';
import { StepHeader, TextInput, Toggle } from '../ui';
import { issuesFor, type StepProps } from './types';

export function DocsStep({ config, issues, update }: StepProps) {
  const d = config.docs;
  const set = (patch: Record<string, unknown>, summary: string) => update('docs', patch, summary);
  const available = new Set([...config.components.selected, ...FOUNDATION_COMPONENTS]);
  const toggleShowcase = (id: ShowcaseId) => {
    const on = d.showcases.includes(id);
    set({ showcases: on ? d.showcases.filter((s) => s !== id) : [...d.showcases, id] }, `${on ? 'Removed' : 'Added'} showcase ${id}`);
  };
  return (
    <>
      <StepHeader title="Documentation">
        Every system ships with a documentation site: guides, foundations, a page per component and showcase pages that compose components into realistic screens.
      </StepHeader>
      <div className="wz-form">
        <div className="wz-row">
          <TextInput label="Site title" value={d.title} onChange={(v) => set({ title: v }, `Docs title → ${v}`)} issues={issuesFor(issues, 'title')} />
          <TextInput label="Repository URL (optional)" mono value={d.repositoryUrl} placeholder="https://github.com/acme/ui" onChange={(v) => set({ repositoryUrl: v }, 'Edited repository URL')} issues={issuesFor(issues, 'repositoryUrl')} />
        </div>
        <TextInput label="Tagline" value={d.tagline} onChange={(v) => set({ tagline: v }, 'Edited tagline')} />

        <fieldset className="wz-catalog">
          <legend>Showcase pages</legend>
          {SHOWCASES.map((s) => {
            const missing = s.requires.filter((r) => !available.has(r));
            const on = d.showcases.includes(s.id);
            return (
              <label key={s.id} className={`wz-component${on ? ' wz-component--on' : ''}`}>
                <input type="checkbox" checked={on} onChange={() => toggleShowcase(s.id)} />
                <span className="wz-component__body">
                  <strong>{s.title}</strong>
                  <span>{s.description}</span>
                  <small className={missing.length && on ? 'wz-text-warn' : undefined}>
                    Uses {s.requires.join(', ')}{missing.length ? ` — missing ${missing.join(', ')}, will be skipped` : ''}
                  </small>
                </span>
              </label>
            );
          })}
        </fieldset>

        <Toggle label="Interactive playgrounds" description="Prop controls with live code on every component page." checked={d.includePlayground} onChange={(v) => set({ includePlayground: v }, `Playgrounds ${v ? 'on' : 'off'}`)} />
        <Toggle label="“How it works” guide" description="Explains the token layers, conventions, file layout and how to regenerate." checked={d.includeHowItWorks} onChange={(v) => set({ includeHowItWorks: v }, `How-it-works guide ${v ? 'on' : 'off'}`)} />
      </div>
    </>
  );
}
