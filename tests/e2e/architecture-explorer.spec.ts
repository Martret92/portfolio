import { expect, test } from '@playwright/test';

test('derives selected and connected System state without removing nodes', async ({
  page,
}) => {
  await page.goto('/en/projects/devdata-generator');
  await page.getByRole('button', { name: 'System', exact: true }).click();

  const result = page.getByRole('button', { name: /generatedData/ });
  await expect(
    page.locator('[data-system-node][aria-pressed="true"]'),
  ).toHaveCount(0);
  await result.click();
  await expect(result).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('[data-node-state="connected"]')).toHaveCount(4);
  await expect(page.locator('[data-system-node]')).toHaveCount(9);

  await page.getByRole('button', { name: /Output serializers/ }).click();
  await expect(
    page.locator(
      '.inspection-inspector--desktop [data-inspector-node="serializers"]',
    ),
  ).toContainText(
    'JSON preview, copy and download reuse the same JSON serializer.',
  );
});
