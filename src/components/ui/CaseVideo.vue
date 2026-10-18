<script setup>
/**
 * CaseVideo — a showcase video inside a case study.
 *
 * Muted, looping, plays while on screen and pauses when it scrolls away.
 * If the browser blocks autoplay (Low Power Mode, reduced-motion, strict
 * site settings) the poster stays up with a play button — clicking anywhere
 * on the video toggles playback.
 */
import { onBeforeUnmount, onMounted, ref } from 'vue'

defineProps({
  src: { type: String, required: true },
  poster: { type: String, default: '' },
  alt: { type: String, default: '' },
})

/* `time` reports playback position, e.g. for a chapter row under the video */
const emit = defineEmits(['time'])

const el = ref(null)
const playing = ref(false)
const inView = ref(false)

const reduceMotion =
  typeof window !== 'undefined' &&
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

/** Try to start playback — safe to call repeatedly. */
function tryPlay() {
  const v = el.value
  if (!v) return
  v.muted = true
  const p = v.play()
  if (p && typeof p.catch === 'function') p.catch(() => {})
}

/** Autoplay path: only while on screen and motion is allowed. */
function autoPlay() {
  if (inView.value && !reduceMotion) tryPlay()
}

/** Click path: an explicit user gesture — always honour it. */
function toggle() {
  const v = el.value
  if (!v) return
  if (v.paused) tryPlay()
  else v.pause()
}

/** Jump to a moment (seconds) and keep playing from there. */
function seek(t) {
  const v = el.value
  if (!v) return
  v.currentTime = t
  emit('time', t)
  tryPlay()
}

defineExpose({ seek })

let io
onMounted(() => {
  const v = el.value
  if (!v) return
  v.muted = true
  v.addEventListener('playing', () => (playing.value = true))
  v.addEventListener('pause', () => (playing.value = false))
  v.addEventListener('timeupdate', () => emit('time', v.currentTime))
  // Safari can ignore `loop` on WebM and stop at the end, so restart by hand
  v.addEventListener('ended', () => {
    v.currentTime = 0
    tryPlay()
  })
  // a slow buffer can make the first play() a no-op — retry once data lands
  v.addEventListener('loadeddata', autoPlay)
  v.addEventListener('canplay', autoPlay)

  io = new IntersectionObserver(
    ([entry]) => {
      inView.value = entry.isIntersecting
      if (entry.isIntersecting) autoPlay()
      else v.pause()
    },
    { threshold: 0.1, rootMargin: '200px 0px' },
  )
  io.observe(v)
})
onBeforeUnmount(() => io?.disconnect())
</script>

<template>
  <div
    class="cv"
    :class="{ 'is-playing': playing }"
    @click="toggle"
  >
    <video
      ref="el"
      :src="src"
      :poster="poster || undefined"
      :aria-label="alt"
      muted
      loop
      autoplay
      playsinline
      preload="auto"
    />
    <button
      class="cv__btn"
      type="button"
      :aria-label="playing ? 'Pause video' : 'Play video'"
      @click.stop="toggle"
    >
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path v-if="!playing" d="M8 5v14l11-7z" />
        <path v-else d="M6 5h4v14H6zM14 5h4v14h-4z" />
      </svg>
    </button>
  </div>
</template>

<style scoped>
.cv {
  position: relative;
  width: 100%;
  height: 100%;
  cursor: pointer;
}

.cv video {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.cv__btn {
  position: absolute;
  inset: 0;
  margin: auto;
  width: clamp(56px, 8vw, 76px);
  height: clamp(56px, 8vw, 76px);
  display: grid;
  place-items: center;
  border: none;
  border-radius: 50%;
  background: rgba(20, 14, 16, 0.55);
  color: #fff;
  backdrop-filter: blur(4px);
  cursor: pointer;
  transition:
    opacity var(--transition-fast),
    transform var(--transition-fast);
}

.cv__btn svg {
  width: 42%;
  height: 42%;
  fill: currentColor;
}

/* hidden once playing; reappears on hover as a pause affordance */
.cv.is-playing .cv__btn {
  opacity: 0;
  transform: scale(0.9);
  pointer-events: none;
}

.cv.is-playing:hover .cv__btn {
  opacity: 1;
  transform: scale(1);
  pointer-events: auto;
}

@media (hover: none) {
  .cv.is-playing .cv__btn {
    opacity: 0;
  }
}
</style>
