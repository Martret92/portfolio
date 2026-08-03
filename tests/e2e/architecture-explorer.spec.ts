import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/en/projects/devdata-generator');
});

test('selects nodes while retaining all architecture information', async ({
  page,
}) => {
  const interfaceNode = page.getByRole('button', {
    name: 'Placeholder layer Interface',
  });
  const applicationNode = page.getByRole('button', {
    name: 'Placeholder layer Application',
  });
  const dataNode = page.getByRole('button', {
    name: 'Placeholder layer Data',
  });

  await expect(interfaceNode).toHaveAttribute('aria-pressed', 'true');

  await applicationNode.click();
  await expect(applicationNode).toHaveAttribute('aria-pressed', 'true');
  await expect(
    page.getByRole('heading', { level: 4, name: 'Application' }),
  ).toBeVisible();

  await dataNode.click();
  await expect(dataNode).toHaveAttribute('aria-pressed', 'true');
  await expect(
    page.getByRole('heading', { level: 4, name: 'Data' }),
  ).toBeVisible();

  for (const description of [
    'Temporary placeholder for an entry point in a generic system.',
    'Temporary placeholder for a generic application component.',
    'Temporary placeholder for a generic data component.',
  ]) {
    await expect(page.getByText(description, { exact: true })).not.toHaveCount(
      0,
    );
  }

  await expect(
    page.getByRole('heading', { level: 4, name: 'Temporary connections' }),
  ).toBeVisible();
  await expect(page.getByText('Temporary structural connection')).toHaveCount(
    2,
  );
});

test('architecture nodes support keyboard activation', async ({ page }) => {
  const applicationNode = page.getByRole('button', {
    name: 'Placeholder layer Application',
  });

  await applicationNode.focus();
  await page.keyboard.press('Enter');
  await expect(applicationNode).toHaveAttribute('aria-pressed', 'true');
  await expect(
    page.getByRole('heading', { level: 4, name: 'Application' }),
  ).toBeVisible();
});
