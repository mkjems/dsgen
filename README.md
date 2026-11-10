# Design System Generator

A step-by-step web wizard and generator that produces complete **React design systems**: a typed component library, design tokens and a documentation site with live examples, playgrounds, props references and showcase pages.

```bash
npm install
npm run dev              # wizard at http://localhost:5180
```

## How it works

```
 Wizard (src/wizard)  ──edits──▶  DesignSystemConfig  ──▶  generateProject()  ──▶  project files (.zip / disk)
   7 steps, live preview          (src/core/config.ts)      (src/core/generate.ts)
   per-step state + history                                  + templates (src/templates)
```

| Folder | What it is |
| --- | --- |
| `src/core/` | Pure, framework-free engine: config types and validation, OKLCH colour scales, the token engine, the component catalog and the generator. Runs in both the browser and Node. |
| `src/templates/library/` | The component templates: 16 components, each with `.tsx`, `.css` and a `meta.ts` holding the docs (props, examples, playground, a11y, guidelines). |
| `src/templates/docs-site/` | The documentation site template (Vite + React + MDX) that is copied into every generated system. |
| `src/wizard/` | The wizard UI. It imports the component templates directly, so the preview runs the exact code that will be generated. |
| `src/cli/` | The `generate` CLI and the `check:templates` self-checks. |

### Wizard steps and interface state

The steps are Identity, Colours, Typography, Spacing & shape, Components, Documentation, and Review & export.

The wizard keeps the full interface state of every step in `src/wizard/state.ts`:

- **Status per step:** not started, in progress or complete, plus visit and edit counts and timestamps. Live validation marks a step that has errors or was edited after completion.
- **Completion snapshots:** each time you press *Continue*, a copy of that step's data is saved. You can restore any snapshot from the **State** panel.
- **Timeline:** every visit, edit, completion, undo, redo, restore and import is logged.
- **Undo/redo:** ⌘Z / ⇧⌘Z, with rapid edits to the same field merged into one entry.
- **Persistence:** the state is saved to `localStorage`, so a reload resumes where you left off. *Save state* and *Import…* move whole sessions as JSON. Import also accepts a bare `design-system.config.json`.

The **{ } State** button opens an inspector with per-step details, the timeline and the raw JSON.

### What a generated system contains

```
my-system/
├── src/components/<Name>/<Name>.tsx|.css   # selected components + Stack/Text foundations
├── src/tokens/tokens.css|json|ts            # CSS vars (light + dark), W3C JSON, typed TS
├── src/styles/                              # base styles + stylesheet entry
├── docs/                                    # Vite + MDX docs site
│   ├── content/*.mdx                        # Getting started, How it works, Theming
│   └── src/generated/                       # system.json (props/tokens), demos.tsx, …
├── design-system.config.json                # regenerate from this
└── package.json, vite.config.ts, tsconfig*.json, README.md
```

The docs site includes:

- An overview page with a live component gallery.
- Foundations pages: palettes, semantic colours with light and dark values, WCAG contrast checks, the type scale, spacing, radius, elevation, and a searchable table of all tokens.
- A page per component with live examples (the code shown is the code that renders), an interactive playground that generates JSX, a props table with types, accepted values and defaults, accessibility notes, and do/don't guidelines.
- Showcase pages: Sign-up, Settings and Dashboard.

## CLI

```bash
npm run generate -- examples/acme.config.json out/acme [--force]
cd out/acme && npm install && npm run docs
```

## Quality checks

```bash
npm run typecheck
npm run check:templates   # docs↔source props, examples compile, prefix rewriting, selection, state reducer
```

## Adding a component

1. Create `src/templates/library/src/components/<Name>/` with `<Name>.tsx`, `<Name>.css` (classes and tokens prefixed `ds-`) and `meta.ts`.
2. Register it in `src/core/catalog.ts` and `src/wizard/lib.ts`.
3. Run `npm run check:templates`.
