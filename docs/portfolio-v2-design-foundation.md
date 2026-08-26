# Portfolio v2 design foundation

## Status and scope

V0 is an isolated visual prototype, not a production Home redesign. It validates a dark-first semantic token direction while the public portfolio keeps its current information architecture and light token activation.

## Visual north star

Professional clarity comes first. Deep navy-charcoal canvas, quiet neutral surfaces and deliberate typography provide calm structure. Electric blue, cyan and indigo add controlled technical energy; project colors remain locally scoped.

## Foundation roles

- **Palette:** canvas, base/subtle/raised surfaces, primary/muted/soft text, subtle/strong borders and global accent roles.
- **Typography:** system-safe display, body and mono families; responsive display, project, section, lead, body and metadata scales.
- **Surfaces:** open canvas sections, subtle grouping, selective raised evidence, transparent technical layers and bounded project-accent surfaces.
- **Interaction:** primary, secondary and editorial link treatments share touch-target, hover, active and focus-visible expectations.
- **Motion:** micro (180ms), reveal (480ms) and narrative (800ms) roles. Signature motion remains reserved. Reduced motion removes translation and collapses duration globally.

## Project accents

QuestBoard owns blue, cyan, indigo and violet within `[data-project='questboard']`. DuckyArena owns green, straw/gold and orange within `[data-project='duckyarena']`; team blue/red is reserved for team meaning. Project tokens must not leak into global UI.

## Responsive principles

Spacing and type scale fluidly; multi-column surfaces collapse intentionally; raised surfaces simplify; actions wrap while retaining 44px targets; evidence frames remain responsive without horizontal overflow.

## Guardrails

V0 preserved Astro static generation, strict TypeScript, zero client JavaScript, no third-party fonts, no animation dependency and the existing Lighthouse thresholds. It did not implement the final Home IA, Living System, flagship project treatments, sticky/active navigation, CV preview, copy-email behavior or signature motion.

## V1 global shell

V1 activates the approved dark semantic palette across production and introduces a sticky shared header and footer. Home navigation maps to `work`, `stack`, `about`, `cv` and `contact`; every destination remains a native localized anchor without JavaScript.

A small dependency-free `IntersectionObserver` enhancement applies `aria-current="location"` to the visible Home section. Mobile uses a compact two-row header with horizontally scrollable primary links rather than a disclosure menu. Shared responsive header-offset tokens protect anchor and focus destinations, while reduced motion disables smooth scrolling and decorative translation. The production JavaScript budget remains capped at 4 KiB gzip, with 6 KiB as the hard review threshold.

Living System, final Hero and Home composition, flagship project treatments, Stack redesign, CV preview, copy-email behavior and signature motion remain deferred.
