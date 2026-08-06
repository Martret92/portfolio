# UI foundation

The visual foundation uses semantic CSS custom properties for color, typography,
spacing, shape, elevation, focus, motion, layering, layout and density. Tokens
describe roles rather than components so the same system can support multiple
page types without separate themes.

## Current production foundation

The current portfolio uses static editorial compositions for Home, DevData and
DuckyArena. Structure, spacing, rails, restrained borders and typography create
hierarchy while shared tokens keep the localized pages visually consistent.

DevData is now a linear case study and DuckyArena remains a separate static
technical and editorial case study. Neither requires interactive inspection,
and the production build emits 0 client JavaScript.

The baseline targets WCAG 2.2 AA with visible keyboard focus, a 44px minimum
touch-target token, restrained high-contrast neutrals, responsive media, readable
line length, and reduced-motion handling. Semantic HTML and accessible names
remain component responsibilities.

## Historical design phase

An earlier design phase explored Product/System density hooks, a Product/System
switch, architecture exploration and an Inspector. Those concepts informed the
portfolio's structural visual language but were superseded by CR2.5 when the
public DevData experience became a direct static case study. They are not current
or deferred production UX.
