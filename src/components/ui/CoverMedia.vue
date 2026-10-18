<script setup>
/**
 * CoverMedia — renders a project cover.
 *
 *  • plain image            → <img>
 *  • src ends .mp4/.webm    → muted <video>: autoplays + loops while it's in
 *                             view, pauses when it scrolls away, honours
 *                             prefers-reduced-motion (shows the poster instead)
 *  • zoom = true            → <img> with a slow seamless ken-burns zoom
 *
 * Falls back to the poster still on media error.
 */
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

const props = defineProps({
  src: { type: String, required: true },
  poster: { type: String, default: '' },
  alt: { type: String, default: '' },
  eager: { type: Boolean, default: false },
  loop: { type: Boolean, default: true },
  zoom: { type: Boolean, default: false },
})

const isVideo = computed(() => /\.(mp4|webm)$/i.test(props.src))
const failed = ref(false)
const root = ref(null)
const videoEl = ref(null)
const inView = ref(false)

const reduceMotion =
  typeof window !== 'undefined' &&
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

const showVideo = computed(() => isVideo.value && !failed.value && !reduceMotion)

/** Try to start playback — safe to call repeatedly. */
function play() {
  const v = videoEl.value
  if (!v || !inView.value) return
  v.muted = true // some browsers only honour muted-autoplay if set as a property
  const p = v.play()
  if (p && typeof p.catch === 'function') p.catch(() => {})
}

/** Safari can ignore `loop` on WebM and just stop at the end, so restart by hand. */
function onEnded() {
  const v = videoEl.value
  if (!v || !props.loop) return
  v.currentTime = 0
  play()
}

let observer
onMounted(() => {
  const v = videoEl.value
  if (v) {
    v.muted = true
    v.defaultMuted = true
  }
  const el = v || root.value
  if (!el) return
  observer = new IntersectionObserver(
    ([entry]) => {
      inView.value = entry.isIntersecting
      const vid = videoEl.value
      if (!vid) return
      if (entry.isIntersecting) play()
      else vid.pause()
    },
    // generous margin so buffering starts well before the video is on screen
    { threshold: 0.01, rootMargin: '300px 0px' },
  )
  observer.observe(el)
})
onBeforeUnmount(() => observer?.disconnect())
</script>

<template>
  <video
    v-if="showVideo"
    ref="videoEl"
    :src="src"
    :poster="poster || undefined"
    :aria-label="alt"
    :loop="loop"
    muted
    autoplay
    playsinline
    :preload="eager ? 'auto' : 'metadata'"
    @loadeddata="play"
    @canplay="play"
    @ended="onEnded"
    @error="failed = true"
  />

  <span
    v-else-if="zoom && !failed"
    ref="root"
    class="cm-zoom"
    :class="{ 'is-running': inView }"
  >
    <img :src="src" :alt="alt" :loading="eager ? 'eager' : 'lazy'" @error="failed = true" />
  </span>

  <img
    v-else
    :src="isVideo || failed ? poster || src : src"
    :alt="alt"
    :loading="eager ? 'eager' : 'lazy'"
    @error="$emit('error', $event)"
  />
</template>

<style scoped>
/* self-contained: fill the container and crop, whatever the host layout is */
img,
video,
.cm-zoom {
  position: relative;
  z-index: 1;
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.cm-zoom {
  overflow: hidden;
}

.cm-zoom img {
  transform: scale(1);
}

.cm-zoom.is-running img {
  animation: cm-kenburns 7s ease-in-out infinite alternate;
}

@keyframes cm-kenburns {
  from {
    transform: scale(1);
  }
  to {
    transform: scale(1.12);
  }
}
</style>
