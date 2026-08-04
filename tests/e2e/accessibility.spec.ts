import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';

const routes = [
  '/en',
  '/es',
  '/en/projects/devdata-generator',
  '/es/projects/devdata-generator',
  '/en/projects/duckyarena',
  '/es/projects/duckyarena',
  '/404',
] as const;

test('localized pages provide a keyboard bypass link', async ({ page }) => {
  await page.goto('/en');
  const skipLink = page.getByRole('link', { name: 'Skip to main content' });

  await page.keyboard.press('Tab');
  await expect(skipLink).toBeFocused();
  await expect(skipLink).toBeVisible();
  await page.keyboard.press('Enter');
  await expect(page.locator('#main-content')).toBeFocused();
});

test('Home remains complete without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();

  await page.goto('/en');
  const preview = page.locator('[data-home-project-preview]');
  await expect(preview.getByRole('img')).toBeVisible();
  await expect(
    preview.getByRole('list', { name: 'DevData system flow' }),
  ).toBeAttached();
  await expect(
    preview.getByRole('link', { name: /Inspect the case study/ }),
  ).toHaveAttribute('href', '/en/projects/devdata-generator');
  await expect(page.getByRole('heading', { name: 'About' })).toBeVisible();
  await expect(
    page.getByRole('heading', { name: 'Technical capabilities' }),
  ).toBeVisible();
  await expect(
    page.getByRole('heading', { name: 'Previous professional experience' }),
  ).toBeVisible();
  await expect(
    page.getByRole('heading', { name: 'Education and certification' }),
  ).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Contact' })).toBeVisible();
  await expect(
    page.getByRole('link', { name: 'jaime.martret@gmail.com' }),
  ).toHaveAttribute('href', 'mailto:jaime.martret@gmail.com');
  await expect(page.getByRole('link', { name: 'Download CV' })).toHaveAttribute(
    'href',
    '/jaime-martret-full-stack-cv.pdf',
  );
  await expect(page.getByRole('link', { name: 'Español' })).toHaveAttribute(
    'href',
    '/es',
  );

  await context.close();
});

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

test('Spanish relationship navigation state has no axe violations', async ({
  page,
}) => {
  await page.goto('/es/projects/devdata-generator');
  await page.getByRole('button', { name: 'Sistema', exact: true }).click();
  await page.getByRole('button', { name: /generatedData/ }).click();
  await page
    .locator('.inspection-inspector--desktop')
    .getByRole('button', { name: /Exportación/ })
    .click();

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
  const fallbackProductVisual = fallback.locator('[data-product-visual] img');
  await expect(fallbackProductVisual).toBeVisible();
  await expect(fallbackProductVisual).toHaveAttribute('alt', /Users template/);
  await expect(
    fallback.getByRole('heading', { name: 'How the same flow is structured' }),
  ).toBeVisible();
  await expect(fallback.getByRole('button')).toHaveCount(0);
  await expect(fallback.locator('[data-evidence-artifact]')).toHaveCount(3);
  await expect(fallback.getByText('src/utils/generateData.js')).toBeVisible();
  await expect(fallback.getByText('src/App.jsx')).toBeVisible();
  const fallbackSource = fallback.locator(
    '[data-evidence-artifact="generation-boundary"]',
  );
  await expect(fallbackSource).not.toHaveAttribute('open', '');
  await fallbackSource.locator('summary').click();
  await expect(fallbackSource).toHaveAttribute('open', '');
  await expect(fallbackSource.getByText(/fakerES as faker/)).toBeVisible();
  const fallbackOutput = fallback.locator(
    '[data-evidence-artifact="multiple-output-representations"]',
  );
  await expect(
    fallbackOutput.getByRole('heading', { name: 'JSON' }),
  ).toBeVisible();
  await expect(
    fallbackOutput.getByRole('heading', { name: 'CSV' }),
  ).toBeVisible();
  await expect(
    fallbackOutput.getByRole('heading', { name: 'SQL' }),
  ).toBeVisible();
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
    fallback
      .locator('.system-invalidation')
      .getByText(/Configuration state.*Invalidates/),
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
