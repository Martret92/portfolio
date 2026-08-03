import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/en/projects/devdata-generator');
});

test('allows multiple native decision disclosures to remain open', async ({
  page,
}) => {
  const first = page.locator('#temporary-decision-boundary');
  const second = page.locator('#temporary-decision-alternative');
  const firstSummary = first.locator('summary');
  const secondSummary = second.locator('summary');

  await expect(first).not.toHaveAttribute('open', '');
  await expect(second).not.toHaveAttribute('open', '');

  await firstSummary.click();
  await expect(first).toHaveAttribute('open', '');

  await secondSummary.click();
  await expect(first).toHaveAttribute('open', '');
  await expect(second).toHaveAttribute('open', '');

  await firstSummary.click();
  await expect(first).not.toHaveAttribute('open', '');
  await expect(second).toHaveAttribute('open', '');
});

test('native disclosure supports keyboard activation', async ({ page }) => {
  const decision = page.locator('#temporary-decision-boundary');
  const summary = decision.locator('summary');

  await summary.focus();
  await page.keyboard.press('Enter');
  await expect(decision).toHaveAttribute('open', '');
});
