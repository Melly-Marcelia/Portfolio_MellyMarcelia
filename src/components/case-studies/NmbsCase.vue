<script setup>
/**
 * NMBS: case study.
 *
 * Tour Guide Mode, a sub-brand of the NMBS app for tour guides. The story is
 * split in two halves:
 *   · team (with Saulé and Froso): research → journey map → pitch →
 *     wireframes and lo-fi prototype
 *   · solo: heuristic evaluation → sub-brand and colours → hi-fi prototype →
 *     motion board → storyboard and script
 *
 * Layout borrows from long-form app case studies: numbered pill chapters,
 * centred headlines with one accent phrase, white "insight" cards that close a
 * chapter, and screens laid out on a zigzag joined by dashed connectors.
 *
 * Dressed in the sub-brand's own colours: gold and orange on cream.
 *  · Hi-fi screens: 786×1704 exports from the hi-fi Figma file.
 *  · Lo-fi screens (nmbs-lofi/): 2x exports from the Figma page
 *    "lo-fi prototype" (file LVBph6pRvpD3reB3VtoM0m).
 *  · Research, journey map and conclusion: the team pitch deck
 *    "Tour Guide Pitch (Melly, Saulé, Froso)".
 *  · Storyboard lines: the script in storyboard-nmbs.docx.
 *  · Palette: read off the hi-fi exports.
 *
 * The page header, cover, facts row and intro paragraph come from
 * src/data/projects.js.
 */
const W = '/assets/works'
const L = '/assets/works/nmbs-lofi'

const process = [
  {
    who: 'With Saulé & Froso',
    items: ['Station observation', 'User journey map', 'Pitch', 'Wireframes', 'Lo-fi prototype'],
  },
  {
    who: 'Solo',
    items: ['Heuristic evaluation', 'Sub-brand & colours', 'Hi-fi prototype', 'Motion board', 'Storyboard & script'],
  },
]

// the guide's pain points live in the journey map below, so this only holds
// what we saw at the station that the map doesn't cover
const observed = [
  'Groups cluster around their guide, often blocking entrances.',
  'Luggage is a struggle: which carriage has storage space?',
  'Tourists get lost looking for the exit.',
]

// the pitch deck's user journey map: what goes wrong → the opportunity
const journey = [
  { stage: 'Planning', pain: 'Too many ticket types, no group booking option', fix: 'Tour Guide Mode: group booking with recommended tickets and tourist pricing' },
  { stage: 'Buying tickets', pain: 'Details entered again and again, one receipt per person', fix: 'One-click group purchase, a single receipt, PayPal and Apple Pay' },
  { stage: 'At the station', pain: 'Last-minute platform changes, announcements not understood', fix: 'Push notifications in several languages' },
  { stage: 'On the train', pain: 'Is it direct? Tourists keep asking when they’ll arrive', fix: 'Live train progress bar and group notifications (“Next stop Bruges”)' },
  { stage: 'After arrival', pain: 'The app ends at the station, with no way on to the attractions', fix: 'Maps integration and a “group check-in”' },
  { stage: 'Expense reporting', pain: 'Collecting receipts by hand: slow, messy, error-prone', fix: 'One summary receipt for the whole group' },
]

// lo-fi (team) → hi-fi (solo): the same screen, before and after
const lofiPairs = [
  {
    title: 'Home',
    lofi: `${L}/home-book.png`,
    hifi: `${W}/nmbs-home.jpg`,
    alt: 'home screen',
    text: 'The lo-fi opened on a single ticket form, as if the guide were travelling alone.',
  },
  {
    title: 'Planner',
    lofi: `${L}/trip-planner.png`,
    hifi: `${W}/nmbs-plan-trip.jpg`,
    alt: 'trip planner',
    text: 'Passengers came from a “1 Adult” dropdown, so the guide had to count the group by hand.',
  },
  {
    title: 'Routes',
    lofi: `${L}/ticket-options.png`,
    hifi: `${W}/nmbs-trip-options.jpg`,
    alt: 'route options',
    text: 'One long list of look-alike routes left the guide comparing times line by line.',
  },
  {
    title: 'Group',
    lofi: `${L}/group-guide.png`,
    hifi: `${W}/nmbs-group-info.jpg`,
    alt: 'group page',
    text: 'The group page only held announcements and trip planning.',
  },
  {
    title: 'Ticket',
    lofi: `${L}/ticket-view.png`,
    hifi: `${W}/nmbs-ticket.jpg`,
    alt: 'ticket',
    text: 'A long, receipt-style ticket showed far more than the conductor needs.',
  },
  {
    title: 'Lock screen',
    lofi: `${L}/widget.png`,
    hifi: `${W}/nmbs-lockscreen.jpg`,
    alt: 'lock-screen widget',
    text: 'The widget’s progress bar was the one idea that carried straight over.',
  },
]

/*
 * Optional chapters. Each one only renders when it has content, and the
 * chapter numbers adjust.
 *   heuristics:  [{ heuristic: 'Visibility of system status', issue, fix }, …]
 *   motionBoard: [{ src, alt, caption }, …]   (stills or .mp4 later)
 */
const heuristics = []
const motionBoard = []

// Pre-production for an After Effects animation that hasn't been made yet.
// Figma page "StoryBoard & Script" (node 884:299), frames in canvas order,
// 4x exports. Frame 10 ("Tourists get a simplified companion view…") is still
// blank in Figma, so it's left out until it's drawn.
const S = '/assets/works/nmbs-story'
const storyboard = [
  { src: `${S}/frame-01.jpg`, line: 'Every day, tourists and tour guides navigate shifting plans, changing train schedules, and endless train tickets.', alt: 'A confused guide surrounded by flying tickets and question marks, two tourists waiting' },
  { src: `${S}/frame-02.jpg`, line: 'It’s chaotic, stressful, and pulls everyone away from what truly matters: creating unforgettable journeys.', alt: 'Two unhappy people beside a clock and a cluttered checklist' },
  { src: `${S}/frame-03.jpg`, line: 'Belgium’s tourism deserves better, for guides, agencies, and travellers.', alt: 'Frustrated travellers in front of a departure board' },
  { src: `${S}/frame-04.jpg`, line: 'When logistics fall apart, the entire experience suffers. Delays grow, confusion spreads, and the magic of discovery fades.', alt: 'The Atomium beside a “train delay” sign and two stressed tourists' },
  { src: `${S}/frame-05.jpg`, line: 'Introducing the new NMBS sub-brand app: a powerful dual-mode platform.', alt: 'A phone glowing with the NMBS name' },
  { src: `${S}/frame-06.jpg`, line: 'Book tickets for the whole group in one tap: fast, flexible, and reliable.', alt: 'A booking screen with an arrow pointing to a group of people' },
  { src: `${S}/frame-07.jpg`, line: 'Tour guides see daily groups, upcoming trips, and real-time train tracking.', alt: 'A phone screen showing a group and a list of trips' },
  { src: `${S}/frame-08.jpg`, line: 'Designed for both tourists and tour guides, adapting instantly to your role.', alt: 'A finger tapping “Book for group” on a phone' },
  { src: `${S}/frame-09.jpg`, line: 'Share announcements, manage expenses, and keep everything organised.', alt: 'Two phones with arrows between them, labelled “sync”' },
  { src: `${S}/frame-11.jpg`, line: 'Both views are perfectly synced, so every group moves with effortless precision.', alt: 'A group phone broadcasting to a document' },
  { src: `${S}/frame-12.jpg`, line: 'This isn’t just an app, it’s your essential companion for unforgettable travel. Guide smarter. Move faster. Elevate every journey with NMBS.', alt: 'A smiling group beside an arriving train under the NMBS logo' },
]
// (the voice-over script, storyboard-nmbs.docx, is the frame lines above, so
// it isn't shown again as its own list)

const palette = [
  { name: 'Gold', hex: '#AF7F03', ink: '#fffbf3', role: 'Brand colour: headers, tabs, the active nav' },
  { name: 'Orange', hex: '#EA560C', ink: '#fffbf3', role: 'Calls to action and the guide’s greeting' },
  { name: 'Brown', hex: '#6A3935', ink: '#fffbf3', role: 'Icons and secondary labels' },
  { name: 'Off-white', hex: '#F8F8F8', ink: '#2b1a14', role: 'Screen background' },
]

/*
 * Screen trails. `pos` is the column (1–3) the phone sits in; `note` is the
 * column for its annotation. Consecutive steps are joined by a dashed elbow.
 */
const groupsTrail = [
  {
    pos: 1, note: 2,
    src: `${W}/nmbs-signup-guide.jpg`,
    alt: 'Sign-up screen with a Tourist / Tour Guide toggle and a licence number field',
    text: 'At sign-up you choose whether you’re joining as a tourist or as a tour guide. Guides add their licence number.',
  },
  {
    pos: 3, note: 2,
    src: `${W}/nmbs-home.jpg`,
    alt: 'Home: “Which tourist group you will guide today?” with group cards, an ongoing trip with a progress bar, and travel news',
    text: 'Home opens on one question: “Which tourist group will you guide today?”, with the trip in progress and travel news underneath.',
  },
  {
    pos: 2, note: 1,
    src: `${W}/nmbs-groups-today.jpg`,
    alt: 'Tourist Groups list with Passed, Today and Incoming tabs',
    text: 'Groups are sorted into passed, today and incoming, so the next trip is always one tap away.',
  },
  {
    pos: 1, note: 2,
    src: `${W}/nmbs-group-info.jpg`,
    alt: 'Group Info for “Brussels Tour”: members, plus shortcuts to view tickets, publish an announcement, live train journey and expense summary',
    text: 'Each group has its own space: members, tickets, announcements, the live journey and the expense summary.',
  },
  {
    pos: 3, note: 2,
    src: `${W}/nmbs-group-settings.jpg`,
    alt: 'Group Settings: group name, tour date, maximum participants, meeting point, privacy and notification toggles',
    text: 'Settings hold the tour date, group size and meeting point, plus privacy and notification toggles.',
  },
  {
    pos: 2, note: 1,
    src: `${W}/nmbs-profile.jpg`,
    alt: 'Guide profile with languages spoken, total tourists and trips, and an emergency-call toggle',
    text: 'The guide profile shows languages spoken, trips and tourists guided, and an emergency-call toggle.',
  },
]

const bookingTrail = [
  {
    pos: 1, note: 2,
    src: `${W}/nmbs-plan-trip.jpg`,
    alt: 'Plan a New Trip: one way or round trip, from Brussels-Central to Dinant, add a via or avoid station, and an AI prompt bar',
    text: 'Planning keeps the familiar from/to form, with a shortcut to add a via, avoid a station or ask for no correspondence.',
  },
  {
    pos: 3, note: 2,
    src: `${W}/nmbs-ai-voice.jpg`,
    alt: 'Voice assistant overlay asking for a train for 10 people at 2pm without correspondence',
    text: 'Or just say what the group needs: “a train at 2pm from Brussels Central to Dinant for 10 people, without any correspondence”.',
  },
  {
    pos: 2, note: 1,
    src: `${W}/nmbs-trip-options.jpg`,
    alt: 'Trip options from Brussels to Dinant for 10 passengers, tagged Next, Cheapest, Fastest and Last',
    text: 'Results are labelled next, cheapest, fastest and last, so the right train is easy to pick.',
  },
  {
    pos: 1, note: 2,
    src: `${W}/nmbs-select-class.jpg`,
    alt: 'Select Class: Economy with amenity icons, included baggage and a subtotal for the group',
    text: 'Each class shows what’s included, like luggage space, with a subtotal for the whole group.',
  },
  {
    pos: 3, note: 2,
    src: `${W}/nmbs-passengers.jpg`,
    alt: 'Select the group members who are travelling: the tour guide and a list of tourists with age types',
    text: 'The guide ticks who’s travelling from the group list, so nobody’s details are typed twice.',
  },
  {
    pos: 2, note: 1,
    src: `${W}/nmbs-payment.jpg`,
    alt: 'Payment details: train detail card, passenger list with roles, protection add-ons and Complete Purchase',
    text: 'Everyone is paid for in one purchase, with optional trip and refund protection and a single receipt.',
  },
]

const onTheWay = [
  {
    src: `${W}/nmbs-payment-success.jpg`,
    alt: 'Payment success confirmation with See Ticket Details and Back to Home',
    title: 'Done in one go',
    text: 'A clear confirmation, with the ticket one tap away.',
  },
  {
    src: `${W}/nmbs-ticket.jpg`,
    alt: 'Your Ticket: Bruges to Dinant, class, passenger, group name, a barcode and an Add to Lockscreen button',
    title: 'One barcode',
    text: 'A single code for the conductor, with a brightness slider for easier scanning.',
  },
  {
    src: `${W}/nmbs-lockscreen.jpg`,
    alt: 'Lock-screen widget: train journey IC 1234 on time, progress bar, current stop and 45 min ETA',
    title: 'Live on the lock screen',
    text: 'Current stop, ETA and the stops still to come, updated live.',
  },
]

// chapter numbers follow whichever chapters have content
const chapters = [
  'research', 'journey', 'lofi',
  heuristics.length && 'heuristic',
  'brand', 'flow', 'groups', 'booking', 'onway',
  motionBoard.length && 'motion',
  'story',
].filter(Boolean)
const n = (id) => chapters.indexOf(id) + 1

/* dashed elbow between two columns, drawn in a 300×60 box (column centres 50/150/250) */
function elbow(from, to) {
  const a = from * 100 - 50
  const b = to * 100 - 50
  return `M${a} 0 V30 H${b} V60`
}
</script>

<template>
  <div class="nb">
    <!-- ── process: who did what ── -->
    <section class="nb-sec nb-sec--tight">
      <div class="nb-wrap">
        <div class="nb-process">
          <div
            v-for="(p, i) in process"
            :key="p.who"
            v-reveal="i"
            class="nb-process__lane"
            :class="{ 'nb-process__lane--solo': i === 1 }"
          >
            <p class="nb-process__who">{{ p.who }}</p>
            <ol class="nb-process__steps">
              <li v-for="it in p.items" :key="it">{{ it }}</li>
            </ol>
          </div>
        </div>
      </div>
    </section>

    <!-- ── research (team) ── -->
    <section class="nb-sec">
      <div class="nb-wrap">
        <header class="nb-head">
          <p v-reveal class="nb-pill"><b>{{ n('research') }}</b> Research</p>
          <p v-reveal class="nb-who">With Saulé &amp; Froso</p>
          <h2 v-reveal="1" class="nb-lead">
            One guide shapes the trip of <em>at least ten people</em>
          </h2>
          <p v-reveal="2" class="nb-sub">
            If the guide’s journey is smooth, the whole group is happy. So we went to the station to
            see where it isn’t.
          </p>
        </header>

        <div v-reveal class="nb-card nb-card--split">
          <div>
            <h3 class="nb-statement">
              We spent time at the station watching groups travel, and the problem was
              <em>bigger than language</em>
            </h3>
            <p class="nb-small">
              Even after switching to English, tourists still struggled. The real problem is the
              complexity of the ticket types.
            </p>
          </div>
          <div class="nb-card__lists">
            <div>
              <h4 class="nb-h4">What else we saw</h4>
              <ul class="nb-dots">
                <li v-for="o in observed" :key="o">{{ o }}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ── journey map (team) ── -->
    <section class="nb-sec nb-sec--tint">
      <div class="nb-wrap">
        <header class="nb-head">
          <p v-reveal class="nb-pill"><b>{{ n('journey') }}</b> Journey Map</p>
          <p v-reveal class="nb-who">With Saulé &amp; Froso</p>
          <h2 v-reveal="1" class="nb-lead">
            Six stages of a guide’s trip, each with <em>its own opportunity</em>
          </h2>
          <p v-reveal="2" class="nb-sub">
            We mapped the trip from planning to expense reporting and looked for the moment it breaks
            down. The opportunities became the feature list we pitched.
          </p>
        </header>

        <ol class="nb-journey">
          <li v-for="(j, i) in journey" :key="j.stage" v-reveal="i" class="nb-journey__stage">
            <span class="nb-journey__dot" aria-hidden="true">{{ i + 1 }}</span>
            <h3 class="nb-h4">{{ j.stage }}</h3>
            <p class="nb-journey__pain">{{ j.pain }}</p>
            <p class="nb-journey__fix">{{ j.fix }}</p>
          </li>
        </ol>
        <p class="nb-legend" aria-hidden="true">
          <span class="nb-legend__pain">Pain point</span>
          <span class="nb-legend__fix">Opportunity</span>
        </p>
      </div>
    </section>

    <!-- ── lo-fi → hi-fi (team, then solo) ── -->
    <section class="nb-sec">
      <div class="nb-wrap">
        <header class="nb-head">
          <p v-reveal class="nb-pill"><b>{{ n('lofi') }}</b> Lo-fi Prototype</p>
          <p v-reveal class="nb-who">With Saulé &amp; Froso</p>
          <h2 v-reveal="1" class="nb-lead">
            Wireframes first, then <em>what changed</em> in the hi-fi
          </h2>
          <p v-reveal="2" class="nb-sub">
            As a team we turned the pitch into wireframes and a lo-fi prototype of the key screens.
            Each pair shows where a screen started; the chapters below walk through the hi-fi.
          </p>
        </header>

        <div class="nb-pairs">
          <figure v-for="(p, i) in lofiPairs" :key="p.title" v-reveal="i % 2" class="nb-pair">
            <div class="nb-pair__screens">
              <div class="nb-pair__side">
                <span class="nb-pair__tag">Lo-fi</span>
                <div class="nb-phone nb-phone--lofi">
                  <img :src="p.lofi" :alt="`Lo-fi ${p.alt}`" loading="lazy" />
                </div>
              </div>
              <span class="nb-pair__arrow" aria-hidden="true">→</span>
              <div class="nb-pair__side">
                <span class="nb-pair__tag nb-pair__tag--hifi">Hi-fi</span>
                <div class="nb-phone">
                  <img :src="p.hifi" :alt="`Hi-fi ${p.alt}`" loading="lazy" />
                </div>
              </div>
            </div>
            <figcaption>
              <strong>{{ p.title }}</strong>
              {{ p.text }}
            </figcaption>
          </figure>
        </div>
      </div>
    </section>

    <!-- ── heuristic evaluation (solo) — renders once `heuristics` is filled ── -->
    <section v-if="heuristics.length" class="nb-sec nb-sec--tint">
      <div class="nb-wrap">
        <header class="nb-head">
          <p v-reveal class="nb-pill"><b>{{ n('heuristic') }}</b> Heuristic Evaluation</p>
          <p v-reveal class="nb-who">Solo</p>
          <h2 v-reveal="1" class="nb-lead">
            Checking the lo-fi against <em>Nielsen’s ten heuristics</em>
          </h2>
        </header>
        <div class="nb-heur">
          <div class="nb-heur__head" aria-hidden="true">
            <span>Heuristic</span><span>Issue</span><span>Recommendation</span>
          </div>
          <div v-for="(h, i) in heuristics" :key="i" v-reveal="i" class="nb-heur__row">
            <strong>{{ h.heuristic }}</strong>
            <p>{{ h.issue }}</p>
            <p>{{ h.fix }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ── sub-brand (solo) ── -->
    <section class="nb-sec">
      <div class="nb-wrap">
        <header class="nb-head">
          <p v-reveal class="nb-pill"><b>{{ n('brand') }}</b> Sub-brand</p>
          <p v-reveal class="nb-who">Solo</p>
          <h2 v-reveal="1" class="nb-lead">
            Tour Guide Mode gets <em>its own colours</em>
          </h2>
          <p v-reveal="2" class="nb-sub">
            Tour Guide Mode sits inside the NMBS app as a sub-brand, with a palette where each colour
            has one job.
          </p>
        </header>

        <ul class="nb-palette">
          <li v-for="(c, i) in palette" :key="c.name" v-reveal="i" :style="{ background: c.hex, color: c.ink }">
            <strong>{{ c.name }}</strong>
            <span class="nb-palette__hex">{{ c.hex }}</span>
            <span class="nb-palette__role">{{ c.role }}</span>
          </li>
        </ul>
      </div>
    </section>

    <!-- ── booking flow (hi-fi) ── -->
    <section class="nb-sec nb-sec--tint">
      <div class="nb-wrap">
        <header class="nb-head">
          <p v-reveal class="nb-pill"><b>{{ n('flow') }}</b> Booking Flow</p>
          <p v-reveal class="nb-who">Solo · hi-fi</p>
          <h2 v-reveal="1" class="nb-lead">
            Booking starts from <em>the group</em>, not a passenger count
          </h2>
          <p v-reveal="2" class="nb-sub">
            The hi-fi flow is one straight line, with a single fork: how the guide finds the train.
          </p>
        </header>

        <div v-reveal class="nb-flow" role="img" aria-label="Booking flow: book tickets, choose tourist group, then either fill in the route or ask the voice assistant, trip options, select class, tick who is travelling, one payment, one group ticket, add to lock screen">
          <span class="nb-node nb-node--start">Book tickets</span>
          <span class="nb-flow__line" />
          <span class="nb-node">Choose tourist group</span>
          <div class="nb-flow__fork">
            <span class="nb-node">Fill in the route</span>
            <span class="nb-node nb-node--alt">Ask the voice assistant</span>
          </div>
          <span class="nb-node">Trip options</span>
          <span class="nb-flow__line" />
          <span class="nb-node">Select class</span>
          <span class="nb-flow__line" />
          <span class="nb-node">Tick who’s travelling</span>
          <span class="nb-flow__line" />
          <span class="nb-node nb-node--diamond"><span>One payment</span></span>
          <span class="nb-flow__line" />
          <span class="nb-node nb-node--end">One group ticket</span>
          <span class="nb-flow__line" />
          <span class="nb-node">Add to lock screen</span>
        </div>

        <blockquote v-reveal class="nb-card nb-card--quote">
          A guide books under time pressure, with ten people waiting, so <em>every step counts</em>
        </blockquote>
      </div>
    </section>

    <!-- ── groups (hi-fi) ── -->
    <section class="nb-sec nb-sec--glow">
      <div class="nb-wrap">
        <header class="nb-head">
          <p v-reveal class="nb-pill"><b>{{ n('groups') }}</b> Tour Guide Mode</p>
          <p v-reveal class="nb-who">Solo · hi-fi</p>
          <h2 v-reveal="1" class="nb-lead">
            Your groups, <em>front and centre</em>
          </h2>
          <p v-reveal="2" class="nb-sub">
            A guide doesn’t think in tickets, they think in groups. So the whole mode is organised around
            them, from the home screen down to the settings.
          </p>
        </header>

        <ol class="nb-trail">
          <li v-for="(s, i) in groupsTrail" :key="s.src" class="nb-trail__step">
            <figure v-reveal class="nb-phone" :style="{ gridColumn: s.pos }">
              <img :src="s.src" :alt="s.alt" loading="lazy" />
            </figure>
            <p v-reveal="1" class="nb-note" :style="{ gridColumn: s.note }">{{ s.text }}</p>
            <svg
              v-if="i < groupsTrail.length - 1"
              class="nb-trail__link"
              viewBox="0 0 300 60"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <path :d="elbow(s.pos, groupsTrail[i + 1].pos)" />
            </svg>
          </li>
        </ol>
      </div>
    </section>

    <!-- ── booking (hi-fi) ── -->
    <section class="nb-sec">
      <div class="nb-wrap">
        <header class="nb-head">
          <p v-reveal class="nb-pill"><b>{{ n('booking') }}</b> Planning &amp; Booking</p>
          <p v-reveal class="nb-who">Solo · hi-fi</p>
          <h2 v-reveal="1" class="nb-lead">
            Cutting through <em>too many route options</em>
          </h2>
          <p v-reveal="2" class="nb-sub">
            A group can’t split across trains or run for a connection, so planning puts the group’s
            constraints first.
          </p>
        </header>

        <ol class="nb-trail">
          <li v-for="(s, i) in bookingTrail" :key="s.src" class="nb-trail__step">
            <figure v-reveal class="nb-phone" :style="{ gridColumn: s.pos }">
              <img :src="s.src" :alt="s.alt" loading="lazy" />
            </figure>
            <p v-reveal="1" class="nb-note" :style="{ gridColumn: s.note }">{{ s.text }}</p>
            <svg
              v-if="i < bookingTrail.length - 1"
              class="nb-trail__link"
              viewBox="0 0 300 60"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <path :d="elbow(s.pos, bookingTrail[i + 1].pos)" />
            </svg>
          </li>
        </ol>
      </div>
    </section>

    <!-- ── on the way: gold band (hi-fi) ── -->
    <section class="nb-sec nb-sec--gold">
      <div class="nb-wrap">
        <header class="nb-head">
          <p v-reveal class="nb-pill nb-pill--light"><b>{{ n('onway') }}</b> On the Way</p>
          <p v-reveal class="nb-who">Solo · hi-fi</p>
          <h2 v-reveal="1" class="nb-lead">
            Answering “are we there yet?” <em>without unlocking the phone</em>
          </h2>
          <p v-reveal="2" class="nb-sub">
            Added to the lock screen, the group’s ticket becomes a live widget the guide can glance at
            between headcounts.
          </p>
        </header>

        <div class="nb-trio">
          <figure v-for="(s, i) in onTheWay" :key="s.src" v-reveal="i" class="nb-trio__item">
            <div class="nb-phone">
              <img :src="s.src" :alt="s.alt" loading="lazy" />
            </div>
            <figcaption>
              <strong>{{ s.title }}</strong>
              {{ s.text }}
            </figcaption>
          </figure>
        </div>
      </div>
    </section>

    <!-- ── motion board (solo) — renders once `motionBoard` is filled ── -->
    <section v-if="motionBoard.length" class="nb-sec">
      <div class="nb-wrap">
        <header class="nb-head">
          <p v-reveal class="nb-pill"><b>{{ n('motion') }}</b> Motion Board</p>
          <p v-reveal class="nb-who">Solo</p>
          <h2 v-reveal="1" class="nb-lead">How Tour Guide Mode <em>moves</em></h2>
        </header>
        <div class="nb-frames">
          <figure v-for="(m, i) in motionBoard" :key="m.src" v-reveal="i" class="nb-frames__item">
            <img :src="m.src" :alt="m.alt" loading="lazy" />
            <figcaption v-if="m.caption">{{ m.caption }}</figcaption>
          </figure>
        </div>
      </div>
    </section>

    <!-- ── storyboard & script (solo) ── -->
    <section class="nb-sec nb-sec--tint">
      <div class="nb-wrap">
        <header class="nb-head">
          <p v-reveal class="nb-pill"><b>{{ n('story') }}</b> Storyboard &amp; Script</p>
          <p v-reveal class="nb-who">Solo</p>
          <h2 v-reveal="1" class="nb-lead">
            From a chaotic group trip to <em>one app in sync</em>
          </h2>
          <p v-reveal="2" class="nb-sub">
            To present the sub-brand, I planned a short animated video for Adobe After Effects. Each
            frame carries its line of the voice-over script. The pre-production is done; the animation
            itself is still to be made.
          </p>
        </header>

        <ol class="nb-board">
          <li v-for="(s, i) in storyboard" :key="s.src" v-reveal="i % 4" class="nb-board__frame">
            <img :src="s.src" :alt="s.alt" loading="lazy" />
            <p><span>{{ String(i + 1).padStart(2, '0') }}</span> “{{ s.line }}”</p>
          </li>
        </ol>
      </div>
    </section>

    <!-- ── outcome ── -->
    <section class="nb-sec">
      <div class="nb-wrap">
        <div v-reveal class="nb-outcome">
          <h2 class="nb-outcome__title">Outcome</h2>
          <p class="nb-outcome__body">
            Tour Guide Mode gives guides the right tools to reduce stress and mistakes, makes the trip
            better for the whole group, and positions NMBS as the most reliable, tourist-friendly
            transport partner in Belgium.
          </p>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
/* ───────────── Tour Guide Mode world: gold & orange on cream ───────────── */
.nb {
  --gold: #af7f03;
  --gold-deep: #7d5803;
  --orange: #ea560c;
  --brown: #6a3935;
  --cream: #f6ead2;
  --paper: #fffbf3;
  --ink: #2b1a14;
  --soft: #6b5a4e;
  --faint: rgba(43, 26, 20, 0.55);
  --line: #ead9b8;
  --max: 67.5rem;
  --sec: clamp(4rem, 9vw, 7rem);
  --radius: 2rem;

  margin-top: clamp(1rem, 3vw, 2rem);
  background: var(--cream);
  color: var(--ink);
  font-family: var(--font-body);
  overflow-x: clip;
}

.nb-wrap {
  position: relative;
  max-width: calc(var(--max) + 2 * var(--page-gutter));
  margin-inline: auto;
  padding-inline: var(--page-gutter);
}

.nb-sec {
  padding-block: var(--sec);
}

.nb-sec--tight {
  padding-bottom: 0;
}

.nb-sec--tint {
  background: #f1e0bf;
}

/* soft gold wash behind the screen trail, like light through a station roof */
.nb-sec--glow {
  background: linear-gradient(180deg, var(--cream) 0%, #f0d9a8 45%, var(--cream) 100%);
}

.nb-sec--gold {
  background: linear-gradient(170deg, #c08b0a 0%, var(--gold) 45%, var(--gold-deep) 100%);
  color: var(--paper);
}

/* ---- process: team lane → solo lane ---- */
.nb-process {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: clamp(1rem, 2vw, 1.5rem);
}

.nb-process__lane {
  padding: clamp(1.25rem, 3vw, 2rem);
  background: var(--paper);
  border-radius: var(--radius);
}

.nb-process__lane--solo {
  color: var(--paper);
  background: var(--gold);
}

.nb-process__who {
  font-size: var(--step--1);
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--gold);
  margin-bottom: var(--space-s);
}

.nb-process__lane--solo .nb-process__who {
  color: #ffe2a6;
}

.nb-process__steps {
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem;
  counter-reset: step;
}

.nb-process__steps li {
  counter-increment: step;
  padding: 0.4em 0.9em;
  font-size: var(--step--1);
  font-weight: 600;
  background: var(--cream);
  border-radius: 62.4375rem;
}

.nb-process__steps li::before {
  content: counter(step) '  ';
  white-space: pre;
  color: var(--gold);
}

.nb-process__lane--solo .nb-process__steps li {
  background: rgba(255, 251, 243, 0.16);
}

.nb-process__lane--solo .nb-process__steps li::before {
  color: #ffe2a6;
}

/* ---- chapter opener: numbered pill, centred headline ---- */
.nb-head {
  display: grid;
  justify-items: center;
  gap: var(--space-s);
  text-align: center;
  max-width: 46rem;
  margin: 0 auto clamp(2.5rem, 6vw, 4.5rem);
}

.nb-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.55em;
  padding: 0.35em 1em 0.35em 0.4em;
  font-size: var(--step--1);
  font-weight: 600;
  color: var(--paper);
  background: var(--gold);
  border-radius: 62.4375rem;
}

.nb-pill b {
  display: grid;
  place-items: center;
  width: 1.6em;
  height: 1.6em;
  font-size: 0.85em;
  color: var(--gold);
  background: var(--paper);
  border-radius: 50%;
}

.nb-pill--light {
  color: var(--gold-deep);
  background: var(--paper);
}

.nb-pill--light b {
  color: var(--paper);
  background: var(--orange);
}

/* who did this chapter: team or solo */
.nb-who {
  margin-top: -0.4rem;
  font-size: var(--step--1);
  font-weight: 600;
  color: var(--faint);
}

.nb-sec--gold .nb-who {
  color: rgba(255, 251, 243, 0.75);
}

.nb-lead {
  font-weight: 700;
  font-size: clamp(1.6rem, 3.4vw, 2.5rem);
  line-height: 1.15;
  letter-spacing: -0.01em;
  text-wrap: balance;
}

.nb-lead em,
.nb-statement em,
.nb-card--quote em {
  font-style: normal;
  color: var(--orange);
}

.nb-sec--gold .nb-lead em {
  color: #ffe2a6;
}

.nb-sub {
  max-width: 38rem;
  color: var(--soft);
  line-height: 1.6;
}

.nb-sec--gold .nb-sub {
  color: rgba(255, 251, 243, 0.82);
}

.nb-h4 {
  font-weight: 700;
  font-size: 1.1rem;
  margin-bottom: var(--space-xs);
}

.nb-small {
  margin-top: var(--space-s);
  font-size: var(--step--1);
  color: var(--soft);
  line-height: 1.55;
}

/* ---- insight cards that close a chapter ---- */
.nb-card {
  padding: clamp(1.5rem, 4vw, 3rem);
  background: var(--paper);
  border-radius: var(--radius);
  box-shadow: 0 1px 2px rgba(125, 88, 3, 0.06), 0 1.25rem 3.125rem rgba(125, 88, 3, 0.1);
}

.nb-card--split {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1.2fr);
  gap: clamp(1.5rem, 5vw, 4rem);
  margin-top: clamp(2.5rem, 6vw, 4rem);
}

.nb-card--split > :last-child {
  padding-left: clamp(1.5rem, 4vw, 3rem);
  border-left: 1px solid var(--line);
}

.nb-card__lists {
  display: grid;
  gap: var(--space-l);
}

.nb-statement {
  font-weight: 700;
  font-size: clamp(1.35rem, 2.6vw, 1.9rem);
  line-height: 1.2;
  text-wrap: balance;
}

.nb-card--quote {
  max-width: 52rem;
  margin: 0 auto;
  font-weight: 700;
  font-size: clamp(1.35rem, 2.8vw, 2rem);
  line-height: 1.25;
  text-align: center;
  text-wrap: balance;
}

/* closes the booking-flow chapter, under the diagram */
.nb-flow + .nb-card--quote {
  margin-top: clamp(2.5rem, 6vw, 4rem);
}

.nb-dots {
  list-style: none;
  display: grid;
  gap: 0.45em;
  color: var(--soft);
  line-height: 1.45;
}

.nb-dots li {
  position: relative;
  padding-left: 1.2em;
}

.nb-dots li::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0.55em;
  width: 0.45em;
  height: 0.45em;
  border-radius: 50%;
  background: var(--gold);
}

/* ---- journey map: six stages on one track ---- */
.nb-journey {
  list-style: none;
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  gap: var(--space-s);
  position: relative;
}

.nb-journey__stage {
  position: relative;
  display: grid;
  align-content: start;
  gap: var(--space-xs);
}

/* the track runs from each stage dot to the next one */
.nb-journey__stage:not(:last-child)::after {
  content: '';
  position: absolute;
  top: 1.1rem;
  left: 2.2rem;
  right: calc(-1 * var(--space-s));
  border-top: 2px dashed var(--gold);
}

.nb-journey__dot {
  display: grid;
  place-items: center;
  width: 2.2rem;
  height: 2.2rem;
  margin-bottom: var(--space-xs);
  font-weight: 700;
  font-size: var(--step--1);
  color: var(--paper);
  background: var(--gold);
  border: 4px solid #f1e0bf;
  border-radius: 50%;
  box-sizing: content-box;
  margin-left: -4px;
}

.nb-journey__stage .nb-h4 {
  margin-bottom: 0;
  font-size: 1rem;
}

.nb-journey__pain,
.nb-journey__fix {
  padding: 0.7em 0.8em;
  font-size: var(--step--1);
  line-height: 1.4;
  border-radius: 0.875rem;
}

.nb-journey__pain {
  color: #9c3608;
  background: #fbe2d3;
}

.nb-journey__fix {
  color: var(--ink);
  background: var(--paper);
}

.nb-legend {
  display: flex;
  justify-content: center;
  gap: var(--space-m);
  margin-top: var(--space-l);
  font-size: var(--step--1);
  color: var(--soft);
}

.nb-legend span::before {
  content: '';
  display: inline-block;
  width: 0.8em;
  height: 0.8em;
  margin-right: 0.4em;
  border-radius: 4px;
  vertical-align: -0.05em;
}

.nb-legend__pain::before {
  background: #fbe2d3;
}

.nb-legend__fix::before {
  background: var(--paper);
  border: 1px solid var(--gold);
}

/* ---- lo-fi → hi-fi pairs ---- */
.nb-pairs {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: clamp(1rem, 2.5vw, 2rem);
}

.nb-pair {
  display: grid;
  gap: var(--space-m);
  padding: clamp(1.25rem, 3vw, 2rem);
  background: var(--paper);
  border-radius: var(--radius);
}

.nb-pair__screens {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
  align-items: center;
  gap: var(--space-s);
}

.nb-pair__side {
  display: grid;
  justify-items: center;
  gap: var(--space-xs);
}

.nb-pair__side .nb-phone {
  max-width: 10.625rem;
  border-radius: 1.75rem;
  padding: 5px;
}

.nb-pair__side .nb-phone img {
  border-radius: 1.4375rem;
}

/* lo-fi screens sit in a grey frame, so the jump to colour reads at a glance */
.nb-phone--lofi {
  background: #9a9a9a;
  box-shadow: 0 0.75rem 1.875rem rgba(0, 0, 0, 0.1);
}

.nb-phone--lofi img {
  aspect-ratio: 786 / 1704;
  object-fit: cover;
  object-position: top;
  background: #fff;
}

.nb-pair__tag {
  padding: 0.2em 0.75em;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--soft);
  background: #ece6da;
  border-radius: 62.4375rem;
}

.nb-pair__tag--hifi {
  color: var(--paper);
  background: var(--gold);
}

.nb-pair__arrow {
  font-size: 1.4rem;
  color: var(--orange);
}

.nb-pair figcaption {
  color: var(--soft);
  line-height: 1.5;
}

.nb-pair figcaption strong {
  display: block;
  margin-bottom: 0.2em;
  font-size: 1.05rem;
  color: var(--ink);
}

/* ---- heuristic evaluation table ---- */
.nb-heur__head,
.nb-heur__row {
  display: grid;
  grid-template-columns: minmax(0, 0.8fr) minmax(0, 1fr) minmax(0, 1fr);
  gap: clamp(1rem, 3vw, 2rem);
}

.nb-heur__head {
  padding-bottom: var(--space-xs);
  font-size: var(--step--1);
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--faint);
}

.nb-heur__row {
  padding-block: var(--space-m);
  border-top: 1px solid var(--line);
  color: var(--soft);
  line-height: 1.5;
}

.nb-heur__row strong {
  color: var(--ink);
}

/* ---- sub-brand palette ---- */
.nb-palette {
  list-style: none;
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: clamp(0.5rem, 1.5vw, 1rem);
}

.nb-palette li {
  display: grid;
  align-content: end;
  gap: 0.2rem;
  min-height: 13.75rem;
  padding: var(--space-m);
  border: 1px solid rgba(43, 26, 20, 0.08);
  border-radius: var(--radius);
}

.nb-palette strong {
  font-size: 1.3rem;
}

.nb-palette__hex {
  font-size: var(--step--1);
  font-variant-numeric: tabular-nums;
  opacity: 0.85;
}

.nb-palette__role {
  margin-top: var(--space-xs);
  font-size: var(--step--1);
  line-height: 1.4;
  opacity: 0.85;
}

/* ---- booking flowchart ---- */
.nb-flow {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: var(--step--1);
}

.nb-flow__line {
  width: 2px;
  height: 1.75rem;
  background: var(--line);
}

.nb-node {
  padding: 0.6em 1.2em;
  font-weight: 600;
  text-align: center;
  background: var(--paper);
  border: 1px solid var(--line);
  border-radius: 62.4375rem;
  box-shadow: 0 4px 0.75rem rgba(125, 88, 3, 0.06);
}

.nb-node--start {
  color: var(--paper);
  background: var(--gold);
  border-color: var(--gold);
}

.nb-node--alt {
  color: var(--gold-deep);
  background: #fdf1d8;
  border-style: dashed;
  border-color: var(--gold);
}

.nb-node--end {
  color: var(--paper);
  background: var(--orange);
  border-color: var(--orange);
}

/* payment as a decision-shaped diamond, like a classic flowchart */
.nb-node--diamond {
  display: grid;
  place-items: center;
  width: 6.5rem;
  height: 6.5rem;
  margin-block: 0.5rem;
  padding: 0;
  background: #fde9b8;
  border: none;
  border-radius: 0.75rem;
  transform: rotate(45deg);
}

.nb-node--diamond span {
  transform: rotate(-45deg);
  line-height: 1.2;
}

/* two ways in, rejoining before the results */
.nb-flow__fork {
  position: relative;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--space-xl);
  padding-block: 1.75rem;
}

.nb-flow__fork .nb-node {
  position: relative;
  justify-self: center;
}

/* the bracket that splits from above and rejoins below */
.nb-flow__fork::before,
.nb-flow__fork::after {
  content: '';
  position: absolute;
  left: 25%;
  right: 25%;
  height: 1.75rem;
  border: 2px solid var(--line);
}

.nb-flow__fork::before {
  top: 0;
  border-bottom: none;
  border-radius: 0.875rem 0.875rem 0 0;
}

.nb-flow__fork::after {
  bottom: 0;
  border-top: none;
  border-radius: 0 0 0.875rem 0.875rem;
}

/* ---- phone frame around the screens ---- */
.nb-phone {
  width: 100%;
  max-width: 14.375rem;
  padding: 7px;
  background: #1f1612;
  border-radius: 2.375rem;
  box-shadow: 0 2px 4px rgba(43, 26, 20, 0.12), 0 1.5rem 3.125rem rgba(125, 88, 3, 0.22);
}

.nb-phone img {
  display: block;
  width: 100%;
  height: auto;
  border-radius: 1.9375rem;
}

/* ---- screen trail: zigzag of phones joined by dashed elbows ---- */
.nb-trail {
  list-style: none;
}

.nb-trail__step {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  align-items: center;
}

.nb-trail__step .nb-phone {
  grid-row: 1;
  justify-self: center;
}

.nb-note {
  grid-row: 1;
  max-width: 17rem;
  justify-self: center;
  color: var(--soft);
  line-height: 1.55;
}

.nb-trail__link {
  grid-column: 1 / -1;
  grid-row: 2;
  width: 100%;
  height: clamp(3rem, 7vw, 5rem);
  overflow: visible;
}

.nb-trail__link path {
  fill: none;
  stroke: var(--gold);
  stroke-width: 1.5;
  stroke-dasharray: 5 5;
  vector-effect: non-scaling-stroke;
}

/* ---- on the way: three phones on gold ---- */
.nb-trio {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: clamp(1.5rem, 4vw, 3rem);
  align-items: start;
}

.nb-trio__item {
  display: grid;
  justify-items: center;
  gap: var(--space-m);
  text-align: center;
}

.nb-trio__item:nth-child(2) {
  margin-top: clamp(0rem, 5vw, 4rem);
}

.nb-trio .nb-phone {
  max-width: 15.625rem;
  box-shadow: 0 1.875rem 3.75rem rgba(43, 26, 20, 0.35);
}

.nb-trio figcaption {
  max-width: 16rem;
  line-height: 1.5;
  color: rgba(255, 251, 243, 0.85);
}

.nb-trio figcaption strong {
  display: block;
  margin-bottom: 0.2em;
  font-size: 1.1rem;
  color: var(--paper);
}

/* ---- motion board / storyboard frames ---- */
.nb-frames {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(13.75rem, 1fr));
  gap: clamp(0.75rem, 2vw, 1.25rem);
  margin-bottom: clamp(2rem, 5vw, 3rem);
}

.nb-frames__item img {
  display: block;
  width: 100%;
  height: auto;
  border-radius: 1.125rem;
  background: var(--paper);
}

.nb-frames__item figcaption {
  margin-top: var(--space-xs);
  font-size: var(--step--1);
  color: var(--soft);
}

/* ---- storyboard: sketched frames with their line of script ---- */
.nb-board {
  list-style: none;
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: clamp(0.75rem, 2vw, 1.25rem);
}

.nb-board__frame {
  display: grid;
  align-content: start;
  gap: var(--space-xs);
  padding: 0.6rem 0.6rem 0.9rem;
  background: var(--paper);
  border-radius: 1.25rem;
}

.nb-board__frame img {
  display: block;
  width: 100%;
  height: auto;
  aspect-ratio: 237 / 140;
  object-fit: cover;
  background: #fff;
  border: 1px solid var(--line);
  border-radius: 0.75rem;
}

.nb-board__frame p {
  padding-inline: 0.3rem;
  font-size: var(--step--1);
  line-height: 1.45;
  color: var(--soft);
}

.nb-board__frame span {
  margin-right: 0.3em;
  font-weight: 800;
  color: var(--gold);
}

/* ---- outcome: closing card ---- */
.nb-outcome {
  display: grid;
  justify-items: center;
  gap: var(--space-m);
  padding: clamp(2.5rem, 7vw, 5rem) clamp(1.5rem, 6vw, 5rem);
  text-align: center;
  color: var(--paper);
  background:
    radial-gradient(120% 90% at 50% 120%, #f4a35f 0%, transparent 60%),
    linear-gradient(160deg, var(--orange) 0%, #c9480c 100%);
  border-radius: var(--radius);
}

.nb-outcome__title {
  font-weight: 700;
  font-size: clamp(1.6rem, 3.4vw, 2.4rem);
}

.nb-outcome__body {
  max-width: 40rem;
  font-size: clamp(1.05rem, 1.6vw, 1.25rem);
  line-height: 1.55;
}

/* ---- responsive ---- */
@media (max-width: 960px) {
  .nb-journey {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    row-gap: var(--space-l);
  }
  .nb-journey__stage::after {
    display: none;
  }
  .nb-board {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .nb-palette {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 720px) {
  .nb-process,
  .nb-pairs,
  .nb-heur__head,
  .nb-heur__row,
  .nb-card--split {
    grid-template-columns: 1fr;
  }
  .nb-heur__head {
    display: none;
  }
  .nb-card--split > :last-child {
    padding-left: 0;
    padding-top: var(--space-l);
    border-left: none;
    border-top: 1px solid var(--line);
  }

  /* journey becomes a vertical track */
  .nb-journey {
    grid-template-columns: 1fr;
    padding-left: 3rem;
  }
  .nb-journey::before {
    content: '';
    position: absolute;
    top: 1.1rem;
    bottom: 1.1rem;
    left: 1.05rem;
    border-left: 2px dashed var(--gold);
  }
  .nb-journey__dot {
    position: absolute;
    left: -3rem;
    top: -0.3rem;
  }

  .nb-flow__fork {
    gap: var(--space-s);
  }

  /* trail: one column, phone then its note, joined by a straight dash */
  .nb-trail__step {
    grid-template-columns: 1fr;
    justify-items: center;
    gap: var(--space-m);
  }
  .nb-trail__step .nb-phone,
  .nb-note {
    grid-column: 1 !important;
    grid-row: auto;
    text-align: center;
  }
  .nb-trail__link {
    display: none;
  }
  .nb-trail__step + .nb-trail__step::before {
    content: '';
    height: 2.5rem;
    border-left: 1.5px dashed var(--gold);
    margin-block: var(--space-s);
  }

  .nb-trio {
    grid-template-columns: 1fr;
  }
  .nb-trio__item:nth-child(2) {
    margin-top: 0;
  }
}
</style>
