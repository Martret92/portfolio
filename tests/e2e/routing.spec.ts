import { expect, test } from '@playwright/test';

const routes = [
  {
    path: '/en',
    heading:
      'Build reliable systems and turn them into real product experiences.',
  },
  {
    path: '/es',
    heading:
      'Construyo sistemas fiables y los convierto en experiencias de producto reales.',
  },
  {
    path: '/en/projects/questboard',
    heading:
      'Dependency-aware workflows with explicit permissions and auditable state transitions.',
  },
  {
    path: '/es/projects/questboard',
    heading:
      'Flujos con dependencias, permisos explícitos y transiciones de estado auditables.',
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
    heading: 'DuckyArena',
  },
  {
    path: '/es/projects/duckyarena',
    heading: 'DuckyArena',
  },
] as const;

const professionalHomes = [
  {
    path: '/en',
    hero: /backend-oriented web applications around clear APIs/,
    about: 'About',
    capabilities: 'Technical capabilities',
    experience: 'Professional experience',
    bonareaRole: 'Cashier / Stock Replenisher',
    bonareaMeta: 'Barcelona · Nov 2024 – Present',
    education: 'Education and certification',
    inProgress: 'In progress',
    incomplete: 'Studies not completed',
    contact: 'Contact',
    email: 'Email',
    backToTop: 'Back to top',
    navigation: {
      work: 'Work',
      stack: 'Stack',
      about: 'About',
      cv: 'CV',
      contact: 'Contact',
    },
    cv: 'Download CV',
  },
  {
    path: '/es',
    hero: /aplicaciones web con orientación backend mediante APIs claras/,
    about: 'Sobre mí',
    capabilities: 'Capacidades técnicas',
    experience: 'Experiencia profesional',
    bonareaRole: 'Reponedor / Cajero',
    bonareaMeta: 'Barcelona · Nov. 2024 – Actualidad',
    education: 'Formación y certificación',
    inProgress: 'En curso',
    incomplete: 'Estudios no finalizados',
    contact: 'Contacto',
    email: 'Correo electrónico',
    backToTop: 'Volver arriba',
    navigation: {
      work: 'Proyectos',
      stack: 'Stack',
      about: 'Sobre mí',
      cv: 'CV',
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

    await expect(
      page.getByRole('banner').getByRole('link', {
        name: `Jaime Martret — ${home.path === '/en' ? 'Home' : 'Inicio'}`,
      }),
    ).toBeVisible();
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
    ).toHaveAttribute('href', `${home.path}#work`);
    await expect(
      navigation.getByRole('link', { name: home.navigation.stack }),
    ).toHaveAttribute('href', `${home.path}#stack`);
    await expect(
      navigation.getByRole('link', { name: home.navigation.about }),
    ).toHaveAttribute('href', `${home.path}#about`);
    await expect(
      navigation.getByRole('link', { name: home.navigation.cv }),
    ).toHaveAttribute('href', `${home.path}#cv`);
    await expect(
      navigation.getByRole('link', { name: home.navigation.contact }),
    ).toHaveAttribute('href', `${home.path}#contact`);

    const contact = page
      .getByRole('heading', { level: 2, name: home.contact })
      .locator('xpath=ancestor::section[1]');
    const emailLink = contact.getByRole('link', { name: home.email });
    await expect(emailLink).toBeVisible();
    await expect(emailLink).toHaveAttribute(
      'href',
      'mailto:jaime.martret@gmail.com',
    );
    await expect(contact).not.toContainText('jaime.martret@gmail.com');
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
    await expect(
      page.getByRole('link', { name: home.backToTop }),
    ).toHaveAttribute('href', '#top');

    await expect(page.locator('body')).not.toContainText(
      /Developer Name|Nombre de desarrollo|Placeholder identity|Identidad provisional/,
    );
    await expect(page.locator('body')).not.toContainText(/\+34|\b[679]\d{8}\b/);
    await expect(page.getByText('BonÀrea', { exact: true })).toBeVisible();
    await expect(
      page.getByText(home.bonareaRole, { exact: true }),
    ).toBeVisible();
    await expect(
      page.getByText(home.bonareaMeta, { exact: true }),
    ).toBeVisible();
    await expect(
      page.getByText('Bluespace Self-Storage', { exact: true }),
    ).toBeVisible();
    await expect(
      page.getByText('Starbucks Coffee Company', { exact: true }),
    ).toBeVisible();
  });
}

const caseStudyNavigation = [
  {
    path: '/en/projects/devdata-generator',
    navigation: 'Case study navigation',
    home: 'Home',
    homePath: '/en',
    next: 'QuestBoard',
    nextPath: '/en/projects/questboard',
    backToTop: 'Back to top',
  },
  {
    path: '/es/projects/devdata-generator',
    navigation: 'Navegación del caso de estudio',
    home: 'Inicio',
    homePath: '/es',
    next: 'QuestBoard',
    nextPath: '/es/projects/questboard',
    backToTop: 'Volver arriba',
  },
  {
    path: '/en/projects/duckyarena',
    navigation: 'Case study navigation',
    home: 'Home',
    homePath: '/en',
    next: 'DevData Generator',
    nextPath: '/en/projects/devdata-generator',
    backToTop: 'Back to top',
  },
  {
    path: '/es/projects/duckyarena',
    navigation: 'Navegación del caso de estudio',
    home: 'Inicio',
    homePath: '/es',
    next: 'DevData Generator',
    nextPath: '/es/projects/devdata-generator',
    backToTop: 'Volver arriba',
  },
  {
    path: '/en/projects/questboard',
    navigation: 'Case study navigation',
    home: 'Home',
    homePath: '/en',
    next: 'DuckyArena',
    nextPath: '/en/projects/duckyarena',
    backToTop: 'Back to top',
  },
  {
    path: '/es/projects/questboard',
    navigation: 'Navegación del caso de estudio',
    home: 'Inicio',
    homePath: '/es',
    next: 'DuckyArena',
    nextPath: '/es/projects/duckyarena',
    backToTop: 'Volver arriba',
  },
] as const;

for (const route of caseStudyNavigation) {
  test(`${route.path} provides localized bottom navigation`, async ({
    page,
  }) => {
    await page.goto(route.path);
    const navigation = page.getByRole('navigation', {
      name: route.navigation,
    });

    await expect(
      navigation.getByRole('link', { name: route.home }),
    ).toHaveAttribute('href', route.homePath);
    await expect(
      navigation.getByRole('link', { name: route.next }),
    ).toHaveAttribute('href', route.nextPath);
    await expect(
      navigation.getByRole('link', { name: route.backToTop }),
    ).toHaveAttribute('href', '#top');
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
    eyebrow: 'Selected project',
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
    eyebrow: 'Proyecto seleccionado',
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
    await expect(productImage).toHaveAttribute('width', '845');
    await expect(productImage).toHaveAttribute('height', '1172');

    const topology = section.locator(
      `ol[aria-label="${preview.topologyLabel}"]`,
    );
    await expect(topology.getByRole('listitem')).toHaveText([
      preview.configureLabel,
      preview.generateLabel,
      'generatedData',
      `${preview.previewLabel}${preview.exportLabel}`,
    ]);

    const cta = section.getByRole('link', { name: new RegExp(preview.cta) });
    await expect(cta).toHaveAttribute(
      'href',
      `${preview.path}/projects/devdata-generator`,
    );

    const repository = section.getByRole('link', {
      name: /Repository|Repositorio/,
    });
    await expect(repository).toHaveAttribute(
      'href',
      'https://github.com/Martret92/devdata-generator',
    );
    await expect(repository).toHaveAttribute('target', '_blank');
    await expect(repository).toHaveAttribute('rel', 'noopener noreferrer');
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

for (const path of ['/en', '/es']) {
  test(`${path} orders QuestBoard before DuckyArena and DevData`, async ({
    page,
  }) => {
    await page.goto(path);

    const projects = page.locator(
      '[data-questboard-home-preview], [data-duckyarena-home-preview], [data-home-project-preview]',
    );
    await expect(projects).toHaveCount(3);
    expect(
      await projects.evaluateAll((nodes) =>
        nodes.map((node) =>
          node.hasAttribute('data-questboard-home-preview')
            ? 'questboard'
            : node.hasAttribute('data-duckyarena-home-preview')
              ? 'duckyarena'
              : 'devdata-generator',
        ),
      ),
    ).toEqual(['questboard', 'duckyarena', 'devdata-generator']);
  });
}

test('language switching preserves the project route', async ({ page }) => {
  await page.goto('/en/projects/devdata-generator');
  await page.getByRole('link', { name: 'Español' }).click();
  await expect(page).toHaveURL(/\/es\/projects\/devdata-generator\/?$/);

  await page.getByRole('link', { name: 'English' }).click();
  await expect(page).toHaveURL(/\/en\/projects\/devdata-generator\/?$/);

  await page.goto('/en/projects/questboard');
  await page.getByRole('link', { name: 'Español' }).click();
  await expect(page).toHaveURL(/\/es\/projects\/questboard\/?$/);

  await page.getByRole('link', { name: 'English' }).click();
  await expect(page).toHaveURL(/\/en\/projects\/questboard\/?$/);
});

const questBoardRoutes = [
  {
    homePath: '/en',
    projectPath: '/en/projects/questboard',
    cta: 'Explore case study',
    systemLabel: 'The system',
    narrative:
      'Reliable workflows are built from explicit states, rules and transitions.',
    evidence: 'Engineering evidence',
    workflow: 'Explicit workflow',
    dependencies: 'Dependency-aware progression',
    permissions: 'Contextual permissions and invariants',
    challenge: 'Engineering challenge',
    docs: 'Live API Docs',
  },
  {
    homePath: '/es',
    projectPath: '/es/projects/questboard',
    cta: 'Explorar caso de estudio',
    systemLabel: 'El sistema',
    narrative:
      'Los flujos fiables se construyen con estados, reglas y transiciones explícitas.',
    evidence: 'Evidencia de ingeniería',
    workflow: 'Flujo explícito',
    dependencies: 'Progresión basada en dependencias',
    permissions: 'Permisos contextuales e invariantes',
    challenge: 'Reto de ingeniería',
    docs: 'Documentación de la API',
  },
] as const;

for (const route of questBoardRoutes) {
  test(`${route.homePath} links to the localized QuestBoard story`, async ({
    page,
  }) => {
    await page.goto(route.homePath);
    const preview = page.locator('[data-questboard-home-preview]');
    await expect(
      preview.getByRole('heading', { name: 'QuestBoard' }),
    ).toBeVisible();
    await expect(preview).toContainText(route.systemLabel);
    await expect(preview).toContainText(route.narrative);
    await expect(
      preview.getByRole('heading', { name: route.evidence }),
    ).toBeVisible();
    const workflow = preview.getByRole('list', {
      name: /QuestBoard workflow|Flujo de QuestBoard/,
    });
    await expect(workflow).toContainText('BACKLOG');
    await expect(workflow).toContainText('READY');
    await expect(workflow).toContainText('IN_PROGRESS');
    await expect(workflow).toContainText('REVIEW');
    await expect(workflow).toContainText('DONE');
    await expect(
      preview.getByRole('link', { name: new RegExp(route.cta) }),
    ).toHaveAttribute('href', route.projectPath);
    const repositoryLink = preview.getByRole('link', {
      name: /Repository|Repositorio/,
    });
    await expect(repositoryLink).toHaveAttribute(
      'href',
      'https://github.com/Martret92/questboard',
    );
    await expect(repositoryLink).toHaveAttribute('target', '_blank');
    await expect(repositoryLink).toHaveAttribute('rel', 'noopener noreferrer');

    await page.goto(route.projectPath);
    const caseStudy = page.locator('[data-questboard-case-study]');
    for (const heading of [
      route.workflow,
      route.dependencies,
      route.permissions,
      route.challenge,
    ]) {
      await expect(
        caseStudy.getByRole('heading', { name: heading }),
      ).toBeVisible();
    }
    await expect(caseStudy).toContainText('QuestEvent');
    await expect(caseStudy).toContainText('SELECT FOR UPDATE');

    const repositoryLinks = caseStudy.getByRole('link', {
      name: /View repository|Ver repositorio/,
    });
    await expect(repositoryLinks).toHaveCount(2);
    for (const link of await repositoryLinks.all()) {
      await expect(link).toHaveAttribute(
        'href',
        'https://github.com/Martret92/questboard',
      );
      await expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    }

    const docsLinks = caseStudy.getByRole('link', { name: route.docs });
    await expect(docsLinks).toHaveCount(2);
    for (const link of await docsLinks.all()) {
      await expect(link).toHaveAttribute(
        'href',
        'https://questboard-4tnl.onrender.com/api/docs/',
      );
    }
  });
}

test('QuestBoard remains readable without mobile overflow', async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/en/projects/questboard');

  await expect(
    page.getByRole('heading', { name: 'Dependency-aware progression' }),
  ).toBeVisible();
  expect(
    await page.evaluate(
      () =>
        document.documentElement.scrollWidth <=
        document.documentElement.clientWidth,
    ),
  ).toBe(true);
});

const duckyArenaRoutes = [
  {
    path: '/en',
    projectPath: '/en/projects/duckyarena',
    cta: 'Explore case study',
    collaboration: /collaborative academic foundation/,
    contribution: 'My contribution · Professionalization',
    authority: 'Server authority and realtime architecture',
    quality: 'Quality and evidence',
    imageAlt: /DuckyArena combat screen with two Duckies/,
    alternate: 'Español',
    alternateProjectPath: /\/es\/projects\/duckyarena\/?$/,
    alternateBack: 'Volver al inicio',
    alternateHomePath: /\/es\/?$/,
  },
  {
    path: '/es',
    projectPath: '/es/projects/duckyarena',
    cta: 'Explorar caso de estudio',
    collaboration: /base académica colaborativa/,
    contribution: 'Mi contribución · Profesionalización',
    authority: 'Autoridad del servidor y arquitectura realtime',
    quality: 'Calidad y evidencia',
    imageAlt: /Pantalla de combate de DuckyArena con dos Duckies/,
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
    await expect(preview).toContainText(
      /private-room 3v3|partidas 3v3 en salas privadas/,
    );
    await expect(
      preview.getByRole('link', { name: new RegExp(route.cta) }),
    ).toHaveAttribute('href', route.projectPath);

    await page.goto(route.projectPath);
    const caseStudy = page.locator('[data-duckyarena-case-study]');
    await expect(caseStudy).toContainText(route.collaboration);
    await expect(
      caseStudy.getByRole('heading', { name: route.contribution }),
    ).toBeVisible();
    await expect(
      caseStudy.getByRole('heading', { name: route.authority }),
    ).toBeVisible();
    await expect(
      caseStudy.getByRole('heading', { name: route.quality }),
    ).toBeVisible();
    await expect(caseStudy).toContainText('64');
    await expect(caseStudy).toContainText('Socket.IO');

    const screenshots = caseStudy.getByRole('img');
    await expect(screenshots).toHaveCount(5);
    await expect(
      caseStudy.getByRole('img', { name: route.imageAlt }),
    ).toHaveAttribute(
      'src',
      '/images/projects/duckyarena/04-combat-redacted.jpg',
    );
    await expect(
      caseStudy.getByRole('img', { name: route.imageAlt }),
    ).toHaveAttribute('loading', 'eager');
    await expect(
      caseStudy.getByRole('img', { name: route.imageAlt }),
    ).toHaveAttribute('fetchpriority', 'high');
    await expect(
      caseStudy.getByRole('img', { name: route.imageAlt }),
    ).toHaveAttribute(
      'srcset',
      /04-combat-redacted-1000\.jpg 1000w.*04-combat-redacted\.jpg 1425w/,
    );

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
    const externalLinks = caseStudy.locator('a[target="_blank"]');
    await expect(externalLinks).toHaveCount(2);
    for (const link of await externalLinks.all()) {
      await expect(link).toHaveAttribute(
        'href',
        'https://github.com/Martret92/DuckyArena',
      );
      await expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    }
    await expect(caseStudy).not.toContainText(
      /Live Demo|Play Now|Ver demo|Jugar ahora|production-ready/i,
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
    page.getByRole('heading', {
      name: 'Server authority and realtime architecture',
    }),
  ).toBeVisible();
  expect(
    await page.evaluate(
      () =>
        document.documentElement.scrollWidth <=
        document.documentElement.clientWidth,
    ),
  ).toBe(true);
});
