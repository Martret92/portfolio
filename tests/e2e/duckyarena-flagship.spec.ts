import { expect, test } from '@playwright/test';

const locales = [
  {
    path: '/en',
    experience: 'The experience',
    narrative:
      'Realtime systems become meaningful when players can feel the state change.',
    provenance: /collaborative academic project/i,
    signals: ['Hidden strategy', 'Authoritative combat', 'Durable outcome'],
    caseStudy: 'Explore case study',
    projectPath: '/en/projects/duckyarena',
    repository: 'Repository',
    combatAlt: /DuckyArena combat screen with two Duckies/,
    characterAlt: /DuckyArena character selection showing four Duckies/,
    laneAlt: /DuckyArena farm arena with three selectable lanes/,
  },
  {
    path: '/es',
    experience: 'La experiencia',
    narrative:
      'Los sistemas realtime cobran sentido cuando los jugadores pueden sentir cada cambio de estado.',
    provenance: /proyecto académico colaborativo/i,
    signals: [
      'Estrategia oculta',
      'Combate autoritativo',
      'Resultado persistente',
    ],
    caseStudy: 'Explorar caso de estudio',
    projectPath: '/es/projects/duckyarena',
    repository: 'Repositorio',
    combatAlt: /Pantalla de combate de DuckyArena con dos Duckies/,
    characterAlt: /Selección de personajes de DuckyArena con cuatro Duckies/,
    laneAlt: /Farm arena de DuckyArena con tres líneas seleccionables/,
  },
] as const;

for (const locale of locales) {
  test(`${locale.path} presents DuckyArena as the flagship experience`, async ({
    page,
  }) => {
    await page.goto(locale.path);
    const flagship = page.locator('[data-duckyarena-home-preview]');

    await expect(flagship).toContainText(locale.experience);
    await expect(flagship).toContainText(locale.narrative);
    await expect(flagship).toContainText(locale.provenance);
    await expect(
      flagship.getByRole('heading', { level: 2, name: 'DuckyArena' }),
    ).toBeVisible();
    await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);

    for (const signal of locale.signals) {
      await expect(
        flagship.getByRole('heading', { level: 4, name: signal }),
      ).toBeVisible();
    }

    const combat = flagship.getByRole('img', { name: locale.combatAlt });
    await expect(combat).toHaveAttribute(
      'src',
      '/images/projects/duckyarena/04-combat-redacted.jpg',
    );
    await expect(
      flagship.locator('.arena-frame--combat source'),
    ).toHaveAttribute(
      'srcset',
      /04-combat-redacted-1000\.jpg 1000w.*04-combat-redacted\.jpg 1425w/,
    );
    await expect(combat).toHaveAttribute('width', '1425');
    await expect(combat).toHaveAttribute('height', '1484');
    await expect(combat).toHaveAttribute('loading', 'lazy');
    await expect(
      flagship.getByRole('img', { name: locale.characterAlt }),
    ).toHaveAttribute(
      'src',
      '/images/projects/duckyarena/01-character-select-redacted.jpg',
    );
    await expect(
      flagship.getByRole('img', { name: locale.laneAlt }),
    ).toHaveAttribute(
      'src',
      '/images/projects/duckyarena/02-lane-selection-redacted.jpg',
    );

    await expect(
      flagship.getByRole('link', { name: locale.caseStudy }),
    ).toHaveAttribute('href', locale.projectPath);
    const repository = flagship.getByRole('link', {
      name: locale.repository,
    });
    await expect(repository).toHaveAttribute(
      'href',
      'https://github.com/Martret92/DuckyArena',
    );
    await expect(repository).toHaveAttribute('target', '_blank');
    await expect(repository).toHaveAttribute('rel', 'noopener noreferrer');
    await expect(flagship).not.toContainText(
      /Live Demo|Play Now|Ver demo|Jugar ahora/i,
    );
  });
}

test('DuckyArena flagship is complete without JavaScript', async ({
  browser,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto('/en');

  const flagship = page.locator('[data-duckyarena-home-preview]');
  await expect(flagship).toBeVisible();
  await expect(flagship.getByRole('img')).toHaveCount(3);
  await expect(
    flagship.getByRole('link', { name: 'Explore case study' }),
  ).toBeVisible();

  await context.close();
});

test('DuckyArena arena reveal is static under reduced motion', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/en');

  const picture = page.locator(
    '[data-duckyarena-home-preview] .arena-frame--combat picture',
  );
  await expect(picture).toHaveCSS('animation-name', 'none');
  await expect(picture).toHaveCSS('opacity', '1');
  await expect(picture).toHaveCSS('transform', 'none');
});

test('DuckyArena flagship reflows without overflow at target widths', async ({
  page,
}) => {
  for (const width of [390, 768, 1024, 1280, 1440, 2560]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto('/en');

    const flagship = page.locator('[data-duckyarena-home-preview]');
    await expect(flagship).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
      `Home overflowed at ${width}px`,
    ).toBe(true);
  }

  await page.setViewportSize({ width: 390, height: 1000 });
  await page.goto('/es');
  await expect(page.locator('[data-duckyarena-home-preview]')).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
    'Spanish Home overflowed at 390px',
  ).toBe(true);
});

test('DuckyArena mobile hierarchy keeps the dominant image before supporting evidence', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/en');

  const flagship = page.locator('[data-duckyarena-home-preview]');
  const combat = await flagship.locator('.arena-frame--combat').boundingBox();
  const character = await flagship
    .locator('.arena-frame--character')
    .boundingBox();
  const lane = await flagship.locator('.arena-frame--lane').boundingBox();

  expect(combat).not.toBeNull();
  expect(character).not.toBeNull();
  expect(lane).not.toBeNull();
  expect(combat!.y).toBeLessThan(character!.y);
  expect(character!.y).toBeLessThan(lane!.y);
});
