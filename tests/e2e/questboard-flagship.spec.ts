import { expect, test } from '@playwright/test';

const locales = [
  {
    path: '/en',
    system: 'The system',
    narrative:
      'Reliable workflows are built from explicit states, rules and transitions.',
    evidence: 'Engineering evidence',
    caseStudy: 'Explore case study',
    repository: 'Repository',
    projectPath: '/en/projects/questboard',
  },
  {
    path: '/es',
    system: 'El sistema',
    narrative:
      'Los flujos fiables se construyen con estados, reglas y transiciones explícitas.',
    evidence: 'Evidencia de ingeniería',
    caseStudy: 'Explorar caso de estudio',
    repository: 'Repositorio',
    projectPath: '/es/projects/questboard',
  },
] as const;

for (const locale of locales) {
  test(`${locale.path} presents QuestBoard as the flagship system evidence`, async ({
    page,
  }) => {
    await page.goto(locale.path);
    const flagship = page.locator('[data-questboard-home-preview]');

    await expect(flagship).toContainText(locale.system);
    await expect(flagship).toContainText(locale.narrative);
    await expect(
      flagship.getByRole('heading', { level: 2, name: 'QuestBoard' }),
    ).toBeVisible();
    await expect(
      flagship.getByRole('heading', { level: 3, name: locale.evidence }),
    ).toBeVisible();
    await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);

    const workflow = flagship.getByRole('list', {
      name: /QuestBoard workflow|Flujo de QuestBoard/,
    });
    await expect(workflow.locator('code')).toHaveText([
      'BACKLOG',
      'READY',
      'IN_PROGRESS',
      'REVIEW',
      'DONE',
    ]);
    await expect(flagship).toContainText('QuestEvent');
    await expect(flagship).toContainText('transaction.atomic');

    await expect(
      flagship.getByRole('link', { name: locale.caseStudy }),
    ).toHaveAttribute('href', locale.projectPath);
    await expect(
      flagship.getByRole('link', { name: locale.repository }),
    ).toHaveAttribute('href', 'https://github.com/Martret92/questboard');
  });
}

test('QuestBoard flagship is complete without JavaScript', async ({
  browser,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto('/en');

  const flagship = page.locator('[data-questboard-home-preview]');
  await expect(flagship).toBeVisible();
  await expect(flagship.locator('.workflow code')).toHaveCount(5);
  await expect(
    flagship.getByRole('link', { name: 'Explore case study' }),
  ).toBeVisible();

  await context.close();
});

test('QuestBoard workflow is static under reduced motion', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/en');

  const states = page.locator('[data-questboard-home-preview] .workflow li');
  await expect(states).toHaveCount(5);
  for (const state of await states.all()) {
    await expect(state).toHaveCSS('animation-name', 'none');
    await expect(state).toHaveCSS('opacity', '1');
  }
});

test('QuestBoard flagship reflows without overflow at target widths', async ({
  page,
}) => {
  for (const width of [390, 768, 1024, 1280, 1440, 2560]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto('/en');

    await expect(page.locator('[data-questboard-home-preview]')).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
      `Home overflowed at ${width}px`,
    ).toBe(true);
  }
});
