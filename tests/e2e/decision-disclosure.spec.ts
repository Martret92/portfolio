import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/en/projects/devdata-generator');
  await page.getByRole('button', { name: 'System', exact: true }).click();
});

test('keeps verified native decisions independently operable', async ({
  page,
}) => {
  const first = page.locator('#single-generated-result');
  const second = page.locator('#invalidate-stale-result');
  await expect(first).not.toHaveAttribute('open', '');
  await first.locator('summary').click();
  await second.locator('summary').click();
  await expect(first).toHaveAttribute('open', '');
  await expect(second).toHaveAttribute('open', '');
  await first.locator('summary').click();
  await expect(first).not.toHaveAttribute('open', '');
  await expect(second).toHaveAttribute('open', '');
});

test('native disclosure supports keyboard activation', async ({ page }) => {
  const decision = page.locator('#single-generated-result');
  await decision.locator('summary').focus();
  await page.keyboard.press('Enter');
  await expect(decision).toHaveAttribute('open', '');
});
