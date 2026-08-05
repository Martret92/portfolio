import { expect, test } from '@playwright/test';

const routes = [
  {
    path: '/en',
    heading:
      'I build web applications on clear, maintainable technical foundations.',
  },
  {
    path: '/es',
    heading:
      'Construyo aplicaciones web sobre bases técnicas claras y mantenibles.',
  },
  {
    path: '/en/projects/devdata-generator',
    heading: 'DevData Generator',
  },
  {
    path: '/es/projects/devdata-generator',
    heading: 'DevData Generator',
  },
  {
    path: '/en/projects/duckyarena',
    heading:
      'Evolving a collaborative game backend into a more structured full stack system.',
  },
  {
    path: '/es/projects/duckyarena',
    heading:
      'Evolucionando un backend colaborativo hacia un sistema full stack más estructurado.',
  },
] as const;

const professionalHomes = [
  {
    path: '/en',
    hero: /junior Full Stack Developer based in Barcelona/,
    about: 'About',
    capabilities: 'Technical capabilities',
    experience: 'Previous professional experience',
    education: 'Education and certification',
    inProgress: 'In progress',
    incomplete: 'Studies not completed',
    contact: 'Contact',
    navigation: {
      work: 'Work',
      about: 'About',
      contact: 'Contact',
    },
    cv: 'Download CV',
  },
  {
    path: '/es',
    hero: /desarrollador Full Stack Junior en Barcelona/,
    about: 'Sobre mí',
    capabilities: 'Capacidades técnicas',
    experience: 'Experiencia profesional anterior',
    education: 'Formación y certificación',
    inProgress: 'En curso',
    incomplete: 'Estudios no finalizados',
    contact: 'Contacto',
    navigation: {
      work: 'Proyectos',
      about: 'Sobre mí',
      contact: 'Contacto',
    },
    cv: 'Descargar CV',
  },
] as const;

for (const home of professionalHomes) {
  test(`${home.path} presents the verified professional profile`, async ({
    page,
  }) => {
    await page.goto(home.path);

    await expect(page.getByRole('banner')).toContainText('Jaime Martret');
    await expect(page.locator('main')).toContainText(home.hero);
    await expect(
      page.getByRole('heading', { level: 2, name: home.about }),
    ).toBeVisible();
    await expect(
      page.getByRole('heading', { level: 2, name: home.capabilities }),
    ).toBeVisible();
    await expect(
      page.getByRole('heading', { level: 2, name: home.experience }),
    ).toBeVisible();
    await expect(
      page.getByRole('heading', { level: 2, name: home.education }),
    ).toBeVisible();
    await expect(
      page.getByText(home.inProgress, { exact: true }),
    ).toBeVisible();
    await expect(
      page.getByText(home.incomplete, { exact: true }),
    ).toBeVisible();
    await expect(
      page.getByRole('heading', { level: 2, name: home.contact }),
    ).toBeVisible();

    const navigation = page.getByRole('navigation', {
      name: /Primary navigation|Navegación principal/,
    });
    await expect(
      navigation.getByRole('link', { name: home.navigation.work }),
    ).toHaveAttribute('href', `${home.path}#featured-work`);
    await expect(
      navigation.getByRole('link', { name: home.navigation.about }),
    ).toHaveAttribute('href', `${home.path}#about`);
    await expect(
      navigation.getByRole('link', { name: home.navigation.contact }),
    ).toHaveAttribute('href', `${home.path}#contact`);

    const emailLink = page.getByRole('link', {
      name: 'jaime.martret@gmail.com',
    });
    await expect(emailLink).toBeVisible();
    await expect(emailLink).toHaveAttribute(
      'href',
      'mailto:jaime.martret@gmail.com',
    );
    await expect(page.getByRole('link', { name: /GitHub/i })).toHaveAttribute(
      'href',
      'https://github.com/Martret92',
    );
    await expect(page.getByRole('link', { name: /LinkedIn/i })).toHaveAttribute(
      'href',
      'https://www.linkedin.com/in/jaime-martret/',
    );
    await expect(
      page.getByRole('link', { name: /verified|verificada/i }),
    ).toHaveAttribute(
      'href',
      'https://www.credly.com/badges/77c61d68-3aea-4011-83ba-060dbde3f766/public_url',
    );
    await expect(page.getByRole('link', { name: home.cv })).toHaveAttribute(
      'href',
      '/jaime-martret-full-stack-cv.pdf',
    );

    await expect(page.locator('body')).not.toContainText(
      /Developer Name|Nombre de desarrollo|Placeholder identity|Identidad provisional/,
    );
    await expect(page.locator('body')).not.toContainText(/\+34|\b[679]\d{8}\b/);
    await expect(page.getByText('BonÀrea', { exact: true })).toBeVisible();
    await expect(
      page.getByText('Bluespace Self-Storage', { exact: true }),
    ).toBeVisible();
    await expect(
      page.getByText('Starbucks Coffee Company', { exact: true }),
    ).toBeVisible();
  });
}

test('root deterministically enters the default English locale', async ({
  page,
}) => {
  await page.goto('/');

  await expect(page).toHaveURL(/\/en\/?$/);
  await expect(page.locator('body')).not.toContainText(
    'Temporary language entry',
  );
});

for (const route of routes) {
  test(`${route.path} renders successfully`, async ({ page }) => {
    const response = await page.goto(route.path);

    expect(response?.ok()).toBe(true);
    await expect(
      page.getByRole('heading', { level: 1, name: route.heading }),
    ).toBeVisible();
  });
}

const devDataProjectRoutes = [
  {
    path: '/en/projects/devdata-generator',
    title: 'DevData Generator — Data generation case study',
    description:
      'A browser-based data generation case study focused on one shared generated result, predictable invalidation and reusable JSON, CSV and SQL outputs.',
    overview: /browser-based tool for configuring realistic fake datasets/i,
    repositoryCta: 'View repository',
  },
  {
    path: '/es/projects/devdata-generator',
    title: 'DevData Generator — Caso de estudio de generación de datos',
    description:
      'Caso de estudio de generación de datos en el navegador centrado en un único resultado compartido, invalidación predecible y salidas reutilizables en JSON, CSV y SQL.',
    overview: /herramienta ejecutada en el navegador para configurar datasets/i,
    repositoryCta: 'Ver repositorio',
  },
] as const;

for (const route of devDataProjectRoutes) {
  test(`${route.path} presents final DevData editorial content`, async ({
    page,
  }) => {
    await page.goto(route.path);

    await expect(page).toHaveTitle(route.title);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute(
      'content',
      route.description,
    );
    await expect(
      page.getByRole('heading', { level: 1, name: 'DevData Generator' }),
    ).toBeVisible();
    const overview = page
      .getByRole('heading', { name: /Overview|Resumen/ })
      .locator('xpath=ancestor::section[1]');
    await expect(overview).toBeVisible();
    await expect(overview).toContainText(route.overview);

    const repository = page.getByRole('link', {
      name: route.repositoryCta,
    });
    await expect(repository).toHaveCount(2);
    for (const link of await repository.all()) {
      await expect(link).toHaveAttribute(
        'href',
        'https://github.com/Martret92/devdata-generator',
      );
      await expect(link).toHaveAttribute('target', '_blank');
      await expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    }
    await expect(page.locator('main')).not.toContainText(
      /placeholder|temporary|marcador temporal|contenido temporal/i,
    );
  });
}

test('Home and project navigation form a complete localized flow', async ({
  page,
}) => {
  await page.goto('/en');
  await page
    .locator('[data-home-project-preview]')
    .getByRole('link', { name: /Explore case study/ })
    .click();
  await expect(page).toHaveURL(/\/en\/projects\/devdata-generator\/?$/);

  await page.getByRole('link', { name: 'Back to Home' }).click();
  await expect(page).toHaveURL(/\/en\/?$/);
});

test('Spanish Home and project navigation remain localized', async ({
  page,
}) => {
  await page.goto('/es');
  await page
    .locator('[data-home-project-preview]')
    .getByRole('link', { name: /Explorar caso de estudio/ })
    .click();
  await expect(page).toHaveURL(/\/es\/projects\/devdata-generator\/?$/);

  await page.getByRole('link', { name: 'Volver al inicio' }).click();
  await expect(page).toHaveURL(/\/es\/?$/);
});

const homePreviews = [
  {
    path: '/en',
    eyebrow: 'Featured project',
    summary:
      'Configure realistic datasets once, inspect one generated result and reuse it across table, JSON, CSV and SQL.',
    workflowLabel: 'Workflow',
    workflowSummary:
      'Choose a template, fields and quantity, then generate a reusable dataset.',
    resultLabel: 'Shared result',
    resultSummary:
      'One validated configuration produces one shared generatedData result for every preview and export path.',
    topologyLabel: 'DevData system flow',
    configureLabel: 'Configure',
    generateLabel: 'Generate',
    previewLabel: 'Preview',
    exportLabel: 'Export',
    cta: 'Explore case study',
    alt: /Users template and three generated records/,
  },
  {
    path: '/es',
    eyebrow: 'Proyecto destacado',
    summary:
      'Configura datasets realistas una vez, inspecciona un único resultado generado y reutilízalo en tabla, JSON, CSV y SQL.',
    workflowLabel: 'Flujo',
    workflowSummary:
      'Elige una plantilla, los campos y la cantidad, y genera un dataset reutilizable.',
    resultLabel: 'Resultado compartido',
    resultSummary:
      'Una configuración validada produce un único resultado generatedData compartido por todas las vistas y exportaciones.',
    topologyLabel: 'Flujo del sistema de DevData',
    configureLabel: 'Configurar',
    generateLabel: 'Generar',
    previewLabel: 'Vista previa',
    exportLabel: 'Exportar',
    cta: 'Explorar caso de estudio',
    alt: /plantilla Usuarios y tres registros generados/,
  },
] as const;

for (const preview of homePreviews) {
  test(`${preview.path} presents the localized DevData signature`, async ({
    page,
  }) => {
    await page.goto(preview.path);
    const section = page.locator('[data-home-project-preview]');

    await expect(section.locator('astro-island')).toHaveCount(0);

    await expect(
      section.getByText(preview.eyebrow, { exact: true }),
    ).toBeVisible();
    await expect(
      section.getByRole('heading', { level: 2, name: 'DevData Generator' }),
    ).toBeVisible();
    await expect(
      section.getByText(preview.summary, { exact: true }),
    ).toBeVisible();
    await expect(
      section.getByText(preview.workflowLabel, { exact: true }),
    ).toBeVisible();
    await expect(
      section.getByRole('heading', { level: 3, name: preview.workflowSummary }),
    ).toBeVisible();
    await expect(
      section.getByText(preview.resultLabel, { exact: true }),
    ).toBeVisible();
    await expect(
      section.getByRole('heading', { level: 3, name: preview.resultSummary }),
    ).toBeVisible();

    const productImage = section.getByRole('img', { name: preview.alt });
    await expect(productImage).toHaveCount(1);
    await expect(productImage).toHaveAttribute(
      'src',
      '/images/projects/devdata/devdata-product-overview.jpg',
    );
    await expect(productImage).toHaveAttribute('width', '1440');
    await expect(productImage).toHaveAttribute('height', '1205');

    const topology = section.locator(
      `ol[aria-label="${preview.topologyLabel}"]`,
    );
    await expect(topology.getByRole('listitem')).toHaveText([
      `${preview.configureLabel} → ${preview.generateLabel}`,
      `${preview.generateLabel} → generatedData`,
      `generatedData → ${preview.previewLabel}`,
      `generatedData → ${preview.exportLabel}`,
    ]);
    await expect(topology).not.toContainText(
      `${preview.previewLabel} → ${preview.exportLabel}`,
    );

    const cta = section.getByRole('link', { name: new RegExp(preview.cta) });
    await expect(cta).toHaveAttribute(
      'href',
      `${preview.path}/projects/devdata-generator`,
    );
  });
}

test('featured DevData preview has no mobile horizontal overflow', async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/en');
  await page.locator('[data-home-project-preview]').scrollIntoViewIfNeeded();

  expect(
    await page.evaluate(
      () =>
        document.documentElement.scrollWidth <=
        document.documentElement.clientWidth,
    ),
  ).toBe(true);
});

test('Home preserves DevData as the primary project before DuckyArena', async ({
  page,
}) => {
  await page.goto('/en');

  const projects = page.locator(
    '[data-home-project-preview], [data-duckyarena-home-preview]',
  );
  await expect(projects).toHaveCount(2);
  expect(
    await projects.evaluateAll((nodes) =>
      nodes.map((node) =>
        node.hasAttribute('data-home-project-preview')
          ? 'devdata-generator'
          : 'duckyarena',
      ),
    ),
  ).toEqual(['devdata-generator', 'duckyarena']);
});

test('language switching preserves the project route', async ({ page }) => {
  await page.goto('/en/projects/devdata-generator');
  await page.getByRole('link', { name: 'Español' }).click();
  await expect(page).toHaveURL(/\/es\/projects\/devdata-generator\/?$/);

  await page.getByRole('link', { name: 'English' }).click();
  await expect(page).toHaveURL(/\/en\/projects\/devdata-generator\/?$/);
});

const duckyArenaRoutes = [
  {
    path: '/en',
    projectPath: '/en/projects/duckyarena',
    cta: 'Explore case study',
    collaboration: /three-person educational project/,
    contribution: 'My contribution',
    alternate: 'Español',
    alternateProjectPath: /\/es\/projects\/duckyarena\/?$/,
    alternateBack: 'Volver al inicio',
    alternateHomePath: /\/es\/?$/,
  },
  {
    path: '/es',
    projectPath: '/es/projects/duckyarena',
    cta: 'Explorar caso de estudio',
    collaboration: /proyecto educativo colaborativo de tres personas/,
    contribution: 'Mi contribución',
    alternate: 'English',
    alternateProjectPath: /\/en\/projects\/duckyarena\/?$/,
    alternateBack: 'Back to Home',
    alternateHomePath: /\/en\/?$/,
  },
] as const;

for (const route of duckyArenaRoutes) {
  test(`${route.path} links to the localized DuckyArena story`, async ({
    page,
  }) => {
    await page.goto(route.path);
    const preview = page.locator('[data-duckyarena-home-preview]');
    await expect(
      preview.getByRole('heading', { name: 'DuckyArena' }),
    ).toBeVisible();
    await expect(preview.getByRole('list')).toContainText('PostgreSQL');
    await expect(
      preview.getByRole('link', { name: new RegExp(route.cta) }),
    ).toHaveAttribute('href', route.projectPath);

    await page.goto(route.projectPath);
    const caseStudy = page.locator('[data-duckyarena-case-study]');
    await expect(caseStudy).toContainText(route.collaboration);
    await expect(
      caseStudy.getByRole('heading', { name: route.contribution }),
    ).toBeVisible();

    const repositoryLinks = caseStudy.getByRole('link', {
      name: /View repository|Ver repositorio/,
    });
    await expect(repositoryLinks).toHaveCount(2);
    for (const link of await repositoryLinks.all()) {
      await expect(link).toHaveAttribute(
        'href',
        'https://github.com/Martret92/DuckyArena',
      );
    }
    await expect(
      caseStudy.locator('a[href*="DuckyArena-legacy"], a[href*="Isildu"]'),
    ).toHaveCount(0);

    await expect(caseStudy).toContainText(/Authentication|autenticación/i);
    await expect(caseStudy).toContainText(
      /broader frontend integration|integración más amplia del frontend/i,
    );
    await expect(caseStudy).toContainText(
      /automated tests|tests automatizados/i,
    );
    await expect(caseStudy).toContainText(/CI.*pending|CI siguen pendientes/i);
    await expect(caseStudy).not.toContainText(
      /individual project|built the entire backend|production-ready/i,
    );

    await page.getByRole('link', { name: route.alternate }).click();
    await expect(page).toHaveURL(route.alternateProjectPath);

    await page.getByRole('link', { name: route.alternateBack }).click();
    await expect(page).toHaveURL(route.alternateHomePath);
  });
}

test('DuckyArena remains readable without mobile overflow', async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/en/projects/duckyarena');

  await expect(
    page.getByRole('heading', { name: 'System architecture' }),
  ).toBeVisible();
  expect(
    await page.evaluate(
      () =>
        document.documentElement.scrollWidth <=
        document.documentElement.clientWidth,
    ),
  ).toBe(true);
});
