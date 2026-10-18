<script setup>
import TheNavbar from '@/components/TheNavbar.vue'
import BrandLogo from '@/components/BrandLogo.vue'
import TheFooter from '@/components/TheFooter.vue'
import CookieBanner from '@/components/CookieBanner.vue'
</script>

<template>
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
main {
  min-height: 60vh;
}
</style>
