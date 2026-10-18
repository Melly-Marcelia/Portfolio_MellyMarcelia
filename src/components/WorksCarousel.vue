<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { caseStudies } from '@/data/projects'
import AppText from '@/components/ui/AppText.vue'
import CoverMedia from '@/components/ui/CoverMedia.vue'

/**
 * Looping strip of work thumbnails under the hero — a glimpse of every
 * project with a case study (coming-soon ones are left out). Tiles keep
 * their size (about four on screen) and the strip drifts sideways forever:
 * the list is rendered twice and the scroll position wraps by one copy's
 * width, so the seam is invisible. It's a real scroll container, so people
 * can swipe / trackpad-scroll / mouse-drag it; hover, focus or any manual
 * scroll pauses the drift for a moment. Reduced motion turns it into a plain
 * swipeable row. Each tile links to that project's case-study page (/works/:slug).
 */
const SECONDS_PER_TILE = 5
const RESUME_AFTER_MS = 1800
const DRAG_THRESHOLD = 6

const items = computed(() => caseStudies)

const viewport = ref(null)
const track = ref(null)

let raf = 0
let ro = null
let pos = 0 // float scroll position (scrollLeft gets rounded by some browsers)
let copyW = 0 // width of one copy incl. the gap after it
let lastTime = 0
let lastInput = 0
let hovered = false
let touching = false
let drag = null
let suppressClick = false

function measure() {
  const kids = track.value?.children
  const n = items.value.length
  if (!kids || kids.length < n * 2) return
  copyW = kids[n].offsetLeft - kids[0].offsetLeft
}

// keep pos inside [0, copyW); returns the shift so a drag can follow it
function wrap() {
  if (!copyW) return 0
  let shift = 0
  if (pos >= copyW) shift = -copyW
  else if (pos < 0) shift = copyW
  if (shift) {
    pos += shift
    viewport.value.scrollLeft = pos
  }
  return shift
}

function tick(now) {
  const el = viewport.value
  const dt = lastTime ? Math.min(now - lastTime, 100) : 0
  lastTime = now
  const idle = !hovered && !touching && !drag && now - lastInput > RESUME_AFTER_MS
    && !el.contains(document.activeElement)

  if (idle && copyW) {
    pos += (copyW / (items.value.length * SECONDS_PER_TILE)) * (dt / 1000)
    el.scrollLeft = pos
  } else if (!drag) {
    // user is in control: follow wherever they scrolled to
    pos = el.scrollLeft
  }
  wrap()
  raf = requestAnimationFrame(tick)
}

const markInput = () => (lastInput = performance.now())
const setHovered = (v) => (hovered = v)

function onTouchStart() {
  touching = true
  markInput()
}
function onTouchEnd() {
  touching = false
  markInput() // momentum keeps going; the delay covers it
}

// mouse drag: native scroll already covers touch and trackpads
function onPointerDown(e) {
  if (e.pointerType !== 'mouse' || e.button !== 0) return
  drag = { x: e.clientX, start: viewport.value.scrollLeft, id: e.pointerId, moved: false }
  pos = drag.start
}
function onPointerMove(e) {
  if (!drag || e.pointerId !== drag.id) return
  const dx = e.clientX - drag.x
  if (!drag.moved) {
    if (Math.abs(dx) < DRAG_THRESHOLD) return
    drag.moved = true
    // capture only once it's a real drag, so plain clicks still reach the link
    viewport.value.setPointerCapture(e.pointerId)
  }
  pos = drag.start - dx
  viewport.value.scrollLeft = pos
  drag.start += wrap()
  markInput()
}
function onPointerUp(e) {
  if (!drag || e.pointerId !== drag.id) return
  suppressClick = drag.moved
  drag = null
  markInput()
}
function onClickCapture(e) {
  if (!suppressClick) return
  suppressClick = false
  e.preventDefault()
  e.stopPropagation()
}

onMounted(() => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  measure()
  ro = new ResizeObserver(measure)
  ro.observe(track.value)
  raf = requestAnimationFrame(tick)
})

onBeforeUnmount(() => {
  cancelAnimationFrame(raf)
  ro?.disconnect()
})
</script>

<template>
  <div
    ref="viewport"
    class="carousel enter-rise"
    :style="{ '--enter-delay': '320ms' }"
    @mouseenter="setHovered(true)"
    @mouseleave="setHovered(false)"
    @wheel.passive="markInput"
    @touchstart.passive="onTouchStart"
    @touchend.passive="onTouchEnd"
    @touchcancel.passive="onTouchEnd"
    @pointerdown="onPointerDown"
    @pointermove="onPointerMove"
    @pointerup="onPointerUp"
    @pointercancel="onPointerUp"
    @click.capture="onClickCapture"
    @dragstart.prevent
  >
    <ul ref="track" class="carousel__track">
      <!-- copy 0 is the real list; copy 1 is a visual duplicate for the loop -->
      <template v-for="copy in 2" :key="copy">
      <li
        v-for="item in items"
        :key="`${copy}-${item.slug}`"
        class="tile"
        :class="{ 'tile--dupe': copy === 2 }"
        :aria-hidden="copy === 2 ? 'true' : undefined"
      >
        <!-- coming-soon projects have no page yet: a plain tile, not a link -->
        <component
          :is="item.comingSoon ? 'div' : RouterLink"
          :to="item.comingSoon ? undefined : { name: 'project', params: { slug: item.slug } }"
          class="tile__link"
          :class="{ 'tile__link--empty': !item.cover }"
          :tabindex="copy === 2 && !item.comingSoon ? -1 : undefined"
          :aria-label="item.comingSoon ? `${item.title}: coming soon` : `${item.title}: read the case study`"
        >
          <span class="tile__ph"></span>
          <CoverMedia
            v-if="item.cover"
            :src="item.cover"
            :poster="item.poster"
            :zoom="item.coverZoom"
            :alt="item.title"
            @error="(e) => (e.target.hidden = true)"
          />

          <span class="tile__overlay">
            <AppText variant="label" class="tile__name">{{ item.title }}</AppText>
            <span class="tile__cta">{{ item.comingSoon ? 'Coming soon' : 'Read case study →' }}</span>
          </span>
        </component>
      </li>
      </template>
    </ul>
  </div>
</template>

<style scoped>
.carousel {
  --tile-gap: clamp(0.5rem, 1.4vw, 1rem);
  padding-block: clamp(1rem, 3vh, 2.5rem) clamp(1.5rem, 4vh, 3rem);
  /* real scroll container: swipe / trackpad / drag; drift is done in JS */
  overflow-x: auto;
  overflow-y: hidden;
  overscroll-behavior-x: contain;
  scrollbar-width: none;
  cursor: grab;
  /* soft fade at both edges so tiles drift in and out, not get cut */
  mask-image: linear-gradient(to right, transparent, #000 4%, #000 96%, transparent);
}
.carousel::-webkit-scrollbar {
  display: none;
}
.carousel:active {
  cursor: grabbing;
}

.carousel__track {
  list-style: none;
  display: flex;
  gap: var(--tile-gap);
  width: max-content;
}

/* same tile size as the old 4-up row */
.tile {
  flex: 0 0 auto;
  width: clamp(13.75rem, calc((min(100vw, var(--page-max)) - 3 * var(--tile-gap)) / 4), 26.25rem);
}

/* plain rectangular thumbnail — the whole tile is the link */
.tile__link,
.tile > .tile__ph {
  position: relative;
  display: block;
  aspect-ratio: 3 / 2;
  max-height: 34vh;
  overflow: hidden;
  border-radius: var(--radius-s);
}

.tile__link {
  cursor: pointer;
  transition: transform var(--transition-fast);
}

.tile__link :is(img, video) {
  position: relative;
  z-index: var(--z-raised);
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* no cover yet — keep the name visible on the placeholder instead of a blank tile */
.tile__link--empty .tile__overlay {
  opacity: 1;
  color: var(--color-ink-soft);
  background: none;
}
.tile__link--empty :is(.tile__name, .tile__cta) {
  transform: none;
}

/* big, tall screens: bigger tiles (about 3.4 across instead of 4) so the
   row fills the space under the hero instead of leaving a gap */
@media (min-width: 1700px) and (min-height: 950px) {
  .tile {
    width: min(calc(100vw / 3.4), 36rem);
  }
  .tile__link,
  .tile > .tile__ph {
    max-height: 42vh;
  }
}

/* placeholder sits behind the image — shows through if the image is missing */
.tile__ph {
  background: var(--color-placeholder);
}

.tile__link > .tile__ph {
  position: absolute;
  inset: 0;
}

/* hover / focus affordance — makes it obvious each tile opens a page */
.tile__overlay {
  position: absolute;
  inset: 0;
  z-index: 2;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  gap: var(--space-3xs);
  padding: var(--space-s);
  color: var(--color-on-scrim);
  background: linear-gradient(
    to top,
    color-mix(in srgb, var(--color-scrim) 78%, transparent),
    color-mix(in srgb, var(--color-scrim) 10%, transparent) 55%,
    transparent
  );
  opacity: 0;
  transition: opacity var(--transition-fast);
}

.tile__link:hover .tile__overlay,
.tile__link:focus-visible .tile__overlay {
  opacity: 1;
}

.tile__link:hover,
.tile__link:focus-visible {
  transform: translateY(-2px);
}

.tile__link > :is(img, video, .cm-zoom) {
  transition: transform 0.9s var(--ease-soft);
}
.tile__link:hover > :is(img, video, .cm-zoom),
.tile__link:focus-visible > :is(img, video, .cm-zoom) {
  transform: scale(1.06);
}

/* label + CTA drift up as the overlay fades in */
.tile__name,
.tile__cta {
  transform: translateY(8px);
  transition: transform 0.45s var(--ease-soft);
}
.tile__cta {
  transition-delay: 60ms;
}
.tile__link:hover :is(.tile__name, .tile__cta),
.tile__link:focus-visible :is(.tile__name, .tile__cta) {
  transform: none;
}

.tile__cta {
  font-size: var(--step--1);
  font-weight: 600;
  opacity: 0.9;
}

/* reduced motion: no drift — a plain swipeable row of the real list */
@media (prefers-reduced-motion: reduce) {
  .carousel {
    mask-image: none;
    cursor: auto;
  }
  .carousel__track {
    padding-inline: clamp(6px, 1vw, 0.75rem);
  }
  .tile--dupe {
    display: none;
  }
}

@media (max-width: 640px) {
  .tile {
    width: 72vw;
  }

  .tile__link,
  .tile > .tile__ph {
    max-height: none;
  }

  /* touch: no hover — keep the label visible */
  .tile__name,
  .tile__cta {
    transform: none;
  }

  .tile__overlay {
    opacity: 1;
    background: linear-gradient(
      to top,
      color-mix(in srgb, var(--color-scrim) 70%, transparent),
      transparent 60%
    );
  }
}
</style>
