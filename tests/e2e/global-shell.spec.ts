import { expect, test } from '@playwright/test';

const homes = [
  {
    path: '/en',
    navigation: 'Primary navigation',
    links: {
      Work: '/en#work',
      Stack: '/en#stack',
      About: '/en#about',
      CV: '/en#cv',
      Contact: '/en#contact',
    },
  },
  {
    path: '/es',
    navigation: 'Navegación principal',
    links: {
      Proyectos: '/es#work',
      Stack: '/es#stack',
      'Sobre mí': '/es#about',
      CV: '/es#cv',
      Contacto: '/es#contact',
    },
  },
] as const;

for (const home of homes) {
  test(`${home.path} exposes the persistent localized shell`, async ({
    page,
  }) => {
    await page.goto(home.path);

    const header = page.locator('[data-site-header]');
    await expect(header).toBeVisible();
    expect(
      await header.evaluate((element) => getComputedStyle(element).position),
    ).toBe('sticky');

    const navigation = page.getByRole('navigation', {
      name: home.navigation,
    });
    for (const [label, href] of Object.entries(home.links)) {
      await expect(
        navigation.getByRole('link', { name: label }),
      ).toHaveAttribute('href', href);
    }

    for (const id of ['work', 'stack', 'about', 'cv', 'contact']) {
      await expect(page.locator(`#${id}`)).toHaveCount(1);
    }

    expect(
      await page
        .locator('#work, #stack, #about, #cv, #contact')
        .evaluateAll((sections) => sections.map((section) => section.id)),
    ).toEqual(['work', 'stack', 'about', 'cv', 'contact']);
  });
}

test('Home section state is progressively enhanced and hash-aware', async ({
  page,
}) => {
  await page.goto('/en#cv');

  await expect(
    page
      .getByRole('navigation', { name: 'Primary navigation' })
      .getByRole('link', { name: 'CV' }),
  ).toHaveAttribute('aria-current', 'location');

  await page
    .getByRole('navigation', { name: 'Primary navigation' })
    .getByRole('link', { name: 'Contact' })
    .click();
  await expect(
    page
      .getByRole('navigation', { name: 'Primary navigation' })
      .getByRole('link', { name: 'Contact' }),
  ).toHaveAttribute('aria-current', 'location');
});

test('active section follows the navigation and document order', async ({
  page,
}) => {
  await page.goto('/en');
  const navigation = page.getByRole('navigation', {
    name: 'Primary navigation',
  });

  for (const label of ['Work', 'Stack', 'About', 'CV', 'Contact']) {
    const link = navigation.getByRole('link', { name: label, exact: true });
    await link.click();
    await expect(link).toHaveAttribute('aria-current', 'location');
  }
});

test('shell navigation remains keyboard accessible', async ({ page }) => {
  await page.goto('/en');

  await page.keyboard.press('Tab');
  await page.keyboard.press('Tab');
  await expect(
    page.getByRole('link', { name: 'Jaime Martret — Home' }),
  ).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(
    page
      .getByRole('navigation', { name: 'Primary navigation' })
      .getByRole('link', { name: 'Work' }),
  ).toBeFocused();
});

test('mobile shell stays usable without page overflow', async ({ page }) => {
  for (const width of [390, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 844 });
    await page.goto('/en');

    const contact = page
      .getByRole('navigation', { name: 'Primary navigation' })
      .getByRole('link', { name: 'Contact' });
    await contact.focus();
    await expect(contact).toBeFocused();
    const dimensions = await page.evaluate(() => ({
      viewport: window.innerWidth,
      page: document.documentElement.scrollWidth,
    }));
    expect(
      dimensions.page <= dimensions.viewport,
      `${width}px viewport rendered a ${dimensions.page}px page`,
    ).toBe(true);
  }
});

test('reduced motion disables native smooth scrolling without losing state', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/en#about');

  expect(
    await page.evaluate(
      () => getComputedStyle(document.documentElement).scrollBehavior,
    ),
  ).toBe('auto');
  await expect(
    page
      .getByRole('navigation', { name: 'Primary navigation' })
      .getByRole('link', { name: 'About' }),
  ).toHaveAttribute('aria-current', 'location');
});

test('case studies inherit the global shell without changing project navigation', async ({
  page,
}) => {
  await page.goto('/en/projects/questboard');

  await expect(page.locator('[data-site-header]')).toBeVisible();
  await expect(
    page
      .getByRole('navigation', { name: 'Primary navigation' })
      .getByRole('link', { name: 'Work' }),
  ).toHaveAttribute('href', '/en#work');
  await expect(
    page.getByRole('navigation', { name: 'Case study navigation' }),
  ).toBeVisible();
  await expect(page.getByRole('contentinfo')).toContainText('Jaime Martret');
});
