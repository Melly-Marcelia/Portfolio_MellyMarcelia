<script setup>
import { ref, watch, nextTick, onMounted, onBeforeUnmount } from 'vue'
import { useRoute } from 'vue-router'
import { site } from '@/data/site'
import { logoAnchor, logoSlot, menuOpen, LOGO_RATIO } from '@/composables/useBrandLogo'
/**
 * The site logo. On the homepage it starts big in the hero and, as you scroll,
 * shrinks and glides into the navbar's top-left slot. On every other page it
 * simply sits in that slot.
 *
 * It is drawn once at BASE_H and only ever scaled down (crisp), positioned
 * with transforms straight from the scroll position — no per-frame reactivity.
 */
const BASE_H = 800 // must be >= the tallest the hero anchor gets (25rem at the 32px max root size)
const DOCK_RANGE = 0.9 // scroll distance to fully dock, as a fraction of the hero logo's height

const route = useRoute()
const link = ref(null)
// the dragon fruit drawing with the seed portrait in the flesh, re-textured in the fruit's
// coloured-pencil material (logo-blank.png is the empty fruit)
// (previous: /assets/logo-portrait.png the flat-ink seed portrait, /assets/logo-face.png the old portrait,
// /assets/logo.png the original)
const logo = '/assets/logo-portrait-pencil.png'
const ready = ref(false) // first placement done — until then it stays hidden
const settling = ref(false) // gliding to a new spot (route change) rather than tracking scroll
const docked = ref(false)
const resting = ref(false) // sitting still in the hero slot (top of the homepage)

let settleTimer = 0
let frame = 0
let resizeObserver

const clamp01 = (n) => Math.min(1, Math.max(0, n))

// Layout box of an element in viewport coordinates, ignoring CSS transforms —
// the page-transition rise on the hero would otherwise skew the measurement.
function layoutBox(el) {
  let x = 0
  let y = 0
  for (let n = el; n; n = n.offsetParent) {
    x += n.offsetLeft
    y += n.offsetTop
    if (n.offsetParent) {
      x += n.offsetParent.clientLeft
      y += n.offsetParent.clientTop
    }
  }
  return { left: x - window.scrollX, top: y - window.scrollY, height: el.offsetHeight }
}

function place() {
  frame = 0
  const el = link.value?.$el
  const slot = logoSlot.value
  // route not resolved yet, or the hero isn't mounted yet: hold position
  if (!el || !slot || !route.name) return
  const onHome = route.name === 'home'
  const anchor = onHome ? logoAnchor.value : null
  if (onHome && !anchor) return

  const to = slot.getBoundingClientRect()
  let x = to.left
  let y = to.top
  let h = to.height
  let progress = 1

  if (anchor) {
    const from = layoutBox(anchor)
    progress = clamp01(window.scrollY / (from.height * DOCK_RANGE))
    // size shrinks well ahead of position so the logo is already small by the time it crosses the nav links
    const move = progress * progress * (3 - 2 * progress)
    const shrink = 1 - (1 - progress) ** 3
    x = from.left + (to.left - from.left) * move
    // the hero scrolls up faster than the logo docks — never let it slip off the top of the viewport
    y = Math.max(from.top + (to.top - from.top) * move, to.top)
    h = from.height + (to.height - from.height) * shrink
  }

  el.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${h / BASE_H})`
  ready.value = true
  docked.value = progress >= 0.98
  resting.value = !!anchor && progress <= 0.02
}

function schedule() {
  if (!frame) frame = requestAnimationFrame(place)
}

// route / hero changes: glide to the new spot instead of jumping
function settle() {
  if (!ready.value) return place()
  settling.value = true
  clearTimeout(settleTimer)
  settleTimer = setTimeout(() => (settling.value = false), 900)
  // let the transition class land before the new transform is written
  nextTick(place)
}

watch(() => route.name, settle)
watch(logoAnchor, settle)
watch(logoSlot, (slot) => {
  resizeObserver?.disconnect()
  // the navbar condenses on scroll, which moves the slot without a scroll event
  const header = slot?.closest('header')
  if (header) resizeObserver?.observe(header)
  place()
})

onMounted(() => {
  resizeObserver = new ResizeObserver(schedule)
  const header = logoSlot.value?.closest('header')
  if (header) resizeObserver.observe(header)
  window.addEventListener('scroll', schedule, { passive: true })
  window.addEventListener('resize', schedule)
  place()
})

onBeforeUnmount(() => {
  cancelAnimationFrame(frame)
  clearTimeout(settleTimer)
  resizeObserver?.disconnect()
  window.removeEventListener('scroll', schedule)
  window.removeEventListener('resize', schedule)
})
</script>

<template>
  <RouterLink
    ref="link"
    :to="{ name: 'home' }"
    class="brand-logo"
    :class="{ 'is-ready': ready, 'is-settling': settling, 'is-docked': docked, 'is-resting': resting, 'is-under-menu': menuOpen && !docked }"
    :style="{ '--logo-h': `${BASE_H}px`, '--logo-ratio': LOGO_RATIO }"
    :tabindex="docked ? 0 : -1"
    aria-label="Home"
  >
    <span class="brand-logo__sway">
      <img
        :src="logo"
        :alt="site.name"
        class="brand-logo__img enter-right"
        style="--enter-delay: 200ms; --enter-x: 120px"
        draggable="false"
      />
    </span>
  </RouterLink>
</template>

<style scoped>
.brand-logo {
  position: fixed;
  top: 0;
  left: 0;
  z-index: calc(var(--z-nav) + 1);
  height: var(--logo-h);
  aspect-ratio: var(--logo-ratio);
  transform-origin: 0 0;
  /* stays hidden until the first placement so it never flashes at 0,0 */
  visibility: hidden;
  /* only clickable once it has landed in the navbar — mid-flight it must not block the page */
  pointer-events: none;
  will-change: transform;
}

/* mobile menu open while the logo is still big in the hero: tuck it under the navbar
   so the dropdown covers it (docked, it sits in the bar above the menu and can stay on top) */
.brand-logo.is-under-menu {
  z-index: calc(var(--z-nav) - 1);
  pointer-events: none;
}

.brand-logo.is-ready {
  visibility: visible;
}

.brand-logo.is-docked {
  pointer-events: auto;
}

/* resting in the hero it takes hover (for the sway) but isn't a link you'd click there */
.brand-logo.is-resting {
  pointer-events: auto;
  cursor: default;
}

.brand-logo.is-settling {
  transition: transform 0.8s var(--ease-soft);
}

/* soft left ↔ right sway while hovered; pausing (not removing) it on leave
   lets the fruit come to rest where it is instead of snapping back */
.brand-logo__sway {
  display: block;
  width: 100%;
  height: 100%;
  animation: logo-sway 2.8s ease-in-out infinite paused;
}

/* real pointers only: on touch a tap or scroll counts as hover and the sway
   would freeze mid-swing, leaving the fruit off-centre */
@media (hover: hover) and (pointer: fine) {
  .brand-logo:hover .brand-logo__sway {
    animation-play-state: running;
  }
}

@keyframes logo-sway {
  0%, 100% { translate: 0; rotate: 0deg; }
  25% { translate: -14%; rotate: -5deg; }
  75% { translate: 14%; rotate: 5deg; }
}

.brand-logo__img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: contain;
  user-select: none;
}

.brand-logo:focus-visible {
  outline: 2px solid var(--color-leaf);
  outline-offset: 4px;
}

@media (prefers-reduced-motion: reduce) {
  .brand-logo.is-settling {
    transition: none;
  }
  .brand-logo__sway {
    animation: none;
  }
}
</style>
