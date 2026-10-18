<script setup>
/**
 * AppText — the single entry point for typography.
 *
 *   <AppText variant="h2">Section title</AppText>
 *   <AppText variant="signature" as="h1">Hi, i am Melly</AppText>
 *   <AppText variant="lead" measure>Intro paragraph…</AppText>
 *   <AppText variant="caption" tone="faint">Photo credit</AppText>
 *
 * variant → picks the .t-* style from styles/typography.css
 * as      → override the HTML tag (defaults are sensible per variant)
 * tone    → 'soft' | 'faint' | 'accent'
 * balance → text-wrap: balance (good for headings)
 * measure → cap line length at ~60ch (good for body copy)
 */
import { computed } from 'vue'

const props = defineProps({
  variant: {
    type: String,
    default: 'body',
    validator: (v) =>
      [
        'signature',
        'script',
        'display',
        'h1',
        'h2',
        'h3',
        'h4',
        'lead',
        'body',
        'body-sm',
        'eyebrow',
        'label',
        'caption',
      ].includes(v),
  },
  as: { type: String, default: null },
  tone: {
    type: String,
    default: null,
    validator: (v) => ['soft', 'faint', 'accent'].includes(v),
  },
  balance: { type: Boolean, default: false },
  measure: { type: Boolean, default: false },
})

const defaultTag = {
  signature: 'span',
  script: 'span',
  display: 'h1',
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  h4: 'h4',
  lead: 'p',
  body: 'p',
  'body-sm': 'p',
  eyebrow: 'p',
  label: 'span',
  caption: 'p',
}

const tag = computed(() => props.as || defaultTag[props.variant] || 'span')

const classes = computed(() => [
  `t-${props.variant}`,
  props.tone && `t--${props.tone}`,
  props.balance && 't--balance',
  props.measure && 't--measure',
])
</script>

<template>
  <component :is="tag" :class="classes">
    <slot />
  </component>
</template>
