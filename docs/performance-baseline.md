# Performance baseline

This baseline measures the current localized MVP with Lighthouse CI and reports
the JavaScript emitted by the Astro static build. Lighthouse runs twice against
each primary localized route using the local preview server:

- `/en`
- `/es`
- `/en/projects/devdata-generator`
- `/es/projects/devdata-generator`

## Thresholds

The initial Lighthouse assertions require performance and best practices scores
of at least 0.90 and 0.95 respectively, accessibility of at least 0.95, and SEO
of at least 0.90. Largest Contentful Paint must be at most 2.5 seconds,
Cumulative Layout Shift at most 0.1, and Total Blocking Time at most 200 ms.

The crawlability audit is temporarily excluded because every page intentionally
uses development `noindex` metadata. The SEO category threshold remains 0.90;
crawlability must be restored to the baseline when production indexing is
enabled.

These are repeatable lab measurements, not real-user Core Web Vitals. In
particular, a static Lighthouse run cannot validate field Interaction to Next
Paint (INP); the project target remains at most 200 ms and will require real-user
monitoring later.

## Commands

- `pnpm test:perf` builds the site, runs Lighthouse CI, and reports bundle sizes.
- `pnpm test:perf:ci` is the CI entry point for the same baseline.
- `pnpm report:bundle` reports raw and gzip sizes for built JavaScript in
  `dist/`, largest first.

The bundle report is informational. Approximately 150–200 KiB compressed
initial JavaScript is an alarm threshold rather than a target; route-level
delivery should also be inspected before treating the aggregate build total as
initial payload.

The current static build emits one JavaScript asset totaling 187.07 KiB raw and
58.23 KiB gzip. This aggregate build figure is the initial reporting baseline,
not a claim that every route downloads the full asset.

## Initial local result

Two runs per route on 3 August 2026 produced the following representative
scores and metric ranges:

| Route                            | Performance | Accessibility | Best practices | SEO  | LCP range  | CLS range | TBT  |
| -------------------------------- | ----------- | ------------- | -------------- | ---- | ---------- | --------- | ---- |
| `/en`                            | 1.00        | 1.00          | 0.96           | 1.00 | 903–960 ms | 0         | 0 ms |
| `/es`                            | 1.00        | 1.00          | 0.96           | 1.00 | 960 ms     | 0         | 0 ms |
| `/en/projects/devdata-generator` | 1.00        | 1.00          | 0.96           | 1.00 | 900–960 ms | 0–0.0081  | 0 ms |
| `/es/projects/devdata-generator` | 1.00        | 1.00          | 0.96           | 1.00 | 900–960 ms | 0         | 0 ms |

Local results can be compared manually with the deployed site at
<https://portfolio-98d.pages.dev>, but this document does not claim production
field data.
