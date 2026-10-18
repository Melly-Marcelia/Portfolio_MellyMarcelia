<script setup>
import { featuredProjects } from '@/data/projects'
import ProjectCard from '@/components/ProjectCard.vue'
import AppText from '@/components/ui/AppText.vue'
import AppButton from '@/components/ui/AppButton.vue'
</script>

<template>
  <!-- Only renders once at least one project is flagged `featured: true`. -->
  <section v-if="featuredProjects.length" class="featured section">
    <div class="container">
      <AppText v-reveal="{ blur: true }" variant="eyebrow" class="featured__eyebrow">
        Featured Projects
      </AppText>

      <div class="featured__grid">
        <ProjectCard
          v-for="(project, i) in featuredProjects"
          :key="project.slug"
          v-reveal="i"
          :project="project"
        />
      </div>

      <div v-reveal class="featured__more">
        <AppButton :to="{ name: 'works' }">View all projects</AppButton>
      </div>
    </div>
  </section>
</template>

<style scoped>
.featured {
  background: var(--color-bg-alt);
}

/* roomier side padding than the rest of the site */
.featured .container {
  padding-inline: clamp(24px, 9vw, 160px);
}

.featured__eyebrow {
  display: block;
  text-align: center;
  font-size: clamp(1.05rem, 1.6vw, 1.35rem);
  letter-spacing: 0.13em;
  color: var(--color-ink);
  margin-bottom: clamp(2rem, 5vw, 3.5rem);
}

/* always two cards per row; drops to one column on narrow screens */
.featured__grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: clamp(var(--space-m), 4vw, var(--space-xl));
  max-width: calc(2 * 520px + var(--space-xl));
  margin-inline: auto;
}

@media (max-width: 720px) {
  .featured__grid {
    grid-template-columns: 1fr;
  }
}

.featured__more {
  display: flex;
  justify-content: center;
  margin-top: clamp(2rem, 5vw, 3.5rem);
}
</style>
