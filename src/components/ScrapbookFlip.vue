<script setup>
/**
 * ScrapbookFlip — a two-page book whose leaves turn in 3D.
 *
 *   <ScrapbookFlip :pages="scrapbook" />
 *
 * Pages pair up onto leaves (front / back). Closed, the cover sits centred;
 * open, spreads show left + right. Turn by clicking a page, swiping, the
 * arrow buttons, or ←/→ while the book has focus.
 */
import { computed, onBeforeUnmount, ref, watch } from 'vue'

const props = defineProps({
  pages: { type: Array, required: true },
})

const TURN_MS = 900
const reducedMotion =
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

// pad to an even count so every leaf has a back
const padded = computed(() =>
  props.pages.length % 2 ? [...props.pages, {}] : props.pages
)
const leaves = computed(() => {
  const out = []
  for (let i = 0; i < padded.value.length; i += 2) {
    out.push({ front: padded.value[i], back: padded.value[i + 1], n: i + 1 })
  }
  return out
})

const flipped = ref(0) // how many leaves have turned to the left

const atStart = computed(() => flipped.value === 0)
const atEnd = computed(() => flipped.value === leaves.value.length)

// The turn is driven from JS, one angle per leaf (0 = resting right,
// -180 = resting left). Which face shows, the boards and the tucked pages
// all follow that angle, so nothing can appear before the leaf actually
// gets there — CSS backface-visibility / delayed transitions drift out of
// sync with the rotation (and Safari ignores backface-visibility on scans).
const angles = ref([])
watch(
  () => leaves.value.length,
  (n) => (angles.value = Array.from({ length: n }, (_, i) => (i < flipped.value ? -180 : 0))),
  { immediate: true }
)

const turns = new Map() // leaf index -> { from, to, start, order }
let turnOrder = 0
let raf = 0

// matches --ease-in-out: cubic-bezier(0.65, 0, 0.35, 1)
const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)

function tick(now) {
  const next = [...angles.value]
  for (const [i, turn] of turns) {
    const t = reducedMotion ? 1 : Math.min(1, (now - turn.start) / TURN_MS)
    next[i] = turn.from + (turn.to - turn.from) * ease(t)
    if (t === 1) turns.delete(i)
  }
  angles.value = next
  raf = turns.size ? requestAnimationFrame(tick) : 0
}

function go(dir) {
  const next = flipped.value + dir
  if (next < 0 || next > leaves.value.length) return
  const i = dir > 0 ? flipped.value : next
  turns.set(i, {
    from: angles.value[i],
    to: dir > 0 ? -180 : 0,
    start: performance.now(),
    order: ++turnOrder,
  })
  flipped.value = next
  if (!raf) raf = requestAnimationFrame(tick)
}

onBeforeUnmount(() => cancelAnimationFrame(raf))

function onLeafClick(i) {
  go(i < flipped.value ? -1 : 1)
}

// pressed flowers on the cover sprig: [x, y, radius, spin, squash].
// Petals vary a little in length/angle so they read as real, not stamped.
const SPRIG_FLOWERS = [
  [32, 26, 7, 8, 0.9],
  [14, 52, 5.4, -20, 0.78],
  [46, 33, 4.8, 30, 0.84],
].map(([x, y, r, spin, squash]) => ({
  transform: `translate(${x} ${y}) rotate(${spin}) scale(${r} ${r * squash})`,
  petals: [0, 1, 2, 3, 4].map((p) => ({
    rotate: p * 72 + [0, 6, -4, 9, -7][p],
    scale: [1, 0.92, 1.06, 0.95, 1.02][p],
  })),
}))
const SPRIG_STAMENS = Array.from({ length: 9 }, (_, s) => {
  const a = (s * 40 * Math.PI) / 180
  return { cx: 0.3 * Math.cos(a), cy: 0.3 * Math.sin(a) }
})

const isCover = (i, side) =>
  (side === 'front' && i === 0) || (side === 'back' && i === leaves.value.length - 1)

const backUp = (i) => angles.value[i] < -90
const isTurning = (i) => angles.value[i] > -180 && angles.value[i] < 0

// leather boards only sit under a side once a leaf has landed there
const leftBoard = computed(() => angles.value.some((a) => a < -90))
const rightBoard = computed(() => angles.value.some((a) => a >= -90))

// while the book rests closed, pages under the cover stay hidden — the
// cover's lace edge and clip leave gaps they'd otherwise peek through
function isTucked(i) {
  const a = angles.value
  const n = a.length
  if (a.every((x) => x === 0)) return i > 0
  if (a.every((x) => x === -180)) return i < n - 1
  return false
}

function zOf(i) {
  if (isTurning(i)) return 100 + (turns.get(i)?.order ?? 0)
  return backUp(i) ? i + 1 : leaves.value.length - i
}

function onKey(e) {
  if (e.key === 'ArrowRight') go(1)
  else if (e.key === 'ArrowLeft') go(-1)
  else return
  e.preventDefault()
}

// swipe
let swipeX = null
function onDown(e) {
  swipeX = e.clientX
}
function onUp(e) {
  if (swipeX == null) return
  const dx = e.clientX - swipeX
  swipeX = null
  if (Math.abs(dx) > 40) {
    go(dx < 0 ? 1 : -1)
    suppressClick = true
  }
}
let suppressClick = false
function onClickCapture(e) {
  if (suppressClick) {
    e.stopPropagation()
    suppressClick = false
  }
}

const status = computed(() => {
  if (atStart.value) return 'Cover'
  if (atEnd.value) return 'Back cover'
  const left = flipped.value * 2
  return `Pages ${left}–${left + 1}`
})
</script>

<template>
  <div class="scrap">
    <!-- relief lighting for the metal, ribbons and paper bits: a soft bevel
         from a top-left light, so they read as objects, not flat shapes -->
    <svg class="scrap__defs" aria-hidden="true">
      <filter id="scrap-relief" x="-10%" y="-10%" width="120%" height="120%" color-interpolation-filters="sRGB">
        <feGaussianBlur in="SourceAlpha" stdDeviation="1.4" result="blur" />
        <feSpecularLighting in="blur" surfaceScale="3" specularConstant="0.75" specularExponent="16" lighting-color="#fff6e6" result="spec">
          <feDistantLight azimuth="235" elevation="42" />
        </feSpecularLighting>
        <feComposite in="spec" in2="SourceAlpha" operator="in" result="shine" />
        <feComposite in="SourceGraphic" in2="shine" operator="arithmetic" k2="1" k3="0.55" />
      </filter>
    </svg>
    <div
      class="scrap__stage"
      tabindex="0"
      role="region"
      aria-roledescription="flip book"
      :aria-label="`Scrapbook, ${status}. Use left and right arrow keys to turn pages.`"
      @keydown="onKey"
      @pointerdown="onDown"
      @pointerup="onUp"
      @pointercancel="swipeX = null"
      @click.capture="onClickCapture"
    >
      <div
        class="book"
        :class="{ 'is-closed-front': atStart, 'is-closed-back': atEnd }"
        :style="{ '--turn': `${TURN_MS}ms` }"
      >
        <!-- leather case: back boards the paper sits on -->
        <div class="board board--left" :class="{ 'is-shown': leftBoard }" aria-hidden="true" />
        <div class="board board--right" :class="{ 'is-shown': rightBoard }" aria-hidden="true" />

        <div
          v-for="(leaf, i) in leaves"
          :key="i"
          class="leaf"
          :class="{ 'is-back-up': backUp(i), 'is-tucked': isTucked(i) }"
          :style="{ zIndex: zOf(i), transform: `rotateY(${angles[i]}deg)` }"
          @click="onLeafClick(i)"
        >
          <div
            v-for="side in ['front', 'back']"
            :key="side"
            class="page"
            :class="[
              `page--${side}`,
              { 'page--cover': isCover(i, side) && !leaf[side].image },
              { 'page--photo': leaf[side].image },
            ]"
            :style="{ background: leaf[side].image || isCover(i, side) ? null : leaf[side].color }"
          >
            <template v-if="leaf[side].image">
              <img
                :src="leaf[side].image"
                :alt="leaf[side].caption || ''"
                loading="lazy"
                draggable="false"
              />
              <!-- spine shading, clipped to the page's own torn outline -->
              <span class="page__shade" :style="{ '--page-img': `url(${leaf[side].image})` }" />
            </template>
            <!-- wine leather travel notebook: lace-trimmed pages peek out on
                 the right, an elastic band wraps it, ribbons hang off the spine -->
            <div v-else-if="isCover(i, side)" class="cover" :class="`cover--${side}`">
              <span class="cover__lace" aria-hidden="true" />
              <span class="cover__skin" aria-hidden="true" />
              <!-- brass corner guards on the leather's fore-edge -->
              <span class="corner corner--top" aria-hidden="true" />
              <span class="corner corner--bottom" aria-hidden="true" />

              <template v-if="side === 'front'">
                <span class="cover__clip" aria-hidden="true" />
                <svg class="cover__ribbons" viewBox="0 0 60 300" aria-hidden="true">
                  <defs>
                    <linearGradient id="scrap-brass-g" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0" stop-color="var(--scrap-brass-light)" />
                      <stop offset="0.55" stop-color="var(--scrap-brass)" />
                      <stop offset="1" stop-color="var(--scrap-brass-dark)" />
                    </linearGradient>
                  </defs>
                  <path class="rib rib--satin" d="M40 6 C 30 60, 44 110, 28 170 S 20 250, 30 292 L 20 296 C 10 250, 16 200, 20 165 S 24 70, 32 8 Z" />
                  <path class="rib rib--lace" d="M42 8 C 50 70, 34 120, 44 190 S 52 250, 46 280" />
                  <path class="rib rib--lace-holes" d="M42 8 C 50 70, 34 120, 44 190 S 52 250, 46 280" />
                  <path class="rib rib--thin" d="M38 8 C 20 50, 14 90, 18 140 S 8 200, 12 238.6" />
                  <g class="trinket trinket--flower">
                    <circle class="trinket__loop" cx="12" cy="241" r="2.4" />
                    <line class="trinket__chain" x1="12" y1="243.4" x2="12" y2="244.5" />
                    <circle class="trinket__body" cx="12.0" cy="246.8" r="2.9" />
                    <circle class="trinket__body" cx="16.0" cy="249.7" r="2.9" />
                    <circle class="trinket__body" cx="14.5" cy="254.4" r="2.9" />
                    <circle class="trinket__body" cx="9.5" cy="254.4" r="2.9" />
                    <circle class="trinket__body" cx="8.0" cy="249.7" r="2.9" />
                    <circle class="trinket__gem" cx="12" cy="251" r="2.2" />
                  </g>
                  <circle class="rib__ring" cx="40" cy="8" r="6" />
                  <!-- charms dangling off the ribbon ends -->
                  <g class="trinket trinket--heart">
                    <circle class="trinket__loop" cx="25" cy="299" r="2.6" />
                    <path class="trinket__body" d="M25 321 C 14 313, 15 303, 21 303 C 24 303, 25 306, 25 307 C 25 306, 26 303, 29 303 C 35 303, 36 313, 25 321 Z" />
                    <circle class="trinket__gem" cx="25" cy="310" r="2" />
                  </g>
                  <g class="trinket trinket--star">
                    <circle class="trinket__loop" cx="46.5" cy="285" r="2.4" />
                    <line class="trinket__chain" x1="46.5" y1="287.4" x2="47" y2="291" />
                    <polygon class="trinket__body" points="47.0,291.0 48.8,295.6 53.7,295.8 49.9,298.9 51.1,303.7 47.0,301.0 42.9,303.7 44.1,298.9 40.3,295.8 45.2,295.6" />
                  </g>
                </svg>

                <!-- a dried sprig tucked under the elastic -->
                <svg class="cover__sprig" viewBox="0 0 60 120" aria-hidden="true">
                  <path class="sprig__stem" d="M30 118 C 31 90, 26 60, 32 30 M31 80 C 22 72, 16 66, 14 56 M30 62 C 40 54, 44 46, 46 36" />
                  <path class="sprig__leaf" d="M30 96 C 20 92, 16 84, 18 78 C 26 80, 30 88, 30 96 Z" />
                  <path class="sprig__leaf" d="M31 88 C 40 84, 44 76, 42 70 C 35 72, 31 80, 31 88 Z" />
                  <defs>
                    <radialGradient id="sprig-petal-g" cx="0.5" cy="1" r="1.05">
                      <stop offset="0" stop-color="#b8606a" />
                      <stop offset="0.35" stop-color="#d99a9c" />
                      <stop offset="0.8" stop-color="#efcfc8" />
                      <stop offset="1" stop-color="#e6bdb4" />
                    </radialGradient>
                    <radialGradient id="sprig-heart-g" cx="0.4" cy="0.35" r="0.7">
                      <stop offset="0" stop-color="#f0d68a" />
                      <stop offset="0.6" stop-color="#c9963f" />
                      <stop offset="1" stop-color="#7a5326" />
                    </radialGradient>
                  </defs>
                  <g v-for="(f, k) in SPRIG_FLOWERS" :key="k" class="sprig__flower" :transform="f.transform">
                    <!-- sepals peeking out between the petals -->
                    <path
                      v-for="s in 5"
                      :key="`s${s}`"
                      class="sprig__sepal"
                      :transform="`rotate(${s * 72 + 36})`"
                      d="M0 0 C -0.12 -0.3, -0.06 -0.6, 0 -0.72 C 0.06 -0.6, 0.12 -0.3, 0 0 Z"
                    />
                    <g v-for="(p, n) in f.petals" :key="n" :transform="`rotate(${p.rotate}) scale(${p.scale})`">
                      <!-- obovate petal with a soft notch at the tip -->
                      <path
                        class="sprig__petal"
                        d="M0 0 C -0.34 -0.14, -0.58 -0.62, -0.34 -0.94 C -0.22 -1.08, -0.07 -1.03, 0 -0.93 C 0.07 -1.03, 0.22 -1.08, 0.34 -0.94 C 0.58 -0.62, 0.34 -0.14, 0 0 Z"
                      />
                      <path class="sprig__vein" d="M0 -0.12 L 0 -0.86 M0 -0.3 C -0.12 -0.45, -0.2 -0.62, -0.22 -0.8 M0 -0.3 C 0.12 -0.45, 0.2 -0.62, 0.22 -0.8" />
                    </g>
                    <circle class="sprig__heart" r="0.24" />
                    <circle v-for="(st, s) in SPRIG_STAMENS" :key="`st${s}`" class="sprig__stamen" :cx="st.cx" :cy="st.cy" r="0.055" />
                  </g>
                </svg>

                <!-- kraft name tag on a string, hung from the band charm -->
                <svg class="cover__tag" viewBox="0 0 50 80" aria-hidden="true">
                  <path class="tag__string" d="M8 0 C 10 10, 18 14, 24 22" />
                  <g transform="rotate(10 25 50)">
                    <path class="tag__card" d="M14 24 L 36 24 L 42 32 L 42 74 L 8 74 L 8 32 Z" />
                    <circle class="tag__hole" cx="25" cy="30" r="2.4" />
                    <text class="tag__text" x="25" y="56" text-anchor="middle">melz</text>
                  </g>
                </svg>

                <div v-if="leaf[side].strip" class="cover__strip">
                  <span class="cover__tape" aria-hidden="true" />
                  <span v-for="(shot, s) in leaf[side].strip" :key="s" class="cover__shot">
                    <img
                      :src="shot.image"
                      alt=""
                      draggable="false"
                      :style="{ transformOrigin: shot.focus, scale: shot.zoom }"
                    />
                  </span>
                </div>
              </template>

              <span class="cover__band" aria-hidden="true">
                <span v-if="side === 'front'" class="cover__charm" />
              </span>

              <!-- debossed heart in the back leather -->
              <svg v-if="side === 'back'" class="cover__emboss" viewBox="0 0 40 36" aria-hidden="true">
                <path d="M20 33 C 6 23, 2 14, 8 7 C 13 2, 19 5, 20 10 C 21 5, 27 2, 32 7 C 38 14, 34 23, 20 33 Z" />
              </svg>

              <h3 v-if="leaf[side].title" class="cover__title">
                <span v-for="(line, l) in leaf[side].title" :key="l">{{ line }}</span>
              </h3>
              <span v-else-if="side === 'back' && leaf[side].caption" class="cover__end">{{ leaf[side].caption }}</span>
            </div>
            <div v-else class="page__placeholder">
              <span class="page__caption">{{ leaf[side].caption }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="scrap__controls">
      <button type="button" class="scrap__btn" :disabled="atStart" aria-label="Previous page" @click="go(-1)">
        ←
      </button>
      <span class="scrap__status" aria-live="polite">{{ status }}</span>
      <button type="button" class="scrap__btn" :disabled="atEnd" aria-label="Next page" @click="go(1)">
        →
      </button>
    </div>
  </div>
</template>

<style scoped>
.scrap__defs {
  position: absolute;
  width: 0;
  height: 0;
}

.scrap__stage {
  display: flex;
  justify-content: center;
  padding: clamp(1rem, 3vw, 2rem) 0;
  outline: none;
  touch-action: pan-y;
  user-select: none;
  -webkit-user-select: none;
}

.scrap__stage:focus-visible .book {
  outline: 2px solid var(--color-accent);
  outline-offset: 0.75rem;
  border-radius: var(--radius-s);
}

/* two pages side by side (each ~0.68 wide : 1 tall, like the real
   sketchbook); leaves live on the right half */
.book {
  position: relative;
  /* as wide as fits, but also short enough that the whole book plus the
     arrows fits under the navbar (8rem = stage padding + controls) */
  width: min(100%, 58.75rem, max(26.25rem, calc((100svh - var(--nav-h) - 8rem) * 1.36)));
  aspect-ratio: 1.36;
  perspective: 150rem;
  transition: translate var(--turn) var(--ease-in-out);
}

/* closed: slide the book so the single visible cover sits centred */
.book.is-closed-front {
  translate: -25% 0;
}
.book.is-closed-back {
  translate: 25% 0;
}

.leaf {
  position: absolute;
  top: 0;
  left: 50%;
  width: 50%;
  height: 100%;
  transform-origin: left center;
  transform-style: preserve-3d;
  cursor: pointer;
}

.leaf.is-tucked {
  visibility: hidden;
}

.page {
  position: absolute;
  inset: 0;
  overflow: hidden;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  background: var(--df-flesh-50);
  box-shadow: var(--shadow-m);
}

/* backface-visibility alone isn't enough (Safari ignores it for children
   with their own layer, like the scans' drop-shadow / mask), so the face
   turned away is hidden explicitly — flips exactly at 90°, set from JS */
.leaf.is-back-up .page--front,
.leaf:not(.is-back-up) .page--back {
  visibility: hidden;
}

.page--front {
  border-radius: 2px var(--radius-s) var(--radius-s) 2px;
}

.page--back {
  transform: rotateY(180deg);
  border-radius: var(--radius-s) 2px 2px var(--radius-s);
}

/* spine shading — pages curve into the gutter */
.page::after {
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
}
.page--front::after {
  background: linear-gradient(90deg, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.1) 3%, rgba(255, 255, 255, 0.06) 7%, rgba(0, 0, 0, 0) 14%);
}
.page--back::after {
  background: linear-gradient(270deg, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.1) 3%, rgba(255, 255, 255, 0.06) 7%, rgba(0, 0, 0, 0) 14%);
}

/* ---- leather ---------------------------------------------------------- */
/* pebble grain is lit noise (it catches the light like real hide), split
   into wine-dark shadows and pink highlights baked into the SVG, so it
   needs no blend mode: iOS Safari won't blend inside the 3D page flip and
   painted the grey height map over the dye. A large, slow noise adds the
   uneven, handled patches every real cover has. */
.book {
  --leather-grain: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='240'%3E%3Cfilter id='g' x='0' y='0' width='100%25' height='100%25'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.95' numOctaves='3' seed='4' stitchTiles='stitch'/%3E%3CfeDiffuseLighting lighting-color='%23fff' surfaceScale='1.6' diffuseConstant='.9' result='l'%3E%3CfeDistantLight azimuth='235' elevation='40'/%3E%3C/feDiffuseLighting%3E%3CfeColorMatrix in='l' result='s' values='0 0 0 0 .12 0 0 0 0 0 0 0 0 0 .02 -.8 0 0 0 .42'/%3E%3CfeColorMatrix in='l' result='h' values='0 0 0 0 1 0 0 0 0 .3 0 0 0 0 .38 .45 0 0 0 -.1'/%3E%3CfeMerge%3E%3CfeMergeNode in='s'/%3E%3CfeMergeNode in='h'/%3E%3C/feMerge%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23g)'/%3E%3C/svg%3E");
  --leather-mottle: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='700' height='700'%3E%3Cfilter id='m'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.006' numOctaves='3' seed='9' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 -.9 .48'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23m)'/%3E%3C/svg%3E");
  --leather: var(--leather-grain), var(--leather-mottle), linear-gradient(160deg, var(--scrap-leather-400), var(--scrap-leather-600) 45%, var(--scrap-leather-800));
  /* resting on a table: tight contact shadow + a wide, soft ambient one */
  --book-shadow:
    0 1px 1px rgba(30, 10, 10, 0.3),
    0 4px 8px -2px rgba(30, 10, 10, 0.25),
    0 1.125rem 2.25rem -0.625rem rgba(30, 10, 10, 0.35),
    0 2.5rem 4.375rem -1.875rem rgba(30, 10, 10, 0.3);
  /* worn, darker edges where hands have handled it */
  --leather-wear:
    inset 0 0 0 1px rgba(255, 220, 210, 0.08),
    inset 0 0 0 2px rgba(0, 0, 0, 0.18),
    inset 0 0 0.875rem rgba(0, 0, 0, 0.35),
    inset 0 -8px 1.125rem rgba(0, 0, 0, 0.3);
}

/* the case the paper is bound into — a little bigger than the pages.
   The covers' leather (.cover__skin) uses the same overhang so a closing
   cover lands exactly on the case. */
.book {
  --case-y: 2.5%; /* of page height, top and bottom */
  --case-x: 3%; /* of page width, at the fore-edge */
}
.board {
  position: absolute;
  top: calc(var(--case-y) * -1);
  bottom: calc(var(--case-y) * -1);
  width: calc(50% * (1 + var(--case-x) / 100%));
  background: var(--leather);
  background-size: 15rem 15rem, 43.75rem 43.75rem, auto;
  box-shadow: var(--book-shadow), var(--leather-wear);
  opacity: 0;
}
.board.is-shown {
  opacity: 1;
}
.board--left {
  right: 50%;
  border-radius: var(--radius-m) 3px 3px var(--radius-m);
}
.board--right {
  left: 50%;
  border-radius: 3px var(--radius-m) var(--radius-m) 3px;
}

/* ---- covers: wine leather travel notebook ------------------------------ */
.page--cover {
  background: none;
  box-shadow: none;
  overflow: visible;
}
.page--cover::after {
  content: none;
}

.cover {
  position: absolute;
  inset: 0;
  container-type: inline-size;
}

/* the page block: thick, uneven collage pages poking just past the
   leather's fore-edge, each sheet a slightly different cream */
.cover__lace {
  position: absolute;
  top: 1.2%;
  bottom: 1.4%;
  width: 10%;
  background:
    linear-gradient(180deg, rgba(0, 0, 0, 0.18), transparent 8%, transparent 90%, rgba(0, 0, 0, 0.22)),
    repeating-linear-gradient(90deg, #efe6d2 0 2px, #d6c8ad 2px 2.6px, #f5eedf 2.6px 4.4px, #c9b99c 4.4px 5px, #ebe0c8 5px 6.6px, #d9ccb2 6.6px 7.2px);
  box-shadow: 0 2px 4px rgba(30, 10, 10, 0.25);
}
.cover--front .cover__lace {
  right: calc(var(--case-x) * -1 - 1.2%);
  border-radius: 0 3px 3px 0;
}
.cover--back .cover__lace {
  left: calc(var(--case-x) * -1 - 1.2%);
  border-radius: 3px 0 0 3px;
}

.cover__skin {
  position: absolute;
  inset: calc(var(--case-y) * -1) 0;
  background:
    radial-gradient(ellipse at 28% 16%, rgba(255, 235, 225, 0.12), transparent 55%),
    var(--leather);
  background-size: auto, 15rem 15rem, 43.75rem 43.75rem, auto;
  box-shadow: var(--book-shadow), var(--leather-wear);
}
.cover--front .cover__skin {
  right: calc(var(--case-x) * -1);
  border-radius: 3px var(--radius-m) var(--radius-m) 3px;
}
.cover--back .cover__skin {
  left: calc(var(--case-x) * -1);
  border-radius: var(--radius-m) 3px 3px var(--radius-m);
}
/* the spine fold */
.cover__skin::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: linear-gradient(90deg, rgba(0, 0, 0, 0.45), rgba(0, 0, 0, 0.12) 2.5%, rgba(255, 230, 220, 0.1) 5%, rgba(0, 0, 0, 0.08) 7.5%, rgba(0, 0, 0, 0) 11%);
}
.cover--back .cover__skin::after {
  background: linear-gradient(270deg, rgba(0, 0, 0, 0.45), rgba(0, 0, 0, 0.12) 2.5%, rgba(255, 230, 220, 0.1) 5%, rgba(0, 0, 0, 0.08) 7.5%, rgba(0, 0, 0, 0) 11%);
}

/* brass pen clip poking up over the top edge */
.cover__clip {
  position: absolute;
  top: -4.5%;
  left: 34%;
  width: 8cqw;
  height: 12cqw;
  border-radius: 2.5cqw 2.5cqw 1cqw 1cqw;
  background:
    linear-gradient(90deg, var(--scrap-brass-dark), var(--scrap-brass-light) 35%, var(--scrap-brass) 60%, var(--scrap-brass-dark));
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.45);
  filter: url(#scrap-relief);
}
.cover__clip::after {
  content: '';
  position: absolute;
  left: 20%;
  right: 20%;
  top: 22%;
  height: 1.2cqw;
  border-radius: 1cqw;
  background: var(--scrap-brass-dark);
  opacity: 0.6;
}

/* satin + lace ribbons hanging off the spine */
.cover__ribbons {
  position: absolute;
  top: 1%;
  left: -13%;
  width: 20%;
  overflow: visible;
  filter: drop-shadow(0 1px 1px rgba(30, 10, 10, 0.35)) drop-shadow(0 4px 4px rgba(30, 10, 10, 0.22));
  pointer-events: none;
}
.cover__ribbons .trinket,
.cover__ribbons .rib__ring {
  filter: url(#scrap-relief);
}
.rib--satin {
  fill: var(--scrap-ribbon);
  stroke: var(--scrap-ribbon-dark);
  stroke-width: 0.6;
}
.rib--lace {
  fill: none;
  stroke: var(--scrap-lace);
  stroke-width: 6;
}
.rib--lace-holes {
  fill: none;
  stroke: var(--scrap-lace-shadow);
  stroke-width: 1.8;
  stroke-linecap: round;
  stroke-dasharray: 0 3.2;
}
.rib--thin {
  fill: none;
  stroke: var(--scrap-ribbon);
  stroke-width: 2.2;
  stroke-linecap: round;
}
.rib__ring {
  fill: none;
  stroke: var(--scrap-brass);
  stroke-width: 2.5;
}

/* little brass charms on the ribbon ends — they sway a touch on hover */
.trinket {
  transform-box: fill-box;
  transform-origin: 50% 0;
  transition: rotate 0.6s var(--ease);
}
.leaf:hover .trinket--heart {
  rotate: -9deg;
}
.leaf:hover .trinket--star {
  rotate: 11deg;
}
.leaf:hover .trinket--flower {
  rotate: 8deg;
}
.trinket__loop,
.trinket__chain {
  fill: none;
  stroke: var(--scrap-brass);
  stroke-width: 1.3;
}
.trinket__body {
  fill: url(#scrap-brass-g);
  stroke: var(--scrap-brass-dark);
  stroke-width: 0.6;
}
.trinket__gem {
  fill: var(--scrap-ribbon);
  stroke: rgba(255, 255, 255, 0.6);
  stroke-width: 0.6;
}

/* hand-stitching around the leather */
.cover__skin::before {
  content: '';
  position: absolute;
  inset: 3.4cqw;
  border: max(1px, 0.4cqw) dashed rgba(226, 200, 170, 0.42);
  border-radius: var(--radius-s);
  filter: drop-shadow(0 1px 0 rgba(0, 0, 0, 0.55));
  pointer-events: none;
}

/* brass corner guards — on the closed covers and on the open case.
   One top-right triangle, mirrored with scale for the other corners. */
.corner,
.board::before,
.board::after {
  content: '';
  position: absolute;
  width: 9.5cqw;
  aspect-ratio: 1;
  background:
    radial-gradient(circle at 72% 28%, var(--scrap-brass-dark) 0 5%, transparent 7%),
    linear-gradient(200deg, var(--scrap-brass-light), var(--scrap-brass) 45%, var(--scrap-brass-dark));
  clip-path: polygon(0 0, 100% 0, 100% 100%);
  border-top-right-radius: var(--radius-m);
  filter: url(#scrap-relief) drop-shadow(0 1px 1.5px rgba(0, 0, 0, 0.45));
  pointer-events: none;
}
.cover .corner--top,
.cover .corner--bottom {
  top: calc(var(--case-y) * -1);
}
.cover .corner--bottom {
  top: auto;
  bottom: calc(var(--case-y) * -1);
}
.cover--front .corner {
  right: calc(var(--case-x) * -1);
}
.cover--back .corner {
  left: calc(var(--case-x) * -1);
}
/* the boards are their own box, so their corners sit flush */
.board::before,
.board::after {
  width: 9.2%;
}
.board::before {
  top: 0;
}
.board::after {
  bottom: 0;
}
.board--right::before,
.board--right::after {
  right: 0;
}
.board--left::before,
.board--left::after {
  left: 0;
}
.cover--front .corner--bottom,
.board--right::after {
  scale: 1 -1;
}
.cover--back .corner--top,
.board--left::before {
  scale: -1 1;
}
.cover--back .corner--bottom,
.board--left::after {
  scale: -1 -1;
}

/* a dried sprig slipped under the elastic */
.cover__sprig {
  position: absolute;
  top: 40%;
  right: 5%;
  width: 22cqw;
  rotate: 14deg;
  overflow: visible;
  opacity: 0.88;
  filter: drop-shadow(0 1px 0.5px rgba(0, 0, 0, 0.45));
  pointer-events: none;
  z-index: 1;
}
.sprig__stem {
  fill: none;
  stroke: #9a8a5c;
  stroke-width: 1.4;
  stroke-linecap: round;
}
.sprig__leaf {
  fill: #a6a072;
}
/* flower parts are drawn in a unit space and scaled up, so strokes are tiny */
.sprig__sepal {
  fill: #8e8a58;
}
.sprig__petal {
  fill: url(#sprig-petal-g);
  stroke: #b77f80;
  stroke-width: 0.03;
}
.sprig__vein {
  fill: none;
  stroke: #a85d66;
  stroke-width: 0.025;
  stroke-linecap: round;
  opacity: 0.45;
}
.sprig__heart {
  fill: url(#sprig-heart-g);
}
.sprig__stamen {
  fill: #6b4420;
}

/* kraft tag on a string from the band charm */
.cover__tag {
  position: absolute;
  top: 57.5%;
  left: 60%;
  width: 13cqw;
  overflow: visible;
  filter: drop-shadow(0 1px 1px rgba(0, 0, 0, 0.35)) drop-shadow(0 4px 4px rgba(0, 0, 0, 0.2));
  transform-origin: 16% 0;
  transition: rotate 0.6s var(--ease);
  pointer-events: none;
  z-index: 1;
}
.leaf:hover .cover__tag {
  rotate: -6deg;
}
.tag__string {
  fill: none;
  stroke: var(--scrap-ribbon-dark);
  stroke-width: 1;
}
.tag__card {
  fill: #c7a676;
  stroke: #a5835a;
  stroke-width: 0.6;
}
.tag__hole {
  fill: var(--scrap-leather-600);
  stroke: var(--scrap-brass);
  stroke-width: 1;
}
.tag__text {
  font-family: var(--font-hand);
  font-size-adjust: var(--hand-size-adjust);
  -webkit-text-stroke: var(--hand-stroke) currentColor;
  font-size: 9px;
  fill: #4a2a1c;
}

/* debossed heart on the back */
.cover__emboss {
  position: absolute;
  left: 50%;
  bottom: 14%;
  width: 16cqw;
  translate: -50% 0;
  overflow: visible;
}
.cover__emboss path {
  fill: rgba(0, 0, 0, 0.16);
  stroke: rgba(0, 0, 0, 0.32);
  stroke-width: 1.4;
  filter: drop-shadow(0 1px 0 rgba(255, 255, 255, 0.14));
}

@media (prefers-reduced-motion: reduce) {
  .trinket,
  .cover__tag {
    transition: none;
  }
}

/* photo-booth strip, tucked under the band */
.cover__strip {
  position: absolute;
  top: 5%;
  left: 10%;
  width: 31%;
  display: grid;
  gap: 1.3cqw;
  padding: 1.6cqw 1.6cqw 3.4cqw;
  background:
    linear-gradient(100deg, rgba(0, 0, 0, 0.06), transparent 20%, transparent 80%, rgba(0, 0, 0, 0.08)),
    var(--scrap-photo-paper);
  box-shadow:
    0 1px 1px rgba(30, 10, 10, 0.4),
    0 6px 0.625rem -3px rgba(30, 10, 10, 0.45),
    4px 0.875rem 1.125rem -0.625rem rgba(30, 10, 10, 0.5);
  rotate: -2.5deg;
}
/* translucent washi tape over the strip's top edge, with torn ends */
.cover__tape {
  position: absolute;
  top: -2.6cqw;
  left: 50%;
  width: 70%;
  height: 5.5cqw;
  translate: -50% 0;
  rotate: 4deg;
  background:
    repeating-linear-gradient(90deg, rgba(255, 255, 255, 0.12) 0 1px, transparent 1px 3px),
    rgba(214, 196, 160, 0.72);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.18);
  clip-path: polygon(0 0, 3% 12%, 0 25%, 2.5% 38%, 0 50%, 3% 63%, 0 76%, 2% 88%, 0 100%, 100% 100%, 97% 87%, 100% 75%, 97.5% 62%, 100% 50%, 97% 37%, 100% 24%, 98% 12%, 100% 0);
  z-index: 1;
}
.cover__shot {
  display: block;
  aspect-ratio: 1;
  overflow: hidden;
  background: radial-gradient(ellipse at 50% 30%, var(--scrap-photo-paper), var(--scrap-photo-backdrop));
}
.page .cover__shot img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: 50% 0;
  /* silver-gelatin booth prints: warm-ish black and white, a little soft */
  filter: grayscale(1) sepia(0.12) contrast(1.05) brightness(1.02);
}

/* elastic cord with an oval charm */
.cover__band {
  position: absolute;
  left: 0;
  right: 0;
  top: 56%;
  height: max(3px, 1.1cqw);
  border-radius: 1cqw;
  background: linear-gradient(180deg, var(--scrap-leather-900), var(--scrap-leather-400) 30%, #b4505a 42%, var(--scrap-leather-600) 60%, var(--scrap-leather-900));
  box-shadow:
    0 1px 1px rgba(0, 0, 0, 0.5),
    0 3px 5px rgba(0, 0, 0, 0.35);
  z-index: 2;
}
.cover--front .cover__band {
  right: calc(var(--case-x) * -1);
}
.cover--back .cover__band {
  left: calc(var(--case-x) * -1);
}
.cover__charm {
  position: absolute;
  top: 50%;
  left: 62%;
  width: 11cqw;
  height: 6.5cqw;
  translate: -50% -50%;
  border-radius: 50%;
  background: radial-gradient(ellipse at 40% 35%, var(--scrap-leather-400), var(--scrap-leather-800));
  box-shadow:
    0 0 0 0.9cqw var(--scrap-brass),
    0 0 0 1.2cqw var(--scrap-brass-dark),
    0 3px 5px 1cqw rgba(0, 0, 0, 0.4),
    inset 0 1px 2px rgba(255, 255, 255, 0.3);
  filter: url(#scrap-relief);
}

/* white script title, running down past the band */
.cover__title {
  position: absolute;
  top: 27%;
  left: 45%;
  right: 8%;
  margin: 0;
  display: flex;
  flex-direction: column;
  font-family: var(--font-script);
  font-weight: 400;
  font-size: 10.5cqw;
  line-height: 1.35;
  letter-spacing: 0;
  color: var(--scrap-ink);
  text-shadow: 0 -1px 0 rgba(0, 0, 0, 0.35), 0 1px 1px rgba(0, 0, 0, 0.4);
  z-index: 1;
}
.cover__title span:nth-child(2) {
  padding-left: 22%;
}

.cover__end {
  position: absolute;
  right: 22%;
  bottom: 12%;
  font-family: var(--font-script);
  font-size: 9cqw;
  color: var(--scrap-ink);
  opacity: 0.75;
}

.page img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  pointer-events: none;
}

/* real scanned pages: keep their rounded, torn outline (transparent WebP),
   so the leather case shows through where the paper is ripped */
.page--photo {
  background: none;
  box-shadow: none;
  border-radius: 0;
  overflow: visible;
}
.page--photo img {
  object-fit: fill;
  filter: drop-shadow(0 1px 1px rgba(30, 10, 10, 0.3)) drop-shadow(0 4px 6px rgba(30, 10, 10, 0.18));
}
.page--photo::after {
  content: none;
}
.page__shade {
  position: absolute;
  inset: 0;
  pointer-events: none;
  -webkit-mask: var(--page-img) center / 100% 100% no-repeat;
  mask: var(--page-img) center / 100% 100% no-repeat;
}
/* the paper curves down into the gutter: deep shade at the fold, a soft
   highlight on the rise, then flat; the fore-edge dips a touch too */
.page--front .page__shade {
  background: linear-gradient(90deg, rgba(0, 0, 0, 0.38), rgba(0, 0, 0, 0.14) 3%, rgba(255, 250, 240, 0.08) 7.5%, rgba(0, 0, 0, 0) 14%, rgba(0, 0, 0, 0) 94%, rgba(0, 0, 0, 0.08));
}
.page--back .page__shade {
  background: linear-gradient(270deg, rgba(0, 0, 0, 0.38), rgba(0, 0, 0, 0.14) 3%, rgba(255, 250, 240, 0.08) 7.5%, rgba(0, 0, 0, 0) 14%, rgba(0, 0, 0, 0) 94%, rgba(0, 0, 0, 0.08));
}

/* ---- placeholder (until real scans arrive) ----------------------------- */
.page__placeholder {
  display: grid;
  place-items: center;
  height: 100%;
  /* faint dotted journal paper */
  background-image: radial-gradient(rgba(26, 21, 23, 0.14) 1px, transparent 1.4px);
  background-size: 1.125rem 1.125rem;
}

.page__caption {
  font-family: var(--font-hand);
  font-size-adjust: var(--hand-size-adjust);
  -webkit-text-stroke: var(--hand-stroke) currentColor;
  font-size: clamp(0.9rem, 0.6rem + 1.2vw, 1.6rem);
  color: var(--df-flesh-500);
}

/* ---- controls ---------------------------------------------------------- */
.scrap__controls {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.25rem;
  margin-top: 0.5rem;
}

.scrap__status {
  min-width: 9ch;
  text-align: center;
  font-size: var(--step--1);
  color: var(--color-ink-faint);
  font-variant-numeric: tabular-nums;
}

.scrap__btn {
  width: 2.6rem;
  height: 2.6rem;
  border-radius: 50%;
  border: var(--border-card);
  background: var(--color-surface);
  color: var(--color-ink);
  font-size: 1.1rem;
  cursor: pointer;
  transition: background var(--transition), opacity var(--transition);
}

.scrap__btn:hover:not(:disabled) {
  background: var(--color-accent-soft);
}

.scrap__btn:disabled {
  opacity: 0.35;
  cursor: default;
}

@media (prefers-reduced-motion: reduce) {
  .book {
    transition-duration: 0.01ms;
  }
}
</style>
