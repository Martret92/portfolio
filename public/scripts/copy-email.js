/* global document, HTMLElement, HTMLButtonElement, window */

document.querySelectorAll('[data-copy-email-root]').forEach((root) => {
  if (!(root instanceof HTMLElement)) return;

  const button = root.querySelector('[data-copy-email]');
  const status = root.querySelector('[data-copy-email-status]');
  let resetTimer;

  if (
    !(button instanceof HTMLButtonElement) ||
    !(status instanceof HTMLElement)
  ) {
    return;
  }

  if (!navigator.clipboard) return;
  root.setAttribute('data-copy-email-ready', '');

  button.addEventListener('click', async () => {
    const email = button.dataset.email;
    const successLabel = button.dataset.successLabel;
    const defaultLabel = button.dataset.defaultLabel;

    if (!email || !successLabel || !defaultLabel) return;

    try {
      await navigator.clipboard.writeText(email);
      window.clearTimeout(resetTimer);
      button.textContent = successLabel;
      status.textContent = successLabel;
      resetTimer = window.setTimeout(() => {
        button.textContent = defaultLabel;
        status.textContent = '';
      }, 2400);
    } catch {
      // The visible mailto link remains the no-JS and denied-permission fallback.
    }
  });
});
