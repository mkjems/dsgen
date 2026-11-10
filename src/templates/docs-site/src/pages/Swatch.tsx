import { CopyButton } from '../components/CodeBlock';

export function Swatch({ color, label }: { color: string; label?: string }) {
  return (
    <span className="docs-swatch">
      <span className="docs-swatch__chip" style={{ background: color }} />
      <code>{label ?? color}</code>
    </span>
  );
}

export function VarName({ name }: { name: string }) {
  return (
    <span className="docs-varname">
      <code>{name}</code>
      <CopyButton text={`var(${name})`} label="Copy" />
    </span>
  );
}
