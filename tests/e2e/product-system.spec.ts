import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/en/projects/devdata-generator');
});

test('opens the same project flow and resets inspection on Product', async ({
  page,
}) => {
  const product = page.getByRole('button', { name: 'Product', exact: true });
  const system = page.getByRole('button', { name: 'System', exact: true });
  const groups = page.locator('[data-product-group]');

  await expect(product).toHaveAttribute('aria-pressed', 'true');
  await expect(groups).toHaveCount(5);
  await expect(
    page.getByRole('heading', { name: 'How the product works' }),
  ).toBeVisible();
  await system.click();
  await expect(groups).toHaveCount(5);
  await expect(
    page.locator('[data-product-group="generate"] [data-system-node]'),
  ).toHaveCount(3);
  await expect(
    page.locator('[data-product-group="export"] [data-system-node]'),
  ).toHaveCount(3);
  await expect(system).toHaveAttribute('aria-pressed', 'true');
  await expect(
    page.getByText('Select a node to inspect its role and relationships.'),
  ).toBeVisible();

  await page.getByRole('button', { name: /generatedData/ }).click();
  await expect(
    page.locator(
      '.inspection-inspector--desktop [data-inspector-node="generated-data"]',
    ),
  ).toContainText(
    'All visible and downloadable outputs represent the same generation.',
  );
  await product.click();
  await system.click();
  await expect(
    page.getByText('Select a node to inspect its role and relationships.'),
  ).toBeVisible();
});

test('perspective and node controls support keyboard activation', async ({
  page,
}) => {
  const system = page.getByRole('button', { name: 'System', exact: true });
  await system.focus();
  await page.keyboard.press('Enter');
  const result = page.getByRole('button', { name: /generatedData/ });
  await result.focus();
  await page.keyboard.press('Space');
  await expect(result).toHaveAttribute('aria-pressed', 'true');
  await expect(result).toBeFocused();
});

test('remains usable at a narrow mobile viewport', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.getByRole('button', { name: 'System', exact: true }).click();
  await page.getByRole('button', { name: /generatedData/ }).click();
  await expect(
    page.locator(
      '[data-product-group="result"] .inspection-inspector--mobile [data-inspector-node="generated-data"]',
    ),
  ).toBeVisible();
  await expect(page.locator('[data-product-group="result"]')).toHaveAttribute(
    'data-contains-selection',
    'true',
  );
  await page
    .locator('[data-product-group="result"] .inspection-inspector--mobile')
    .getByRole('button', { name: /Export/ })
    .click();
  await expect(page.locator('[data-system-node="export"]')).toBeFocused();
  await expect(page.locator('[data-product-group="export"]')).toHaveAttribute(
    'data-contains-selection',
    'true',
  );
  await expect(
    page.locator(
      '[data-product-group="export"] .inspection-inspector--mobile [data-inspector-node="export"]',
    ),
  ).toBeVisible();
  const overflow = await page.evaluate(
    () =>
      document.documentElement.scrollWidth >
      document.documentElement.clientWidth,
  );
  expect(overflow).toBe(false);
});
