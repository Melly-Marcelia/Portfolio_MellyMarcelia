<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { caseStudies } from '@/data/projects'
import AppText from '@/components/ui/AppText.vue'
import CoverMedia from '@/components/ui/CoverMedia.vue'

/**
 * Looping strip of work thumbnails under the hero — a glimpse of every
 * project with a case study (coming-soon ones are left out). Tiles keep
 * their size (about four on screen) and the strip drifts sideways forever: the list is rendered twice and the track slides by one
 * copy's width, so the seam is invisible. Hover / focus pauses it; reduced
 * motion turns it into a plain swipeable row. Each tile links to that
 * project's case-study page (/works/:slug).
 */
const SECONDS_PER_TILE = 5

const items = computed(() => caseStudies)
const duration = computed(() => `${items.value.length * SECONDS_PER_TILE}s`)
</script>

<template>
  <div class="carousel enter-rise" :style="{ '--enter-delay': '320ms' }">
    <ul class="carousel__track" :style="{ '--loop-dur': duration }">
      <!-- copy 0 is the real list; copy 1 is a visual duplicate for the loop -->
      <template v-for="copy in 2" :key="copy">
      <li
        v-for="item in items"
        :key="`${copy}-${item.slug}`"
        class="tile"
        :class="{ 'tile--dupe': copy === 2 }"
        :aria-hidden="copy === 2 ? 'true' : undefined"
      >
        <!-- coming-soon projects have no page yet: a plain tile, not a link -->
        <component
          :is="item.comingSoon ? 'div' : RouterLink"
          :to="item.comingSoon ? undefined : { name: 'project', params: { slug: item.slug } }"
          class="tile__link"
          :class="{ 'tile__link--empty': !item.cover }"
          :tabindex="copy === 2 && !item.comingSoon ? -1 : undefined"
          :aria-label="item.comingSoon ? `${item.title}: coming soon` : `${item.title}: read the case study`"
        >
          <span class="tile__ph"></span>
          <CoverMedia
            v-if="item.cover"
            :src="item.cover"
            :poster="item.poster"
            :zoom="item.coverZoom"
            :alt="item.title"
            @error="(e) => (e.target.hidden = true)"
          />

          <span class="tile__overlay">
            <AppText variant="label" class="tile__name">{{ item.title }}</AppText>
            <span class="tile__cta">{{ item.comingSoon ? 'Coming soon' : 'Read case study →' }}</span>
          </span>
        </component>
      </li>
      </template>
    </ul>
  </div>
</template>

<style scoped>
.carousel {
  --tile-gap: clamp(0.5rem, 1.4vw, 1rem);
  padding-block: clamp(1rem, 3vh, 2.5rem) clamp(1.5rem, 4vh, 3rem);
  overflow: hidden;
  /* soft fade at both edges so tiles drift in and out, not get cut */
  mask-image: linear-gradient(to right, transparent, #000 4%, #000 96%, transparent);
}

.carousel__track {
  list-style: none;
  display: flex;
  gap: var(--tile-gap);
  width: max-content;
  animation: carousel-loop var(--loop-dur, 40s) linear infinite;
}

/* stop to let people look / click */
.carousel__track:hover,
.carousel__track:focus-within {
  animation-play-state: paused;
}

/* slide exactly one copy (half the track, incl. the gap after the last tile) */
@keyframes carousel-loop {
  to {
    transform: translateX(calc(-50% - var(--tile-gap) / 2));
  }
}

/* same tile size as the old 4-up row */
.tile {
  flex: 0 0 auto;
  width: clamp(220px, calc((min(100vw, var(--page-max)) - 3 * var(--tile-gap)) / 4), 420px);
}

/* plain rectangular thumbnail — the whole tile is the link */
.tile__link,
.tile > .tile__ph {
  position: relative;
  display: block;
  aspect-ratio: 3 / 2;
  max-height: 34vh;
  overflow: hidden;
  border-radius: var(--radius-s);
}

.tile__link {
  cursor: pointer;
  transition: transform var(--transition-fast);
}

.tile__link :is(img, video) {
  position: relative;
  z-index: var(--z-raised);
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* no cover yet — keep the name visible on the placeholder instead of a blank tile */
.tile__link--empty .tile__overlay {
  opacity: 1;
  color: var(--color-ink-soft);
  background: none;
}
.tile__link--empty :is(.tile__name, .tile__cta) {
  transform: none;
}

/* placeholder sits behind the image — shows through if the image is missing */
.tile__ph {
  background: var(--color-placeholder);
}

.tile__link > .tile__ph {
  position: absolute;
  inset: 0;
}

/* hover / focus affordance — makes it obvious each tile opens a page */
.tile__overlay {
  position: absolute;
  inset: 0;
  z-index: 2;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  gap: var(--space-3xs);
  padding: var(--space-s);
  color: var(--color-on-scrim);
  background: linear-gradient(
    to top,
    color-mix(in srgb, var(--color-scrim) 78%, transparent),
    color-mix(in srgb, var(--color-scrim) 10%, transparent) 55%,
    transparent
  );
  opacity: 0;
  transition: opacity var(--transition-fast);
}

.tile__link:hover .tile__overlay,
.tile__link:focus-visible .tile__overlay {
  opacity: 1;
}

.tile__link:hover,
.tile__link:focus-visible {
  transform: translateY(-2px);
}

.tile__link > :is(img, video, .cm-zoom) {
  transition: transform 0.9s var(--ease-soft);
}
.tile__link:hover > :is(img, video, .cm-zoom),
.tile__link:focus-visible > :is(img, video, .cm-zoom) {
  transform: scale(1.06);
}

/* label + CTA drift up as the overlay fades in */
.tile__name,
.tile__cta {
  transform: translateY(8px);
  transition: transform 0.45s var(--ease-soft);
}
.tile__cta {
  transition-delay: 60ms;
}
.tile__link:hover :is(.tile__name, .tile__cta),
.tile__link:focus-visible :is(.tile__name, .tile__cta) {
  transform: none;
}

.tile__cta {
  font-size: var(--step--1);
  font-weight: 600;
  opacity: 0.9;
}

/* reduced motion: no drift — a plain swipeable row of the real list */
@media (prefers-reduced-motion: reduce) {
  .carousel {
    overflow-x: auto;
    mask-image: none;
    scrollbar-width: none;
  }
  .carousel__track {
    animation: none;
    padding-inline: clamp(6px, 1vw, 12px);
  }
  .tile--dupe {
    display: none;
  }
}

@media (max-width: 640px) {
  .tile {
    width: 72vw;
  }

  .tile__link,
  .tile > .tile__ph {
    max-height: none;
  }

  /* touch: no hover — keep the label visible */
  .tile__name,
  .tile__cta {
    transform: none;
  }

  .tile__overlay {
    opacity: 1;
    background: linear-gradient(
      to top,
      color-mix(in srgb, var(--color-scrim) 70%, transparent),
      transparent 60%
    );
  }
}
</style>
