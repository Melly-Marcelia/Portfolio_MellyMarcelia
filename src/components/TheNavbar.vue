<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue'
import { site } from '@/data/site'
import AppButton from '@/components/ui/AppButton.vue'
import { useTheme } from '@/composables/useTheme'
import { logoSlot, LOGO_RATIO } from '@/composables/useBrandLogo'

const { theme, toggleTheme } = useTheme()

const open = ref(false)
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
  window.removeEventListener('scroll', onScroll)
})
</script>

<template>
  <header class="nav" :class="{ 'is-scrolled': scrolled }">
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

/* the bar condenses by 14px — give that back as margin so the header's
   footprint in the page never changes. Otherwise the content jumps up,
   scroll anchoring pulls scrollY back under the threshold and the bar
   flickers between states. */
.nav.is-scrolled {
  margin-bottom: 14px;
  background: color-mix(in srgb, var(--color-bg) 92%, transparent);
  border-bottom-color: var(--color-border, rgba(0, 0, 0, 0.08));
  box-shadow: 0 6px 20px -12px rgba(var(--c-seed-rgb), 0.18);
}


.nav__inner {
  max-width: none;
  padding-inline: var(--page-gutter);
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  min-height: var(--nav-h);
  gap: 1rem;
  transition: min-height var(--transition);
}

.nav.is-scrolled .nav__inner {
  min-height: calc(var(--nav-h) - 14px);
}

/* reserves the spot the scroll-linked logo (BrandLogo) lands in */
.nav__brand {
  justify-self: start;
  height: 64px;
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

.nav__link::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: -4px;
  height: 1.5px;
  background: currentColor;
  border-radius: 2px;
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.35s var(--ease-soft);
}

.nav__link:hover,
.nav__link.router-link-active {
  color: var(--color-ink);
}

.nav__link:hover::after,
.nav__link.router-link-active::after {
  transform: scaleX(1);
}

.nav__link.router-link-active::after {
  background: var(--color-accent);
}

.nav__link.router-link-active:not(:hover)::after {
  transform-origin: right;
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
  width: 54px;
  height: 30px;
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
  width: 14px;
  height: 14px;
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
  width: 24px;
  height: 24px;
  transform: translateY(-50%);
  border-radius: 50%;
  background: var(--color-ink);
  box-shadow: 0 1px 4px rgba(var(--c-seed-rgb), 0.25);
  transition: transform 0.3s var(--ease-soft);
}

.nav__theme[aria-checked='true'] .nav__theme-knob {
  transform: translateY(-50%) translateX(24px);
}

.nav__theme:focus-visible {
  outline: 2px solid var(--color-leaf);
  outline-offset: 2px;
}

.nav__toggle {
  display: none;
  flex-direction: column;
  gap: 5px;
  padding: 10px;
  background: none;
  border: none;
  justify-self: end;
  grid-column: 3;
}

.nav__toggle span {
  width: 24px;
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
    inset: var(--nav-h) 0 auto 0;
    gap: 1.25rem;
    padding: 1.5rem var(--page-gutter) 2rem;
    background: var(--color-bg);
    border-bottom: var(--border-hairline);
    transform: translateY(-8px);
    opacity: 0;
    pointer-events: none;
    transition: opacity var(--transition), transform var(--transition);
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
