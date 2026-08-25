import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

const prototypeOrigin = 'http://127.0.0.1:4322';

for (const locale of ['en', 'es'] as const) {
  test(`${locale} design prototype is isolated and accessible in development`, async ({
    page,
  }) => {
    await page.goto(`${prototypeOrigin}/${locale}/design-system`);

    await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
      'content',
      'noindex, nofollow',
    );
    await expect(page.locator('[data-theme="v2-dark"]')).toBeVisible();
    await expect(page.locator('[data-project="questboard"]')).toBeVisible();
    await expect(page.locator('[data-project="duckyarena"]')).toBeVisible();
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
  });
}

test('production navigation does not expose the design prototype', async ({
  page,
}) => {
  await page.goto('/en');
  await expect(page.locator('a[href*="design-system"]')).toHaveCount(0);
});

test('design prototype remains readable without mobile overflow', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${prototypeOrigin}/en/design-system`);

  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await expect(
    page.getByRole('link', { name: 'Primary action' }),
  ).toBeVisible();
});

test('reduced motion preserves prototype interaction without translation', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(`${prototypeOrigin}/en/design-system`);

  const primaryAction = page.getByRole('link', { name: 'Primary action' });
  await primaryAction.hover();

  expect(
    await primaryAction.evaluate(
      (element) => getComputedStyle(element).transform,
    ),
  ).toBe('none');
  await expect(primaryAction).toBeVisible();
});
