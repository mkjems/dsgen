import { useEffect, useMemo, useState, type ReactNode } from 'react';
import type { DesignSystemConfig } from '../core/config';
import { googleFontsUrl, SHOWCASES } from '../core/config';
import { resolveComponents } from '../core/catalog';
import { buildTokens, tokensToCss, type TokenSet } from '../core/tokens';
import { exampleComponent, SafeRender } from './runtime';
import { Alert, Avatar, Badge, Button, Card, Checkbox, Select, Stack, Switch, Tabs, Text, TextField } from './lib';
import type { StepId } from './state';

function useGoogleFonts(url: string | null) {
  useEffect(() => {
    if (!url) return;
    const id = `dsg-font-${btoa(url).slice(0, 24)}`;
    if (document.getElementById(id)) return;
    const link = document.createElement('link');
    link.id = id;
    link.rel = 'stylesheet';
    link.href = url;
    document.head.appendChild(link);
  }, [url]);
}

/** Scopes the generated tokens to the preview pane, so the wizard UI is unaffected. */
export function PreviewFrame({ config, tokens, children, title }: { config: DesignSystemConfig; tokens: TokenSet; children: ReactNode; title: string }) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const css = useMemo(
    () => tokensToCss(tokens, 'ds', { selector: '.dsg-preview', darkSelector: '.dsg-preview[data-theme="dark"]' }),
    [tokens],
  );
  useGoogleFonts(googleFontsUrl(config.typography));
  const dark = config.colors.darkMode && theme === 'dark';

  return (
    <section className="wz-preview" aria-label="Live preview">
      <div className="wz-preview__bar">
        <span className="wz-preview__title">{title}</span>
        <span className="wz-preview__live" aria-hidden="true">● Live</span>
        <div className="wz-segment" role="group" aria-label="Preview theme">
          <button type="button" aria-pressed={!dark} onClick={() => setTheme('light')}>Light</button>
          <button type="button" aria-pressed={dark} disabled={!config.colors.darkMode} onClick={() => setTheme('dark')} title={config.colors.darkMode ? undefined : 'Dark mode is disabled in the Colours step'}>Dark</button>
        </div>
      </div>
      <style>{css}</style>
      <div className="dsg-preview" data-theme={dark ? 'dark' : 'light'}>
        <SafeRender>{children}</SafeRender>
      </div>
    </section>
  );
}

function SampleScreen({ config }: { config: DesignSystemConfig }) {
  return (
    <Stack gap={5}>
      <Stack direction="row" justify="between">
        <Stack direction="row" gap={3}>
          <span className="dsg-logo">{config.identity.name.charAt(0) || '?'}</span>
          <Text variant="h4">{config.identity.name || 'Untitled'}</Text>
        </Stack>
        <Stack direction="row" gap={2}>
          <Badge tone="success" dot>Live</Badge>
          <Avatar name="Ada Lovelace" size="sm" status="online" />
        </Stack>
      </Stack>
      <Card title="Create a project" description="Projects group your team’s work." variant="elevated"
        footer={<><Button variant="outline">Cancel</Button><Button>Create project</Button></>}>
        <Stack gap={4}>
          <TextField label="Project name" placeholder="e.g. Website relaunch" hint="You can change this later." />
          <Select label="Visibility" defaultValue="team" options={[{ value: 'team', label: 'Team' }, { value: 'private', label: 'Private' }, { value: 'public', label: 'Public' }]} />
          <Switch label="Notify members" description="Send an email to everyone on the team." defaultChecked />
          <Checkbox label="Use a template" />
        </Stack>
      </Card>
      <Alert tone="info" title="Tip">Press <Text as="kbd" variant="code">N</Text> anywhere to start a new project.</Alert>
    </Stack>
  );
}

function Palettes({ tokens }: { tokens: TokenSet }) {
  return (
    <Stack gap={3}>
      {Object.entries(tokens.palettes).map(([name, scale]) => (
        <div key={name}>
          <Text variant="caption">{name.toUpperCase()}</Text>
          <div className="dsg-palette">
            {Object.entries(scale).map(([step, hex]) => (
              <span key={step} title={`${name}-${step} ${hex}`} style={{ background: hex }} className={Number(step) === tokens.baseSteps[name as keyof typeof tokens.baseSteps] && name !== 'neutral' ? 'is-base' : undefined} />
            ))}
          </div>
        </div>
      ))}
    </Stack>
  );
}

function ContrastList({ tokens }: { tokens: TokenSet }) {
  return (
    <Card title="Contrast checks" description="WCAG 2 ratios for key pairs" padding="sm">
      <Stack gap={2}>
        {tokens.contrastChecks.map((c) => (
          <Stack key={c.label + c.theme} direction="row" justify="between" gap={3}>
            <Stack direction="row" gap={2}>
              <span className="dsg-contrast-chip" style={{ background: c.background, color: c.foreground }}>Aa</span>
              <Text variant="small">{c.label} <Text as="span" variant="small" tone="muted">({c.theme})</Text></Text>
            </Stack>
            <Badge size="sm" tone={c.level === 'Fail' ? 'danger' : c.level === 'AA Large' ? 'warning' : 'success'}>{c.level} · {c.ratio}</Badge>
          </Stack>
        ))}
      </Stack>
    </Card>
  );
}

function TypeScale({ tokens }: { tokens: TokenSet }) {
  const sizes = tokens.groups.find((g) => g.id === 'typography')!.tokens.filter((t) => t.name.startsWith('font-size-')).reverse();
  return (
    <Stack gap={2}>
      {sizes.map((s) => (
        <div key={s.name} className="dsg-type-row">
          <Text variant="caption">{s.name.replace('font-size-', '')} · {s.description.match(/\(([^)]+)\)/)?.[1]}</Text>
          <div style={{ fontSize: `var(--ds-${s.name})`, fontFamily: parseFloat(s.value) >= 1.2 ? 'var(--ds-font-heading)' : 'var(--ds-font-body)', fontWeight: parseFloat(s.value) >= 1.2 ? 'var(--ds-font-weight-heading)' as never : undefined, lineHeight: 1.2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            Sphinx of black quartz
          </div>
        </div>
      ))}
      <Text tone="muted">Body text: The five boxing wizards jump quickly. Good typography gives text a calm rhythm and makes long passages comfortable to read.</Text>
      <Text variant="code">const answer = 42;</Text>
    </Stack>
  );
}

function ShapeSample() {
  return (
    <Stack gap={5}>
      <Stack direction="row" gap={3} wrap>
        <Button size="sm">Small</Button>
        <Button>Medium</Button>
        <Button size="lg">Large</Button>
      </Stack>
      <Stack direction="row" gap={3} align="end" wrap>
        <TextField label="Inline" placeholder="Same height" />
        <Button variant="outline">Aligned</Button>
      </Stack>
      <div className="dsg-elevation">
        <Card padding="sm">Outlined</Card>
        <Card padding="sm" variant="elevated">Elevated</Card>
        <Card padding="sm" variant="filled">Filled</Card>
      </div>
      <Tabs variant="pill" items={[{ id: 'a', label: 'Overview', content: <Text tone="muted">Spacing, radius and shadows all come from tokens.</Text> }, { id: 'b', label: 'Activity', content: <Text>Activity</Text> }]} />
    </Stack>
  );
}

function ComponentGallery({ config }: { config: DesignSystemConfig }) {
  const comps = resolveComponents(config.components.selected);
  return (
    <Stack gap={6}>
      {comps.map((c) => {
        const ex = c.examples[0];
        const Example = ex ? exampleComponent(ex) : null;
        return (
          <section key={c.name} className="dsg-gallery-item">
            <Stack direction="row" justify="between">
              <Text variant="h4" as="h3">{c.name}</Text>
              <Badge size="sm">{c.category}</Badge>
            </Stack>
            <Text variant="small" tone="muted">{c.summary}</Text>
            <div className="dsg-gallery-stage">{Example && <SafeRender><Example /></SafeRender>}</div>
          </section>
        );
      })}
    </Stack>
  );
}

function DocsMock({ config }: { config: DesignSystemConfig }) {
  const comps = resolveComponents(config.components.selected);
  const showcases = SHOWCASES.filter((s) => config.docs.showcases.includes(s.id));
  return (
    <div className="dsg-docs-mock">
      <aside>
        <Text variant="caption">GUIDES</Text>
        <Text variant="small">Overview</Text>
        <Text variant="small">Getting started</Text>
        {config.docs.includeHowItWorks && <Text variant="small">How it works</Text>}
        <Text variant="small">Theming & dark mode</Text>
        <Text variant="caption">FOUNDATIONS</Text>
        <Text variant="small">Colours · Typography · Spacing · Tokens</Text>
        <Text variant="caption">COMPONENTS ({comps.length})</Text>
        <Text variant="small" tone="muted">{comps.map((c) => c.name).join(', ')}</Text>
        {showcases.length > 0 && <Text variant="caption">SHOWCASES</Text>}
        {showcases.map((s) => <Text key={s.id} variant="small">{s.title}</Text>)}
      </aside>
      <main>
        <Text variant="caption" tone="primary">Design system · v{config.identity.version}</Text>
        <Text variant="h2">{config.docs.title || 'Untitled'}</Text>
        <Text variant="lead">{config.docs.tagline}</Text>
        <Stack direction="row" gap={2}>
          <Button size="sm">Get started</Button>
          <Button size="sm" variant="outline">Browse components</Button>
        </Stack>
        <Card padding="sm" title="Button" description="Props · Examples · Playground · Accessibility">
          <Stack direction="row" gap={2}>
            <Button size="sm">Solid</Button>
            <Button size="sm" variant="outline">Outline</Button>
            {config.docs.includePlayground && <Badge tone="primary" size="sm">Playground</Badge>}
          </Stack>
        </Card>
      </main>
    </div>
  );
}

export function StepPreview({ step, config }: { step: StepId; config: DesignSystemConfig }) {
  const tokens = useMemo(() => buildTokens(config), [config]);
  const titles: Record<StepId, string> = {
    identity: 'Sample screen', colors: 'Palettes & contrast', typography: 'Type scale', shape: 'Controls & surfaces',
    components: 'Component gallery', docs: 'Docs site outline', review: 'Sample screen',
  };
  return (
    <PreviewFrame config={config} tokens={tokens} title={titles[step]}>
      {step === 'colors' ? (
        <Stack gap={5}><Palettes tokens={tokens} /><ContrastList tokens={tokens} /><SampleScreen config={config} /></Stack>
      ) : step === 'typography' ? (
        <TypeScale tokens={tokens} />
      ) : step === 'shape' ? (
        <ShapeSample />
      ) : step === 'components' ? (
        <ComponentGallery config={config} />
      ) : step === 'docs' ? (
        <DocsMock config={config} />
      ) : (
        <SampleScreen config={config} />
      )}
    </PreviewFrame>
  );
}
