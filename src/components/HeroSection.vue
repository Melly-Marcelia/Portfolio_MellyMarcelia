<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue'
import { site } from '@/data/site'
import AppText from '@/components/ui/AppText.vue'
import { logoAnchor, LOGO_RATIO } from '@/composables/useBrandLogo'

// Empty slot the big logo (BrandLogo.vue) sits in until you scroll
const slot = ref(null)
onMounted(() => (logoAnchor.value = slot.value))
onBeforeUnmount(() => (logoAnchor.value = null))
</script>

<template>
  <section class="hero">
    <div class="container hero__inner">
      <div class="hero__text">
        <AppText
          variant="signature"
          as="h1"
          class="hero__title enter-write"
          style="--enter-delay: 60ms"
        >
          Hi, i am Melly
        </AppText>
        <AppText
          variant="lead"
          class="hero__intro enter-left"
          measure
          style="--enter-delay: 180ms"
        >
          {{ site.intro }}
        </AppText>
      </div>

      <div
        ref="slot"
        class="hero__logo"
        :style="{ '--logo-ratio': LOGO_RATIO }"
        aria-hidden="true"
      ></div>
    </div>
  </section>
</template>

<style scoped>
.hero {
  position: relative;
  flex: 1;
  display: flex;
  align-items: center;
  /* TEMPORARILY OFF — the two soft radial glows. To bring them back, swap this
     background for the commented block below.
  background:
    radial-gradient(
      42% 48% at 44% 36%,
      var(--glow) 0%,
      color-mix(in srgb, var(--glow) 40%, transparent) 38%,
      transparent 70%
    ),
    radial-gradient(
      55% 60% at 60% 48%,
      var(--glow-soft) 0%,
      color-mix(in srgb, var(--glow-soft) 35%, transparent) 45%,
      transparent 78%
    ),
    var(--color-bg);
  */
  background: var(--color-bg);
  overflow: hidden;
}

/* soft fade — the glow + portrait dissolve into the page before the carousel */
.hero::after {
  content: '';
  position: absolute;
  inset: auto 0 0 0;
  height: 42%;
  background: linear-gradient(
    to bottom,
    color-mix(in srgb, var(--color-bg), transparent 100%),
    var(--color-bg) 92%
  );
  pointer-events: none;
}

.hero__inner {
  position: relative;
  z-index: var(--z-raised);
  display: grid;
  grid-template-columns: 1.4fr 0.8fr;
  align-items: center;
  gap: clamp(var(--space-m), 5vw, var(--space-2xl));
  padding-block: clamp(1rem, 3vh, 2.75rem);
}

/* nudge the title + intro in from the left edge */
.hero__text {
  margin-left: clamp(0px, 3vw, 3.75rem);
}

/* as you scroll away the text drifts up and fades (scroll-driven, where supported) */
@supports (animation-timeline: scroll()) {
  @media (prefers-reduced-motion: no-preference) {
    .hero__text {
      animation: hero-drift linear both;
      animation-timeline: scroll(root);
      animation-range: 0 70vh;
    }
  }
}

@keyframes hero-drift {
  to {
    opacity: 0.15;
    transform: translate3d(0, -3rem, 0);
  }
}

/* Homemade Apple runs wide & tall — hold the size back a little */
.hero__title {
  position: relative;
  top: -1rem;
  font-size: clamp(1.8rem, 4vw, 3.2rem);
  margin-bottom: var(--space-s);
}

.hero__intro {
  max-width: 44ch;
}

.hero__logo {
  justify-self: end;
  /* pull the dragon fruit in from the right edge */
  margin-right: clamp(2rem, 9vw, 9rem);
  height: clamp(15rem, 46vh, 25rem);
  aspect-ratio: var(--logo-ratio);
}

/* big, tall screens: the hero fills the whole first screen there, so let
   the greeting and intro grow into it instead of floating in space */
@media (min-width: 1700px) and (min-height: 950px) {
  .hero__title {
    font-size: 3.75rem;
    margin-bottom: var(--space-m);
  }
  .hero__intro {
    font-size: 1.6rem;
    max-width: 42ch;
  }
}

@media (max-width: 820px) {
  .hero__inner {
    grid-template-columns: 1fr;
    text-align: center;
  }

  .hero__text {
    margin-left: 0;
  }

  .hero__intro {
    margin-inline: auto;
  }

  .hero__logo {
    justify-self: center;
    margin-right: 0;
    order: -1;
    height: clamp(12.5rem, 32vh, 17.5rem);
  }
}
</style>
