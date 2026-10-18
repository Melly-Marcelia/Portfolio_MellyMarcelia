<script setup>
/**
 * AppButton — the one button/CTA primitive.
 *
 *   <AppButton :to="{ name: 'works' }">View all works</AppButton>
 *   <AppButton variant="outline" href="https://…" target="_blank">LinkedIn</AppButton>
 *   <AppButton variant="ghost" size="sm" @click="…">Copy</AppButton>
 *
 * Renders a <RouterLink> when `to` is set, an <a> when `href` is set,
 * otherwise a native <button>.
 */
import { computed } from 'vue'
import { RouterLink } from 'vue-router'

const props = defineProps({
  variant: {
    type: String,
    default: 'accent', // accent | outline | ghost
    validator: (v) => ['accent', 'outline', 'ghost'].includes(v),
  },
  size: {
    type: String,
    default: 'md', // sm | md
    validator: (v) => ['sm', 'md'].includes(v),
  },
  to: { type: [String, Object], default: null },
  href: { type: String, default: null },
  type: { type: String, default: 'button' },
})

const kind = computed(() => (props.to ? 'router' : props.href ? 'anchor' : 'button'))
</script>

<template>
  <RouterLink
    v-if="kind === 'router'"
    :to="to"
    class="btn"
    :class="[`btn--${variant}`, `btn--${size}`]"
  >
    <slot />
  </RouterLink>

  <a
    v-else-if="kind === 'anchor'"
    :href="href"
    class="btn"
    :class="[`btn--${variant}`, `btn--${size}`]"
  >
    <slot />
  </a>

  <button
    v-else
    :type="type"
    class="btn"
    :class="[`btn--${variant}`, `btn--${size}`]"
  >
    <slot />
  </button>
</template>

<style scoped>
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2xs);
  border: 1px solid transparent;
  border-radius: var(--radius-pill);
  font-weight: 700;
  line-height: 1.2;
  white-space: nowrap;
  transition:
    transform var(--transition-fast),
    filter var(--transition-fast),
    background var(--transition-fast),
    color var(--transition-fast),
    border-color var(--transition-fast);
}

.btn:hover {
  transform: translateY(-1px);
}

.btn:active {
  transform: translateY(0) scale(0.97);
}

/* sizes */
.btn--sm {
  padding: 0.5rem 1.1rem;
  font-size: var(--step--1);
}
.btn--md {
  padding: 0.7rem 1.6rem;
  font-size: var(--step-0);
}

/* variants */
.btn--accent {
  background: var(--color-accent);
  color: var(--color-accent-ink);
}
.btn--accent:hover {
  background: var(--color-accent-hover);
}

.btn--outline {
  border-color: var(--color-ink);
  color: var(--color-ink);
}
.btn--outline:hover {
  background: var(--color-ink);
  color: var(--color-bg);
}

.btn--ghost {
  color: var(--color-ink);
}
.btn--ghost:hover {
  background: var(--color-border);
}
</style>
