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
    heading: 'DevData Generator placeholder',
  },
  {
    path: '/es/projects/devdata-generator',
    heading: 'Marcador temporal de DevData Generator',
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

test('root remains a static language entry', async ({ page }) => {
  const response = await page.goto('/');

  expect(response?.ok()).toBe(true);
  await expect(
    page.getByRole('heading', { level: 1, name: 'Temporary language entry' }),
  ).toBeVisible();
  await expect(page.getByRole('link', { name: 'English' })).toHaveAttribute(
    'href',
    '/en',
  );
  await expect(page.getByRole('link', { name: 'Español' })).toHaveAttribute(
    'href',
    '/es',
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

test('Home and project navigation form a complete localized flow', async ({
  page,
}) => {
  await page.goto('/en');
  await page.getByRole('link', { name: /Inspect the case study/ }).click();
  await expect(page).toHaveURL(/\/en\/projects\/devdata-generator\/?$/);

  await page.getByRole('link', { name: 'Back to Home' }).click();
  await expect(page).toHaveURL(/\/en\/?$/);
});

test('Spanish Home and project navigation remain localized', async ({
  page,
}) => {
  await page.goto('/es');
  await page
    .getByRole('link', { name: /Inspeccionar el caso de estudio/ })
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
    productLabel: 'Product',
    productSummary:
      'Choose a template, fields and quantity, then generate a reusable dataset.',
    systemLabel: 'System',
    systemSummary:
      'One validated configuration produces one shared generatedData result for every preview and export path.',
    topologyLabel: 'DevData system flow',
    configureLabel: 'Configure',
    generateLabel: 'Generate',
    previewLabel: 'Preview',
    exportLabel: 'Export',
    cta: 'Inspect the case study',
    alt: /Users template and three generated records/,
  },
  {
    path: '/es',
    eyebrow: 'Proyecto destacado',
    summary:
      'Configura datasets realistas una vez, inspecciona un único resultado generado y reutilízalo en tabla, JSON, CSV y SQL.',
    productLabel: 'Producto',
    productSummary:
      'Elige una plantilla, los campos y la cantidad, y genera un dataset reutilizable.',
    systemLabel: 'Sistema',
    systemSummary:
      'Una configuración validada produce un único resultado generatedData compartido por todas las vistas y exportaciones.',
    topologyLabel: 'Flujo del sistema de DevData',
    configureLabel: 'Configurar',
    generateLabel: 'Generar',
    previewLabel: 'Vista previa',
    exportLabel: 'Exportar',
    cta: 'Inspeccionar el caso de estudio',
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
      section.getByText(preview.productLabel, { exact: true }),
    ).toBeVisible();
    await expect(
      section.getByRole('heading', { level: 3, name: preview.productSummary }),
    ).toBeVisible();
    await expect(
      section.getByText(preview.systemLabel, { exact: true }),
    ).toBeVisible();
    await expect(
      section.getByRole('heading', { level: 3, name: preview.systemSummary }),
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

test('language switching preserves the project route', async ({ page }) => {
  await page.goto('/en/projects/devdata-generator');
  await page.getByRole('link', { name: 'Español' }).click();
  await expect(page).toHaveURL(/\/es\/projects\/devdata-generator\/?$/);

  await page.getByRole('link', { name: 'English' }).click();
  await expect(page).toHaveURL(/\/en\/projects\/devdata-generator\/?$/);
});
