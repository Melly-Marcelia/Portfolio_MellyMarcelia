<script setup>
/**
 * Luxcrime: case study.
 *
 * A 1:1 render of Figma frame 75:602 (exported as one image so it matches the
 * design exactly), with videos playing in place — each overlay sits on the spot
 * where its still frame lives in the document:
 *   · 75:612  green two-model still  → brand film    (video4)
 *   · 75:667  laptop screen          → site scroll   (desktop)
 *   · 68:144  lip-pencil "PAGE 8"    → pencil film   (video1)
 *   · 75:701  first phone             → mobile-site screen recording (mobile)
 *
 * Overlay rects are % of the frame, from its Figma coordinates. The recording
 * already includes the Safari chrome, so it covers the whole first phone (whose
 * footprint in the export is painted black as a clean bed).
 *
 * The designer's note (heading + intro paragraph) used to be baked
 * into the bottom of the export. It's been cropped out of luxcrime-full.jpg
 * — cropping the image shifted every overlay's % slightly, so those were
 * rescaled too (old-height/new-height = 16026/15544). The page now uses the
 * standard case-study header (title, summary, cover film, meta) like Prestige Resort, and
 * the note lives as a paragraph block in src/data/projects.js.
 */
import CaseVideo from '@/components/ui/CaseVideo.vue'

const A = '/assets/works'

const overlays = [
  {
    key: 'brand',
    src: `${A}/luxcrime-video4.mp4`,
    poster: `${A}/luxcrime-video4.jpg`,
    alt: 'Luxcrime: brand campaign film',
    style: { left: '0%', top: '8.521%', width: '100%', height: '7.961%' },
  },
  {
    key: 'desktop',
    src: `${A}/luxcrime-desktop.mp4`,
    poster: `${A}/luxcrime-desktop.jpg`,
    alt: 'Luxcrime: redesigned desktop storefront, scrolling',
    style: { left: '21.75%', top: '17.269%', width: '56.7%', height: '5.444%' },
  },
  {
    key: 'pencils',
    src: `${A}/luxcrime-video1.mp4`,
    poster: `${A}/luxcrime-video1.jpg`,
    alt: 'Luxcrime: lip pencil range campaign film',
    style: { left: '0%', top: '76.488%', width: '100%', height: '5.647%' },
  },
  {
    key: 'mobile',
    // screen recording of the redesigned mobile storefront (incl. Safari chrome)
    // → public/assets/works/luxcrime-mobile.mp4
    src: `${A}/luxcrime-mobile.mp4`,
    poster: `${A}/luxcrime-mobile.jpg`,
    alt: 'Luxcrime: redesigned mobile storefront, animated hero',
    // the whole first phone (Figma node 2058:774): left 460.5, top 11352,
    // width 658/1920 of the frame, aspect-ratio 61/132. The recording is cropped
    // tight to the screen, and the radius here also clips its rounded-corner
    // black so no device-bezel edge shows.
    style: {
      left: '23.984%',
      top: '83.684%',
      width: '22.292%',
      aspectRatio: '61 / 132',
      borderRadius: '13.5% / 6.25%',
    },
  },
]
</script>

<template>
  <div class="lxdoc">
    <img
      :src="`${A}/luxcrime-full.jpg`"
      alt="Luxcrime: full case study: campaign photography, brand film, and desktop and mobile storefront redesign"
      class="lxdoc__img"
    />

    <div
      v-for="o in overlays"
      :key="o.key"
      class="lxdoc__ov"
      :style="o.style"
    >
      <CaseVideo :src="o.src" :poster="o.poster" :alt="o.alt" />
    </div>
  </div>
</template>

<style scoped>
.lxdoc {
  position: relative;
  width: 100%;
  max-width: 1440px;
  margin: clamp(2rem, 5vw, 3.5rem) auto 0; /* air below the intro paragraph */
}

.lxdoc__img {
  display: block;
  width: 100%;
  height: auto;
}

.lxdoc__ov {
  position: absolute;
  overflow: hidden;
}

.lxdoc__ov :deep(.cv),
.lxdoc__ov :deep(video) {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.lxdoc__ov :deep(.cv__btn) {
  width: clamp(26px, 3.5vw, 44px);
  height: clamp(26px, 3.5vw, 44px);
}
</style>
