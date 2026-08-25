import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';

import { expect, test } from '@playwright/test';

const origin = 'https://jaimemartret.com';
const socialImage = `${origin}/social/jaime-martret-portfolio-og.png`;

const localizedRoutes = [
  '/en',
  '/es',
  '/en/projects/devdata-generator',
  '/es/projects/devdata-generator',
  '/en/projects/questboard',
  '/es/projects/questboard',
  '/en/projects/duckyarena',
  '/es/projects/duckyarena',
] as const;

for (const path of localizedRoutes) {
  test(`${path} exposes production discovery and social metadata`, async ({
    page,
  }) => {
    await page.goto(path);

    const equivalentPath = path.replace(/^\/(en|es)/, '');
    const englishUrl = `${origin}/en${equivalentPath}`;
    const spanishUrl = `${origin}/es${equivalentPath}`;

    await expect(page.locator('meta[name="robots"]')).toHaveCount(0);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      'href',
      `${origin}${path}`,
    );
    await expect(
      page.locator('link[rel="alternate"][hreflang="en"]'),
    ).toHaveAttribute('href', englishUrl);
    await expect(
      page.locator('link[rel="alternate"][hreflang="es"]'),
    ).toHaveAttribute('href', spanishUrl);
    await expect(
      page.locator('link[rel="alternate"][hreflang="x-default"]'),
    ).toHaveAttribute('href', englishUrl);

    await expect(page.locator('meta[property="og:type"]')).toHaveAttribute(
      'content',
      'website',
    );
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute(
      'content',
      /.+/,
    );
    await expect(
      page.locator('meta[property="og:description"]'),
    ).toHaveAttribute('content', /.+/);
    await expect(page.locator('meta[property="og:url"]')).toHaveAttribute(
      'content',
      `${origin}${path}`,
    );
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
      'content',
      socialImage,
    );
    await expect(page.locator('meta[property="og:site_name"]')).toHaveAttribute(
      'content',
      'Jaime Martret — Portfolio',
    );

    await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute(
      'content',
      'summary_large_image',
    );
    await expect(page.locator('meta[name="twitter:title"]')).toHaveAttribute(
      'content',
      /.+/,
    );
    await expect(
      page.locator('meta[name="twitter:description"]'),
    ).toHaveAttribute('content', /.+/);
    await expect(page.locator('meta[name="twitter:image"]')).toHaveAttribute(
      'content',
      socialImage,
    );
    await expect(page.locator('link[rel="icon"]')).toHaveAttribute(
      'href',
      '/favicon.svg',
    );
  });
}

test('root fallback and Cloudflare rule both target English', () => {
  const rootDocument = readFileSync(resolve('dist/index.html'), 'utf8');
  const redirects = readFileSync(resolve('dist/_redirects'), 'utf8');

  expect(rootDocument).toContain('http-equiv="refresh" content="0;url=/en"');
  expect(rootDocument).not.toContain('Temporary language entry');
  expect(redirects.trim()).toBe('/ /en 301');
});

test('robots and sitemap expose only localized production routes', async ({
  request,
}) => {
  const robots = await request.get('/robots.txt');
  expect(robots.ok()).toBe(true);
  const robotsBody = await robots.text();
  expect(robotsBody).toMatch(/User-agent: \*\s+Allow: \//);
  expect(robotsBody).toMatch(
    /Sitemap: https:\/\/jaimemartret\.com\/sitemap-index\.xml/,
  );

  const sitemapIndex = await request.get('/sitemap-index.xml');
  expect(sitemapIndex.ok()).toBe(true);
  expect(await sitemapIndex.text()).toContain(
    'https://jaimemartret.com/sitemap-0.xml',
  );

  const sitemap = await request.get('/sitemap-0.xml');
  const sitemapBody = await sitemap.text();
  expect(sitemap.ok()).toBe(true);
  for (const path of localizedRoutes) {
    expect(sitemapBody).toContain(`<loc>${origin}${path}</loc>`);
  }
  expect(sitemapBody).not.toContain(`<loc>${origin}/</loc>`);
  expect(sitemapBody).not.toContain(`${origin}/404`);
  expect(sitemapBody).not.toContain('/design-system');
});

test('production build omits development-only prototype routes', () => {
  expect(existsSync(resolve('dist/en/design-system/index.html'))).toBe(false);
  expect(existsSync(resolve('dist/es/design-system/index.html'))).toBe(false);

  const htmlPages = readdirSync(resolve('dist'), { recursive: true }).filter(
    (path) => path.toString().endsWith('.html'),
  );
  expect(htmlPages).toHaveLength(10);
});

test('static production assets and stable CV remain available', async ({
  request,
}) => {
  for (const path of ['/favicon.svg', '/jaime-martret-full-stack-cv.pdf']) {
    const response = await request.get(path);
    expect(response.ok()).toBe(true);
  }
});

test('custom 404 provides accessible routes to both locales', async ({
  page,
}) => {
  await page.goto('/404');

  await expect(
    page.getByRole('heading', {
      level: 1,
      name: 'Page not found / Página no encontrada',
    }),
  ).toBeVisible();
  await expect(
    page.getByRole('link', { name: 'English portfolio' }),
  ).toHaveAttribute('href', '/en');
  await expect(
    page.getByRole('link', { name: 'Portfolio en español' }),
  ).toHaveAttribute('href', '/es');
});
