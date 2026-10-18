<script setup>
import { ref, computed, watch, nextTick, onBeforeUnmount } from 'vue'

/*
 * Full-screen image viewer that keeps you on the page.
 *
 *   <ImageLightbox v-model="index" :items="[{ src, alt, title? }]" />
 *
 * index is the open item, or null when closed. The image opens fitted to the
 * screen; click it (or press Z / +) to zoom in, then drag, scroll or swipe to
 * look around, and click again to fit. Esc / click outside closes,
 * ← → flips through.
 */
const props = defineProps({
  items: { type: Array, required: true },
})
const index = defineModel({ type: Number, default: null })

const current = computed(() => (index.value === null ? null : props.items[index.value]))
const zoomed = ref(false)
const stage = ref(null)

function close() {
  index.value = null
}

function step(dir) {
  const n = props.items.length
  index.value = (index.value + dir + n) % n
}

// remember the click point as a share of the image, so zooming lands on it
async function toggleZoom(e) {
  if (drag.moved) return
  const img = e?.currentTarget
  const rect = img?.getBoundingClientRect()
  const fx = rect && e.clientX ? (e.clientX - rect.left) / rect.width : 0.5
  const fy = rect && e.clientY ? (e.clientY - rect.top) / rect.height : 0.5
  zoomed.value = !zoomed.value
  if (!zoomed.value) return
  await nextTick()
  const el = stage.value
  const big = el?.querySelector('img')
  if (!el || !big) return
  el.scrollLeft = big.offsetLeft + fx * big.offsetWidth - el.clientWidth / 2
  el.scrollTop = big.offsetTop + fy * big.offsetHeight - el.clientHeight / 2
}

// drag to pan while zoomed (mouse; touch already scrolls natively)
const drag = { on: false, moved: false, x: 0, y: 0 }
function onDown(e) {
  if (!zoomed.value || e.pointerType !== 'mouse') return
  Object.assign(drag, { on: true, moved: false, x: e.clientX, y: e.clientY })
}
function onMove(e) {
  if (!drag.on) return
  const dx = e.clientX - drag.x
  const dy = e.clientY - drag.y
  if (Math.abs(dx) + Math.abs(dy) > 3) drag.moved = true
  stage.value.scrollLeft -= dx
  stage.value.scrollTop -= dy
  drag.x = e.clientX
  drag.y = e.clientY
}
function onUp() {
  drag.on = false
  // let the click that ends a drag through before clearing the flag
  setTimeout(() => (drag.moved = false))
}

function onKey(e) {
  if (e.key === 'Escape') zoomed.value ? (zoomed.value = false) : close()
  else if (e.key === 'ArrowRight' && !zoomed.value) step(1)
  else if (e.key === 'ArrowLeft' && !zoomed.value) step(-1)
  else if (e.key === 'z' || e.key === '+' || e.key === '=') toggleZoom()
}

watch(index, (v, old) => {
  zoomed.value = false
  if (v !== null && old === null) {
    window.addEventListener('keydown', onKey)
    document.documentElement.style.overflow = 'hidden'
  }
  if (v === null) {
    window.removeEventListener('keydown', onKey)
    document.documentElement.style.overflow = ''
  }
})
onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKey)
  document.documentElement.style.overflow = ''
})
</script>

<template>
  <Teleport to="body">
    <Transition name="ilb">
      <div
        v-if="current"
        class="ilb"
        :class="{ 'is-zoomed': zoomed }"
        role="dialog"
        aria-modal="true"
        :aria-label="current.title || current.alt"
      >
        <div
          ref="stage"
          class="ilb__stage"
          @click.self="close"
          @pointerdown="onDown"
          @pointermove="onMove"
          @pointerup="onUp"
          @pointerleave="onUp"
        >
          <img
            :key="current.src"
            :src="current.src"
            :alt="current.alt"
            draggable="false"
            @click="toggleZoom"
          />
        </div>

        <p v-if="current.title" class="ilb__title">
          {{ current.title }}
          <span v-if="items.length > 1">{{ index + 1 }} / {{ items.length }}</span>
        </p>

        <button type="button" class="ilb__btn ilb__close" aria-label="Close" @click="close">
          <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>
        </button>
        <button
          type="button"
          class="ilb__btn ilb__zoom"
          :aria-label="zoomed ? 'Fit to screen' : 'Zoom in'"
          :aria-pressed="zoomed"
          @click="toggleZoom()"
        >
          <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
            <circle cx="11" cy="11" r="6.5" />
            <path d="M20 20l-4.4-4.4M8 11h6" />
            <path v-if="!zoomed" d="M11 8v6" />
          </svg>
        </button>
        <template v-if="items.length > 1 && !zoomed">
          <button type="button" class="ilb__btn ilb__prev" aria-label="Previous image" @click="step(-1)">
            <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="M15 5l-7 7 7 7" /></svg>
          </button>
          <button type="button" class="ilb__btn ilb__next" aria-label="Next image" @click="step(1)">
            <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="M9 5l7 7-7 7" /></svg>
          </button>
        </template>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.ilb {
  position: fixed;
  inset: 0;
  z-index: 1000;
  background: rgb(20 14 10 / 0.82);
  backdrop-filter: blur(6px);
}

.ilb__stage {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  padding: 72px 88px;
  overflow: hidden;
  cursor: zoom-out;
}

.ilb__stage img {
  display: block;
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  box-shadow: 0 30px 80px -20px rgb(0 0 0 / 0.55);
  cursor: zoom-in;
  user-select: none;
  animation: ilb-in 0.35s var(--ease-soft, ease) both;
}

@keyframes ilb-in {
  from {
    opacity: 0;
    transform: scale(0.94);
  }
}

/* zoomed: the image grows past the screen and the stage scrolls */
.is-zoomed .ilb__stage {
  display: block;
  padding: 0;
  overflow: auto;
  overscroll-behavior: contain;
  cursor: grab;
}

.is-zoomed .ilb__stage:active {
  cursor: grabbing;
}

.is-zoomed .ilb__stage img {
  width: max(250vw, 1600px);
  max-width: none;
  max-height: none;
  margin: 0 auto;
  box-shadow: none;
  cursor: inherit;
  animation: none;
}

.ilb__title {
  position: absolute;
  left: 50%;
  bottom: 22px;
  translate: -50% 0;
  display: flex;
  gap: 0.75em;
  margin: 0;
  padding: 0.45em 1em;
  border-radius: 999px;
  background: rgb(0 0 0 / 0.4);
  color: #fff;
  font-size: 0.85rem;
  white-space: nowrap;
  pointer-events: none;
}

.ilb__title span {
  opacity: 0.6;
}

.ilb__btn {
  position: absolute;
  display: grid;
  place-items: center;
  width: 48px;
  height: 48px;
  border: 0;
  border-radius: 50%;
  background: rgb(255 255 255 / 0.14);
  color: #fff;
  cursor: pointer;
  transition: background 0.2s;
}

.ilb__btn svg {
  fill: none;
  stroke: currentColor;
  stroke-width: 2.2;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.ilb__btn:hover {
  background: rgb(255 255 255 / 0.26);
}

.ilb__btn:focus-visible {
  outline: 2px solid #fff;
  outline-offset: 3px;
}

.ilb__close { top: 16px; right: 16px; }
.ilb__zoom { top: 16px; right: 76px; }
.ilb__prev { left: 20px; top: 50%; translate: 0 -50%; }
.ilb__next { right: 20px; top: 50%; translate: 0 -50%; }

@media (max-width: 640px) {
  .ilb__stage { padding: 72px 16px 96px; }
  .ilb__prev, .ilb__next { top: auto; bottom: 20px; translate: none; }
  .ilb__prev { left: 16px; }
  .ilb__next { right: 16px; }
  .ilb__title { bottom: 80px; }
}

.ilb-enter-active,
.ilb-leave-active {
  transition: opacity 0.3s ease;
}

.ilb-enter-from,
.ilb-leave-to {
  opacity: 0;
}

@media (prefers-reduced-motion: reduce) {
  .ilb__stage img {
    animation: none;
  }
}
</style>
