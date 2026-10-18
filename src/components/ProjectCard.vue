<script setup>
import { RouterLink } from 'vue-router'
import AppText from '@/components/ui/AppText.vue'
import AppTag from '@/components/ui/AppTag.vue'
import CoverMedia from '@/components/ui/CoverMedia.vue'

defineProps({
  project: { type: Object, required: true },
  /** show the summary line (on by default; the dense /works grid turns it off) */
  showSummary: { type: Boolean, default: true },
})
</script>

<template>
  <!-- coming-soon projects have no page yet: a plain card, not a link -->
  <component
    :is="project.comingSoon ? 'div' : RouterLink"
    :to="project.comingSoon ? undefined : { name: 'project', params: { slug: project.slug } }"
    class="card"
    :class="{ 'card--soon': project.comingSoon }"
  >
    <div class="card__media">
      <CoverMedia
        v-if="project.cover"
        :src="project.cover"
        :poster="project.poster"
        :zoom="project.coverZoom"
        :alt="project.title"
        @error="(e) => (e.target.hidden = true)"
      />
      <span class="card__placeholder"></span>
      <span v-if="project.comingSoon" class="card__soon">Coming soon</span>
    </div>

    <div class="card__body">
      <AppText variant="h3" as="h3" class="card__title">{{ project.title }}</AppText>

      <AppText
        v-if="showSummary && project.summary"
        variant="body"
        tone="soft"
        class="card__summary"
      >
        {{ project.summary }}
      </AppText>

      <AppTag>{{ project.category }}</AppTag>
    </div>
  </component>
</template>

<style scoped>
.card {
  display: flex;
  flex-direction: column;
  padding: clamp(var(--space-xs), 1.4vw, 1.1rem);
  border: var(--border-card);
  border-radius: var(--radius-l);
  background: var(--color-surface);
  transition:
    transform var(--transition),
    box-shadow var(--transition),
    border-color var(--transition);
}

/* while the card scroll-reveals (v-reveal adds .reveal), its cover opens out
   from a slightly inset window — same timing as the rise, so they land together */
.card.reveal .card__media {
  clip-path: inset(7% 9% 7% 9% round var(--radius-m));
  transition: clip-path var(--reveal-dur) var(--ease-soft) var(--reveal-delay, 0ms);
}
.card.reveal.is-revealed .card__media {
  clip-path: inset(0 round var(--radius-m));
}

/* cover eases in a touch on hover */
.card__media > :is(img, video, .cm-zoom) {
  transition: transform 0.9s var(--ease-soft);
}
.card:not(.card--soon):hover .card__media > :is(img, video, .cm-zoom) {
  transform: scale(1.045);
}

.card:not(.card--soon):hover {
  transform: translateY(-4px);
  border-color: color-mix(in srgb, var(--color-accent) 35%, transparent);
  box-shadow:
    var(--shadow-l),
    0 1.125rem 2.5rem -1.5rem color-mix(in srgb, var(--color-accent) 45%, transparent);
}

.card:not(.card--soon):hover .card__title {
  color: var(--color-accent);
}



.card__media {
  position: relative;
  aspect-ratio: 3 / 2;
  border-radius: var(--radius-m);
  overflow: hidden;
  background: var(--color-mat);
}

.card__media :is(img, video) {
  position: relative;
  z-index: var(--z-raised);
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.card__placeholder {
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(
    45deg,
    var(--color-mat),
    var(--color-mat) 0.75rem,
    var(--color-mat-alt) 0.75rem,
    var(--color-mat-alt) 1.5rem
  );
}

/* sits over the cover (or the striped placeholder) */
.card__soon {
  position: absolute;
  inset: 0;
  z-index: calc(var(--z-raised) + 1);
  display: grid;
  place-items: center;
  font-size: var(--step-1);
  font-weight: 600;
  letter-spacing: 0.02em;
  color: var(--color-ink-soft);
}

.card__body {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--space-xs);
  padding: clamp(var(--space-s), 1.6vw, 1.4rem) clamp(0.4rem, 0.8vw, 0.7rem)
    clamp(var(--space-2xs), 0.8vw, 0.7rem);
}

.card__title {
  color: var(--color-ink);
  transition: color var(--transition-fast);
}

.card__summary {
  max-width: 46ch;
}
</style>
