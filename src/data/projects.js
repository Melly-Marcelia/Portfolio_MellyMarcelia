/**
 * Portfolio projects.
 * ---------------------------------------------------------------------------
 * Add a new work by dropping an object into this array. Nothing else needs to
 * change — the home grid, the /works index and each /works/:slug detail page
 * all read from here.
 *
 * Fields
 *   title       display name                                        (required)
 *   slug        url id for /works/:slug — OPTIONAL, auto-derived from
 *               the title (e.g. "The Network State" → "the-network-state").
 *               Only set it to pin/shorten a URL or resolve a clash.
 *   category    short label, e.g. "UI/UX", "Full-stack"             (required)
 *   year        e.g. "2025" — shown on the card
 *   date        e.g. "August 2025" — shown on the case-study page (falls back to year)
 *   summary     one line shown on the card + under the case-study title
 *   cover       image (or .mp4 video) path in /public — shown on cards + carousel
 *               (a video autoplays muted, loops, and pauses when off-screen)
 *   poster      still image shown before/if a video cover plays
 *   coverPortrait  true → tall cover; capped at 380px wide on the case-study page
 *   featured    true → also shown in the "Featured projects" grid on the home page
 *               (false → the project still appears in the carousel and at /works)
 *   role        your role on the project          — shown in the facts row
 *   timeline    e.g. "6 weeks"                    — shown in the facts row
 *   audience    who it's for                      — shown in the facts row
 *   tools       array of strings                  — shown in the facts row
 *   comingSoon  true → card + carousel tile show "Coming soon" on the image and don't
 *               link anywhere; there's no /works/:slug page for it yet
 *   link        optional external link (live site, repo, prototype, Figma file)
 *   linkLabel   optional override; otherwise the label comes from the URL:
 *               Figma → "view prototype", GitHub repo → "view code",
 *               anything else → "view live site"
 *   repos       optional array of { href, label } code repos — shown as a "github :"
 *               row under the link (e.g. separate frontend and backend repos)
 *   gallery     true → the case study is one continuous design doc; its images
 *               stack edge-to-edge with no seams and no cover above them. The
 *               page header, facts row and any paragraph blocks still render
 *               first as the intro (see The Network State)
 *   content     array of blocks rendered on the detail page:
 *                 { type: 'heading',   text }
 *                 { type: 'paragraph', text }
 *                 { type: 'image',     src, alt, caption, bare }
 *                       - default: image sits on a sage "screen mount" panel
 *                       - bare: true → full-width, no mount (use for slices of
 *                         one continuous case-study document; they stack seamlessly)
 *                       - portrait: true → tall screenshot, capped at 380px wide and centred
 *                       - fit: true → capped to the screen height and centred (e.g. a
 *                         tall bare photo)
 *                       - zoom: true → clicking opens the full-size file in a new tab
 *                         (for big boards like user journeys / story maps)
 *                 { type: 'images',    items: [{ src, alt, caption }, …] }
 *                       - images side by side on one sage panel (stacks on phones)
 *                 { type: 'video',    src (.mp4), poster, alt, caption, portrait, ratio }
 *                       - autoplays muted + loops while on screen, pauses when it
 *                         scrolls away; portrait: true → tall 9:16 frame, capped width;
 *                         ratio e.g. '16 / 11' overrides the default 16:9 frame
 *                       - chapters: [{ label, t (seconds) }, …] → a row of numbered step
 *                         buttons under the video that jump to each step
 *                       - aside: ['paragraph', …] → two columns: video on the left, these
 *                         paragraphs on the right (stacks on phones)
 *                 { type: 'imageVideo', src (image), video (.mp4), poster, alt, caption,
 *                                       rect: { x, y, w, h } (% of the image), radius }
 *                       - a still image with a looping muted video laid over one
 *                         sub-rectangle (e.g. a screen inside a device mockup)
 *                 { type: 'list',      items: [] }
 *                 { type: 'embed',     src (live URL), title, caption, ratio }
 *                       - the live site in a scrollable framed window (16:10 by
 *                         default, capped at 85vh); ratio e.g. '9 / 16' to override
 *
 * Images: drop files in public/assets/works/ and reference them as
 * "/assets/works/filename.png". Or import from src/assets and use the variable.
 */

/** Turn any string into a clean, url-safe slug. */
export function slugify(str) {
  return String(str)
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '') // strip accents
    .toLowerCase()
    .replace(/[''`]/g, '') // drop apostrophes
    .replace(/[^a-z0-9]+/g, '-') // everything else -> hyphen
    .replace(/^-+|-+$/g, '') // trim leading/trailing hyphens
}

const entries = [
  {
    title: 'The Network State',
    category: 'Hackathon',
    year: '2025',
    date: '2025',
    summary:
      'Reimagining democratic participation: a mobile app for proposals, voting, and community organising.',
    cover: '/assets/works/network-state-thumb.png',
    featured: false,
    timeline: '3 days',
    tools: ['Figma', 'Notion'],
    link: 'https://www.figma.com/design/XXlsv4FtfgyKZ8BArBNryo/California---Network-State-UI?node-id=6934-3136',
    // gallery: the slices are one continuous design document, so they stack
    // seamlessly full-width. The standard header + intro paragraph sit above them.
    gallery: true,
    content: [
      {
        type: 'paragraph',
        text: 'The Network State was a three-day hackathon sprint built around one question: how can we get, and keep, people engaged in our democracy? Our team’s answer was a mobile app where citizens propose ideas, vote on them and organise around them as a community, backed by a transparent, blockchain-based model of governance. I worked on the concept, wireframes, high-fidelity UI and the prototype.',
      },
      ...Array.from({ length: 7 }, (_, i) => ({
        type: 'image',
        bare: true,
        src: `/assets/works/network-state-${i + 1}.jpg`,
        alt: `The Network State case study, section ${i + 1} of 7`,
      })),
    ],
  },
  {
    title: 'Prestige Resort',
    category: 'Website design',
    date: 'August 2025',
    summary:
      'Prestige Resort is a concept website design for a fictional oceanfront luxury resort.',
    // The wide collage at the top of the page. Drop your file here:
    cover: '/assets/works/prestige-resort-thumb.png',
    // the project page shows these two Figma cover designs side by side
    // (the card on the works grid still uses `cover`)
    covers: [
      { src: '/assets/works/prestige-resort-cover-1.jpg', alt: 'Prestige Resort cover: hero screen framed by the retreat and lounge screens' },
      { src: '/assets/works/prestige-resort-cover-2.jpg', alt: 'Prestige Resort cover: hero and Elite Coastal Hideaway screens beside the offerings column' },
    ],
    featured: false,
    timeline: 'August 2025',
    tools: ['Figma'],
    // /proto/ (not /design/) — opens straight into the presentation view, not the editor
    link: 'https://www.figma.com/proto/igb6HhGYV0w3PWY3bQhV4y/Prestige_Resort_Website?node-id=95-353',
    content: [
      {
        type: 'paragraph',
        text: 'The project explores how visual storytelling (full-bleed photography, generous whitespace, and editorial typography) can be used to communicate exclusivity and calm before a single word of copy is read. The goal was to design a booking experience that feels less like a transactional hotel site and more like the opening pages of a travel magazine.',
      },
      // The screens already sit on their sage presentation mount in the export,
      // so they render `bare` (no extra panel).
      {
        type: 'image',
        bare: true,
        src: '/assets/works/prestige-resort-hero.jpg',
        alt: 'Prestige Resort landing page hero: aerial photography with the wordmark overlaid',
      },
      {
        type: 'image',
        bare: true,
        src: '/assets/works/prestige-resort-hideaway.jpg',
        alt: 'The Elite ( ) Coastal Hideaway introduction section',
      },
      {
        type: 'image',
        bare: true,
        src: '/assets/works/prestige-resort-retreat.jpg',
        alt: 'Luxury Retreat: numbered offerings index (01–05) with an oversized folio number',
      },
      {
        type: 'image',
        bare: true,
        src: '/assets/works/prestige-resort-sunset.jpg',
        alt: 'Exclusive Sunset Escape Getaway section with an inline booking widget',
      },
      {
        type: 'image',
        bare: true,
        src: '/assets/works/prestige-resort-offerings.jpg',
        alt: 'Offerings: night lounge closing scene',
      },
    ],
  },
  {
    title: 'Luxcrime',
    category: 'Website redesign',
    date: '2025',
    summary:
      'A full website redesign for the Indonesian beauty label Luxcrime.',
    cover: '/assets/works/luxcrime-thumb.mp4',
    poster: '/assets/works/luxcrime-thumb.jpg',
    featured: true,
    tools: ['Figma'],
    // /proto/ (not /design/) — opens straight into the presentation view, not the editor
    link: 'https://www.figma.com/proto/InKuWUX8VWIv5OZsfrr4xf/LUXCRIME-REBRANDING?node-id=75-602',
    // bespoke layout — see src/components/case-studies/LuxcrimeCase.vue
    // (content blocks render first, then the bespoke layout)
    view: 'luxcrime',
    content: [
      {
        type: 'paragraph',
        text: 'I redesigned the website for Luxcrime, a beloved local beauty brand from Indonesia. As a loyal customer and someone passionate about UI/UX, I approached the project from a user-centric perspective, drawing on my own experiences to create a more intuitive and engaging digital experience.',
      },
    ],
  },
  {
    title: 'Porche & Ford',
    slug: 'porche',
    category: 'Interaction & motion',
    date: '2025',
    summary: 'A personal experiment in animation and interactive design, built around Porche & Ford.',
    cover: '/assets/works/porche-thumb.mp4',
    poster: '/assets/works/porche-thumb.jpg',
    featured: false,
    tools: ['Figma'],
    link: 'https://www.figma.com/proto/5tPozF4oFPgH6LsMPYn4qi/PORCHE?node-id=1-76&p=f&scaling=scale-down&content-scaling=fixed&page-id=0%3A1',
  },

  {
    title: 'Livio',
    category: 'UI/UX',
    date: 'October 2025 – June 2026',
    summary:
      'A seasonal-living app for Burt’s Bees that tells you what’s in season where you live: produce, recipes and activities.',
    // isometric flat-lay: brand-guideline slides (Figma page "BRANDING") around
    // three phone screens; composed at 2400x1600 outside Figma
    cover: '/assets/works/livio-cover.jpg',
    featured: true,
    role: 'Product Owner and Lead Designer',
    timeline: 'October 2025 – June 2026',
    tools: ['Figma', 'Adobe Illustrator', 'VS Code', 'GitHub', 'Postman', 'Vue 3', 'Notion', 'Trello'],
    link: 'https://www.figma.com/design/QwtCX9obDCpppvriT8SxbJ/LIVIO-BY-BURT-S-BEES---MELLY?node-id=4804-5262',
    // team repos owned by anastasiiakovtun; both are private on GitHub, so
    // visitors without access get a 404 until they're made public
    repos: [
      { href: 'https://github.com/anastasiiakovtun/livio-frontend', label: 'frontend' },
      { href: 'https://github.com/anastasiiakovtun/livio-backend', label: 'backend' },
    ],
    // bespoke layout: src/components/case-studies/LivioCase.vue holds the whole
    // story (process, features, brand, UX mapping, before/after testing); the
    // intro paragraph below renders above it like on the other projects
    view: 'livio',
    content: [
      {
        type: 'paragraph',
        text: 'Livio is a sub-brand concept for Burt’s Bees: a mobile-first platform that answers one simple question, “what’s in season?”, based on where you live. I created the concept on my own in my 3rd semester. It was picked as one of the top 4 projects, so in the 4th semester we took it further as a team: we ran user tests, reworked the design based on the results, then built it and deployed it.',
      },
    ],
  },

  {
    title: 'WACH',
    slug: 'wach',
    category: 'UI/UX',
    // TODO confirm: course name (Design Project 2?) and year before publishing
    date: '2025',
    summary: 'Your watch collects the data. WACH tells you what it means.',
    // runner on a track: the unfolded Today screen on a foldable + the live-run
    // watch face, composited onto a generated photo at 2400×1600
    cover: '/assets/works/wach/cover-track.jpg',
    featured: true,
    tools: ['Figma'],
    link: 'https://www.figma.com/design/qrrRfJp4Z8kYEFydP6Hj0b/WACH_DP2?node-id=0-1',
    // the repo is private on GitHub, so visitors without access get a 404
    repos: [{ href: 'https://github.com/Melly-Marcelia/wach', label: 'view code' }],
    // bespoke layout: src/components/case-studies/WachCase.vue holds the whole
    // story; the intro paragraph below renders above it
    view: 'wach',
    content: [
      {
        type: 'paragraph',
        text: 'WACH, a wearables AI coaching hub, is a concept app for runners and joggers. It reads the data your smartwatch already collects and turns it into plain-language coaching: what your body is telling you today, and what to do about it.',
      },
    ],
  },

  {
    title: 'Drinkety',
    category: 'Mobile app',
    date: 'September 2026',
    summary:
      'A diary where every fun drink becomes a sticker you can scroll back to.',
    // overhead shot: pumpkin spice latte in one hand, the other snapping it
    // with the real calendar screen composited onto the phone
    cover: '/assets/works/drinkety-cover.jpg',
    featured: true,
    timeline: 'September 2026',
    link: 'https://github.com/Melly-Marcelia/drinkety',
    // bespoke layout: src/components/case-studies/DrinketyCase.vue holds the
    // story (about, problem, how it works, stamps, type & colour, screens, build)
    view: 'drinkety',
    content: [],
  },
  {
    title: 'Rezepe',
    category: 'UI/UX',
    date: '2024',
    summary:
      'A family cookbook that keeps your recipes, and the stories behind them, alive for the next generation.',
    // iPad + keyboard on peach with oversized logo-mark shapes (3:2); old flat lay kept as cover.jpg
    cover: '/assets/works/rezepe/cover-ipad.jpg',
    featured: false,
    timeline: '2024',
    link: 'https://github.com/Melly-Marcelia/rezepe',
    // bespoke layout: src/components/case-studies/RezepeCase.vue holds the
    // story (research, features, iteration, brand); the intro paragraph below
    // renders above it
    view: 'rezepe',
    content: [
      {
        type: 'paragraph',
        text: 'Most recipe apps are built for discovering something new. Rezepe is built for the recipes you already have: Grandma’s noodles written on a torn piece of paper, Mum’s voice note, the cookie recipe that only exists in someone’s head. It turns them into a shared family cookbook where every dish keeps its story, and every new generation can add its own twist. It started as a UX research project (interviews, personas, journey mapping) and grew into an interactive prototype.',
      },
    ],
  },
  {
    title: 'Advent Calendar',
    category: 'Web app',
    date: '2025',
    summary:
      'A wall of 24 hanging picture frames, one for every day of December, that you fill with messages and gifts for someone.',
    // loop of the live demo: hover reveals each frame's art, then day 3 opens its gift
    cover: '/assets/works/advent-calendar-thumb.webm',
    poster: '/assets/works/advent-calendar-thumb.jpg',
    featured: false,
    tools: ['Figma', 'Vue 3', 'Vite', 'Supabase'],
    // the full app runs on GitHub Pages in browser-only demo mode
    link: 'https://melly-marcelia.github.io/advent-calendar/',
    content: [
      {
        type: 'paragraph',
        text: 'An online advent calendar shaped like a wall of 24 hanging picture frames, one for every day of December. You fill each frame with a message and a little gift, then send the calendar to someone. They open one frame a day, and the last one, on the 24th, opens with confetti.',
      },
      {
        type: 'paragraph',
        text: 'There’s no account and no login. Making a calendar gives you two links: a private edit link for you, and a share link for the person it’s for.',
      },
      {
        type: 'embed',
        src: 'https://melly-marcelia.github.io/advent-calendar/#/demo',
        title: 'Advent Calendar: example calendar',
        caption: 'The example calendar with every frame unlocked. Hover a frame, then click to open it.',
      },

      { type: 'heading', text: 'How to use it' },
      {
        type: 'video',
        ratio: '16 / 10',
        src: '/assets/works/advent-calendar-tutorial.mp4',
        poster: '/assets/works/advent-calendar-tutorial.jpg',
        alt: 'Screen recording: creating a calendar, filling in three days, changing the title and previewing it as the recipient',
        // step numbers match the numbered captions in the video
        chapters: [
          { label: 'Create your calendar', t: 0 },
          { label: 'Fill the days', t: 13.3 },
          { label: 'Settings', t: 35.1 },
          { label: 'Preview', t: 49.1 },
          { label: 'Come back later', t: 62.3 },
        ],
      },

      { type: 'heading', text: 'Design Process' },
      {
        type: 'video',
        portrait: true,
        aside: [
          'I wanted it to feel like a real wall of mismatched frames, not a grid of numbered boxes. Every frame has its own shape and size, and its own hand-drawn artwork that appears when you hover it.',
          'I designed the frames in Figma and drew the artwork for all 24 of them by hand.',
        ],
        src: '/assets/works/advent-calendar-sketching.mp4',
        poster: '/assets/works/advent-calendar-sketching.jpg',
        alt: 'Drawing the artwork for one of the advent calendar frames on a tablet with a stylus',      },
    ],
  },
  {
    title: 'Todobee',
    category: 'Desktop app',
    date: 'September 2026',
    summary:
      'Todobee is a cosy sticky-note to-do list with a bee mascot: one corkboard per day, with post-its for your tasks.',
    cover: '/assets/works/todobee-thumb.jpg',
    featured: false,
    timeline: 'September 2026',
    tools: ['Electron', 'Vue 3', 'TypeScript', 'SQLite', 'Obsidian'],
    link: 'https://github.com/MellyMarcelia/todobee',
    content: [
      {
        type: 'paragraph',
        text: 'Todobee is an offline desktop to-do list. Every day gets its own corkboard, and you pin one or more post-its to it, like “today’s buzz” or “School”. Unfinished tasks roll forward to the next day automatically, and finishing a whole post-it earns you a stamp from the bee.',
      },

      { type: 'heading', text: 'The idea' },
      {
        type: 'paragraph',
        text: 'Most to-do apps are cloud-hosted and need an account before you can write anything down. I wanted something small and fast to open, with no login and no sync, that still keeps an honest record you own. The idea started as a wall board full of sticky notes with a little worker bee at a desk.',
      },

      {
        type: 'images',
        items: [
          {
            src: '/assets/works/todobee-sketch-board.jpg',
            alt: 'Hand-drawn sketch: a wall board with post-it notes and magnets, above a bee working at a desk',
            caption: 'Sketch: the wall board',
          },
          {
            src: '/assets/works/todobee-sketch-note.jpg',
            alt: 'Hand-drawn sketch: a “today’s focus” checklist next to a task note with a check button',
            caption: 'Sketch: today’s focus',
          },
          {
            src: '/assets/works/todobee-sketch-stamp.jpg',
            alt: 'Hand-drawn sketch: a finished checklist with a “Good job” stamp, noted “you get a stamp if you finish tasks”',
            caption: 'Sketch: the reward stamp',
          },
        ],
      },

      // walkthrough clips: recorded from the real app (fresh test profile) in a desktop-sized window
      { type: 'heading', text: 'Step by step' },
      {
        type: 'paragraph',
        text: '1. Pin a post-it. Every day starts with a “today’s buzz” post-it. Tap “+ new post-it” to add your own, give it a name like School, pick a colour, and drag it anywhere on the board.',
      },
      {
        type: 'video',
        ratio: '16 / 11', // desktop window clip
        src: '/assets/works/todobee-step-1-postit-desktop.webm',
        poster: '/assets/works/todobee-step-1-postit-desktop.jpg',
        alt: 'Adding a blue School post-it to the board and dragging it to the right',
      },
      {
        type: 'paragraph',
        text: '2. Add your tasks. Open a post-it and tap “tap to add…” to write a task. Press Enter and it’s on the list.',
      },
      {
        type: 'video',
        ratio: '16 / 11', // desktop window clip
        src: '/assets/works/todobee-step-2-tasks-desktop.webm',
        poster: '/assets/works/todobee-step-2-tasks-desktop.jpg',
        alt: 'Opening the “today’s buzz” post-it and typing four tasks',
      },
      {
        type: 'paragraph',
        text: '3. Tick them off. Tap a box to finish a task. When every task on a post-it is done, the bee stamps it “Well done”. There are no streaks or scores, just a small reward for finishing.',
      },
      {
        type: 'video',
        ratio: '16 / 11', // desktop window clip
        src: '/assets/works/todobee-step-3-stamp-desktop.webm',
        poster: '/assets/works/todobee-step-3-stamp-desktop.jpg',
        alt: 'Ticking off all four tasks, after which a “Well done” bee stamp appears on the post-it',
      },
      {
        type: 'paragraph',
        text: '4. Not finished? Move it along. “Move this to the next day” sends the unfinished tasks to the same post-it tomorrow, and the ‹ › arrows flip between days, so you can check what’s waiting. And when you open the app on a new day, yesterday’s unfinished tasks are already waiting on matching post-its, while yesterday’s board is locked as history.',
      },
      {
        type: 'video',
        ratio: '16 / 11', // desktop window clip
        src: '/assets/works/todobee-step-4-tomorrow-desktop.webm',
        poster: '/assets/works/todobee-step-4-tomorrow-desktop.jpg',
        alt: 'Moving two unfinished School tasks to tomorrow, then flipping to Monday to find them there',
      },
      {
        type: 'paragraph',
        text: '5. Keep your own log. Pick an Obsidian vault in Settings and every change is written down as plain markdown, one file per day, like this line from the recording above:',
      },
      {
        type: 'list',
        items: [
          '2026-10-04 17:13:38 (Europe/Brussels, UTC+02:00) · task.completed · Status: done · “Write PRD acceptance criteria” · Note: “today’s buzz”',
        ],
      },

      { type: 'heading', text: 'Development' },
      {
        type: 'paragraph',
        text: 'I built it with Electron, Vue 3 and TypeScript, with SQLite for local storage. It works fully offline and logs every task event as plain markdown to an Obsidian vault, one append-only file per day, so the history is never locked inside the app. Its sibling app, Beemodoro, can write to the same vault.',
      },
    ],
  },
  {
    title: 'NMBS',
    slug: 'nmbs',
    category: 'UI/UX',
    date: '2025',
    summary:
      'A Tour Guide Mode for the NMBS app: book, track and report a whole tourist group’s train trip from one phone.',
    // tilted home screen on a gold glow, with floating cards cropped from the
    // lockscreen and trip-options screens (the screens are 2x exports from the
    // Figma page "hi-fi prototype")
    cover: '/assets/works/nmbs-cover.jpg',
    featured: false,
    tools: ['Figma'],
    link: 'https://www.figma.com/design/LVBph6pRvpD3reB3VtoM0m/Hi-Fi-NMBS-Prototype---MELLY?node-id=11-1114',
    // bespoke layout: src/components/case-studies/NmbsCase.vue holds the
    // story (team research → lo-fi, then solo sub-brand → hi-fi → storytelling);
    // the intro paragraph below renders above it
    view: 'nmbs',
    content: [
      {
        type: 'paragraph',
        text: 'The brief was to redesign the NMBS (Belgian railways) app for a different, specific target group. Together with Saulé and Froso, I pitched a different audience: tour guides, the people who plan, book and shepherd groups of tourists across Belgium by train.',
      },
    ],
  },
  {
    title: 'Beemodoro',
    category: 'Desktop app',
    date: 'September 2026',
    summary:
      'Beemodoro is a pixel-art focus timer where you feed a bee a snack to start a Pomodoro session.',
    // walkthrough clip 1 (WebM: Safari 16+ plays it, older shows the poster)
    cover: '/assets/works/beemodoro-step-1-feed.webm',
    poster: '/assets/works/beemodoro-step-1-feed.jpg',
    featured: false,
    timeline: 'September 2026',
    tools: ['Electron', 'Vue 3', 'TypeScript', 'SQLite', 'Obsidian'],
    link: 'https://github.com/MellyMarcelia/beemodoro',
    content: [
      {
        type: 'paragraph',
        text: 'Beemodoro is an offline desktop focus timer. You write down what you’re working on, drag a snack onto the bee, and the timer starts. Bigger snacks mean longer sessions, and every finished session fills a cell in a honeycomb, so your focus history slowly builds into a hive.',
      },

      { type: 'heading', text: 'The idea' },
      {
        type: 'paragraph',
        text: 'Most focus timers are either bare countdowns that are easy to stop using, or gamified apps full of coins and streaks. After comparing apps like Forest, Session and Focus To-Do, I designed Beemodoro around a friendly mascot that only reacts to real work. There’s no score to grind, and a cancelled session simply leaves a cracked cell in the honeycomb, without any guilt.',
      },

      {
        type: 'images',
        items: [
          {
            src: '/assets/works/beemodoro-sketch-layout.jpg',
            alt: 'Hand-drawn sketch: a large empty area on the left and a snack list (honey, pollen, honey jar, flower) with minutes and lifetime totals on the right',
            caption: 'Sketch: layout and snack tray',
          },
          {
            src: '/assets/works/beemodoro-sketch-timer.jpg',
            alt: 'Hand-drawn sketch: Focus time progress bar, bee animation area and a 25:00 countdown with a start button',
            caption: 'Sketch: focus timer',
          },
        ],
      },

      // walkthrough clips: recorded from the real app (fresh test profile, sample history) in a desktop-sized window
      { type: 'heading', text: 'Step by step' },
      {
        type: 'paragraph',
        text: '1. Feed the bee. Type what you’ll work on, or pick one of your open Todobee to-dos. Then drag a snack onto the box: a honey drop is 25 minutes, and the bee starts buzzing.',
      },
      {
        type: 'video',
        ratio: '16 / 11', // desktop window clip
        src: '/assets/works/beemodoro-step-1-feed.webm',
        poster: '/assets/works/beemodoro-step-1-feed.jpg',
        alt: 'Picking the “Finish the case study” to-do and dragging a honey drop onto the focus box to start a 25-minute session',
      },
      {
        type: 'paragraph',
        text: '2. Focus. Pause and the bee falls asleep, resume and it buzzes again. When the time is up the bee cheers, and passing a focus milestone unlocks a new snack look. (The timer is sped up here.)',
      },
      {
        type: 'video',
        ratio: '16 / 11', // desktop window clip
        src: '/assets/works/beemodoro-step-2-focus.webm',
        poster: '/assets/works/beemodoro-step-2-focus.jpg',
        alt: 'Pausing and resuming the session, the timer running down to zero, and a “New snack unlocked: Rose drop” popup',
      },
      {
        type: 'paragraph',
        text: '3. Check the Hive. Every session is a cell in the honeycomb, coloured by snack, and cancelled ones are cracked. Filter the list by date, text, snack or status.',
      },
      {
        type: 'video',
        ratio: '16 / 11', // desktop window clip
        src: '/assets/works/beemodoro-step-3-hive.webm',
        poster: '/assets/works/beemodoro-step-3-hive.jpg',
        alt: 'Opening the Hive, a honeycomb of coloured and cracked cells, and filtering the session list by typing “bee”',
      },
      {
        type: 'paragraph',
        text: '4. Pick a treat. The Pantry shows every snack look and how much focus time the next one needs. Choose one you’ve earned and it shows up in the snack tray.',
      },
      {
        type: 'video',
        ratio: '16 / 11', // desktop window clip
        src: '/assets/works/beemodoro-step-4-pantry.webm',
        poster: '/assets/works/beemodoro-step-4-pantry.jpg',
        alt: 'Opening the Pantry, choosing the Sunny pollen look and going back to the snack tray',
      },

      { type: 'heading', text: 'Development' },
      {
        type: 'paragraph',
        text: 'I built it with Electron, Vue 3 and TypeScript, with SQLite for local storage. It works fully offline, recovers a session if the app crashes, and logs every session as plain markdown to an Obsidian vault, so the user owns their own history.',
      },
    ],
  },
  {
    title: '818',
    category: '3D',
    date: '2025',
    tools: ['Blender'],
    summary: 'A branded mobile bar cart for 818 Tequila, taken from moodboard to 3D render.',
    cover: '/assets/works/818-cart.jpg',
    featured: false,
    content: [
      {
        type: 'paragraph',
        text: 'A mobile bar cart concept for 818 Tequila. The cart carries the brand’s sage green, cream and brass into an event setup: a tap station, a sink, shelves of glassware and bottles, a matching cooler and an A-frame sign that reads “Skip the burn. Taste the smooth.”',
      },

      { type: 'heading', text: 'Moodboard' },
      {
        type: 'paragraph',
        text: 'I started from a moodboard of vintage bar carts, 818 event activations and green and brass cocktail styling, and pulled the colour palette from it.',
      },
      {
        type: 'image',
        bare: true,
        src: '/assets/works/818-moodboard.jpg',
        alt: 'Moodboard: colour palette, bar carts, 818 Tequila signage and green cocktail styling',
      },

      { type: 'heading', text: 'Process' },
      {
        type: 'paragraph',
        text: 'I modelled the cart and the scene in Blender, then lit it with a key, fill and rim light and a warm sun. I checked every change through the camera view in one viewport while moving lights and props in the other.',
      },
      {
        type: 'image',
        src: '/assets/works/818-blender.jpg',
        alt: 'The 818 scene open in Blender, with the camera view above, a working viewport below and the sun light settings in the side panel',
        bare: true,
        fit: true,
      },

      { type: 'heading', text: 'Render' },
      {
        type: 'image',
        src: '/assets/works/818-cart-closeup.jpg',
        alt: 'Close-up render of the 818 bar cart with taps, sink, glassware and the A-frame sign',
      },
      {
        type: 'image',
        src: '/assets/works/818-shelves.jpg',
        alt: 'Detail render of the cart shelves with 818 Tequila Añejo bottles, glassware and a disco ball',
      },
    ],
  },
  {
    title: 'The Diary of Marie Antoinette',
    category: 'Interaction & motion',
    date: '2026',
    tools: ['Magnific'],
    summary: 'A scroll-driven world animation.',
    // scroll-through recording of the live site (WebM: Safari 16+ plays it, older shows the poster)
    cover: '/assets/works/marie-antoinette-thumb.webm',
    poster: '/assets/works/marie-antoinette-thumb.jpg',
    featured: false,
    // live GitHub Pages build (repo: github.com/MellyMarcelia/versailles-scroll)
    link: 'https://mellymarcelia.github.io/versailles-scroll/',
    content: [
      {
        type: 'embed',
        src: 'https://mellymarcelia.github.io/versailles-scroll/',
        title: 'The Diary of Marie Antoinette: live scroll experience',
      },
    ],
  },
  {
    title: 'Lendle',
    category: 'Mobile app',
    date: '2026',
    summary: 'A mobile app, currently in the works.',
    featured: false,
    comingSoon: true,
  },
]

/**
 * Every project, each guaranteed a unique `slug` (explicit, else derived from
 * the title). If two would collide, later ones get "-2", "-3", …
 */
export const projects = (() => {
  const used = new Set()
  return entries.map((p) => {
    let slug = p.slug || slugify(p.title)
    let base = slug
    let n = 2
    while (used.has(slug)) slug = `${base}-${n++}`
    used.add(slug)
    return { ...p, slug }
  })
})()

/** Projects with a case-study page (coming-soon ones have none yet). */
export const caseStudies = projects.filter((p) => !p.comingSoon)

export function getProject(slug) {
  return caseStudies.find((p) => p.slug === slug)
}

export const featuredProjects = projects.filter((p) => p.featured)
