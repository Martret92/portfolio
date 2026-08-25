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

Astro static generation, strict TypeScript, zero client JavaScript, no third-party fonts, no animation dependency and existing Lighthouse thresholds remain unchanged. V0 does not implement the final Home IA, Living System, flagship project treatments, sticky/active navigation, CV preview, copy-email behavior or signature motion.
