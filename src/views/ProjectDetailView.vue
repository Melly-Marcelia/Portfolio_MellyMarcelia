<script setup>
import { computed, onBeforeUnmount, reactive, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { caseStudies as projects, getProject } from '@/data/projects'
import AppText from '@/components/ui/AppText.vue'
import AppTag from '@/components/ui/AppTag.vue'
import CoverMedia from '@/components/ui/CoverMedia.vue'
import CaseVideo from '@/components/ui/CaseVideo.vue'
import ImageWithVideo from '@/components/ui/ImageWithVideo.vue'
import LuxcrimeCase from '@/components/case-studies/LuxcrimeCase.vue'
import LivioCase from '@/components/case-studies/LivioCase.vue'
import DrinketyCase from '@/components/case-studies/DrinketyCase.vue'
import WachCase from '@/components/case-studies/WachCase.vue'
import RezepeCase from '@/components/case-studies/RezepeCase.vue'
import NmbsCase from '@/components/case-studies/NmbsCase.vue'

/** Bespoke case-study layouts, keyed by project `view`. */
const customViews = { luxcrime: LuxcrimeCase, livio: LivioCase, drinkety: DrinketyCase, wach: WachCase, rezepe: RezepeCase, nmbs: NmbsCase }

const props = defineProps({
  slug: { type: String, required: true },
})

const router = useRouter()
const project = computed(() => getProject(props.slug))
const customView = computed(() => customViews[project.value?.view] || null)

if (!project.value) {
  router.replace({ name: 'not-found' })
}

const meta = computed(() => {
  if (!project.value) return []
  const p = project.value
  return [
    p.timeline && ['timeline', p.timeline],
    !p.timeline && (p.date || p.year) && ['timeline', p.date || p.year],
    p.role && ['role', p.role],
    p.tools?.length && ['tool', p.tools.join(', ')],
    p.audience && ['for', p.audience],
  ].filter(Boolean)
})

// same wording on every case study, picked from where the link points
const linkLabel = computed(() => {
  const { link, linkLabel: custom } = project.value ?? {}
  if (custom) return custom
  if (!link) return ''
  if (/figma\.com/.test(link)) return 'view prototype'
  if (/github\.com/.test(link)) return 'view code'
  return 'view live site'
})

// the row is named after where the link goes, so it doesn't clash with the repos row
const linkKey = computed(() => {
  const link = project.value?.link ?? ''
  if (/figma\.com/.test(link)) return 'figma'
  if (/github\.com/.test(link)) return 'github'
  return 'website'
})

const titleWords = computed(() => project.value?.title.split(/\s+/) ?? [])

const projectIndex = computed(() =>
  project.value ? projects.findIndex((p) => p.slug === project.value.slug) : -1,
)

function projectAt(offset) {
  if (projectIndex.value < 0 || projects.length < 2) return null
  return projects[(projectIndex.value + offset + projects.length) % projects.length]
}

const nextProject = computed(() => projectAt(1))
const prevProject = computed(() => projectAt(-1))

const pad = (n) => String(n).padStart(2, '0')

/* chaptered videos (e.g. a step-by-step walkthrough): per content block, the
   CaseVideo instance and its playback time, so the step row can seek and
   highlight the step that's playing */
const videoRefs = {}
const videoTimes = reactive({})

function activeChapter(block, i) {
  const t = videoTimes[i] ?? 0
  let active = 0
  block.chapters.forEach((c, j) => {
    if (t >= c.t) active = j
  })
  return active
}

/* floating back/next pills only show between the two real links: once the
   top "← Projects" has scrolled away, and until the "Next project" footer
   scrolls into view, so they never double up */
const topBack = ref(null)
const endNav = ref(null)
const topBackVisible = ref(true)
const endNavVisible = ref(false)
const observers = []

function watchVisible(target, flag, initial) {
  let observer = null
  watch(target, (comp) => {
    observer?.disconnect()
    flag.value = initial
    const el = comp?.$el ?? comp
    if (!el) return
    observer = new IntersectionObserver(([entry]) => {
      flag.value = entry.isIntersecting
    })
    observer.observe(el)
    observers.push(observer)
  })
}

watchVisible(topBack, topBackVisible, true)
watchVisible(endNav, endNavVisible, false)

const floatHidden = computed(() => topBackVisible.value || endNavVisible.value)

onBeforeUnmount(() => observers.forEach((o) => o.disconnect()))
</script>

<template>
  <article
    v-if="project"
    class="cs"
    :class="{ 'cs--gallery': project.gallery || customView }"
  >
    <RouterLink ref="topBack" :to="{ name: 'works' }" class="cs__back container enter-left" style="--enter-x: 24px">
      ← Projects
    </RouterLink>

    <!-- header -->
    <header class="cs__head container">
      <AppText
        v-reveal="{ words: true }"
        variant="h1"
        as="h1"
        class="cs__title"
      >
        <template v-for="(w, i) in titleWords" :key="i">
          <span class="reveal-word" :style="{ '--w': i }">{{ w }}</span>{{ ' ' }}
        </template>
      </AppText>
      <AppText
        v-if="project.summary"
        v-reveal="1"
        variant="lead"
        class="cs__summary"
        tone="soft"
      >
        {{ project.summary }}
      </AppText>
      <AppTag v-reveal="2" class="cs__tag">{{ project.category }}</AppTag>
    </header>

    <!-- cover sits between the tag and the facts row; gallery docs skip it
         because their first slice already is the hero -->
    <!-- `covers` (an array) shows several cover designs side by side instead -->
    <figure v-if="project.covers && !project.gallery" v-reveal="{ y: 36 }" class="cs__cover cs__cover--pair">
      <CoverMedia
        v-for="(c, i) in project.covers"
        :key="i"
        :src="c.src"
        :alt="c.alt || project.title"
        eager
      />
    </figure>
    <figure v-else-if="project.cover && !project.gallery" v-reveal="{ y: 36 }" class="cs__cover" :class="{ 'cs__cover--portrait': project.coverPortrait }">
      <CoverMedia
        :src="project.cover"
        :poster="project.poster"
        :alt="project.title"
        eager
        @error="(e) => (e.target.closest('.cs__cover').hidden = true)"
      />
    </figure>

    <div v-reveal class="cs__intro cs__col">
      <ul v-if="meta.length || project.link || project.repos?.length" class="cs__meta">
        <li v-for="([k, v], i) in meta" :key="i">
          <span class="cs__meta-k">{{ k }} :</span> {{ v }}
        </li>
        <li v-if="project.link">
          <span class="cs__meta-k">{{ linkKey }} :</span>&nbsp;<a
            :href="project.link"
            class="cs__link"
            target="_blank"
            rel="noopener"
            >{{ linkLabel }} ↗</a
          >
        </li>
        <li v-if="project.repos?.length">
          <span class="cs__meta-k">github :</span>&nbsp;<template v-for="(r, i) in project.repos" :key="r.href"
            ><template v-if="i">,&nbsp;</template><a :href="r.href" class="cs__link" target="_blank" rel="noopener"
              >{{ r.label }} ↗</a
            ></template
          >
        </li>
      </ul>
    </div>

    <!-- body -->
    <div v-if="project.content?.length || customView" class="cs__body">
      <template v-for="(block, i) in project.content" :key="i">
        <div v-if="block.type === 'heading'" v-reveal class="cs__col">
          <AppText variant="h3" as="h2" class="cs__h2">{{ block.text }}</AppText>
        </div>

        <div v-else-if="block.type === 'paragraph'" v-reveal class="cs__col">
          <AppText variant="body" class="cs__p" tone="soft">{{ block.text }}</AppText>
        </div>

        <div v-else-if="block.type === 'list'" v-reveal class="cs__col">
          <ul class="cs__list">
            <li v-for="(item, j) in block.items" :key="j">{{ item }}</li>
          </ul>
        </div>

        <figure
          v-else-if="block.type === 'image'"
          v-reveal="block.bare ? { y: 0 } : { y: 30 }"
          class="cs__panel"
          :class="{ 'cs__panel--bare': block.bare, 'cs__panel--portrait': block.portrait, 'cs__panel--fit': block.fit }"
        >
          <!-- zoom: big boards (journeys, story maps) open full size in a new tab -->
          <component
            :is="block.zoom ? 'a' : 'div'"
            v-bind="block.zoom ? { href: block.src, target: '_blank', rel: 'noopener', 'aria-label': `Open ${block.alt || 'image'} full size` } : {}"
            :class="{ cs__zoom: block.zoom }"
          >
            <img
              :src="block.src"
              :alt="block.alt || ''"
              loading="lazy"
              @error="(e) => (e.target.closest('.cs__panel').hidden = true)"
            />
            <span v-if="block.zoom" class="cs__zoom-hint" aria-hidden="true">open full size ↗</span>
          </component>
          <AppText v-if="block.caption" variant="caption" as="figcaption">
            {{ block.caption }}
          </AppText>
        </figure>

        <div
          v-else-if="block.type === 'images'"
          v-reveal="{ y: 30 }"
          class="cs__panel cs__pair"
          :style="{ '--n': block.items.length }"
        >
          <figure v-for="(img, j) in block.items" :key="j">
            <img :src="img.src" :alt="img.alt || ''" loading="lazy" />
            <AppText v-if="img.caption" variant="caption" as="figcaption">
              {{ img.caption }}
            </AppText>
          </figure>
        </div>

        <figure
          v-else-if="block.type === 'video'"
          v-reveal="{ y: 30 }"
          class="cs__vid"
          :class="{ 'cs__vid--portrait': block.portrait, 'cs__vid--split': block.aside }"
        >
          <div class="cs__vid-frame" :style="block.ratio && { aspectRatio: block.ratio }">
            <CaseVideo
              :ref="(c) => (videoRefs[i] = c)"
              :src="block.src"
              :poster="block.poster"
              :alt="block.alt || ''"
              @time="(t) => block.chapters && (videoTimes[i] = t)"
            />
          </div>
          <nav v-if="block.chapters" class="cs__steps" aria-label="Jump to a step in the video">
            <button
              v-for="(c, j) in block.chapters"
              :key="j"
              type="button"
              class="cs__step"
              :class="{ 'is-active': activeChapter(block, i) === j }"
              :aria-current="activeChapter(block, i) === j ? 'step' : undefined"
              @click="videoRefs[i]?.seek(c.t)"
            >
              <span class="cs__step-n">{{ j + 1 }}</span>
              {{ c.label }}
            </button>
          </nav>
          <div v-if="block.aside" class="cs__vid-aside">
            <AppText v-for="(text, j) in block.aside" :key="j" variant="body" class="cs__p" tone="soft">
              {{ text }}
            </AppText>
          </div>
          <AppText v-if="block.caption" variant="caption" as="figcaption">
            {{ block.caption }}
          </AppText>
        </figure>

        <figure v-else-if="block.type === 'embed'" v-reveal="{ y: 30 }" class="cs__vid">
          <div class="cs__embed-frame" :style="block.ratio && { aspectRatio: block.ratio }">
            <iframe
              :src="block.src"
              :title="block.title || project.title"
              loading="lazy"
              allow="fullscreen; autoplay"
              allowfullscreen
            ></iframe>
          </div>
          <AppText v-if="block.caption" variant="caption" as="figcaption">
            {{ block.caption }}
          </AppText>
        </figure>

        <figure
          v-else-if="block.type === 'imageVideo'"
          v-reveal="{ y: 30 }"
          :class="block.phone ? 'cs__phone' : 'cs__panel cs__panel--bare'"
        >
          <ImageWithVideo
            :src="block.src"
            :video="block.video"
            :poster="block.poster"
            :alt="block.alt || ''"
            :rect="block.rect"
            :radius="block.radius"
          />
          <AppText v-if="block.caption" variant="caption" as="figcaption">
            {{ block.caption }}
          </AppText>
        </figure>
      </template>

      <component :is="customView" v-if="customView" />
    </div>

    <!-- next -->
    <nav v-if="nextProject" ref="endNav" v-reveal class="container cs__next">
      <AppText variant="eyebrow" tone="faint">Next project</AppText>
      <RouterLink
        :to="{ name: 'project', params: { slug: nextProject.slug } }"
        class="cs__next-link"
      >
        <AppText variant="script">{{ nextProject.title }} →</AppText>
      </RouterLink>
    </nav>

    <!-- floating shortcuts while reading -->
    <nav class="cs__dock" :class="{ 'is-hidden': floatHidden }" aria-label="Project navigation">
      <RouterLink
        v-if="prevProject"
        :to="{ name: 'project', params: { slug: prevProject.slug } }"
        class="cs__dock-step cs__dock-step--prev"
        :aria-label="`Previous project: ${prevProject.title}`"
        :tabindex="floatHidden ? -1 : undefined"
      >
        <span class="cs__dock-arrow" aria-hidden="true">←</span>
        <span class="cs__dock-title" aria-hidden="true">{{ prevProject.title }}</span>
      </RouterLink>
      <RouterLink
        :to="{ name: 'works' }"
        class="cs__dock-index"
        aria-label="All projects"
        :tabindex="floatHidden ? -1 : undefined"
      >
        <span class="cs__dock-count">{{ pad(projectIndex + 1) }}</span>
        <span class="cs__dock-total">/ {{ pad(projects.length) }}</span>
      </RouterLink>
      <RouterLink
        v-if="nextProject"
        :to="{ name: 'project', params: { slug: nextProject.slug } }"
        class="cs__dock-step cs__dock-step--next"
        :aria-label="`Next project: ${nextProject.title}`"
        :tabindex="floatHidden ? -1 : undefined"
      >
        <span class="cs__dock-title" aria-hidden="true">{{ nextProject.title }}</span>
        <span class="cs__dock-arrow" aria-hidden="true">→</span>
      </RouterLink>
    </nav>
  </article>
  <div v-else class="cs" />
</template>

<style scoped>
.cs {
  padding-bottom: clamp(3.75rem, 10vw, 7.5rem);
}

.cs__back {
  display: block;
  padding-top: clamp(1.5rem, 4vw, 2.75rem);
  font-weight: 600;
  color: var(--color-ink-soft);
}

.cs__back:hover {
  color: var(--color-ink);
}

/* ---- header (centred) ---- */
.cs__head {
  padding-top: clamp(1.5rem, 4vw, 3rem);
  padding-bottom: clamp(1.5rem, 4vw, 3rem);
  text-align: center;
}

.cs__head .cs__title {
  font-family: var(--font-body);
  font-style: italic;
  font-weight: 700;
  font-size: clamp(2.4rem, 6vw, 4.6rem);
  line-height: 1.05;
  letter-spacing: var(--tracking-tight);
  color: var(--color-ink);
  margin-bottom: var(--space-m);
}

.cs__head .cs__summary {
  max-width: 58ch;
  margin: 0 auto var(--space-l);
  text-wrap: balance;
  color: var(--color-ink-soft);
}

/* .cs__head is text-align:center, so the inline-flex tag centres itself */

/* phones: more air under the navbar, and the summary + tag pulled up so
   they read as one block with the title */
@media (max-width: 640px) {
  .cs__back {
    padding-top: 2.25rem;
  }
  .cs__head {
    padding-top: 2.25rem;
  }
  .cs__head .cs__title {
    margin-bottom: var(--space-s);
  }
  .cs__head .cs__summary {
    margin-bottom: var(--space-s);
  }
}

/* ---- cover (full-bleed collage) ---- */
.cs__cover {
  margin: 0 auto clamp(2.5rem, 6vw, 4.5rem);
  padding-inline: var(--page-gutter);
}

.cs__cover :is(img, video) {
  display: block;
  width: 100%;
  max-width: 118.75rem;
  margin-inline: auto;
  /* never taller than the space under the navbar: shrink to fit, don't crop */
  height: auto;
  max-height: calc(100svh - var(--nav-h) - 3rem);
  object-fit: contain;
}

/* tall cover (e.g. a desktop-app screenshot): phone-ish width instead of full bleed */
.cs__cover--portrait :is(img, video) {
  max-width: 23.75rem;
}

/* two cover designs next to each other; stacked on narrow screens */
.cs__cover--pair {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: clamp(0.75rem, 2vw, 1.5rem);
  max-width: 118.75rem;
}
.cs__cover--pair :is(img, video) {
  max-height: none;
}
@media (max-width: 720px) {
  .cs__cover--pair {
    grid-template-columns: 1fr;
  }
}

/* ---- meta ---- */
.cs__intro {
  margin-bottom: clamp(2.5rem, 7vw, 5rem);
}

.cs__meta {
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem var(--space-l);
  font-size: var(--step--1);
  color: var(--color-ink-soft);
}

.cs__meta-k {
  color: var(--color-ink-faint);
}

/* prototype / live-site link — dragon-fruit magenta so it's the thing you click */
.cs__link {
  color: var(--color-accent);
  transition: color var(--transition);
}
.cs__link:hover {
  color: var(--color-accent-hover);
}

/* ---- body text ---- */
/* text blocks share the same outer box as the bare image panels, so their
   left edge lines up with the images below them */
.cs__col {
  max-width: calc(68.75rem + 2 * var(--page-gutter));
  margin-inline: auto;
  padding-inline: var(--page-gutter);
}

.cs__h2 {
  margin: clamp(2.5rem, 5vw, 3.5rem) 0 var(--space-xs);
}

.cs__p {
  margin-bottom: var(--space-s);
}

.cs__list {
  color: var(--color-ink-soft);
  padding-left: var(--space-m);
  margin: var(--space-2xs) 0 var(--space-s);
  display: grid;
  gap: var(--space-3xs);
}

/* ---- image panels (the sage mounts) ---- */
.cs__panel {
  max-width: 73.75rem;
  margin: clamp(1.5rem, 4vw, 3rem) auto;
  padding-block: clamp(1.5rem, 5.6vw, 5.25rem);
  padding-inline: clamp(1.5rem, 7.3vw, 6.875rem);
  background: var(--color-panel);
}

/* bare = image carries its own mount/background, no sage panel around it */
.cs__panel--bare {
  max-width: calc(68.75rem + 2 * var(--page-gutter));
  margin: clamp(1rem, 3vw, 2.25rem) auto;
  padding: 0 var(--page-gutter);
  background: none;
}

/* gallery layout — one continuous document sliced into seamless full-width panels */
.cs--gallery {
  padding-bottom: 0;
}

.cs--gallery .cs__body {
  margin-top: clamp(1rem, 3vw, 2rem);
}

.cs--gallery .cs__panel--bare {
  max-width: 90rem;
  margin: 0 auto;
  padding: 0;
}

/* breathing room between the intro text and the first slice */
.cs--gallery .cs__col + .cs__panel--bare {
  margin-top: clamp(2rem, 5vw, 3.5rem);
}

.cs--gallery .cs__panel--bare + .cs__panel--bare {
  margin-top: -1px; /* kill hairline seams between slices */
}

.cs--gallery .cs__next {
  margin-top: clamp(2rem, 5vw, 4rem);
  padding-block: clamp(2rem, 5vw, 4rem) clamp(3rem, 7vw, 6rem);
}

.cs__panel img {
  width: 100%;
  display: block;
}

/* mounted screens fit the space under the navbar (bare slices of a long
   document are left alone; they're meant to scroll) */
.cs__panel:not(.cs__panel--bare) img {
  height: auto;
  max-height: calc(100svh - var(--nav-h) - 3rem);
  object-fit: contain;
}

/* zoom = image links to its full-size file; a small hint shows on hover/focus */
.cs__zoom {
  position: relative;
  display: block;
  cursor: zoom-in;
}

.cs__zoom-hint {
  position: absolute;
  right: 0.75rem;
  bottom: 0.75rem;
  padding: 0.35rem 0.7rem;
  font-size: 0.8rem;
  color: var(--color-ink);
  background: var(--color-panel);
  border-radius: 62.4375rem;
  opacity: 0.85;
  transition: opacity 0.2s ease;
}

.cs__zoom:hover .cs__zoom-hint,
.cs__zoom:focus-visible .cs__zoom-hint {
  opacity: 1;
}

/* portrait = tall screenshot, capped at a phone-ish width and centred on the mount */
/* fit = capped to the screen height, centred (tall bare photos) */
.cs__panel--fit img {
  width: auto;
  max-width: 100%;
  max-height: calc(100svh - var(--nav-h) - 3rem);
  margin-inline: auto;
}

.cs__panel--portrait img {
  max-width: 23.75rem;
  margin-inline: auto;
}

/* side-by-side images on one sage mount (e.g. a pair of sketches) */
.cs__pair {
  display: grid;
  grid-template-columns: repeat(var(--n, 2), minmax(0, 1fr)); /* one column per image */
  gap: clamp(1rem, 3vw, 2.5rem);
}

.cs__pair figcaption {
  margin-top: var(--space-s);
  text-align: center;
}

@media (max-width: 640px) {
  .cs__pair {
    grid-template-columns: 1fr;
  }
}

/* ---- video blocks (campaign films sitting inline in the case study) ---- */
.cs__vid {
  max-width: calc(68.75rem + 2 * var(--page-gutter));
  margin: clamp(1.75rem, 4.5vw, 3.25rem) auto;
  padding: 0 var(--page-gutter);
}

/* in the gallery flow the design frames run edge-to-edge; give the films the
   same reach but keep a little air around them so a clip reads as "playable",
   not as another static frame */
.cs--gallery .cs__vid {
  max-width: calc(77.5rem + 2 * var(--page-gutter));
  margin-block: clamp(2rem, 5vw, 3.5rem);
}

.cs__vid-frame {
  aspect-ratio: 16 / 9;
  overflow: hidden;
  background: var(--color-scrim);
  border-radius: var(--radius-m);
}

/* step row under a chaptered video: one pill per step, the playing one filled;
   wraps on desktop, scrolls sideways on phones */
.cs__steps {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2xs);
  margin-top: var(--space-s);
}

.cs__steps + figcaption {
  margin-top: var(--space-xs);
}

.cs__step {
  display: inline-flex;
  align-items: center;
  gap: 0.5em;
  padding: 0.4em 0.95em 0.4em 0.4em;
  font: inherit;
  font-size: var(--step--1);
  font-weight: 600;
  color: var(--color-ink-soft);
  background: var(--color-surface);
  border: 1px solid var(--color-border-strong);
  border-radius: var(--radius-pill);
  cursor: pointer;
  transition:
    background var(--transition-fast),
    color var(--transition-fast),
    border-color var(--transition-fast);
}

.cs__step-n {
  display: grid;
  place-items: center;
  width: 1.8em;
  height: 1.8em;
  border-radius: 50%;
  color: var(--color-accent-strong);
  background: var(--color-accent-soft);
  font-variant-numeric: tabular-nums;
}

.cs__step:hover {
  color: var(--color-ink);
  border-color: var(--color-accent);
}

.cs__step:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 2px;
}

.cs__step.is-active {
  color: var(--color-accent-ink);
  background: var(--color-accent);
  border-color: var(--color-accent);
}

.cs__step.is-active .cs__step-n {
  color: var(--color-accent);
  background: var(--color-accent-ink);
}

@media (max-width: 640px) {
  .cs__steps {
    flex-wrap: nowrap;
    overflow-x: auto;
    scrollbar-width: none;
    margin-inline: calc(-1 * var(--page-gutter));
    padding-inline: var(--page-gutter);
  }

  .cs__step {
    flex: none;
  }
}

/* live site embed — scrolls inside its own frame */
.cs__embed-frame {
  aspect-ratio: 16 / 10;
  max-height: 85vh;
  overflow: hidden;
  background: var(--color-scrim);
  border: var(--border-card);
  border-radius: var(--radius-m);
}
.cs__embed-frame iframe {
  display: block;
  width: 100%;
  height: 100%;
  border: 0;
}

.cs__vid--portrait .cs__vid-frame {
  aspect-ratio: 9 / 16;
  max-width: 23.75rem;
  margin-inline: auto;
}

/* split = video on the left, its description on the right; stacks on phones */
.cs__vid--split {
  display: grid;
  grid-template-columns: minmax(0, 21.25rem) minmax(0, 1fr);
  grid-template-areas:
    'media text'
    'cap   text';
  column-gap: clamp(1.5rem, 5vw, 4.5rem);
  align-items: center;
}

.cs__vid--split .cs__vid-frame {
  grid-area: media;
  width: 100%;
}

.cs__vid--split figcaption {
  grid-area: cap;
  margin-top: var(--space-xs);
  text-align: center;
}

.cs__vid-aside {
  grid-area: text;
  max-width: 52ch;
}

@media (max-width: 720px) {
  .cs__vid--split {
    grid-template-columns: minmax(0, 1fr);
    grid-template-areas:
      'media'
      'cap'
      'text';
  }

  .cs__vid--split .cs__vid-frame {
    max-width: 21.25rem;
  }

  .cs__vid-aside {
    margin-top: var(--space-m);
  }
}

/* phone mockup (image with a video in its screen slot) */
.cs__phone {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: clamp(2.5rem, 6vw, 4.5rem) auto;
  padding: 0 var(--page-gutter);
}

.cs__phone :deep(.iwv) {
  width: min(18.75rem, 74vw);
  filter: drop-shadow(0 1.875rem 3.4375rem rgba(20, 14, 16, 0.28));
}

.cs__phone figcaption {
  margin-top: var(--space-m);
  text-align: center;
}


.cs__panel figcaption {
  margin-top: var(--space-s);
  text-align: center;
}

/* ---- next ---- */
.cs__next {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  text-align: right;
  gap: var(--space-2xs);
  margin-top: clamp(3rem, 7vw, 5rem);
  padding-top: var(--space-l);
  border-top: var(--border-card);
}

.cs__next-link :deep(.t-script) {
  transition: color var(--transition-fast);
}

.cs__next-link:hover :deep(.t-script) {
  color: var(--color-accent);
}

/* ---- floating prev / index / next dock ---- */
/* one frosted capsule centred at the bottom: round arrow seeds either side
   of a "03 / 08" counter that links back to all projects. Hovering an arrow
   slides the neighbouring project's title out of it. */
.cs__dock {
  position: fixed;
  left: 50%;
  bottom: max(1rem, env(safe-area-inset-bottom));
  z-index: var(--z-nav);
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.3rem;
  max-width: calc(100vw - 2 * var(--page-gutter));
  font-size: var(--step--1);
  font-weight: 700;
  line-height: 1.2;
  background: color-mix(in srgb, var(--color-surface) 82%, transparent);
  backdrop-filter: blur(0.75rem);
  -webkit-backdrop-filter: blur(0.75rem);
  border: 1px solid var(--color-border-strong);
  border-radius: var(--radius-pill);
  box-shadow: var(--shadow-m);
  transform: translateX(-50%);
  transition:
    opacity var(--transition),
    transform var(--transition);
}

.cs__dock.is-hidden {
  opacity: 0;
  transform: translate(-50%, 0.875rem);
  pointer-events: none;
}

.cs__dock-step,
.cs__dock-index {
  display: inline-flex;
  align-items: center;
  min-width: 0;
  border-radius: var(--radius-pill);
  color: var(--color-ink);
  transition:
    background var(--transition-fast),
    color var(--transition-fast);
}

.cs__dock-step:focus-visible,
.cs__dock-index:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 2px;
}

.cs__dock-arrow {
  flex: none;
  display: grid;
  place-items: center;
  width: 2.4em;
  height: 2.4em;
  border-radius: 50%;
  font-size: 1.05em;
  color: var(--color-accent);
  background: var(--color-accent-soft);
  transition:
    transform 0.35s var(--ease-soft),
    background var(--transition-fast),
    color var(--transition-fast);
}

/* title tucked away at zero width until hover / focus */
.cs__dock-title {
  max-width: 0;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  opacity: 0;
  /* Homemade Apple runs wide and tall — scale it down to sit in the pill */
  font-family: var(--font-signature);
  font-size-adjust: var(--hand-size-adjust);
  -webkit-text-stroke: var(--hand-stroke) currentColor;
  font-weight: 400;
  font-size: 0.9em;
  line-height: 1.6;
  transition:
    max-width 0.4s var(--ease-soft),
    opacity var(--transition-fast),
    padding 0.4s var(--ease-soft);
}

.cs__dock-step:hover,
.cs__dock-step:focus-visible {
  color: var(--color-accent-ink);
  background: var(--color-accent);
}

.cs__dock-step:hover .cs__dock-arrow,
.cs__dock-step:focus-visible .cs__dock-arrow {
  color: var(--color-accent);
  background: var(--color-accent-ink);
}

.cs__dock-step:hover .cs__dock-title,
.cs__dock-step:focus-visible .cs__dock-title {
  max-width: 14rem;
  opacity: 1;
}

.cs__dock-step--prev:hover .cs__dock-title,
.cs__dock-step--prev:focus-visible .cs__dock-title {
  padding: 0 1rem 0 0.6rem;
}

.cs__dock-step--next:hover .cs__dock-title,
.cs__dock-step--next:focus-visible .cs__dock-title {
  padding: 0 0.6rem 0 1rem;
}

.cs__dock-step--prev:hover .cs__dock-arrow {
  transform: translateX(-2px);
}

.cs__dock-step--next:hover .cs__dock-arrow {
  transform: translateX(2px);
}

/* centre counter: doubles as the way back to all projects */
.cs__dock-index {
  flex: none;
  gap: 0.35em;
  padding: 0.45em 0.9em;
  font-variant-numeric: tabular-nums;
}

.cs__dock-total {
  color: var(--color-ink-faint);
  font-weight: 600;
}

.cs__dock-index:hover {
  background: var(--color-accent-soft);
  color: var(--color-accent);
}

.cs__dock-index:hover .cs__dock-total {
  color: inherit;
}

/* touch screens have no hover: keep it to arrows + counter */
@media (hover: none) {
  .cs__dock-title {
    display: none;
  }

  .cs__dock-step:hover {
    color: inherit;
    background: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .cs__dock {
    transition: opacity var(--transition);
  }

  .cs__dock.is-hidden {
    transform: translateX(-50%);
  }

  .cs__dock-title {
    transition: opacity var(--transition-fast);
  }

  .cs__dock-step:hover .cs__dock-arrow {
    transform: none;
  }
}

@media (max-width: 640px) {
  .cs__back {
    position: static;
    display: block;
    margin-bottom: var(--space-m);
  }
}
</style>
