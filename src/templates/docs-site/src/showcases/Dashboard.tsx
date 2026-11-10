import { useEffect, useState } from 'react';
import { Avatar, Badge, Button, Card, Spinner, Stack, Text, Tooltip } from '@lib';

const MEMBERS = [
  { name: 'Ada Lovelace', role: 'Engineering lead', status: 'online' as const, tasks: 12 },
  { name: 'Grace Hopper', role: 'Platform', status: 'busy' as const, tasks: 8 },
  { name: 'Alan Turing', role: 'Research', status: 'away' as const, tasks: 5 },
  { name: 'Katherine Johnson', role: 'Data science', status: 'offline' as const, tasks: 3 },
];

const SERVICES = [
  { name: 'API', state: 'Operational', tone: 'success' as const },
  { name: 'Web app', state: 'Operational', tone: 'success' as const },
  { name: 'Background jobs', state: 'Degraded', tone: 'warning' as const },
  { name: 'Search', state: 'Outage', tone: 'danger' as const },
];

/** A team overview composed from cards, badges, avatars and tooltips. */
export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 900);
    return () => clearTimeout(t);
  }, []);

  return (
    <Stack gap={5}>
      <Stack direction="row" justify="between" wrap gap={3}>
        <Stack gap={1}>
          <Text variant="h3">Team overview</Text>
          <Text tone="muted">Sprint 24 · 6 days remaining</Text>
        </Stack>
        <Button startIcon={<span>＋</span>}>New task</Button>
      </Stack>

      <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}>
        {[['Open tasks', '28', '+4 this week'], ['Completed', '112', '87% on time'], ['Cycle time', '2.4d', '−0.3d vs last sprint']].map(([label, value, note]) => (
          <Card key={label} variant="elevated">
            <Stack gap={1}>
              <Text variant="small" tone="muted">{label}</Text>
              <Text variant="h2">{value}</Text>
              <Text variant="caption">{note}</Text>
            </Stack>
          </Card>
        ))}
      </div>

      <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
        <Card title="Members" description="Who is working on what" actions={<Button size="sm" variant="ghost">Invite</Button>}>
          {loading ? (
            <Stack direction="row" gap={2}><Spinner size="sm" label="Loading members" /><Text tone="muted">Loading members…</Text></Stack>
          ) : (
            <Stack gap={3}>
              {MEMBERS.map((m) => (
                <Stack key={m.name} direction="row" justify="between">
                  <Stack direction="row" gap={3}>
                    <Avatar name={m.name} status={m.status} size="sm" />
                    <Stack gap={0}>
                      <Text weight="medium">{m.name}</Text>
                      <Text variant="small" tone="muted">{m.role}</Text>
                    </Stack>
                  </Stack>
                  <Tooltip content={`${m.tasks} open tasks`}>
                    <Button size="sm" variant="ghost" aria-label={`${m.name}: ${m.tasks} tasks`}>{m.tasks}</Button>
                  </Tooltip>
                </Stack>
              ))}
            </Stack>
          )}
        </Card>

        <Card title="Service status" description="Updated a minute ago">
          <Stack gap={3}>
            {SERVICES.map((s) => (
              <Stack key={s.name} direction="row" justify="between">
                <Text>{s.name}</Text>
                <Badge tone={s.tone} dot>{s.state}</Badge>
              </Stack>
            ))}
          </Stack>
        </Card>
      </div>
    </Stack>
  );
}
