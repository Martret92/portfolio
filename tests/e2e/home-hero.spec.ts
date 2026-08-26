import { expect, test } from '@playwright/test';

const homes = [
  {
    path: '/en',
    role: 'Full Stack Developer · Backend-oriented',
    headline:
      'Build reliable systems and turn them into real product experiences.',
    work: 'View my work',
    cv: 'View CV',
    system: 'Living System',
  },
  {
    path: '/es',
    role: 'Desarrollador Full Stack · Orientación backend',
    headline:
      'Construyo sistemas fiables y los convierto en experiencias de producto reales.',
    work: 'Ver mi trabajo',
    cv: 'Ver CV',
    system: 'Sistema vivo',
  },
] as const;

for (const home of homes) {
  test(`${home.path} presents the final Hero and Living System`, async ({
    page,
  }) => {
    await page.goto(home.path);
    const hero = page.locator('[data-home-hero]');

    await expect(hero).toContainText(home.role);
    await expect(hero).toContainText('Jaime Martret');
    await expect(
      hero.getByRole('heading', { level: 1, name: home.headline }),
    ).toBeVisible();
    await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
    await expect(hero.getByRole('link', { name: home.work })).toHaveAttribute(
      'href',
      '#work',
    );
    await expect(hero.getByRole('link', { name: home.cv })).toHaveAttribute(
      'href',
      '#cv',
    );
    await expect(hero.getByRole('img', { name: home.system })).toBeVisible();
  });
}

test('Living System remains complete without JavaScript', async ({
  browser,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto('/en');

  const hero = page.locator('[data-home-hero]');
  await expect(hero.getByRole('img', { name: 'Living System' })).toBeVisible();
  await expect(hero).toContainText(
    'Input → API → Service → State and data → Product experience',
  );
  await expect(hero.getByRole('link', { name: 'View my work' })).toBeVisible();

  await context.close();
});

test('Living System becomes a designed static state under reduced motion', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/en');

  const system = page.locator('[data-living-system]');
  await expect(
    system.getByRole('img', { name: 'Living System' }),
  ).toBeVisible();
  await expect(system.locator('.data-packet')).toHaveCSS('display', 'none');
  await expect(system.locator('.active-path')).toHaveCSS(
    'animation-name',
    'none',
  );
});

test('Hero reflows without overflow across target widths', async ({ page }) => {
  for (const width of [390, 768, 1024, 1280, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/en');

    const hero = page.locator('[data-home-hero]');
    await expect(hero).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
      `Home overflowed at ${width}px`,
    ).toBe(true);

    const copy = await hero.locator('.hero__copy').boundingBox();
    const visual = await hero.locator('.hero__visual').boundingBox();
    expect(copy).not.toBeNull();
    expect(visual).not.toBeNull();
    if (!copy || !visual) continue;

    if (width >= 1024) expect(visual.x).toBeGreaterThan(copy.x);
    else expect(visual.y).toBeGreaterThan(copy.y + copy.height - 1);
  }
});
