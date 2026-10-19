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
 *
 * accent + outline are drawn in coloured pencil (styles/pencil.css): a
 * doubled wobbly line instead of a border. accent's fill is its own layer,
 * hatched and wobbled by the same filter as the line so the two stay in step.
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
    :class="[`btn--${variant}`, `btn--${size}`, { pencil: variant !== 'ghost' }]"
  >
    <span v-if="variant === 'accent'" class="btn__fill" aria-hidden="true" />
    <slot />
  </RouterLink>

  <a
    v-else-if="kind === 'anchor'"
    :href="href"
    class="btn"
    :class="[`btn--${variant}`, `btn--${size}`, { pencil: variant !== 'ghost' }]"
  >
    <span v-if="variant === 'accent'" class="btn__fill" aria-hidden="true" />
    <slot />
  </a>

  <button
    v-else
    :type="type"
    class="btn"
    :class="[`btn--${variant}`, `btn--${size}`, { pencil: variant !== 'ghost' }]"
  >
    <span v-if="variant === 'accent'" class="btn__fill" aria-hidden="true" />
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
  --pencil-line: var(--color-accent-strong);
  --pencil-line-alpha: 0.9;
  --pencil-echo: var(--color-accent-hover);
  --pencil-echo-alpha: 0.5;
  isolation: isolate;
  color: var(--color-accent-ink);
}
.btn--accent:hover {
  --pencil-echo-alpha: 0.8;
  --pencil-shift: 2.5px -2px;
}

.btn__fill {
  position: absolute;
  inset: 0;
  z-index: -1;
  border-radius: inherit;
  background-color: var(--color-accent);
  background-image: var(--pencil-shade);
  filter: url(#pencil-fill);
  transition: background-color var(--transition-fast);
}
.btn--accent:hover .btn__fill {
  background-color: var(--color-accent-hover);
}

.btn--outline {
  --pencil-line: var(--color-ink);
  --pencil-echo: var(--color-ink-faint);
  background: var(--pencil-tooth);
  color: var(--color-ink);
}
.btn--outline:hover {
  --pencil-echo: var(--color-accent);
  --pencil-echo-alpha: 0.85;
  --pencil-shift: 2.5px -2px;
  background: var(--pencil-grain), var(--color-ink);
  color: var(--color-bg);
}

.btn--ghost {
  color: var(--color-ink);
}
.btn--ghost:hover {
  background: var(--color-border);
}
</style>
