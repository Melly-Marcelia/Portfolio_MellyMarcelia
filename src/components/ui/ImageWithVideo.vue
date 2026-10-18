<script setup>
/**
 * ImageWithVideo — a still image with a looping muted video laid over one
 * sub-rectangle of it (given in % of the image). Used to make a single screen
 * inside a device-mockup image come alive without re-compositing the asset.
 */
import CaseVideo from '@/components/ui/CaseVideo.vue'

const props = defineProps({
  src: { type: String, required: true },
  video: { type: String, required: true },
  poster: { type: String, default: '' },
  alt: { type: String, default: '' },
  rect: {
    type: Object,
    default: () => ({ x: 0, y: 0, w: 100, h: 100 }),
  },
  radius: { type: String, default: '0px' },
})

const overlayStyle = {
  left: `${props.rect.x}%`,
  top: `${props.rect.y}%`,
  width: `${props.rect.w}%`,
  height: `${props.rect.h}%`,
  borderRadius: props.radius,
}
</script>

<template>
  <div class="iwv">
    <img :src="src" :alt="alt" loading="lazy" />
    <div class="iwv__screen" :style="overlayStyle">
      <CaseVideo :src="video" :poster="poster" :alt="alt" />
    </div>
  </div>
</template>

<style scoped>
.iwv {
  position: relative;
  width: 100%;
}

.iwv img {
  display: block;
  width: 100%;
  height: auto;
}

.iwv__screen {
  position: absolute;
  overflow: hidden;
}

.iwv__screen :deep(.cv),
.iwv__screen :deep(video) {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.iwv__screen :deep(.cv__btn) {
  width: clamp(2rem, 4vw, 2.75rem);
  height: clamp(2rem, 4vw, 2.75rem);
}
</style>
