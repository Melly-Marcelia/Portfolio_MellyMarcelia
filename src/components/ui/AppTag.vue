<script setup>
/**
 * AppTag — a small pill label (project category, meta chip, etc).
 *
 *   <AppTag>UI/UX case study</AppTag>
 *   <AppTag variant="outline">Figma</AppTag>
 */
defineProps({
  variant: {
    type: String,
    default: 'solid', // solid | outline
    validator: (v) => ['solid', 'outline'].includes(v),
  },
})
</script>

<template>
  <span class="tag pencil" :class="`tag--${variant}`">
    <slot />
  </span>
</template>

<style scoped>
.tag {
  display: inline-flex;
  align-items: center;
  padding: 0.6rem 1.15rem;
  border: 1px solid transparent;
  border-radius: var(--radius-pill);
  font-size: var(--step--1);
  font-weight: 600;
  line-height: 1.3;
  letter-spacing: 0.01em;
}

.tag--solid {
  /* rind-pink pencil shading, outlined in the rind with a bract echo */
  --pencil-line: var(--color-accent);
  --pencil-line-alpha: 0.55;
  --pencil-echo: var(--color-leaf);
  --pencil-echo-alpha: 0.45;
  background: var(--pencil-tooth), var(--color-accent-soft);
  color: var(--color-accent-strong);
}

.tag--outline {
  --pencil-line: var(--color-ink-faint);
  background: var(--pencil-tooth);
  color: var(--color-ink);
}
</style>
