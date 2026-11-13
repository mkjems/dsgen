import type { PropDoc } from '../types';
import { InlineMd } from './InlineMd';

export function PropsTable({ component }: { component: { props: PropDoc[]; extends?: string } }) {
  return (
    <div className="docs-table-wrap">
      <table className="docs-table docs-props">
        <thead>
          <tr>
            <th scope="col">Prop</th>
            <th scope="col">Type &amp; accepted values</th>
            <th scope="col">Default</th>
            <th scope="col">Description</th>
          </tr>
        </thead>
        <tbody>
          {component.props.map((p) => (
            <tr key={p.name}>
              <td>
                <code className="docs-prop-name">{p.name}</code>
                {p.required && <span className="docs-required">required</span>}
              </td>
              <td>
                {p.values ? (
                  <div className="docs-values">
                    {p.values.map((v) => (
                      <code key={v} className="docs-value">{/^[\d.]+$/.test(v) ? v : `'${v}'`}</code>
                    ))}
                  </div>
                ) : (
                  <code className="docs-type">{p.type}</code>
                )}
              </td>
              <td>{p.default ? <code className="docs-default">{p.default}</code> : <span className="docs-muted">—</span>}</td>
              <td><InlineMd text={p.description} /></td>
            </tr>
          ))}
        </tbody>
      </table>
      {component.extends && (
        <p className="docs-note">
          <InlineMd text={`Also accepts all native ${component.extends}, including \`className\`, \`style\`, event handlers and \`aria-*\`. Unlisted props are forwarded to the root element.`} />
        </p>
      )}
    </div>
  );
}
