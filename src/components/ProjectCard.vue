<script setup>
import { useId } from 'vue'
import { RouterLink } from 'vue-router'
import AppText from '@/components/ui/AppText.vue'
import AppTag from '@/components/ui/AppTag.vue'
import CoverMedia from '@/components/ui/CoverMedia.vue'

defineProps({
  project: { type: Object, required: true },
  /** show the summary line (on by default; the dense /works grid turns it off) */
  showSummary: { type: Boolean, default: true },
})

// per-card filter ids, so every card's pencil line gets its own defs
const uid = useId()
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
      <AppText variant="h3" as="h3" class="card__title">
        {{ project.title }}
        <!-- leaf-green pencil underline, drawn in on hover -->
        <svg
          class="card__scribble"
          viewBox="0 0 200 10"
          preserveAspectRatio="none"
          aria-hidden="true"
          focusable="false"
        >
          <path
            d="M3 6.5 C 34 3, 66 8.5, 102 5.5 S 168 3.5, 197 6"
            :filter="`url(#${uid}-tooth)`"
          />
        </svg>
      </AppText>

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

    <!-- hand-drawn outline: two wobbly coloured-pencil passes instead of a
         crisp border (graphite at rest, the fruit's rind + bract on hover) -->
    <svg class="card__sketch" aria-hidden="true" focusable="false">
      <defs>
        <filter :id="`${uid}-pencil-a`" x="-2%" y="-2%" width="104%" height="104%">
          <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed="3" result="wobble" />
          <feDisplacementMap in="SourceGraphic" in2="wobble" scale="3.5" xChannelSelector="R" yChannelSelector="G" result="line" />
          <feTurbulence type="fractalNoise" baseFrequency="0.9 0.3" numOctaves="2" seed="8" result="grain" />
          <feColorMatrix in="grain" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  2.6 0 0 0 -0.55" result="tooth" />
          <feComposite in="line" in2="tooth" operator="in" />
        </filter>
        <filter :id="`${uid}-pencil-b`" x="-2%" y="-2%" width="104%" height="104%">
          <feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="2" seed="17" result="wobble" />
          <feDisplacementMap in="SourceGraphic" in2="wobble" scale="4.5" xChannelSelector="G" yChannelSelector="R" result="line" />
          <feTurbulence type="fractalNoise" baseFrequency="0.3 0.9" numOctaves="2" seed="21" result="grain" />
          <feColorMatrix in="grain" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  2.6 0 0 0 -0.6" result="tooth" />
          <feComposite in="line" in2="tooth" operator="in" />
        </filter>
        <!-- grain only, no wobble: for the title underline -->
        <filter :id="`${uid}-tooth`" x="-5%" y="-50%" width="110%" height="200%">
          <feTurbulence type="fractalNoise" baseFrequency="0.9 0.3" numOctaves="2" seed="5" result="grain" />
          <feColorMatrix in="grain" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  2.4 0 0 0 -0.4" result="tooth" />
          <feComposite in="SourceGraphic" in2="tooth" operator="in" />
        </filter>
      </defs>
      <rect
        class="card__sketch-pass"
        x="1.5"
        y="1.5"
        width="99%"
        height="99%"
        rx="20"
        :filter="`url(#${uid}-pencil-a)`"
      />
      <rect
        class="card__sketch-pass card__sketch-pass--echo"
        x="1.5"
        y="1.5"
        width="99%"
        height="99%"
        rx="20"
        :filter="`url(#${uid}-pencil-b)`"
      />
    </svg>
  </component>
</template>

<style scoped>
.card {
  /* paper tooth: faint directional speckle, like the grain a coloured pencil
     catches on drawing paper. The texture carries its own alpha, so no blend
     modes (iOS Safari drops background-blend-mode). */
  --paper-tooth: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='t' x='0' y='0'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.95 .7' numOctaves='2' seed='4' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 .1  0 0 0 0 .08  0 0 0 0 .09  0 0 0 .32 -.15'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23t)'/%3E%3C/svg%3E");
  --pencil-rest: var(--color-ink-faint);
  --pencil-rest-echo: var(--color-ink-faint);

  position: relative;
  display: flex;
  flex-direction: column;
  padding: clamp(var(--space-xs), 1.4vw, 1.1rem);
  /* the sketched outline (.card__sketch) stands in for the border; a clear
     1px keeps the box exactly the size it was */
  border: 1px solid transparent;
  border-radius: var(--radius-l);
  background: var(--paper-tooth), var(--color-surface);
  transition:
    transform var(--transition),
    box-shadow var(--transition);
}

/* dark paper: the tooth catches light instead of graphite */
:global(:root[data-theme='dark']) .card {
  --paper-tooth: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='t' x='0' y='0'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.95 .7' numOctaves='2' seed='4' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 .96  0 0 0 0 .95  0 0 0 0 .95  0 0 0 .26 -.12'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23t)'/%3E%3C/svg%3E");
}

/* ---- sketched outline ------------------------------------------------ */
.card__sketch {
  position: absolute;
  inset: -1px;
  width: calc(100% + 2px);
  height: calc(100% + 2px);
  z-index: calc(var(--z-raised) + 2);
  overflow: visible;
  pointer-events: none;
}

.card__sketch-pass {
  /* exact inset where CSS geometry is supported; the 99% attributes are the fallback */
  width: calc(100% - 3px);
  height: calc(100% - 3px);
  rx: var(--radius-l);
  fill: none;
  stroke: var(--pencil-rest);
  stroke-width: 1.6;
  stroke-linejoin: round;
  opacity: 0.75;
  transition:
    stroke var(--transition),
    opacity var(--transition),
    transform var(--transition);
}

/* second, lighter pass a hair off the first: the doubled line of a sketch */
.card__sketch-pass--echo {
  stroke: var(--pencil-rest-echo);
  stroke-width: 1.1;
  opacity: 0.35;
  transform: translate(1px, -0.75px);
}

.card:not(.card--soon):hover .card__sketch-pass {
  stroke: var(--color-accent);
  opacity: 0.95;
}
.card:not(.card--soon):hover .card__sketch-pass--echo {
  stroke: var(--color-leaf);
  opacity: 0.8;
  transform: translate(2.5px, -2px);
}

/* ---- pencil underline under the title -------------------------------- */
.card__title {
  position: relative;
}

.card__scribble {
  position: absolute;
  left: -0.1em;
  bottom: -0.3em;
  width: calc(100% + 0.2em);
  height: 0.45em;
  overflow: visible;
  pointer-events: none;
  /* drawn in left to right */
  clip-path: inset(-50% 100% -50% 0);
  transition: clip-path 0.55s var(--ease-soft);
}

.card:not(.card--soon):hover .card__scribble {
  clip-path: inset(-50% 0 -50% 0);
}

.card__scribble path {
  fill: none;
  stroke: var(--color-leaf);
  stroke-width: 3.2;
  stroke-linecap: round;
  vector-effect: non-scaling-stroke;
}

@media (prefers-reduced-motion: reduce) {
  .card__scribble,
  .card__sketch-pass {
    transition: none;
  }
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
