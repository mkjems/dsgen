/**
 * Wizard state: the working config plus the full interface state of every
 * creation step — status, visits, completion snapshots — an activity
 * timeline and undo/redo history. Persisted to localStorage and exportable
 * as JSON so a session can be resumed, shared or replayed.
 */
import type { ConfigSection, DesignSystemConfig } from '../core/config';
import { DEFAULT_CONFIG, normalizeConfig, validateSection, type ValidationIssue } from '../core/defaults';

export const STEPS = [
  { id: 'identity', title: 'Identity', section: 'identity', blurb: 'Name, package and CSS prefix' },
  { id: 'colors', title: 'Colours', section: 'colors', blurb: 'Brand, neutral and status colours' },
  { id: 'typography', title: 'Typography', section: 'typography', blurb: 'Fonts and the type scale' },
  { id: 'shape', title: 'Spacing & shape', section: 'shape', blurb: 'Grid, corners, shadows, density' },
  { id: 'components', title: 'Components', section: 'components', blurb: 'Choose what to include' },
  { id: 'docs', title: 'Documentation', section: 'docs', blurb: 'Docs site and showcase pages' },
  { id: 'review', title: 'Review & export', section: null, blurb: 'Validate, inspect and download' },
] as const satisfies readonly { id: string; title: string; section: ConfigSection | null; blurb: string }[];

export type StepId = (typeof STEPS)[number]['id'];
export type StepStatus = 'not-started' | 'in-progress' | 'complete';

export interface StepSnapshot {
  at: string;
  /** The step's config section at the moment it was completed. */
  data: unknown;
}

export interface StepState {
  status: StepStatus;
  visits: number;
  edits: number;
  firstVisitedAt?: string;
  lastVisitedAt?: string;
  completedAt?: string;
  snapshots: StepSnapshot[];
}

export interface TimelineEntry {
  at: string;
  step: StepId;
  kind: 'visit' | 'edit' | 'complete' | 'undo' | 'redo' | 'restore' | 'import' | 'reset';
  summary: string;
}

export interface WizardState {
  version: 1;
  createdAt: string;
  updatedAt: string;
  currentStep: StepId;
  config: DesignSystemConfig;
  steps: Record<StepId, StepState>;
  timeline: TimelineEntry[];
  past: DesignSystemConfig[];
  future: DesignSystemConfig[];
  /** Used to merge rapid edits of the same field into one undo entry. */
  lastEdit?: { key: string; at: number };
}

export type Action =
  | { type: 'goTo'; step: StepId }
  | { type: 'update'; section: ConfigSection; patch: Record<string, unknown>; summary: string }
  | { type: 'complete'; step: StepId }
  | { type: 'undo' }
  | { type: 'redo' }
  | { type: 'restoreSnapshot'; step: StepId; index: number }
  | { type: 'import'; state: WizardState }
  | { type: 'reset' };

const now = () => new Date().toISOString();
const MAX_HISTORY = 100;
const MAX_TIMELINE = 300;
const MERGE_WINDOW_MS = 1200;

function emptyStep(): StepState {
  return { status: 'not-started', visits: 0, edits: 0, snapshots: [] };
}

export function initialState(config: DesignSystemConfig = DEFAULT_CONFIG): WizardState {
  const at = now();
  const steps = Object.fromEntries(STEPS.map((s) => [s.id, emptyStep()])) as Record<StepId, StepState>;
  steps.identity = { ...steps.identity, status: 'in-progress', visits: 1, firstVisitedAt: at, lastVisitedAt: at };
  return {
    version: 1,
    createdAt: at,
    updatedAt: at,
    currentStep: 'identity',
    config,
    steps,
    timeline: [{ at, step: 'identity', kind: 'visit', summary: 'Started a new design system' }],
    past: [],
    future: [],
  };
}

const stepForSection = (section: ConfigSection): StepId => STEPS.find((s) => s.section === section)!.id;

function log(state: WizardState, entry: Omit<TimelineEntry, 'at'>): TimelineEntry[] {
  return [...state.timeline, { ...entry, at: now() }].slice(-MAX_TIMELINE);
}

/** Which section differs between two configs (for undo/redo bookkeeping). */
function changedSection(a: DesignSystemConfig, b: DesignSystemConfig): ConfigSection | undefined {
  return (['identity', 'colors', 'typography', 'shape', 'components', 'docs'] as ConfigSection[]).find(
    (s) => JSON.stringify(a[s]) !== JSON.stringify(b[s]),
  );
}

export function reducer(state: WizardState, action: Action): WizardState {
  const at = now();
  switch (action.type) {
    case 'goTo': {
      if (action.step === state.currentStep) return state;
      const prev = state.steps[action.step];
      return {
        ...state,
        updatedAt: at,
        currentStep: action.step,
        steps: {
          ...state.steps,
          [action.step]: {
            ...prev,
            status: prev.status === 'not-started' ? 'in-progress' : prev.status,
            visits: prev.visits + 1,
            firstVisitedAt: prev.firstVisitedAt ?? at,
            lastVisitedAt: at,
          },
        },
        timeline: log(state, { step: action.step, kind: 'visit', summary: `Opened ${STEPS.find((s) => s.id === action.step)!.title}` }),
        lastEdit: undefined,
      };
    }
    case 'update': {
      const step = stepForSection(action.section);
      const config = { ...state.config, [action.section]: { ...state.config[action.section], ...action.patch } } as DesignSystemConfig;
      const key = `${action.section}:${Object.keys(action.patch).sort().join(',')}`;
      const t = Date.now();
      const merge = state.lastEdit && state.lastEdit.key === key && t - state.lastEdit.at < MERGE_WINDOW_MS;
      const prevStep = state.steps[step];
      const timeline = merge
        ? [...state.timeline.slice(0, -1), { at, step, kind: 'edit' as const, summary: action.summary }]
        : log(state, { step, kind: 'edit', summary: action.summary });
      return {
        ...state,
        updatedAt: at,
        config,
        past: merge ? state.past : [...state.past, state.config].slice(-MAX_HISTORY),
        future: [],
        steps: {
          ...state.steps,
          [step]: {
            ...prevStep,
            edits: prevStep.edits + (merge ? 0 : 1),
            // Editing a completed step keeps it complete; validation decides if it needs attention.
            status: prevStep.status === 'not-started' ? 'in-progress' : prevStep.status,
          },
        },
        timeline,
        lastEdit: { key, at: t },
      };
    }
    case 'complete': {
      const def = STEPS.find((s) => s.id === action.step)!;
      const prev = state.steps[action.step];
      const snapshot = def.section ? [{ at, data: structuredClone(state.config[def.section]) }] : [];
      return {
        ...state,
        updatedAt: at,
        steps: {
          ...state.steps,
          [action.step]: { ...prev, status: 'complete', completedAt: at, snapshots: [...prev.snapshots, ...snapshot].slice(-20) },
        },
        timeline: log(state, { step: action.step, kind: 'complete', summary: `Completed ${def.title}` }),
        lastEdit: undefined,
      };
    }
    case 'undo': {
      const previous = state.past[state.past.length - 1];
      if (!previous) return state;
      const section = changedSection(previous, state.config);
      return {
        ...state,
        updatedAt: at,
        config: previous,
        past: state.past.slice(0, -1),
        future: [state.config, ...state.future].slice(0, MAX_HISTORY),
        timeline: log(state, { step: section ? stepForSection(section) : state.currentStep, kind: 'undo', summary: `Undid a change${section ? ` to ${section}` : ''}` }),
        lastEdit: undefined,
      };
    }
    case 'redo': {
      const next = state.future[0];
      if (!next) return state;
      const section = changedSection(state.config, next);
      return {
        ...state,
        updatedAt: at,
        config: next,
        past: [...state.past, state.config].slice(-MAX_HISTORY),
        future: state.future.slice(1),
        timeline: log(state, { step: section ? stepForSection(section) : state.currentStep, kind: 'redo', summary: `Redid a change${section ? ` to ${section}` : ''}` }),
        lastEdit: undefined,
      };
    }
    case 'restoreSnapshot': {
      const def = STEPS.find((s) => s.id === action.step)!;
      const snap = state.steps[action.step].snapshots[action.index];
      if (!def.section || !snap) return state;
      return {
        ...state,
        updatedAt: at,
        config: { ...state.config, [def.section]: structuredClone(snap.data) } as DesignSystemConfig,
        past: [...state.past, state.config].slice(-MAX_HISTORY),
        future: [],
        timeline: log(state, { step: action.step, kind: 'restore', summary: `Restored ${def.title} to the version completed ${new Date(snap.at).toLocaleTimeString()}` }),
        lastEdit: undefined,
      };
    }
    case 'import':
      return { ...action.state, timeline: log(action.state, { step: action.state.currentStep, kind: 'import', summary: 'Imported state from file' }) };
    case 'reset': {
      const fresh = initialState();
      return { ...fresh, timeline: [{ at, step: 'identity', kind: 'reset', summary: 'Reset to defaults' }] };
    }
  }
}

// ------------------------------------------------------------------ derived

export interface StepView {
  id: StepId;
  title: string;
  blurb: string;
  status: StepStatus;
  issues: ValidationIssue[];
  errors: number;
  warnings: number;
  /** Complete, but edited afterwards into an invalid state. */
  needsAttention: boolean;
  /** Edited since the last completion snapshot. */
  dirty: boolean;
}

export function stepViews(state: WizardState): StepView[] {
  return STEPS.map((def) => {
    const st = state.steps[def.id];
    const issues = def.section ? validateSection(state.config, def.section) : [];
    const errors = issues.filter((i) => i.severity === 'error').length;
    const last = st.snapshots[st.snapshots.length - 1];
    const dirty = Boolean(def.section && last && JSON.stringify(last.data) !== JSON.stringify(state.config[def.section]));
    return {
      id: def.id,
      title: def.title,
      blurb: def.blurb,
      status: st.status,
      issues,
      errors,
      warnings: issues.length - errors,
      needsAttention: st.status === 'complete' && errors > 0,
      dirty,
    };
  });
}

// ------------------------------------------------------------------ persistence

const STORAGE_KEY = 'dsg:wizard-state:v1';

export function loadState(): WizardState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return parseState(JSON.parse(raw));
  } catch {
    /* corrupt or unavailable storage → start fresh */
  }
  return initialState();
}

export function saveState(state: WizardState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* storage full or unavailable */
  }
}

/** Accept a full wizard state export or a bare config file. */
export function parseState(input: unknown): WizardState {
  const obj = input as Partial<WizardState> & Partial<DesignSystemConfig>;
  if (obj && obj.version === 1 && obj.config && obj.steps) {
    const base = initialState(normalizeConfig(obj.config));
    return {
      ...base,
      ...obj,
      config: normalizeConfig(obj.config),
      steps: { ...base.steps, ...obj.steps },
      past: obj.past ?? [],
      future: obj.future ?? [],
      timeline: obj.timeline ?? [],
    } as WizardState;
  }
  if (obj && (obj.identity || obj.colors)) return initialState(normalizeConfig(obj));
  throw new Error('Not a wizard state or design system config file.');
}
