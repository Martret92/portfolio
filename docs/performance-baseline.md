# Performance baseline

This document preserves the initial localized Lighthouse baseline and records
the current JavaScript bundle state. Lighthouse CI runs twice against each
primary localized route using the local preview server:

- `/en`
- `/es`
- `/en/projects/questboard`
- `/es/projects/questboard`
- `/en/projects/devdata-generator`
- `/es/projects/devdata-generator`
- `/en/projects/duckyarena`
- `/es/projects/duckyarena`

## Thresholds

The initial Lighthouse assertions require performance and best practices scores
of at least 0.90 and 0.95 respectively, accessibility of at least 0.95, and SEO
of at least 0.90. Largest Contentful Paint must be at most 2.5 seconds,
Cumulative Layout Shift at most 0.1, and Total Blocking Time at most 200 ms.

The production baseline includes Lighthouse's crawlability audit. Localized
pages are indexable and expose canonical and alternate-language metadata.

These are repeatable lab measurements, not real-user Core Web Vitals. In
particular, a static Lighthouse run cannot validate field Interaction to Next
Paint (INP); the project target remains at most 200 ms and will require real-user
monitoring later.

## Commands

- `pnpm test:perf` builds the site, runs Lighthouse CI, and reports bundle sizes.
- `pnpm test:perf:ci` is the CI entry point for the same baseline.
- `pnpm report:bundle` reports raw and gzip sizes for built JavaScript in
  `dist/`, largest first.

The bundle report is informational. The historical project used approximately
150–200 KiB compressed initial JavaScript as an alarm threshold rather than a
target; route-level delivery also needed inspection before treating an
aggregate build total as initial payload.

## Historical pre-CR2.5 bundle baseline

The earlier interactive DevData architecture emitted one JavaScript asset
totaling 187.07 KiB raw and 58.23 KiB gzip. This was an aggregate historical
reporting baseline, not a claim that every route downloaded the full asset.

## Current Portfolio v2 bundle state

After DevData became a static linear case study, the React integration and
framework runtime remained removed. Portfolio v2 later added two dependency-free
vanilla progressive enhancements:

- `section-navigation.js`: 2,992 bytes raw and 1,016 bytes gzip.
- `copy-email.js`: 1,212 bytes raw and 516 bytes gzip.
- Total own production JavaScript: 4,204 bytes raw and 1,532 bytes gzip.

The static content, navigation destinations and contact paths remain complete
without JavaScript. No framework or third-party runtime is shipped. These values
are verified by `pnpm report:bundle` against `dist/`.

## Historical initial local Lighthouse result

Two runs per route on 3 August 2026 produced the following representative
scores and metric ranges for the earlier baseline:

| Route                            | Performance | Accessibility | Best practices | SEO  | LCP range  | CLS range | TBT  |
| -------------------------------- | ----------- | ------------- | -------------- | ---- | ---------- | --------- | ---- |
| `/en`                            | 1.00        | 1.00          | 0.96           | 1.00 | 903–960 ms | 0         | 0 ms |
| `/es`                            | 1.00        | 1.00          | 0.96           | 1.00 | 960 ms     | 0         | 0 ms |
| `/en/projects/devdata-generator` | 1.00        | 1.00          | 0.96           | 1.00 | 900–960 ms | 0–0.0081  | 0 ms |
| `/es/projects/devdata-generator` | 1.00        | 1.00          | 0.96           | 1.00 | 900–960 ms | 0         | 0 ms |

Local results can be compared manually with the production site at
<https://jaimemartret.com>, but this document does not claim production field
data.
