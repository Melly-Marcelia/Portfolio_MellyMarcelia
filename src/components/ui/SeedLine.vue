<script setup>
/**
 * SeedLine — the footer's wavy divider, drawn as a trail of dragon-fruit seeds.
 *
 * Seeds follow the same gentle wave the old stroke did (a 1200×40 design curve),
 * but the SVG uses the real pixel width as its viewBox so seeds stay true ovals
 * instead of being stretched. Placement is seeded-random, so it's stable between
 * renders. Add the `.reveal` / `.is-revealed` classes (v-reveal) and the seeds
 * pop in left → right. Scrolling walks the seeds along the wave (down → right,
 * up → back), wrapping around at the edges.
 *
 * The area above the curve is filled with --seedline-fill (transparent by
 * default), so the wave can double as the seam between two background colours.
 */
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

// the 40-unit design curve is stretched to fill the rendered height (4.5rem),
// measured live: rem scales up on large screens, and a fixed viewBox height
// would letterbox the SVG and open a gap above the fill
const SPACING = 12 // px between seeds along the line

// the original divider curve, as cubic segments in 1200×40 design space
const SEGMENTS = [
  [[0, 28], [120, 10], [240, 10], [360, 24]],
  [[360, 24], [480, 38], [620, 40], [780, 22]],
  [[780, 22], [940, 4], [1040, 6], [1200, 20]],
]

function bezier([p0, p1, p2, p3], t) {
  const u = 1 - t
  const a = u * u * u, b = 3 * u * u * t, c = 3 * u * t * t, d = t * t * t
  return [
    a * p0[0] + b * p1[0] + c * p2[0] + d * p3[0],
    a * p0[1] + b * p1[1] + c * p2[1] + d * p3[1],
  ]
}

// dense samples of the curve (design space), used to look up y + slope for any x
const samples = SEGMENTS.flatMap((seg, s) =>
  Array.from({ length: 120 }, (_, i) => bezier(seg, (i + (s ? 1 : 0)) / 120)),
)

function sampleAt(x) {
  let i = samples.findIndex((p) => p[0] >= x)
  if (i <= 0) i = 1
  const [x0, y0] = samples[i - 1]
  const [x1, y1] = samples[i]
  const f = x1 === x0 ? 0 : (x - x0) / (x1 - x0)
  return { y: y0 + (y1 - y0) * f, dy: (y1 - y0) / (x1 - x0 || 1) }
}

// tiny deterministic PRNG so seeds don't reshuffle on every resize
function rng(seed) {
  return () => {
    seed = (seed * 16807) % 2147483647
    return (seed - 1) / 2147483646
  }
}

const root = ref(null)
const width = ref(1200)
const height = ref(72)

const seeds = computed(() => {
  const W = width.value
  const rand = rng(7)
  const count = Math.max(24, Math.round(W / SPACING))
  return Array.from({ length: count }, (_, i) => {
    const xd = ((i + 0.5 + (rand() - 0.5) * 0.7) / count) * 1200
    return {
      x: (xd / 1200) * W, // resting position, real px
      jitter: (rand() - 0.5) * 4.5, // scatter either side of the line
      spin: (rand() - 0.5) * 60, // wobble around the curve's direction
      s: 0.85 + rand() * 0.6,
      d: Math.round((xd / 1200) * 1400 + rand() * 120),
    }
  })
})

/** Transform for a seed pushed `shift` px along the wave (wraps at the edges). */
function place(seed, shift) {
  const W = width.value
  const scale = W / 1200
  const x = (((seed.x + shift) % W) + W) % W
  const { y, dy } = sampleAt(x / scale)
  // slope in real pixels, so seeds lie along the visible curve
  const Y = height.value / 40
  const along = Math.atan2(dy * Y, scale) * (180 / Math.PI)
  return `translate(${x.toFixed(1)} ${(y * Y + seed.jitter).toFixed(1)}) rotate(${(along + seed.spin).toFixed(1)}) scale(${seed.s.toFixed(2)})`
}

// the band above the curve, in real px: top edge → along the wave → back
const fillPath = computed(() => {
  const k = width.value / 1200
  const Y = height.value / 40
  const pts = samples
    .filter((_, i) => i % 4 === 0)
    .concat([samples[samples.length - 1]])
    .map(([x, y]) => `${(x * k).toFixed(1)} ${(y * Y).toFixed(1)}`)
  return `M0 0 L${pts.join(' L')} L${width.value} 0 Z`
})

// scrolling walks the seeds along the wave: down → right, up → back
const WALK = 0.35 // px of travel per px scrolled
const reduceMotion =
  typeof window !== 'undefined' &&
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
const seedEls = ref([])
let shift = 0
let frame = 0
let visible = false

function walk() {
  frame = 0
  shift = window.scrollY * WALK
  seeds.value.forEach((seed, i) => seedEls.value[i]?.setAttribute('transform', place(seed, shift)))
}
function onScroll() {
  if (visible && !frame) frame = requestAnimationFrame(walk)
}

let ro, io
onMounted(() => {
  const measure = () => {
    width.value = root.value?.clientWidth || 1200
    height.value = root.value?.clientHeight || 72
  }
  measure()
  ro = new ResizeObserver(measure)
  ro.observe(root.value)

  if (reduceMotion) return
  shift = window.scrollY * WALK
  // only do the work while the divider is (nearly) on screen
  io = new IntersectionObserver(([e]) => {
    visible = e.isIntersecting
    if (visible) onScroll()
  }, { rootMargin: '200px 0px' })
  io.observe(root.value)
  window.addEventListener('scroll', onScroll, { passive: true })
})
onBeforeUnmount(() => {
  ro?.disconnect()
  io?.disconnect()
  cancelAnimationFrame(frame)
  window.removeEventListener('scroll', onScroll)
})
</script>

<template>
  <svg
    ref="root"
    class="seedline"
    :viewBox="`0 0 ${width} ${height}`"
    aria-hidden="true"
  >
    <path class="seedline__fill" :d="fillPath" />
    <g
      v-for="(seed, i) in seeds"
      :key="i"
      ref="seedEls"
      :transform="place(seed, shift)"
    >
      <!-- teardrop seed -->
      <path
        class="seedline__seed"
        :style="{ '--d': `${seed.d}ms` }"
        d="M-2.8 0 C -2.8 -2.3, 0.8 -2.5, 3 0 C 0.8 2.5, -2.8 2.3, -2.8 0 Z"
      />
    </g>
  </svg>
</template>

<style scoped>
.seedline {
  display: block;
  width: 100%;
  height: 4.5rem;
  overflow: visible;
}

.seedline__fill {
  fill: var(--seedline-fill, transparent);
}

/* v-reveal animates the seeds only — the fill (the seam) must never fade */
.seedline.reveal {
  opacity: 1;
  transform: none;
}

.seedline__seed {
  fill: currentColor;
  transform-box: fill-box;
  transform-origin: center;
  transition:
    opacity 0.5s var(--ease-soft) var(--d, 0ms),
    transform 0.6s var(--ease-soft) var(--d, 0ms);
}

/* hidden until the divider scrolls into view (v-reveal) */
.seedline.reveal:not(.is-revealed) .seedline__seed {
  opacity: 0;
  transform: scale(0);
}

@media (prefers-reduced-motion: reduce) {
  .seedline__seed {
    transition: none;
  }
}
</style>
