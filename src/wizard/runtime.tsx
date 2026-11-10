import * as React from 'react';
import { transform } from 'sucrase';
import type { ExampleDoc } from '../core/meta';
import { isComponentExample } from '../core/generate';
import { LIB } from './lib';

/**
 * Compiles documentation examples in the browser with Sucrase, so the wizard
 * renders exactly the snippets that the generated docs site will show.
 */
const cache = new Map<string, React.ComponentType>();
const NAMES = Object.keys(LIB);
const VALUES = Object.values(LIB);

function compile(source: string): React.ComponentType {
  const { code } = transform(source, { transforms: ['jsx', 'typescript'], jsxRuntime: 'classic', production: true });
  // eslint-disable-next-line @typescript-eslint/no-implied-eval
  const factory = new Function('React', 'useState', ...NAMES, code);
  return factory(React, React.useState, ...VALUES) as React.ComponentType;
}

export function exampleComponent(example: Pick<ExampleDoc, 'code'>): React.ComponentType {
  const key = example.code;
  let comp = cache.get(key);
  if (!comp) {
    const source = isComponentExample(example as ExampleDoc)
      ? `${example.code}\nreturn Demo;`
      : `return function Example() { return (<>\n${example.code}\n</>); };`;
    try {
      comp = compile(source);
    } catch (err) {
      const message = (err as Error).message;
      comp = () => <div className="wz-error">Could not compile example: {message}</div>;
    }
    cache.set(key, comp);
  }
  return comp;
}

export class SafeRender extends React.Component<{ children: React.ReactNode }, { error: Error | null }> {
  state = { error: null as Error | null };
  static getDerivedStateFromError(error: Error) {
    return { error };
  }
  render() {
    return this.state.error ? <div className="wz-error">Render error: {this.state.error.message}</div> : this.props.children;
  }
}
