# UI foundation

The visual foundation uses semantic CSS custom properties for color, typography,
spacing, shape, elevation, focus, motion, layering, layout, density, and future
architecture-diagram states. Tokens describe roles rather than components so the
same system can support multiple page types without separate themes.

Product and System views can set `data-density="product"` or
`data-density="system"` on a containing element. These hooks only adjust shared
inline spacing, block spacing, and gaps; color and typography remain unified.

The baseline targets WCAG 2.2 AA with visible keyboard focus, a 44px minimum
touch-target token, restrained high-contrast neutrals, responsive media, readable
line length, and reduced-motion handling. Semantic HTML and accessible names
remain component responsibilities.

Final branding, dark mode, external fonts, page layouts, components, animation,
the Product/System switch, and the Architecture Explorer are intentionally
deferred.
