<script setup>
/**
 * Livio: case study.
 *
 * Built as a product showcase in the "Cuzy" Behance format, dressed in
 * Livio's own brand: one cream page split by thin white seams, each section
 * opening with an outlined pill and a two-tone statement (the point in ink,
 * the rest dimmed) set in the headline face, then one strong visual:
 *
 *  question → arc panel (signals | mark | gap, answer, proof)
 *  process → four-column roadmap
 *  app → a big onboarding panel, a giant For You headline over the phones,
 *        then Nourish and Activities on a brown band
 *  brand → the mark on its construction grid, 2×2 tiles, guideline pages
 *          fanned in an arc, type specimens and palette circles
 *  business model → staggered points; mapping → persona + the UX maps; team → centred statement; testing → the team's handwritten
 *  stickies on colour beside before → after; build → stack chips;
 *  closing → a quote card over a running strip of the app's tabs.
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

const trends = [
  { tag: 'Going mainstream', title: 'Seasonal food', text: 'Seasonal and local food is no longer niche: people link it to quality, health and sustainability.' },
  { tag: 'Reconnecting', title: 'Nature', text: 'Mindful living, time outdoors and nature-based wellbeing are becoming answers to stress and burnout.' },
  { tag: 'Growing fast', title: 'Wellness apps', text: 'People already use, and pay for, digital tools that help with sleep, food and mental health.' },
]

const steps = [
  { sem: '3', who: 'solo', title: 'Research & concept', text: 'Company study, trend research and concept interviews.' },
  { sem: '3', who: 'solo', title: 'Brand & hi-fi UI', text: 'A new logo, a full design system and a clickable hi-fi prototype.' },
  { sem: '4', who: 'team', title: 'Testing & rework', text: 'User tests, then the UI reworked from the results.' },
  { sem: '4', who: 'team', title: 'Build & deploy', text: 'Frontend and backend, deployed on Vercel.' },
]

const features = [
  {
    n: 'Getting started',
    title: 'Where you live and what you’re into.',
    text: 'Onboarding asks for your location and your interests, from seasonal cooking to foraging and nature connection, so everything after it is personal to you.',
    screens: [
      { src: `${A}/livio-location.jpg`, alt: 'Onboarding: “What’s your location?” with a current-location button and city suggestions' },
      { src: `${A}/livio-interests.jpg`, alt: 'Onboarding: “What interests you?” grid of nine seasonal interests' },
    ],
  },
  {
    n: 'For You',
    title: 'What’s in season, where you are.',
    text: 'The For You page shows the fruits, vegetables and herbs that are in season where you live, with tips on how to pick the best ones and how to store them.',
    screens: [
      { src: `${A}/livio-for-you.jpg`, alt: 'For You page for Mechelen, Belgium: continue where you left off, produce in season and recommended recipes' },
      { src: `${A}/livio-rhubarb.jpg`, alt: 'Rhubarb detail page: in-season months, tips to keep it fresh and what to look for when picking' },
    ],
  },
  {
    n: 'Nourish',
    title: 'Cooking with the season.',
    text: 'Recipes are built around what’s actually available right now. Instead of hunting for specific ingredients, you cook with what’s already in season, which makes seasonal eating easier to keep up. Anything you save lands in your collections.',
    screens: [
      { src: `${A}/livio-recipe.jpg`, alt: 'Recipe page for a fresh strawberry salad with in-season ingredients' },
      { src: `${A}/livio-guide-store.jpg`, alt: 'Guide: how to store fresh food' },
    ],
  },
  {
    n: 'Activities',
    title: 'Things to do this season, booked in the app.',
    text: 'Livio suggests activities that fit both the season and your location, and you can book them straight from the app. Your profile keeps track of your activities and bookings.',
    screens: [
      { src: `${A}/livio-activities.jpg`, alt: 'Seasonal activities page with booked activities and free nearby events' },
      { src: `${A}/livio-activity-detail.jpg`, alt: 'Activity detail for Royal Greenhouse Laeken with location, age, date and price' },
    ],
  },
]
const [onboard, forYou, nourish, activities] = features

const palette = [
  { name: 'Yellow', hex: '#FFD203' },
  { name: 'Red', hex: '#DB0032' },
  { name: 'Green', hex: '#B1D679' },
  { name: 'Brown', hex: '#5E504D' },
  { name: 'Cream', hex: '#F9ECD8' },
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

// pages shown as large tiles (structure, clear space, backgrounds, app icon);
// every other page fans out in the arc, in guideline order, so each of the
// 18 shows once. The lightbox pages through all of them.
const brandTiles = [3, 4, 6, 8]
// the Brand Guidelines cover sits front and centre, the rest fan out
// around it in order (13 pages: 6 to the left, 7 to the right)
const brandRest = brandSheet.map((_, i) => i).filter((i) => i && !brandTiles.includes(i))
const brandArc = [...brandRest.slice(0, 6), 0, ...brandRest.slice(6)]
const brandMid = brandArc.indexOf(0)

// the user persona, coded as five columns so it reads without zooming
const persona = {
  name: 'Yuna Chen',
  role: 'Seasonal living enthusiast',
  avatar: `${A}/livio-persona-avatar.webp`,
  facts: ['36', 'Marketing', 'Urban / suburban', 'Tech comfort: high'],
  personality: ['Mindful, curious and intentional', 'Values simplicity, nature and slow living', 'Enjoys learning and self-reflection', 'Environmentally conscious, not extreme', 'Seeks balance, not perfection'],
  quote: 'I want to live more seasonally so I can feel more grounded and connected to nature. To achieve that, I need simple, curated seasonal guidance from an app so I can build nourishing habits and rituals throughout the year.',
  columns: [
    { title: 'Interests', tone: 'cream', items: ['Seasonal eating, local and farmer markets', 'Natural skincare and clean beauty', 'Sustainability and eco-friendly living', 'Cooking, baking and plant-based meals', 'Slow living, wellness and rituals', 'Podcasts and audiobooks during daily routines'] },
    { title: 'Goals', tone: 'green', items: ['Live more in tune with nature and seasons', 'Eat foods that feel aligned with the time of year', 'Build seasonal routines and rituals', 'Learn new seasonal practices, like foraging and preserving', 'Reduce environmental impact through daily choices', 'Feel more grounded and present throughout the year'] },
    { title: 'Needs & expectations', tone: 'yellow', items: ['Clear seasonal guidance without overwhelm', 'Curated, trustworthy content, not endless scrolling', 'Easy access to seasonal recipes and produce lists', 'Practical tips for everyday life, not just inspiration', 'Gentle nudges and reminders aligned with seasons', 'A personalised experience based on location and preferences'] },
    { title: 'Motivations', tone: 'white', items: ['Desire for a slower, more intentional lifestyle', 'Emotional connection to nature and natural cycles', 'Inspiration from seasonal aesthetics and rituals', 'Feeling nourished, physically and mentally', 'Aligning personal values with daily habits', 'Enjoyment of learning and self-growth'] },
    { title: 'Pain points', tone: 'red', items: ['Feeling disconnected from seasons in modern life', 'Too much conflicting lifestyle advice online', 'Sustainability content that feels guilt-driven', 'Seasonal living resources scattered across platforms', 'Difficulty knowing what’s actually in season', 'Lack of guidance that fits into busy routines'] },
  ],
}

const ux = [
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
const changeTones = ['red', 'green', 'brown', 'yellow']

// which brand page / ux diagram is open in the lightbox (null = closed)
const sheetOpen = ref(null)
const uxOpen = ref(null)

const stack = ['Vue 3', 'Vercel', 'Neon (Postgres)', 'Grok AI', 'GitHub', 'Postman']
const languages = ['English', 'Dutch', 'French']

// the running strip under the closing card: the app's tabs and the signals
const strip = ['For You', 'Nourish', 'Activities', 'Profile', 'Seasonal food', 'Nature', 'Wellness apps']
</script>

<template>
  <div class="lv">
    <!-- ── the question: statement, then signals → gap → answer around the mark ── -->
    <section class="lv-sec">
      <div class="lv-wrap">
        <div class="lv-head lv-head--end">
          <span v-reveal class="lv-pill">The question</span>
          <h2 v-reveal="1" class="lv-say">
            Burt’s Bees has made lives better, naturally, for over 40 years,
            <span class="lv-dim">mostly through physical products.</span>
            What if it could help <em>beyond</em> the shelves?
          </h2>
        </div>

        <div v-reveal class="lv-qa">
          <div class="lv-qa__side">
            <p class="lv-qa__label">Trend research · three signals</p>
            <ol class="lv-qa__signals">
              <li v-for="t in trends" :key="t.title">
                <h3>{{ t.title }}</h3>
                <small>{{ t.tag }}</small>
                <p>{{ t.text }}</p>
              </li>
            </ol>
          </div>

          <div class="lv-qa__arc" aria-hidden="true">
            <svg viewBox="0 0 100 400" preserveAspectRatio="none">
              <path d="M98 4 A 96 196 0 0 0 98 396" />
            </svg>
            <i class="lv-qa__dot lv-qa__dot--top" />
            <i class="lv-qa__dot lv-qa__dot--mid" />
            <i class="lv-qa__dot lv-qa__dot--bot" />
            <span class="lv-mark lv-qa__mark" v-html="mark" />
          </div>

          <div class="lv-qa__side lv-qa__side--answer">
            <article>
              <p class="lv-qa__label">The gap</p>
              <p class="lv-qa__point">
                <span>
                  Seasonal living resonates emotionally, but people struggle to keep it up. Generic advice
                  ignores where they live, and the information they need is scattered across the internet.
                </span>
              </p>
            </article>
            <article>
              <p class="lv-qa__label">The answer</p>
              <p class="lv-qa__point">
                <span>
                  One place that tells you what’s in season where you live, what to cook with it and what to
                  do outside, from a brand people already trust. Burt Shavitz himself lived in rhythm with the
                  seasons.
                </span>
              </p>
            </article>
            <div class="lv-meter">
              <p class="lv-meter__text">
                average answer to <em>“How likely would you be to use an app like Livio?”</em>
                in 3 concept interviews
              </p>
              <div class="lv-meter__bar" role="img" aria-label="4 out of 5"><i /></div>
              <p class="lv-meter__num">4<span>/5</span></p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ── the process: a roadmap of four columns ── -->
    <section class="lv-sec">
      <div class="lv-wrap">
        <div class="lv-head lv-head--center">
          <span v-reveal class="lv-pill">The process</span>
          <h2 v-reveal="1" class="lv-say">
            From solo <span class="lv-dim">concept</span> to team <span class="lv-dim">build.</span>
          </h2>
          <p v-reveal="2" class="lv-lead">
            I shaped Livio on my own in semester 3. It was picked as one of the top 4 projects, so in
            semester 4 it became a team project with Anastasiia Kovtun and Vy Nguyen: tested with real
            users, reworked and built.
          </p>
        </div>

        <ol class="lv-road">
          <li v-for="(st, i) in steps" :key="st.title" v-reveal="i" :class="{ 'is-last': i === steps.length - 1 }">
            <p class="lv-road__big"><span class="lv-dim">Semester</span> {{ st.sem }}</p>
            <h3>{{ st.title }}</h3>
            <div class="lv-road__bar" aria-hidden="true">
              <i>↗</i>
              <i class="lv-road__end">{{ String(i + 1).padStart(2, '0') }}</i>
            </div>
            <span class="lv-chip">{{ st.who }}</span>
            <p>{{ st.text }}</p>
          </li>
        </ol>

        <div v-reveal class="lv-road__foot">
          <p><span class="lv-dim">Turning point:</span> picked as one of the top 4 projects</p>
          <p>Solo → team</p>
        </div>
      </div>
    </section>

    <!-- ── getting started: one big panel, statement in its corner ── -->
    <section class="lv-sec">
      <div class="lv-wrap">
        <span v-reveal class="lv-pill">{{ onboard.n }}</span>
        <div v-reveal class="lv-stage">
          <span class="lv-mark lv-stage__mark" v-html="mark" />
          <div class="lv-stage__copy">
            <h2 class="lv-say">{{ onboard.title }}</h2>
            <p class="lv-body">{{ onboard.text }}</p>
          </div>
          <div class="lv-stage__phones">
            <figure v-for="(s, j) in onboard.screens" :key="s.src" v-reveal="j + 1" class="lv-phone">
              <img :src="s.src" :alt="s.alt" loading="lazy" />
            </figure>
          </div>
        </div>
      </div>
    </section>

    <!-- ── for you: one giant headline over the phones ── -->
    <section class="lv-sec lv-sec--open">
      <div class="lv-wrap lv-big">
        <span v-reveal class="lv-pill">{{ forYou.n }}</span>
        <h2 v-reveal="1" class="lv-giant">
          What’s in season, <span class="lv-dim">where you are.</span>
        </h2>
        <div class="lv-big__stage">
          <span class="lv-mark lv-big__mark" v-html="mark" />
          <figure v-for="(s, j) in forYou.screens" :key="s.src" v-reveal="j + 1" class="lv-phone lv-big__phone">
            <img :src="s.src" :alt="s.alt" loading="lazy" />
          </figure>
        </div>
        <p v-reveal class="lv-lead lv-big__text">{{ forYou.text }}</p>
      </div>
    </section>

    <!-- ── nourish + activities: one brown band ── -->
    <section class="lv-duo">
      <div class="lv-duo__band">
        <div class="lv-wrap">
          <div class="lv-duo__head">
            <span v-reveal class="lv-pill lv-pill--dark">{{ nourish.n }}</span>
            <h2 v-reveal="1" class="lv-say">
              {{ nourish.title }} <span class="lv-dim">Anything you save lands in your collections.</span>
            </h2>
          </div>
          <div class="lv-duo__row lv-duo__row--first">
            <p v-reveal class="lv-duo__text">
              Recipes are built around what’s actually available right now. Instead of hunting for specific
              ingredients, you cook with what’s already in season, which makes seasonal eating easier to keep up.
            </p>
            <div class="lv-duo__pair">
              <figure v-for="(s, j) in nourish.screens" :key="s.src" v-reveal="j" class="lv-phone">
                <img :src="s.src" :alt="s.alt" loading="lazy" />
              </figure>
            </div>
          </div>
          <div class="lv-duo__row lv-duo__row--second">
            <figure v-reveal class="lv-phone lv-duo__solo">
              <img :src="activities.screens[0].src" :alt="activities.screens[0].alt" loading="lazy" />
            </figure>
            <div v-reveal="1" class="lv-duo__text">
              <span class="lv-pill lv-pill--dark">{{ activities.n }}</span>
              <h3 class="lv-say lv-say--sm">{{ activities.title }}</h3>
              <p>{{ activities.text }}</p>
            </div>
          </div>
          <figure v-reveal class="lv-phone lv-duo__tail">
            <img :src="activities.screens[1].src" :alt="activities.screens[1].alt" loading="lazy" />
          </figure>
        </div>
      </div>
    </section>

    <!-- ── the brand: the mark on its grid, statement, tiles, pages in an arc ── -->
    <section class="lv-sec lv-sec--after-duo">
      <div class="lv-wrap">
        <span v-reveal class="lv-pill">The brand</span>

        <div v-reveal class="lv-construct" aria-hidden="true">
          <svg class="lv-construct__guides" viewBox="0 0 100 100" preserveAspectRatio="none">
            <line x1="0" y1="50" x2="100" y2="50" />
            <line x1="50" y1="0" x2="50" y2="100" />
            <line x1="0" y1="0" x2="100" y2="100" />
            <line x1="100" y1="0" x2="0" y2="100" />
            <circle cx="50" cy="50" r="34" />
            <circle cx="50" cy="50" r="22" />
          </svg>
          <span class="lv-mark lv-construct__mark" v-html="mark" />
        </div>

        <div class="lv-brand-say">
          <h2 v-reveal class="lv-say">
            Still <span class="lv-red">Burt’s Bees</span>, <span class="lv-dim">with a new mark for the app icon.</span>
          </h2>
          <p v-reveal="1" class="lv-lead">
            I kept Burt’s Bees’ typefaces (Decors and Poppins) and colour palette throughout Livio, so people
            instantly recognise it as part of the family. The existing logo doesn’t work as an app icon,
            though: at small sizes the text becomes unreadable and the hexagon adds clutter. So I designed a
            new mark from bee wings, a leaf and the beeswax hexagon.
          </p>
        </div>
      </div>

      <div class="lv-wrap lv-tiles">
        <a
          v-for="(k, i) in brandTiles"
          :key="k"
          v-reveal="i % 2"
          :href="brandSheet[k].src"
          class="lv-tile lv-tile--img"
          :title="`${brandSheet[k].title}: view full size`"
          @click.prevent="sheetOpen = k"
        >
          <img :src="brandSheet[k].src" :alt="brandSheet[k].alt" loading="lazy" />
          <span class="lv-tile__cap"><span>{{ brandSheet[k].title }}</span><span>Livio</span></span>
        </a>
      </div>

      <div v-reveal class="lv-arc" aria-label="Brand guideline pages">
        <a
          v-for="(k, i) in brandArc"
          :key="k"
          :href="brandSheet[k].src"
          class="lv-arc__card"
          :style="{
            '--k': i - brandMid,
            '--n': brandArc.length,
            zIndex: brandArc.length - Math.abs(i - brandMid),
          }"
          :title="`${brandSheet[k].title}: view full size`"
          @click.prevent="sheetOpen = k"
        >
          <img :src="brandSheet[k].src" :alt="brandSheet[k].alt" loading="lazy" decoding="async" />
        </a>
      </div>
      <ImageLightbox v-model="sheetOpen" :items="brandSheet" />
    </section>

    <!-- ── typography & colour ── -->
    <section class="lv-sec">
      <div class="lv-wrap">
        <span v-reveal class="lv-pill">Typography &amp; colour</span>
        <p v-reveal class="lv-type lv-type--head" aria-hidden="true">Decors</p>
        <div v-reveal class="lv-scale" aria-hidden="true">
          <span class="lv-scale__pill">Body</span>
          <span class="lv-scale__ticks" />
          <span class="lv-scale__pill lv-scale__pill--on">Headlines</span>
          <span class="lv-scale__ticks" />
          <span class="lv-scale__pill">Burt’s Bees</span>
        </div>
        <p v-reveal class="lv-type lv-type--body" aria-hidden="true">Poppins</p>

        <ul class="lv-swatches" aria-label="Colour palette">
          <li v-for="(c, i) in palette" :key="c.hex" v-reveal="i % 3">
            <span class="lv-swatches__dot" :style="{ background: c.hex }" />
            <strong>{{ c.name }}</strong>
            <code>{{ c.hex }}</code>
          </li>
        </ul>
      </div>
    </section>

    <!-- ── business model: statement, then the four parts staggered ── -->
    <section class="lv-sec">
      <div class="lv-wrap">
        <span v-reveal class="lv-pill">Business model</span>
        <h2 v-reveal="1" class="lv-say lv-say--left">
          No ads, no selling user data, <span class="lv-dim">no compromises on the experience.</span>
        </h2>
        <p v-reveal="2" class="lv-lead">
          Livio only earns when it’s useful: people pay because it helps them live with the seasons, and
          hosts pay when Livio fills their activity.
        </p>

        <dl class="lv-stagger">
          <div v-reveal>
            <dt>Free to start</dt>
            <dd>What’s in season near you, seasonal recipes and browsing activities stay free, so anyone can build the habit before paying for anything.</dd>
            <span class="lv-stagger__bar" aria-hidden="true" />
          </div>
          <div v-reveal class="is-main">
            <dt>Premium subscription <span class="lv-chip lv-chip--red">Main income</span></dt>
            <dd>A monthly or yearly plan for the people who use Livio every week: the AI voice assistant, the full recipe library, unlimited collections and personal seasonal planning.</dd>
            <span class="lv-stagger__bar" aria-hidden="true" />
          </div>
          <div v-reveal>
            <dt>Booking commission</dt>
            <dd>The activity host pays a small commission on each booking made through Livio, never the user. Hosts can’t pay to rank higher, so suggestions are based only on your season, location and interests.</dd>
            <span class="lv-stagger__bar" aria-hidden="true" />
          </div>
          <div v-reveal>
            <dt>Value for Burt’s Bees</dt>
            <dd>Livio doesn’t push products. Its value for the brand is long-term trust: a daily, useful touchpoint that turns Burt’s Bees from a product on the shelf into a brand people live with.</dd>
            <span class="lv-stagger__bar" aria-hidden="true" />
          </div>
        </dl>
      </div>
    </section>

    <!-- ── mapping it out: the persona, then the UX maps ── -->
    <section class="lv-sec">
      <div class="lv-wrap">
        <div class="lv-head lv-head--end">
          <span v-reveal class="lv-pill">Mapping it out</span>
          <h2 v-reveal="1" class="lv-say lv-say--sm">
            Who Livio is for, <span class="lv-dim">the journey they take through the app and what goes into each release.</span>
          </h2>
        </div>

        <article class="lv-persona" aria-label="User persona">
          <header v-reveal class="lv-persona__head">
            <img class="lv-persona__face" :src="persona.avatar" alt="" width="144" height="144" loading="lazy" />
            <div class="lv-persona__who">
              <span class="lv-persona__role">{{ persona.role }}</span>
              <strong class="lv-persona__name">{{ persona.name }}</strong>
              <ul class="lv-persona__facts">
                <li v-for="f in persona.facts" :key="f">{{ f }}</li>
              </ul>
            </div>
            <blockquote class="lv-persona__quote">“{{ persona.quote }}”</blockquote>
            <ul class="lv-persona__traits">
              <li v-for="t in persona.personality" :key="t">{{ t }}</li>
            </ul>
          </header>
          <div class="lv-persona__cols">
            <section
              v-for="(c, i) in persona.columns"
              :key="c.title"
              v-reveal="i % 3"
              class="lv-persona__col"
              :class="`is-${c.tone}`"
            >
              <h3>{{ c.title }}</h3>
              <ul>
                <li v-for="it in c.items" :key="it">{{ it }}</li>
              </ul>
            </section>
          </div>
        </article>

        <div class="lv-ux-grid">
          <a v-for="(u, i) in ux" :key="u.src" v-reveal="i % 2" :href="u.src" class="lv-tile lv-tile--img lv-ux" @click.prevent="uxOpen = i">
            <img :src="u.thumb" :alt="u.alt" loading="lazy" />
            <span class="lv-tile__cap"><span>{{ u.title }}</span><span>View +</span></span>
          </a>
        </div>
        <ImageLightbox v-model="uxOpen" :items="ux" />
      </div>
    </section>

    <!-- ── developing it as a team: one centred statement with its byline ── -->
    <section class="lv-sec">
      <div class="lv-wrap lv-head lv-head--center lv-team">
        <span v-reveal class="lv-pill">Developing it as a team</span>
        <h2 v-reveal="1" class="lv-say lv-say--lg">
          In the 4th semester <span class="lv-dim">the focus moved to</span> working as a team.
        </h2>
        <p v-reveal="2" class="lv-lead">
          Together with Anastasiia Kovtun and Vy Nguyen, we planned and ran the project with clear
          project-management techniques, managed time,
          resources and scope, and set team agreements so conflicts could be resolved professionally.
        </p>
        <p v-reveal="3" class="lv-byline">
          <span class="lv-byline__faces" aria-hidden="true"><i>M</i><i>A</i><i>V</i></span>
          <strong>Melly, Anastasiia &amp; Vy</strong>
          <small>Semester 4 · team</small>
        </p>
      </div>
    </section>

    <!-- ── what testing changed: the team's sticky on colour | before → after ── -->
    <section class="lv-sec">
      <div class="lv-wrap">
        <div class="lv-head lv-head--end">
          <span v-reveal class="lv-pill">What testing changed</span>
          <h2 v-reveal="1" class="lv-say">
            Less clutter, clearer labels <span class="lv-dim">and the navigation</span> people expect.
          </h2>
        </div>

        <article v-for="(c, i) in changes" :key="c.area" class="lv-tiles lv-change">
          <div v-reveal class="lv-tile lv-change__note" :class="`is-${changeTones[i]}`">
            <span class="lv-mark lv-change__mark" v-html="mark" />
            <p class="lv-sticky" :class="{ 'lv-sticky--b': i % 2 }">{{ c.note }}</p>
            <div class="lv-glass">
              <p class="lv-glass__text">{{ c.change }}</p>
              <footer>
                <span class="lv-glass__n">0{{ i + 1 }}</span>
                <span><strong>{{ c.area }}</strong><small>Team note from user testing</small></span>
              </footer>
            </div>
          </div>
          <div v-reveal="1" class="lv-tile lv-change__pair">
            <figure class="lv-change__shot">
              <div class="lv-phone lv-phone--old"><img :src="c.before.src" :alt="c.before.alt" loading="lazy" /></div>
              <figcaption>Before</figcaption>
            </figure>
            <span class="lv-change__arrow" aria-hidden="true">→</span>
            <figure class="lv-change__shot">
              <div class="lv-phone"><img :src="c.after.src" :alt="c.after.alt" loading="lazy" /></div>
              <figcaption class="is-after">After</figcaption>
            </figure>
          </div>
        </article>
      </div>
    </section>

    <!-- ── build: statement, an assistant tile and the stack as chips ── -->
    <section class="lv-sec">
      <div class="lv-wrap">
        <span v-reveal class="lv-pill">Build</span>
        <h2 v-reveal="1" class="lv-say lv-say--left">
          From prototype <span class="lv-dim">to a working app.</span>
        </h2>
        <p v-reveal="2" class="lv-lead">
          We built the frontend and backend together in two GitHub repos and deployed the app on
          Vercel, with a Neon (Postgres) database behind it. The app works in English, Dutch and French,
          and includes an AI voice assistant, powered by Grok, that you can ask for suggestions such as
          “suggest me a perfect activity for tomorrow”.
        </p>

        <div class="lv-build">
          <div v-reveal class="lv-voice" aria-hidden="true">
            <span class="lv-voice__mic">
              <svg viewBox="0 0 24 24"><rect x="9" y="3" width="6" height="11" rx="3" /><path d="M6 11a6 6 0 0 0 12 0M12 17v4" /></svg>
            </span>
            <p>“suggest me a perfect activity for tomorrow”</p>
            <small>AI voice assistant · Grok</small>
          </div>
          <ul v-reveal="1" class="lv-chips" aria-label="Tech stack and languages">
            <li v-for="s in stack" :key="s" :class="{ 'is-hot': s === 'Grok AI' }">{{ s }}</li>
            <li v-for="l in languages" :key="l" class="is-soft">{{ l }}</li>
          </ul>
        </div>
      </div>
    </section>

    <!-- ── closing: a quote card, then the running strip ── -->
    <section class="lv-sec lv-sec--close">
      <div class="lv-wrap">
        <div v-reveal class="lv-close">
          <span class="lv-mark lv-close__mark" v-html="mark" />
          <blockquote class="lv-quote">
            Burt’s philosophy of living “in pace with the seasons of nature” was never meant to stay on a
            shelf. <span class="lv-dim">Livio is the next step for Burt’s Bees: from a physical product to a daily digital
            experience.</span>
          </blockquote>
        </div>
      </div>
      <div class="lv-strip" aria-hidden="true">
        <div class="lv-strip__track">
          <template v-for="n in 2" :key="n">
            <span v-for="w in strip" :key="`${n}-${w}`">{{ w }}<i>✦</i></span>
          </template>
        </div>
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
  --panel: #f5ede1;
  --ink: #3b302d;
  --soft: rgba(59, 48, 45, 0.76);
  --dim: rgba(59, 48, 45, 0.42);
  --line: rgba(59, 48, 45, 0.14);
  --serif: 'Fraunces', 'Playfair Display', Georgia, serif;
  --sans: 'Poppins', var(--font-body);
  --max: 72rem;
  --sec: clamp(4.5rem, 10vw, 8.5rem);
  --radius: clamp(1.1rem, 2vw, 1.6rem);

  margin-top: clamp(1.5rem, 4vw, 3rem);
  background: var(--paper);
  color: var(--ink);
  font-family: var(--sans);
  overflow-x: clip;
}

.lv-wrap {
  position: relative;
  max-width: calc(var(--max) + 2 * var(--page-gutter));
  margin-inline: auto;
  padding-inline: var(--page-gutter);
}

/* sections meet on a thin white seam */
.lv-sec {
  padding-block: var(--sec);
  border-top: 6px solid #fff;
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

/* ---- shared type ---- */
.lv-pill {
  display: inline-block;
  padding: 0.35rem 0.85rem;
  border: 1px solid rgba(219, 0, 50, 0.45);
  border-radius: 62.4375rem;
  background: #fff;
  box-shadow: 0 0 0 4px rgba(255, 210, 3, 0.25);
  color: var(--ink);
  font-size: 0.78rem;
  font-weight: 500;
  white-space: nowrap;
}

.lv-pill--dark {
  border-color: rgba(255, 210, 3, 0.6);
  background: transparent;
  box-shadow: none;
  color: var(--cream);
}

/* two-tone statement in the headline face: the point in ink, the rest dimmed */
.lv-say,
.lv-giant,
.lv-quote,
.lv-type--head,
.lv-meter__num,
.lv-road .lv-road__big,
.lv-qa__signals h3 {
  font-family: var(--serif);
  font-variation-settings: 'SOFT' 100, 'WONK' 0;
}

.lv-say {
  font-size: clamp(1.6rem, 1.15rem + 1.9vw, 2.7rem);
  font-weight: 500;
  line-height: 1.14;
  letter-spacing: -0.015em;
  text-wrap: balance;
}

.lv-say--sm {
  font-size: clamp(1.35rem, 1.05rem + 1.1vw, 1.95rem);
}

.lv-say--lg {
  font-size: clamp(2rem, 1.3rem + 2.8vw, 3.5rem);
}

/* a statement that stands on its own line under its pill */
.lv-say--left {
  max-width: 24ch;
  margin-top: clamp(1.5rem, 4vw, 2.5rem);
}

.lv-say em {
  font-style: italic;
  color: var(--red);
}

.lv-dim {
  color: var(--dim);
}

.lv-red {
  color: var(--red);
}

.lv-body {
  font-size: 0.95rem;
  line-height: 1.7;
  color: var(--soft);
}

.lv-lead {
  max-width: 56ch;
  margin-top: var(--space-m);
  font-size: 0.98rem;
  line-height: 1.7;
  color: var(--soft);
}

.lv-chip {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 62.4375rem;
  background: var(--panel);
  font-size: 0.78rem;
  font-weight: 500;
  text-transform: capitalize;
}

.lv-chip--red {
  margin-left: 0.4rem;
  background: var(--red);
  color: #fff;
  vertical-align: middle;
  text-transform: none;
}

/* ---- section heads ---- */
.lv-head {
  margin-bottom: clamp(2.5rem, 6vw, 4.5rem);
}

/* pill on the left, statement pushed to the right */
.lv-head--end {
  display: grid;
  grid-template-columns: auto minmax(0, 40rem);
  justify-content: space-between;
  align-items: start;
  gap: 2rem;
  text-align: right;
}

.lv-head--center {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.lv-head--center .lv-say {
  max-width: 30ch;
  margin-top: 1.5rem;
}

.lv-head--center .lv-say--lg {
  max-width: 20ch;
}

/* ---- phones ---- */
/* the frame is sized around the screen, not the other way round: a 3%-of-width
   bezel on every side leaves a screen of exactly 390 / 844, so the exports sit
   in it 1:1 with nothing stretched or trimmed.
   phone H / W = 0.94 × 844 / 390 + 0.06 = 2.09426
   → the 3% bezel is 3 / 2.09426 = 1.4325% of the height */
.lv-phone {
  position: relative;
  /* <figure> ships 40px side margins that shove the pairs off a phone screen */
  margin: 0;
  aspect-ratio: 1 / 2.09426;
  border-radius: 14% / 6.685%;
  background: #0e0d0d;
  box-shadow:
    inset 0 0 0 1px #6b6662,
    inset 0 0 0 2px #1a1818,
    0 2.5rem 4rem -1.75rem rgba(59, 30, 20, 0.45),
    0 0.875rem 1.75rem -0.875rem rgba(59, 30, 20, 0.3);
}

.lv-phone img {
  position: absolute;
  top: 1.4325%;
  left: 3%;
  display: block;
  width: 94%;
  height: 97.135%;
  max-width: none;
  object-fit: cover;
  /* outer radius minus the bezel: 11% of the phone = 11.7% / 5.41% of the screen */
  border-radius: 11.7% / 5.41%;
}

/* dynamic island */
.lv-phone::after {
  content: '';
  position: absolute;
  top: 2.6%;
  left: 50%;
  width: 30%;
  height: 3.9%;
  translate: -50% 0;
  border-radius: 62.4375rem;
  background: #0e0d0d;
}

/* ---- the question: signals | arc + mark | gap, answer, proof ---- */
.lv-qa {
  display: grid;
  grid-template-columns: minmax(0, 1fr) clamp(8rem, 16vw, 14rem) minmax(0, 1fr);
  overflow: hidden;
  border-radius: var(--radius);
  background: var(--panel);
}

.lv-qa__side {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding: clamp(1.5rem, 4vw, 3rem);
}

/* positioned so it paints over the mark, which tucks in behind its edge */
.lv-qa__side--answer {
  position: relative;
  justify-content: center;
  background:
    radial-gradient(40% 35% at 10% 55%, rgba(255, 210, 3, 0.4), transparent 70%),
    #faf4ea;
}

.lv-qa__label {
  font-size: 1rem;
  font-weight: 500;
}

.lv-qa__signals {
  list-style: none;
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: space-between;
  gap: 2rem;
}

/* the middle signal sits further out, following the arc */
.lv-qa__signals li:nth-child(odd) {
  padding-left: clamp(0rem, 3vw, 2.5rem);
}

.lv-qa__signals h3 {
  font-size: clamp(1.35rem, 1.05rem + 1vw, 1.8rem);
  font-weight: 500;
  letter-spacing: -0.01em;
}

.lv-qa__signals small {
  display: block;
  margin: 0.15rem 0 0.35rem;
  font-size: 0.78rem;
  color: var(--red);
}

.lv-qa__signals p {
  max-width: 30ch;
  font-size: 0.85rem;
  line-height: 1.6;
  color: var(--soft);
}

.lv-qa__point {
  margin-top: 0.75rem;
  font-size: 0.9rem;
  line-height: 1.6;
  color: var(--soft);
}

.lv-qa__arc {
  position: relative;
  margin-block: clamp(2rem, 5vw, 4rem);
}

.lv-qa__arc svg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  overflow: visible;
}

.lv-qa__arc path {
  fill: none;
  stroke: rgba(59, 48, 45, 0.4);
  stroke-width: 1;
  vector-effect: non-scaling-stroke;
}

.lv-qa__dot {
  position: absolute;
  width: 0.55rem;
  height: 0.55rem;
  border-radius: 50%;
  background: var(--red);
  translate: -50% -50%;
}

.lv-qa__dot--top { top: 1%; left: 98%; }
.lv-qa__dot--mid { top: 50%; left: 2%; }
.lv-qa__dot--bot { top: 99%; left: 98%; }

.lv-qa__mark {
  position: absolute;
  top: 50%;
  left: 62%;
  width: 150%;
  translate: -50% -50%;
  color: var(--red);
  filter: drop-shadow(0 1.5rem 2rem rgba(219, 0, 50, 0.25));
}

/* the proof: a bar filled to four fifths */
.lv-meter {
  padding-top: 1.5rem;
  border-top: 1px solid var(--line);
}

.lv-meter__text {
  font-size: 0.82rem;
  line-height: 1.55;
  color: var(--soft);
}

.lv-meter__text em {
  font-style: normal;
  color: var(--ink);
}

.lv-meter__bar {
  position: relative;
  height: 1rem;
  margin-top: 1rem;
  background: repeating-linear-gradient(90deg, rgba(59, 48, 45, 0.25) 0 1px, transparent 1px 7px);
}

.lv-meter__bar i {
  position: absolute;
  inset: 0 20% 0 0;
  background: linear-gradient(90deg, var(--yellow), var(--red));
  transform-origin: left;
  transition: transform 1.2s cubic-bezier(0.45, 0, 0.2, 1) 0.4s;
}

.lv-qa.reveal:not(.is-revealed) .lv-meter__bar i {
  transform: scaleX(0);
}

.lv-meter__num {
  margin-top: 0.5rem;
  font-size: clamp(2.8rem, 2rem + 2.8vw, 4.4rem);
  font-weight: 500;
  line-height: 1;
  letter-spacing: -0.03em;
  color: var(--red);
}

.lv-meter__num span {
  font-size: 0.5em;
  color: var(--dim);
}

/* ---- the process: a roadmap of four columns split by hairlines ---- */
.lv-road {
  list-style: none;
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
}

.lv-road li {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.9rem;
  padding: 0.25rem clamp(1rem, 2.5vw, 1.75rem) 1rem;
  border-left: 1px solid var(--line);
}

.lv-road li:first-child {
  padding-left: 0;
  border-left: 0;
}

.lv-road h3 {
  font-size: 1rem;
  font-weight: 500;
}

.lv-road p {
  font-size: 0.86rem;
  line-height: 1.6;
  color: var(--soft);
}

.lv-road .lv-road__big {
  margin-bottom: clamp(2rem, 6vw, 4.5rem);
  font-size: clamp(1.8rem, 1.35rem + 1.5vw, 2.6rem);
  font-weight: 500;
  line-height: 1.1;
  letter-spacing: -0.02em;
  color: var(--ink);
}

/* a fading bar from an arrow to a numbered knob; the last one is filled */
.lv-road__bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 2.2rem;
  border-radius: 62.4375rem;
  background: linear-gradient(90deg, transparent 8%, rgba(249, 236, 216, 0.95) 70%);
}

.lv-road__bar i {
  display: grid;
  place-items: center;
  width: 1.9rem;
  height: 1.9rem;
  border-radius: 50%;
  background: #fff;
  font-size: 0.72rem;
  font-style: normal;
  font-weight: 600;
  box-shadow: 0 1px 4px rgba(59, 48, 45, 0.12);
}

.lv-road .is-last .lv-road__bar {
  background: linear-gradient(90deg, transparent 6%, var(--yellow) 30%, var(--red) 100%);
}

.lv-road .is-last .lv-road__end {
  background: var(--red);
  color: #fff;
  box-shadow: 0 0 0 3px #fff;
}

.lv-road__foot {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 1rem;
  margin-top: clamp(2.5rem, 6vw, 4rem);
  font-size: 0.95rem;
  font-weight: 500;
}

/* ---- getting started: the big panel ---- */
.lv-stage {
  position: relative;
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: clamp(1.5rem, 5vw, 4rem);
  margin-top: clamp(1.5rem, 4vw, 2.5rem);
  padding: clamp(1.5rem, 4vw, 3.25rem);
  overflow: hidden;
  border-radius: var(--radius);
  background:
    radial-gradient(60% 70% at 25% 100%, rgba(177, 214, 121, 0.55), transparent 70%),
    var(--yellow);
}

.lv-stage__mark {
  position: absolute;
  top: -12%;
  right: -10%;
  width: clamp(18rem, 42vw, 34rem);
  color: rgba(255, 255, 255, 0.35);
}

.lv-stage__copy {
  position: relative;
  order: 2;
  align-self: start;
  text-align: right;
}

.lv-stage__copy .lv-body {
  max-width: 40ch;
  margin: 1rem 0 0 auto;
  color: rgba(59, 48, 45, 0.85);
}

.lv-stage__phones {
  position: relative;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 14.5rem));
  /* start, not stretch: keeps the first phone at its ratio beside the offset one */
  align-items: start;
  gap: clamp(0.75rem, 2.5vw, 1.5rem);
  padding-top: clamp(1rem, 3vw, 2rem);
}

/* offsets use margin, not transform: v-reveal animates transform */
.lv-stage__phones .lv-phone:nth-child(2) {
  margin-top: clamp(2rem, 5vw, 4rem);
}

/* ---- for you: giant headline over the phones ---- */
.lv-sec--open {
  padding-bottom: clamp(2rem, 5vw, 4rem);
}

.lv-big {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.lv-giant {
  max-width: 14ch;
  margin-top: clamp(1.5rem, 4vw, 2.5rem);
  font-size: clamp(2.6rem, 1.2rem + 6vw, 6.4rem);
  font-weight: 600;
  line-height: 0.98;
  letter-spacing: -0.035em;
  text-wrap: balance;
}

.lv-big__stage {
  position: relative;
  display: flex;
  justify-content: center;
  /* not stretch: the staggered second phone makes the row taller, and a stretched
     first phone loses its 390 / 844 ratio, so cover crops the screen's sides */
  align-items: flex-start;
  gap: clamp(1rem, 3vw, 2rem);
  width: 100%;
  margin-top: clamp(-1.5rem, -2vw, -0.5rem);
  padding-block: clamp(2rem, 5vw, 3.5rem) clamp(1rem, 3vw, 2rem);
}

/* the mark spreads out behind the phones like the branch under Cuzy's */
.lv-big__mark {
  position: absolute;
  top: 50%;
  left: 50%;
  width: min(120%, 52rem);
  translate: -50% -50%;
  color: rgba(177, 214, 121, 0.45);
}

/* capped at half the stage so the tilted pair never runs off a narrow screen,
   and by the viewport height so the whole pair (tilt ≈ 2.17 × width, plus the
   stagger) fits on a short window between the navbar and the project dock */
.lv-big__phone {
  flex: 0 1 auto;
  min-width: 0;
  width: min(clamp(10rem, 22vw, 16rem), max(8rem, 32svh - 3rem));
  max-width: calc(50% - 1rem);
}

.lv-big__phone:first-of-type {
  rotate: -5deg;
}

.lv-big__phone:last-of-type {
  rotate: 5deg;
  margin-top: clamp(1.25rem, 3vw, 2rem);
}

.lv-big__text {
  margin-inline: auto;
}

/* ---- nourish + activities: one brown band ---- */
.lv-duo {
  position: relative;
  z-index: 1;
  border-top: 6px solid #fff;
}

.lv-duo__head {
  margin-bottom: clamp(2.5rem, 6vw, 4rem);
}

.lv-duo__head .lv-say {
  max-width: 24ch;
  margin-top: clamp(1.5rem, 4vw, 2.5rem);
  color: var(--cream);
}

.lv-duo__head .lv-dim {
  color: rgba(249, 236, 216, 0.55);
}

.lv-duo__band {
  display: flow-root;
  padding-top: var(--sec);
  padding-bottom: 0;
  background:
    radial-gradient(60% 50% at 80% 40%, rgba(255, 210, 3, 0.14), transparent 70%),
    var(--brown);
  color: var(--cream);
}

.lv-duo__row {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: clamp(1.5rem, 5vw, 4rem);
  align-items: end;
}

.lv-duo__pair {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 13.5rem));
  justify-content: end;
  gap: clamp(0.75rem, 2vw, 1.25rem);
}

.lv-duo__text {
  max-width: 38ch;
  padding-bottom: 0.5rem;
  font-size: 0.95rem;
  line-height: 1.7;
  color: rgba(249, 236, 216, 0.82);
}

.lv-duo__text .lv-say {
  margin-block: 1rem 0.75rem;
  color: var(--cream);
}

.lv-duo__row--second {
  align-items: center;
  margin-top: clamp(4rem, 9vw, 7rem);
}

.lv-duo__solo {
  width: min(100%, 14.5rem);
}

/* the last phone hangs off the bottom of the band */
.lv-duo__tail {
  width: clamp(11rem, 20vw, 15rem);
  margin: clamp(2rem, 5vw, 3rem) auto clamp(-10rem, -14vw, -6rem);
}

.lv-sec--after-duo {
  padding-top: calc(var(--sec) + clamp(6rem, 14vw, 10rem));
}

/* ---- the brand ---- */
.lv-construct {
  position: relative;
  width: min(100%, 22rem);
  aspect-ratio: 1;
  margin: clamp(1.5rem, 4vw, 2.5rem) auto 0;
  border-radius: 1rem;
  background:
    radial-gradient(circle, rgba(59, 48, 45, 0.16) 1px, transparent 1.5px) 0 0 / 14px 14px,
    var(--panel);
}

.lv-construct__guides {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

.lv-construct__guides line,
.lv-construct__guides circle {
  fill: none;
  stroke: rgba(59, 48, 45, 0.35);
  stroke-width: 1;
  stroke-dasharray: 4 4;
  vector-effect: non-scaling-stroke;
}

.lv-construct__mark {
  position: absolute;
  inset: 18%;
  color: rgba(94, 80, 77, 0.28);
}

.lv-brand-say {
  max-width: 34rem;
  margin: clamp(2.5rem, 6vw, 4rem) 0 clamp(3rem, 7vw, 5rem) auto;
  text-align: right;
}

.lv-brand-say .lv-lead {
  margin-left: auto;
}

/* soft tiles, two to a row */
.lv-tiles {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: clamp(0.5rem, 1vw, 0.75rem);
}

.lv-tile {
  position: relative;
  display: grid;
  place-items: center;
  overflow: hidden;
  padding: clamp(2rem, 5vw, 3.75rem) 1rem;
  border-radius: var(--radius);
  background: var(--panel);
}

.lv-tiles > .lv-tile:not(.lv-change__note, .lv-change__pair) {
  aspect-ratio: 16 / 9;
}

.lv-tile--img {
  display: block;
  padding: 0;
  color: inherit;
  text-decoration: none;
  cursor: zoom-in;
}

.lv-tile--img img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: scale 0.6s var(--ease-soft);
}

.lv-tile--img:hover img {
  scale: 1.03;
}

/* captions: two small labels in the bottom corners */
.lv-tile__cap {
  position: absolute;
  inset: auto 1.1rem 1rem;
  display: flex;
  justify-content: space-between;
  gap: 0.5rem;
  pointer-events: none;
}

.lv-tile__cap span {
  padding: 0.3rem 0.75rem;
  border-radius: 62.4375rem;
  background: rgba(255, 255, 255, 0.92);
  box-shadow: 0 2px 8px rgba(59, 48, 45, 0.12);
  color: var(--ink);
  font-size: 0.78rem;
  font-weight: 500;
}

.lv-tile__cap span:last-child {
  color: var(--red);
}

/* guideline pages fanned out on a wide arc, like Cuzy's photo wheel */
.lv-arc {
  position: relative;
  height: clamp(11rem, 32vw, 26rem);
  margin-top: clamp(3rem, 7vw, 5rem);
  overflow: hidden;
}

.lv-arc__card {
  position: absolute;
  top: clamp(1.5rem, 3vw, 2.5rem);
  left: 50%;
  width: clamp(11rem, 22vw, 19rem);
  aspect-ratio: 16 / 9;
  margin-left: calc(clamp(11rem, 22vw, 19rem) / -2);
  overflow: hidden;
  border-radius: 1rem;
  box-shadow: 0 1.25rem 2.5rem -1.25rem rgba(59, 48, 45, 0.45);
  transform-origin: 50% 420%;
  /* the fan always spans the same ~70deg, however many pages it holds */
  rotate: calc(var(--k) * 70deg / (var(--n) - 1));
  cursor: zoom-in;
  transition: translate 0.4s var(--ease-soft);
}

.lv-arc__card:hover {
  z-index: 50 !important;
  translate: 0 -0.75rem;
}

.lv-arc__card img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* ---- typography & colour ---- */
.lv-type {
  line-height: 1;
  text-align: center;
}

.lv-type--head {
  margin-top: clamp(2rem, 5vw, 3.5rem);
  font-size: clamp(5rem, 2rem + 13vw, 13rem);
  font-weight: 600;
  letter-spacing: -0.04em;
  color: var(--red);
}

.lv-type--body {
  font-size: clamp(2.6rem, 1.4rem + 5vw, 5.5rem);
  font-weight: 500;
  letter-spacing: -0.03em;
}

/* a tick scale with the active face in the middle */
.lv-scale {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  margin-block: clamp(1.5rem, 4vw, 2.5rem);
}

.lv-scale__ticks {
  flex: 1;
  height: 1.4rem;
  background: repeating-linear-gradient(90deg, rgba(59, 48, 45, 0.35) 0 1px, transparent 1px 9px);
}

.lv-scale__pill {
  padding: 0.3rem 0.8rem;
  border: 1px solid rgba(219, 0, 50, 0.45);
  border-radius: 62.4375rem;
  font-size: 0.75rem;
  white-space: nowrap;
}

.lv-scale__pill--on {
  border-color: var(--red);
  background: var(--red);
  color: #fff;
}

/* palette as circles: three on top, two centred beneath */
.lv-swatches {
  list-style: none;
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  gap: clamp(1.5rem, 4vw, 2.5rem) clamp(1rem, 3vw, 2rem);
  max-width: 54rem;
  margin: clamp(3.5rem, 8vw, 6rem) auto 0;
}

.lv-swatches li {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.35rem;
  text-align: center;
}

.lv-swatches li { grid-column: span 2; }
.lv-swatches li:nth-child(4) { grid-column: 2 / span 2; }

.lv-swatches__dot {
  width: min(100%, 9rem);
  aspect-ratio: 1;
  margin-bottom: 0.6rem;
  border-radius: 50%;
  box-shadow: inset 0 0 0 1px var(--line);
}

.lv-swatches strong {
  font-size: 0.95rem;
  font-weight: 500;
}

.lv-swatches code {
  font-family: var(--sans);
  font-size: 0.85rem;
  color: var(--soft);
}

/* ---- business model: points staggered right / left ---- */
.lv-stagger {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: clamp(2rem, 5vw, 3.5rem) clamp(2rem, 8vw, 7rem);
  margin-top: clamp(3rem, 7vw, 5rem);
}

.lv-stagger > div {
  max-width: 26rem;
}

.lv-stagger > div:nth-child(odd) {
  grid-column: 2;
}

.lv-stagger > div:nth-child(even) {
  grid-column: 1;
}

.lv-stagger > div:nth-child(1) { grid-row: 1; }
.lv-stagger > div:nth-child(2) { grid-row: 2; }
.lv-stagger > div:nth-child(3) { grid-row: 3; }
.lv-stagger > div:nth-child(4) { grid-row: 4; }

.lv-stagger dt {
  margin-bottom: 0.5rem;
  font-family: var(--serif);
  font-variation-settings: 'SOFT' 100, 'WONK' 0;
  font-size: clamp(1.3rem, 1.1rem + 0.7vw, 1.65rem);
  font-weight: 500;
}

.lv-stagger dd {
  font-size: 0.9rem;
  line-height: 1.65;
  color: var(--soft);
}

.lv-stagger__bar {
  display: block;
  height: 1.1rem;
  margin-top: 1.25rem;
  background: repeating-linear-gradient(90deg, rgba(59, 48, 45, 0.3) 0 1px, transparent 1px 8px);
}

.lv-stagger .is-main .lv-stagger__bar {
  background:
    linear-gradient(90deg, var(--yellow), var(--red)) 0 0 / 70% 100% no-repeat,
    repeating-linear-gradient(90deg, rgba(59, 48, 45, 0.3) 0 1px, transparent 1px 8px);
}

.lv-ux-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: clamp(0.5rem, 1vw, 0.75rem);
}

.lv-ux {
  aspect-ratio: 16 / 9;
  background: #fff;
}

/* ---- user persona: profile, quote, then five columns of notes ---- */
.lv-persona {
  margin-bottom: clamp(0.5rem, 1vw, 0.75rem);
  padding: clamp(1.25rem, 3vw, 2.25rem);
  border-radius: var(--radius);
  background: var(--panel);
}

.lv-persona__head {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) minmax(0, 1.4fr);
  grid-template-areas:
    'face who quote'
    'traits traits quote';
  gap: 1rem clamp(1rem, 2.5vw, 2rem);
  align-items: center;
  margin-bottom: clamp(1.5rem, 3vw, 2.25rem);
}

.lv-persona__face {
  grid-area: face;
  width: clamp(4rem, 7vw, 5.5rem);
  height: auto;
  border-radius: 50%;
  box-shadow: 0 0 0 3px #fff;
}

.lv-persona__who {
  grid-area: who;
  display: grid;
  gap: 0.2rem;
}

.lv-persona__role {
  color: var(--red);
  font-size: 0.78rem;
  font-weight: 500;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.lv-persona__name {
  font-family: var(--serif);
  font-size: clamp(1.5rem, 1.2rem + 1vw, 2rem);
  font-weight: 500;
  line-height: 1.1;
}

.lv-persona__facts,
.lv-persona__traits {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
  margin: 0.35rem 0 0;
  padding: 0;
  list-style: none;
}

.lv-persona__facts li,
.lv-persona__traits li {
  padding: 0.25rem 0.7rem;
  border-radius: 62.4375rem;
  background: #fff;
  color: var(--soft);
  font-size: 0.75rem;
}

.lv-persona__traits {
  grid-area: traits;
  margin: 0;
}

.lv-persona__quote {
  grid-area: quote;
  margin: 0;
  padding-left: clamp(1rem, 2.5vw, 2rem);
  border-left: 2px solid var(--red);
  font-size: clamp(1rem, 0.9rem + 0.4vw, 1.2rem);
  font-weight: 500;
  line-height: 1.45;
  text-wrap: pretty;
}

.lv-persona__cols {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: clamp(0.4rem, 0.8vw, 0.6rem);
}

.lv-persona__col {
  --note: var(--cream);
  --note-ink: var(--ink);
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}
.lv-persona__col.is-green { --note: var(--green); }
.lv-persona__col.is-yellow { --note: var(--yellow); }
.lv-persona__col.is-white { --note: #fff; }
.lv-persona__col.is-red { --note: var(--red); --note-ink: #fff; }

.lv-persona__col h3 {
  margin: 0 0 0.2rem;
  padding: 0.55rem 0.75rem;
  border-radius: 0.6rem;
  background: var(--ink);
  color: #fff;
  font-size: 0.8rem;
  font-weight: 500;
  text-align: center;
}

.lv-persona__col ul {
  display: grid;
  gap: 0.4rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.lv-persona__col li {
  padding: 0.7rem 0.75rem;
  border-radius: 0.6rem;
  background: var(--note);
  color: var(--note-ink);
  font-size: 0.82rem;
  line-height: 1.35;
}

@media (max-width: 1100px) {
  .lv-persona__cols {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    row-gap: 1.25rem;
  }
}

@media (max-width: 720px) {
  .lv-persona__head {
    grid-template-columns: auto minmax(0, 1fr);
    grid-template-areas:
      'face who'
      'quote quote'
      'traits traits';
  }

  .lv-persona__cols {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 460px) {
  .lv-persona__cols {
    grid-template-columns: 1fr;
  }
}

/* ---- team: byline under the statement ---- */
.lv-team {
  margin-bottom: 0;
}

.lv-byline {
  display: grid;
  justify-items: center;
  gap: 0.2rem;
  margin-top: clamp(2rem, 5vw, 3rem);
}

.lv-byline__faces {
  display: flex;
  margin-bottom: 0.5rem;
}

.lv-byline__faces i {
  display: grid;
  place-items: center;
  width: 2.3rem;
  height: 2.3rem;
  margin-left: -0.5rem;
  border-radius: 50%;
  background: var(--yellow);
  box-shadow: 0 0 0 2px var(--paper);
  font-size: 0.8rem;
  font-style: normal;
  font-weight: 600;
}

.lv-byline__faces i:first-child {
  margin-left: 0;
}

.lv-byline__faces i:nth-child(2) {
  background: var(--green);
}

.lv-byline__faces i:nth-child(3) {
  background: var(--red);
  color: #fff;
}

.lv-byline strong {
  font-weight: 500;
}

.lv-byline small {
  font-size: 0.78rem;
  color: var(--dim);
}

/* ---- testing: the team's sticky on colour | before → after ---- */
.lv-change {
  margin-top: clamp(0.5rem, 1vw, 0.75rem);
  /* the screens get the wider side */
  grid-template-columns: minmax(0, 2fr) minmax(0, 3fr);
}

.lv-change__note {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  gap: 1.5rem;
  padding: clamp(1.5rem, 4vw, 3rem);
}

.lv-change__note.is-red { background: var(--red); }
.lv-change__note.is-green { background: var(--green); }
.lv-change__note.is-brown { background: var(--brown); }
.lv-change__note.is-yellow { background: var(--yellow); }

.lv-change__mark {
  position: absolute;
  right: -18%;
  bottom: -22%;
  width: 75%;
  color: rgba(255, 255, 255, 0.16);
}

/* the team's notes were FigJam stickies, so they stay stickies */
.lv-sticky {
  position: relative;
  width: clamp(10rem, 18vw, 13rem);
  min-height: clamp(9rem, 16vw, 11rem);
  padding: 1.1rem 1.15rem 1.4rem;
  background: var(--yellow);
  color: var(--ink);
  font-family: var(--font-hand);
  font-size-adjust: var(--hand-size-adjust);
  -webkit-text-stroke: var(--hand-stroke) currentColor;
  font-size: 1rem;
  line-height: 1.7;
  box-shadow:
    0 1px 0 rgba(0, 0, 0, 0.04),
    0 1.125rem 1.625rem -1.125rem rgba(59, 48, 45, 0.55);
  rotate: -3deg;
}

/* on the yellow tile the sticky turns white so it still reads as paper */
.lv-sticky--b {
  background: #fff8d6;
  rotate: 2.5deg;
}

.lv-change__note.is-yellow .lv-sticky {
  background: #fff;
}

/* a frosted card under the sticky with what changed */
.lv-glass {
  position: relative;
  align-self: stretch;
  max-width: 24rem;
  padding: 1.1rem 1.25rem;
  border: 1px solid rgba(255, 255, 255, 0.4);
  border-radius: 1.1rem;
  background: rgba(255, 255, 255, 0.18);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  color: #fff;
}

.lv-change__note.is-green .lv-glass,
.lv-change__note.is-yellow .lv-glass {
  border-color: rgba(59, 48, 45, 0.15);
  background: rgba(255, 255, 255, 0.45);
  color: var(--ink);
}

.lv-glass__text {
  font-size: 0.85rem;
  line-height: 1.6;
}

.lv-glass footer {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-top: 1rem;
}

.lv-glass__n {
  display: grid;
  place-items: center;
  width: 2.3rem;
  height: 2.3rem;
  border-radius: 50%;
  background: var(--yellow);
  color: var(--ink);
  font-size: 0.8rem;
  font-weight: 600;
}

.lv-change__note.is-yellow .lv-glass__n {
  background: var(--red);
  color: #fff;
}

.lv-glass footer strong {
  display: block;
  font-weight: 500;
}

.lv-glass footer small {
  font-size: 0.72rem;
  opacity: 0.75;
}

.lv-change__pair {
  display: grid;
  /* fr tracks, not auto: the screens are absolutely positioned, so content-sized
     columns collapse to the caption's width */
  grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
  align-items: center;
  gap: clamp(0.5rem, 2vw, 1.25rem);
  padding: clamp(1.5rem, 4vw, 3rem) clamp(1rem, 3vw, 2.5rem);
}

.lv-change__shot {
  justify-self: center;
  width: 100%;
  max-width: 17rem;
  margin: 0;
}

.lv-change__arrow {
  font-size: 1.6rem;
  color: var(--red);
}

.lv-change__shot figcaption {
  margin-top: 0.75rem;
  text-align: center;
  font-size: 0.8rem;
  color: var(--dim);
}

.lv-change__shot figcaption.is-after {
  color: var(--red);
  font-weight: 500;
}

.lv-phone--old {
  box-shadow:
    inset 0 0 0 1px #6b6662,
    inset 0 0 0 2px #1a1818,
    0 0.875rem 1.75rem -1.125rem rgba(59, 30, 20, 0.35);
}

.lv-phone--old img {
  filter: grayscale(0.35);
  opacity: 0.85;
}

/* ---- build: assistant tile + chips, like Cuzy's icon grid ---- */
.lv-build {
  display: grid;
  grid-template-columns: minmax(0, 18rem) minmax(0, 1fr);
  gap: clamp(1.5rem, 5vw, 4rem);
  align-items: center;
  margin-top: clamp(2.5rem, 6vw, 4rem);
}

.lv-voice {
  display: grid;
  justify-items: start;
  gap: 0.75rem;
  padding: 1.5rem;
  border-radius: var(--radius);
  background: var(--panel);
}

.lv-voice__mic {
  display: grid;
  place-items: center;
  width: 2.75rem;
  height: 2.75rem;
  border-radius: 50%;
  background: var(--red);
}

.lv-voice__mic svg {
  width: 1.3rem;
  fill: none;
  stroke: #fff;
  stroke-width: 1.8;
  stroke-linecap: round;
}

.lv-voice p {
  font-family: var(--serif);
  font-variation-settings: 'SOFT' 100, 'WONK' 0;
  font-size: 1.2rem;
  line-height: 1.3;
}

.lv-voice small {
  font-size: 0.75rem;
  color: var(--dim);
}

.lv-chips {
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
}

.lv-chips li {
  padding: 0.6rem 1.1rem;
  border: 1px solid rgba(219, 0, 50, 0.4);
  border-radius: 0.9rem;
  background: #fff;
  font-size: 0.92rem;
}

.lv-chips li.is-hot {
  border-color: var(--red);
  background: var(--red);
  color: #fff;
}

.lv-chips li.is-soft {
  border-color: transparent;
  background: var(--cream);
}

/* ---- closing: quote card + running strip ---- */
.lv-sec--close {
  padding-bottom: 0;
}

.lv-close {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  overflow: hidden;
  padding: clamp(2.5rem, 7vw, 5rem) clamp(1.5rem, 5vw, 4rem);
  border-radius: var(--radius);
  background: var(--panel);
  text-align: center;
}

.lv-close__mark {
  position: absolute;
  width: clamp(16rem, 32vw, 28rem);
  top: clamp(-14rem, -13vw, -6rem);
  right: clamp(-15rem, -15vw, -7rem);
  color: rgba(219, 0, 50, 0.06);
}

.lv-quote {
  position: relative;
  max-width: 30ch;
  font-size: clamp(1.5rem, 1.1rem + 1.8vw, 2.5rem);
  font-weight: 500;
  line-height: 1.18;
  letter-spacing: -0.015em;
  text-wrap: balance;
}

.lv-strip {
  margin-top: clamp(2.5rem, 6vw, 4rem);
  overflow: hidden;
  background: var(--red);
  color: #fff;
}

.lv-strip__track {
  display: flex;
  width: max-content;
  padding-block: 0.8rem;
  font-family: var(--serif);
  font-variation-settings: 'SOFT' 100, 'WONK' 0;
  font-size: clamp(1.1rem, 0.9rem + 0.8vw, 1.6rem);
  white-space: nowrap;
}

.lv-strip__track span {
  display: inline-flex;
  align-items: center;
}

.lv-strip__track i {
  margin-inline: 1.1rem;
  font-size: 0.6em;
  font-style: normal;
  color: var(--yellow);
}

@media (prefers-reduced-motion: no-preference) {
  .lv-strip__track {
    animation: lv-run 40s linear infinite;
  }
}

@keyframes lv-run {
  to {
    translate: -50% 0;
  }
}

/* ---- responsive ---- */
@media (max-width: 960px) {
  .lv-qa {
    grid-template-columns: 1fr;
  }

  /* stacked: the arc gives way to the mark on its own */
  .lv-qa__arc {
    height: 9rem;
    margin: 0;
  }

  .lv-qa__arc svg,
  .lv-qa__dot {
    display: none;
  }

  .lv-qa__mark {
    left: 50%;
    width: 8rem;
  }

  .lv-road {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    row-gap: 2.5rem;
  }

  .lv-road li:nth-child(3) {
    padding-left: 0;
    border-left: 0;
  }

  .lv-road .lv-road__big {
    margin-bottom: 1rem;
  }

  .lv-stage {
    grid-template-columns: 1fr;
  }

  .lv-stage__copy {
    order: 0;
    text-align: left;
  }

  .lv-stage__copy .lv-body {
    margin-left: 0;
  }

  .lv-stage__phones {
    justify-content: center;
  }

  .lv-duo__row {
    grid-template-columns: 1fr;
  }

  .lv-duo__pair {
    justify-content: center;
  }

  .lv-duo__row--first .lv-duo__text {
    order: 2;
  }

  .lv-duo__solo {
    justify-self: center;
  }

  .lv-build {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 720px) {
  .lv-head--end {
    grid-template-columns: 1fr;
    justify-items: start;
    gap: 1.25rem;
    text-align: left;
  }

  .lv-road,
  .lv-tiles,
  .lv-ux-grid,
  .lv-stagger {
    grid-template-columns: 1fr;
  }

  .lv-road li {
    padding-left: 0;
    border-left: 0;
  }

  .lv-stagger > div:nth-child(n) {
    grid-column: 1;
    grid-row: auto;
  }

  .lv-brand-say {
    text-align: left;
  }

  .lv-brand-say .lv-lead {
    margin-left: 0;
  }

  .lv-scale__pill:not(.lv-scale__pill--on) {
    display: none;
  }

  .lv-big__phone:last-of-type {
    margin-top: 1.5rem;
  }
}
</style>
