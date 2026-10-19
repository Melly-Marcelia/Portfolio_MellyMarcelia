<script setup>
import TheNavbar from '@/components/TheNavbar.vue'
import BrandLogo from '@/components/BrandLogo.vue'
import TheFooter from '@/components/TheFooter.vue'
import CookieBanner from '@/components/CookieBanner.vue'
</script>

<template>
  <!-- coloured-pencil filters for .pencil (styles/pencil.css): wobble the line,
       then let the paper's tooth break it up. Not display:none, or they stop rendering. -->
  <svg class="pencil-defs" aria-hidden="true" focusable="false">
    <filter id="pencil-a" x="-10%" y="-25%" width="120%" height="150%">
      <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed="3" result="wobble" />
      <feDisplacementMap in="SourceGraphic" in2="wobble" scale="3" xChannelSelector="R" yChannelSelector="G" result="line" />
      <feTurbulence type="fractalNoise" baseFrequency="0.9 0.3" numOctaves="2" seed="8" result="grain" />
      <feColorMatrix in="grain" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  2.6 0 0 0 -0.55" result="tooth" />
      <feComposite in="line" in2="tooth" operator="in" />
    </filter>
    <filter id="pencil-b" x="-10%" y="-25%" width="120%" height="150%">
      <feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="2" seed="17" result="wobble" />
      <feDisplacementMap in="SourceGraphic" in2="wobble" scale="4" xChannelSelector="G" yChannelSelector="R" result="line" />
      <feTurbulence type="fractalNoise" baseFrequency="0.3 0.9" numOctaves="2" seed="21" result="grain" />
      <feColorMatrix in="grain" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  2.6 0 0 0 -0.6" result="tooth" />
      <feComposite in="line" in2="tooth" operator="in" />
    </filter>
    <!-- grain only, no wobble: for pencil underlines (navbar links) -->
    <filter id="pencil-tooth" x="-5%" y="-50%" width="110%" height="200%">
      <feTurbulence type="fractalNoise" baseFrequency="0.9 0.3" numOctaves="2" seed="5" result="grain" />
      <feColorMatrix in="grain" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  2.4 0 0 0 -0.4" result="tooth" />
      <feComposite in="SourceGraphic" in2="tooth" operator="in" />
    </filter>
    <!-- a shaded fill: the same wobble as #pencil-a so its edge follows the line -->
    <filter id="pencil-fill" x="-5%" y="-20%" width="110%" height="140%">
      <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed="3" result="wobble" />
      <feDisplacementMap in="SourceGraphic" in2="wobble" scale="3" xChannelSelector="R" yChannelSelector="G" />
    </filter>
  </svg>
  <TheNavbar />
  <BrandLogo />
  <main>
    <RouterView v-slot="{ Component, route }">
      <Transition name="page" mode="out-in">
        <component :is="Component" :key="route.name" />
      </Transition>
    </RouterView>
  </main>
  <!-- the contact page is already the call to action, so it skips the footer pitch -->
  <TheFooter v-show="$route.name !== 'contact'" />
  <CookieBanner />
</template>

<style scoped>
.pencil-defs {
  position: absolute;
  width: 0;
  height: 0;
  overflow: hidden;
}

main {
  min-height: 60vh;
}
</style>
