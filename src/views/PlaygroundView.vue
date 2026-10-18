<script setup>
/**
 * Playground — three "pages" off a craft desk, with paper index tabs under
 * the title:
 *   1. interactive 3D art gallery   (data/artworks.js)
 *   2. what I bring to the table    (data/stickers.js — draggable stickers)
 *   3. scrapbook flip book          (data/scrapbook.js)
 *
 * Each section opens with a big outlined hand-written numeral, its title on
 * a strip of washi tape and a pencilled margin note whose arrow points down
 * at the piece. Sections alternate sides; a doodled squiggle sits between.
 */
import AppText from '@/components/ui/AppText.vue'
import ArtGallery3D from '@/components/ArtGallery3D.vue'
import StickerBoard from '@/components/StickerBoard.vue'
import ScrapbookFlip from '@/components/ScrapbookFlip.vue'
import { artworks } from '@/data/artworks'
import { stickers } from '@/data/stickers'
import { scrapbook } from '@/data/scrapbook'

const sections = [
  {
    id: 'gallery',
    no: '01',
    title: 'Art gallery',
    tab: 'spin',
    body: 'My drawings and paintings, collected over the years',
    note: 'drag to spin & tap a piece to view',
    noteCenter: true,
  },
  {
    id: 'skills',
    no: '02',
    title: 'What I bring to the table',
    tab: 'drag',
    body: 'The skills I pack for every project',
    note: 'pick them up and move them around',
  },
  {
    id: 'scrapbook',
    no: '03',
    title: 'Scrapbook',
    tab: 'flip',
    body: "Bits and pieces I've collected along the way",
    note: 'turn the pages',
  },
]

// seed speckles for the dragon-fruit slice pinned to each index tab [x, y, angle]
const seeds = [
  [13.7, 19.9, 51],
  [12.8, 23.4, 10],
  [16.9, 23.5, 16],
  [36.2, 32.2, -24],
  [25.8, 19.4, 23],
  [27.4, 23.6, 56],
  [14.0, 15.1, -41],
  [22.0, 23.6, -53],
  [24.4, 31.2, -56],
  [13.5, 28.1, 41],
  [17.9, 14.1, -5],
  [32.7, 23.9, 59],
  [20.0, 9.4, -22],
  [30.0, 15.4, -14],
  [33.3, 10.8, -60],
  [30.4, 20.0, -4],
  [10.9, 33.8, -51],
  [26.3, 11.1, -28],
  [21.6, 28.2, 56],
  [30.6, 28.9, -53],
  [30.5, 37.2, 7],
  [28.0, 34.3, 28],
  [20.3, 19.3, -46],
  [19.1, 37.9, 46],
  [18.0, 28.7, 43],
  [27.8, 40.0, -29],
  [17.5, 19.2, -15],
  [34.7, 21.2, -2],
  [28.0, 29.8, 49],
  [24.0, 38.9, -37],
  [37.2, 18.8, -36],
  [35.9, 13.2, 12],
  [21.7, 16.3, -29],
  [15.9, 26.9, -53],
  [32.5, 33.2, -17],
  [39.5, 22.1, 19],
  [12.2, 17.1, -43],
  [40.0, 26.2, 16],
  [22.6, 12.6, -22],
  [38.7, 31.5, 6],
  [26.7, 13.7, 44],
  [37.2, 23.4, 46],
  [25.4, 35.4, 24],
  [21.3, 39.9, -40],
  [22.3, 34.9, -34],
  [16.5, 16.5, -1],
  [8.4, 28.8, -51],
  [23.1, 20.8, 8],
  [25.5, 25.7, -5],
  [36.2, 15.8, -50],
  [18.3, 25.7, 15],
  [33.0, 15.4, 36],
  [29.8, 11.3, 17],
  [8.1, 20.2, 35],
  [15.1, 36.4, -50],
  [9.6, 25.1, -57],
  [28.5, 17.9, 56],
  [14.4, 30.9, 36],
  [36.6, 29.5, 5],
  [18.2, 31.4, 14],
]
</script>

<template>
  <div class="pg">
    <section class="section pg__intro">
      <div class="container">
        <header class="pg__lede scroll-drift">
          <AppText
            variant="signature"
            as="h1"
            class="pg__title enter-write"
            style="--enter-delay: 60ms"
          >
            Playground
          </AppText>
          <AppText
            variant="lead"
            class="pg__lead enter-left"
            style="--enter-delay: 220ms"
          >
            Experiments, visual studies and things made just for fun.
          </AppText>
        </header>

        <!-- paper index tabs, like the dividers in a ring binder -->
        <nav class="pg__tabs" aria-label="Playground sections">
          <!-- tabs drop onto the desk one after another -->
          <RouterLink
            v-for="(s, k) in sections"
            :key="s.id"
            :to="{ hash: `#${s.id}` }"
            class="pg__tab enter-up"
            :style="{ '--enter-delay': `${420 + k * 110}ms`, '--enter-y': '-36px' }"
          >
            <!-- a slice of dragon fruit holding the tab down -->
            <svg class="pg__fruit" viewBox="0 0 48 48" aria-hidden="true">
              <circle cx="24" cy="24" r="22.5" class="pg__fruit-rind" />
              <circle cx="24" cy="24" r="19" class="pg__fruit-flesh" />
              <ellipse
                v-for="([x, y, a], k) in seeds"
                :key="k"
                :cx="x"
                :cy="y"
                rx="0.9"
                ry="0.55"
                :transform="`rotate(${a} ${x} ${y})`"
                class="pg__fruit-seed"
              />
            </svg>
            <span class="pg__tab-no">{{ s.no }}</span>
            <span class="pg__tab-title">{{ s.title }}</span>
            <span class="pg__tab-verb">{{ s.tab }} &rarr;</span>
          </RouterLink>
        </nav>
      </div>
    </section>

    <section
      v-for="(s, i) in sections"
      :id="s.id"
      :key="s.id"
      class="section pg__section"
      :class="{ 'pg__section--flip': i % 2 === 1 }"
    >
      <div class="container">
        <!-- doodled squiggle instead of a ruled line -->
        <svg
          v-if="i > 0"
          v-reveal="{ y: 0 }"
          class="pg__squiggle draw-in"
          viewBox="0 0 240 24"
          aria-hidden="true"
        >
          <path
            pathLength="1"
            d="M4 14c14-12 24 10 38 0s24-12 38 0 24 10 38 0 24-12 38 0 24 10 38 0 24-10 38-2"
            fill="none"
            stroke="currentColor"
            stroke-width="2.5"
            stroke-linecap="round"
          />
        </svg>

        <header class="pg__head">
          <span v-reveal="{ blur: true, y: 40 }" class="pg__no" aria-hidden="true">{{ s.no }}</span>

          <div class="pg__label">
            <span v-reveal class="pg__tape">
              <AppText variant="h2" as="h2" class="pg__h">{{ s.title }}</AppText>
            </span>
            <AppText v-reveal="1" variant="body" tone="soft" class="pg__body">
              {{ s.body }}
            </AppText>
          </div>

          <!-- pencilled margin note, arrow curling down at the piece -->
          <p
            v-reveal="2"
            class="pg__note draw-in"
            :class="{ 'pg__note--center': s.noteCenter }"
            aria-hidden="true"
          >
            <span>{{ s.note }}</span>
            <svg class="pg__arrow" viewBox="0 0 80 90">
              <path
                pathLength="1"
                d="M10 4C40 2 62 20 58 42c-3 16-22 18-20 6 2-12 22-6 20 10-1 8-4 14-8 22"
                fill="none"
                stroke="currentColor"
                stroke-width="2.5"
                stroke-linecap="round"
              />
              <path
                pathLength="1"
                d="M48.4 69.1 50 80l9.7-5.2"
                fill="none"
                stroke="currentColor"
                stroke-width="2.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </p>
        </header>

        <ArtGallery3D v-if="s.id === 'gallery'" v-reveal="2" :items="artworks" />
        <StickerBoard v-else-if="s.id === 'skills'" v-reveal="2" :items="stickers" />
        <ScrapbookFlip v-else v-reveal="2" :pages="scrapbook" />
      </div>
    </section>
  </div>
</template>

<style scoped>
.pg__intro {
  padding-bottom: 0;
}

.pg__lede {
  max-width: 52ch;
  margin-bottom: 2.5rem;
  display: grid;
  gap: 0.75rem;
}

.pg__title {
  position: relative;
  top: -2.25rem;
  font-size: clamp(1.9rem, 4.5vw, 3rem);
}

/* ---- index tabs ------------------------------------------------------ */
.pg__tabs {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(190px, 1fr));
  gap: 1.1rem;
  max-width: 780px;
}
.pg__tab {
  --tilt: -2deg;
  position: relative;
  display: grid;
  gap: 0.15rem;
  padding: 1.9rem 1.1rem 0.9rem;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-s) var(--radius-s) var(--radius-xs) var(--radius-xs);
  box-shadow: var(--shadow-s);
  color: var(--color-ink);
  text-decoration: none;
  transform: rotate(var(--tilt));
  transition:
    transform 0.35s var(--ease-soft),
    box-shadow 0.35s var(--ease-soft);
}
.pg__tab:nth-child(2) {
  --tilt: 1.5deg;
}
.pg__tab:nth-child(3) {
  --tilt: -0.8deg;
}
/* a slice of dragon fruit pinned over each tab's top edge — a real fruit,
   so its colours stay put in dark mode (like the device mockups) */
.pg__fruit {
  position: absolute;
  top: -22px;
  left: 50%;
  width: 44px;
  height: 44px;
  translate: -50% 0;
  rotate: calc(var(--tilt) * -6);
  filter: drop-shadow(0 2px 2px rgba(var(--c-seed-rgb), 0.18));
  transition: rotate 0.5s var(--ease-soft);
}
.pg__fruit-rind {
  fill: #e01e6e;
}
.pg__fruit-flesh {
  fill: #fffdfb;
  stroke: #f7b5d0;
  stroke-width: 1.2;
}
.pg__fruit-seed {
  fill: #1a1517;
}
.pg__tab:hover .pg__fruit,
.pg__tab:focus-visible .pg__fruit {
  rotate: 25deg;
}
.pg__tab:hover,
.pg__tab:focus-visible {
  transform: rotate(0deg) translateY(-4px);
  box-shadow: var(--shadow-m);
}
.pg__tab-no {
  font-family: var(--font-hand);
  font-size-adjust: var(--hand-size-adjust);
  -webkit-text-stroke: var(--hand-stroke) currentColor;
  font-size: var(--step-1);
  line-height: 1;
  color: var(--color-accent);
}
.pg__tab-title {
  font-weight: 700;
  line-height: var(--leading-snug);
}
.pg__tab-verb {
  margin-top: 0.35rem;
  font-size: var(--step--1);
  color: var(--color-ink-faint);
  transition: color 0.2s var(--ease);
}
.pg__tab:hover .pg__tab-verb,
.pg__tab:focus-visible .pg__tab-verb {
  color: var(--color-accent);
}

/* ---- section openers ------------------------------------------------- */
.pg__section {
  scroll-margin-top: var(--nav-h);
}

.pg__squiggle {
  display: block;
  width: 180px;
  height: 18px;
  /* sits dead centre between two sections: the space above it is the previous
     section's bottom padding + this one's top padding (2 × the .section
     padding), so the margin below matches that */
  margin: 0 auto calc(2 * clamp(40px, 6vw, 88px));
  color: var(--color-border-strong);
}

.pg__head {
  position: relative;
  display: grid;
  grid-template-columns: auto minmax(0, 52ch) 1fr;
  align-items: end;
  column-gap: 1.5rem;
  margin-bottom: 2.5rem;
}

/* giant outlined numeral, hand-lettered */
.pg__no {
  font-family: var(--font-hand);
  font-size-adjust: var(--hand-size-adjust);
  -webkit-text-stroke: var(--hand-stroke) currentColor;
  font-size: clamp(4.5rem, 11vw, 8.5rem);
  line-height: 0.8;
  color: transparent;
  -webkit-text-stroke: 1.5px var(--color-accent);
  user-select: none;
}

.pg__label {
  display: grid;
  gap: 0.9rem;
  justify-items: start;
}

/* title stuck down on a strip of washi tape */
.pg__tape {
  display: inline-block;
  padding: 0.25em 0.8em 0.3em;
  background:
    repeating-linear-gradient(
      -45deg,
      transparent 0 8px,
      rgba(255, 255, 255, 0.35) 8px 14px
    ),
    var(--color-accent-soft);
  clip-path: polygon(1% 8%, 4% 0, 97% 4%, 100% 14%, 98% 92%, 100% 100%, 3% 96%, 0 86%);
  rotate: -1.5deg;
}
.pg__h {
  color: var(--color-accent-strong);
}

.pg__body {
  max-width: 52ch;
}

/* pencilled margin note */
.pg__note {
  justify-self: end;
  display: flex;
  align-items: flex-start;
  gap: 0.25rem;
  margin: 0;
  font-family: var(--font-hand);
  font-size-adjust: var(--hand-size-adjust);
  -webkit-text-stroke: var(--hand-stroke) currentColor;
  font-size: var(--step--1);
  color: var(--color-ink-soft);
  rotate: 4deg;
}
.pg__note span {
  padding-top: 0.2rem;
  white-space: nowrap;
}
.pg__arrow {
  width: 56px;
  height: 64px;
  flex: none;
  color: var(--color-accent);
  transition: translate 0.4s var(--ease-soft);
}
.pg__section:hover .pg__arrow {
  translate: 0 6px;
}

/* every other section mirrors: numeral on the right, note on the left */
.pg__section--flip .pg__head {
  grid-template-columns: 1fr minmax(0, 52ch) auto;
}
.pg__section--flip .pg__no {
  order: 3;
}
.pg__section--flip .pg__label {
  order: 2;
  justify-items: end;
  text-align: right;
}
.pg__section--flip .pg__tape {
  rotate: 1.5deg;
}
.pg__section--flip .pg__note {
  order: 1;
  justify-self: start;
  flex-direction: row-reverse;
  rotate: -4deg;
}
.pg__section--flip .pg__arrow {
  scale: -1 1;
}

/* gallery: the note gets its own row, centred, so the arrow drops onto the ring */
.pg__note--center {
  /* the arrow dips into the gallery stage — keep it painted above it */
  position: relative;
  z-index: 2;
  grid-column: 1 / -1;
  justify-self: center;
  margin-top: 1.25rem;
  margin-bottom: -1.5rem;
  rotate: -2deg;
  translate: 10rem 3rem;
}

@media (max-width: 760px) {
  .pg__head,
  .pg__section--flip .pg__head {
    grid-template-columns: auto minmax(0, 1fr);
    row-gap: 1rem;
  }
  .pg__section--flip .pg__no {
    order: 0;
  }
  .pg__section--flip .pg__label {
    order: 0;
    justify-items: start;
    text-align: left;
  }
  .pg__note,
  .pg__section--flip .pg__note {
    grid-column: 1 / -1;
    justify-self: end;
    flex-direction: row;
    rotate: 3deg;
  }
  .pg__note--center {
    justify-self: center;
    translate: 2rem 1rem;
  }
  .pg__note--center span {
    white-space: normal;
    max-width: 16ch;
  }
  .pg__section--flip .pg__arrow {
    scale: 1 1;
  }
}

@media (prefers-reduced-motion: reduce) {
  .pg__tab,
  .pg__fruit,
  .pg__arrow {
    transition: none;
  }
}
</style>
