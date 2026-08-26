import { expect, test } from '@playwright/test';

const locales = [
  {
    path: '/en',
    selected: 'Selected project',
    workflow: 'Workflow',
    result: 'Shared result',
    boundary: 'Browser boundary',
    caseStudy: 'Explore case study',
    projectPath: '/en/projects/devdata-generator',
    repository: 'Repository',
    stackHeading: 'Technical capabilities',
    groups: ['Backend', 'Frontend', 'Engineering'],
  },
  {
    path: '/es',
    selected: 'Proyecto seleccionado',
    workflow: 'Flujo',
    result: 'Resultado compartido',
    boundary: 'Límite del navegador',
    caseStudy: 'Explorar caso de estudio',
    projectPath: '/es/projects/devdata-generator',
    repository: 'Repositorio',
    stackHeading: 'Capacidades técnicas',
    groups: ['Backend', 'Frontend', 'Ingeniería'],
  },
] as const;

for (const locale of locales) {
  test(`${locale.path} presents Selected Work and the capability map`, async ({
    page,
  }) => {
    await page.goto(locale.path);

    const selectedWork = page.locator('[data-home-project-preview]');
    await expect(selectedWork).toContainText(locale.selected);
    await expect(
      selectedWork.getByRole('heading', {
        level: 2,
        name: 'DevData Generator',
      }),
    ).toBeVisible();
    await expect(selectedWork).toContainText(locale.workflow);
    await expect(selectedWork).toContainText(locale.result);
    await expect(selectedWork).toContainText(locale.boundary);
    await expect(selectedWork).toContainText('generatedData');
    await expect(selectedWork).toContainText('JSON');
    await expect(selectedWork).toContainText('CSV');
    await expect(selectedWork).toContainText('SQL');

    const image = selectedWork.getByRole('img');
    await expect(image).toHaveAttribute(
      'src',
      '/images/projects/devdata/devdata-product-overview.jpg',
    );
    await expect(image).toHaveAttribute('width', '845');
    await expect(image).toHaveAttribute('height', '1172');
    await expect(image).toHaveAttribute('loading', 'lazy');

    await expect(
      selectedWork.getByRole('link', { name: locale.caseStudy }),
    ).toHaveAttribute('href', locale.projectPath);
    const repository = selectedWork.getByRole('link', {
      name: locale.repository,
    });
    await expect(repository).toHaveAttribute(
      'href',
      'https://github.com/Martret92/devdata-generator',
    );
    await expect(repository).toHaveAttribute('rel', 'noopener noreferrer');
    await expect(selectedWork).not.toContainText(
      /Live Demo|Play Now|Ver demo|Jugar ahora/i,
    );

    const stack = page.locator('#stack');
    await expect(
      stack.getByRole('heading', { level: 2, name: locale.stackHeading }),
    ).toBeVisible();
    await expect(stack.locator('.capability-groups dt')).toHaveText(
      locale.groups,
    );
    await expect(stack).toContainText('Django REST Framework');
    await expect(stack).toContainText('Socket.IO');
    await expect(stack).toContainText('Astro');
    await expect(stack).toContainText('GitHub Actions');
    await expect(stack).toContainText('OpenAPI');
    await expect(stack.locator('progress')).toHaveCount(0);
    await expect(stack).not.toContainText(/\b\d{1,3}%\b/);
    await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
  });
}

test('Selected Work and Stack remain complete without JavaScript', async ({
  browser,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto('/en');

  await expect(page.locator('[data-home-project-preview]')).toBeVisible();
  await expect(page.locator('#stack .capability-groups > div')).toHaveCount(3);
  await expect(
    page.getByRole('link', { name: 'Explore case study' }).last(),
  ).toBeVisible();

  await context.close();
});

test('Selected Work closes the project story before Stack', async ({
  page,
}) => {
  await page.goto('/en');

  const duckyArena = await page
    .locator('[data-duckyarena-home-preview]')
    .boundingBox();
  const selectedWork = await page
    .locator('[data-home-project-preview]')
    .boundingBox();
  const stack = await page.locator('#stack').boundingBox();

  expect(duckyArena).not.toBeNull();
  expect(selectedWork).not.toBeNull();
  expect(stack).not.toBeNull();
  expect(duckyArena!.y).toBeLessThan(selectedWork!.y);
  expect(selectedWork!.y).toBeLessThan(stack!.y);
});

test('Selected Work and Stack reflow without horizontal overflow', async ({
  page,
}) => {
  for (const width of [390, 768, 1024, 1280, 1440, 2560]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto('/en');

    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
      `Home overflowed at ${width}px`,
    ).toBe(true);
  }

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/es');
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);

  const groups = page.locator('#stack .capability-groups > div');
  const boxes = await groups.evaluateAll((items) =>
    items.map((item) => item.getBoundingClientRect().top),
  );
  expect(boxes).toHaveLength(3);
  const [backend, frontend, engineering] = boxes as [number, number, number];
  expect(backend).toBeLessThan(frontend);
  expect(frontend).toBeLessThan(engineering);
});
