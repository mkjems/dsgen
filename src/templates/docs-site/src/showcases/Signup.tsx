import { useState, type FormEvent } from 'react';
import { Alert, Button, Card, Checkbox, Stack, Text, TextField } from '@lib';

/** Account creation flow: validation, error summary and a success state. */
export default function Signup() {
  const [values, setValues] = useState({ name: '', email: '', password: '', terms: false });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!values.name.trim()) e.name = 'Enter your full name.';
    if (!/^\S+@\S+\.\S+$/.test(values.email)) e.email = 'Enter a valid email address, like name@company.com.';
    if (values.password.length < 8) e.password = 'Use at least 8 characters.';
    if (!values.terms) e.terms = 'You need to accept the terms to create an account.';
    return e;
  };

  const onSubmit = (ev: FormEvent) => {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) return;
    setSubmitting(true);
    setTimeout(() => { setSubmitting(false); setDone(true); }, 1200);
  };

  if (done) {
    return (
      <Card variant="elevated" padding="lg" style={{ maxWidth: 440, margin: '0 auto' }}>
        <Stack gap={4}>
          <Alert tone="success" title="Account created">We sent a confirmation link to {values.email}.</Alert>
          <Button variant="outline" onClick={() => { setDone(false); setValues({ name: '', email: '', password: '', terms: false }); }}>
            Start over
          </Button>
        </Stack>
      </Card>
    );
  }

  const errorCount = Object.keys(errors).length;
  return (
    <Card variant="elevated" padding="lg" style={{ maxWidth: 440, margin: '0 auto' }}>
      <Stack as="form" gap={5} onSubmit={onSubmit} noValidate>
        <Stack gap={1}>
          <Text variant="h3">Create your account</Text>
          <Text tone="muted">Start your 14-day free trial. No credit card required.</Text>
        </Stack>
        {errorCount > 0 && (
          <Alert tone="danger" title={`Please fix ${errorCount} ${errorCount === 1 ? 'problem' : 'problems'}`}>
            Check the highlighted fields below.
          </Alert>
        )}
        <TextField label="Full name" autoComplete="name" value={values.name} error={errors.name}
          onChange={(e) => setValues({ ...values, name: e.target.value })} />
        <TextField label="Work email" type="email" autoComplete="email" value={values.email} error={errors.email}
          onChange={(e) => setValues({ ...values, email: e.target.value })} />
        <TextField label="Password" type="password" autoComplete="new-password" value={values.password}
          error={errors.password} hint="At least 8 characters."
          onChange={(e) => setValues({ ...values, password: e.target.value })} />
        <Checkbox label="I agree to the Terms of Service and Privacy Policy" checked={values.terms} error={errors.terms}
          onChange={(e) => setValues({ ...values, terms: e.target.checked })} />
        <Button type="submit" fullWidth size="lg" loading={submitting}>Create account</Button>
        <Text variant="small" tone="muted" align="center">Already have an account? Sign in</Text>
      </Stack>
    </Card>
  );
}
