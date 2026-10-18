<script setup>
import { site } from '@/data/site'
import AppText from '@/components/ui/AppText.vue'

const words = site.statement.title.split(/\s+/)
// the word that starts out of focus and sharpens as the section scrolls in
const FUZZY_WORD = 'Ambiguity'
// the word that gets the green hand-drawn underline once things are clear
const CLEAR_WORD = 'Clarity'
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
                viewBox="0 0 200 20"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <path d="M4 13 C 48 7, 112 4, 196 9" pathLength="1" /></svg></span
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

/* seeds scattered through the flesh: a tiled scatter of seed ellipses masks
   an ink fill (so they flip to pulp-white seeds in dark mode, the fruit
   inside out), cleared in an oval around the text */
.statement::before {
  content: '';
  position: absolute;
  inset: 0;
  z-index: -1;
  pointer-events: none;
  background: color-mix(in srgb, var(--color-ink) 70%, transparent);
  --seeds: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cg%3E%3Cellipse cx='18' cy='24' rx='3.8' ry='2.2' transform='rotate(35 18 24)'/%3E%3Cellipse cx='62' cy='12' rx='3.2' ry='1.9' transform='rotate(-20 62 12)'/%3E%3Cellipse cx='104' cy='40' rx='3.8' ry='2.2' transform='rotate(55 104 40)'/%3E%3Cellipse cx='150' cy='18' rx='2.9' ry='1.8' transform='rotate(10 150 18)'/%3E%3Cellipse cx='184' cy='58' rx='3.8' ry='2.2' transform='rotate(-40 184 58)'/%3E%3Cellipse cx='36' cy='78' rx='3.2' ry='1.9' transform='rotate(-15 36 78)'/%3E%3Cellipse cx='82' cy='96' rx='3.8' ry='2.2' transform='rotate(40 82 96)'/%3E%3Cellipse cx='128' cy='84' rx='2.9' ry='1.8' transform='rotate(-55 128 84)'/%3E%3Cellipse cx='170' cy='112' rx='3.8' ry='2.2' transform='rotate(25 170 112)'/%3E%3Cellipse cx='14' cy='138' rx='3.2' ry='1.9' transform='rotate(60 14 138)'/%3E%3Cellipse cx='58' cy='154' rx='3.8' ry='2.2' transform='rotate(-30 58 154)'/%3E%3Cellipse cx='106' cy='140' rx='2.9' ry='1.8' transform='rotate(15 106 140)'/%3E%3Cellipse cx='146' cy='170' rx='3.8' ry='2.2' transform='rotate(-10 146 170)'/%3E%3Cellipse cx='190' cy='176' rx='3.2' ry='1.9' transform='rotate(45 190 176)'/%3E%3Cellipse cx='30' cy='192' rx='2.9' ry='1.8' transform='rotate(20 30 192)'/%3E%3Cellipse cx='86' cy='186' rx='3.8' ry='2.2' transform='rotate(-45 86 186)'/%3E%3C/g%3E%3C/svg%3E");
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
  left: -4%;
  bottom: -0.18em;
  width: 108%;
  height: 0.32em;
  overflow: visible;
  pointer-events: none;
}
.statement__swoosh path {
  fill: none;
  stroke: var(--color-leaf);
  stroke-width: 6;
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

/* phones: scale the title and paragraph down so the block keeps the light,
   airy proportions of desktop instead of a tall wall of large text */
@media (max-width: 640px) {
  .statement__title {
    font-size: 1.5rem;
    margin-bottom: 0.75rem;
  }
  .statement__body {
    font-size: 0.95rem;
    line-height: 1.6;
  }
}
</style>
