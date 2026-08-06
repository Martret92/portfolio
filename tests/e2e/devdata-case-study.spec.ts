import { expect, test } from '@playwright/test';

const localizedCases = [
  {
    path: '/en/projects/devdata-generator',
    heading: 'DevData Generator',
    overview: 'Overview',
    howItWorks: 'How it works',
    result: 'One generated result',
    invalidation: 'Predictable invalidation',
    outputs: 'Output formats',
    architecture: 'Browser-only architecture',
    repository: 'View repository',
    noBackend: 'No backend or database is required.',
  },
  {
    path: '/es/projects/devdata-generator',
    heading: 'DevData Generator',
    overview: 'Resumen',
    howItWorks: 'Cómo funciona',
    result: 'Un único resultado generado',
    invalidation: 'Invalidación predecible',
    outputs: 'Formatos de salida',
    architecture: 'Arquitectura solo en el navegador',
    repository: 'Ver repositorio',
    noBackend: 'No requiere backend ni base de datos.',
  },
] as const;

for (const localized of localizedCases) {
  test(`${localized.path} presents the static editorial case study`, async ({
    page,
  }) => {
    await page.goto(localized.path);
    const article = page.locator('[data-devdata-case-study]');

    await expect(
      article.getByRole('heading', { level: 1, name: localized.heading }),
    ).toBeVisible();
    for (const heading of [
      localized.overview,
      localized.howItWorks,
      localized.result,
      localized.invalidation,
      localized.outputs,
      localized.architecture,
    ]) {
      await expect(
        article.getByRole('heading', { level: 2, name: heading }),
      ).toBeVisible();
    }

    const image = article.getByRole('img');
    await expect(image).toHaveAttribute(
      'src',
      '/images/projects/devdata/devdata-product-overview.png',
    );
    await expect(image).toHaveAttribute('width', '845');
    await expect(image).toHaveAttribute('height', '1172');

    const flow = article.locator('[data-devdata-flow]');
    await expect(flow).toContainText('generatedData');
    await expect(flow).toContainText(/Preview|Vista previa/);
    await expect(flow).toContainText(/Export|Exportar/);
    await expect(flow).toContainText(/Faker/);

    await expect(article).toContainText(localized.noBackend);
    await expect(article).toContainText(/not executed|no se ejecuta/);
    await expect(article).toContainText('src/App.jsx');
    for (const format of ['JSON', 'CSV', 'SQL']) {
      await expect(
        article.getByRole('heading', { level: 3, name: format }),
      ).toBeVisible();
    }

    const repositories = article.getByRole('link', {
      name: localized.repository,
    });
    await expect(repositories).toHaveCount(2);
    for (const repository of await repositories.all()) {
      await expect(repository).toHaveAttribute(
        'href',
        'https://github.com/Martret92/devdata-generator',
      );
      await expect(repository).toHaveAttribute('target', '_blank');
      await expect(repository).toHaveAttribute('rel', 'noopener noreferrer');
    }

    await expect(article.getByRole('button')).toHaveCount(0);
    await expect(article.locator('astro-island')).toHaveCount(0);
    await expect(article).not.toContainText(
      /Choose a project perspective|Product view|System view|Inspect system|Inspector/,
    );
  });
}

test('DevData remains readable without interaction at 375px', async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/en/projects/devdata-generator');

  await expect(
    page.getByRole('heading', { name: 'How it works' }),
  ).toBeVisible();
  await expect(
    page.getByRole('heading', { name: 'Output formats' }),
  ).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
});
