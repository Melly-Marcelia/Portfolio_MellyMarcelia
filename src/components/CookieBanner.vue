<script setup>
/**
 * CookieBanner — asks for analytics consent. Accept and decline get equal
 * weight (no dark patterns); nothing is tracked until "Accept".
 */
import { useAnalytics, analyticsEnabled } from '@/composables/useAnalytics'
import AppButton from '@/components/ui/AppButton.vue'

const { bannerOpen, consent, accept, decline } = useAnalytics()
</script>

<template>
  <Transition name="cookie">
    <section
      v-if="analyticsEnabled && bannerOpen"
      class="cookie"
      role="dialog"
      aria-labelledby="cookie-title"
      aria-describedby="cookie-body"
    >
      <h2 id="cookie-title" class="cookie__title">Cookies, but only if you like</h2>
      <p id="cookie-body" class="cookie__body">
        I'd like to use Google Analytics to see which projects people look at. It sets
        cookies and sends anonymous usage data to Google. Nothing is tracked unless you
        accept, and you can change your mind anytime via “Cookie settings” in the footer.
      </p>
      <p v-if="consent" class="cookie__status">
        Current choice: <strong>{{ consent === 'granted' ? 'accepted' : 'declined' }}</strong>
      </p>
      <div class="cookie__actions">
        <AppButton variant="outline" size="sm" @click="decline">Decline</AppButton>
        <AppButton variant="outline" size="sm" @click="accept">Accept</AppButton>
      </div>
    </section>
  </Transition>
</template>

<style scoped>
.cookie {
  position: fixed;
  left: var(--space-s);
  bottom: var(--space-s);
  z-index: var(--z-overlay);
  width: min(25rem, calc(100vw - 2 * var(--space-s)));
  padding: var(--space-m);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-l);
  background: var(--color-surface);
  color: var(--color-ink);
  box-shadow: var(--shadow-l);
}

.cookie__title {
  font-size: var(--step-1);
  margin-bottom: var(--space-2xs);
}

.cookie__body,
.cookie__status {
  font-size: var(--step--1);
  color: var(--color-ink-soft);
  margin-bottom: var(--space-s);
}

.cookie__actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2xs);
}

.cookie-enter-active,
.cookie-leave-active {
  transition:
    opacity var(--transition-fast),
    transform var(--transition-fast);
}

.cookie-enter-from,
.cookie-leave-to {
  opacity: 0;
  transform: translateY(0.75rem);
}
</style>
