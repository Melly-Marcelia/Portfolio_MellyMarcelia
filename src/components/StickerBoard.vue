<script setup>
/**
 * StickerBoard — a table-top of skill stickers the visitor can push around.
 *
 *   <StickerBoard :items="stickers" />
 *
 * Drag with mouse / touch / pen (pointer events); the grabbed sticker lifts and
 * jumps to the top of the pile. Keyboard: Tab to a sticker, arrow keys nudge it
 * (Shift = bigger steps). "Tidy up" sends everything back to where it started.
 * Positions are % of the board, so the layout survives resizes.
 *
 * The table is an organic, kidney-shaped top (SVG) on cylinder legs; stickers
 * are kept on the top by hit-testing its path, and slide along the rim when
 * pushed against it.
 */
import { reactive, ref } from 'vue'

const props = defineProps({
  items: { type: Array, required: true },
})

// tabletop outline, in a 1000 × 520 box (the board's own coordinates)
const TOP_W = 1000
const TOP_H = 520
const TOP_PATH =
  'M40 250C30 120 160 60 300 70C420 80 480 150 600 120C720 90 800 40 900 90' +
  'C990 140 990 330 930 410C870 490 700 500 520 470C360 440 250 470 150 430C70 400 45 330 40 250Z'

const board = ref(null)
const topPath = ref(null)
let topZ = props.items.length

const state = reactive(
  props.items.map((s, i) => ({ x: s.x, y: s.y, rot: s.rot ?? 0, z: i + 1, dragging: false }))
)
const moved = ref(false)

let drag = null

function onDown(e, i) {
  if (e.button !== undefined && e.button !== 0) return
  const rect = board.value.getBoundingClientRect()
  const s = state[i]
  drag = {
    i,
    rect,
    // grab offset, so the sticker doesn't snap its centre to the pointer
    dx: e.clientX - (rect.left + (s.x / 100) * rect.width),
    dy: e.clientY - (rect.top + (s.y / 100) * rect.height),
  }
  s.z = ++topZ
  s.dragging = true
  e.currentTarget.setPointerCapture(e.pointerId)
  e.preventDefault()
}

function onMove(e) {
  if (!drag) return
  const { rect, dx, dy, i } = drag
  place(state[i], ((e.clientX - dx - rect.left) / rect.width) * 100, ((e.clientY - dy - rect.top) / rect.height) * 100)
  moved.value = true
}

function onTop(x, y) {
  const path = topPath.value
  if (!path?.isPointInFill) return x > 4 && x < 96 && y > 4 && y < 96
  return path.isPointInFill(new DOMPoint((x / 100) * TOP_W, (y / 100) * TOP_H))
}

// move to (x, y) if that's still on the table; otherwise slide along the rim
function place(s, x, y) {
  if (onTop(x, y)) Object.assign(s, { x, y })
  else if (onTop(x, s.y)) s.x = x
  else if (onTop(s.x, y)) s.y = y
}

function onUp() {
  if (!drag) return
  state[drag.i].dragging = false
  drag = null
}

function onKey(e, i) {
  const step = e.shiftKey ? 8 : 2
  const d = { ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, -step], ArrowDown: [0, step] }[e.key]
  if (!d) return
  e.preventDefault()
  const s = state[i]
  place(s, s.x + d[0], s.y + d[1])
  s.z = ++topZ
  moved.value = true
}

function tidy() {
  props.items.forEach((item, i) => {
    Object.assign(state[i], { x: item.x, y: item.y, rot: item.rot ?? 0, z: i + 1 })
  })
  topZ = props.items.length
  moved.value = false
}
</script>

<template>
  <div class="stickers">
    <div class="stickers__table">
      <svg class="stickers__furniture" viewBox="0 0 1000 680" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <filter id="table-shadow" x="-20%" y="-50%" width="140%" height="200%">
            <feGaussianBlur stdDeviation="18" />
          </filter>
          <linearGradient id="table-leg" x1="0" x2="1">
            <stop offset="0" style="stop-color: var(--table-leg-dark)" />
            <stop offset="0.35" style="stop-color: var(--table-leg)" />
            <stop offset="1" style="stop-color: var(--table-leg-dark)" />
          </linearGradient>
          <linearGradient id="table-edge" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0.55" style="stop-color: var(--table-edge)" />
            <stop offset="1" style="stop-color: var(--table-edge-dark)" />
          </linearGradient>
          <radialGradient id="table-top" cx="0.42" cy="0.35" r="0.75">
            <stop offset="0" style="stop-color: var(--table-top-light)" />
            <stop offset="1" style="stop-color: var(--table-top)" />
          </radialGradient>
        </defs>

        <!-- soft pool of shadow on the floor -->
        <ellipse cx="520" cy="640" rx="430" ry="26" fill="rgba(80, 60, 40, 0.28)" filter="url(#table-shadow)" />

        <!-- cylinder legs: one at the back, two at the front -->
        <rect x="700" y="400" width="80" height="220" rx="40" ry="14" fill="url(#table-leg)" opacity="0.85" />
        <rect x="200" y="400" width="110" height="235" rx="55" ry="16" fill="url(#table-leg)" />
        <rect x="580" y="420" width="120" height="245" rx="60" ry="18" fill="url(#table-leg)" />

        <!-- thick rounded edge, then the top -->
        <path :d="TOP_PATH" transform="translate(0 34)" fill="url(#table-edge)" />
        <path ref="topPath" :d="TOP_PATH" fill="url(#table-top)" />
        <path :d="TOP_PATH" fill="none" stroke="rgba(255, 255, 255, 0.7)" stroke-width="3" transform="translate(0 2) scale(0.998)" />
      </svg>

      <div ref="board" class="stickers__board">
        <button
          v-for="(item, i) in items"
          :key="item.label"
          type="button"
          class="sticker"
          :class="[
            item.image ? 'sticker--image' : `sticker--${item.shape || 'pill'} sticker--${item.tone || 'skin'}`,
            { 'is-dragging': state[i].dragging },
          ]"
          :style="{
            left: `${state[i].x}%`,
            top: `${state[i].y}%`,
            zIndex: state[i].z,
            '--rot': `${state[i].rot}deg`,
            '--s': item.scale ?? null,
          }"
          :aria-label="`${item.label} sticker: drag, or use arrow keys to move`"
          @pointerdown="onDown($event, i)"
          @pointermove="onMove"
          @pointerup="onUp"
          @pointercancel="onUp"
          @keydown="onKey($event, i)"
        >
          <template v-if="item.image">
            <img :src="item.image" alt="" draggable="false" />
            <span class="sticker__tag">{{ item.label }}</span>
          </template>
          <span v-else class="sticker__label">{{ item.label }}</span>
        </button>
      </div>
    </div>

    <div class="stickers__foot">
      <button type="button" class="stickers__tidy" :disabled="!moved" @click="tidy">
        Tidy up
      </button>
    </div>
  </div>
</template>

<style scoped>
/* ---- the table: kidney-shaped top on cylinder legs ------------------
   The SVG box is 1000 × 680; the top fills the first 520 units, so the
   sticker board overlays exactly that band (520 / 680 = 76.47%). */
.stickers__table {
  position: relative;
  /* also capped by screen height, so the whole table fits under the navbar */
  height: clamp(27.5rem, min(58vw, 100svh - var(--nav-h) - 4rem), 40rem);
}

.stickers__furniture {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  overflow: visible;
}

.stickers__board {
  position: absolute;
  inset: 0 0 auto;
  height: 76.47%;
  touch-action: pan-y;
}

/* ---- sticker ---------------------------------------------------------- */
.sticker {
  position: absolute;
  translate: -50% -50%;
  rotate: var(--rot);
  padding: 0;
  border: 0;
  background: none;
  font: inherit;
  cursor: grab;
  touch-action: none;
  user-select: none;
  -webkit-user-select: none;
  filter: drop-shadow(0 2px 2px rgba(60, 35, 15, 0.3));
  transition:
    left 0.6s var(--ease-soft),
    top 0.6s var(--ease-soft),
    rotate 0.3s var(--ease-soft),
    scale 0.2s var(--ease-soft),
    filter 0.2s var(--ease);
}

.sticker:hover {
  scale: 1.04;
}

.sticker.is-dragging {
  cursor: grabbing;
  scale: 1.1;
  rotate: calc(var(--rot) * 0.4);
  filter: drop-shadow(0 1rem 1.125rem rgba(60, 35, 15, 0.38));
  /* follow the pointer 1:1 while held */
  transition:
    rotate 0.3s var(--ease-soft),
    scale 0.2s var(--ease-soft),
    filter 0.2s var(--ease);
}

.sticker:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 6px;
}

.sticker--image {
  display: grid;
  justify-items: center;
  gap: 0.2rem;
}

/* sized off the viewport so a full table of stickers fits on phones too */
.sticker--image img {
  display: block;
  width: calc(clamp(3.5rem, 9.5vw, 7.75rem) * var(--s, 1));
  height: auto;
  pointer-events: none;
}

/* hand-lettered skill name under each sticker, pencilled onto the table */
.sticker__tag {
  font-family: var(--font-hand);
  font-size-adjust: var(--hand-size-adjust);
  -webkit-text-stroke: var(--hand-stroke) currentColor;
  font-size: clamp(0.6rem, 0.45rem + 0.45vw, 0.85rem);
  line-height: 1.2;
  white-space: nowrap;
  color: var(--table-ink);
}

/* ---- CSS placeholder stickers (until images arrive) ---------------------- */
.sticker__label {
  display: grid;
  place-items: center;
  font-weight: 700;
  font-size: clamp(0.85rem, 0.7rem + 0.5vw, 1.1rem);
  line-height: 1.1;
  text-align: center;
  white-space: nowrap;
  color: var(--st-ink);
  background: var(--st-bg);
  /* white die-cut border */
  box-shadow: 0 0 0 5px var(--df-flesh-0);
}

.sticker--skin { --st-bg: var(--df-skin-500); --st-ink: var(--df-flesh-0); }
.sticker--leaf { --st-bg: var(--df-bract-300); --st-ink: var(--df-bract-900); }
.sticker--blush { --st-bg: var(--df-skin-100); --st-ink: var(--df-skin-800); }
.sticker--ink { --st-bg: var(--df-seed); --st-ink: var(--df-skin-200); }
.sticker--paper { --st-bg: var(--df-flesh-100); --st-ink: var(--df-seed); }

.sticker--pill .sticker__label {
  padding: 0.7em 1.3em;
  border-radius: var(--radius-pill);
}

.sticker--circle .sticker__label {
  width: 7.5em;
  aspect-ratio: 1;
  border-radius: 50%;
  white-space: normal;
  padding: 0.8em;
}

.sticker--tag .sticker__label {
  padding: 0.75em 1.2em 0.75em 1.8em;
  border-radius: var(--radius-s);
  font-family: var(--font-hand);
  font-size-adjust: var(--hand-size-adjust);
  -webkit-text-stroke: var(--hand-stroke) currentColor;
  font-weight: 400;
  font-size: clamp(0.8rem, 0.65rem + 0.45vw, 1rem);
  background:
    radial-gradient(circle at 0.8em 50%, var(--table-top) 0.22em, transparent 0.24em),
    var(--st-bg);
}

.sticker--star .sticker__label {
  width: 8em;
  aspect-ratio: 1;
  padding: 1.2em;
  white-space: normal;
  box-shadow: none;
  clip-path: polygon(50% 0, 61% 18%, 82% 10%, 80% 32%, 100% 42%, 84% 58%, 94% 80%, 70% 80%, 58% 100%, 42% 84%, 22% 96%, 20% 72%, 0 62%, 14% 46%, 4% 24%, 26% 22%, 36% 2%);
}

/* ---- footer --------------------------------------------------------- */
.stickers__foot {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 0.9rem;
}

.stickers__tidy {
  font: inherit;
  font-size: var(--step--1);
  font-weight: 600;
  padding: 0.45em 1.1em;
  border-radius: var(--radius-pill);
  border: var(--border-card);
  background: var(--color-surface);
  color: var(--color-ink);
  cursor: pointer;
  transition: background var(--transition), opacity var(--transition);
}

.stickers__tidy:hover:not(:disabled) {
  background: var(--color-accent-soft);
}

.stickers__tidy:disabled {
  opacity: 0.4;
  cursor: default;
}

@media (prefers-reduced-motion: reduce) {
  .sticker,
  .sticker.is-dragging {
    transition: none;
  }
}
</style>
