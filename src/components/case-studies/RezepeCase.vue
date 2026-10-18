<script setup>
/**
 * Rezepe: case study.
 *
 * Long-form app case study: hero → about → problem & HMW → process →
 * key findings → market scan → audience → moodboard → features → brand.
 *
 * Presented as a design prototype only: no code, stack or live app on this page.
 *
 * Dressed in Rezepe's own world: wine and orange on warm cream, Sansita for
 * headings and quotes, Asap for body (both loaded in index.html), matching the
 * app's tokens (src/assets/main.css in the REZEPE repo).
 *
 *  · Screens: 1194×834 @2x tablet captures of the refined prototype (demo
 *    family data), resized to 2000px wide. The tablet frame is CSS.
 *  · Research copy, findings, process, competitor scan, audience and moodboard
 *    come from the Figma "Final delivery" deck (ILoMeBtiDaX1UxEatwgn61).
 *
 * The page header, cover and facts row come from src/data/projects.js.
 */
const K = '/assets/works/rezepe'

const disciplines = ['UX Research', 'Concept', 'UX Design', 'UI Design', 'Prototype']

const process = [
  { phase: 'Discover', items: ['Desk research', 'User interviews', 'User personas'] },
  { phase: 'Define', items: ['Feature prioritisation', 'User journey mapping', 'User stories', 'Target audience'] },
  { phase: 'Develop', items: ['Paper prototype', 'Wireframes', 'Low-fi prototype', 'Interactive designs'] },
  { phase: 'Deliver', items: ['Research report', 'Refined prototype'] },
]

// interview findings (deck "Key Findings") → what the app does about them
const insights = [
  {
    pain: 'I want to avoid using touch devices when I am cooking, to keep them smudge free!',
    fix: 'Voice-controlled cook mode with read-aloud steps and big tap targets.',
  },
  {
    pain: 'My mom sends me recipes mostly as texts, but sometimes as audio recordings or videos.',
    fix: 'Paste-to-parse import, voice dictation and photo upload.',
  },
  {
    pain: 'I want to learn the family recipes but also add my own twists, saved as different versions of the original.',
    fix: 'Twists, kept next to the original with a “what changed” note.',
  },
  {
    pain: 'I want to know if my family members have something to say about my recipe, or whether they like it.',
    fix: 'Loves, saves, comments and a family activity feed.',
  },
]

// app-store scan from the deck: all built around discovery
const market = [
  'Tasty', 'SideChef', 'Cookpad', 'Samsung Food', 'Mealime', 'Kitchen Stories', 'Recipe Keeper',
  'Paprika', 'BigOven', 'Yummly', 'Food Network Kitchen', 'Allrecipes', 'Epicurious',
  'Tastemade', 'BBC Good Food', 'Foodgawker',
]

const audience = [
  {
    title: 'Preserving culinary heritage',
    body: 'Multigenerational households, and nostalgia seekers who want to keep and share cherished family recipes and memories.',
  },
  {
    title: 'Social and collaborative',
    body: 'People who enjoy sharing, collaborating and connecting with others through recipes, family stories and small social moments.',
  },
  {
    title: 'Modern tools for cooks',
    body: 'Tech-savvy home cooks, culinary hobbyists and busy people who want voice commands and quick ways to capture recipes.',
  },
]

const features = [
  {
    title: 'Family circles',
    body: 'Private cookbooks for each part of the family, like “Grandma’s Cookbook” or “Thanksgiving Menus”, with members, a recipe feed and the twists people made.',
    src: `${K}/tab-group.jpg`,
    alt: 'Grandma’s Cookbook family circle: eight members, nine recipes, and a feed led by Ericaa’s twist on Mie Goreng',
  },
  {
    title: 'Recipes with a story',
    body: 'Every recipe carries the memory behind it, set as a pull quote in the person’s own words instead of hidden at the bottom.',
    src: `${K}/tab-recipe.jpg`,
    alt: 'Grandma’s Mie Goreng with her story as a wine-red pull quote above the ingredients and method',
  },
  {
    title: 'Twists',
    body: 'Change a family recipe without overwriting it. A twist is saved next to the original with a required “what did you change?” note, so you can see how a dish evolved.',
    src: `${K}/tab-twist.jpg`,
    alt: 'Mushroom Mie Goreng, a twist on Grandma’s Mie Goreng, with the note on what changed',
  },
  {
    title: 'Hands-free cook mode',
    body: 'One step at a time in large type, read aloud, with voice commands like “next”, “repeat” and “start timer”. Timers are picked up from the step text, and the screen stays awake.',
    src: `${K}/tab-cook.jpg`,
    alt: 'Cook mode: step 1 of 8 in large type on wine red, with hands-free, read-aloud and next-step controls',
  },
  {
    title: 'Smart ingredients',
    body: 'Scale the servings, switch between metric and US units, and tick ingredients off as you go.',
    src: `${K}/tab-ingredients.jpg`,
    alt: 'Ingredient list with checkboxes grouped into sauce and garnish, next to numbered steps with timer chips',
  },
  {
    title: 'Bring recipes in from anywhere',
    body: 'Paste a message from WhatsApp or email and it is parsed into ingredients and steps, dictate the story by voice, or add a photo of the handwritten card.',
    src: `${K}/tab-add.jpg`,
    alt: 'Add a recipe: paste a message, tell the story or add a photo, then choose which family circle to share with',
  },
  {
    title: 'Social, but family-sized',
    body: 'Love, save and comment on each other’s dishes, and follow what the family is cooking in one activity feed.',
    src: `${K}/tab-activity.jpg`,
    alt: 'Family activity feed: loves, comments and new twists from family members',
  },
]

const palette = [
  { name: 'Wine', hex: '#690202', ink: '#fff6e9' },
  { name: 'Orange', hex: '#FF9623', ink: '#690202' },
  { name: 'Amber', hex: '#FEB825', ink: '#690202' },
  { name: 'Peach', hex: '#FFD79C', ink: '#690202' },
  { name: 'Cream', hex: '#FFF6E9', ink: '#690202' },
  { name: 'Ink', hex: '#3A1A10', ink: '#fff6e9' },
]
</script>

<template>
  <div class="rz">
    <!-- ── hero: wordmark + the app ── -->
    <section class="rz-hero">
      <div class="rz-wrap">
        <p class="rz-hero__word" aria-hidden="true">rezepe</p>
        <figure v-reveal="{ y: 40 }" class="rz-tablet rz-hero__device">
          <img :src="`${K}/tab-home.jpg`" alt="Rezepe home on a tablet: recipe of the day and family activity" />
        </figure>
      </div>
    </section>

    <!-- ── about ── -->
    <section class="rz-sec">
      <div class="rz-wrap">
        <p v-reveal class="rz-label">About project</p>
        <blockquote v-reveal class="rz-about__quote">
          Recipe apps are built for finding something new. Rezepe is built for the recipes you already have.
        </blockquote>
        <div class="rz-about">
          <div>
            <ul class="rz-chips" aria-label="Disciplines">
              <li v-for="d in disciplines" :key="d">{{ d }}</li>
            </ul>
          </div>
          <div>
            <h3 class="rz-h4">Overview</h3>
            <p class="rz-body">
              Grandma’s noodles written on a torn piece of paper, Mum’s voice note, the cookie recipe that
              only exists in someone’s head: Rezepe turns them into a shared family cookbook where every dish
              keeps its story, and every new generation can add its own twist.
            </p>
            <p class="rz-body">
              It started as a UX research project (interviews, personas, journey mapping and a first
              tablet prototype in Figma).
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- ── showcase: tilted tablets on dark ── -->
    <figure v-reveal="{ y: 40 }" class="rz-showcase">
      <img
        :src="`${K}/showcase.jpg`"
        alt="Rezepe screens on tilted tablets: Grandma’s Cookbook, home, cook mode, a twist, family activity and more"
        loading="lazy"
      />
    </figure>

    <!-- ── problem & HMW ── -->
    <section class="rz-sec">
      <div class="rz-wrap">
        <div class="rz-head">
          <p v-reveal class="rz-label">Problem</p>
          <h2 v-reveal="1" class="rz-lead">
            How many of you have a cherished family recipe that’s been passed down for <em>generations</em>?
          </h2>
        </div>
        <div class="rz-cards rz-cards--2">
          <blockquote v-reveal class="rz-card rz-card--quote">
            <p class="rz-tag">From an interview</p>
            <p class="rz-bigquote">
              “I’ve lost my grandmother’s soup recipe because it was written on a torn, faded piece of paper.
              It’s irreplaceable.”
            </p>
          </blockquote>
          <article v-reveal="1" class="rz-card rz-card--wine">
            <p class="rz-tag">How might we</p>
            <p class="rz-hmw">
              How might we provide a centralised platform for people who wish to protect their family’s
              culinary heritage, so that the stories and memories tied to their recipes remain intact for
              future generations?
            </p>
          </article>
        </div>
      </div>
    </section>

    <!-- ── process ── -->
    <section class="rz-sec rz-sec--tint">
      <div class="rz-wrap">
        <div class="rz-head">
          <p v-reveal class="rz-label">Process</p>
          <h2 v-reveal="1" class="rz-lead">Four phases, from desk research to a working app.</h2>
        </div>
        <ol class="rz-process">
          <li v-for="(p, i) in process" :key="p.phase" v-reveal="i">
            <span class="rz-process__n">{{ String(i + 1).padStart(2, '0') }}</span>
            <h3 class="rz-h3">{{ p.phase }}</h3>
            <ul class="rz-list">
              <li v-for="it in p.items" :key="it">{{ it }}</li>
            </ul>
          </li>
        </ol>
      </div>
    </section>

    <!-- ── key findings → features ── -->
    <section class="rz-sec">
      <div class="rz-wrap">
        <div class="rz-head">
          <p v-reveal class="rz-label">Key findings</p>
          <h2 v-reveal="1" class="rz-lead">The interviews shaped every feature.</h2>
        </div>
        <div class="rz-insights">
          <div class="rz-insights__head" aria-hidden="true">
            <span>What people told us</span>
            <span>What Rezepe does about it</span>
          </div>
          <div v-for="(it, i) in insights" :key="i" v-reveal="i" class="rz-insights__row">
            <p class="rz-insights__pain">“{{ it.pain }}”</p>
            <p class="rz-body">{{ it.fix }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ── market scan ── -->
    <section class="rz-sec">
      <div class="rz-wrap">
        <div class="rz-head">
          <p v-reveal class="rz-label">Market scan</p>
          <h2 v-reveal="1" class="rz-lead">
            Plenty of recipe apps help you discover new dishes. <em>None</em> focus on preserving the ones your family already has.
          </h2>
        </div>
        <div v-reveal class="rz-market">
          <ul class="rz-market__apps" aria-label="Recipe apps compared">
            <li v-for="m in market" :key="m">{{ m }}</li>
          </ul>
          <div class="rz-market__us">
            <p class="rz-tag">Rezepe</p>
            <p class="rz-hmw">Preservation and personalisation, not discovery.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ── audience ── -->
    <section class="rz-sec rz-sec--tint">
      <div class="rz-wrap">
        <div class="rz-head">
          <p v-reveal class="rz-label">Target audience</p>
          <h2 v-reveal="1" class="rz-lead">Bridging generations: traditional cooks and modern tech users.</h2>
        </div>
        <div class="rz-cards rz-cards--3">
          <article v-for="(a, i) in audience" :key="a.title" v-reveal="i" class="rz-card">
            <span class="rz-process__n">{{ String(i + 1).padStart(2, '0') }}</span>
            <h3 class="rz-h3">{{ a.title }}</h3>
            <p class="rz-body">{{ a.body }}</p>
          </article>
        </div>
      </div>
    </section>

    <!-- ── moodboard ── -->
    <section class="rz-sec">
      <div class="rz-wrap">
        <div class="rz-head">
          <p v-reveal class="rz-label">Moodboard</p>
          <h2 v-reveal="1" class="rz-lead">Orange &amp; wine: candlelit family tables, handwritten cards, warm kitchens.</h2>
        </div>
        <figure v-reveal class="rz-shot rz-shot--flat">
          <img :src="`${K}/mood.jpg`" alt="Orange and wine moodboard: family dinners, wine, citrus, handwritten recipe cards and cooking together" loading="lazy" />
        </figure>
      </div>
    </section>

    <!-- ── features ── -->
    <section class="rz-sec rz-sec--tint">
      <div class="rz-wrap">
        <div class="rz-head">
          <p v-reveal class="rz-label">What it does</p>
          <h2 v-reveal="1" class="rz-lead">Seven features, each one traced back to something people told us.</h2>
        </div>
        <div v-for="(f, i) in features" :key="f.title" class="rz-feature" :class="{ 'rz-feature--flip': i % 2 }">
          <div v-reveal class="rz-feature__text">
            <span class="rz-process__n">{{ String(i + 1).padStart(2, '0') }}</span>
            <h3 class="rz-h3">{{ f.title }}</h3>
            <p class="rz-body">{{ f.body }}</p>
          </div>
          <figure v-reveal="1" class="rz-tablet">
            <img :src="f.src" :alt="f.alt" loading="lazy" />
          </figure>
        </div>
      </div>
    </section>

    <!-- ── brand: logo, type, colour ── -->
    <section class="rz-sec">
      <div class="rz-wrap">
        <div class="rz-head">
          <p v-reveal class="rz-label">Brand</p>
          <h2 v-reveal="1" class="rz-lead">A heart folded into a recipe card, warm like a family kitchen.</h2>
        </div>
        <div class="rz-pair">
          <figure v-reveal class="rz-shot rz-shot--logo">
            <img :src="`${K}/tab-splash.jpg`" alt="Rezepe launch screen: the wine-red mark and wordmark on orange" loading="lazy" />
          </figure>
          <div v-reveal="1" class="rz-card rz-type">
            <p class="rz-tag">Typography</p>
            <p class="rz-type__sample rz-type__sample--head">Sansita</p>
            <p class="rz-small">Headings and quotes. The wordmark is set in Sansita Black.</p>
            <p class="rz-type__sample rz-type__sample--body">Asap</p>
            <p class="rz-small">Interface and reading text, from the same foundry (Omnibus-Type).</p>
          </div>
        </div>
        <ul class="rz-palette">
          <li v-for="(c, i) in palette" :key="c.name" v-reveal="i" :style="{ background: c.hex, color: c.ink }">
            <strong>{{ c.name }}</strong>
            <span>{{ c.hex }}</span>
          </li>
        </ul>
      </div>
    </section>
  </div>
</template>

<style scoped>
/* ───────────── Rezepe world: orange & wine on cream ───────────── */
.rz {
  --wine: #690202;
  --orange: #ff9623;
  --cream: #fff6e9;
  --paper: #ffffff;
  --ink: #3a1a10;
  --soft: #7a5546;
  --faint: rgba(58, 26, 16, 0.55);
  --line: #f0dcc2;
  --head: 'Sansita', var(--font-body);
  --type: 'Asap', var(--font-body);
  --max: 70rem;
  --sec: clamp(4rem, 9vw, 7rem);
  --radius: 1.5rem;

  margin-top: clamp(1rem, 3vw, 2rem);
  background: var(--cream);
  color: var(--ink);
  font-family: var(--type);
  overflow-x: clip;
}

.rz-wrap {
  position: relative;
  max-width: calc(var(--max) + 2 * var(--page-gutter));
  margin-inline: auto;
  padding-inline: var(--page-gutter);
}

.rz-sec {
  padding-block: var(--sec);
}

.rz-sec--tint {
  background: #fdf0dd;
}

/* ---- chapter opener: label left, statement right ---- */
.rz-head {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1.55fr);
  gap: clamp(1.5rem, 5vw, 4rem);
  align-items: start;
  margin-bottom: clamp(2.5rem, 6vw, 4.5rem);
}

.rz-label {
  display: inline-flex;
  align-items: center;
  gap: 0.5em;
  font-size: var(--step--1);
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--faint);
}

.rz-label::before {
  content: '';
  width: 0.5em;
  height: 0.5em;
  border-radius: 50%;
  background: var(--orange);
}

.rz-lead {
  font-family: var(--head);
  font-weight: 700;
  font-size: clamp(1.6rem, 3.4vw, 2.6rem);
  line-height: 1.15;
  color: var(--wine);
  text-wrap: balance;
}

.rz-lead em {
  font-style: normal;
  color: var(--orange);
}

.rz-h3 {
  font-family: var(--head);
  font-weight: 700;
  font-size: clamp(1.25rem, 2vw, 1.5rem);
  line-height: 1.2;
  color: var(--wine);
  margin-bottom: var(--space-2xs);
}

.rz-h4 {
  font-weight: 700;
  margin-bottom: var(--space-2xs);
}

.rz-body {
  color: var(--soft);
  line-height: 1.6;
}

.rz-body + .rz-body {
  margin-top: var(--space-s);
}

.rz-small {
  font-size: var(--step--1);
  color: var(--faint);
}

.rz-tag {
  font-size: var(--step--1);
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: #db6f02;
  margin-bottom: var(--space-2xs);
}

.rz-list {
  padding-left: 1.1em;
  color: var(--soft);
  display: grid;
  gap: 0.2em;
}

/* ---- tablet frame around the screens ---- */
.rz-tablet {
  padding: clamp(6px, 1.2vw, 0.875rem);
  background: #2a1610;
  border-radius: clamp(1rem, 2.6vw, 1.875rem);
  box-shadow: 0 2px 4px rgba(105, 2, 2, 0.1), 0 1.125rem 2.5rem rgba(141, 66, 0, 0.18);
}

.rz-tablet img {
  display: block;
  width: 100%;
  height: auto;
  border-radius: clamp(0.625rem, 1.5vw, 1.125rem);
}

/* ---- hero ---- */
.rz-hero {
  padding-block: clamp(2rem, 6vw, 5rem) var(--sec);
  text-align: center;
}

.rz-hero__word {
  font-family: 'Sansita', var(--font-body);
  font-weight: 900;
  font-size: clamp(5rem, 20vw, 16rem);
  line-height: 0.85;
  color: var(--wine);
  opacity: 0.12;
  margin-bottom: clamp(-6rem, -10vw, -3rem);
}

.rz-hero__device {
  position: relative;
  max-width: 61.25rem;
  margin-inline: auto;
}

/* ---- showcase: wider than the text column, like a cover band ---- */
.rz-showcase {
  max-width: calc(90rem + 2 * var(--page-gutter));
  margin-inline: auto;
  padding-inline: var(--page-gutter);
}

.rz-showcase img {
  display: block;
  width: 100%;
  height: auto;
  aspect-ratio: 5 / 2;
  border-radius: clamp(1rem, 3vw, 2.5rem);
  background: #120707;
}

/* ---- about ---- */
.rz-about__quote {
  font-family: var(--head);
  font-size: clamp(1.6rem, 3.6vw, 2.8rem);
  line-height: 1.2;
  color: var(--wine);
  max-width: 28ch;
  margin: var(--space-s) 0 clamp(2rem, 5vw, 3.5rem);
}

.rz-about {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1.55fr);
  gap: clamp(1.5rem, 5vw, 4rem);
  align-items: start;
}

.rz-chips {
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  margin-bottom: var(--space-m);
}

.rz-chips li {
  padding: 0.35em 0.9em;
  font-size: var(--step--1);
  border: 1px solid var(--line);
  border-radius: 62.4375rem;
  background: var(--paper);
}

/* ---- cards ---- */
.rz-cards {
  display: grid;
  gap: clamp(1rem, 2vw, 1.5rem);
}

.rz-cards--2 {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.rz-cards--3 {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.rz-card {
  padding: clamp(1.25rem, 3vw, 2rem);
  background: var(--paper);
  border: 1px solid var(--line);
  border-radius: var(--radius);
}

.rz-card--wine {
  background: var(--wine);
  border-color: var(--wine);
  color: var(--cream);
}

.rz-card--wine .rz-tag {
  color: var(--orange);
}

.rz-bigquote {
  font-family: var(--head);
  font-size: clamp(1.3rem, 2.4vw, 1.75rem);
  line-height: 1.3;
  color: var(--wine);
}

.rz-hmw {
  font-family: var(--head);
  font-size: clamp(1.2rem, 2vw, 1.5rem);
  line-height: 1.3;
}

/* ---- process ---- */
.rz-process {
  list-style: none;
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  border-top: 2px solid var(--orange);
}

.rz-process > li {
  padding: var(--space-m) var(--space-s) 0 0;
}

.rz-process__n {
  display: block;
  font-family: var(--head);
  font-weight: 900;
  font-size: 2.5rem;
  color: var(--orange);
  line-height: 1;
  margin-bottom: var(--space-xs);
}

/* ---- findings ---- */
.rz-insights__head,
.rz-insights__row {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: clamp(1rem, 4vw, 3rem);
}

.rz-insights__head {
  font-size: var(--step--1);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--faint);
  padding-bottom: var(--space-xs);
}

.rz-insights__row {
  padding-block: var(--space-m);
  border-top: 1px solid var(--line);
}

.rz-insights__pain {
  font-family: var(--head);
  font-size: 1.2rem;
  line-height: 1.35;
  color: var(--wine);
}

/* ---- market scan ---- */
.rz-market {
  display: grid;
  grid-template-columns: minmax(0, 1.6fr) minmax(0, 1fr);
  gap: clamp(1rem, 2vw, 1.5rem);
  align-items: stretch;
}

.rz-market__apps {
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  align-content: center;
  gap: 0.5rem;
  padding: clamp(1.25rem, 3vw, 2rem);
  background: var(--paper);
  border: 1px solid var(--line);
  border-radius: var(--radius);
}

.rz-market__apps li {
  padding: 0.4em 0.9em;
  font-size: var(--step--1);
  color: var(--faint);
  background: var(--cream);
  border-radius: 62.4375rem;
}

.rz-market__us {
  display: grid;
  align-content: center;
  padding: clamp(1.25rem, 3vw, 2rem);
  background: var(--orange);
  color: var(--wine);
  border-radius: var(--radius);
}

.rz-market__us .rz-tag {
  color: var(--wine);
}

/* ---- images ---- */
.rz-shot img {
  display: block;
  width: 100%;
  border-radius: var(--radius-m);
  box-shadow: 0 1.125rem 2.5rem rgba(105, 2, 2, 0.14);
}

.rz-shot--flat img {
  box-shadow: none;
}

.rz-pair {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: clamp(1rem, 2vw, 1.5rem);
  margin-bottom: clamp(1.5rem, 4vw, 2.5rem);
  align-items: start;
}

/* ---- features: text beside screen, alternating ---- */
.rz-feature {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1.9fr);
  gap: clamp(1.5rem, 5vw, 4rem);
  align-items: center;
  padding-block: clamp(1.5rem, 4vw, 3rem);
}

/* flipped rows put the screen first, so it keeps the wide column */
.rz-feature--flip {
  grid-template-columns: minmax(0, 1.9fr) minmax(0, 1fr);
}

.rz-feature--flip .rz-feature__text {
  order: 2;
}

/* ---- brand ---- */
/* shown whole: cropping cuts into the mark and wordmark */
.rz-shot--logo img {
  height: auto;
  object-fit: contain;
  background: var(--orange);
}

.rz-type__sample {
  font-size: clamp(2.5rem, 6vw, 4rem);
  line-height: 1;
  color: var(--wine);
  margin-top: var(--space-s);
}

.rz-type__sample--head {
  font-family: var(--head);
  font-weight: 900;
}

.rz-type__sample--body {
  font-family: var(--type);
  font-weight: 600;
}

.rz-palette {
  list-style: none;
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  gap: clamp(0.5rem, 1.5vw, 1rem);
}

.rz-palette li {
  display: grid;
  align-content: end;
  gap: 0.2rem;
  min-height: 9.375rem;
  padding: var(--space-s);
  font-size: var(--step--1);
  border: 1px solid var(--line);
  border-radius: var(--radius);
}

.rz-palette strong {
  font-family: var(--head);
  font-size: 1.2rem;
}

/* ---- responsive ---- */
@media (max-width: 900px) {
  .rz-cards--3 {
    grid-template-columns: 1fr;
  }
  .rz-process {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    row-gap: var(--space-m);
  }
  .rz-palette {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

@media (max-width: 720px) {
  .rz-head,
  .rz-about,
  .rz-feature,
  .rz-pair,
  .rz-cards--2,
  .rz-market,
  .rz-insights__head,
  .rz-insights__row {
    grid-template-columns: 1fr;
  }
  .rz-feature--flip .rz-feature__text {
    order: 0;
  }
  .rz-insights__head {
    display: none;
  }
  .rz-palette {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>
