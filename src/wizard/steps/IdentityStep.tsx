import { StepHeader, TextArea, TextInput, SelectInput } from '../ui';
import { issuesFor, type StepProps } from './types';

const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
const prefixFrom = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '').replace(/^[0-9]+/, '').slice(0, 8);

export function IdentityStep({ config, issues, update }: StepProps) {
  const id = config.identity;
  const set = (patch: Record<string, unknown>, summary: string) => update('identity', patch, summary);

  const onName = (name: string) => {
    // Keep derived fields in sync while they still match what we would have derived.
    const patch: Record<string, unknown> = { name };
    const words = id.name.split(/\s+/);
    const derivedPkg = `@${slugify(words[0] ?? '')}/${slugify(words.slice(1).join(' ') || 'ui')}`;
    if (id.packageName === derivedPkg) {
      const w = name.split(/\s+/);
      patch.packageName = `@${slugify(w[0] ?? '') || 'my'}/${slugify(w.slice(1).join(' ') || 'ui')}`;
    }
    if (id.prefix === prefixFrom(words[0] ?? '')) patch.prefix = prefixFrom(name.split(/\s+/)[0] ?? '') || id.prefix;
    if (config.docs.title === id.name) update('docs', { title: name }, `Docs title follows name: ${name}`);
    set(patch, `Name → “${name}”`);
  };

  return (
    <>
      <StepHeader title="Identity">
        Name your design system. The package name is used for <code>npm install</code>, and the prefix namespaces every CSS class and custom property, so the system can live alongside other CSS.
      </StepHeader>
      <div className="wz-form">
        <TextInput label="Design system name" value={id.name} onChange={onName} issues={issuesFor(issues, 'name')} placeholder="Acme UI" />
        <div className="wz-row">
          <TextInput label="npm package name" mono value={id.packageName} onChange={(v) => set({ packageName: v }, `Package → ${v}`)} issues={issuesFor(issues, 'packageName')} hint="Scoped names like @company/ui are recommended." />
          <TextInput label="CSS prefix" mono value={id.prefix} onChange={(v) => set({ prefix: v }, `Prefix → ${v}`)} issues={issuesFor(issues, 'prefix')}
            hint={<>Classes become <code>.{id.prefix || '…'}-button</code>, tokens <code>--{id.prefix || '…'}-color-primary</code>.</>} />
        </div>
        <TextArea label="Description" value={id.description} onChange={(v) => set({ description: v }, 'Edited description')} issues={issuesFor(issues, 'description')} />
        <div className="wz-row wz-row--3">
          <TextInput label="Version" mono value={id.version} onChange={(v) => set({ version: v }, `Version → ${v}`)} issues={issuesFor(issues, 'version')} />
          <TextInput label="Author" value={id.author} onChange={(v) => set({ author: v }, 'Edited author')} />
          <SelectInput label="License" value={id.license} onChange={(v) => set({ license: v }, `License → ${v}`)}
            options={['MIT', 'Apache-2.0', 'ISC', 'BSD-3-Clause', 'UNLICENSED'].map((l) => ({ label: l, value: l }))} />
        </div>
      </div>
    </>
  );
}
