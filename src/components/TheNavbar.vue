<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue'
import { site } from '@/data/site'
import AppButton from '@/components/ui/AppButton.vue'
import { useTheme } from '@/composables/useTheme'
import { logoSlot, menuOpen as open, LOGO_RATIO } from '@/composables/useBrandLogo'

const { theme, toggleTheme } = useTheme()

const scrolled = ref(false)
// Empty slot the logo (BrandLogo.vue) docks into — see public/assets/README.md
const brand = ref(null)

let ticking = false
function onScroll() {
  if (ticking) return
  ticking = true
  requestAnimationFrame(() => {
    // hysteresis: condense past 24px, only expand again near the very top,
    // so hovering around one threshold can't flip the state every frame
    const y = window.scrollY
    if (y > 24) scrolled.value = true
    else if (y < 4) scrolled.value = false
    ticking = false
  })
}
onMounted(() => {
  logoSlot.value = brand.value
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
})
onBeforeUnmount(() => {
  logoSlot.value = null
  open.value = false
  window.removeEventListener('scroll', onScroll)
})
</script>

<template>
  <header class="nav" :class="{ 'is-scrolled': scrolled, 'is-menu-open': open }">
    <div class="container nav__inner">
      <div
        ref="brand"
        class="nav__brand"
        :style="{ '--logo-ratio': LOGO_RATIO }"
        aria-hidden="true"
      ></div>

      <button
        class="nav__toggle"
        :aria-expanded="open"
        aria-label="Toggle menu"
        @click="open = !open"
      >
        <span></span><span></span><span></span>
      </button>

      <nav class="nav__menu" :class="{ 'is-open': open }">
        <div class="nav__links">
          <RouterLink
            v-for="item in site.nav"
            :key="item.label"
            :to="item.to"
            class="nav__link"
            @click="open = false"
          >
            {{ item.label }}
            <!-- pencil underline, drawn in on hover (#pencil-tooth lives in App.vue) -->
            <svg
              class="nav__scribble"
              viewBox="0 0 200 10"
              preserveAspectRatio="none"
              aria-hidden="true"
              focusable="false"
            >
              <path d="M3 6.5 C 34 3, 66 8.5, 102 5.5 S 168 3.5, 197 6" filter="url(#pencil-tooth)" />
            </svg>
          </RouterLink>
        </div>

        <div class="nav__end">
          <button
            type="button"
            class="nav__theme"
            role="switch"
            :aria-checked="theme === 'dark'"
            :aria-label="theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'"
            @click="toggleTheme($event)"
          >
            <span class="nav__theme-track">
              <svg
                class="nav__theme-ico nav__theme-ico--sun"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2.2"
                stroke-linecap="round"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="4" />
                <path
                  d="M12 3v1.5M12 19.5V21M4.5 4.5l1 1M18.5 18.5l1 1M3 12h1.5M19.5 12H21M4.5 19.5l1-1M18.5 5.5l1-1"
                />
              </svg>
              <svg
                class="nav__theme-ico nav__theme-ico--moon"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8z" />
              </svg>
              <span class="nav__theme-knob" />
            </span>
          </button>

          <AppButton
            class="nav__cta"
            :to="{ name: 'contact' }"
            @click="open = false"
          >
            Let's talk!
          </AppButton>
        </div>
      </nav>
    </div>
  </header>
</template>

<style scoped>
.nav {
  position: sticky;
  top: 0;
  z-index: var(--z-nav);
  background: color-mix(in srgb, var(--color-bg) 78%, transparent);
  backdrop-filter: blur(8px);
  border-bottom: 1px solid transparent;
  transition:
    background var(--transition),
    border-color var(--transition),
    box-shadow var(--transition),
    margin-bottom var(--transition);
}

/* the bar condenses by 0.875rem — give that back as margin so the header's
   footprint in the page never changes. Otherwise the content jumps up,
   scroll anchoring pulls scrollY back under the threshold and the bar
   flickers between states. */
.nav.is-scrolled {
  margin-bottom: 0.875rem;
  background: color-mix(in srgb, var(--color-bg) 92%, transparent);
  border-bottom-color: var(--color-border, rgba(0, 0, 0, 0.08));
  box-shadow: 0 6px 1.25rem -0.75rem rgba(var(--c-seed-rgb), 0.18);
}


.nav__inner {
  /* full-bleed on laptops; on wide screens it stops a gutter outside the
     page column instead of drifting to the far screen edges */
  max-width: calc(var(--page-max) + 2 * var(--page-gutter));
  padding-inline: var(--page-gutter);
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  min-height: var(--nav-h);
  gap: 1rem;
  transition: min-height var(--transition);
}

.nav.is-scrolled .nav__inner {
  min-height: calc(var(--nav-h) - 0.875rem);
}

/* reserves the spot the scroll-linked logo (BrandLogo) lands in */
.nav__brand {
  justify-self: start;
  height: 4rem;
  aspect-ratio: var(--logo-ratio);
}

/* desktop: children drop into the parent 3-col grid directly */
.nav__menu {
  display: contents;
}

.nav__links {
  grid-column: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: clamp(1rem, 3vw, 2.4rem);
}

.nav__link {
  position: relative;
  font-weight: 600;
  color: var(--color-ink-soft);
  transition: color var(--transition-fast);
}

/* same pencil underline as the project card titles */
.nav__scribble {
  position: absolute;
  left: -0.15em;
  bottom: -0.45em;
  width: calc(100% + 0.3em);
  height: 0.5em;
  overflow: visible;
  pointer-events: none;
  /* drawn in left to right */
  clip-path: inset(-50% 100% -50% 0);
  transition: clip-path 0.45s var(--ease-soft);
}

.nav__scribble path {
  fill: none;
  stroke: currentColor;
  stroke-width: 2.4;
  stroke-linecap: round;
  vector-effect: non-scaling-stroke;
}

.nav__link:hover,
.nav__link.router-link-active {
  color: var(--color-ink);
}

.nav__link:hover .nav__scribble,
.nav__link.router-link-active .nav__scribble {
  clip-path: inset(-50% 0 -50% 0);
}

.nav__link.router-link-active .nav__scribble path {
  stroke: var(--color-accent);
}

@media (prefers-reduced-motion: reduce) {
  .nav__scribble {
    transition: none;
  }
}

.nav__end {
  grid-column: 3;
  justify-self: end;
  display: flex;
  align-items: center;
  gap: var(--space-2xs);
}

.nav__theme {
  flex: none;
  padding: 4px;
  border: none;
  background: none;
  cursor: pointer;
  border-radius: var(--radius-pill);
}

.nav__theme-track {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 3.375rem;
  height: 1.875rem;
  padding: 0 7px;
  border: 1px solid var(--color-border-strong);
  border-radius: var(--radius-pill);
  background: color-mix(in srgb, var(--color-ink) 6%, transparent);
  transition:
    background var(--transition),
    border-color var(--transition);
}

.nav__theme:hover .nav__theme-track {
  border-color: var(--color-ink);
}

.nav__theme-ico {
  width: 0.875rem;
  height: 0.875rem;
  color: var(--color-ink-faint);
  transition: color var(--transition), opacity var(--transition);
}

/* fade the icon the knob is covering */
.nav__theme[aria-checked='false'] .nav__theme-ico--sun,
.nav__theme[aria-checked='true'] .nav__theme-ico--moon {
  opacity: 0;
}

.nav__theme-knob {
  position: absolute;
  top: 50%;
  left: 3px;
  width: 1.5rem;
  height: 1.5rem;
  transform: translateY(-50%);
  border-radius: 50%;
  background: var(--color-ink);
  box-shadow: 0 1px 4px rgba(var(--c-seed-rgb), 0.25);
  transition: transform 0.3s var(--ease-soft);
}

.nav__theme[aria-checked='true'] .nav__theme-knob {
  transform: translateY(-50%) translateX(1.5rem);
}

.nav__theme:focus-visible {
  outline: 2px solid var(--color-leaf);
  outline-offset: 2px;
}

.nav__toggle {
  display: none;
  flex-direction: column;
  gap: 5px;
  padding: 0.625rem;
  background: none;
  border: none;
  justify-self: end;
  grid-column: 3;
}

.nav__toggle span {
  width: 1.5rem;
  height: 2px;
  background: var(--color-ink);
  border-radius: var(--radius-xs);
}

@media (max-width: 760px) {
  .nav__inner {
    grid-template-columns: 1fr auto;
  }

  .nav__toggle {
    display: flex;
  }

  .nav__menu {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    position: absolute;
    /* hang off the bar's real bottom edge: it shrinks once scrolled */
    inset: 100% 0 auto 0;
    gap: 1.25rem;
    padding: 0.25rem var(--page-gutter) 2rem;
    background: var(--color-bg);
    border-bottom: var(--border-hairline);
    transform: translateY(-8px);
    opacity: 0;
    pointer-events: none;
    transition: opacity var(--transition), transform var(--transition);
  }

  /* open: bar and dropdown read as one solid panel, no seam between them */
  .nav.is-menu-open {
    background: var(--color-bg);
    border-bottom-color: transparent;
    box-shadow: none;
  }

  .nav__menu.is-open {
    transform: translateY(0);
    opacity: 1;
    pointer-events: auto;
  }

  .nav__links {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
}
</style>
