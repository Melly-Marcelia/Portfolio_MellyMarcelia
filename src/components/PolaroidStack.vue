<script setup>
import { ref, computed, watch, onBeforeUnmount } from 'vue'

/*
 * Four polaroids: a messy pile at rest that deals out into a 2×2 grid
 * on hover (mouse) or tap (touch). Once dealt out, clicking a polaroid
 * zooms it into a lightbox (Esc / click outside to close, ← → to flip
 * through). Drop photos into public/assets/about/ — a missing file just
 * shows the placeholder.
 *
 * Positions are in % of the card's own size (translate %), so the
 * whole thing scales with its container.
 *   stack: [x, y, rotate]  grid: [x, y, rotate]
 */
const photos = [
  { src: '/assets/about/polaroid-1.jpg', alt: 'Melly sitting on a stone bench in an art gallery, framed paintings behind her', stack: [60, 57, -2], grid: [5, 8, -3] },
  { src: '/assets/about/polaroid-2.jpg', alt: 'Melly crossing stepping stones in a temple garden', stack: [60, 57, 5], grid: [115, 4, 1.5] },
  { src: '/assets/about/polaroid-3.jpg', alt: 'Melly in a camel coat outside a brick corner café', stack: [60, 57, -7], grid: [10, 108, -1] },
  { src: '/assets/about/polaroid-4.jpg', alt: 'Melly taking a mirror selfie in a beige blazer, a window onto the river behind her', stack: [60, 57, 9], grid: [120, 104, 2] },
]

const open = ref(false)
const failed = ref(new Set())
const zoomed = ref(null) // index of the polaroid in the lightbox, or null
const current = computed(() => (zoomed.value === null ? null : photos[zoomed.value]))

// on a mouse the pile is already dealt out on hover, so one click zooms;
// on touch the first tap deals out the pile and the next tap zooms
const hoverDevice = window.matchMedia('(hover: hover) and (pointer: fine)').matches

function onCard(i) {
  if (open.value || hoverDevice) zoomed.value = i
  else open.value = true
}

function step(dir) {
  zoomed.value = (zoomed.value + dir + photos.length) % photos.length
}

function onKey(e) {
  if (e.key === 'Escape') zoomed.value = null
  else if (e.key === 'ArrowRight') step(1)
  else if (e.key === 'ArrowLeft') step(-1)
}

watch(zoomed, (v, old) => {
  if (v !== null && old === null) window.addEventListener('keydown', onKey)
  if (v === null) window.removeEventListener('keydown', onKey)
})
onBeforeUnmount(() => window.removeEventListener('keydown', onKey))
</script>

<template>
  <div
    class="polaroids"
    :class="{ 'is-open': open }"
    role="group"
    aria-label="Photo pile: polaroids of Melly"
    @click.self="open = !open"
  >
    <button
      v-for="(p, i) in photos"
      :key="p.src"
      type="button"
      class="polaroid"
      :aria-label="`Enlarge photo: ${p.alt}`"
      :style="{
        '--i': i,
        '--z': photos.length - i,
        '--sx': p.stack[0] + '%', '--sy': p.stack[1] + '%', '--sr': p.stack[2] + 'deg',
        '--gx': p.grid[0] + '%', '--gy': p.grid[1] + '%', '--gr': p.grid[2] + 'deg',
      }"
      @click="onCard(i)"
    >
      <span class="polaroid__photo">
        <img
          v-if="!failed.has(i)"
          :src="p.src"
          :alt="p.alt"
          loading="lazy"
          draggable="false"
          @error="failed.add(i)"
        />
      </span>
    </button>
  </div>

  <Teleport to="body">
    <Transition name="lightbox">
      <div
        v-if="current"
        class="lightbox"
        role="dialog"
        aria-modal="true"
        :aria-label="current.alt"
        @click.self="zoomed = null"
      >
        <figure :key="zoomed" class="lightbox__card" :style="{ '--r': current.grid[2] * 0.5 + 'deg' }">
          <span class="polaroid__photo">
            <img v-if="!failed.has(zoomed)" :src="current.src" :alt="current.alt" draggable="false" />
          </span>
        </figure>
        <button type="button" class="lightbox__btn lightbox__close" aria-label="Close" @click="zoomed = null">
          <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>
        </button>
        <button type="button" class="lightbox__btn lightbox__prev" aria-label="Previous photo" @click="step(-1)">
          <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="M15 5l-7 7 7 7" /></svg>
        </button>
        <button type="button" class="lightbox__btn lightbox__next" aria-label="Next photo" @click="step(1)">
          <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="M9 5l7 7-7 7" /></svg>
        </button>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.polaroids {
  position: relative;
  display: block;
  width: 100%;
  max-width: 340px;
  aspect-ratio: 440 / 540;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
}

.polaroid {
  position: absolute;
  top: 0;
  left: 0;
  width: 45.45%;
  padding: 4% 4% 12%;
  border: 0;
  background: var(--color-surface);
  border-radius: 6px;
  box-shadow:
    0 1px 2px rgb(0 0 0 / 0.08),
    0 12px 28px -10px rgb(0 0 0 / 0.22);
  z-index: var(--z);
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  transform: translate(var(--sx), var(--sy)) rotate(var(--sr)) scale(1.55);
  transition: transform 0.7s var(--ease-soft);
  transition-delay: calc((3 - var(--i)) * 40ms);
}

.polaroid:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 4px;
}

.polaroid__photo {
  display: block;
  aspect-ratio: 5 / 6;
  overflow: hidden;
  background: var(--color-placeholder);
}

.polaroid__photo img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  user-select: none;
}

/* deal out: hover on mouse devices, tap everywhere, and keyboard focus */
.polaroids.is-open .polaroid,
.polaroids:focus-within .polaroid {
  transform: translate(var(--gx), var(--gy)) rotate(var(--gr)) scale(1);
  transition-delay: calc(var(--i) * 60ms);
}

@media (hover: hover) and (pointer: fine) {
  .polaroids:hover .polaroid {
    transform: translate(var(--gx), var(--gy)) rotate(var(--gr)) scale(1);
    transition-delay: calc(var(--i) * 60ms);
  }

  /* once dealt out, the hovered polaroid lifts a little to say "click me" */
  .polaroids:hover .polaroid:hover {
    transform: translate(var(--gx), var(--gy)) rotate(0deg) scale(1.06);
    transition-delay: 0ms;
    z-index: 10;
  }
}

/* lightbox */
.lightbox {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: grid;
  place-items: center;
  padding: 24px;
  background: rgb(20 14 10 / 0.72);
  backdrop-filter: blur(6px);
  cursor: zoom-out;
}

.lightbox__card {
  /* % padding would resolve against the viewport here, so size it off the card width */
  --w: min(82vw, calc(78vh * 0.72), 520px);
  margin: 0;
  width: var(--w);
  padding: calc(var(--w) * 0.05) calc(var(--w) * 0.05) calc(var(--w) * 0.17);
  background: var(--color-surface);
  border-radius: 8px;
  box-shadow: 0 30px 80px -20px rgb(0 0 0 / 0.55);
  transform: rotate(var(--r));
  cursor: default;
  animation: card-in 0.45s var(--ease-soft) both;
}

@keyframes card-in {
  from {
    opacity: 0;
    transform: rotate(calc(var(--r) * 4)) scale(0.82) translateY(24px);
  }
}

.lightbox__btn {
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

.lightbox__btn svg {
  fill: none;
  stroke: currentColor;
  stroke-width: 2.2;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.lightbox__btn:hover {
  background: rgb(255 255 255 / 0.26);
}

.lightbox__btn:focus-visible {
  outline: 2px solid #fff;
  outline-offset: 3px;
}

.lightbox__close { top: 20px; right: 20px; }
.lightbox__prev { left: 20px; top: 50%; translate: 0 -50%; }
.lightbox__next { right: 20px; top: 50%; translate: 0 -50%; }

@media (max-width: 640px) {
  .lightbox__prev, .lightbox__next { top: auto; bottom: 24px; translate: none; }
  .lightbox__prev { left: calc(50% - 60px); }
  .lightbox__next { right: calc(50% - 60px); }
}

.lightbox-enter-active,
.lightbox-leave-active {
  transition: opacity 0.3s ease;
}

.lightbox-enter-from,
.lightbox-leave-to {
  opacity: 0;
}

@media (prefers-reduced-motion: reduce) {
  .polaroid {
    transition-duration: 0.01ms;
    transition-delay: 0ms !important;
  }

  .lightbox__card {
    animation: none;
  }
}
</style>
