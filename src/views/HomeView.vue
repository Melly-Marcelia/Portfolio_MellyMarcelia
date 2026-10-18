<script setup>
import HeroSection from '@/components/HeroSection.vue'
import WorksCarousel from '@/components/WorksCarousel.vue'
import StatementSection from '@/components/StatementSection.vue'
import FeaturedProjects from '@/components/FeaturedProjects.vue'
</script>

<template>
  <div class="home">
    <!-- hero + carousel together fill the first screen -->
    <div class="home__landing">
      <HeroSection />
      <WorksCarousel />
    </div>
    <StatementSection />
    <FeaturedProjects />
  </div>
</template>

<style scoped>
.home__landing {
  display: flex;
  flex-direction: column;
  min-height: calc(100svh - var(--nav-h));
}

@media (max-width: 820px) {
  .home__landing {
    min-height: 0;
  }
}
</style>
