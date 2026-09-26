import { submitForm } from '../lib/forms';

const forms = document.querySelectorAll<HTMLFormElement>('[data-form]');

forms.forEach((form) => {
  const endpoint = form.dataset.endpoint ?? '';
  const submitButton = form.querySelector<HTMLButtonElement>('[data-submit]');
  const submitLabel = form.querySelector<HTMLElement>('[data-submit-label]');
  const status = form.parentElement?.querySelector<HTMLElement>('[data-form-status]');
  const successBlock = status?.querySelector<HTMLElement>('[data-status-success]');
  const errorBlock = status?.querySelector<HTMLElement>('[data-status-error]');

  const showStatus = (block: HTMLElement | null | undefined) => {
    successBlock?.classList.add('hidden');
    errorBlock?.classList.add('hidden');
    block?.classList.remove('hidden');
  };

  const setErrors = (errors: Map<string, string>) => {
    form.querySelectorAll<HTMLElement>('[data-error]').forEach((error) => {
      error.textContent = '';
    });
    errors.forEach((message, name) => {
      const field = form.querySelector<HTMLInputElement>(`[name="${name}"]`);
      const error = field?.parentElement?.querySelector<HTMLElement>('[data-error]');
      if (error) error.textContent = message;
    });
  };

  const validate = (): Map<string, string> => {
    const errors = new Map<string, string>();
    form.querySelectorAll<HTMLInputElement>('[data-required]').forEach((field) => {
      if (!field.value.trim()) {
        errors.set(field.name, field.dataset.msgRequired ?? '');
      }
    });
    form.querySelectorAll<HTMLInputElement>('[data-type="email"]').forEach((field) => {
      const value = field.value.trim();
      if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        errors.set(field.name, field.dataset.msgEmail ?? '');
      }
    });
    return errors;
  };

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const errors = validate();
    if (errors.size > 0) {
      setErrors(errors);
      return;
    }
    setErrors(new Map());
    showStatus(null);
    const originalLabel = submitLabel?.textContent ?? '';
    if (submitButton) submitButton.disabled = true;
    if (submitLabel) submitLabel.textContent = form.dataset.sending ?? '...';

    const honeypotFilled = Array.from(form.querySelectorAll<HTMLInputElement>('input[name]')).some(
      (input) => input.className.includes('opacity-0') && input.value,
    );

    if (honeypotFilled) {
      showStatus(successBlock);
    } else {
      const payload: Record<string, string> = {};
      form.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>('input[name], textarea[name]').forEach((field) => {
        payload[field.name] = field.value;
      });
      try {
        await submitForm(endpoint, payload);
        form.reset();
        showStatus(successBlock);
      } catch {
        showStatus(errorBlock);
      }
    }

    if (submitButton) submitButton.disabled = false;
    if (submitLabel) submitLabel.textContent = originalLabel;
  });
});