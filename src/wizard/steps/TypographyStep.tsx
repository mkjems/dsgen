import { FONT_OPTIONS, MONO_OPTIONS } from '../../core/config';
import { SelectInput, Slider, StepHeader } from '../ui';
import { issuesFor, type StepProps } from './types';

const RATIOS = [
  { label: 'Major second · 1.125 (dense UI)', value: 1.125 },
  { label: 'Minor third · 1.2', value: 1.2 },
  { label: 'Major third · 1.25 (balanced)', value: 1.25 },
  { label: 'Perfect fourth · 1.333', value: 1.333 },
  { label: 'Augmented fourth · 1.414', value: 1.414 },
  { label: 'Perfect fifth · 1.5 (editorial)', value: 1.5 },
];

export function TypographyStep({ config, issues, update }: StepProps) {
  const t = config.typography;
  const set = (patch: Record<string, unknown>, summary: string) => update('typography', patch, summary);
  const label = (v: string) => [...FONT_OPTIONS, ...MONO_OPTIONS].find((f) => f.value === v)?.label ?? v;
  return (
    <>
      <StepHeader title="Typography">
        Choose typefaces and a modular scale. Every font size is the base size multiplied by the ratio a whole number of times, which gives headings a consistent rhythm.
      </StepHeader>
      <div className="wz-form">
        <div className="wz-row wz-row--3">
          <SelectInput label="Body font" value={t.bodyFont} options={FONT_OPTIONS.map((f) => ({ label: f.label, value: f.value }))} onChange={(v) => set({ bodyFont: v }, `Body font → ${label(v)}`)} />
          <SelectInput label="Heading font" value={t.headingFont} options={FONT_OPTIONS.map((f) => ({ label: f.label, value: f.value }))} onChange={(v) => set({ headingFont: v }, `Heading font → ${label(v)}`)} />
          <SelectInput label="Code font" value={t.monoFont} options={MONO_OPTIONS.map((f) => ({ label: f.label, value: f.value }))} onChange={(v) => set({ monoFont: v }, `Code font → ${label(v)}`)} />
        </div>
        <SelectInput label="Scale ratio" value={t.scaleRatio} options={RATIOS} onChange={(v) => set({ scaleRatio: v }, `Scale ratio → ${v}`)} issues={issuesFor(issues, 'scaleRatio')} />
        <div className="wz-row">
          <Slider label="Base font size" value={t.baseSize} min={12} max={20} step={1} unit="px" onChange={(v) => set({ baseSize: v }, `Base size → ${v}px`)} issues={issuesFor(issues, 'baseSize')} />
          <Slider label="Body line height" value={t.lineHeight} min={1.2} max={1.9} step={0.05} onChange={(v) => set({ lineHeight: Number(v.toFixed(2)) }, `Line height → ${v.toFixed(2)}`)} issues={issuesFor(issues, 'lineHeight')} />
        </div>
        <SelectInput label="Heading weight" value={t.headingWeight} onChange={(v) => set({ headingWeight: v }, `Heading weight → ${v}`)}
          options={[{ label: 'Medium (500)', value: 500 }, { label: 'Semibold (600)', value: 600 }, { label: 'Bold (700)', value: 700 }, { label: 'Extra bold (800)', value: 800 }]} />
      </div>
    </>
  );
}
