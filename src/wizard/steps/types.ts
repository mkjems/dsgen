import type { ConfigSection, DesignSystemConfig } from '../../core/config';
import type { ValidationIssue } from '../../core/defaults';

export interface StepProps {
  config: DesignSystemConfig;
  issues: ValidationIssue[];
  update: (section: ConfigSection, patch: Record<string, unknown>, summary: string) => void;
}

export const issuesFor = (issues: ValidationIssue[], field: string) => issues.filter((i) => i.field === field);
