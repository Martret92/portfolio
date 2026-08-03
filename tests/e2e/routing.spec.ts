import { expect, test } from '@playwright/test';

const routes = [
  { path: '/en', heading: 'Software work, presented with clarity.' },
  { path: '/es', heading: 'Trabajo de software presentado con claridad.' },
  {
    path: '/en/projects/devdata-generator',
    heading: 'DevData Generator placeholder',
  },
  {
    path: '/es/projects/devdata-generator',
    heading: 'Marcador temporal de DevData Generator',
  },
] as const;

for (const route of routes) {
  test(`${route.path} renders successfully`, async ({ page }) => {
    const response = await page.goto(route.path);

    expect(response?.ok()).toBe(true);
    await expect(
      page.getByRole('heading', { level: 1, name: route.heading }),
    ).toBeVisible();
  });
}

test('Home and project navigation form a complete localized flow', async ({
  page,
}) => {
  await page.goto('/en');
  await page
    .getByRole('link', { name: 'View DevData Generator project route' })
    .click();
  await expect(page).toHaveURL(/\/en\/projects\/devdata-generator\/?$/);

  await page.getByRole('link', { name: 'Back to Home' }).click();
  await expect(page).toHaveURL(/\/en\/?$/);
});

test('language switching preserves the project route', async ({ page }) => {
  await page.goto('/en/projects/devdata-generator');
  await page.getByRole('link', { name: 'Español' }).click();
  await expect(page).toHaveURL(/\/es\/projects\/devdata-generator\/?$/);

  await page.getByRole('link', { name: 'English' }).click();
  await expect(page).toHaveURL(/\/en\/projects\/devdata-generator\/?$/);
});
