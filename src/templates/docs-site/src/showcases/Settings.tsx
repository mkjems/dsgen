import { useState } from 'react';
import {
  Button, Card, CardDescription, CardFooter, CardHeader, CardTitle, Dialog, RadioGroup, Select, Stack, Switch,
  Tab, TabList, TabPanel, Tabs, Text,
} from '@lib';

/** A settings screen with tabs, toggles and a destructive confirmation. */
export default function Settings() {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleted, setDeleted] = useState(false);

  const notifications = (
    <Card>
      <CardHeader>
        <CardTitle>Notifications</CardTitle>
        <CardDescription>Choose what we email you about.</CardDescription>
      </CardHeader>
      <Stack gap={4}>
        <Switch label="Product updates" description="New features and improvements." labelPosition="start" defaultChecked />
        <Switch label="Security alerts" description="Sign-ins from new devices." labelPosition="start" defaultChecked />
        <Switch label="Weekly summary" description="A digest of your team's activity." labelPosition="start" />
        <RadioGroup label="Digest frequency" orientation="horizontal" defaultValue="weekly"
          options={[{ value: 'daily', label: 'Daily' }, { value: 'weekly', label: 'Weekly' }, { value: 'monthly', label: 'Monthly' }]} />
      </Stack>
    </Card>
  );

  const preferences = (
    <Card>
      <CardHeader>
        <CardTitle>Preferences</CardTitle>
      </CardHeader>
      <Stack gap={4}>
        <Select label="Language" defaultValue="en" options={[{ value: 'en', label: 'English' }, { value: 'da', label: 'Dansk' }, { value: 'de', label: 'Deutsch' }]} />
        <Select label="Time zone" defaultValue="cet" hint="Used for reminders and reports."
          options={[{ value: 'utc', label: 'UTC' }, { value: 'cet', label: 'Central European Time' }, { value: 'pst', label: 'Pacific Time' }]} />
      </Stack>
      <CardFooter>
        <Button>Save preferences</Button>
      </CardFooter>
    </Card>
  );

  const danger = (
    <Card>
      <CardHeader>
        <CardTitle>Delete workspace</CardTitle>
        <CardDescription>Permanently remove this workspace and all of its data.</CardDescription>
      </CardHeader>
      {deleted ? (
        <Text tone="danger">Workspace scheduled for deletion. (Demo — nothing was deleted.)</Text>
      ) : (
        <Stack direction="row">
          <Button variant="danger" onClick={() => setConfirmOpen(true)}>Delete workspace</Button>
        </Stack>
      )}
    </Card>
  );

  return (
    <Stack gap={5} style={{ maxWidth: 720, margin: '0 auto' }}>
      <Stack gap={1}>
        <Text variant="h3">Settings</Text>
        <Text tone="muted">Manage your workspace preferences.</Text>
      </Stack>
      <Tabs>
        <TabList aria-label="Settings sections">
          <Tab value="notifications">Notifications</Tab>
          <Tab value="preferences">Preferences</Tab>
          <Tab value="danger">Danger zone</Tab>
        </TabList>
        <TabPanel value="notifications">{notifications}</TabPanel>
        <TabPanel value="preferences">{preferences}</TabPanel>
        <TabPanel value="danger">{danger}</TabPanel>
      </Tabs>
      <Dialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        size="sm"
        title="Delete workspace?"
        description="All projects, files and members will be removed. This cannot be undone."
        footer={<>
          <Button variant="outline" onClick={() => setConfirmOpen(false)}>Cancel</Button>
          <Button variant="danger" onClick={() => { setDeleted(true); setConfirmOpen(false); }}>Delete</Button>
        </>}
      />
    </Stack>
  );
}
