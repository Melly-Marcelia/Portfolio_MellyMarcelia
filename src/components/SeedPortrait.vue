<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue'

/**
 * The seed portrait assembling itself. Laid over the empty fruit
 * (logo-blank.png), it starts as a real cut dragon fruit: dark seeds
 * scattered across the white flesh. Then the seeds swirl together and
 * settle into the pencil portrait from logo-portrait-pencil.png.
 *
 * How: the portrait's ink is the difference between the two drawings (they
 * line up pixel for pixel). That ink is cut into small tiles; every tile is
 * one seed. In flight it's drawn as a seed, and as it lands it turns into its
 * own piece of the drawing, so the finished canvas is the portrait itself.
 * BrandLogo then fades the real image in on top and drops this canvas.
 *
 * All coordinates are in source pixels of the 1400×1600 logo files.
 */
const props = defineProps({
  portrait: { type: String, required: true },
  blank: { type: String, required: true },
  scale: { type: Number, default: 0.25 }, // CSS px per source px at full logo size
})
const emit = defineEmits(['done'])

const SRC_W = 1400
const SRC_H = 1600
// covers the white flesh and everything drawn in it
const REGION = { x: 520, y: 820, w: 550, h: 590 }
const TILE = 12
const RIM = 6 // source px: how close a resting seed may sit to the pink rim
const GATHER_AT = 500 // ms: seeds start moving while the logo is still sliding in
const SPREAD = 700 // ms: last seed leaves this long after the first
const FLIGHT = 1300 // ms per seed
const SEED_INK = '#1f1418'

const canvas = ref(null)
const style = {
  left: `${(REGION.x / SRC_W) * 100}%`,
  top: `${(REGION.y / SRC_H) * 100}%`,
  width: `${(REGION.w / SRC_W) * 100}%`,
  height: `${(REGION.h / SRC_H) * 100}%`,
}

let frame = 0
let stopped = false

const lum = (d, i) => 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2]
const clamp01 = (n) => Math.min(1, Math.max(0, n))
const smooth = (a, b, t) => {
  const x = clamp01((t - a) / (b - a))
  return x * x * (3 - 2 * x)
}
const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2)

async function loadPixels(src) {
  const img = new Image()
  img.src = src
  await img.decode()
  const c = document.createElement('canvas')
  c.width = REGION.w
  c.height = REGION.h
  const ctx = c.getContext('2d', { willReadFrequently: true })
  ctx.drawImage(img, -REGION.x, -REGION.y)
  return ctx.getImageData(0, 0, REGION.w, REGION.h)
}

/** The portrait's ink alone, on transparent: composited over the blank fruit it gives back the portrait. */
function extractInk(P, B) {
  const ink = new ImageData(REGION.w, REGION.h)
  const mass = new Float32Array(Math.ceil(REGION.w / TILE) * Math.ceil(REGION.h / TILE))
  const cols = Math.ceil(REGION.w / TILE)
  const p = P.data
  const b = B.data
  const o = ink.data
  for (let y = 0; y < REGION.h; y++) {
    for (let x = 0; x < REGION.w; x++) {
      const i = (y * REGION.w + x) * 4
      if (b[i + 3] < 250) continue
      const bl = lum(b, i)
      if (bl < 200) continue // only inside the white flesh
      const a = clamp01((bl - lum(p, i)) / 140)
      if (a < 0.04) continue
      // solve  portrait = a·ink + (1 − a)·blank  for the ink colour
      for (let k = 0; k < 3; k++) o[i + k] = Math.min(255, Math.max(0, (p[i + k] - (1 - a) * b[i + k]) / a))
      o[i + 3] = a * 255
      mass[((y / TILE) | 0) * cols + ((x / TILE) | 0)] += a
    }
  }
  return { ink, mass, cols }
}

/** Every spot of the blank fruit's white flesh that sits at least RIM px inside the pink rim. */
function fleshSpots(B) {
  const d = B.data
  const white = (x, y) => {
    if (x < 0 || y < 0 || x >= REGION.w || y >= REGION.h) return false
    const i = (y * REGION.w + x) * 4
    return d[i + 3] > 250 && lum(d, i) > 225
  }
  const spots = []
  for (let y = 0; y < REGION.h; y += 3) {
    for (let x = 0; x < REGION.w; x += 3) {
      if (white(x, y) && white(x - RIM, y) && white(x + RIM, y) && white(x, y - RIM) && white(x, y + RIM)) {
        spots.push(x, y)
      }
    }
  }
  return spots
}

function makeSeeds(mass, cols, spots) {
  const seeds = []
  const nSpots = spots.length / 2
  mass.forEach((m, j) => {
    if (m < 0.5) return
    const sx = (j % cols) * TILE
    const sy = ((j / cols) | 0) * TILE
    // start: anywhere on the flesh, right out to the rim
    const k = ((Math.random() * nSpots) | 0) * 2
    const x0 = spots[k] + (Math.random() - 0.5) * 3
    const y0 = spots[k + 1] + (Math.random() - 0.5) * 3
    const x1 = sx + TILE / 2
    const y1 = sy + TILE / 2
    // bend every path the same way round the centre, so the seeds swirl in
    const mx = (x0 + x1) / 2
    const my = (y0 + y1) / 2
    const dx = x1 - x0
    const dy = y1 - y0
    const bend = 0.35 + Math.random() * 0.25
    seeds.push({
      sx,
      sy,
      x0,
      y0,
      x1,
      y1,
      cx: mx - dy * bend,
      cy: my + dx * bend,
      // top of the head gathers first, falling down the braids
      delay: (sy / REGION.h) * SPREAD * 0.6 + Math.random() * SPREAD * 0.4,
      rot: Math.random() * Math.PI,
      phase: Math.random() * Math.PI * 2,
      dark: clamp01(m / (TILE * TILE * 0.35)),
    })
  })
  return seeds
}

onMounted(async () => {
  const el = canvas.value
  let P, B
  try {
    ;[P, B] = await Promise.all([loadPixels(props.portrait), loadPixels(props.blank)])
  } catch {
    emit('done') // couldn't read the drawings: just show the finished logo
    return
  }
  if (stopped || !el) return

  const { ink, mass, cols } = extractInk(P, B)
  const inkCanvas = document.createElement('canvas')
  inkCanvas.width = REGION.w
  inkCanvas.height = REGION.h
  inkCanvas.getContext('2d').putImageData(ink, 0, 0)
  const seeds = makeSeeds(mass, cols, fleshSpots(B))

  const k = Math.min(1, props.scale * (window.devicePixelRatio || 1))
  el.width = Math.round(REGION.w * k)
  el.height = Math.round(REGION.h * k)
  const ctx = el.getContext('2d')
  ctx.scale(k, k)

  const start = performance.now()
  const end = GATHER_AT + SPREAD + FLIGHT

  function draw(now) {
    frame = 0
    const time = now - start
    ctx.clearRect(0, 0, REGION.w, REGION.h)
    for (const s of seeds) {
      const t = clamp01((time - GATHER_AT - s.delay) / FLIGHT)
      const e = easeInOut(t)
      const u = 1 - e
      // quadratic bezier start → bend → target
      let x = u * u * s.x0 + 2 * u * e * s.cx + e * e * s.x1
      let y = u * u * s.y0 + 2 * u * e * s.cy + e * e * s.y1
      // resting seeds drift a little before they're called
      const idle = 1 - smooth(0, 0.15, t)
      x += Math.sin(time * 0.0018 + s.phase) * 2 * idle
      y += Math.cos(time * 0.0015 + s.phase) * 2 * idle

      const asSeed = 1 - smooth(0.7, 1, t)
      if (asSeed > 0) {
        ctx.globalAlpha = asSeed * (0.35 + 0.65 * s.dark)
        ctx.fillStyle = SEED_INK
        ctx.beginPath()
        ctx.ellipse(x, y, 3.2, 4.6, s.rot * (1 - e), 0, Math.PI * 2)
        ctx.fill()
      }
      const asInk = smooth(0.6, 1, t)
      if (asInk > 0) {
        ctx.globalAlpha = asInk
        ctx.drawImage(inkCanvas, s.sx, s.sy, TILE, TILE, x - TILE / 2, y - TILE / 2, TILE, TILE)
      }
    }
    ctx.globalAlpha = 1
    if (time >= end) emit('done')
    else if (!stopped) frame = requestAnimationFrame(draw)
  }
  frame = requestAnimationFrame(draw)
})

onBeforeUnmount(() => {
  stopped = true
  cancelAnimationFrame(frame)
})
</script>

<template>
  <canvas ref="canvas" class="seed-portrait" :style="style" aria-hidden="true"></canvas>
</template>

<style scoped>
.seed-portrait {
  position: absolute;
  pointer-events: none;
}
</style>
