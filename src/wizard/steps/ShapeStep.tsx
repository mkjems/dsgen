import type { Density, RadiusStyle, ShadowStyle } from '../../core/config';
import { ChoiceCards, Slider, StepHeader } from '../ui';
import { issuesFor, type StepProps } from './types';

export function ShapeStep({ config, issues, update }: StepProps) {
  const s = config.shape;
  const set = (patch: Record<string, unknown>, summary: string) => update('shape', patch, summary);
  return (
    <>
      <StepHeader title="Spacing & shape">
        Define the spatial system. Spacing tokens are multiples of a base unit, control heights follow the density, and corner radius and shadows set the overall character.
      </StepHeader>
      <div className="wz-form">
        <ChoiceCards label="Spacing unit" value={s.spacingUnit} onChange={(v) => set({ spacingUnit: v }, `Spacing unit → ${v}px`)}
          options={[
            { value: 4, title: '4px grid', description: 'Fine-grained, common for product UI.' },
            { value: 8, title: '8px grid', description: 'Airier, coarser steps.' },
          ]} />
        <ChoiceCards<RadiusStyle> label="Corner radius" value={s.radius} onChange={(v) => set({ radius: v }, `Radius → ${v}`)}
          options={[
            { value: 'sharp', title: 'Sharp', description: '0–4px', visual: <i style={{ borderRadius: 0 }} /> },
            { value: 'subtle', title: 'Subtle', description: '2–10px', visual: <i style={{ borderRadius: 4 }} /> },
            { value: 'rounded', title: 'Rounded', description: '4–18px', visual: <i style={{ borderRadius: 9 }} /> },
            { value: 'pill', title: 'Pill', description: 'Fully round controls', visual: <i style={{ borderRadius: 99 }} /> },
          ]} />
        <ChoiceCards<ShadowStyle> label="Shadows" value={s.shadows} onChange={(v) => set({ shadows: v }, `Shadows → ${v}`)}
          options={[
            { value: 'none', title: 'Flat', description: 'Borders only', visual: <i className="wz-shadow-none" /> },
            { value: 'soft', title: 'Soft', description: 'Gentle depth', visual: <i className="wz-shadow-soft" /> },
            { value: 'strong', title: 'Strong', description: 'Pronounced elevation', visual: <i className="wz-shadow-strong" /> },
          ]} />
        <ChoiceCards<Density> label="Density" value={s.density} onChange={(v) => set({ density: v }, `Density → ${v}`)}
          options={[
            { value: 'compact', title: 'Compact', description: 'Controls 28/32/40px' },
            { value: 'comfortable', title: 'Comfortable', description: 'Controls 32/40/48px' },
            { value: 'spacious', title: 'Spacious', description: 'Controls 36/44/56px' },
          ]} />
        <Slider label="Border width" value={s.borderWidth} min={0} max={3} step={1} unit="px" onChange={(v) => set({ borderWidth: v }, `Border width → ${v}px`)} issues={issuesFor(issues, 'borderWidth')} />
      </div>
    </>
  );
}
