import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/en/projects/devdata-generator');
});

test('switches perspectives without removing either section', async ({
  page,
}) => {
  const product = page.getByRole('button', { name: 'Product view' });
  const system = page.getByRole('button', { name: 'System view' });
  const productSection = page.getByRole('region', { name: 'Product view' });
  const systemSection = page.getByRole('region', { name: 'System view' });

  await expect(product).toHaveAttribute('aria-pressed', 'true');
  await expect(system).toHaveAttribute('aria-pressed', 'false');
  await expect(productSection).toBeVisible();
  await expect(systemSection).toBeVisible();

  await system.click();
  await expect(system).toHaveAttribute('aria-pressed', 'true');
  await expect(product).toHaveAttribute('aria-pressed', 'false');
  await expect(productSection).toBeVisible();
  await expect(systemSection).toBeVisible();

  await product.click();
  await expect(product).toHaveAttribute('aria-pressed', 'true');
  await expect(system).toHaveAttribute('aria-pressed', 'false');
});

test('mode controls support keyboard activation', async ({ page }) => {
  const product = page.getByRole('button', { name: 'Product view' });
  const system = page.getByRole('button', { name: 'System view' });

  await system.focus();
  await page.keyboard.press('Enter');
  await expect(system).toHaveAttribute('aria-pressed', 'true');

  await product.focus();
  await page.keyboard.press('Space');
  await expect(product).toHaveAttribute('aria-pressed', 'true');
});
