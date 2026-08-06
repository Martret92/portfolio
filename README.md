# Jaime Martret — Professional Portfolio

## Overview

Bilingual professional developer portfolio for Jaime Martret. It combines a concise professional profile with two verified project stories:

- **DevData Generator**, a linear static technical and editorial case study explaining its shared generated result, predictable invalidation, output formats and browser-only architecture.
- **DuckyArena**, a distinct static technical and editorial case study that separates the collaborative project architecture from Jaime's verified backend and integration contribution.

The site is statically generated and requires no client-side JavaScript. Its content is designed for direct reading, with concise professional context on Home and deeper verified technical evidence in each case study.

## Production

- Production URL: [https://jaimemartret.com](https://jaimemartret.com)
- Production deployment: Cloudflare Pages from `main`
- Pull requests: Cloudflare Pages preview deployments

## Architecture

Astro owns routing, layouts, localized content and static generation. TypeScript extends Astro's `strictest` configuration. Home and both project case studies are rendered as static Astro, HTML and CSS.

Localized pages are generated at build time for English and Spanish. Shared project routes use stable untranslated slugs. The current production build contains no React runtime, interactive islands, `client:*` directives or emitted client JavaScript.

See [the superseded static-first architecture decision](docs/adr/0001-static-first-astro-react.md) for the original framework boundary and its current status.

## Stack

- Astro 7
- `@astrojs/sitemap`
- TypeScript
- HTML and CSS
- Node.js 24
- pnpm 11
- Vitest, jsdom and jest-dom matchers
- Playwright and axe-core for browser and accessibility checks
- Lighthouse CI
- ESLint and Prettier
- GitHub Actions
- Cloudflare Pages

## Routes and localization

- `/` redirects to the default English locale at `/en`
- `/en` and `/es`
- `/en/projects/devdata-generator` and `/es/projects/devdata-generator`
- `/en/projects/duckyarena` and `/es/projects/duckyarena`

English and Spanish routes are generated symmetrically. Language switching preserves the equivalent route, and production metadata includes localized canonical and `hreflang` URLs.

## Development

Install Node.js 24 as pinned in `.nvmrc`, enable Corepack, and install the declared pnpm version:

```sh
corepack enable
pnpm install
```

Common commands:

```sh
pnpm dev                 # local development server
pnpm build               # static production build
pnpm preview             # preview the production build
pnpm check               # Astro and TypeScript diagnostics
pnpm lint                # ESLint
pnpm format              # apply Prettier formatting
pnpm format:check        # verify formatting
pnpm test:unit           # Vitest unit/component tests
pnpm test:e2e            # Playwright browser and axe tests
pnpm test:perf           # Lighthouse CI and bundle report
pnpm report:bundle       # built JavaScript raw/gzip sizes
pnpm quality             # checks, lint, formatting, unit tests and build
```

## Quality

The quality baseline combines:

- Astro/TypeScript diagnostics
- ESLint
- Prettier
- Vitest unit tests with jsdom and jest-dom matchers
- Playwright E2E coverage
- axe automated accessibility checks
- Lighthouse CI performance/accessibility/best-practices/SEO assertions
- deterministic raw and gzip JavaScript reporting

## CI

GitHub Actions runs three independent jobs:

- `quality`
- `e2e`
- `performance`

The jobs install the pinned Node/pnpm toolchain. Browser jobs install only Playwright Chromium.

## Deployment

Merges to `main` produce the Cloudflare Pages production deployment. Pull requests receive isolated preview deployments. Custom-domain and DNS configuration remain in Cloudflare rather than repository code.

## Project structure

- `src/pages/` — localized static routes, project routes and 404
- `src/layouts/` — shared document layout and production metadata
- `src/components/` — static Astro presentation and case-study components
- `src/content/` — localized professional content, project entries and verified case-study data
- `src/i18n/` — locale configuration, translations and route helpers
- `src/lib/` — content validation and UI-independent logic
- `src/styles/` — tokens and shared visual foundations
- `public/` — static assets, CV, favicon, robots and Cloudflare redirect rules
- `tests/e2e/` — routing, static content, accessibility, mobile and no-JS journeys
- `docs/` — current and historical architecture, UI-foundation and performance documentation
