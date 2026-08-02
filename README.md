# Professional Portfolio

Foundation for a bilingual professional developer portfolio. The project is intentionally static-first: Astro owns pages and content; React is reserved for rich interactive islands.

> **Current milestone:** M0 — Foundation. No production professional copy or final visual design is included yet.

## Toolchain

- Node.js 24 LTS (pinned in `.nvmrc`)
- pnpm
- Astro 7
- React 19
- TypeScript (`strictest` Astro baseline)
- ESLint + Prettier
- Vitest + Testing Library
- Playwright (prepared for the vertical slice)
- GitHub Actions

## Requirements

1. Install Node matching `.nvmrc`.
2. Enable Corepack: `corepack enable`.
3. Activate the package manager declared in `package.json`.
4. Install dependencies with `pnpm install`.

## Commands

- `pnpm dev` — local Astro development server
- `pnpm build` — static production build
- `pnpm preview` — preview the production build
- `pnpm check` — Astro / TypeScript checks
- `pnpm lint` — lint source files
- `pnpm format:check` — verify formatting
- `pnpm test:unit` — unit/component test runner
- `pnpm test:e2e` — Playwright E2E tests (introduced in the MVP vertical slice)
- `pnpm quality` — M0 local quality gate

## Architecture

```text
Astro
├── pages / layouts / content / SEO / localization
└── React islands
    └── complex client-side interactions only
```

See [`docs/adr/0001-static-first-astro-react.md`](docs/adr/0001-static-first-astro-react.md) for the first architecture decision record.

## Repository structure

- `src/components/` — presentation-oriented Astro components
- `src/islands/` — React components requiring client state/hydration
- `src/layouts/` — document/page layouts
- `src/content/` — localized editorial content
- `src/i18n/` — UI translations and locale helpers
- `src/lib/` — UI-independent logic
- `src/styles/` — design tokens and global foundations
- `tests/e2e/` — browser-level critical journeys
- `docs/adr/` — architecture decision records

## M0 boundary

M0 deliberately does **not** contain the final Home, DevData case study, Product/System interaction, Architecture Explorer, final visual identity, or professional copy. Those begin in the MVP vertical slice after the foundation is validated.
