<script setup>
import { site } from '@/data/site'
import AppText from '@/components/ui/AppText.vue'
import ExperienceWallet from '@/components/ExperienceWallet.vue'
import PolaroidStack from '@/components/PolaroidStack.vue'
</script>

<template>
  <div class="about-page">
    <section class="section about-intro">
      <div class="container about">
        <div class="about__photos enter-right" style="--enter-delay: 260ms">
          <PolaroidStack />
        </div>

        <div class="about__text">
          <AppText
            variant="signature"
            as="h1"
            class="about__title enter-write"
            style="--enter-delay: 60ms"
          >
            {{ site.name }}
          </AppText>
          <AppText
            variant="body"
            tone="soft"
            class="about__p enter-left"
            style="--enter-delay: 240ms"
          >
            I'm a {{ site.role }} based in {{ site.location }}, working where design
            meets code: UI/UX and branding, front-end builds in Vue, and interactive 3D.
            I'm comfortable enough on the back-end to get a prototype working end to end.
          </AppText>
          <AppText
            variant="body"
            tone="soft"
            class="about__p enter-left"
            style="--enter-delay: 360ms"
          >
            Give me a vague problem and I'll turn it into a clear idea, then shape it into
            an interface that feels as good as it looks. I'm currently open to internships
            and collaborations.
          </AppText>

          <div class="about__lily enter-right" style="--enter-delay: 480ms" aria-hidden="true">
            <img src="/assets/about/lily.png" alt="" />
          </div>
        </div>
      </div>
    </section>

    <section class="section about-wallet">
      <div v-reveal="{ y: 48 }" class="container">
        <ExperienceWallet />
      </div>
    </section>
  </div>
</template>

<style scoped>
/* keep the gap small so the wallet peeks in above the fold */
.about-intro {
  padding-bottom: 0;
}

.about-wallet {
  padding-top: 0; /* the wallet stage has its own headroom for pulled-out tickets */
}

/* side by side, that headroom sits beside empty space — tuck it up under the intro */
@media (min-width: 821px) {
  .about-wallet {
    margin-top: -10px;
  }
}

/* compact intro: roughly half a screen, polaroids and bio at matching heights */
.about {
  display: grid;
  grid-template-columns: 0.8fr 1.4fr;
  gap: clamp(2rem, 5vw, 4rem);
  align-items: start;
}

/* name on top, bio + lily side by side underneath — the lily gets its own
   column so it sits bottom-right without covering text or adding height */
.about__text {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  column-gap: clamp(1rem, 3vw, 2.5rem);
}

.about__title {
  position: relative;
  top: -2.25rem;
  grid-column: 1 / -1;
  font-size: clamp(2rem, 4vw, 3rem);
  margin-bottom: 1rem;
}

.about__p {
  grid-column: 1;
  font-size: clamp(1rem, 1.1vw, 1.08rem);
  line-height: 1.65;
  margin-bottom: 0.9rem;
  max-width: 56ch;
}

.about__lily {
  grid-column: 2;
  grid-row: 2 / span 2;
  align-self: end;
  position: relative;
  top: 8rem; /* sit a little below the last paragraph */
  width: clamp(170px, 17vw, 250px);
  pointer-events: none;
  user-select: none;
}

.about__lily img {
  display: block;
  width: 100%;
  height: auto;
  transform-origin: 40% 55%;
  pointer-events: auto; /* the wrapper ignores the mouse; the flower itself takes hover */
  /* idle rotation always runs; the left ↔ right drift only runs while hovered,
     and pauses where it is on leave so it settles instead of snapping back */
  animation:
    lily-sway 7s ease-in-out infinite alternate,
    lily-drift 2.8s ease-in-out infinite paused;
}

.about__lily img:hover {
  animation-play-state: running, running;
}

@keyframes lily-sway {
  from { rotate: -4deg; }
  to { rotate: 5deg; }
}

@keyframes lily-drift {
  0%, 100% { translate: 0; }
  25% { translate: -12%; }
  75% { translate: 12%; }
}

@media (prefers-reduced-motion: reduce) {
  .about__lily img {
    animation: none;
  }
}


.about__photos {
  display: flex;
  justify-content: center;
  /* the pile sits in the middle of its box — lift it level with the name */
  margin-top: -80px;
}

.about__photos :deep(.polaroids) {
  max-width: 330px;
}

@media (max-width: 820px) {
  .about {
    grid-template-columns: 1fr;
  }
  .about__photos {
    margin-top: 0;
  }
  /* narrow screens: lily drops under the bio, still on the right */
  .about__text {
    grid-template-columns: 1fr;
  }
  .about__lily {
    grid-column: 1;
    grid-row: auto;
    justify-self: end;
    width: clamp(90px, 28vw, 120px);
  }
}
</style>
