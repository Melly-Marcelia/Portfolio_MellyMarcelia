# Components

```
components/
  ui/                  reusable primitives — no page knowledge, driven by props
    AppText.vue          every text style (variant = .t-* from styles/typography.css)
    AppButton.vue        the button / CTA (renders RouterLink | a | button)
    AppTag.vue           small pill label (project category, meta chip)
  ProjectCard.vue      a project as a card — used by FeaturedProjects + WorksView
  TheNavbar.vue        site header (sticky)
  TheFooter.vue        site footer + #contact anchor + copy-email button
  HeroSection.vue      home hero
  WorksCarousel.vue    home thumbnail row
  StatementSection.vue home statement band
  FeaturedProjects.vue home "Featured Projects" grid (only renders if any `featured`)
```

## Rules

- **Never hard-code** a colour, radius, shadow, spacing step or timing.
  Use the tokens in [`src/styles/tokens.css`](../styles/tokens.css).
- **Text** goes through `<AppText>`, not raw `<h1>`/`<p>` with font CSS.
- **Buttons / CTAs** go through `<AppButton>`.
- Page sections keep their own layout CSS; primitives keep their own look.

## Primitives — quick reference

```vue
<AppText variant="h2" balance>Heading</AppText>
<AppText variant="lead" measure>Intro copy…</AppText>
<AppText variant="caption" tone="faint">Small print</AppText>

<AppButton :to="{ name: 'works' }">View all works</AppButton>
<AppButton variant="outline" href="https://…" target="_blank">LinkedIn</AppButton>
<AppButton variant="ghost" size="sm" @click="…">Copy</AppButton>

<AppTag>UI/UX case study</AppTag>
<AppTag variant="outline">Figma</AppTag>
```

`AppText` variants: `signature`, `script`, `display`, `h1`–`h4`, `lead`,
`body`, `body-sm`, `eyebrow`, `label`, `caption`
· modifiers: `tone` (`soft`/`faint`/`accent`), `balance`, `measure`, `as`
