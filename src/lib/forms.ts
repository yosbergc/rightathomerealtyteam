export type FormPayload = Record<string, string>;

export async function submitForm(endpoint: string, payload: FormPayload, accessKey?: string): Promise<void> {
  if (!endpoint) {
    throw new Error('FORM_ENDPOINT_NOT_CONFIGURED');
  }
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ access_key: accessKey ?? '', ...payload }),
  });
  const result: { success?: boolean } | null = await response.json().catch(() => null);
  if (!response.ok || result?.success === false) {
    throw new Error('FORM_SUBMISSION_FAILED');
  }
}