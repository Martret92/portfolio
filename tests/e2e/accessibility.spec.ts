import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';

const routes = [
  '/en',
  '/es',
  '/en/projects/devdata-generator',
  '/es/projects/devdata-generator',
] as const;

async function expectNoAxeViolations(page: Page) {
  const results = await new AxeBuilder({ page }).analyze();

  expect(results.violations).toEqual([]);
}

for (const route of routes) {
  test(`${route} has no automated accessibility violations`, async ({
    page,
  }) => {
    await page.goto(route);
    await expectNoAxeViolations(page);
  });
}

test('enhanced project interaction state has no axe violations', async ({
  page,
}) => {
  await page.goto('/en/projects/devdata-generator');
  await page.getByRole('button', { name: 'System', exact: true }).click();
  await page.getByRole('button', { name: /generatedData/ }).click();
  await page.locator('#single-generated-result > summary').click();

  await expectNoAxeViolations(page);
});

test('project content remains usable without JavaScript', async ({
  browser,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();

  await page.goto('/en/projects/devdata-generator');

  await expect(page.locator('[data-inspection-enhanced]')).toBeHidden();
  const fallback = page.locator('[data-inspection-fallback]');
  await expect(
    fallback.getByRole('heading', { name: 'How the product works' }),
  ).toBeVisible();
  await expect(
    fallback.getByRole('heading', { name: 'How the same flow is structured' }),
  ).toBeVisible();
  await expect(fallback.getByRole('button')).toHaveCount(0);
  await expect(
    fallback.getByRole('heading', { name: 'generatedData' }),
  ).toBeVisible();
  await expect(
    fallback.getByText(
      'All visible and downloadable outputs represent the same generation.',
    ),
  ).toBeVisible();
  await expect(
    fallback.getByRole('heading', { name: 'System flow' }),
  ).toBeVisible();
  await expect(
    fallback
      .getByRole('listitem')
      .filter({ hasText: 'Configuration state→Validation' }),
  ).toBeVisible();
  await expect(
    fallback.getByText(/Configuration state.*Invalidates/),
  ).toBeVisible();

  const decision = page.locator('#static-single-generated-result');
  await decision.locator('summary').click();
  await expect(decision).toHaveAttribute('open', '');
  await expect(
    decision.getByText(
      'Generate once, store the result in generatedData, and let downstream consumers reuse it.',
      { exact: true },
    ),
  ).toBeVisible();

  await context.close();
});
