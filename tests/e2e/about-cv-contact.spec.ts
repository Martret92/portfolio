import { expect, test } from '@playwright/test';

const homes = [
  {
    path: '/en',
    about:
      'I like understanding the whole path from a product decision to the system that supports it.',
    previewAlt: 'First page preview of Jaime Martret’s CV',
    viewCv: 'View CV',
    download: 'Download PDF',
    copy: 'Copy email',
    copied: 'Copied ✓',
  },
  {
    path: '/es',
    about:
      'Me gusta comprender todo el recorrido entre una decisión de producto y el sistema que la sostiene.',
    previewAlt: 'Vista previa de la primera página del CV de Jaime Martret',
    viewCv: 'Ver CV',
    download: 'Descargar PDF',
    copy: 'Copiar email',
    copied: 'Copiado ✓',
  },
] as const;

for (const home of homes) {
  test(`${home.path} presents the final About, CV and Contact sequence`, async ({
    page,
  }) => {
    await page.goto(home.path);

    const about = page.locator('#about');
    const cv = page.locator('#cv');
    const contact = page.locator('#contact');

    await expect(about).toContainText(home.about);
    await expect(about).not.toContainText(
      /Build reliable systems|Construyo sistemas fiables|Technical capabilities|Capacidades técnicas/,
    );

    const preview = cv.getByRole('img', { name: home.previewAlt });
    await expect(preview).toHaveAttribute(
      'src',
      '/images/cv/jaime-martret-cv-first-page.jpg',
    );
    await expect(preview).toHaveAttribute('width', '1200');
    await expect(preview).toHaveAttribute('height', '1698');
    await expect(preview).toHaveAttribute('loading', 'lazy');
    await expect(preview).toHaveAttribute('decoding', 'async');
    await expect(cv.getByRole('link', { name: home.viewCv })).toHaveAttribute(
      'href',
      '/jaime-martret-full-stack-cv.pdf',
    );
    const download = cv.getByRole('link', { name: home.download });
    await expect(download).toHaveAttribute(
      'href',
      '/jaime-martret-full-stack-cv.pdf',
    );
    await expect(download).toHaveAttribute('download', '');
    await expect(cv.locator('iframe')).toHaveCount(0);

    const email = contact.getByRole('link', {
      name: 'jaime.martret@gmail.com',
    });
    await expect(email).toBeVisible();
    await expect(email).toHaveAttribute(
      'href',
      'mailto:jaime.martret@gmail.com',
    );
    await expect(
      contact.getByRole('button', { name: home.copy }),
    ).toBeVisible();
    await expect(contact.getByRole('link', { name: 'GitHub' })).toHaveAttribute(
      'href',
      'https://github.com/Martret92',
    );
    await expect(
      contact.getByRole('link', { name: 'LinkedIn' }),
    ).toHaveAttribute('href', 'https://www.linkedin.com/in/jaime-martret/');
    await expect(contact.locator('[role="status"]')).toHaveAttribute(
      'aria-live',
      'polite',
    );
    await expect(contact.locator('form')).toHaveCount(0);
    await expect(contact).not.toContainText(/captcha|phone|teléfono|\+34/i);

    expect(
      await page
        .locator('#about, #experience, #education, #cv, #contact')
        .evaluateAll((sections) => sections.map((section) => section.id)),
    ).toEqual(['about', 'experience', 'education', 'cv', 'contact']);
    await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
  });
}

test('Copy email progressively enhances the visible mail link', async ({
  page,
}) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: {
        writeText: (text: string) => {
          (window as typeof window & { copiedEmail?: string }).copiedEmail =
            text;
          return Promise.resolve();
        },
      },
    });
  });
  await page.goto('/en');

  const contact = page.locator('#contact');
  const button = contact.locator('[data-copy-email]');
  await expect(button).toHaveAccessibleName('Copy email');
  await button.click();

  await expect(button).toHaveText('Copied ✓');
  await expect(contact.locator('[role="status"]')).toHaveText('Copied ✓');
  expect(
    await page.evaluate(
      () => (window as typeof window & { copiedEmail?: string }).copiedEmail,
    ),
  ).toBe('jaime.martret@gmail.com');
});

test('About, CV and Contact remain complete without JavaScript', async ({
  browser,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto('/en');

  await expect(page.locator('#about')).toBeVisible();
  await expect(page.locator('#cv').getByRole('img')).toBeVisible();
  await expect(
    page.locator('#contact').getByRole('link', {
      name: 'jaime.martret@gmail.com',
    }),
  ).toBeVisible();
  await expect(page.getByRole('button', { name: 'Copy email' })).toBeHidden();

  await context.close();
});

test('V6 sections reflow without overflow at target widths', async ({
  page,
}) => {
  for (const width of [390, 768, 1024, 1280, 1440, 2560]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/en');
    await page.locator('#contact').scrollIntoViewIfNeeded();

    expect(
      await page.evaluate(
        () =>
          document.documentElement.scrollWidth <=
          document.documentElement.clientWidth,
      ),
    ).toBe(true);
  }
});
