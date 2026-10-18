<script setup>
import AppText from '@/components/ui/AppText.vue'
import AppButton from '@/components/ui/AppButton.vue'
</script>

<template>
  <section class="section">
    <div class="container nf">
      <AppText variant="signature" as="h1" class="nf__title enter-pop">404</AppText>
      <AppText variant="lead" class="nf__text enter-up" style="--enter-delay: 300ms">
        This page wandered off.
      </AppText>
      <AppButton :to="{ name: 'home' }" class="enter-up" style="--enter-delay: 420ms">
        Back home
      </AppButton>
    </div>
  </section>
</template>

<style scoped>
.nf {
  text-align: center;
}
.nf__title {
  display: inline-block;
  font-size: clamp(2.4rem, 8vw, 4.4rem);
}
.nf__text {
  margin: var(--space-2xs) 0 var(--space-m);
}
</style>
