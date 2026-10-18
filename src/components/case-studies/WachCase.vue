<script setup>
/**
 * WACH: case study.
 *
 * Laid out like a product-design showcase on a dark page: a hero with the
 * name set huge behind the app, then chapters that each open with a small
 * dotted label and a large statement whose key words light up in neon.
 * It shows the current UI only: problem → research → name → coaches →
 * user flow → process → features → business model → four design principles → grid, type and
 * colour → navigation → build → reflection.
 *
 * Dressed in WACH's own world: navy surfaces for the calm, intelligent side,
 * neon green for energy and action, orange for warnings, and Epilogue (loaded
 * in index.html), the app's only typeface.
 *
 *  · Screens: 1398×2034 captures of the Vue prototype (WACH repo), run
 *    at 466×678 (iPhone Duo folded) as a touch device so it renders full
 *    screen, not in its frame. Wide screens: 890×626 (iPhone Duo unfolded) at 3x.
 *  · User flow: the FigJam board "Methodology DP2", sections "User Flows" and
 *    "Navigation Concept".
 *  · Coach copy quoted here matches src/data/coaches.js and metrics.js there.
 *
 * The page header, cover and facts row come from src/data/projects.js.
 */
const K = '/assets/works/wach'

const disciplines = ['UX Research', 'Concept', 'UI Design', 'UX Design', 'Prototype', 'Design system']

const facts = [
  ['Project', 'WACH'],
  ['Year', '2025'],
]

const coaches = [
  { id: 'clara', name: 'Clara', title: 'The calm strategist', motto: 'Slow is smooth. Smooth is fast.' },
  { id: 'blaze', name: 'Blaze', title: 'The hype partner', motto: 'Show up. I’ll handle the rest.' },
  { id: 'theo', name: 'Theo', title: 'The caring mentor', motto: 'Listen to your body first.' },
]

const phases = [
  { name: 'Discover', when: 'Diverge', items: ['Desk research', 'User interviews', 'Personas'] },
  { name: 'Define', when: 'Converge', items: ['Feature prioritisation', 'User journeys', 'User stories'] },
  { name: 'Develop', when: 'Diverge', items: ['Paper prototype', 'Wireframes', 'Lo-fi prototype'] },
  { name: 'Deliver', when: 'Converge', items: ['Interactive design', 'Design system'] },
]

const quotes = [
  'Last month I pushed through a run even though I felt off. Later I realized my heart rate had spiked, but the app never warned me!',
  'During my period, my runs feel completely different. I wish the app would adjust my training plan instead of acting like nothing’s changed.',
  'I was fasting during Ramadan, and I wish my app had given me tips for training during that time.',
]

// what the interviews surfaced, and which WACH feature answers it
const insights = [
  { pain: 'Overwhelmed by health metrics', answer: 'Every metric translated into plain language' },
  { pain: 'No warning when the heart rate spiked', answer: 'Live coaching and emergency detection' },
  { pain: 'Plans ignore the menstrual cycle', answer: 'Cycle-aware training' },
  { pain: 'No help when fasting or unwell', answer: 'Status that adapts the plan' },
]

// the user flow, from the FigJam board "Methodology DP2"
const flow = [
  { name: 'Entry', steps: ['Landing page', 'Login or register', 'Accept data & privacy'] },
  { name: 'First time', steps: ['Connect wearable', 'Baseline sync (7–30 days)', 'Goal setup', 'Dashboard tour'] },
  { name: 'Daily use', steps: ['Today’s plan', 'Pre-run check', 'Live run', 'Post-run summary', 'Auto-save & sync'] },
]

const systems = [
  { name: 'AI engine', text: 'Run data, fatigue and feedback in; adaptive goals, fatigue scores and daily advice out.' },
  { name: 'Streak engine', text: 'Tracks streaks, milestones and missed days, and praises you in the app.' },
  { name: 'Safety monitor', text: 'Detects sharp heart-rate spikes and prompts a pause.' },
]

const features = [
  { name: 'Choose your AI coach', text: 'Three coaches, each with their own personality, motto and tone.' },
  { name: 'Daily read of your body', text: 'Every morning the coach reads sleep, resting heart rate, recovery, cycle phase and training load, then proposes a plan change you accept or decline.' },
  { name: 'Adaptive plan', text: 'Every change shows the original session, the new one, and the reason.' },
  { name: 'Live coaching', text: 'Plain-language cues during the run, like “slow down until you could chat again”.' },
  { name: 'Post-run debrief', text: 'Blends the session with sleep, cycle and your own notes and symptoms, then says what changes next.' },
  { name: 'Emergency detection', text: 'If you stop moving and your heart rate drops sharply, a 90-second countdown starts. No response, and your guardians get your live location.' },
  { name: 'Cycle-aware training', text: 'Intensity and advice adjust to the phase of your menstrual cycle.' },
  { name: 'Status', text: 'Flag injured, sick, fasting, traveling, feeling low or a special occasion, and the plan adapts.' },
  { name: 'Photo widget home', text: 'Your own photos, a greeting, and outfit advice based on the weather.' },
]

const featureScreens = [
  { src: `${K}/session.jpg`, label: 'Session', alt: 'Today’s session: easy run 35 minutes, structured by effort (“you can talk in full sentences”), with a note that Guardian mode is on' },
  { src: `${K}/debrief.jpg`, label: 'Debrief', alt: 'AI debrief: “Solid session, but your first kilometre was too fast”, with an annotated pace chart and notes on pacing, sleep and what changes next' },
  { src: `${K}/me.jpg`, label: 'Me', alt: 'Me: the half-marathon goal with a coach note, and the safety section with Guardian mode on and two guardians' },
]

// freemium: the free tier keeps every runner safe, premium sells the coaching
const tiers = [
  {
    name: 'WACH Free',
    price: '€0',
    per: 'forever',
    pitch: 'Everything that keeps you safe and informed.',
    items: ['One coach', 'Wearable sync and daily read', 'Every metric in plain language', 'Status', 'Guardian mode and emergency detection'],
  },
  {
    name: 'WACH Premium',
    price: '€7.99',
    per: 'a month, or €59.99 a year',
    pitch: 'Everything that makes you a better runner.',
    items: ['All three coaches', 'Adaptive plan that explains itself', 'Live coaching', 'Post-run debrief', 'Cycle-aware training', 'Race goals'],
    key: true,
  },
]

const streams = [
  { name: 'Expert add-ons', text: 'When you flag “injured” or ask about fuelling, the coach can book a physio or sports nutritionist in the app. WACH takes a booking commission.' },
  { name: 'Team licences', text: 'Clubs, schools and running groups pay per seat each year. Trainers see aggregated data, and only what each runner chooses to share.' },
  { name: 'Gear partners', text: 'Shoe advice based on your mileage and outfit advice based on the weather, with partner links that are always labelled.' },
]

const promises = ['No ads', 'No selling health data', 'Safety features free, forever']

const rules = [
  { name: 'Every metric is translated.', text: 'A human name (“Recovery”, not “HRV”), where today sits against your own normal range, what it means, and what to do. The technical term stays in small print, and tapping any metric opens an explainer.' },
  { name: 'The coach speaks first.', text: 'Every screen opens with an interpretation. The numbers come after, as evidence.' },
  { name: 'Every change explains itself.', text: 'Adapted sessions show what changed and why, and the coach keeps a log of every decision.' },
  { name: 'Safety is always visible.', text: 'Guardian mode shows during every session instead of hiding in settings.' },
]

// the metric pattern from rule 1, with the copy of the Recovery explainer (metrics.js)
const anatomy = [
  { step: 'Human name', text: 'Recovery', small: 'Heart rate variability (HRV) · ms' },
  { step: 'Your normal', text: 'Lower than your normal', small: '38 ms today, your normal is 46–58' },
  { step: 'What it means', text: 'Your recovery has been dropping for 5 days in a row.' },
  { step: 'What to do', text: 'No intervals until it climbs back into your normal range.' },
]

const conventions = [
  '44px minimum touch targets',
  'Safe areas for the notch and home bar',
  'Text inputs of 16px or more, so iOS doesn’t zoom',
  'Reduced-motion support',
  'An accessible name on every control',
]

// brand colours, grouped by the moodboard's two axes
const palette = [
  { name: 'Super Dark Navy', hex: '#073045', rgb: '7 48 69', axis: 'calm' },
  { name: 'Navy', hex: '#0A5E8A', rgb: '10 94 138', axis: 'calm' },
  { name: 'Super Light Grey', hex: '#F4F8FA', rgb: '244 248 250', axis: 'calm' },
  { name: 'Neon Green', hex: '#B3F83B', rgb: '179 248 59', axis: 'energy' },
  { name: 'Orange', hex: '#FFA042', rgb: '255 160 66', axis: 'energy' },
]

const axes = [
  { name: 'Trust, calm, intelligence', use: 'Navy surfaces and the coach’s voice.' },
  { name: 'Energy, motion, alertness', use: 'Neon green for actions and active states, orange for warnings.' },
]

const weights = [['Regular', 400], ['Medium', 500], ['Semi-bold', 600], ['Bold', 700], ['Extra-bold', 800]]

const onboarding = [
  { src: `${K}/welcome.jpg`, label: 'Logo splash', alt: 'Onboarding: the WACH logo on a light screen with a Get started button' },
  { src: `${K}/choose-coach.jpg`, label: 'Choose a coach', alt: 'Onboarding: choose your coach, with Clara selected and a preview of how she would describe today' },
  { src: `${K}/meet-coach.jpg`, label: 'Meet your coach', alt: 'Onboarding: Clara introduces herself and offers to read your watch every morning' },
]

const wide = [
  { src: `${K}/wide-today.jpg`, caption: 'Today in two columns, with the navigation as a side rail.', alt: 'Unfolded Today: side rail on the left, the coach’s read of your body in one column and the day’s plan, cycle and habit tip in the other' },
  { src: `${K}/wide-metric.jpg`, caption: 'Metric explainers open as a side panel, so the screen they explain stays visible.', alt: 'Unfolded Today with the Recovery explainer open as a side panel on the right' },
  { src: `${K}/wide-plan.jpg`, caption: 'Plan keeps the goal and the coach’s summary pinned while the week scrolls.', alt: 'Unfolded Plan: the half-marathon goal and Clara’s weekly note on the left, the week’s sessions on the right' },
]
</script>

<template>
  <div class="wc">
    <!-- ── hero: the name huge behind the app ── -->
    <section class="wc-hero">
      <div class="wc-wrap">
        <div class="wc-hero__pills" aria-hidden="true">
          <span>Mobile app</span>
          <span>2025</span>
        </div>
        <p class="wc-hero__word" aria-hidden="true">WACH</p>
        <div class="wc-hero__stage">
          <span class="wc-hero__glow" aria-hidden="true" />
          <div class="wc-hero__devices">
            <figure v-reveal="{ y: 40 }" class="wc-hero__device">
              <div class="wc-phone">
                <img :src="`${K}/today-clara.jpg`" alt="WACH Today on the folded iPhone Duo: Clara’s morning read, “Go easy today”, above translated metric cards" />
              </div>
              <figcaption>Folded</figcaption>
            </figure>
            <figure v-reveal="{ y: 40, delay: 120 }" class="wc-hero__device wc-hero__device--wide">
              <div class="wc-duo">
                <img :src="`${K}/wide-today.jpg`" alt="WACH Today on the unfolded iPhone Duo: a side rail, the coach’s read in one column and the day’s plan in the other" />
              </div>
              <figcaption>Unfolded</figcaption>
            </figure>
          </div>
          <p v-reveal="2" class="wc-bubble wc-bubble--a" aria-hidden="true">HRV 38 ms</p>
          <p v-reveal="3" class="wc-bubble wc-bubble--b" aria-hidden="true">Recovery: lower than your normal</p>
        </div>
      </div>
    </section>

    <!-- ── about the project ── -->
    <section class="wc-sec">
      <div class="wc-wrap">
        <p v-reveal class="wc-label">About project</p>
        <blockquote v-reveal class="wc-about__quote">
          <span class="wc-about__mark" aria-hidden="true">“</span>
          Your watch collects the data. WACH tells you what it means: a running coach that turns
          wearable data into plain-language advice, so you know when to push, when to rest and how to
          stay safe.
        </blockquote>

        <div class="wc-about">
          <div v-reveal>
            <ul class="wc-chips" aria-label="Disciplines">
              <li v-for="d in disciplines" :key="d">{{ d }}</li>
            </ul>
            <dl class="wc-facts">
              <div v-for="[k, v] in facts" :key="k">
                <dt>{{ k }}</dt>
                <dd>{{ v }}</dd>
              </div>
            </dl>
          </div>
          <div v-reveal="1">
            <h3 class="wc-h4">About project</h3>
            <p class="wc-body">
              A concept app for runners and joggers who don’t care about leaderboards, but do care about
              training smart, improving safely and knowing their effort matches their goals.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- ── problem & solution ── -->
    <section class="wc-sec">
      <div class="wc-wrap">
        <div class="wc-head">
          <p v-reveal class="wc-label">Problem &amp; solution</p>
          <h2 v-reveal="1" class="wc-lead">
            Smartwatches collect everything. Most running apps just show it back as
            <b>dashboards and charts</b>: <mark>numbers, not answers</mark>.
          </h2>
        </div>

        <div class="wc-ps">
          <article v-reveal class="wc-card">
            <p class="wc-tag"><i class="wc-dot wc-dot--orange" />Problem</p>
            <h3 class="wc-h3">Raw numbers, no interpretation</h3>
            <p class="wc-body">
              Runners get heart rate, cadence, sleep and elevation, but not insight. They don’t know when
              to push, when to rest, or how to adjust safely.
            </p>
          </article>
          <article v-reveal="1" class="wc-card">
            <p class="wc-tag"><i class="wc-dot" />Solution</p>
            <h3 class="wc-h3">An AI coach that translates</h3>
            <p class="wc-body">
              WACH reads the data your watch already collects and tells you, in plain language, what your
              body is saying today and what to do about it.
            </p>
          </article>
          <article v-reveal="2" class="wc-card wc-card--neon">
            <p class="wc-tag"><i class="wc-dot wc-dot--navy" />How might we</p>
            <p class="wc-hmw">
              transform overwhelming wearable data into simple, actionable guidance for runners and
              joggers, in real time?
            </p>
          </article>
        </div>
      </div>
    </section>

    <!-- ── research ── -->
    <section class="wc-sec">
      <div class="wc-wrap">
        <div class="wc-head">
          <p v-reveal class="wc-label">Research</p>
          <h2 v-reveal="1" class="wc-lead">
            I interviewed two runners about how they use their running apps today. The data was
            there, <mark>the interpretation was missing</mark>.
          </h2>
        </div>

        <div class="wc-quotes">
          <blockquote v-reveal class="wc-quote wc-quote--key">
            <p class="wc-tag"><i class="wc-dot" />The quote that shaped WACH</p>
            <p class="wc-quote__text">
              “I open my running app and get overwhelmed by the health metrics. For me it’s just
              numbers. I have no idea what I should actually do with that data!”
            </p>
          </blockquote>
          <blockquote v-for="(q, i) in quotes" :key="i" v-reveal="i + 1" class="wc-quote">
            <p class="wc-quote__text">“{{ q }}”</p>
          </blockquote>
        </div>

        <div class="wc-insights">
          <div v-reveal class="wc-insights__head" aria-hidden="true">
            <span><i class="wc-dot wc-dot--orange" />What runners told me</span>
            <span><i class="wc-dot" />What WACH does about it</span>
          </div>
          <div v-for="(it, i) in insights" :key="it.pain" v-reveal="i" class="wc-insights__row">
            <p>{{ it.pain }}</p>
            <span aria-hidden="true">→</span>
            <p><b>{{ it.answer }}</b></p>
          </div>
        </div>
      </div>
    </section>

    <!-- ── name & logo ── -->
    <section class="wc-sec">
      <div class="wc-wrap">
        <div class="wc-head">
          <p v-reveal class="wc-label">Name &amp; logo</p>
          <h2 v-reveal="1" class="wc-lead">
            <em>Wach</em> is German for <mark>awake, alert, observant</mark>: what a good coach is,
            and what your watch already does.
          </h2>
        </div>
        <div class="wc-logo">
          <div v-reveal class="wc-logo__tile">
            <img :src="`${K}/logo.png`" alt="The WACH wordmark, with a watch drawn into the C and a neon green dot" loading="lazy" />
          </div>
        </div>
      </div>
    </section>

    <!-- ── the coaches ── -->
    <section class="wc-sec">
      <div class="wc-wrap">
        <div class="wc-head">
          <p v-reveal class="wc-label">Meet your coach</p>
          <h2 v-reveal="1" class="wc-lead">
            Three coaches read <b>the same data</b> and keep you <b>just as safe</b>. They just
            <mark>talk to you differently</mark>.
          </h2>
        </div>

        <ul class="wc-coaches">
          <li v-for="(c, i) in coaches" :key="c.id" v-reveal="i" class="wc-coach">
            <img :src="`${K}/coach-${c.id}.jpg`" :alt="`${c.name}, an AI-generated 3D portrait`" loading="lazy" />
            <div>
              <strong>{{ c.name }}</strong>
              <span>{{ c.title }}</span>
              <q>{{ c.motto }}</q>
            </div>
          </li>
        </ul>

        <div class="wc-trio">
          <figure v-for="(c, i) in coaches" :key="c.id" v-reveal="i" class="wc-trio__item">
            <div class="wc-phone">
              <img
                :src="`${K}/duo-today-${c.id}.jpg`"
                :alt="`Today screen with ${c.name} as coach, giving the same advice in ${c.name}’s tone`"
                loading="lazy"
              />
            </div>
            <figcaption>{{ c.name }}</figcaption>
          </figure>
        </div>
        <p v-reveal class="wc-note wc-center">
          Same Monday, same data: a short night and a higher resting heart rate. Three ways of saying
          “go easy today”. Switching coach changes the tone of every message in the app.
        </p>
        <p v-reveal class="wc-fine wc-center">
          The coach portraits are AI-generated fictional characters, not real people.
        </p>
      </div>
    </section>

    <!-- ── user flow (from the methodology board) ── -->
    <section class="wc-sec">
      <div class="wc-wrap">
        <div class="wc-head">
          <p v-reveal class="wc-label">User flow</p>
          <h2 v-reveal="1" class="wc-lead">
            The flow takes a runner from <b>first login</b> to a <b>daily routine</b>, with the watch
            synced and <mark>the coach ready before the first run</mark>.
          </h2>
        </div>

        <div class="wc-flow">
          <div v-reveal class="wc-flow__app">
            <img :src="`${K}/logo.png`" alt="" />
          </div>
          <ol class="wc-flow__lanes">
            <li v-for="(lane, i) in flow" :key="lane.name" v-reveal="i" class="wc-flow__lane">
              <span class="wc-flow__name">{{ lane.name }}</span>
              <ol>
                <li v-for="s in lane.steps" :key="s">{{ s }}</li>
              </ol>
            </li>
          </ol>
        </div>
        <p v-reveal class="wc-fine">
          New users go through the setup wizard; returning users go straight to the dashboard.
        </p>

        <ul class="wc-systems">
          <li v-for="(s, i) in systems" :key="s.name" v-reveal="i">
            <strong>{{ s.name }}</strong>
            <p>{{ s.text }}</p>
          </li>
        </ul>
      </div>
    </section>

    <!-- ── design process ── -->
    <section class="wc-sec">
      <div class="wc-wrap">
        <div class="wc-head">
          <p v-reveal class="wc-label">Design process</p>
          <h2 v-reveal="1" class="wc-lead">
            A <b>double diamond</b>: diverge to understand the problem, converge on what to build, then
            <mark>do it again for the solution</mark>.
          </h2>
        </div>

        <ol class="wc-phases" aria-label="Design process">
          <li v-for="(p, i) in phases" :key="p.name" v-reveal="i">
            <small>0{{ i + 1 }} · {{ p.when }}</small>
            <strong>{{ p.name }}</strong>
            <ul>
              <li v-for="(it, j) in p.items" :key="it" :class="{ 'is-key': j === 0 }">{{ it }}</li>
            </ul>
          </li>
        </ol>
      </div>
    </section>

    <!-- ── features ── -->
    <section class="wc-sec">
      <div class="wc-wrap">
        <div class="wc-head">
          <p v-reveal class="wc-label">Key features</p>
          <h2 v-reveal="1" class="wc-lead">
            Nine features, one job: <mark>tell you what your body is saying</mark>, and keep you safe
            while you listen.
          </h2>
        </div>

        <ol class="wc-features">
          <li v-for="(f, i) in features" :key="f.name" v-reveal="i % 3">
            <span class="wc-features__num">{{ String(i + 1).padStart(2, '0') }}</span>
            <strong>{{ f.name }}</strong>
            <p>{{ f.text }}</p>
          </li>
        </ol>

        <div class="wc-strip">
          <figure v-for="(s, i) in featureScreens" :key="s.src" v-reveal="i" class="wc-strip__item">
            <div class="wc-phone"><img :src="s.src" :alt="s.alt" loading="lazy" /></div>
            <figcaption>{{ s.label }}</figcaption>
          </figure>
        </div>
      </div>
    </section>

    <!-- ── business model ── -->
    <section class="wc-sec">
      <div class="wc-wrap">
        <div class="wc-head">
          <p v-reveal class="wc-label">Business model</p>
          <h2 v-reveal="1" class="wc-lead">
            <b>Freemium</b>, with one line it never crosses: runners pay for coaching,
            <mark>never for staying safe</mark>.
          </h2>
        </div>

        <div class="wc-tiers">
          <article
            v-for="(t, i) in tiers"
            :key="t.name"
            v-reveal="i"
            class="wc-tier"
            :class="{ 'wc-tier--key': t.key }"
          >
            <p class="wc-tag"><i class="wc-dot" :class="{ 'wc-dot--navy': t.key }" />{{ t.name }}</p>
            <p class="wc-tier__price">{{ t.price }} <small>{{ t.per }}</small></p>
            <p class="wc-tier__pitch">{{ t.pitch }}</p>
            <ul>
              <li v-for="it in t.items" :key="it">{{ it }}</li>
            </ul>
          </article>
        </div>
        <p v-reveal class="wc-fine">
          The 14-day Premium trial starts after the baseline sync, so the first coaching people see is
          already based on their own data.
        </p>

        <ul class="wc-systems">
          <li v-for="(s, i) in streams" :key="s.name" v-reveal="i">
            <strong>{{ s.name }}</strong>
            <p>{{ s.text }}</p>
          </li>
        </ul>

        <ul v-reveal class="wc-chips wc-chips--neon wc-promises">
          <li v-for="p in promises" :key="p">{{ p }}</li>
        </ul>
      </div>
    </section>

    <!-- ── design principles (neon band) ── -->
    <section class="wc-band wc-turn">
      <div class="wc-wrap">
        <p v-reveal class="wc-label">Design principles</p>
        <p v-reveal="{ blur: true }" class="wc-verdict">
          Four rules behind every screen.
        </p>

        <ol class="wc-rules">
          <li v-for="(r, i) in rules" :key="r.name" v-reveal="i">
            <span class="wc-rules__num">{{ i + 1 }}</span>
            <strong>{{ r.name }}</strong>
            <p>{{ r.text }}</p>
          </li>
        </ol>
      </div>
    </section>

    <!-- ── rule 1 up close ── -->
    <section class="wc-sec">
      <div class="wc-wrap">
        <div class="wc-head">
          <p v-reveal class="wc-label">Rule 1, up close</p>
          <h2 v-reveal="1" class="wc-lead">
            <b>One pattern for every metric</b>, so you only learn it once. Today’s value is always
            placed against <mark>your own normal range</mark>, not a population average.
          </h2>
        </div>
        <div class="wc-anatomy">
          <ol class="wc-anatomy__steps">
            <li v-for="(a, i) in anatomy" :key="a.step" v-reveal="i">
              <span class="wc-anatomy__step">{{ a.step }}</span>
              <strong>{{ a.text }}</strong>
              <small v-if="a.small">{{ a.small }}</small>
            </li>
          </ol>
          <figure v-reveal="{ y: 40 }" class="wc-phone wc-anatomy__phone">
            <img :src="`${K}/metric.jpg`" alt="The Recovery explainer: HRV 38 ms marked lower than your normal, a 14-day chart against your normal band, then what it is, what today’s number means and what Clara suggests" loading="lazy" />
          </figure>
        </div>
      </div>
    </section>

    <!-- ── grid system ── -->
    <section class="wc-sec">
      <div class="wc-wrap">
        <div class="wc-head">
          <p v-reveal class="wc-label">Grid system</p>
          <h2 v-reveal="1" class="wc-lead">
            Built on a <mark>4px spacing grid</mark> for <b>consistent spacing</b> and
            <b>alignment</b> across every screen, with touch targets sized for a thumb on the run.
          </h2>
        </div>

        <div class="wc-gridsys">
          <div v-reveal class="wc-gridsys__phone">
            <div class="wc-gridsys__screen" aria-hidden="true">
              <span class="wc-gridsys__target">44px</span>
            </div>
            <p class="wc-gridsys__cap">4px base unit · 44px minimum touch target</p>
          </div>
          <ul v-reveal="1" class="wc-checks">
            <li v-for="c in conventions" :key="c">{{ c }}</li>
          </ul>
        </div>
        <p v-reveal class="wc-big">A grid built for <span>reading on the move.</span></p>
      </div>
    </section>

    <!-- ── typography & colour ── -->
    <section class="wc-sec">
      <div class="wc-wrap">
        <p v-reveal class="wc-label">Typography &amp; colour</p>

        <div v-reveal class="wc-type__weights" aria-hidden="true">
          <span>Typeface</span>
          <span v-for="[n, w] in weights" :key="n" :style="{ fontWeight: w }">{{ n }}</span>
        </div>
        <p v-reveal class="wc-type__word" aria-label="Epilogue">Epil<span>ogue</span></p>
        <div class="wc-type">
          <div v-reveal class="wc-type__spec" aria-hidden="true">
            <p class="wc-type__display">Go easy today</p>
            <p class="wc-type__voice">Your heart is working a bit too hard. Slow down until you could chat again.</p>
            <p class="wc-type__data">6:25 <small>/km</small> · 147 <small>bpm</small></p>
          </div>
          <p v-reveal="1" class="wc-body">
            After testing five pairings in the prototype, I chose one family, Epilogue, so the app and
            the pitch deck share the same typeface. The coach speaks in a larger medium weight, which
            sets their voice apart without needing a second font. Numbers use tabular figures so the
            live timer doesn’t jitter.
          </p>
        </div>

        <div class="wc-head wc-head--late">
          <p v-reveal class="wc-label wc-label--quiet">Colour palette</p>
          <h2 v-reveal="1" class="wc-lead">
            The moodboard had <b>two axes</b>, and each one got a job: <b>navy for calm</b>,
            <mark>neon for energy</mark>.
          </h2>
        </div>

        <figure v-reveal class="wc-mood">
          <img :src="`${K}/moodboard.jpg`" alt="The WACH moodboard: tennis and track scenes on navy courts and blue lanes, a coach strapping an athlete’s ankle, a coach briefing kids, a smartwatch on a wrist, runners on a mountain road and a green PLAY sign, framed in neon yellow on navy" loading="lazy" />
        </figure>

        <div class="wc-palette">
          <div v-reveal class="wc-ring" role="img" aria-label="Palette ring: navy, light grey, neon green and orange" />
          <div class="wc-palette__list">
            <div v-for="(a, i) in axes" :key="a.name" v-reveal="i" class="wc-axis">
              <p class="wc-axis__name">{{ a.name }}</p>
              <p class="wc-axis__use">{{ a.use }}</p>
              <ul>
                <li v-for="c in palette.filter((p) => p.axis === (i ? 'energy' : 'calm'))" :key="c.hex">
                  <span class="wc-swatch" :style="{ background: c.hex }" />
                  <div>
                    <strong>{{ c.name }}</strong>
                    <code>{{ c.hex }} · RGB {{ c.rgb }}</code>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ── navigation & onboarding ── -->
    <section class="wc-sec">
      <div class="wc-wrap">
        <div class="wc-head">
          <p v-reveal class="wc-label">Navigation &amp; onboarding</p>
          <h2 v-reveal="1" class="wc-lead">
            The navbar has <mark>four labelled tabs</mark>: Today, Plan, Coach and Me.
          </h2>
        </div>

        <div class="wc-navob">
          <div class="wc-nav">
            <figure v-reveal class="wc-nav__shot">
              <img :src="`${K}/nav-after.jpg`" alt="The navbar: four labelled tabs, Today, Plan, Coach and Me, with Plan raised in the notch" loading="lazy" />
            </figure>
          </div>
          <div class="wc-onboard">
            <p v-reveal class="wc-body">
              Three onboarding steps: the logo splash, choosing a coach (required, with a preview of each
              coach’s tone), then the coach introducing themselves.
            </p>
            <div class="wc-onboard__row">
              <figure v-for="(s, i) in onboarding" :key="s.src" v-reveal="i" class="wc-onboard__item">
                <div class="wc-phone"><img :src="s.src" :alt="s.alt" loading="lazy" /></div>
                <figcaption>{{ s.label }}</figcaption>
              </figure>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ── foldable layout ── -->
    <section class="wc-sec">
      <div class="wc-wrap">
        <div class="wc-head">
          <p v-reveal class="wc-label">Foldable layout</p>
          <h2 v-reveal="1" class="wc-lead">
            On a foldable, WACH <mark>unfolds into its own wide layout</mark>.
          </h2>
        </div>

        <div class="wc-fold">
          <div v-reveal class="wc-fold__copy">
            <p class="wc-tag"><i class="wc-dot" />Foldable support</p>
            <h3 class="wc-h3">Folded or unfolded</h3>
            <p class="wc-body">
              Folded, the iPhone Duo shows the phone app. Unfolded, the navigation moves to a side
              rail and the content splits into columns, so nothing is just stretched.
            </p>
          </div>
          <figure v-for="(w, i) in wide" :key="w.src" v-reveal="i" class="wc-fold__item">
            <div class="wc-duo"><img :src="w.src" :alt="w.alt" loading="lazy" /></div>
            <figcaption>{{ w.caption }}</figcaption>
          </figure>
        </div>
      </div>
    </section>

    <!-- ── reflection ── -->
    <section class="wc-sec wc-close">
      <div class="wc-wrap">
        <p v-reveal class="wc-label">Reflection</p>
        <p v-reveal="{ blur: true }" class="wc-close__line">
          Designing <mark>the translation layer</mark>, not the data, was the real work.
        </p>
        <p v-reveal="1" class="wc-body wc-close__note">
          WACH is a concept and an interactive prototype, not a launched product. The data is mocked.
        </p>
        <div v-reveal="2" class="wc-close__logo">
          <img :src="`${K}/logo-transparent.png`" alt="WACH" />
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
/* ───────────── WACH world, after dark ───────────── */
.wc {
  --night: #041b27;
  --navy-900: #073045;
  --navy-600: #0a5e8a;
  --neon: #b3f83b;
  --orange: #ffa042;
  --mist: #f4f8fa;
  --ink: #f4f8fa;
  --soft: rgba(244, 248, 250, 0.72);
  --faint: rgba(244, 248, 250, 0.5);
  --dim: rgba(244, 248, 250, 0.34);
  --line: rgba(244, 248, 250, 0.12);
  --card: rgba(255, 255, 255, 0.045);
  --type: 'Epilogue', var(--font-body);
  --max: 70rem;
  --sec: clamp(4rem, 9vw, 7rem);
  --radius: 1.5rem;

  margin-top: clamp(1rem, 3vw, 2rem);
  background: var(--night);
  color: var(--ink);
  font-family: var(--type);
  overflow-x: clip;
}

.wc-wrap {
  position: relative;
  z-index: 1;
  max-width: calc(var(--max) + 2 * var(--page-gutter));
  margin-inline: auto;
  padding-inline: var(--page-gutter);
}

.wc-sec {
  padding-block: var(--sec);
}

.wc-center {
  margin-inline: auto;
  text-align: center;
}

.wc-sr {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip-path: inset(50%);
}

/* ---- chapter opener: dotted label left, statement right ---- */
.wc-head {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1.55fr);
  gap: clamp(1.5rem, 5vw, 4rem);
  align-items: start;
  margin-bottom: clamp(2.5rem, 6vw, 4.5rem);
}

.wc-head--late {
  margin-top: clamp(4rem, 9vw, 6.5rem);
}

.wc-label {
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  margin-bottom: clamp(1.25rem, 3vw, 2rem);
  font-size: 0.92rem;
  font-weight: 500;
  color: var(--neon);
}

.wc-label::before {
  content: '';
  width: 0.4rem;
  height: 0.4rem;
  border-radius: 50%;
  background: currentColor;
}

.wc-head .wc-label {
  margin: 0.55rem 0 0;
}

.wc-label--quiet {
  color: var(--soft);
}

/* the statement: mostly dimmed, the words that matter lit */
.wc-lead {
  font-size: clamp(1.55rem, 1.1rem + 1.9vw, 2.55rem);
  font-weight: 400;
  line-height: 1.22;
  letter-spacing: -0.025em;
  color: var(--dim);
  text-wrap: pretty;
}

.wc-lead b,
.wc-lead em {
  font-weight: 500;
  font-style: normal;
  color: var(--ink);
}

.wc-lead mark {
  background: none;
  color: var(--neon);
  font-weight: 500;
}

/* ---- type ---- */
.wc-h3 {
  margin-bottom: 0.9rem;
  font-size: clamp(1.3rem, 1.05rem + 1vw, 1.8rem);
  font-weight: 600;
  line-height: 1.15;
  letter-spacing: -0.025em;
  text-wrap: balance;
}

.wc-h4 {
  margin-bottom: 0.9rem;
  font-size: 1.2rem;
  font-weight: 600;
}

.wc-body {
  font-size: 1rem;
  line-height: 1.7;
  color: var(--soft);
}

.wc-body + .wc-body {
  margin-top: 1rem;
}

.wc-note {
  max-width: 40rem;
  margin-top: clamp(1.5rem, 4vw, 2.5rem);
  font-size: clamp(1.05rem, 0.95rem + 0.4vw, 1.25rem);
  font-weight: 500;
  line-height: 1.45;
  text-wrap: balance;
}

.wc-fine {
  max-width: 40rem;
  margin-top: 0.9rem;
  font-size: 0.82rem;
  line-height: 1.55;
  color: var(--faint);
}

.wc-tag {
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
  margin-bottom: 0.9rem;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--soft);
}

.wc-dot {
  flex: none;
  width: 0.55rem;
  height: 0.55rem;
  border-radius: 50%;
  background: var(--neon);
}

.wc-dot--orange {
  background: var(--orange);
}

.wc-dot--navy {
  background: var(--navy-900);
}

.wc-chips {
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.wc-chips li {
  padding: 0.45rem 1rem;
  border-radius: 62.4375rem;
  background: var(--card);
  box-shadow: inset 0 0 0 1px var(--line);
  font-size: 0.85rem;
  font-weight: 500;
  color: var(--soft);
}

.wc-chips--neon li {
  background: var(--neon);
  box-shadow: none;
  color: var(--navy-900);
}

.wc-card {
  padding: clamp(1.4rem, 3vw, 2.1rem);
  border-radius: var(--radius);
  background: var(--card);
  box-shadow: inset 0 0 0 1px var(--line);
}

/* ---- phones ---- */
/* iPhone Duo, folded: the 466×678 outer display (captured at 3x), 3.375rem corners */
.wc-phone {
  position: relative;
  z-index: 1;
  aspect-ratio: 1398 / 2034;
  border-radius: 11.6% / 8%;
  background: #021219;
  box-shadow:
    inset 0 0 0 1.5px #2c5266,
    0 0 0 1px rgba(255, 255, 255, 0.06),
    0 2.5rem 4.375rem -1.875rem rgba(0, 0, 0, 0.7);
}

/* bezel = 2.4% of the phone's width on every side; top/bottom % resolve against
   its height (2.4% × 466/678 ≈ 1.65%) */
.wc-phone img {
  position: absolute;
  top: 1.65%;
  left: 2.4%;
  display: block;
  width: 95.2%;
  height: 96.7%;
  object-fit: cover;
  object-position: top;
  border-radius: 9.7% / 6.7%;
}

/* ---- hero ---- */
.wc-hero {
  position: relative;
  overflow: hidden;
  padding-block: clamp(2rem, 5vw, 3.5rem) clamp(3rem, 7vw, 5rem);
  background:
    radial-gradient(60% 55% at 50% 0%, rgba(179, 248, 59, 0.16), transparent 70%),
    var(--night);
}

.wc-hero__pills {
  display: flex;
  justify-content: space-between;
}

.wc-hero__pills span {
  padding: 0.5rem 1rem;
  border-radius: 0.625rem;
  background: var(--card);
  box-shadow: inset 0 0 0 1px var(--line);
  font-size: 0.85rem;
  color: var(--soft);
}

/* the name, huge and dim, with the app standing in front of it */
.wc-hero__word {
  position: absolute;
  top: clamp(7rem, 18vw, 13rem);
  left: 50%;
  translate: -50% 0;
  font-size: clamp(6rem, 1rem + 24vw, 22rem);
  font-weight: 800;
  line-height: 0.8;
  letter-spacing: -0.06em;
  white-space: nowrap;
  color: transparent;
  -webkit-text-stroke: 1.5px rgba(244, 248, 250, 0.16);
  pointer-events: none;
}

/* --fw: width of the folded Duo. The unfolded one is as tall, so its width is
   --fw × (2034/1398) × (2670/1878) ≈ 2.07 × --fw. --pair is both plus the gap. */
.wc-hero__stage {
  --fw: clamp(6rem, 18vw, 15rem);
  --gap: clamp(0.75rem, 3vw, 2.25rem);
  --pair: calc(var(--fw) * 3.07 + var(--gap));
  position: relative;
  display: grid;
  place-items: center;
  margin-top: clamp(1rem, 3vw, 2rem);
}

.wc-hero__glow {
  position: absolute;
  bottom: -10%;
  width: min(90%, 40rem);
  height: 40%;
  border-radius: 50%;
  background: radial-gradient(closest-side, rgba(179, 248, 59, 0.22), transparent);
  filter: blur(0.625rem);
}

/* the same Today screen on the iPhone Duo, folded and unfolded */
.wc-hero__devices {
  display: flex;
  align-items: flex-start;
  gap: var(--gap);
}

.wc-hero__device {
  position: relative;
  z-index: 1;
  width: var(--fw);
}

.wc-hero__device--wide {
  width: calc(var(--fw) * 2.07);
}

/* the same metric, said two ways */
.wc-bubble {
  position: absolute;
  z-index: 2;
  padding: 0.6rem 0.95rem;
  border-radius: 0.875rem;
  font-size: 0.88rem;
  font-weight: 600;
  line-height: 1.25;
  box-shadow: 0 0.875rem 1.5rem -0.875rem rgba(0, 0, 0, 0.6);
}

.wc-bubble--a {
  top: 18%;
  left: max(2%, calc(50% - var(--pair) / 2 - 8.5rem));
  background: rgba(244, 248, 250, 0.12);
  color: var(--faint);
  text-decoration: line-through;
  rotate: -5deg;
  backdrop-filter: blur(6px);
}

.wc-bubble--b {
  right: max(2%, calc(50% - var(--pair) / 2 - 7rem));
  bottom: 22%;
  max-width: 13rem;
  background: var(--neon);
  color: var(--navy-900);
  rotate: 3deg;
}

/* ---- about ---- */
.wc-about__quote {
  position: relative;
  max-width: 34ch;
  padding-left: clamp(2.25rem, 5vw, 3.5rem);
  font-size: clamp(1.45rem, 1.05rem + 1.7vw, 2.3rem);
  font-weight: 400;
  line-height: 1.28;
  letter-spacing: -0.02em;
}

.wc-about__mark {
  position: absolute;
  top: -0.2em;
  left: 0;
  font-size: 2.4em;
  font-weight: 800;
  line-height: 1;
  color: var(--neon);
}

.wc-about {
  display: grid;
  grid-template-columns: minmax(0, 1.2fr) minmax(0, 1fr);
  gap: clamp(2rem, 6vw, 5rem);
  margin-top: clamp(3rem, 7vw, 5rem);
  padding-top: clamp(2rem, 4vw, 3rem);
  border-top: 1px solid var(--line);
}

.wc-facts {
  display: grid;
  gap: 0.9rem;
  margin-top: clamp(1.5rem, 4vw, 2.25rem);
}

.wc-facts div {
  display: flex;
  gap: 0.5rem;
}

.wc-facts dt {
  color: var(--faint);
}

.wc-facts dt::after {
  content: ':';
}

.wc-facts dd {
  font-weight: 500;
}

/* ---- problem & solution ---- */
.wc-ps {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: clamp(0.75rem, 2vw, 1.25rem);
}

.wc-card--neon {
  background: var(--neon);
  box-shadow: none;
  color: var(--navy-900);
}

.wc-card--neon .wc-tag {
  color: rgba(7, 48, 69, 0.7);
}

.wc-hmw {
  font-size: clamp(1.2rem, 1rem + 0.7vw, 1.5rem);
  font-weight: 600;
  line-height: 1.3;
  letter-spacing: -0.015em;
  text-wrap: balance;
}

/* ---- research ---- */
.wc-quotes {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: clamp(0.75rem, 2vw, 1.25rem);
}

.wc-quote {
  padding: clamp(1.25rem, 3vw, 1.6rem);
  border-radius: var(--radius);
  background: var(--card);
  box-shadow: inset 0 0 0 1px var(--line);
}

.wc-quote--key {
  grid-column: 1 / -1;
  background: var(--navy-900);
}

.wc-quote__text {
  font-size: 0.98rem;
  font-weight: 500;
  line-height: 1.55;
  color: var(--soft);
}

.wc-quote--key .wc-quote__text {
  max-width: 46rem;
  font-size: clamp(1.25rem, 1rem + 1vw, 1.8rem);
  line-height: 1.3;
  letter-spacing: -0.015em;
  color: var(--ink);
  text-wrap: balance;
}

.wc-insights {
  margin-top: clamp(2.5rem, 6vw, 4rem);
}

.wc-insights__head,
.wc-insights__row {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 2.5rem minmax(0, 1fr);
  align-items: center;
}

.wc-insights__head {
  padding-bottom: 0.9rem;
}

.wc-insights__head span {
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--faint);
}

.wc-insights__head span:last-child {
  grid-column: 3;
}

.wc-insights__row {
  padding-block: 1.1rem;
  border-top: 1px solid var(--line);
}

.wc-insights__row p {
  font-size: clamp(1rem, 0.95rem + 0.3vw, 1.15rem);
  color: var(--faint);
}

.wc-insights__row b {
  font-weight: 600;
  color: var(--ink);
}

.wc-insights__row span {
  color: var(--neon);
}

/* ---- name & logo ---- */
.wc-logo {
  display: grid;
  justify-items: center;
}

.wc-logo__tile {
  width: min(100%, 38.75rem);
}

/* the wordmark on a light card, tilted like the reference's logo plate */
.wc-logo__tile {
  display: grid;
  place-items: center;
  aspect-ratio: 16 / 10;
  padding: 12%;
  border-radius: var(--radius);
  background:
    repeating-linear-gradient(0deg, rgba(10, 94, 138, 0.07) 0 1px, transparent 1px 1.5rem),
    repeating-linear-gradient(90deg, rgba(10, 94, 138, 0.07) 0 1px, transparent 1px 1.5rem),
    var(--mist);
  box-shadow: 0 2.5rem 4.375rem -1.875rem rgba(0, 0, 0, 0.7);
  rotate: -4deg;
}

.wc-logo__tile img {
  width: 100%;
  mix-blend-mode: multiply;
}

/* ---- coaches ---- */
.wc-coaches {
  list-style: none;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: clamp(0.75rem, 2vw, 1.25rem);
  margin-bottom: clamp(2.5rem, 6vw, 4rem);
}

.wc-coach {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border-radius: var(--radius);
  background: var(--card);
  box-shadow: inset 0 0 0 1px var(--line);
}

.wc-coach img {
  flex: none;
  width: clamp(4rem, 7vw, 5.25rem);
  aspect-ratio: 1;
  border-radius: 50%;
  object-fit: cover;
  box-shadow: 0 0 0 2px var(--neon);
}

.wc-coach div {
  display: grid;
  gap: 0.15rem;
}

.wc-coach strong {
  font-size: 1.2rem;
  font-weight: 700;
}

.wc-coach span {
  font-size: 0.85rem;
  color: var(--faint);
}

.wc-coach q {
  margin-top: 0.3rem;
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--neon);
}

.wc-trio,
.wc-strip {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 20.625rem));
  justify-content: center;
  gap: clamp(0.75rem, 3vw, 2.5rem);
}

.wc-hero__device figcaption,
.wc-trio figcaption,
.wc-strip figcaption,
.wc-onboard figcaption,
.wc-nav__shot figcaption {
  margin-top: 1rem;
  text-align: center;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--faint);
}

/* ---- user flow ---- */
.wc-flow {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  gap: clamp(1rem, 3vw, 2rem);
  align-items: center;
}

.wc-flow__app {
  display: grid;
  place-items: center;
  width: clamp(6rem, 11vw, 8.5rem);
  aspect-ratio: 1;
  padding: 14%;
  border-radius: 26%;
  background: var(--mist);
}

.wc-flow__app img {
  width: 100%;
  mix-blend-mode: multiply;
}

.wc-flow__lanes {
  list-style: none;
  display: grid;
  gap: clamp(0.75rem, 2vw, 1rem);
  padding-left: clamp(1rem, 3vw, 2rem);
  border-left: 1px solid var(--line);
}

.wc-flow__lane {
  display: grid;
  grid-template-columns: 6.5rem minmax(0, 1fr);
  gap: 1rem;
  align-items: center;
}

.wc-flow__name {
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--neon);
}

.wc-flow__lane ol {
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem 0;
}

.wc-flow__lane ol li {
  position: relative;
  display: inline-flex;
  align-items: center;
  padding: 0.8rem 0.9rem;
  border-radius: 62.4375rem;
  background: var(--card);
  box-shadow: inset 0 0 0 1px var(--line);
  font-size: 0.85rem;
  /* trim the font's extra ascender/descender space so the text sits on the
     optical centre of the pill instead of riding low */
  line-height: 1;
  text-box: trim-both cap alphabetic;
}

.wc-flow__lane ol li + li {
  margin-left: 1.75rem;
}

/* arrow drawn as a mask so it sits on the true vertical centre of the gap,
   not on the text baseline */
.wc-flow__lane ol li + li::before {
  content: '';
  position: absolute;
  top: 50%;
  right: 100%;
  width: 1.75rem;
  height: 0.75rem;
  translate: 0 -50%;
  background: var(--neon);
  -webkit-mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 12' fill='none' stroke='%23000' stroke-width='1.6' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M1 6h13M9 1l5 5-5 5'/%3E%3C/svg%3E") center / 0.8rem auto no-repeat;
  mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 12' fill='none' stroke='%23000' stroke-width='1.6' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M1 6h13M9 1l5 5-5 5'/%3E%3C/svg%3E") center / 0.8rem auto no-repeat;
}

.wc-systems {
  list-style: none;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: clamp(1.5rem, 4vw, 3rem);
  margin-top: clamp(2.5rem, 6vw, 4rem);
  padding-top: clamp(2rem, 4vw, 3rem);
  border-top: 1px solid var(--line);
}

.wc-systems strong {
  display: block;
  margin-bottom: 0.5rem;
  font-size: 1.1rem;
  font-weight: 600;
}

.wc-systems p {
  font-size: 0.92rem;
  line-height: 1.6;
  color: var(--soft);
}

/* ---- design process ---- */
.wc-phases {
  list-style: none;
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: clamp(0.75rem, 2vw, 1.25rem);
}

.wc-phases > li {
  display: grid;
  align-content: start;
  gap: 0.5rem;
  padding: clamp(1.1rem, 2vw, 1.4rem);
  border-radius: 1.375rem;
  background: var(--card);
  box-shadow: inset 0 0 0 1px var(--line);
}

.wc-phases small {
  font-size: 0.72rem;
  color: var(--faint);
}

.wc-phases strong {
  margin-bottom: 0.5rem;
  font-size: clamp(1.25rem, 1rem + 0.8vw, 1.6rem);
  font-weight: 600;
  letter-spacing: -0.025em;
}

.wc-phases ul {
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
}

.wc-phases ul li {
  padding: 0.3rem 0.7rem;
  border-radius: 62.4375rem;
  box-shadow: inset 0 0 0 1px var(--line);
  font-size: 0.76rem;
  color: var(--soft);
}

.wc-phases ul li.is-key {
  background: var(--neon);
  box-shadow: none;
  color: var(--navy-900);
  font-weight: 600;
}

/* ---- features ---- */
.wc-features {
  list-style: none;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  margin-bottom: clamp(3rem, 7vw, 5rem);
  border-top: 1px solid var(--line);
}

.wc-features li {
  display: grid;
  align-content: start;
  gap: 0.4rem;
  padding: 1.4rem clamp(0.75rem, 2vw, 1.5rem) 1.4rem 0;
  border-bottom: 1px solid var(--line);
}

.wc-features li:not(:nth-child(3n + 1)) {
  padding-left: clamp(0.75rem, 2vw, 1.5rem);
  border-left: 1px solid var(--line);
}

.wc-features__num {
  font-size: 0.78rem;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  color: var(--neon);
}

.wc-features strong {
  font-size: 1.1rem;
  font-weight: 600;
}

.wc-features p {
  font-size: 0.92rem;
  line-height: 1.6;
  color: var(--soft);
}

/* ---- business model ---- */
.wc-tiers {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: clamp(0.75rem, 2vw, 1.25rem);
}

.wc-tier {
  padding: clamp(1.4rem, 3vw, 2.1rem);
  border-radius: var(--radius);
  background: var(--card);
  box-shadow: inset 0 0 0 1px var(--line);
}

.wc-tier--key {
  background: var(--neon);
  box-shadow: none;
  color: var(--navy-900);
  --ink: var(--navy-900);
  --soft: rgba(7, 48, 69, 0.8);
  --faint: rgba(7, 48, 69, 0.6);
  --line: rgba(7, 48, 69, 0.18);
}

.wc-tier__price {
  font-size: clamp(2.2rem, 1.6rem + 2.4vw, 3.4rem);
  font-weight: 700;
  line-height: 1;
  letter-spacing: -0.04em;
}

.wc-tier__price small {
  font-size: 0.9rem;
  font-weight: 500;
  letter-spacing: 0;
  color: var(--faint);
}

.wc-tier__pitch {
  margin: 0.75rem 0 1.25rem;
  font-weight: 500;
}

.wc-tier ul {
  list-style: none;
  border-top: 1px solid var(--line);
}

.wc-tier li {
  padding: 0.6rem 0;
  border-bottom: 1px solid var(--line);
  font-size: 0.92rem;
  color: var(--soft);
}

.wc-promises {
  margin-top: clamp(2rem, 4vw, 3rem);
}

/* ---- the turning point: the one neon band ---- */
.wc-band {
  padding-block: var(--sec);
  background: var(--neon);
  color: var(--navy-900);
  --ink: var(--navy-900);
  --soft: rgba(7, 48, 69, 0.8);
  --faint: rgba(7, 48, 69, 0.6);
  --line: rgba(7, 48, 69, 0.18);
}

.wc-band .wc-label {
  color: var(--navy-900);
}

.wc-verdict {
  max-width: 18ch;
  font-size: clamp(2.2rem, 1.2rem + 4.2vw, 5rem);
  font-weight: 800;
  line-height: 1.02;
  letter-spacing: -0.045em;
  text-wrap: balance;
}

.wc-rules {
  margin-top: clamp(2.5rem, 6vw, 4rem);
  list-style: none;
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: clamp(0.75rem, 2vw, 1.25rem);
}

.wc-rules li {
  display: grid;
  align-content: start;
  gap: 0.6rem;
  padding: clamp(1.25rem, 2.5vw, 1.6rem);
  border-radius: 1.25rem;
  background: var(--navy-900);
  color: var(--mist);
}

.wc-rules__num {
  display: grid;
  place-items: center;
  width: 2.4rem;
  height: 2.4rem;
  margin-bottom: 0.4rem;
  border-radius: 50%;
  background: var(--neon);
  color: var(--navy-900);
  font-weight: 800;
}

.wc-rules strong {
  font-size: 1.15rem;
  font-weight: 700;
  line-height: 1.25;
}

.wc-rules p {
  font-size: 0.9rem;
  line-height: 1.6;
  color: rgba(244, 248, 250, 0.75);
}

/* ---- rule 1 anatomy ---- */
.wc-anatomy {
  display: grid;
  grid-template-columns: minmax(0, 1.2fr) minmax(0, 1fr);
  gap: clamp(2rem, 6vw, 5rem);
  align-items: center;
}

.wc-anatomy__steps {
  list-style: none;
  display: grid;
}

.wc-anatomy__steps li {
  position: relative;
  display: grid;
  gap: 0.2rem;
  padding: 0 0 1.6rem 2.25rem;
}

/* the steps are joined by a line, like one sentence read top to bottom */
.wc-anatomy__steps li::before {
  content: '';
  position: absolute;
  top: 0.3rem;
  left: 0.3rem;
  width: 0.75rem;
  height: 0.75rem;
  border-radius: 50%;
  background: var(--neon);
  box-shadow: 0 0 0 4px rgba(179, 248, 59, 0.18);
}

.wc-anatomy__steps li:not(:last-child)::after {
  content: '';
  position: absolute;
  top: 1.4rem;
  bottom: 0.1rem;
  left: calc(0.675rem - 1px);
  width: 2px;
  background: var(--line);
}

.wc-anatomy__step {
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--faint);
}

.wc-anatomy__steps strong {
  font-size: clamp(1.1rem, 1rem + 0.5vw, 1.35rem);
  font-weight: 600;
  line-height: 1.35;
}

.wc-anatomy__steps small {
  font-size: 0.82rem;
  color: var(--faint);
}

.wc-anatomy__phone {
  justify-self: center;
  width: clamp(16.25rem, 28vw, 23.125rem);
}

/* ---- grid system ---- */
.wc-gridsys {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: clamp(2rem, 6vw, 5rem);
  align-items: center;
}

.wc-gridsys__phone {
  justify-self: center;
  width: clamp(13.75rem, 26vw, 18.75rem);
}

/* a phone outline over a 4px grid (drawn every 4th line, so every 16px) */
.wc-gridsys__screen {
  position: relative;
  aspect-ratio: 390 / 600;
  border: 1.5px solid rgba(244, 248, 250, 0.3);
  border-bottom: 0;
  border-radius: 2.6rem 2.6rem 0 0;
  background:
    repeating-linear-gradient(90deg, rgba(179, 248, 59, 0.28) 0 1px, transparent 1px 1rem),
    repeating-linear-gradient(0deg, rgba(179, 248, 59, 0.12) 0 1px, transparent 1px 1rem);
  -webkit-mask-image: linear-gradient(#000 70%, transparent);
  mask-image: linear-gradient(#000 70%, transparent);
}

.wc-gridsys__target {
  position: absolute;
  bottom: 30%;
  left: 50%;
  display: grid;
  place-items: center;
  width: 3.5rem;
  aspect-ratio: 1;
  translate: -50% 0;
  border: 1.5px dashed var(--neon);
  border-radius: 50%;
  background: rgba(4, 27, 39, 0.8);
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--neon);
}

.wc-gridsys__cap {
  margin-top: 0.75rem;
  text-align: center;
  font-size: 0.8rem;
  color: var(--faint);
}

.wc-checks {
  list-style: none;
  display: grid;
  gap: 0.9rem;
}

.wc-checks li {
  position: relative;
  padding-left: 1.9rem;
  font-size: 1rem;
  line-height: 1.5;
  color: var(--soft);
}

.wc-checks li::before {
  content: '';
  position: absolute;
  top: 0.15rem;
  left: 0;
  width: 1.15rem;
  height: 1.15rem;
  border-radius: 50%;
  background: var(--neon)
    url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath d='m4 8.5 2.5 2.5L12 5.5' fill='none' stroke='%23073045' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")
    center / 75% no-repeat;
}

.wc-big {
  max-width: 18ch;
  margin: clamp(3rem, 7vw, 5rem) auto 0;
  text-align: center;
  font-size: clamp(2rem, 1.2rem + 3.6vw, 4.4rem);
  font-weight: 700;
  line-height: 1.05;
  letter-spacing: -0.045em;
  text-wrap: balance;
}

.wc-big span {
  color: var(--dim);
}

/* ---- typography & colour ---- */
.wc-type__weights {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 0.5rem 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--line);
  font-size: 0.85rem;
  color: var(--soft);
}

.wc-type__weights span:first-child {
  margin-right: auto;
  color: var(--faint);
}

.wc-type__word {
  margin-block: clamp(1rem, 3vw, 2rem) clamp(2rem, 5vw, 3.5rem);
  font-size: clamp(4.5rem, 1rem + 15vw, 13.5rem);
  font-weight: 700;
  line-height: 0.95;
  letter-spacing: -0.055em;
  color: rgba(244, 248, 250, 0.82);
}

.wc-type__word span {
  color: var(--neon);
}

.wc-type {
  display: grid;
  grid-template-columns: minmax(0, 1.1fr) minmax(0, 1fr);
  gap: clamp(1.5rem, 6vw, 5rem);
  align-items: center;
}

.wc-type__spec {
  padding: clamp(1.25rem, 3vw, 2rem);
  border-radius: var(--radius);
  background: var(--navy-900);
  box-shadow: inset 0 0 0 1px var(--line);
}

.wc-type__display {
  font-size: clamp(1.5rem, 1.2rem + 1.2vw, 2.1rem);
  font-weight: 700;
  letter-spacing: -0.03em;
  color: var(--orange);
}

.wc-type__voice {
  margin-block: 0.6rem;
  font-size: clamp(1rem, 0.95rem + 0.3vw, 1.15rem);
  font-weight: 500;
  line-height: 1.45;
}

.wc-type__data {
  font-size: 1.6rem;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  letter-spacing: -0.02em;
}

.wc-type__data small {
  font-size: 0.8rem;
  font-weight: 500;
  color: var(--faint);
}

.wc-mood {
  margin: 0 0 clamp(2.5rem, 6vw, 4.5rem);
}

/* the export has rounded corners; the radius masks the jpg's white fill */
.wc-mood img {
  display: block;
  width: 100%;
  height: auto;
  aspect-ratio: 1600 / 1184;
  border-radius: 4.5% / 6%;
}

.wc-palette {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: clamp(2rem, 6vw, 5rem);
  align-items: center;
}

/* the palette as a ring, like a watch face: calm on one side, energy on the other */
.wc-ring {
  position: relative;
  justify-self: center;
  width: min(100%, 23.75rem);
  aspect-ratio: 1;
  border-radius: 50%;
  background: conic-gradient(
    from -90deg,
    #0a5e8a 0 22%,
    var(--night) 22% 23%,
    #f4f8fa 23% 36%,
    var(--night) 36% 37%,
    #b3f83b 37% 82%,
    var(--night) 82% 83%,
    #ffa042 83% 99%,
    var(--night) 99% 100%
  );
  -webkit-mask: radial-gradient(closest-side, transparent 68%, #000 69%);
  mask: radial-gradient(closest-side, transparent 68%, #000 69%);
}

.wc-axis + .wc-axis {
  margin-top: 2rem;
}

.wc-axis__name {
  font-size: 1.15rem;
  font-weight: 600;
}

.wc-axis__use {
  margin: 0.3rem 0 1.1rem;
  font-size: 0.9rem;
  line-height: 1.5;
  color: var(--soft);
}

.wc-axis ul {
  list-style: none;
  display: grid;
  gap: 0.75rem;
}

.wc-axis li {
  display: flex;
  align-items: center;
  gap: 0.9rem;
}

.wc-swatch {
  flex: none;
  width: 2.75rem;
  aspect-ratio: 1;
  border-radius: 0.75rem;
  box-shadow: inset 0 0 0 1px var(--line);
}

.wc-axis strong {
  display: block;
  font-size: 0.95rem;
  font-weight: 600;
}

.wc-axis code {
  font-family: var(--type);
  font-size: 0.82rem;
  color: var(--faint);
}

/* ---- navigation & onboarding ---- */
.wc-navob {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1.2fr);
  gap: clamp(2rem, 6vw, 5rem);
}

.wc-nav__shot {
  margin-top: 1.5rem;
}

.wc-nav__shot img {
  display: block;
  width: min(100%, 23.75rem);
  margin-inline: auto;
  border-radius: 0.875rem;
}

.wc-nav__shot figcaption {
  margin-top: 0.6rem;
}

.wc-onboard__row {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: clamp(0.5rem, 2vw, 1rem);
  margin-top: 1.75rem;
}

/* ---- foldable layout ---- */
.wc-fold {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: clamp(1.5rem, 4vw, 2.5rem);
}

.wc-fold__copy {
  align-self: center;
}

/* iPhone Duo, unfolded: a wide body with a hinge down the middle */
.wc-duo {
  position: relative;
  aspect-ratio: 2670 / 1878;
  padding: 2.2%;
  border-radius: 7% / 10%;
  background: #021219;
  box-shadow:
    inset 0 0 0 1.5px #2c5266,
    0 1.875rem 3.75rem -1.875rem rgba(0, 0, 0, 0.7);
}

.wc-duo::after {
  content: '';
  position: absolute;
  inset: 2.2% auto 2.2% 50%;
  width: 1px;
  background: rgba(7, 48, 69, 0.18);
}

.wc-duo img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 5% / 7%;
}

.wc-fold__item figcaption {
  margin-top: 0.9rem;
  font-size: 0.88rem;
  line-height: 1.5;
  color: var(--soft);
}

/* ---- reflection ---- */
.wc-close {
  text-align: center;
  background: radial-gradient(60% 50% at 50% 100%, rgba(179, 248, 59, 0.12), transparent 70%);
}

.wc-close .wc-label {
  justify-content: center;
}

.wc-close__line {
  max-width: 24ch;
  margin-inline: auto;
  font-size: clamp(1.8rem, 1.1rem + 2.8vw, 3.4rem);
  font-weight: 700;
  line-height: 1.12;
  letter-spacing: -0.035em;
  text-wrap: balance;
}

.wc-close__line mark {
  padding: 0 0.1em;
  border-radius: 0.12em;
  background: var(--neon);
  color: var(--navy-900);
  box-decoration-break: clone;
  -webkit-box-decoration-break: clone;
}

.wc-close__note {
  max-width: 40rem;
  margin: clamp(1.5rem, 4vw, 2.5rem) auto 0;
  font-size: 0.92rem;
}

.wc-close__logo {
  position: relative;
  width: min(70%, 17.5rem);
  margin: clamp(3rem, 7vw, 4.5rem) auto 0;
}

/* wordmark goes white on the dark close; the dot is repainted neon on top */
.wc-close__logo img {
  display: block;
  width: 100%;
  filter: brightness(0) invert(1);
}

.wc-close__logo::after {
  content: '';
  position: absolute;
  left: 88.7%;
  top: 56%;
  width: 7.6%;
  aspect-ratio: 1;
  border-radius: 50%;
  background: var(--neon);
}

/* ---- responsive ---- */
@media (max-width: 960px) {
  .wc-head,
  .wc-about,
  .wc-anatomy,
  .wc-type,
  .wc-palette,
  .wc-logo,
  .wc-gridsys,
  .wc-navob,
  .wc-fold {
    grid-template-columns: 1fr;
  }

  .wc-head {
    gap: 1rem;
  }

  .wc-ps,
  .wc-quotes,
  .wc-coaches,
  .wc-systems,
  .wc-tiers {
    grid-template-columns: 1fr;
  }

  .wc-phases {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .wc-rules {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .wc-features {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .wc-features li:not(:nth-child(3n + 1)) {
    padding-left: 0;
    border-left: 0;
  }

  .wc-features li:nth-child(even) {
    padding-left: clamp(0.75rem, 2vw, 1.5rem);
    border-left: 1px solid var(--line);
  }

  .wc-flow {
    grid-template-columns: 1fr;
  }

  .wc-flow__lanes {
    padding-left: 0;
    border-left: 0;
  }

  .wc-bubble--a {
    left: 2%;
  }

  .wc-bubble--b {
    right: 2%;
  }
}

@media (max-width: 600px) {
  .wc-phases,
  .wc-rules,
  .wc-features {
    grid-template-columns: 1fr;
  }

  .wc-features li:nth-child(even) {
    padding-left: 0;
    border-left: 0;
  }

  .wc-flow__lane {
    grid-template-columns: 1fr;
    gap: 0.6rem;
  }

  .wc-insights__head {
    display: none;
  }

  .wc-insights__row {
    grid-template-columns: 1fr;
    gap: 0.3rem;
  }

  .wc-insights__row span {
    display: none;
  }

  .wc-trio,
  .wc-strip {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 0.5rem;
  }

  .wc-trio figcaption,
  .wc-strip figcaption,
  .wc-onboard figcaption {
    font-size: 0.65rem;
    letter-spacing: 0.08em;
  }

  /* decorative; on a phone they'd cover the screen they describe */
  .wc-bubble {
    display: none;
  }

  .wc-type__weights span:nth-child(n + 2) {
    font-size: 0.75rem;
  }
}
</style>
