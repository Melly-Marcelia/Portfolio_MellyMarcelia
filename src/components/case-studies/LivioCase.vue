<script setup>
/**
 * Livio: case study.
 *
 * Calm "brand world" layout: one cream page ending on a Livio-yellow closing
 * band, a serif headline voice over Poppins, and
 * the bee-wing mark only on that closing band. The app is shown as alternating feature rows of
 * phones, and user testing as
 * before → after pairs with the team's sticky notes.
 *
 *  · Screens: plain 390×844 exports (@2x) from the Figma file
 *    "LIVIO BY BURT'S BEES - MELLY"; the phone frame is CSS.
 *  · Before/after pairs: pages "UI DESIGN BEFORE USER TESTING" and
 *    "UI DESIGN AFTER USER TESTING". Each sticky quotes the team's note on the
 *    FigJam page "USER TESTING RESULT" (they were stickies there too).
 *  · The mark: src/assets/livio-mark.svg, recoloured with currentColor.
 *  · Fonts: Poppins is Livio's real body face. Decors (the headline face) isn't
 *    a web font, so Fraunces (soft) stands in for it.
 *
 * The page header, cover, facts row and intro paragraph still come from
 * src/data/projects.js.
 */
import { ref, onMounted } from 'vue'
import mark from '@/assets/livio-mark.svg?raw'
import ImageLightbox from '@/components/ui/ImageLightbox.vue'

const A = '/assets/works'

const FONT_HREF =
  'https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght,SOFT@9..144,400..700,0..100&family=Poppins:wght@400;500;600&display=swap'

onMounted(() => {
  if (document.querySelector(`link[href="${FONT_HREF}"]`)) return
  const link = document.createElement('link')
  link.rel = 'stylesheet'
  link.href = FONT_HREF
  document.head.appendChild(link)
})

// `line`: an illustrative rising curve per trend (shape only, not data), in a
// 200×64 box; it draws itself in as the card reveals.
const trends = [
  { tag: 'Going mainstream', title: 'Seasonal food', text: 'Seasonal and local food is no longer niche: people link it to quality, health and sustainability.', line: 'M4 54 C 40 52, 62 46, 92 38 S 150 22, 196 10' },
  { tag: 'Reconnecting', title: 'Nature', text: 'Mindful living, time outdoors and nature-based wellbeing are becoming answers to stress and burnout.', line: 'M4 46 C 30 52, 52 40, 78 42 S 128 30, 150 24 S 182 14, 196 12' },
  { tag: 'Growing fast', title: 'Wellness apps', text: 'People already use, and pay for, digital tools that help with sleep, food and mental health.', line: 'M4 58 C 70 56, 110 50, 140 38 S 180 14, 196 6' },
]

const steps = [
  { n: '01', when: 'Semester 3 · solo', title: 'Research & concept', text: 'Company study, trend research and concept interviews.' },
  { n: '02', when: 'Semester 3 · solo', title: 'Brand & hi-fi UI', text: 'A new logo, a full design system and a clickable hi-fi prototype.' },
  { n: '03', when: 'Semester 4 · team', title: 'Testing & rework', text: 'User tests, then the UI reworked from the results.' },
  { n: '04', when: 'Semester 4 · team', title: 'Build & deploy', text: 'Frontend and backend, deployed on Vercel.' },
]

const features = [
  {
    n: 'Getting started',
    title: 'Where you live and what you’re into.',
    text: 'Onboarding asks for your location and your interests, from seasonal cooking to foraging and nature connection, so everything after it is personal to you.',
    tone: 'green',
    screens: [
      { src: `${A}/livio-location.jpg`, alt: 'Onboarding: “What’s your location?” with a current-location button and city suggestions' },
      { src: `${A}/livio-interests.jpg`, alt: 'Onboarding: “What interests you?” grid of nine seasonal interests' },
    ],
  },
  {
    n: 'For You',
    title: 'What’s in season, where you are.',
    text: 'The For You page shows the fruits, vegetables and herbs that are in season where you live, with tips on how to pick the best ones and how to store them.',
    tone: 'yellow',
    screens: [
      { src: `${A}/livio-for-you.jpg`, alt: 'For You page for Mechelen, Belgium: continue where you left off, produce in season and recommended recipes' },
      { src: `${A}/livio-rhubarb.jpg`, alt: 'Rhubarb detail page: in-season months, tips to keep it fresh and what to look for when picking' },
    ],
  },
  {
    n: 'Nourish',
    title: 'Cooking with the season.',
    text: 'Recipes are built around what’s actually available right now. Instead of hunting for specific ingredients, you cook with what’s already in season, which makes seasonal eating easier to keep up. Anything you save lands in your collections.',
    tone: 'green',
    screens: [
      { src: `${A}/livio-recipe.jpg`, alt: 'Recipe page for a fresh strawberry salad with in-season ingredients' },
      { src: `${A}/livio-guide-store.jpg`, alt: 'Guide: how to store fresh food' },
    ],
  },
  {
    n: 'Activities',
    title: 'Things to do this season, booked in the app.',
    text: 'Livio suggests activities that fit both the season and your location, and you can book them straight from the app. Your profile keeps track of your activities and bookings.',
    tone: 'yellow',
    screens: [
      { src: `${A}/livio-activities.jpg`, alt: 'Seasonal activities page with booked activities and free nearby events' },
      { src: `${A}/livio-activity-detail.jpg`, alt: 'Activity detail for Royal Greenhouse Laeken with location, age, date and price' },
    ],
  },
]

const palette = [
  { name: 'Yellow', hex: '#FFD203', ink: '#5E504D' },
  { name: 'Red', hex: '#DB0032', ink: '#FFFFFF' },
  { name: 'Green', hex: '#B1D679', ink: '#5E504D' },
  { name: 'Brown', hex: '#5E504D', ink: '#F9ECD8' },
  { name: 'Cream', hex: '#F9ECD8', ink: '#5E504D' },
]

// brand guidelines pages (Figma "LIVIO BY BURT'S BEES - MELLY", exported @4x)
const brandSheet = [
  ['cover', 'Cover'], ['the-logo', 'The logo'], ['primary-logo', 'Primary logo'], ['structure', 'Logo structure'],
  ['clear-space', 'Clear space'], ['logo-spacing', 'Logo spacing'], ['background', 'Backgrounds'],
  ['minimum-size', 'Minimum size'], ['app-icon', 'App icon'], ['visual', 'Visual'], ['poster', 'Poster'],
  ['social-media', 'Social media'], ['social-posts', 'Social posts'], ['social-story', 'Social story'],
  ['stationery', 'Stationery'], ['business-card', 'Business card'], ['letterhead', 'Letterhead'], ['envelope', 'Envelope'],
].map(([slug, title], i) => {
  const base = `${A}/livio-brand/${String(i + 1).padStart(2, '0')}-${slug}`
  return { src: `${base}.jpg`, thumb: `${base}-thumb.jpg`, title, alt: `Brand guidelines: ${title}` }
})

const ux = [
  { src: `${A}/livio-ux-persona.png`, thumb: `${A}/livio-ux-persona-thumb.jpg`, title: 'User persona', alt: 'User persona: the seasonal living enthusiast, with interests, goals, needs, motivations and pain points' },
  { src: `${A}/livio-ux-user-map.png`, thumb: `${A}/livio-ux-user-map-thumb.jpg`, title: 'User map', alt: 'User map: seasonal living enthusiasts as external users; system admins, customer support and the Burt’s Bees brand team as internal users' },
  { src: `${A}/livio-ux-user-journey.png`, thumb: `${A}/livio-ux-user-journey-thumb.jpg`, title: 'User journey', alt: 'User journey from discovery and onboarding through the For You feed, recipes, activity booking, profile and the daily engagement loop' },
  { src: `${A}/livio-ux-story-map.png`, thumb: `${A}/livio-ux-story-map-thumb.jpg`, title: 'Story map', alt: 'Story map with activities, tasks and details sliced into Release 1, Release 2 and unplanned' },
  { src: `${A}/livio-ux-information-architecture.png`, thumb: `${A}/livio-ux-information-architecture-thumb.jpg`, title: 'Information architecture', alt: 'Information architecture diagram of Livio’s screens and how they connect' },
]

// each sticky quotes the team's note on the FigJam "USER TESTING RESULT" page
const changes = [
  {
    area: 'Navigation',
    note: 'Change the navbar',
    change: 'The floating action menu became a fixed bottom bar with four tabs: For You, Nourish, Activities and Profile.',
    before: { src: `${A}/livio-before-nourish.jpg`, alt: 'Before: Seasonal Nourish page with quick-action tiles and a floating radial menu' },
    after: { src: `${A}/livio-after-nourish.jpg`, alt: 'After: Seasonal Nourish page with produce in season, recipe filters and a four-tab bottom bar' },
  },
  {
    area: 'For You',
    note: 'Reduce clutter in the FYP. Add “where you left off”',
    change: 'The season tracker and context widgets made way for what people came for: where you left off, produce in season and recipes for this week.',
    before: { src: `${A}/livio-before-foryou.jpg`, alt: 'Before: For You page with a mid-spring tracker, seasonal context cards and a peak-today row' },
    after: { src: `${A}/livio-after-foryou.jpg`, alt: 'After: For You page with location, continue where you left off, produce in season and recommended recipes' },
  },
  {
    area: 'Seasonal produce',
    note: 'Remove colour coding (peak, ending, start)',
    change: 'Instead of decoding coloured labels, produce is simply in season or not, shown with real photos and a bookmark to save it.',
    before: { src: `${A}/livio-before-produce.jpg`, alt: 'Before: seasonal produce grid with peak labels and date ranges' },
    after: { src: `${A}/livio-after-produce.jpg`, alt: 'After: seasonal produce grid with photos, tips, recipes and bookmarks' },
  },
  {
    area: 'Activities',
    note: 'Change the title to “Your booked activities”',
    change: 'Booked activities got a clearer title and simpler cards; nearby events show the date and distance, with saving on the right.',
    before: { src: `${A}/livio-before-activities.jpg`, alt: 'Before: Seasonal Activities page with upcoming activities and ticket buttons' },
    after: { src: `${A}/livio-after-activities.jpg`, alt: 'After: Seasonal Activities page with booked activities and free nearby events' },
  },
]

// which brand page / ux diagram is open in the lightbox (null = closed)
const sheetOpen = ref(null)
const uxOpen = ref(null)

const stack = ['Vue 3', 'Vercel', 'Neon (Postgres)', 'Grok AI', 'GitHub', 'Postman']

</script>

<template>
  <div class="lv">
    <!-- ── 01 · the question: headline + trend signals, then gap → answer ── -->
    <section class="lv-sec">
      <div class="lv-wrap">
        <p v-reveal class="lv-chapter"><span>01</span> The question</p>
        <div class="lv-q">
          <h2 v-reveal class="lv-h2">
            Burt’s Bees has made lives better, naturally, for over 40 years,
            <span class="lv-soft">mostly through physical products.</span>
            What if it could help <em>beyond</em> the shelves?
          </h2>
          <div class="lv-q__signals">
            <p v-reveal class="lv-kicker">Trend research · three signals</p>
            <ol class="lv-trends">
              <li v-for="(t, i) in trends" :key="t.title" v-reveal="i" class="lv-trend">
                <span class="lv-trend__n">0{{ i + 1 }}</span>
                <div>
                  <span class="lv-trend__tag">{{ t.tag }}</span>
                  <h3>{{ t.title }}</h3>
                  <p>{{ t.text }}</p>
                </div>
                <svg class="lv-trend__chart" viewBox="0 0 200 64" aria-hidden="true">
                  <path class="lv-trend__area" :d="`${t.line} L196 64 L4 64 Z`" />
                  <path class="lv-trend__line" :d="t.line" pathLength="1" />
                </svg>
              </li>
            </ol>
          </div>
        </div>

        <!-- one joined panel: the gap flows into the answer, which carries its proof -->
        <div v-reveal class="lv-ps">
          <article class="lv-ps__card">
            <p class="lv-kicker">The gap</p>
            <p class="lv-ps__text">
              Seasonal living resonates emotionally, but people struggle to keep it up. Generic advice
              ignores where they live, and the information they need is scattered across the internet.
            </p>
          </article>
          <span class="lv-ps__arrow" aria-hidden="true">→</span>
          <article class="lv-ps__card lv-ps__card--answer">
            <p class="lv-kicker lv-kicker--red">The answer</p>
            <p class="lv-ps__text">
              One place that tells you what’s in season where you live, what to cook with it and what to
              do outside, from a brand people already trust. Burt Shavitz himself lived in rhythm with the
              seasons.
            </p>
            <div class="lv-score">
              <span class="lv-score__num">4<small>/5</small></span>
              <span class="lv-score__dots" role="img" aria-label="4 out of 5">
                <i v-for="n in 5" :key="n" :class="{ on: n <= 4 }" :style="{ '--d': n }" />
              </span>
              <p class="lv-score__text">
                average answer to <em>“How likely would you be to use an app like Livio?”</em>
                in 3 concept interviews
              </p>
            </div>
          </article>
        </div>
      </div>
    </section>

    <!-- ── 02 · the process: one timeline, split into the solo and team semesters ── -->
    <section class="lv-sec">
      <div class="lv-wrap">
        <p v-reveal class="lv-chapter"><span>02</span> The process</p>
        <div class="lv-split">
          <h2 v-reveal class="lv-h2">
            From solo <span class="lv-soft">concept</span> to team <span class="lv-soft">build.</span>
          </h2>
          <p v-reveal="1" class="lv-body">
            I shaped Livio on my own in semester 3. It was picked as one of the top 4 projects, so in
            semester 4 it became a team project with Anastasiia Kovtun and Vy Nguyen: tested with real
            users, reworked and built.
          </p>
        </div>

        <div class="lv-tl">
          <div v-reveal class="lv-tl__phases" aria-hidden="true">
            <span class="lv-tl__phase">Semester 3 · solo</span>
            <span class="lv-tl__pick">Top 4 pick</span>
            <span class="lv-tl__phase lv-tl__phase--team">Semester 4 · team</span>
          </div>
          <ol class="lv-steps">
            <li v-for="(st, i) in steps" :key="st.n" v-reveal="i" :class="{ 'is-team': i > 1 }">
              <span class="lv-steps__n">{{ st.n }}</span>
              <small>{{ st.when }}</small>
              <strong>{{ st.title }}</strong>
              <p>{{ st.text }}</p>
            </li>
          </ol>
        </div>
      </div>
    </section>

    <!-- ── 03 · the app: feature rows ── -->
    <section class="lv-sec lv-features">
      <div class="lv-wrap">
        <p v-reveal class="lv-chapter"><span>03</span> The app</p>
        <div class="lv-feature-list">
        <article
          v-for="(f, i) in features"
          :key="f.title"
          class="lv-feature"
          :class="[`lv-feature--${f.tone}`, { 'lv-feature--flip': i % 2 }]"
        >
          <div v-reveal class="lv-feature__copy">
            <p class="lv-kicker lv-kicker--red">{{ f.n }}</p>
            <h3 class="lv-h3">{{ f.title }}</h3>
            <p class="lv-body">{{ f.text }}</p>
          </div>
          <div class="lv-feature__stage">
            <figure v-for="(s, j) in f.screens" :key="s.src" v-reveal="j + 1" class="lv-phone">
              <img :src="s.src" :alt="s.alt" loading="lazy" />
            </figure>
          </div>
        </article>
        </div>
      </div>
    </section>

    <!-- ── 04 · the brand ── -->
    <section class="lv-sec">
      <div class="lv-wrap">
        <p v-reveal class="lv-chapter"><span>04</span> The brand</p>
        <div class="lv-split">
          <h2 v-reveal class="lv-h2">
            Unmistakably Burt’s Bees, <span class="lv-soft">with a mark built for</span> a small screen.
          </h2>
          <p v-reveal="1" class="lv-body">
            I kept Burt’s Bees’ typefaces (Decors and Poppins) and colour palette throughout Livio, so people
            instantly recognise it as part of the family. The existing logo doesn’t work as an app icon,
            though: at small sizes the text becomes unreadable and the hexagon adds clutter. So I designed a
            new mark from bee wings, a leaf and the beeswax hexagon.
          </p>
        </div>
        <ul class="lv-sheet" aria-label="Brand guidelines">
          <li v-for="(b, i) in brandSheet" :key="b.src" v-reveal="i % 6">
            <a :href="b.src" :title="`${b.title}: view full size`" @click.prevent="sheetOpen = i">
              <img :src="b.thumb" :alt="`Brand guidelines: ${b.title}`" loading="lazy" />
            </a>
          </li>
        </ul>
        <ImageLightbox v-model="sheetOpen" :items="brandSheet" />
        <ul v-reveal class="lv-palette" aria-label="Colour palette">
          <li v-for="c in palette" :key="c.hex" :style="{ background: c.hex, color: c.ink }">
            <span>{{ c.name }}</span>
            <code>{{ c.hex }}</code>
          </li>
        </ul>
      </div>
    </section>

    <!-- ── business model ── -->
    <section class="lv-sec lv-sec--flush">
      <div class="lv-wrap lv-split lv-split--center">
        <div v-reveal>
          <p class="lv-kicker lv-kicker--red">Business model</p>
          <h3 class="lv-h3">No ads, no selling user data, no compromises on the experience.</h3>
          <p class="lv-body lv-biz__lead">
            Livio only earns when it’s useful: people pay because it helps them live with the seasons, and
            hosts pay when Livio fills their activity.
          </p>
        </div>
        <dl v-reveal="1" class="lv-biz">
          <div>
            <dt>Free to start</dt>
            <dd>What’s in season near you, seasonal recipes and browsing activities stay free, so anyone can build the habit before paying for anything.</dd>
          </div>
          <div>
            <dt>Premium subscription <small>Main income</small></dt>
            <dd>A monthly or yearly plan for the people who use Livio every week: the AI voice assistant, the full recipe library, unlimited collections and personal seasonal planning.</dd>
          </div>
          <div>
            <dt>Booking commission</dt>
            <dd>The activity host pays a small commission on each booking made through Livio, never the user. Hosts can’t pay to rank higher, so suggestions are based only on your season, location and interests.</dd>
          </div>
          <div>
            <dt>Value for Burt’s Bees</dt>
            <dd>Livio doesn’t push products. Its value for the brand is long-term trust: a daily, useful touchpoint that turns Burt’s Bees from a product on the shelf into a brand people live with.</dd>
          </div>
        </dl>
      </div>
    </section>

    <!-- ── ux groundwork: between the solo and the team work ── -->
    <section class="lv-sec lv-sec--flush">
      <div class="lv-wrap">
        <p v-reveal class="lv-kicker lv-kicker--red">Mapping it out</p>
        <h3 v-reveal class="lv-h3">Who Livio is for, the journey they take through the app and what goes into each release.</h3>

        <div class="lv-ux-grid">
          <a v-for="(u, i) in ux" :key="u.src" v-reveal="i" :href="u.src" class="lv-ux" @click.prevent="uxOpen = i">
            <span class="lv-ux__frame lv-ux__frame--thumb"><img :src="u.thumb" :alt="u.alt" loading="lazy" /></span>
            <span class="lv-ux__cap">{{ u.title }} <em>View +</em></span>
          </a>
        </div>
        <ImageLightbox v-model="uxOpen" :items="ux" />
      </div>
    </section>

    <!-- ── 05 · developing it as a team ── -->
    <section class="lv-sec">
      <div class="lv-wrap">
        <p v-reveal class="lv-chapter"><span>05</span> Developing it as a team</p>
        <div class="lv-split">
          <h2 v-reveal class="lv-h2">
            In the 4th semester <span class="lv-soft">the focus moved to</span> working as a team.
          </h2>
          <p v-reveal="1" class="lv-body">
            Together with Anastasiia Kovtun and Vy Nguyen, we planned and ran the project with clear
            project-management techniques, managed time,
            resources and scope, and set team agreements so conflicts could be resolved professionally.
          </p>
        </div>
      </div>
    </section>

    <!-- ── 06 · what testing changed ── -->
    <section class="lv-sec">
      <div class="lv-wrap">
        <p v-reveal class="lv-chapter"><span>06</span> What testing changed</p>
        <h2 v-reveal class="lv-h2">
          Less clutter, clearer labels <span class="lv-soft">and the navigation</span> people expect.
        </h2>

        <article v-for="(c, i) in changes" :key="c.area" class="lv-ba" :class="{ 'lv-ba--flip': i % 2 }">
          <div class="lv-ba__copy">
            <p v-reveal class="lv-sticky" :class="`lv-sticky--${i % 2 ? 'b' : 'a'}`">
              {{ c.note }}
            </p>
            <div v-reveal="1">
              <p class="lv-kicker lv-kicker--red">0{{ i + 1 }} · {{ c.area }}</p>
              <p class="lv-body">{{ c.change }}</p>
            </div>
          </div>
          <div class="lv-ba__pair">
            <figure v-reveal="1" class="lv-ba__shot">
              <div class="lv-phone lv-phone--old"><img :src="c.before.src" :alt="c.before.alt" loading="lazy" /></div>
              <figcaption>Before</figcaption>
            </figure>
            <span class="lv-ba__arrow" aria-hidden="true">→</span>
            <figure v-reveal="2" class="lv-ba__shot">
              <div class="lv-phone"><img :src="c.after.src" :alt="c.after.alt" loading="lazy" /></div>
              <figcaption class="is-after">After</figcaption>
            </figure>
          </div>
        </article>
      </div>
    </section>

    <!-- ── build ── -->
    <section class="lv-sec lv-sec--flush">
      <div class="lv-wrap lv-split lv-split--center">
        <div v-reveal>
          <p class="lv-kicker lv-kicker--red">Build</p>
          <h3 class="lv-h3">From prototype to a working app.</h3>
        </div>
        <div v-reveal="1">
          <p class="lv-body">
            We built the frontend and backend together in two GitHub repos and deployed the app on
            Vercel, with a Neon (Postgres) database behind it. The app works in English, Dutch and French,
            and includes an AI voice assistant, powered by Grok, that you can ask for suggestions such as
            “suggest me a perfect activity for tomorrow”.
          </p>
          <ul class="lv-stack">
            <li v-for="s in stack" :key="s">{{ s }}</li>
          </ul>
        </div>
      </div>
    </section>

    <!-- ── closing (yellow bookend) ── -->
    <section class="lv-band lv-close">
      <span class="lv-mark lv-close__mark" v-html="mark" />
      <div class="lv-wrap">
        <p v-reveal class="lv-chapter"><span>07</span> Closing</p>
        <blockquote v-reveal="{ blur: true }" class="lv-quote">
          Burt’s philosophy of living “in pace with the seasons of nature” was never meant to stay on a
          shelf. Livio is the next step for Burt’s Bees: from a physical product to a daily digital
          experience.
        </blockquote>
      </div>
    </section>
  </div>
</template>

<style scoped>
/* ───────────── Livio brand world ───────────── */
.lv {
  --yellow: #ffd203;
  --red: #db0032;
  --green: #b1d679;
  --brown: #5e504d;
  --cream: #f9ecd8;
  --paper: #fff8ee;
  --ink: #3b302d;
  --soft: rgba(59, 48, 45, 0.76);
  --faint: rgba(59, 48, 45, 0.5);
  --line: rgba(59, 48, 45, 0.12);
  --serif: 'Fraunces', 'Playfair Display', Georgia, serif;
  --sans: 'Poppins', var(--font-body);
  --max: 70rem;
  --sec: clamp(4.5rem, 10vw, 8rem);

  margin-top: clamp(1rem, 3vw, 2rem);
  background: var(--paper);
  color: var(--ink);
  font-family: var(--sans);
  overflow-x: clip;
}

.lv-wrap {
  position: relative;
  z-index: 1;
  max-width: calc(var(--max) + 2 * var(--page-gutter));
  margin-inline: auto;
  padding-inline: var(--page-gutter);
}

.lv-sec {
  padding-block: var(--sec);
}

/* a short follow-on block that belongs to the section above it */
.lv-sec--flush {
  padding-top: 0;
}

/* two columns: statement left, supporting text right */
.lv-split {
  display: grid;
  grid-template-columns: minmax(0, 1.6fr) minmax(0, 1fr);
  gap: clamp(2rem, 6vw, 5rem);
  align-items: end;
}

.lv-split--center {
  align-items: center;
}

.lv-split .lv-h2 {
  max-width: none;
  margin-bottom: 0;
}

/* ---- the yellow bookends ---- */
.lv-band {
  position: relative;
  overflow: hidden;
  background: var(--yellow);
  --soft: rgba(59, 48, 45, 0.82);
  --faint: rgba(59, 48, 45, 0.6);
  --line: rgba(59, 48, 45, 0.18);
}

.lv-mark {
  display: block;
  line-height: 0;
  pointer-events: none;
}

.lv-mark :deep(svg) {
  width: 100%;
  height: auto;
}

/* ---- type ---- */
.lv-h2,
.lv-h3,
.lv-quote,
.lv-trends h3,
.lv-ps__text,
.lv-score__num {
  font-family: var(--serif);
  font-variation-settings: 'SOFT' 100, 'WONK' 0;
  letter-spacing: -0.015em;
}

.lv-h2 {
  max-width: 22ch;
  margin-bottom: clamp(2rem, 5vw, 3.5rem);
  font-size: clamp(1.9rem, 1.3rem + 2.6vw, 3.4rem);
  font-weight: 500;
  line-height: 1.06;
  text-wrap: balance;
}

.lv-h2 em {
  font-style: italic;
  color: var(--red);
}

.lv-h3 {
  margin-bottom: var(--space-s);
  font-size: clamp(1.6rem, 1.2rem + 1.7vw, 2.5rem);
  font-weight: 500;
  line-height: 1.08;
  text-wrap: balance;
}

.lv-soft {
  color: var(--faint);
}

.lv-kicker {
  margin-bottom: var(--space-s);
  font-size: 0.76rem;
  font-weight: 600;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--faint);
}

.lv-kicker--red {
  color: var(--red);
}

/* chapter marker: a red pill number, like the app's filter chips */
.lv-chapter {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: clamp(1.25rem, 3vw, 2rem);
  font-size: 0.78rem;
  font-weight: 600;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--soft);
}

.lv-chapter span {
  display: inline-grid;
  place-items: center;
  min-width: 2.6rem;
  height: 1.7rem;
  padding-inline: 0.6rem;
  border-radius: 62.4375rem;
  background: var(--red);
  color: #fff;
  letter-spacing: 0.04em;
}

.lv-body {
  font-size: 0.98rem;
  line-height: 1.75;
  color: var(--soft);
}

.lv-body strong {
  color: var(--ink);
  font-weight: 600;
}

.lv-measure {
  max-width: 60ch;
}

/* ---- 01: headline left, trend signals right ---- */
.lv-q {
  display: grid;
  grid-template-columns: minmax(0, 1.15fr) minmax(0, 1fr);
  gap: clamp(2rem, 6vw, 5.5rem);
  align-items: start;
}

.lv-q .lv-h2 {
  margin-bottom: 0;
}

/* the headline stays in view while the signals scroll past it */
@media (min-width: 961px) {
  .lv-q .lv-h2 {
    position: sticky;
    top: 7rem;
  }
}

.lv-q__signals .lv-kicker {
  margin-bottom: 0;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--line);
}

.lv-trends {
  list-style: none;
}

.lv-trend {
  display: grid;
  grid-template-columns: 1.4rem minmax(0, 1fr) clamp(5.5rem, 9vw, 7.5rem);
  gap: clamp(1rem, 2.5vw, 1.75rem);
  align-items: center;
  padding-block: clamp(1.25rem, 3vw, 1.75rem);
  border-bottom: 1px solid var(--line);
}

.lv-trend__n {
  align-self: start;
  padding-top: 0.2rem;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  color: var(--faint);
}

.lv-trends h3 {
  margin-block: 0.35rem 0.3rem;
  font-size: clamp(1.4rem, 1.15rem + 0.9vw, 1.8rem);
  font-weight: 600;
  line-height: 1.1;
  color: var(--red);
}

.lv-trends p {
  font-size: 0.9rem;
  line-height: 1.6;
  color: var(--soft);
}

/* illustrative rise (shape only, not data); unstretched so pathLength stays exact */
.lv-trend__chart {
  display: block;
  width: 100%;
  height: auto;
  overflow: visible;
}

.lv-trend__line {
  fill: none;
  stroke: var(--red);
  stroke-width: 4;
  stroke-linecap: round;
  stroke-dasharray: 1;
  stroke-dashoffset: 0;
  transition: stroke-dashoffset 1.6s cubic-bezier(0.45, 0, 0.2, 1);
  transition-delay: calc(var(--reveal-delay, 0s) + 0.25s);
}

.lv-trend__area {
  fill: var(--red);
  opacity: 0.1;
  transition: opacity 1s 0.9s;
}

/* before the row scrolls in: line undrawn, fill hidden */
.lv-trend.reveal:not(.is-revealed) .lv-trend__line {
  stroke-dashoffset: 1;
}

.lv-trend.reveal:not(.is-revealed) .lv-trend__area {
  opacity: 0;
}

.lv-trend__tag {
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--faint);
}

/* ---- problem → solution: one panel, cream flowing into yellow ---- */
.lv-ps {
  position: relative;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  margin-top: clamp(3.5rem, 8vw, 6rem);
  overflow: hidden;
  border-radius: 1.75rem;
}

.lv-ps__card {
  padding: clamp(1.75rem, 4vw, 3rem);
  background: var(--cream);
}

.lv-ps__card--answer {
  display: flex;
  flex-direction: column;
  background: var(--yellow);
}

.lv-ps__text {
  font-size: clamp(1.25rem, 1.05rem + 0.8vw, 1.7rem);
  line-height: 1.32;
}

.lv-ps__arrow {
  position: absolute;
  top: 50%;
  left: 50%;
  z-index: 1;
  display: grid;
  place-items: center;
  width: 3rem;
  height: 3rem;
  translate: -50% -50%;
  border-radius: 50%;
  background: var(--red);
  color: #fff;
  font-size: 1.2rem;
  box-shadow: 0 0 0 6px var(--paper);
}

/* the proof sits under the answer it validates */
.lv-score {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.6rem 1rem;
  margin-top: auto;
  padding-top: clamp(1.25rem, 3vw, 1.75rem);
  border-top: 1px solid var(--line);
}

.lv-ps__card--answer .lv-ps__text {
  margin-bottom: clamp(1.5rem, 3vw, 2.25rem);
}

.lv-score__num {
  font-size: clamp(2.2rem, 1.8rem + 1.6vw, 3rem);
  font-weight: 600;
  line-height: 0.85;
  color: var(--red);
}

.lv-score__num small {
  font-size: 0.45em;
  color: var(--faint);
}

.lv-score__dots {
  display: flex;
  gap: 0.3rem;
}

.lv-score__dots i {
  width: 0.65rem;
  height: 0.65rem;
  border-radius: 50%;
  border: 1.5px solid var(--red);
  opacity: 0.4;
  transition: scale 0.4s cubic-bezier(0.3, 1.6, 0.5, 1), opacity 0.4s;
  transition-delay: calc(var(--reveal-delay, 0s) + 0.5s + var(--d) * 80ms);
}

.lv-score__dots i.on {
  background: var(--red);
  opacity: 1;
}

/* before the panel scrolls in: dots shrunk away */
.lv-ps.reveal:not(.is-revealed) .lv-score__dots i {
  scale: 0;
  opacity: 0;
}

.lv-score__text {
  flex: 1 1 14rem;
  font-size: 0.85rem;
  line-height: 1.55;
  color: var(--soft);
}

.lv-score__text em {
  font-family: var(--serif);
  font-size: 1.05em;
  color: var(--ink);
}

/* ---- 02: the process timeline ---- */
.lv-tl {
  margin-top: clamp(2.5rem, 6vw, 4rem);
}

/* two semester bands over the four steps; the top-4 pick sits on the seam */
.lv-tl__phases {
  position: relative;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: clamp(1.5rem, 3vw, 2.5rem);
  margin-bottom: 1.75rem;
}

.lv-tl__phase {
  padding: 0.7rem 1.1rem;
  border-radius: 62.4375rem;
  background: var(--cream);
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.16em;
  text-align: center;
  text-transform: uppercase;
  color: var(--soft);
}

.lv-tl__phase--team {
  background: var(--green);
  color: var(--ink);
}

.lv-tl__pick {
  position: absolute;
  top: 50%;
  left: 50%;
  translate: -50% -50%;
  padding: 0.35rem 0.8rem;
  border-radius: 62.4375rem;
  background: var(--red);
  color: #fff;
  font-size: 0.72rem;
  font-weight: 600;
  white-space: nowrap;
  box-shadow: 0 0 0 5px var(--paper);
}

.lv-steps {
  list-style: none;
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: clamp(1.5rem, 3vw, 2.5rem);
}

.lv-steps li {
  display: grid;
  gap: 0.4rem;
  align-content: start;
  padding: clamp(1.25rem, 2.5vw, 1.6rem);
  border-radius: 1.375rem;
  background: var(--cream);
}

.lv-steps li.is-team {
  background: color-mix(in srgb, var(--green) 32%, var(--paper));
}

.lv-steps__n {
  margin-bottom: 1.5rem;
  font-family: var(--serif);
  font-variation-settings: 'SOFT' 100, 'WONK' 0;
  font-size: clamp(2.2rem, 1.8rem + 1.4vw, 3rem);
  font-weight: 600;
  line-height: 1;
  color: var(--red);
}

/* the bands say the semester on wide screens; the cards say it when stacked */
.lv-steps small {
  display: none;
  font-size: 0.75rem;
  color: var(--faint);
}

.lv-steps strong {
  font-size: 1.05rem;
  font-weight: 600;
}

.lv-steps p {
  font-size: 0.88rem;
  line-height: 1.6;
  color: var(--soft);
}

/* ---- phones ---- */
.lv-phone {
  position: relative;
  aspect-ratio: 390 / 844;
  padding: 2.6%;
  border-radius: 13% / 6%;
  background: #1f1c1c;
  box-shadow:
    inset 0 0 0 1.5px #5a5552,
    0 2.5rem 4.375rem -1.75rem rgba(59, 30, 20, 0.45),
    0 0.875rem 1.75rem -0.875rem rgba(59, 30, 20, 0.3);
}

.lv-phone img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: top;
  border-radius: 11% / 5.1%;
}

/* ---- feature rows ---- */
.lv-feature-list {
  display: grid;
  gap: clamp(4.5rem, 11vw, 8rem);
}

.lv-feature {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1.15fr);
  align-items: center;
  gap: clamp(2rem, 7vw, 6rem);
}

.lv-feature--flip .lv-feature__copy {
  order: 2;
}

.lv-feature__copy .lv-body {
  max-width: 46ch;
}

.lv-feature__stage {
  position: relative;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 15rem));
  justify-content: center;
  gap: clamp(0.75rem, 3vw, 1.75rem);
  padding-block: clamp(1.5rem, 4vw, 3rem);
}

/* offsets use margin, not transform: v-reveal animates transform */
.lv-feature__stage .lv-phone:nth-of-type(2) {
  margin-top: clamp(2rem, 6vw, 4.5rem);
}

.lv-feature__stage .lv-phone {
  z-index: 1;
}

/* ---- brand ---- */
.lv-sheet {
  list-style: none;
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  gap: clamp(0.4rem, 1vw, 0.75rem);
  margin-top: clamp(2.5rem, 6vw, 4rem);
}

.lv-sheet a {
  display: block;
  cursor: zoom-in;
  overflow: hidden;
  aspect-ratio: 16 / 9;
  box-shadow: 0 0 0 1px rgba(94, 80, 77, 0.12);
}

.lv-sheet img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: scale 0.4s ease;
}

.lv-sheet a:hover img {
  scale: 1.05;
}

.lv-palette {
  list-style: none;
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  margin-top: clamp(2rem, 5vw, 3.5rem);
}

.lv-palette li {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 0.5rem;
  min-height: 5.5rem;
  padding: 1rem 1.1rem;
  font-size: 0.82rem;
  font-weight: 600;
}

.lv-palette code {
  font-family: var(--sans);
  font-weight: 400;
  opacity: 0.8;
}

/* ---- business model ---- */
.lv-biz {
  display: grid;
  gap: 1.25rem;
}

.lv-biz div {
  padding-left: 1.25rem;
  border-left: 3px solid var(--yellow);
}

.lv-biz__lead {
  margin-top: 1rem;
}

.lv-biz dt {
  margin-bottom: 0.2rem;
  font-weight: 600;
}

.lv-biz dt small {
  margin-left: 0.5rem;
  padding: 0.1rem 0.55rem;
  border-radius: 62.4375rem;
  background: var(--yellow);
  font-size: 0.72rem;
  font-weight: 500;
  vertical-align: middle;
}

.lv-biz dd {
  font-size: 0.93rem;
  line-height: 1.65;
  color: var(--soft);
}

/* ---- together / UX mapping ---- */
.lv-ux {
  cursor: zoom-in;
  display: block;
  color: inherit;
  text-decoration: none;
  cursor: zoom-in;
}

.lv-ux__frame {
  display: block;
  overflow: hidden;
  border-radius: 1.25rem;
  background: #fff;
  box-shadow: inset 0 0 0 1px var(--line);
}

.lv-ux__frame img {
  display: block;
  width: 100%;
  transition: transform 0.6s var(--ease-soft);
}

.lv-ux__frame--thumb {
  aspect-ratio: 16 / 9;
}

.lv-ux__frame--thumb img {
  height: 100%;
  object-fit: cover;
}

.lv-ux:hover .lv-ux__frame img {
  transform: scale(1.04);
}

.lv-ux-grid {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: clamp(0.75rem, 2vw, 1.25rem);
  margin-top: clamp(2.5rem, 6vw, 4rem);
}

.lv-ux__cap {
  display: flex;
  justify-content: space-between;
  gap: 0.5rem;
  margin-top: 0.6rem;
  font-size: 0.85rem;
  font-weight: 500;
}

.lv-ux__cap em {
  font-style: normal;
  color: var(--red);
  white-space: nowrap;
}

/* ---- before → after ---- */
.lv-ba {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1.35fr);
  align-items: center;
  gap: clamp(2rem, 6vw, 5rem);
  padding-block: clamp(2.5rem, 6vw, 4.5rem);
  border-top: 1px dashed var(--line);
}

/* mirror the tracks too, so the phones keep the wider column and stay the same size */
.lv-ba--flip {
  grid-template-columns: minmax(0, 1.35fr) minmax(0, 1fr);
}

.lv-ba--flip .lv-ba__copy {
  order: 2;
}

.lv-ba__copy {
  display: grid;
  gap: clamp(1.5rem, 3vw, 2.25rem);
  justify-items: start;
}

/* the team's notes were FigJam stickies, so they stay stickies */
.lv-sticky {
  max-width: 17rem;
  min-height: 9.5rem;
  padding: 1.2rem 1.25rem 1.6rem;
  background: var(--yellow);
  color: var(--ink);
  font-family: var(--font-hand);
  font-size-adjust: var(--hand-size-adjust);
  -webkit-text-stroke: var(--hand-stroke) currentColor;
  font-size: 1rem;
  line-height: 1.75;
  box-shadow:
    0 1px 0 rgba(0, 0, 0, 0.04),
    0 1.125rem 1.625rem -1.125rem rgba(59, 48, 45, 0.55);
  rotate: -2.5deg;
}

.lv-sticky--b {
  background: #ffe36b;
  rotate: 2deg;
}

.lv-ba__pair {
  display: grid;
  grid-template-columns: minmax(0, 14.6875rem) auto minmax(0, 14.6875rem);
  justify-content: center;
  align-items: center;
  gap: clamp(0.6rem, 2.5vw, 1.75rem);
}

.lv-ba__arrow {
  font-family: var(--serif);
  font-size: 2.2rem;
  color: var(--red);
}

.lv-ba__shot figcaption {
  margin-top: 1rem;
  text-align: center;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--faint);
}

.lv-ba__shot figcaption.is-after {
  color: var(--red);
}

.lv-phone--old {
  box-shadow: inset 0 0 0 1.5px #5a5552, 0 0.875rem 1.75rem -1.125rem rgba(59, 30, 20, 0.35);
}

.lv-phone--old img {
  filter: grayscale(0.35);
  opacity: 0.85;
}

/* ---- build ---- */
.lv-stack {
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: var(--space-m);
}

.lv-stack li {
  padding: 0.38rem 0.9rem;
  border-radius: 62.4375rem;
  background: var(--cream);
  font-size: 0.82rem;
  font-weight: 500;
}

/* ---- closing ---- */
.lv-close {
  padding-block: var(--sec);
}

.lv-close__mark {
  position: absolute;
  width: clamp(21.25rem, 42vw, 42.5rem);
  right: clamp(-20rem, -18vw, -7.5rem);
  bottom: clamp(-20rem, -18vw, -7.5rem);
  color: rgba(219, 0, 50, 0.1);
}

.lv-quote {
  max-width: 26ch;
  margin-bottom: clamp(2rem, 5vw, 3rem);
  font-size: clamp(1.8rem, 1.2rem + 2.4vw, 3.3rem);
  font-weight: 500;
  line-height: 1.08;
  color: var(--red);
  text-wrap: balance;
}


/* ---- responsive ---- */
@media (max-width: 960px) {
  .lv-split,
  .lv-feature,
  .lv-ba {
    grid-template-columns: 1fr;
  }

  .lv-split {
    align-items: start;
  }

  .lv-feature--flip .lv-feature__copy,
  .lv-ba--flip .lv-ba__copy {
    order: 0;
  }

  .lv-q {
    grid-template-columns: 1fr;
  }

  .lv-steps {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .lv-tl__phases {
    display: none;
  }

  .lv-steps small {
    display: block;
  }

  .lv-ux-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .lv-sheet {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

@media (max-width: 720px) {
  .lv-ps,
  .lv-steps {
    grid-template-columns: 1fr;
  }

  .lv-palette {
    grid-template-columns: 1fr;
  }

  .lv-sheet {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .lv-palette li {
    min-height: 3rem;
    align-items: center;
  }

  /* stacked: the arrow sits in the flow, straddling the seam */
  .lv-ps__arrow {
    position: relative;
    top: auto;
    left: auto;
    translate: none;
    margin: -1.5rem auto;
    rotate: 90deg;
  }

  .lv-trend {
    grid-template-columns: 1.4rem minmax(0, 1fr);
  }

  .lv-trend__chart {
    grid-column: 2;
    max-width: 8rem;
  }
}
</style>
