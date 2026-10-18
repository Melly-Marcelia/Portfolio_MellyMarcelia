<script setup>
import { ref } from 'vue'
import { site } from '@/data/site'
import AppText from '@/components/ui/AppText.vue'
import AppButton from '@/components/ui/AppButton.vue'
import SeedLine from '@/components/ui/SeedLine.vue'
import { useAnalytics, analyticsEnabled } from '@/composables/useAnalytics'

const { openSettings } = useAnalytics()
const copied = ref(false)
let resetTimer

async function copyEmail() {
  try {
    await navigator.clipboard.writeText(site.contact.email)
  } catch {
    // clipboard blocked (insecure context / permissions) — fall back to mailto
    window.location.href = `mailto:${site.contact.email}`
    return
  }
  copied.value = true
  clearTimeout(resetTimer)
  resetTimer = setTimeout(() => (copied.value = false), 1800)
}
</script>

<template>
  <footer id="contact" class="footer">
    <!-- wavy divider made of dragon-fruit seeds -->
    <SeedLine v-reveal="{ y: 0 }" class="footer__wave" />

    <div class="container footer__inner">
      <AppText v-reveal variant="script" as="h2" class="footer__title">
        {{ site.contact.heading }}
      </AppText>
      <AppText v-reveal="1" variant="body" class="footer__body" tone="soft">
        {{ site.contact.body }}
      </AppText>

      <div v-reveal="2" class="footer__links">
        <button
          type="button"
          class="footer__mail"
          :class="{ 'is-copied': copied }"
          :aria-label="
            copied ? 'Email address copied' : `Copy email address ${site.contact.email}`
          "
          @click="copyEmail"
        >
          <span class="footer__mail-value">{{ site.contact.email }}</span>
          <svg
            class="footer__mail-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <path v-if="copied" d="m20 6-11 11-5-5" />
            <template v-else>
              <rect x="9" y="9" width="12" height="12" rx="2" />
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
            </template>
          </svg>
        </button>

        <AppButton :href="site.contact.linkedin" target="_blank" rel="noopener">
          LinkedIn
        </AppButton>
      </div>

      <p class="footer__copyright">
        © {{ new Date().getFullYear() }} {{ site.name }}
        <template v-if="analyticsEnabled">
          ·
          <button type="button" class="footer__cookies" @click="openSettings">
            Cookie settings
          </button>
        </template>
      </p>
    </div>

    <!-- the lily leans in at the bottom-right corner (About has its own in the intro) -->
    <div v-if="$route.name !== 'about'" v-reveal="3" class="footer__lily" aria-hidden="true">
      <img src="/assets/about/lily.png" alt="" />
    </div>
  </footer>
</template>

<style scoped>
.footer {
  position: relative;
  color: var(--color-ink);
  background: var(--color-bg);
  /* top padding always clears the 72px seed divider */
  padding-block: clamp(64px, 7.5vw, 85px) var(--space-l);
}

.footer__wave {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 72px;
  color: var(--color-ink);
}

.footer__inner {
  padding-top: var(--space-m);
}

.footer__title {
  font-size: clamp(1.6rem, 1.4rem + 0.9vw, 2.25rem);
  margin-bottom: var(--space-s);
}

.footer__body {
  max-width: 56ch;
  margin-bottom: var(--space-m);
  text-wrap: balance;
}

.footer__links {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-s) var(--space-m);
  margin-bottom: var(--space-m);
}

/* email = copy button */
.footer__mail {
  display: inline-flex;
  align-items: center;
  gap: var(--space-xs);
  padding: 0.6rem 0.7rem 0.6rem 1.1rem;
  border: 1px solid var(--color-ink);
  border-radius: var(--radius-pill);
  background: transparent;
  color: var(--color-ink);
  font: inherit;
  font-weight: 600;
  transition:
    background var(--transition-fast),
    color var(--transition-fast),
    border-color var(--transition-fast);
}

.footer__mail:hover,
.footer__mail:focus-visible {
  background: var(--color-ink);
  color: var(--color-bg);
}

.footer__mail.is-copied {
  background: var(--color-leaf);
  border-color: var(--color-leaf);
  color: var(--color-leaf-ink);
}

.footer__mail-icon {
  width: 18px;
  height: 18px;
  flex: none;
  opacity: 0.65;
  transition: opacity var(--transition-fast);
}

.footer__mail:hover .footer__mail-icon,
.footer__mail:focus-visible .footer__mail-icon,
.footer__mail.is-copied .footer__mail-icon {
  opacity: 1;
}

.footer__copyright {
  font-size: var(--step--1);
  color: var(--color-ink-faint);
}

.footer__cookies {
  padding: 0;
  border: 0;
  background: none;
  color: inherit;
  font: inherit;
  text-decoration: underline;
  text-underline-offset: 2px;
}

.footer__cookies:hover,
.footer__cookies:focus-visible {
  color: var(--color-ink);
}

.footer__lily {
  position: absolute;
  right: clamp(1rem, 5vw, 5rem);
  bottom: var(--space-m);
  width: clamp(150px, 16vw, 240px);
  pointer-events: none;
  user-select: none;
}

.footer__lily img {
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

.footer__lily img:hover {
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
  .footer__lily img {
    animation: none;
  }
}

/* narrow screens: the text runs full width, so the lily shrinks into the
   corner beside the copyright line instead of covering the buttons */
@media (max-width: 820px) {
  .footer__lily {
    width: clamp(80px, 24vw, 110px);
    bottom: var(--space-s);
  }
}
</style>

<style>
/* home ends on the tinted Featured band — carry that colour down to the seed
   wave so the wave becomes the edge, instead of a straight cut above it */
body:has(.home .featured) .footer {
  --seedline-fill: var(--color-bg-alt);
}
</style>
