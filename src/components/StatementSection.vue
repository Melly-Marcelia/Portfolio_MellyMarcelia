<script setup>
import { useId } from 'vue'
import { site } from '@/data/site'
import AppText from '@/components/ui/AppText.vue'

const words = site.statement.title.split(/\s+/)
// the word that starts out of focus and sharpens as the section scrolls in
const FUZZY_WORD = 'Ambiguity'
// the word that gets the green hand-drawn underline once things are clear
const CLEAR_WORD = 'Clarity'
// own id for the pencil-grain filter on the underline
const toothId = `${useId()}-tooth`
</script>

<template>
  <section class="statement">
    <div class="container statement__inner">
      <AppText v-reveal="{ words: true }" variant="h2" class="statement__title" balance>
        <template v-for="(w, i) in words" :key="i">
          <span class="reveal-word" :style="{ '--w': i }"
            ><span v-if="w === FUZZY_WORD" class="statement__fuzzy">{{ w }}</span
            ><span v-else-if="w === CLEAR_WORD" class="statement__clear"
              >{{ w
              }}<svg
                class="statement__swoosh"
                viewBox="0 0 200 10"
                preserveAspectRatio="none"
                aria-hidden="true"
                focusable="false"
              >
                <!-- same pencil underline as the project card titles -->
                <defs>
                  <filter :id="toothId" x="-5%" y="-50%" width="110%" height="200%">
                    <feTurbulence type="fractalNoise" baseFrequency="0.9 0.3" numOctaves="2" seed="5" result="grain" />
                    <feColorMatrix in="grain" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  2.4 0 0 0 -0.4" result="tooth" />
                    <feComposite in="SourceGraphic" in2="tooth" operator="in" />
                  </filter>
                </defs>
                <path
                  d="M3 6.5 C 34 3, 66 8.5, 102 5.5 S 168 3.5, 197 6"
                  pathLength="1"
                  :filter="`url(#${toothId})`"
                /></svg></span
            ><template v-else>{{ w }}</template></span
          >{{ ' ' }}
        </template>
      </AppText>
      <AppText v-reveal="{ delay: 300 }" variant="lead" class="statement__body">
        {{ site.statement.body }}
      </AppText>
    </div>
  </section>
</template>

<style scoped>
.statement {
  /* a slice of the cut fruit: pulp-white flesh */
  position: relative;
  isolation: isolate;
  background: var(--color-surface);
  color: var(--color-ink);
  padding-block: clamp(3rem, 9vw, 7.5rem);
  /* breathing room below the carousel */
  margin-top: clamp(3.5rem, 7vw, 7rem);
  text-align: center;
}

/* seeds scattered through the flesh: a tiled scatter of the same pencil
   teardrop seeds as the footer divider (seeds-pencil.svg) masks
   an ink fill (so they flip to pulp-white seeds in dark mode, the fruit
   inside out), cleared in an oval around the text */
.statement::before {
  content: '';
  position: absolute;
  inset: 0;
  z-index: -1;
  pointer-events: none;
  background: var(--color-ink);
  --seeds: url("/assets/seeds-pencil.svg");
  --clear: radial-gradient(ellipse 42% 50% at 50% 50%, transparent 35%, #000 100%);
  -webkit-mask: var(--seeds) 0 0 / 12.5rem 12.5rem repeat, var(--clear);
  -webkit-mask-composite: source-in;
  mask: var(--seeds) 0 0 / 12.5rem 12.5rem repeat, var(--clear);
  mask-composite: intersect;
}

.statement__title {
  margin-bottom: 1rem;
  color: inherit;
}

/* "Ambiguity" is a focus pull tied to scroll: blurred and faint as the
   section enters, sharp by the time it reaches the middle of the viewport.
   Browsers without scroll-driven animations just show it sharp. */
.statement__fuzzy {
  display: inline-block;
}
@supports (animation-timeline: view()) {
  @media (prefers-reduced-motion: no-preference) {
    .statement__fuzzy {
      animation: statement-focus linear both;
      animation-timeline: view();
      animation-range: entry 60% cover 45%;
    }
  }
}
/* "Clarity" gets a green swoosh, the bract tips against the flesh.
   It draws in just after "Ambiguity" sharpens. */
.statement__clear {
  position: relative;
  display: inline-block;
}
.statement__swoosh {
  position: absolute;
  left: -0.1em;
  bottom: -0.3em;
  width: calc(100% + 0.2em);
  height: 0.45em;
  overflow: visible;
  pointer-events: none;
}
.statement__swoosh path {
  fill: none;
  stroke: var(--color-leaf);
  /* the card's 3.2px at its title size, scaled up with the heading */
  stroke-width: 0.135em;
  stroke-linecap: round;
  vector-effect: non-scaling-stroke;
}
@supports (animation-timeline: view()) {
  @media (prefers-reduced-motion: no-preference) {
    .statement__swoosh path {
      stroke-dasharray: 1;
      animation: statement-draw linear both;
      animation-timeline: view();
      animation-range: entry 90% cover 52%;
    }
  }
}
@keyframes statement-draw {
  from {
    stroke-dashoffset: 1;
  }
  to {
    stroke-dashoffset: 0;
  }
}

@keyframes statement-focus {
  from {
    filter: blur(7px);
    opacity: 0.45;
  }
  to {
    filter: none;
    opacity: 1;
  }
}

.statement__body {
  max-width: 58ch;
  margin-inline: auto;
  color: var(--color-ink-soft);
}
</style>
