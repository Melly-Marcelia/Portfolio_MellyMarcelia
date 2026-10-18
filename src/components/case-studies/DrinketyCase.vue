<script setup>
/**
 * Drinkety: case study.
 *
 * Layout borrows the rhythm of a Behance-style app case study (huge display
 * headings, hairline grid cells, things floating around the phones, tinted
 * phone panels, a staggered process, a type specimen and palette circles) but
 * dresses it in Drinkety's own world: maroon, pastel pink, blue and cream, the
 * app's typewriter face (Courier New), and the real die-cut drink stickers,
 * postage stamps and wax seals instead of illustrations.
 *
 *  · Screens: 1170×2532 exports of the running app; the phone frame is CSS.
 *  · Stickers / stamps / photos: copied from the Drinkety repo (src/assets/
 *    drinks, stamps, photos), resized into public/assets/works/drinkety/.
 *  · Names and captions match src/data/milestones.js and photoDetails.js there.
 *
 * The page header, cover and facts row come from
 * src/data/projects.js.
 */
import { computed, ref } from 'vue'

const A = '/assets/works'
const K = `${A}/drinkety`

const sticker = (day) => `${K}/sticker-09-${day}.webp`

// floating around the "about" phone; x/y in % of the stage, r = tilt
const aboutFloat = [
  { src: sticker('15'), x: 4, y: 8, r: -12, w: 22 },
  { src: sticker('22'), x: 76, y: 2, r: 10, w: 19 },
  { src: sticker('24'), x: 80, y: 66, r: -6, w: 18 },
  { src: sticker('06'), x: 2, y: 70, r: 8, w: 18 },
]

// polaroids = the camera roll the app replaces (captions from photoDetails.js)
const polaroids = [
  { src: `${K}/photo-01.jpg`, name: 'Luckin Spring', r: -6 },
  { src: `${K}/photo-03.jpg`, name: 'Loewe', r: 4 },
  { src: `${K}/photo-02.jpg`, name: 'Polite Society x Salty Horse', r: -2 },
  { src: `${K}/photo-04.jpg`, name: 'Chloé Café', r: 6 },
]

// the sticker rain over the calendar; x/y in % of the stage, d = drop order
const rain = [
  { day: '03', x: 6, y: 6, r: -14, w: 15 },
  { day: '10', x: 22, y: 0, r: 8, w: 13 },
  { day: '12', x: 66, y: 2, r: -6, w: 12 },
  { day: '13', x: 80, y: 10, r: 12, w: 15 },
  { day: '14', x: 0, y: 34, r: 10, w: 14 },
  { day: '18', x: 84, y: 36, r: -10, w: 14 },
  { day: '23', x: 4, y: 62, r: -4, w: 16 },
  { day: '26', x: 80, y: 62, r: 6, w: 16 },
  { day: '29', x: 14, y: 84, r: 14, w: 12 },
  { day: '09', x: 72, y: 86, r: -12, w: 13, src: sticker('22') },
].map((s, i) => ({ ...s, src: s.src || sticker(s.day), d: i }))

// names from src/data/milestones.js in the app
const stamps = [
  { id: 'count-1', title: 'First Sip', goal: '1 drink' },
  { id: 'count-10', title: '10 Drinks', goal: '10 drinks' },
  { id: 'count-25', title: '25 Drinks', goal: '25 drinks' },
  { id: 'count-50', title: '50 Drinks', goal: '50 drinks' },
  { id: 'count-100', title: 'Century Club', goal: '100 drinks' },
  { id: 'count-200', title: 'Connoisseur', goal: '200 drinks' },
]

const seals = [
  { id: 'streak-3', title: '3-Day Streak' },
  { id: 'streak-7', title: 'Full Week' },
  { id: 'streak-14', title: 'Two Weeks' },
  { id: 'streak-30', title: 'Whole Month' },
]

// the original wordmark (logo.png) recoloured per tile; the PNG is only used as a mask
const logoTiles = [
  { tone: 'pink', label: 'Drinkety logo, maroon on pastel pink' },
  { tone: 'blue', label: 'Drinkety logo, maroon on pastel blue' },
  { tone: 'cream', label: 'Drinkety logo, maroon on pastel cream' },
  { tone: 'maroon', label: 'Drinkety logo, pastel pink on maroon' },
]

// the app's tokens (src/assets/main.css in the Drinkety repo)
const palette = [
  { name: 'Maroon Acai', hex: '#4C0505' },
  { name: 'Pastel Pink', hex: '#F9D5F7' },
  { name: 'Pastel Blue', hex: '#BDD4FE' },
  { name: 'Pastel Cream', hex: '#FFF4E0' },
]

// tutorial chapters; t = seconds into drinkety-howto.mp4 where each step begins
const steps = [
  { t: 0, label: 'Tap +' },
  { t: 3.4, label: 'Snap' },
  { t: 6, label: 'Sticker' },
  { t: 11.4, label: 'Details' },
  { t: 17.4, label: 'Drop' },
  { t: 21.8, label: 'Relive' },
  { t: 26.4, label: 'Stamps' },
]

const video = ref(null)
const playing = ref(true)
const current = ref(0)

const activeStep = computed(() => {
  let i = 0
  steps.forEach((s, j) => {
    if (current.value >= s.t) i = j
  })
  return i
})

function goToStep(i) {
  const v = video.value
  if (!v) return
  v.currentTime = steps[i].t
  current.value = steps[i].t
  v.play()
}

function stepBy(dir) {
  goToStep((activeStep.value + dir + steps.length) % steps.length)
}

function togglePlay() {
  const v = video.value
  if (!v) return
  v.paused ? v.play() : v.pause()
}
</script>

<template>
  <div class="dk">
    <!-- ── about ── -->
    <section class="dk-grid dk-about">
      <div class="dk-cell dk-cell--title">
        <h2 v-reveal="{ blur: true }" class="dk-display">About<br /><mark>Drinkety</mark></h2>
        <img v-reveal="2" class="dk-float dk-about__corner" :src="sticker('18')" alt="" aria-hidden="true" />
      </div>

      <!-- the app's bottom-nav icons (brews, stamps, add), copied from App.vue in the Drinkety repo -->
      <aside class="dk-cell dk-about__rail" aria-hidden="true">
        <span v-reveal class="dk-app-icon">
          <svg viewBox="0 0 24 24">
            <path d="M13.4 5.7 15.4 1.8" />
            <path d="M6.4 8.5Q6.4 5.7 12 5.7T17.6 8.5Z" />
            <path d="M6.4 8.5 7.7 19.8Q7.85 21 9 21h6q1.15 0 1.3-1.2l1.3-11.3" />
            <path d="M7.1 13.5Q9.5 12.6 12 13.5T16.9 13.5" />
            <g fill="currentColor" stroke="none">
              <circle cx="9.8" cy="18.4" r="1" />
              <circle cx="12" cy="18.8" r="1" />
              <circle cx="14.2" cy="18.4" r="1" />
              <circle cx="10.9" cy="16.4" r="1" />
              <circle cx="13.1" cy="16.4" r="1" />
            </g>
          </svg>
        </span>
        <span v-reveal="1" class="dk-app-icon">
          <svg viewBox="0 0 24 24">
            <circle cx="12" cy="9" r="5.3" />
            <circle cx="12" cy="9" r="2" />
            <path d="M8.8 13.2 7 21 12 18.3 17 21 15.2 13.2" />
          </svg>
        </span>
        <span v-reveal="2" class="dk-app-icon">
          <svg viewBox="0 0 24 24">
            <path d="M12 4v16M4 12h16" />
          </svg>
        </span>
      </aside>

      <div class="dk-cell dk-about__copy">
        <p v-reveal class="dk-body">
          Drinkety is a drink diary for people who photograph their drinks. It keeps every drink you
          log in one place, so a month of iced lattes and matchas becomes something you actually want
          to look back at.
        </p>
      </div>

      <div class="dk-cell dk-about__stage">
        <div class="dk-ring" aria-hidden="true" />
        <figure v-reveal="{ y: 40 }" class="dk-phone dk-about__phone">
          <img :src="`${A}/drinkety-detail.jpg`" alt="Drinkety drink card: a matcha sticker from The Matcha Kyoto, marked as a favourite" loading="lazy" />
        </figure>
        <img
          v-for="(f, i) in aboutFloat"
          :key="f.src"
          v-reveal="i + 1"
          class="dk-float"
          :src="f.src"
          alt=""
          aria-hidden="true"
          :style="{ left: `${f.x}%`, top: `${f.y}%`, width: `${f.w}%`, rotate: `${f.r}deg` }"
        />
      </div>
    </section>

    <!-- ── the problem ── -->
    <section class="dk-grid dk-problem">
      <div class="dk-cell dk-problem__head">
        <h2 v-reveal="{ blur: true }" class="dk-display">Lost in the<br /><mark class="is-blue">camera roll</mark></h2>
      </div>
      <div class="dk-cell dk-problem__stat">
        <p v-reveal class="dk-lead">
          Drink photos get taken, <span class="dk-soft">then buried between screenshots or
          in a story archive nobody scrolls back through.</span>
        </p>
      </div>

      <div class="dk-cell dk-problem__tags">
        <div v-reveal>
          <span class="dk-tag">The problem</span>
          <p class="dk-body">
            Every fun drink is a little moment worth romanticizing: the shop you found by accident, the
            matcha you still think about, the weird seasonal flavour you had to try. But the camera roll
            treats it like any other photo, and the moment fades.
          </p>
        </div>
        <div v-reveal="1">
          <span class="dk-tag is-blue">What I made</span>
          <p class="dk-body">
            One place for them: a monthly calendar where each drink is cut out as a sticker and placed
            on its day, with the shop and city saved with it.
          </p>
        </div>
      </div>

      <div class="dk-cell dk-problem__roll">
        <figure
          v-for="(p, i) in polaroids"
          :key="p.src"
          v-reveal="i"
          class="dk-polaroid"
          :style="{ rotate: `${p.r}deg` }"
        >
          <img :src="p.src" :alt="`Drink photo: ${p.name}`" loading="lazy" />
          <figcaption>{{ p.name }}</figcaption>
        </figure>
      </div>
    </section>

    <!-- ── how it works ── -->
    <section class="dk-sec">
      <div class="dk-wrap">
        <div class="dk-split">
          <h2 v-reveal="{ blur: true }" class="dk-display">How it<br /><mark>works</mark></h2>
          <div v-reveal="1">
            <p class="dk-kicker">App tutorial</p>
            <h3 class="dk-h3">Logging a drink, start to finish.</h3>
          </div>
        </div>

        <figure v-reveal="{ y: 30 }" class="dk-video">
          <video
            ref="video"
            :src="`${A}/drinkety-howto.mp4`"
            :poster="`${A}/drinkety-howto.jpg`"
            autoplay
            muted
            loop
            playsinline
            aria-label="Walkthrough: snapping an iced latte, which is cut out into a die-cut sticker, given a shop and name, and dropped onto the calendar"
            @click="togglePlay"
            @play="playing = true"
            @pause="playing = false"
            @timeupdate="current = $event.target.currentTime"
          />
          <figcaption class="dk-steps">
            <button
              type="button"
              class="dk-steps__ctrl"
              :aria-label="playing ? 'Pause walkthrough' : 'Play walkthrough'"
              @click="togglePlay"
            >
              <svg v-if="playing" viewBox="0 0 16 16" aria-hidden="true">
                <rect x="3" y="2" width="3.5" height="12" rx="1" />
                <rect x="9.5" y="2" width="3.5" height="12" rx="1" />
              </svg>
              <svg v-else viewBox="0 0 16 16" aria-hidden="true"><path d="M4 2.5v11a1 1 0 0 0 1.5.86l9-5.5a1 1 0 0 0 0-1.72l-9-5.5A1 1 0 0 0 4 2.5Z" /></svg>
            </button>
            <button type="button" class="dk-steps__ctrl" aria-label="Previous step" @click="stepBy(-1)">
              <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M10.5 3 5.5 8l5 5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /></svg>
            </button>
            <ol class="dk-steps__list" aria-label="Jump to a step">
              <li v-for="(s, i) in steps" :key="s.t">
                <button
                  type="button"
                  :class="{ 'is-active': i === activeStep }"
                  :aria-current="i === activeStep ? 'step' : undefined"
                  @click="goToStep(i)"
                >
                  <span class="dk-steps__num">{{ i + 1 }}</span><span class="dk-steps__label">{{ s.label }}</span>
                </button>
              </li>
            </ol>
            <button type="button" class="dk-steps__ctrl" aria-label="Next step" @click="stepBy(1)">
              <svg viewBox="0 0 16 16" aria-hidden="true"><path d="m5.5 3 5 5-5 5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /></svg>
            </button>
          </figcaption>
        </figure>
      </div>
    </section>

    <!-- ── sticker rain over the calendar ── -->
    <section class="dk-paper">
      <div class="dk-wrap dk-rain-wrap">
        <p v-reveal class="dk-kicker">The sticker calendar</p>
        <h3 v-reveal class="dk-h3">Every day is blank until you sip something fun.</h3>
        <div v-reveal class="dk-rain">
          <figure class="dk-phone dk-rain__phone">
            <img :src="`${A}/drinkety-home.jpg`" alt="The calendar after a month of logging: most days carry a drink sticker" loading="lazy" />
          </figure>
          <img
            v-for="s in rain"
            :key="s.day"
            class="dk-drop"
            :src="s.src"
            alt=""
            aria-hidden="true"
            :style="{ left: `${s.x}%`, top: `${s.y}%`, width: `${s.w}%`, rotate: `${s.r}deg`, '--d': s.d }"
          />
        </div>
      </div>
    </section>

    <!-- ── stamps & seals (maroon) ── -->
    <section class="dk-band">
      <div class="dk-wrap">
        <div class="dk-split">
          <h2 v-reveal="{ blur: true }" class="dk-display"><mark>Milestones</mark></h2>
          <p v-reveal="1" class="dk-body">
            Instead of badges and progress bars, rewards look like things you’d collect in a real
            stamp book. Drink milestones unlock illustrated postage stamps; keeping a streak going
            presses a wax seal.
          </p>
        </div>

        <ul class="dk-stamps" aria-label="Milestone stamps">
          <li v-for="(s, i) in stamps" :key="s.id" v-reveal="i % 3">
            <img :src="`${K}/stamp-${s.id}.webp`" :alt="`${s.title} stamp`" loading="lazy" />
            <strong>{{ s.title }}</strong>
            <small>{{ s.goal }}</small>
          </li>
        </ul>

        <ul class="dk-seals" aria-label="Streak seals">
          <li v-for="(s, i) in seals" :key="s.id" v-reveal="i">
            <img :src="`${K}/stamp-${s.id}.webp`" :alt="`${s.title} wax seal`" loading="lazy" />
            <span>{{ s.title }}</span>
          </li>
        </ul>
      </div>
    </section>

    <!-- ── the brand: logo sheet, then type ── -->
    <section class="dk-grid dk-brand">
      <div class="dk-cell dk-brand__head">
        <h2 v-reveal="{ blur: true }" class="dk-display">The<br /><mark class="is-blue">brand</mark></h2>
      </div>

      <!-- brand sheet: the logo on each palette colour, then the swatches -->
      <div v-reveal="{ y: 30 }" class="dk-cell dk-sheet" aria-label="Drinkety brand sheet">
        <div v-for="t in logoTiles" :key="t.tone" class="dk-sheet__tile" :class="`dk-sheet__tile--${t.tone}`">
          <span class="dk-logo" role="img" :aria-label="t.label" />
        </div>
        <ul class="dk-sheet__palette" aria-label="Colour palette">
          <li v-for="c in palette" :key="c.hex">
            <svg viewBox="0 0 100 92" aria-hidden="true">
              <path
                :fill="c.hex"
                d="M28 6C44-2 70 2 86 8c14 6 14 22 8 34-6 13-20 12-30 18S46 88 30 90 4 76 2 60 12 14 28 6Z"
              />
            </svg>
            <strong>{{ c.name }}</strong>
            <code>{{ c.hex }}</code>
          </li>
        </ul>
      </div>

      <div class="dk-cell dk-type">
        <div class="dk-type__weights" aria-hidden="true">
          <span>Aa<small>Regular</small></span>
          <span class="is-bold">Aa<small>Bold</small></span>
        </div>
        <div v-reveal class="dk-type__spec">
          <p class="dk-type__name">Courier New</p>
          <p class="dk-type__chars">ABCDEFGHIJKLMNOPQRSTUVWXYZ<br />abcdefghijklmnopqrstuvwxyz<br />0123456789 !?&amp;@#</p>
          <ul class="dk-type__tags">
            <li>Typewriter</li>
            <li>Monospace</li>
            <li>Diary-like</li>
          </ul>
        </div>
      </div>
    </section>

    <!-- ── closing (maroon) ── -->
    <section class="dk-band dk-close">
      <img class="dk-float dk-close__l" :src="sticker('06')" alt="" aria-hidden="true" />
      <img class="dk-float dk-close__r" :src="sticker('29')" alt="" aria-hidden="true" />
      <div class="dk-wrap">
        <img v-reveal="{ blur: true }" class="dk-close__logo" :src="`${K}/logo.png`" alt="Drinkety" />
        <p v-reveal="1" class="dk-close__line">Thanks for scrolling. Cheers!</p>
      </div>
    </section>
  </div>
</template>

<style scoped>
/* ───────────── Drinkety world ───────────── */
.dk {
  --maroon: #4c0505;
  --maroon-2: #6b1416;
  --pink: #f9d5f7;
  --blue: #bdd4fe;
  --cream: #fff4e0;
  --ink: #4c0505;
  --soft: rgba(76, 5, 5, 0.72);
  --faint: rgba(76, 5, 5, 0.5);
  --line: rgba(76, 5, 5, 0.14);
  --type: 'Courier New', Courier, monospace;
  --max: 70rem;
  --sec: clamp(4.5rem, 10vw, 8rem);

  margin-top: clamp(1rem, 3vw, 2rem);
  background: var(--cream);
  color: var(--ink);
  overflow-x: clip;
}

.dk-wrap {
  position: relative;
  max-width: calc(var(--max) + 2 * var(--page-gutter));
  margin-inline: auto;
  padding-inline: var(--page-gutter);
}

.dk-sec {
  padding-block: var(--sec);
}

.dk-split {
  display: grid;
  grid-template-columns: minmax(0, 1.2fr) minmax(0, 1fr);
  gap: clamp(1.5rem, 6vw, 5rem);
  align-items: end;
  margin-bottom: clamp(2.5rem, 6vw, 4rem);
}

/* ---- hairline grid: cells divided by thin rules, like a ruled page ---- */
.dk-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  max-width: calc(var(--max) + 2 * var(--page-gutter));
  margin-inline: auto;
  border-bottom: 1px solid var(--line);
}

.dk-cell {
  position: relative;
  padding: clamp(2rem, 5vw, 3.5rem) var(--page-gutter);
  border-top: 1px solid var(--line);
}

.dk-cell + .dk-cell {
  border-left: 1px solid var(--line);
}

/* ---- type ---- */
.dk-display,
.dk-h3,
.dk-kicker,
.dk-tag,
.dk-polaroid figcaption,
.dk-stamps strong,
.dk-seals span,
.dk-type,
.dk-close__line {
  font-family: var(--type);
}

.dk-display {
  font-size: clamp(2.4rem, 1.4rem + 4.4vw, 5.6rem);
  font-weight: 700;
  line-height: 0.98;
  letter-spacing: -0.04em;
  color: var(--ink);
}

/* the highlighted word: a pastel marker swipe, like the app's selected chips */
.dk-display mark,
.dk-lead mark {
  padding: 0 0.12em;
  border-radius: 0.12em;
  background: var(--pink);
  color: inherit;
  box-decoration-break: clone;
  -webkit-box-decoration-break: clone;
}

.dk-display mark.is-blue {
  background: var(--blue);
}

.dk-h3 {
  margin-bottom: 0.8rem;
  font-size: clamp(1.4rem, 1.1rem + 1.2vw, 2rem);
  font-weight: 700;
  line-height: 1.15;
  letter-spacing: -0.02em;
  text-wrap: balance;
}

.dk-kicker {
  margin-bottom: 0.7rem;
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--faint);
}

.dk-lead {
  font-size: clamp(1.3rem, 1.05rem + 1vw, 1.9rem);
  font-weight: 600;
  line-height: 1.25;
  letter-spacing: -0.01em;
  text-wrap: balance;
}

.dk-soft {
  color: var(--faint);
}

.dk-body {
  font-size: 0.98rem;
  line-height: 1.75;
  color: var(--soft);
}

.dk-body + .dk-body {
  margin-top: 1rem;
}

.dk-tag {
  display: inline-block;
  margin-bottom: 0.8rem;
  padding: 0.35rem 0.8rem;
  border-radius: 6px;
  background: var(--pink);
  font-size: 0.95rem;
  font-weight: 700;
}

.dk-tag.is-blue {
  background: var(--blue);
}

/* ---- phones ---- */
.dk-phone {
  position: relative;
  z-index: 1;
  aspect-ratio: 1170 / 2532;
  border-radius: 13% / 6%;
  background: #1c0b0b;
  box-shadow:
    inset 0 0 0 1.5px #5b3a3a,
    0 2.5rem 4.375rem -1.875rem rgba(40, 0, 0, 0.55),
    0 0.875rem 1.75rem -0.875rem rgba(40, 0, 0, 0.35);
}

/* bezel = 2.4% of the phone's own width on every side. Padding % would follow
   the parent's width instead, so the screen is inset absolutely: top/bottom %
   resolve against the phone's height (2.4% × 1170/2532 ≈ 1.11%) */
.dk-phone img {
  position: absolute;
  top: 1.11%;
  left: 2.4%;
  display: block;
  width: 95.2%;
  height: 97.78%;
  object-fit: cover;
  object-position: top;
  border-radius: 11% / 5.1%;
}

/* stickers and stamps that float around things; positioned per item inline.
   rotate (not transform) carries the tilt, because v-reveal animates transform */
.dk-float {
  position: absolute;
  z-index: 2;
  height: auto;
  filter: drop-shadow(0 0.625rem 0.875rem rgba(60, 0, 0, 0.22));
  pointer-events: none;
}

/* ---- about ---- */
.dk-about {
  grid-template-columns: minmax(0, 0.32fr) minmax(0, 1fr) minmax(0, 1.15fr);
}

.dk-cell--title {
  grid-column: 1 / -1;
  padding-top: clamp(3rem, 8vw, 5.5rem);
}

.dk-about__corner {
  top: 50%;
  right: clamp(1rem, 6vw, 6rem);
  width: clamp(5.625rem, 12vw, 10rem);
  margin-top: -4rem;
  rotate: 12deg;
}

.dk-about__rail {
  display: grid;
  align-content: center;
  justify-items: center;
  gap: 1.5rem;
}

.dk-app-icon {
  display: grid;
  place-items: center;
  width: clamp(3.5rem, 6.5vw, 5rem);
  aspect-ratio: 1;
  border-radius: 28%;
  background: var(--maroon);
  color: var(--pink);
}

.dk-app-icon:nth-child(2) {
  background: var(--pink);
  color: var(--maroon);
}

.dk-app-icon:nth-child(3) {
  background: var(--blue);
  color: var(--maroon);
}

.dk-app-icon svg {
  width: 44%;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.6;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.dk-about__copy {
  align-self: stretch;
}

.dk-about__stage {
  display: grid;
  place-items: center;
  min-height: clamp(26.25rem, 48vw, 37.5rem);
  overflow: hidden;
}

.dk-ring {
  position: absolute;
  inset: 50% auto auto 50%;
  width: min(92%, 32.5rem);
  aspect-ratio: 1;
  translate: -50% -50%;
  border: 1px solid var(--line);
  border-radius: 50%;
}

.dk-about__phone {
  width: clamp(10.625rem, 18vw, 15rem);
}

/* ---- the problem ---- */
.dk-problem {
  grid-template-columns: minmax(0, 1.1fr) minmax(0, 1fr);
}

.dk-problem__stat {
  display: flex;
  align-items: end;
}

.dk-problem__tags {
  display: grid;
  gap: clamp(2rem, 4vw, 3rem);
  align-content: center;
}

.dk-problem__roll {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: clamp(1rem, 3vw, 2rem) clamp(0.75rem, 2vw, 1.5rem);
  align-content: center;
}

.dk-polaroid {
  padding: 0.55rem 0.55rem 0;
  background: #fff;
  box-shadow: 0 1rem 1.875rem -1.125rem rgba(60, 0, 0, 0.45);
}

.dk-polaroid:nth-child(even) {
  margin-top: clamp(1rem, 3vw, 2rem);
}

.dk-polaroid img {
  display: block;
  width: 100%;
  aspect-ratio: 4 / 5;
  object-fit: cover;
}

.dk-polaroid figcaption {
  padding: 0.6rem 0.2rem 0.8rem;
  font-size: 0.78rem;
  line-height: 1.3;
  color: var(--ink);
}

.dk-video video {
  display: block;
  width: 100%;
  aspect-ratio: 16 / 9;
  object-fit: cover;
  border-radius: 1.5rem;
  background: var(--maroon);
  cursor: pointer;
}

/* step chips under the walkthrough: jump to a step, prev/next, play/pause */
.dk-steps {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 1rem;
  font-family: var(--type);
}

.dk-steps__list {
  display: flex;
  flex: 1;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.4rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.dk-steps button {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  border: 1px solid var(--line);
  border-radius: 62.4375rem;
  background: transparent;
  color: var(--ink);
  font: inherit;
  font-size: 0.82rem;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.2s, color 0.2s, border-color 0.2s;
}

.dk-steps__list button {
  padding: 0.35rem 0.8rem 0.35rem 0.35rem;
}

.dk-steps__num {
  display: grid;
  place-items: center;
  width: 1.4rem;
  height: 1.4rem;
  border-radius: 50%;
  background: var(--pink);
  font-size: 0.75rem;
}

.dk-steps__list button:hover {
  border-color: var(--maroon);
}

.dk-steps__list button.is-active {
  background: var(--maroon);
  border-color: var(--maroon);
  color: var(--pink);
}

.dk-steps__list button.is-active .dk-steps__num {
  color: var(--maroon);
}

.dk-steps__ctrl {
  flex: none;
  justify-content: center;
  width: 2.3rem;
  height: 2.3rem;
}

.dk-steps__ctrl:hover {
  background: var(--maroon);
  color: var(--pink);
}

.dk-steps__ctrl svg {
  width: 0.9rem;
  height: 0.9rem;
  fill: currentColor;
}

.dk-steps button:focus-visible {
  outline: 2px solid var(--maroon);
  outline-offset: 2px;
}

/* ---- sticker rain on squared paper ---- */
.dk-paper {
  padding-block: var(--sec);
  background:
    linear-gradient(var(--line) 1px, transparent 1px) 0 0 / 2rem 2rem,
    linear-gradient(90deg, var(--line) 1px, transparent 1px) 0 0 / 2rem 2rem,
    #fffaf1;
}

.dk-rain-wrap {
  text-align: center;
}

.dk-rain-wrap .dk-h3 {
  max-width: 22ch;
  margin-inline: auto;
}

.dk-rain {
  position: relative;
  width: min(100%, 45rem);
  aspect-ratio: 1 / 1.05;
  margin: clamp(1.5rem, 4vw, 3rem) auto 0;
}

.dk-rain__phone {
  position: absolute;
  left: 50%;
  top: 6%;
  width: 40%;
  translate: -50% 0;
}

/* each sticker falls in on reveal with a little overshoot, in drop order */
.dk-drop {
  position: absolute;
  z-index: 2;
  height: auto;
  filter: drop-shadow(0 0.75rem 0.875rem rgba(60, 0, 0, 0.25));
  transition:
    translate 0.9s cubic-bezier(0.3, 1.45, 0.5, 1),
    opacity 0.4s ease;
  transition-delay: calc(0.2s + var(--d) * 90ms);
}

.dk-rain.reveal:not(.is-revealed) .dk-drop {
  translate: 0 -10rem;
  opacity: 0;
}

/* ---- stamps & seals band ---- */
.dk-band {
  position: relative;
  overflow: hidden;
  padding-block: var(--sec);
  background: var(--maroon);
  color: var(--cream);
  --ink: var(--cream);
  --soft: rgba(255, 244, 224, 0.78);
  --faint: rgba(255, 244, 224, 0.55);
  --line: rgba(255, 244, 224, 0.16);
}

.dk-band .dk-display mark {
  color: var(--maroon);
}

.dk-stamps {
  list-style: none;
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  gap: clamp(1rem, 3vw, 2rem);
}

.dk-stamps li,
.dk-seals li {
  display: grid;
  justify-items: center;
  gap: 0.35rem;
  text-align: center;
}

.dk-stamps img {
  width: 100%;
  aspect-ratio: 4 / 5;
  object-fit: contain;
  margin-bottom: 0.6rem;
  filter: drop-shadow(0 0.75rem 1rem rgba(0, 0, 0, 0.35));
  transition: rotate 0.4s cubic-bezier(0.3, 1.6, 0.5, 1), scale 0.4s;
}

.dk-stamps li:nth-child(odd) img {
  rotate: -4deg;
}

.dk-stamps li:nth-child(even) img {
  rotate: 3deg;
}

.dk-stamps li:hover img {
  rotate: 0deg;
  scale: 1.06;
}

.dk-stamps strong {
  font-size: 0.95rem;
}

.dk-stamps small {
  font-size: 0.78rem;
  color: var(--faint);
}

.dk-seals {
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: clamp(1rem, 4vw, 3rem);
  margin-top: clamp(3rem, 7vw, 4.5rem);
  padding-top: clamp(2rem, 5vw, 3rem);
  border-top: 1px dashed var(--line);
}

.dk-seals img {
  width: clamp(4.375rem, 9vw, 6.875rem);
  filter: drop-shadow(0 0.625rem 0.875rem rgba(0, 0, 0, 0.35));
}

.dk-seals span {
  font-size: 0.85rem;
  color: var(--soft);
}

/* ---- type & colour ---- */
.dk-brand {
  margin-bottom: var(--sec);
}

.dk-brand__head {
  grid-column: 1 / -1;
}

.dk-type {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  gap: clamp(1.5rem, 6vw, 5rem);
  align-items: end;
}

.dk-type__weights {
  display: flex;
  gap: 0.5rem;
  font-size: clamp(5rem, 3rem + 7vw, 9rem);
  line-height: 0.8;
  color: rgba(76, 5, 5, 0.18);
}

.dk-type__weights span {
  display: grid;
}

.dk-type__weights .is-bold {
  font-weight: 700;
  color: var(--ink);
}

.dk-type__weights small {
  margin-top: 1rem;
  font-size: 0.75rem;
  color: var(--faint);
}

.dk-type__name {
  font-size: clamp(1.8rem, 1.3rem + 2vw, 2.8rem);
  font-weight: 700;
  line-height: 1;
}

.dk-type__chars {
  margin-block: 1rem 1.25rem;
  font-size: 0.82rem;
  line-height: 1.7;
  color: var(--soft);
  overflow-wrap: anywhere;
}

.dk-type__tags {
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}

.dk-type__tags li {
  padding: 0.3rem 0.8rem;
  border-radius: 62.4375rem;
  background: var(--maroon);
  color: var(--pink);
  font-size: 0.75rem;
  font-weight: 700;
}

/* ---- brand sheet ---- */
.dk-sheet,
.dk-type {
  grid-column: 1 / -1;
}

.dk-sheet {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  padding: 0;
  overflow: hidden;
}

.dk-sheet__tile {
  display: grid;
  place-items: center;
  color: var(--maroon);
}

.dk-sheet__tile--pink {
  grid-column: 1 / -1;
  aspect-ratio: 1120 / 420;
  background: var(--pink);
}

.dk-sheet__tile--blue {
  grid-column: 1 / -1;
  aspect-ratio: 1120 / 200;
  background: var(--blue);
}

.dk-sheet__tile--cream,
.dk-sheet__tile--maroon {
  aspect-ratio: 1 / 0.86;
  background: var(--cream);
}

.dk-sheet__tile--maroon {
  background: var(--maroon);
  color: var(--pink);
}

/* the original logo file used as a mask, so only its colour changes */
.dk-logo {
  display: block;
  width: 34%;
  aspect-ratio: 459 / 131;
  background: currentColor;
  -webkit-mask: url('/assets/works/drinkety/logo.svg') center / contain no-repeat;
  mask: url('/assets/works/drinkety/logo.svg') center / contain no-repeat;
}

.dk-sheet__tile--blue .dk-logo {
  width: 24%;
}

.dk-sheet__tile--cream .dk-logo,
.dk-sheet__tile--maroon .dk-logo {
  width: 60%;
}

.dk-sheet__palette {
  grid-column: 1 / -1;
  list-style: none;
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: clamp(1rem, 3vw, 2rem);
  padding: clamp(2rem, 5vw, 3.5rem) clamp(1.5rem, 6vw, 5rem);
  background: #fff;
}

.dk-sheet__palette li {
  display: grid;
  gap: 0.25rem;
}

.dk-sheet__palette svg {
  width: min(100%, 9.375rem);
  margin-bottom: 1rem;
}

/* the cream blob would vanish on white without an edge */
.dk-sheet__palette li:last-child path {
  stroke: rgba(76, 5, 5, 0.08);
  stroke-width: 1;
}

.dk-sheet__palette strong {
  font-family: var(--font-body);
  font-size: 1rem;
  font-weight: 500;
}

.dk-sheet__palette code {
  font-family: var(--font-body);
  font-size: 1rem;
}

/* ---- closing ---- */
.dk-close {
  text-align: center;
}

.dk-close__logo {
  width: min(70%, 26.25rem);
  margin-inline: auto;
}

.dk-close__line {
  margin-top: 1.25rem;
  font-size: clamp(1rem, 0.9rem + 0.5vw, 1.3rem);
  color: var(--soft);
}

.dk-close__l {
  left: 6%;
  bottom: -2rem;
  width: clamp(5.625rem, 13vw, 11.25rem);
  rotate: -14deg;
}

.dk-close__r {
  right: 7%;
  top: 14%;
  width: clamp(4.375rem, 10vw, 8.75rem);
  rotate: 12deg;
}

/* ---- motion ---- */
@media (prefers-reduced-motion: reduce) {
  .dk-drop {
    transition: none;
  }
}

/* ---- responsive ---- */
@media (max-width: 960px) {
  .dk-split,
  .dk-grid,
  .dk-about,
  .dk-problem {
    grid-template-columns: 1fr;
  }

  .dk-split {
    align-items: start;
  }

  .dk-cell + .dk-cell {
    border-left: 0;
  }

  .dk-about__rail {
    display: flex;
    justify-content: flex-start;
    padding-block: 1.5rem;
  }

  .dk-stamps {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .dk-type {
    grid-template-columns: 1fr;
  }

  .dk-sheet__palette {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .dk-sheet__tile--pink .dk-logo {
    width: 56%;
  }

  .dk-sheet__tile--blue .dk-logo {
    width: 40%;
  }

  .dk-sheet__tile--pink {
    aspect-ratio: 4 / 2.4;
  }

  .dk-sheet__tile--blue {
    aspect-ratio: 4 / 1.3;
  }

}

@media (max-width: 600px) {
  .dk-steps__list button {
    padding: 0.2rem;
  }

  .dk-steps__label {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip-path: inset(50%);
  }

  .dk-steps__num {
    width: 1.8rem;
    height: 1.8rem;
  }

  .dk-stamps {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .dk-about__corner {
    display: none;
  }

  .dk-rain {
    aspect-ratio: 1 / 1.25;
  }

  .dk-rain__phone {
    width: 52%;
  }
}
</style>
