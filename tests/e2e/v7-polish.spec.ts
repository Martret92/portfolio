import { expect, test, type Page } from '@playwright/test';

const waitForScrollToSettle = async (page: Page) => {
  await page.evaluate(
    () =>
      new Promise<void>((resolve) => {
        let previousY = window.scrollY;
        let stableFrames = 0;

        const check = () => {
          const currentY = window.scrollY;
          stableFrames = currentY === previousY ? stableFrames + 1 : 0;
          previousY = currentY;

          if (stableFrames >= 6) {
            resolve();
            return;
          }

          requestAnimationFrame(check);
        };

        requestAnimationFrame(check);
      }),
  );
};

for (const width of [1440, 390, 360]) {
  test(`Home anchor clearance uses one responsive offset at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/en#stack');
    await waitForScrollToSettle(page);

    const directHashClearance = await page.evaluate(() => {
      const header = document.querySelector('[data-site-header]');
      const target = document.querySelector('#stack');

      if (
        !(header instanceof HTMLElement) ||
        !(target instanceof HTMLElement)
      ) {
        throw new Error('Expected header and stack target');
      }

      return (
        target.getBoundingClientRect().top -
        header.getBoundingClientRect().bottom
      );
    });

    expect(directHashClearance).toBeGreaterThanOrEqual(0);
    expect(directHashClearance).toBeLessThanOrEqual(48);

    await page
      .getByRole('navigation', { name: 'Primary navigation' })
      .getByRole('link', { name: 'About', exact: true })
      .click();
    await waitForScrollToSettle(page);

    const clickedClearance = await page.evaluate(() => {
      const header = document.querySelector('[data-site-header]');
      const target = document.querySelector('#about');

      if (
        !(header instanceof HTMLElement) ||
        !(target instanceof HTMLElement)
      ) {
        throw new Error('Expected header and about target');
      }

      return (
        target.getBoundingClientRect().top -
        header.getBoundingClientRect().bottom
      );
    });

    expect(clickedClearance).toBeGreaterThanOrEqual(0);
    expect(clickedClearance).toBeLessThanOrEqual(48);
  });
}

for (const home of [
  {
    path: '/en',
    navigation: 'Primary navigation',
    identity: 'Jaime Martret — Home',
    contact: 'Contact',
    email: 'jaime.martret@gmail.com',
  },
  {
    path: '/es',
    navigation: 'Navegación principal',
    identity: 'Jaime Martret — Inicio',
    contact: 'Contacto',
    email: 'jaime.martret@gmail.com',
  },
] as const) {
  test(`${home.path} keeps key links at least 44 by 44 CSS pixels`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: 360, height: 900 });
    await page.goto(home.path);

    const targets = [
      page.getByRole('link', { name: home.identity, exact: true }),
      page
        .getByRole('navigation', { name: home.navigation })
        .getByRole('link', { name: 'CV', exact: true }),
      page.getByRole('link', { name: home.email, exact: true }),
    ];

    for (const target of targets) {
      const box = await target.boundingBox();
      expect(box).not.toBeNull();
      expect(box!.width).toBeGreaterThanOrEqual(44);
      expect(box!.height).toBeGreaterThanOrEqual(44);
    }

    const navigation = page.getByRole('navigation', {
      name: home.navigation,
    });
    const contact = navigation.getByRole('link', {
      name: home.contact,
      exact: true,
    });
    const [navigationBox, contactBox] = await Promise.all([
      navigation.boundingBox(),
      contact.boundingBox(),
    ]);

    expect(navigationBox).not.toBeNull();
    expect(contactBox).not.toBeNull();
    expect(contactBox!.x).toBeGreaterThanOrEqual(navigationBox!.x);
    expect(contactBox!.x + contactBox!.width).toBeLessThanOrEqual(
      navigationBox!.x + navigationBox!.width + 1,
    );

    await contact.focus();
    await expect(contact).toBeFocused();
  });
}

test('representative pages remain free of document overflow at V7 widths', async ({
  page,
}) => {
  const routes = ['/en', '/es/projects/questboard'] as const;

  for (const route of routes) {
    for (const width of [1920, 640, 360]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(route);

      const dimensions = await page.evaluate(() => ({
        client: document.documentElement.clientWidth,
        scroll: document.documentElement.scrollWidth,
      }));

      expect(
        dimensions.scroll <= dimensions.client,
        `${route} overflowed at ${width}px: ${dimensions.scroll}px > ${dimensions.client}px`,
      ).toBe(true);
    }
  }
});
