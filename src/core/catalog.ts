/** Registry of all component templates and their documentation metadata. */
import type { ComponentMeta } from './meta';
import { meta as Button } from '../templates/library/src/components/Button/meta';
import { meta as TextField } from '../templates/library/src/components/TextField/meta';
import { meta as Select } from '../templates/library/src/components/Select/meta';
import { meta as Checkbox } from '../templates/library/src/components/Checkbox/meta';
import { meta as Switch } from '../templates/library/src/components/Switch/meta';
import { meta as RadioGroup } from '../templates/library/src/components/RadioGroup/meta';
import { meta as Badge } from '../templates/library/src/components/Badge/meta';
import { meta as Card } from '../templates/library/src/components/Card/meta';
import { meta as Alert } from '../templates/library/src/components/Alert/meta';
import { meta as Avatar } from '../templates/library/src/components/Avatar/meta';
import { meta as Tabs } from '../templates/library/src/components/Tabs/meta';
import { meta as Dialog } from '../templates/library/src/components/Dialog/meta';
import { meta as Tooltip } from '../templates/library/src/components/Tooltip/meta';
import { meta as Spinner } from '../templates/library/src/components/Spinner/meta';
import { meta as Stack } from '../templates/library/src/components/Stack/meta';
import { meta as Text } from '../templates/library/src/components/Text/meta';

export const CATALOG: ComponentMeta[] = [Stack, Text, Button, TextField, Select, Checkbox, Switch, RadioGroup, Badge, Card, Alert, Avatar, Tabs, Dialog, Tooltip, Spinner];

export const CATALOG_BY_NAME: Record<string, ComponentMeta> = Object.fromEntries(CATALOG.map((m) => [m.name, m]));

export const FOUNDATION_COMPONENTS = CATALOG.filter((m) => m.foundation).map((m) => m.name);

/** Selected components plus foundations, in catalog order. */
export function resolveComponents(selected: string[]): ComponentMeta[] {
  const set = new Set([...selected, ...FOUNDATION_COMPONENTS]);
  return CATALOG.filter((m) => set.has(m.name));
}
