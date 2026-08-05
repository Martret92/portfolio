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
    preview.getByRole('link', { name: /Explore case study/ }),
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

test('project content remains usable without JavaScript', async ({
  browser,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();

  await page.goto('/en/projects/devdata-generator');
  const caseStudy = page.locator('[data-devdata-case-study]');
  await expect(
    caseStudy.getByRole('heading', { name: 'Overview' }),
  ).toBeVisible();
  await expect(caseStudy.getByRole('img')).toBeVisible();
  await expect(caseStudy.getByRole('img')).toHaveAttribute(
    'alt',
    /Users template/,
  );
  await expect(
    caseStudy.getByRole('heading', { name: 'How it works' }),
  ).toBeVisible();
  await expect(caseStudy.getByRole('button')).toHaveCount(0);
  await expect(caseStudy.getByText('src/App.jsx')).toBeVisible();
  for (const format of ['JSON', 'CSV', 'SQL']) {
    await expect(
      caseStudy.getByRole('heading', { level: 3, name: format }),
    ).toBeVisible();
  }
  await expect(caseStudy).toContainText('generatedData');
  await expect(caseStudy).toContainText('No backend or database is required.');

  await context.close();
});
