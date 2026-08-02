# ADR-001: Static-first Astro with React islands

- **Status:** Accepted
- **Date:** 2026-08-02

## Context

The portfolio is content-heavy, bilingual, SEO-sensitive, performance-sensitive, and accessibility-sensitive. Most pages are editorial/static, while a small number of features (notably Product/System inspection and architecture exploration) require richer client-side state.

## Decision

Use Astro as the document, routing, content, and static-rendering layer. Generate the site statically. Use React only for interactive islands that justify client-side state.

Use TypeScript with Astro's `strictest` baseline and keep the dependency set deliberately small.

## Alternatives considered

### React + Vite SPA

Rejected as the primary architecture because it would make client-side JavaScript the default for content that does not need it and would require more manual work around prerendering, localized static routes, and SEO.

### Next.js

A strong alternative, but broader than current requirements. The portfolio does not currently need server rendering, server actions, API routes, authentication, or a server runtime.

## Consequences

### Positive

- Static HTML by default.
- Low client-side JavaScript baseline.
- React remains available for meaningful interactive work.
- Good fit for localized case studies and SEO.
- Portable static deployment.

### Trade-offs

- Adds Astro as a framework alongside React.
- Interactive boundaries must be designed deliberately.
- If future requirements demand extensive shared client state or dynamic server behavior, this decision should be revisited.
