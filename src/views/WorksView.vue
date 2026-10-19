<script setup>
import { computed, ref } from 'vue'
import { projects } from '@/data/projects'
import ProjectCard from '@/components/ProjectCard.vue'
import AppText from '@/components/ui/AppText.vue'

const categories = computed(() => [
  'All',
  ...new Set(projects.map((p) => p.category)),
])
const active = ref('All')

const shown = computed(() =>
  active.value === 'All'
    ? projects
    : projects.filter((p) => p.category === active.value),
)
</script>

<template>
  <section class="section">
    <div class="container">
      <header class="works__head scroll-drift">
        <AppText
          variant="signature"
          as="h1"
          class="works__title enter-write"
          style="--enter-delay: 60ms"
        >
          Projects
        </AppText>
      </header>

      <div class="works__filters">
        <button
          v-for="(cat, i) in categories"
          :key="cat"
          class="works__filter pencil enter-up"
          :class="{ 'is-active': active === cat }"
          :style="{ '--enter-delay': `${380 + i * 60}ms`, '--enter-y': '14px' }"
          @click="active = cat"
        >
          {{ cat }}
        </button>
      </div>

      <!-- switching filter swaps the whole grid, so the new set re-staggers in -->
      <Transition name="swap" mode="out-in">
        <div v-if="shown.length" :key="active" class="works__grid">
          <ProjectCard
            v-for="(project, i) in shown"
            :key="project.slug"
            v-reveal="i % 3"
            :project="project"
            :show-summary="false"
          />
        </div>
        <p v-else key="empty" class="works__empty">Nothing here yet.</p>
      </Transition>
    </div>
  </section>
</template>

<style scoped>
.works__head {
  max-width: 52ch;
  margin-bottom: 2.5rem;
}

.works__title {
  position: relative;
  top: -2.25rem;
  font-size: clamp(1.9rem, 4.5vw, 3rem);
  margin-bottom: 1rem;
}

.works__filters {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
  margin-bottom: 2.5rem;
}

.works__filter {
  --pencil-line: var(--color-ink-faint);
  --pencil-line-alpha: 0.7;
  padding: 0.4rem 1rem;
  border-radius: var(--radius-pill);
  border: 1px solid var(--color-border-strong);
  background: var(--pencil-tooth);
  font-weight: 600;
  font-size: 0.9rem;
  transition: all var(--transition-fast);
}

.works__filter:hover {
  --pencil-line: var(--color-ink);
  --pencil-echo: var(--color-accent);
  --pencil-echo-alpha: 0.7;
  --pencil-shift: 2px -1.5px;
}

.works__filter.is-active {
  --pencil-line: var(--color-accent-hover);
  --pencil-echo: var(--color-leaf);
  --pencil-echo-alpha: 0.6;
  background: var(--pencil-grain), var(--color-accent);
  color: var(--color-accent-ink);
  border-color: var(--color-accent);
}

.works__grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: clamp(1.5rem, 4vw, 2.5rem);
}

.works__empty {
  color: var(--color-ink-faint);
}

@media (max-width: 900px) {
  .works__grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 560px) {
  .works__grid {
    grid-template-columns: 1fr;
  }
}
</style>
