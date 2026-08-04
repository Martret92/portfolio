import { expect, test, type Page } from '@playwright/test';

async function openSystem(page: Page) {
  await page.goto('/en/projects/devdata-generator');
  await page.getByRole('button', { name: 'System', exact: true }).click();
}

function desktopInspector(page: Page) {
  return page.locator('.inspection-inspector--desktop');
}

test('traces generatedData through Export and Output serializers', async ({
  page,
}) => {
  await openSystem(page);

  const result = page.getByRole('button', { name: /generatedData/ });
  await expect(
    page.locator('[data-system-node][aria-pressed="true"]'),
  ).toHaveCount(0);
  await result.click();
  await expect(result).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('[data-node-state="connected"]')).toHaveCount(4);
  await expect(page.locator('[data-system-node]')).toHaveCount(9);

  await desktopInspector(page)
    .getByRole('button', { name: /Export/ })
    .click();
  const exportNode = page.locator('[data-system-node="export"]');
  await expect(exportNode).toHaveAttribute('aria-pressed', 'true');
  await expect(exportNode).toBeFocused();
  await expect(desktopInspector(page)).toContainText('Export');

  await desktopInspector(page)
    .getByRole('button', { name: /Output serializers/ })
    .click();
  const serializers = page.locator('[data-system-node="serializers"]');
  await expect(serializers).toHaveAttribute('aria-pressed', 'true');
  await expect(serializers).toBeFocused();
  await expect(
    page.locator(
      '.inspection-inspector--desktop [data-inspector-node="serializers"]',
    ),
  ).toContainText(
    'JSON preview, copy and download reuse the same JSON serializer.',
  );
});

test('traces generatedData to generateData and its Faker dependency', async ({
  page,
}) => {
  await openSystem(page);
  await page.getByRole('button', { name: /generatedData/ }).click();
  await desktopInspector(page)
    .getByRole('button', { name: /generateData/ })
    .click();
  await expect(
    page.locator('[data-system-node="generate-data"]'),
  ).toBeFocused();
  await expect(desktopInspector(page).getByText('Depends on')).toBeVisible();

  await desktopInspector(page).getByRole('button', { name: /Faker/ }).click();
  const faker = page.locator('[data-system-node="faker"]');
  await expect(faker).toHaveAttribute('aria-pressed', 'true');
  await expect(faker).toBeFocused();
});

test('traces generatedData to its configuration invalidation source', async ({
  page,
}) => {
  await openSystem(page);
  await page.getByRole('button', { name: /generatedData/ }).click();
  await expect(
    desktopInspector(page).getByText('Invalidated by'),
  ).toBeVisible();
  await desktopInspector(page)
    .getByRole('button', { name: /Configuration state/ })
    .click();
  const configuration = page.locator(
    '[data-system-node="configuration-state"]',
  );
  await expect(configuration).toHaveAttribute('aria-pressed', 'true');
  await expect(configuration).toBeFocused();
  await expect(desktopInspector(page).getByText('Invalidates')).toBeVisible();
});
