# Portfolio — Melly Marcelia

Vue 3 + Vite portfolio site. Projects are data-driven, so new work can be
added without touching components.

## Run

```bash
npm install
npm run dev      # local dev server
npm run build    # production build → dist/
npm run preview  # preview the production build
```

## Where things live

```
public/assets/              image files (logo, portraits)
public/assets/works/         project cover + case-study images

src/
  data/
    site.js                  all site copy, nav, contact details
    projects.js              ← add your works here (schema documented in-file)

  styles/
    tokens.css               ⭐ every colour, size, radius, shadow, timing
    base.css                 reset, element defaults, .container / .section
    typography.css           .t-* text styles (used via <AppText>)

  components/
    README.md                component guide + primitive cheat-sheet
    ui/
      AppText.vue             every text style
      AppButton.vue           button / CTA (RouterLink | a | button)
      AppTag.vue              pill label
    ProjectCard.vue           a project as a card
    TheNavbar.vue  TheFooter.vue
    HeroSection.vue  WorksCarousel.vue  StatementSection.vue  FeaturedProjects.vue
    case-studies/             bespoke case-study layouts (one per project)

  views/
    HomeView  WorksView  ProjectDetailView  PlaygroundView  AboutView  ContactView  NotFoundView
  router/index.js            routes
```

## Adding a project

Edit `src/data/projects.js` — add one object to the `projects` array (every
field is documented at the top of that file). Set `featured: true` to also
surface it in the home "Featured Projects" grid. Put images in
`public/assets/works/` and reference them as `/assets/works/name.jpg`.
The carousel, `/works`, and the `/works/:slug` case-study page all update
automatically. Missing images fall back to a placeholder — nothing breaks.

## Editing copy

All global text (intro, statement, contact email, LinkedIn URL) is in
`src/data/site.js`.

## Design system

**Tokens** — [`src/styles/tokens.css`](src/styles/tokens.css) is the single
source of truth. Components reference variables, never raw values:

| group | tokens |
| --- | --- |
| colour | `--color-bg` `--color-surface` `--color-ink` `--color-ink-soft` `--color-ink-faint` `--color-accent` `--color-leaf` `--color-border(-strong)` `--color-hairline` `--color-mat` `--color-placeholder` |
| gradient | `--glow` `--glow-soft` |
| type size | `--step--1` … `--step-6` (fluid) |
| type | `--font-body` `--font-hand` `--font-signature` · `--leading-*` `--tracking-*` |
| space | `--space-3xs` … `--space-2xl` · `--space-section` |
| radius | `--radius-xs/s/m/l/pill` |
| border | `--border-hairline` `--border-card` |
| shadow | `--shadow-s/m/l` `--shadow-portrait` |
| motion | `--ease` `--transition` `--transition-fast` |
| layout | `--page-max` `--page-gutter` `--nav-h` |
| z-index | `--z-raised` `--z-nav` `--z-overlay` |

**Palette** — "dragon fruit": magenta skin (`--color-accent`), green tips
(`--color-leaf`), pale flesh (`--color-bg`), seed-black (`--color-ink`).

**Type** — Homemade Apple (cursive) + Bricolage Grotesque (everything else),
loaded in `index.html`. Text styles are the `.t-*` classes in
`typography.css`, used through `<AppText>`.

**Components** — see [`src/components/README.md`](src/components/README.md) for
the primitive cheat-sheet (`<AppText>`, `<AppButton>`, `<AppTag>`).
