export type FormPayload = Record<string, string>;

export async function submitForm(endpoint: string, payload: FormPayload): Promise<void> {
  if (!endpoint) {
    throw new Error('FORM_ENDPOINT_NOT_CONFIGURED');
  }
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    throw new Error('FORM_SUBMISSION_FAILED');
  }
}