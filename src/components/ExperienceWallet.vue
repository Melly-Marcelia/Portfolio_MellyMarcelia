<script setup>
/**
 * ExperienceWallet — an open leather bifold with tickets tucked into its
 * pockets (a second ticket on one side sits a pocket lower). Click a ticket
 * to pull it out (its tools appear as stamps beside the wallet); click it
 * again, or another ticket, to put it back. The ID card in the right pocket
 * pulls out the same way and shows the full card beside the wallet.
 *
 * Content lives in src/data/wallet.js. Everything is sized in container
 * units (cqw) of .wallet-stage, so the wallet scales as one object.
 */
import { computed, ref } from 'vue'
import { walletCards, idCard } from '@/data/wallet'
import AppText from '@/components/ui/AppText.vue'
import WalletSeam from '@/components/WalletSeam.vue'

const activeId = ref(null)

const active = computed(() => walletCards.find((c) => c.id === activeId.value) ?? null)
const idOut = computed(() => activeId.value === 'id')

// machine-readable strip along the bottom of the ID card, passport style
const mrz = computed(() => {
  const [first, ...rest] = idCard.name.toUpperCase().split(' ')
  return `IDMM<<${rest.join('<')}<<${first}`.padEnd(36, '<')
})

// tools under their `group` headings, in first-seen order (one unnamed group if none)
const activeGroups = computed(() => {
  const groups = []
  for (const tool of active.value?.tools ?? []) {
    let g = groups.find((x) => x.label === tool.group)
    if (!g) groups.push((g = { label: tool.group, tools: [] }))
    g.tools.push(tool)
  }
  return groups
})

const cardsIn = (panel) => walletCards.filter((c) => c.panel === panel)

function toggle(id) {
  activeId.value = activeId.value === id ? null : id
}

/* Letter-mark logos. Brand colours are the tools' own, not site tokens. */
const letterMarks = {
  ai: { text: 'Ai', bg: '#330000', fg: '#ff9a00' },
  ae: { text: 'Ae', bg: '#00005b', fg: '#9999ff' },
  blender: { text: 'Bl', bg: '#e87d0d', fg: '#ffffff' },
  ps: { text: 'Ps', bg: '#001e36', fg: '#31a8ff' },
  id: { text: 'Id', bg: '#49021f', fg: '#ff3366' },
  xd: { text: 'Xd', bg: '#470137', fg: '#ff61f6' },
  js: { text: 'JS', bg: '#f7df1e', fg: '#1a1a1a', corner: true },
  html: { text: '</>', bg: '#e34f26', fg: '#ffffff' },
  css: { text: 'CSS', bg: '#1572b6', fg: '#ffffff', small: true },
  vite: { text: 'Vi', bg: '#646cff', fg: '#ffdd35' },
  scss: { text: 'Sass', bg: '#cd6799', fg: '#ffffff', small: true },
  pinia: { text: 'Pi', bg: '#ffd859', fg: '#1a1a1a' },
  router: { text: 'VR', bg: '#35495e', fg: '#41b883' },  tanstack: { text: 'TQ', bg: '#ff4154', fg: '#ffffff' },
  i18n: { text: 'i18n', bg: '#41b883', fg: '#ffffff', small: true },
  axios: { text: 'ax', bg: '#5a29e4', fg: '#ffffff' },
  node: { text: 'node', bg: '#303030', fg: '#8cc84b', small: true },
  express: { text: 'ex', bg: '#000000', fg: '#ffffff' },
  rest: { text: 'API', bg: '#2d7d6f', fg: '#ffffff', small: true },
  php: { text: 'php', bg: '#777bb4', fg: '#ffffff', small: true },
  mysql: { text: 'My', bg: '#00618a', fg: '#f29111' },
  postgres: { text: 'PG', bg: '#336791', fg: '#ffffff' },
  cloudinary: { text: 'Cl', bg: '#3448c5', fg: '#ffffff' },
  winston: { text: 'W', bg: '#1a1a1a', fg: '#f2c94c' },
}

// small, fixed tilt per stamp so the row looks hand-placed
const tilts = [-6, 4, -3, 5, -4, 3]

/* ---- saddle stitching ------------------------------------------------
   Drawn in SVG in cqw units (one panel is 50 × 64cqw): a row of awl holes
   along the seam, with a short slanted run of thread between each pair, as
   a hand-sewn saddle stitch looks. Each stitch wobbles a little in angle and
   length so the row doesn't look machine-perfect. */
const PANEL_W = 50
const PANEL_H = 64
const STITCH_INSET = 1.5 // matches --stitch-inset
const STITCH_R = 2 // corner radius of the stitch line (--r minus 1cqw)
const PITCH = 1.7 // hole to hole
const SLANT = (-22 * Math.PI) / 180

// a seam as straight lines and arcs ({ line: [x1, y1, x2, y2] } or
// { arc: [cx, cy, r, fromRad, toRad] }) → SVG path + stitch positions
function sew(segments) {
  const parts = segments.map((s) => {
    if (s.line) {
      const [x1, y1, x2, y2] = s.line
      const len = Math.hypot(x2 - x1, y2 - y1)
      return { len, at: (t) => [x1 + (x2 - x1) * t, y1 + (y2 - y1) * t, Math.atan2(y2 - y1, x2 - x1)] }
    }
    const [cx, cy, r, a0, a1] = s.arc
    const dir = Math.sign(a1 - a0)
    return {
      len: Math.abs(a1 - a0) * r,
      at: (t) => {
        const a = a0 + (a1 - a0) * t
        return [cx + r * Math.cos(a), cy + r * Math.sin(a), a + (dir * Math.PI) / 2]
      },
    }
  })
  const total = parts.reduce((n, p) => n + p.len, 0)
  const count = Math.round(total / PITCH)
  const pitch = total / count

  const pointAt = (s) => {
    for (const p of parts) {
      if (s <= p.len) return p.at(s / p.len)
      s -= p.len
    }
    return parts.at(-1).at(1)
  }

  const stitches = []
  for (let i = 0; i < count; i++) {
    const [x, y, dir] = pointAt((i + 0.5) * pitch)
    // deterministic wobble, the same on every render
    const n1 = Math.sin(i * 12.9898 + total * 78.233) * 43758.5453
    const n2 = Math.sin(i * 39.3467 + total * 11.135) * 24634.6345
    const j1 = n1 - Math.floor(n1) - 0.5
    const j2 = n2 - Math.floor(n2) - 0.5
    const a = dir + SLANT + j1 * 0.12
    const h = pitch * (0.36 + j2 * 0.04)
    const dx = Math.cos(a) * h
    const dy = Math.sin(a) * h
    stitches.push({ x1: x - dx, y1: y - dy, x2: x + dx, y2: y + dy })
  }

  const d = segments
    .map((s, k) => {
      if (s.line) return `${k ? 'L' : 'M'}${s.line[0]} ${s.line[1]} L${s.line[2]} ${s.line[3]}`
      const [cx, cy, r, , a1] = s.arc
      const sweep = s.arc[4] > s.arc[3] ? 1 : 0
      return `A${r} ${r} 0 0 ${sweep} ${cx + r * Math.cos(a1)} ${cy + r * Math.sin(a1)}`
    })
    .join(' ')

  return { d, stitches }
}

// outer edge of the left panel, open at the spine; the right one is its mirror
const i = STITCH_INSET
const r = STITCH_R
const outerSeam = sew([
  { line: [PANEL_W, i, i + r, i] },
  { arc: [i + r, i + r, r, -Math.PI / 2, -Math.PI] },
  { line: [i, i + r, i, PANEL_H - i - r] },
  { arc: [i + r, PANEL_H - i - r, r, Math.PI, Math.PI / 2] },
  { line: [i + r, PANEL_H - i, PANEL_W, PANEL_H - i] },
])

// each pocket's spine-side seam, from just under its top edge down to the
// outer stitching; pocket tops match .pocket--1/2/3
const SEAM_TOP = 1.4
const pocketSeams = Object.fromEntries(
  [14, 26, 40].map((top, k) => {
    const len = PANEL_H - top - SEAM_TOP - STITCH_INSET
    return [k + 1, { len, ...sew([{ line: [0, 0, 0, len] }]) }]
  }),
)
// a 1cqw-wide strip with the seam down its middle
const seamBox = (k) => `-0.5 0 1 ${pocketSeams[k].len}`
</script>

<template>
  <div class="wallet-block">
    <div class="wallet-stage">
      <div class="wallet" :class="{ 'has-active': activeId }">
        <div
          v-for="side in ['left', 'right']"
          :key="side"
          class="wallet__half"
          :class="`wallet__half--${side}`"
        >
          <div class="wallet__panel" :class="`wallet__panel--${side}`">
            <button
              v-for="(card, slot) in cardsIn(side)"
              :key="card.id"
              type="button"
              class="ticket"
              :class="[`ticket--${card.tone}`, `ticket--slot-${slot}`, { 'is-out': activeId === card.id }]"
              :aria-pressed="activeId === card.id"
              :aria-label="`${card.title}: ${activeId === card.id ? 'put back' : 'pull out'}`"
              @click="toggle(card.id)"
            >
              <span class="ticket__main">
                <span class="ticket__title">{{ card.title }}</span>
                <span class="ticket__tags">
                  <span v-for="tag in card.tags" :key="tag" class="ticket__tag">{{ tag }}</span>
                </span>
              </span>
              <span class="ticket__stub" aria-hidden="true"><span class="ticket__barcode" /></span>
            </button>

            <svg class="stitching" :viewBox="`0 0 ${PANEL_W} ${PANEL_H}`" aria-hidden="true">
              <WalletSeam :seam="outerSeam" />
            </svg>

            <div class="pocket pocket--1" aria-hidden="true">
              <svg class="pocket__seam" :viewBox="seamBox(1)"><WalletSeam :seam="pocketSeams[1]" /></svg>
            </div>
            <button
              v-if="side === 'right'"
              type="button"
              class="id-card"
              :class="{ 'is-out': idOut }"
              :aria-pressed="idOut"
              :aria-label="`ID card: ${idOut ? 'put back' : 'pull out'}`"
              @click="toggle('id')"
            >
              <span class="id-card__band">
                <span>Identity card</span>
                <span class="id-card__chip" aria-hidden="true" />
              </span>
              <span class="id-card__body" aria-hidden="true">
                <img class="id-card__photo" :src="idCard.photo" alt="" draggable="false" />
                <span class="id-card__info">
                  <span class="id-card__name">{{ idCard.name }}</span>
                  <span v-for="f in idCard.fields" :key="f.label" class="id-card__row">
                    <span class="id-card__label">{{ f.label }}</span>{{ f.value }}
                  </span>
                </span>
              </span>
              <span class="id-card__mrz" aria-hidden="true">{{ mrz }}</span>
            </button>
            <div class="pocket pocket--2" aria-hidden="true">
              <svg class="pocket__seam" :viewBox="seamBox(2)"><WalletSeam :seam="pocketSeams[2]" /></svg>
            </div>
            <div class="pocket pocket--3" aria-hidden="true">
              <svg class="pocket__seam" :viewBox="seamBox(3)"><WalletSeam :seam="pocketSeams[3]" /></svg>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="wallet-info">
      <AppText variant="h3" as="h2" class="wallet-info__title">Experience Wallet</AppText>
      <AppText variant="body-sm" tone="faint">Click a ticket or the ID card to pull it out, click again to put it back.</AppText>

      <div class="wallet-info__body" aria-live="polite">
        <div v-if="active" :key="active.id">
          <AppText variant="eyebrow" tone="accent" class="wallet-info__eyebrow">
            {{ active.title }} toolkit
          </AppText>
          <template v-for="group in activeGroups" :key="group.label ?? 'all'">
            <p v-if="group.label" class="stamps__group">{{ group.label }}</p>
            <ul class="stamps">
              <li
                v-for="(tool, i) in group.tools"
                :key="tool.name"
                class="stamps__item"
                :style="{ '--i': i, '--tilt': `${tilts[i % tilts.length]}deg` }"
              >
                <span class="stamp">
                  <span
                    v-if="letterMarks[tool.logo]"
                    class="stamp__art stamp__art--letters"
                    :class="{ 'is-corner': letterMarks[tool.logo].corner, 'is-small': letterMarks[tool.logo].small }"
                    :style="{ background: letterMarks[tool.logo].bg, color: letterMarks[tool.logo].fg }"
                  >{{ letterMarks[tool.logo].text }}</span>

                  <span v-else-if="tool.logo === 'figma'" class="stamp__art" style="background: #2c2c2c">
                    <svg viewBox="0 0 38 57" width="20" height="30">
                      <path d="M19 28.5a9.5 9.5 0 1 1 19 0 9.5 9.5 0 0 1-19 0z" fill="#1ABCFE" />
                      <path d="M0 47.5A9.5 9.5 0 0 1 9.5 38H19v9.5a9.5 9.5 0 1 1-19 0z" fill="#0ACF83" />
                      <path d="M19 0v19h9.5a9.5 9.5 0 1 0 0-19H19z" fill="#FF7262" />
                      <path d="M0 9.5A9.5 9.5 0 0 0 9.5 19H19V0H9.5A9.5 9.5 0 0 0 0 9.5z" fill="#F24E1E" />
                      <path d="M0 28.5A9.5 9.5 0 0 0 9.5 38H19V19H9.5A9.5 9.5 0 0 0 0 28.5z" fill="#A259FF" />
                    </svg>
                  </span>

                  <span v-else-if="tool.logo === 'procreate'" class="stamp__art" style="background: #111">
                    <svg viewBox="0 0 40 40" width="34" height="34">
                      <defs>
                        <linearGradient id="procreate-g" x1="0" y1="1" x2="1" y2="0">
                          <stop offset="0" stop-color="#f8b26a" />
                          <stop offset=".45" stop-color="#e84a8a" />
                          <stop offset="1" stop-color="#6c5ce7" />
                        </linearGradient>
                      </defs>
                      <path d="M8 32c4-2 6-6 9-11s7-10 13-12c-3 4-5 9-9 14s-8 8-13 9z" fill="url(#procreate-g)" />
                    </svg>
                  </span>

                  <span v-else-if="tool.logo === 'vue'" class="stamp__art" style="background: #fff">
                    <svg viewBox="0 0 261.76 226.69" width="34" height="30">
                      <path d="M161.1 0 130.9 52.35 100.6 0H0l130.9 226.7L261.8 0z" fill="#41b883" />
                      <path d="M161.1 0 130.9 52.35 100.6 0H52.3l78.6 136L209.4 0z" fill="#34495e" />
                    </svg>
                  </span>

                  <span v-else-if="tool.logo === 'three'" class="stamp__art" style="background: #000">
                    <svg viewBox="0 0 40 40" width="32" height="32" fill="none" stroke="#fff" stroke-width="1.6" stroke-linejoin="round">
                      <path d="M6 34 14 6l20 20z" />
                      <path d="M10 20l14 3-10-17M24 23l-18 11" />
                    </svg>
                  </span>
                </span>
                <span class="stamps__name">{{ tool.name }}</span>
              </li>
            </ul>
          </template>
        </div>

        <div v-else-if="idOut" class="idc">
          <div class="idc__head">
            <span>Identity card</span>
            <span class="idc__no">№ MM-0001</span>
          </div>
          <div class="idc__body">
            <div class="idc__photo">
              <img :src="idCard.photo" :alt="`Photo of ${idCard.name}`" />
            </div>
            <dl class="idc__fields">
              <div class="idc__field idc__field--name">
                <dt>Name</dt>
                <dd>{{ idCard.name }}</dd>
              </div>
              <div
                v-for="f in idCard.fields"
                :key="f.label"
                class="idc__field"
                :class="{ 'idc__field--wide': f.wide }"
              >
                <dt>{{ f.label }}</dt>
                <dd>{{ f.value || '-' }}</dd>
              </div>
            </dl>
          </div>
          <div class="idc__foot">
            <span class="idc__mrz" aria-hidden="true">{{ mrz }}</span>
          </div>
        </div>

        <p v-else class="wallet-info__hint">pick a ticket ✦</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.wallet-block {
  --gap: clamp(2rem, 5vw, 4rem);
  container-type: inline-size;
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1.15fr);
  gap: var(--gap);
  align-items: start;
}
.wallet-info {
  grid-column: 1;
  grid-row: 1;
  /* start level with the wallet itself: skip the same headroom the stage
     reserves (33% of the stage width = min(540px, its 1.15fr column)) */
  padding-top: calc(0.33 * min(540px, (100cqw - var(--gap)) * 1.15 / 2.15));
}

/* ---- the wallet ---------------------------------------------------- */
.wallet-stage {
  container-type: inline-size;
  grid-column: 2;
  grid-row: 1;
  justify-self: end;
  width: 100%;
  max-width: 540px;
}
.wallet-stage::before {
  content: '';
  display: block;
  height: 33cqw; /* headroom for a pulled-out ticket */
}

.wallet {
  /* pebbled grain as a height map lit from the top left, centred on mid-grey
     so it can be overlaid on any dye */
  --leather-grain: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='240'%3E%3Cfilter id='g' x='0' y='0'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.42' numOctaves='3' seed='7' stitchTiles='stitch'/%3E%3CfeDiffuseLighting surfaceScale='1.1' lighting-color='%23fff'%3E%3CfeDistantLight azimuth='225' elevation='52'/%3E%3C/feDiffuseLighting%3E%3CfeComponentTransfer%3E%3CfeFuncR type='linear' slope='.6' intercept='.04'/%3E%3CfeFuncG type='linear' slope='.6' intercept='.04'/%3E%3CfeFuncB type='linear' slope='.6' intercept='.04'/%3E%3C/feComponentTransfer%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23g)'/%3E%3C/svg%3E");
  /* light falls from the top left, so every leather surface gets the same sheen */
  --leather-sheen: radial-gradient(130% 90% at 15% 0%, rgba(255, 255, 255, 0.14), transparent 60%);
  --r: 3cqw;
  --thick: 0.8cqw; /* leather thickness, shown as the cut edge */
  --edge-paint: var(--leather-900);
  --stitch-inset: 1.5cqw;
  --slot-gap: 2.8cqw; /* card slots stop short of the spine */
  --lie: 5deg; /* the halves rise a little from the spine, like an open book */
  --sink: -4.4cqw; /* …pushed back so the raised outer edges keep the flat footprint */
  position: relative;
  display: grid;
  grid-template-columns: 1fr 1fr;
  height: 64cqw;
  perspective: 160cqw;
}

/* one soft shadow on the table under the whole wallet */
.wallet::before {
  content: '';
  position: absolute;
  inset: 0.6cqw 0.4cqw 0;
  border-radius: var(--r);
  pointer-events: none;
  box-shadow:
    0 calc(var(--thick) + 0.3cqw) 0.9cqw rgba(var(--c-seed-rgb), 0.35),
    0 3cqw 4cqw -0.6cqw rgba(var(--c-seed-rgb), 0.28);
}

.wallet__half {
  position: relative;
  z-index: 1;
}
.wallet__half--left {
  z-index: 2;
  transform-origin: right center;
  transform: translateZ(var(--sink)) rotateY(var(--lie));
}
.wallet__half--right {
  transform-origin: left center;
  transform: translateZ(var(--sink)) rotateY(calc(var(--lie) * -1));
}

.wallet__panel {
  position: absolute;
  inset: 0;
  isolation: isolate;
  background:
    var(--leather-sheen),
    var(--leather-grain),
    linear-gradient(170deg, var(--leather-700), var(--leather-800) 70%, var(--leather-900));
  background-blend-mode: normal, soft-light, normal;
}
/* painted edge, a bevel catching the light, the valley at the spine with a
   soft ridge either side of it, a little wear round the outside, and the
   leather's thickness below */
.wallet__panel--left {
  border-radius: var(--r) 0 0 var(--r);
  box-shadow:
    inset -1px 0 0 rgba(0, 0, 0, 0.55), /* the crease itself */
    inset -2.6cqw 0 2.4cqw -1.4cqw rgba(0, 0, 0, 0.55),
    inset -4.4cqw 0 1.6cqw -3.4cqw rgba(255, 255, 255, 0.1),
    inset 0 0 0 0.3cqw var(--edge-paint),
    inset 0 0.5cqw 0.3cqw -0.25cqw rgba(255, 255, 255, 0.16),
    inset 1.6cqw 0 3cqw -1.6cqw rgba(0, 0, 0, 0.2),
    0 var(--thick) 0 var(--edge-paint);
}
.wallet__panel--right {
  border-radius: 0 var(--r) var(--r) 0;
  box-shadow:
    inset 1px 0 0 rgba(255, 255, 255, 0.08),
    inset 2.6cqw 0 2.4cqw -1.4cqw rgba(0, 0, 0, 0.55),
    inset 4.4cqw 0 1.6cqw -3.4cqw rgba(255, 255, 255, 0.08),
    inset 0 0 0 0.3cqw var(--edge-paint),
    inset 0 0.5cqw 0.3cqw -0.25cqw rgba(255, 255, 255, 0.16),
    inset -1.6cqw 0 3cqw -1.6cqw rgba(0, 0, 0, 0.2),
    0 var(--thick) 0 var(--edge-paint);
}

/* saddle stitching round the outer edge, through every layer (see sew()) */
.stitching {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  overflow: visible;
  pointer-events: none;
  z-index: 6;
}
.wallet__panel--right .stitching {
  transform: scaleX(-1);
}

/* ---- card slots (front leather layers, lower = nearer) ------------- */
/* each slot is its own layer of leather, sewn into the outer stitching and
   stitched down again on its spine side: painted cut edges with a small
   bevel, and a soft shadow thrown onto whatever is tucked behind it */
.pocket {
  position: absolute;
  bottom: 0;
  background:
    var(--leather-sheen),
    var(--leather-grain),
    linear-gradient(180deg, var(--leather-500), var(--leather-600) 22%, var(--leather-700) 85%, var(--leather-800));
  background-blend-mode: normal, soft-light, normal;
  border-top: 0.3cqw solid var(--edge-paint);
}
.wallet__panel--left .pocket {
  left: 0;
  right: var(--slot-gap);
  border-right: 0.3cqw solid var(--edge-paint);
  border-radius: 0 0.8cqw 0 var(--r);
  box-shadow:
    inset 0 0.35cqw 0.2cqw -0.1cqw rgba(255, 255, 255, 0.2),
    inset -0.35cqw 0 0.2cqw -0.1cqw rgba(255, 255, 255, 0.1),
    inset -2cqw 0 2cqw -1.2cqw rgba(0, 0, 0, 0.3), /* curving into the spine */
    0.3cqw -0.35cqw 0.9cqw rgba(0, 0, 0, 0.4);
}
.wallet__panel--right .pocket {
  left: var(--slot-gap);
  right: 0;
  border-left: 0.3cqw solid var(--edge-paint);
  border-radius: 0.8cqw 0 var(--r) 0;
  box-shadow:
    inset 0 0.35cqw 0.2cqw -0.1cqw rgba(255, 255, 255, 0.2),
    inset 0.35cqw 0 0.2cqw -0.1cqw rgba(255, 255, 255, 0.1),
    inset 2cqw 0 2cqw -1.2cqw rgba(0, 0, 0, 0.3),
    -0.3cqw -0.35cqw 0.9cqw rgba(0, 0, 0, 0.4);
}
/* the spine-side seam, sewn top to bottom */
.pocket__seam {
  position: absolute;
  top: 1.1cqw; /* + the 0.3cqw top edge = SEAM_TOP */
  width: 1cqw;
  height: calc(100% - 1.1cqw - var(--stitch-inset));
  overflow: visible;
  pointer-events: none;
}
.wallet__panel--left .pocket__seam {
  right: 0.6cqw; /* centre 1.1cqw in from the slot's edge */
}
.wallet__panel--right .pocket__seam {
  left: 0.6cqw;
  transform: scaleX(-1);
}
.pocket--1 {
  top: 14cqw;
  z-index: 2;
}
.pocket--2 {
  top: 26cqw;
  z-index: 4;
}
.pocket--3 {
  top: 40cqw;
  z-index: 5;
}

/* ID card in the right middle pocket, ticket-sized — pulls out like a ticket.
   The dark band is what peeks above the pocket, so it reads as an ID at rest. */
.id-card {
  --lift: 0cqw;
  position: absolute;
  top: 19.6cqw; /* only the dark band shows above the middle pocket (26cqw) */
  left: 3.5cqw;
  width: 43cqw; /* ticket width, bank-card proportions */
  height: 27cqw;
  z-index: 3;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  padding: 0;
  border: 0;
  border-radius: 1.4cqw;
  background: var(--card-stock);
  color: var(--ticket-ink);
  text-align: left;
  cursor: pointer;
  box-shadow: 0 0.3cqw 0.8cqw rgba(0, 0, 0, 0.25);
  transform: translateY(var(--lift)) rotate(var(--tilt, 0deg));
  transition:
    transform 0.55s var(--ease-soft),
    box-shadow 0.55s var(--ease-soft),
    z-index 0s linear 0s;
}
.id-card:hover,
.id-card:focus-visible {
  --lift: -2.2cqw;
}
.id-card:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 3px;
}
.id-card.is-out {
  --lift: -49.6cqw; /* ends level with a pulled-out ticket */
  --tilt: 3deg;
  z-index: 10;
  box-shadow: 0 2cqw 4cqw rgba(0, 0, 0, 0.3);
  transition:
    transform 0.55s var(--ease-soft),
    box-shadow 0.55s var(--ease-soft),
    z-index 0s linear 0.22s;
}
.id-card__band {
  flex: none;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 6.4cqw;
  padding: 0 2.6cqw;
  background: var(--ticket-ink);
  color: var(--card-stock);
  font-size: 1.8cqw;
  font-weight: 800;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}
.id-card__chip {
  width: 4.3cqw;
  height: 3.2cqw;
  border-radius: 0.6cqw;
  /* gold contact chip — a fixed metal colour, like the tool logos */
  background:
    linear-gradient(90deg, transparent 45%, rgba(0, 0, 0, 0.18) 45% 55%, transparent 55%),
    linear-gradient(0deg, transparent 45%, rgba(0, 0, 0, 0.18) 45% 55%, transparent 55%),
    linear-gradient(135deg, #f1d488, #c9a24a);
}
.id-card__body {
  flex: 1;
  display: flex;
  gap: 2.6cqw;
  padding: 2cqw 2.6cqw 0;
}
.id-card__photo {
  flex: none;
  width: 10.6cqw;
  height: 13.4cqw;
  border-radius: 0.8cqw;
  object-fit: cover;
  object-position: top;
  background: var(--color-placeholder);
}
.id-card__info {
  display: flex;
  flex-direction: column;
  gap: 0.6cqw;
  min-width: 0;
}
.id-card__name {
  font-size: 2.8cqw;
  font-weight: 800;
  line-height: 1.1;
}
.id-card__row {
  display: flex;
  flex-direction: column;
  font-size: 1.7cqw;
  font-weight: 600;
  line-height: 1.1;
  white-space: nowrap;
}
.id-card__label {
  font-size: 1.2cqw;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  opacity: 0.55;
}
.id-card__mrz {
  flex: none;
  padding: 1cqw 2.6cqw 1.4cqw;
  overflow: hidden;
  font-family: ui-monospace, 'SF Mono', Menlo, monospace;
  font-size: 1.5cqw;
  letter-spacing: 0.14em;
  white-space: nowrap;
  opacity: 0.5;
}

/* ---- tickets ---------------------------------------------------- */
.ticket {
  --lift: 0cqw;
  --tilt: 0deg;
  position: absolute;
  top: 4cqw;
  left: 3.5cqw;
  width: 43cqw;
  height: 28cqw;
  z-index: 1;
  display: flex;
  padding: 0;
  border: 0;
  border-radius: 1.2cqw;
  background: none;
  color: var(--ticket-ink);
  text-align: left;
  cursor: pointer;
  /* drop-shadow (not box-shadow) so the shadow follows the punched notches */
  filter: drop-shadow(0 0.4cqw 0.6cqw rgba(0, 0, 0, 0.28));
  transform: translateY(var(--lift)) rotate(var(--tilt));
  transition:
    transform 0.55s var(--ease-soft),
    filter 0.55s var(--ease-soft),
    z-index 0s linear 0s; /* going back: drop behind the pocket right away */
}
/* the card stock, with half-round notches punched top and bottom on the
   perforation line (stub is 8cqw wide; its dashed edge is 0.3cqw) */
.ticket::before {
  --notch-x: calc(100% - 8cqw + 0.15cqw);
  content: '';
  position: absolute;
  inset: 0;
  z-index: -1;
  border-radius: inherit;
  background: var(--ticket-stock);
  -webkit-mask:
    radial-gradient(circle 1.1cqw at var(--notch-x) 0, transparent 98%, #000 100%),
    radial-gradient(circle 1.1cqw at var(--notch-x) 100%, transparent 98%, #000 100%);
  -webkit-mask-composite: source-in;
  mask:
    radial-gradient(circle 1.1cqw at var(--notch-x) 0, transparent 98%, #000 100%),
    radial-gradient(circle 1.1cqw at var(--notch-x) 100%, transparent 98%, #000 100%);
  mask-composite: intersect;
}
.ticket--leaf::before {
  background: var(--ticket-stock-leaf);
}
.ticket:hover,
.ticket:focus-visible {
  --lift: -2.2cqw;
}
.ticket:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 3px;
}
.ticket.is-out {
  --lift: calc(-34cqw - var(--drop, 0cqw));
  --tilt: -2.5deg;
  z-index: 10;
  filter: drop-shadow(0 2cqw 2.4cqw rgba(0, 0, 0, 0.3));
  /* coming out: only jump in front once the ticket has cleared the pocket */
  transition:
    transform 0.55s var(--ease-soft),
    filter 0.55s var(--ease-soft),
    z-index 0s linear 0.22s;
}
.wallet__panel--right .ticket.is-out {
  --tilt: 2.5deg;
}

/* on the right, clear of the slots' spine-side seam */
.wallet__panel--right .ticket,
.id-card {
  left: 4.2cqw;
}

/* second ticket on a side: tucked into the middle pocket, pulls out to the same height */
.ticket--slot-1 {
  --drop: 12cqw;
  top: 16cqw;
  z-index: 3;
}

.ticket__main {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2cqw;
  padding: 2.4cqw 2.6cqw;
}
.ticket__title {
  font-size: 4cqw;
  font-weight: 700;
  letter-spacing: var(--tracking-tight);
  line-height: 1;
}
.ticket__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 1cqw;
}
.ticket__tag {
  padding: 0.5cqw 1.5cqw;
  border: 0.25cqw solid currentColor;
  border-radius: var(--radius-pill);
  font-size: 1.75cqw;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  white-space: nowrap;
}

/* perforated stub + barcode */
.ticket__stub {
  position: relative;
  width: 8cqw;
  padding: 2cqw 1.8cqw;
}
/* perforation: runs between the notches, not through them */
.ticket__stub::before {
  content: '';
  position: absolute;
  top: 1.5cqw;
  bottom: 1.5cqw;
  left: 0;
  border-left: 0.3cqw dashed currentColor;
}
.ticket__barcode {
  display: block;
  height: 100%;
  background: repeating-linear-gradient(
    to bottom,
    currentColor 0 0.5cqw,
    transparent 0.5cqw 0.8cqw,
    currentColor 0.8cqw 1cqw,
    transparent 1cqw 1.6cqw,
    currentColor 1.6cqw 2.3cqw,
    transparent 2.3cqw 2.6cqw
  );
}

/* ---- full ID card (info column) ------------------------------------ */
.idc {
  max-width: 420px;
  padding: 1rem 1.15rem 0.85rem;
  border-radius: 14px;
  color: var(--ticket-ink);
  background:
    repeating-radial-gradient(circle at 85% 20%, transparent 0 9px, rgba(var(--c-seed-rgb), 0.04) 9px 10px),
    var(--card-stock);
  box-shadow:
    0 1px 2px rgba(var(--c-seed-rgb), 0.1),
    0 14px 30px -12px rgba(var(--c-seed-rgb), 0.35);
  animation: stamp-in 0.5s var(--ease-soft) both;
}
.idc__head {
  display: flex;
  justify-content: space-between;
  padding-bottom: 0.55rem;
  margin-bottom: 0.8rem;
  border-bottom: 1px solid rgba(var(--c-seed-rgb), 0.15);
  font-size: 0.68rem;
  font-weight: 800;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}
.idc__no {
  font-family: ui-monospace, 'SF Mono', Menlo, monospace;
  letter-spacing: 0.04em;
  opacity: 0.7;
}
.idc__body {
  display: grid;
  grid-template-columns: 30% 1fr;
  gap: 1rem;
}
.idc__photo {
  aspect-ratio: 3 / 4;
  overflow: hidden;
  border-radius: 6px;
  background: var(--color-placeholder);
}
.idc__photo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: top;
}
.idc__fields {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.55rem 0.9rem;
  align-content: start;
}
.idc__field--name,
.idc__field--wide {
  grid-column: 1 / -1;
}
.idc__field dt {
  font-size: 0.6rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  opacity: 0.6;
}
.idc__field dd {
  font-size: 0.82rem;
  font-weight: 600;
  line-height: 1.25;
}
.idc__field--name dd {
  font-size: 1.05rem;
  font-weight: 800;
}
.idc__foot {
  margin-top: 0.7rem;
}
.idc__mrz {
  display: block;
  padding-top: 0.45rem;
  border-top: 1px dashed rgba(var(--c-seed-rgb), 0.25);
  overflow: hidden;
  font-family: ui-monospace, 'SF Mono', Menlo, monospace;
  font-size: 0.7rem;
  letter-spacing: 0.18em;
  white-space: nowrap;
  opacity: 0.6;
}

/* ---- info column + stamps --------------------------------------- */
.wallet-info__title {
  margin-bottom: 0.35rem;
}
.wallet-info__body {
  margin-top: var(--space-l);
  min-height: 15rem;
}
.wallet-info__eyebrow {
  margin-bottom: var(--space-m);
}
.wallet-info__hint {
  font-family: var(--font-hand);
  font-size-adjust: var(--hand-size-adjust);
  -webkit-text-stroke: var(--hand-stroke) currentColor;
  color: var(--color-ink-faint);
  font-size: var(--step-0);
}

.stamps {
  list-style: none;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--space-m) var(--space-l);
}
.stamps + .stamps__group {
  margin-top: var(--space-xl);
}
.stamps__group {
  margin-bottom: var(--space-s);
  font-size: var(--step--1);
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--color-ink-faint);
}
.stamps__item {
  display: flex;
  align-items: center;
  gap: var(--space-s);
  animation: stamp-in 0.5s var(--ease-soft) both;
  animation-delay: calc(var(--i) * 70ms);
}
.stamps__item:nth-child(even) {
  margin-top: var(--space-l); /* staggered, like stamps stuck on by hand */
}
.stamps__name {
  font-size: var(--step--1);
  font-weight: 600;
  color: var(--color-ink-soft);
}

/* perforated stamp: holes are a dot grid, the logo covers all but the rim */
.stamp {
  position: relative;
  flex: none;
  width: 64px;
  height: 64px;
  padding: 5px;
  background: radial-gradient(circle, transparent 2.4px, var(--stamp-paper) 2.9px) -4px -4px / 8px 8px;
  transform: rotate(var(--tilt));
  filter: drop-shadow(0 3px 5px rgba(var(--c-seed-rgb), 0.25));
}
.stamp__art {
  display: grid;
  place-items: center;
  width: 100%;
  height: 100%;
}
.stamp__art--letters {
  font-size: 1.45rem;
  font-weight: 800;
  letter-spacing: -0.02em;
}
.stamp__art--letters.is-small {
  font-size: 1rem;
}
.stamp__art--letters.is-corner {
  place-items: end;
  padding: 4px 5px;
  font-size: 1.1rem;
}

@keyframes stamp-in {
  from {
    opacity: 0;
    transform: scale(1.35) rotate(8deg);
  }
  60% {
    opacity: 1;
    transform: scale(0.96);
  }
  to {
    opacity: 1;
    transform: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .ticket,
  .ticket.is-out,
  .id-card,
  .id-card.is-out {
    transition-duration: 0.01s;
  }
  .stamps__item,
  .idc {
    animation: none;
  }
}

@media (max-width: 820px) {
  .wallet-block {
    grid-template-columns: 1fr;
  }
  .wallet-info,
  .wallet-stage {
    grid-column: auto;
    grid-row: auto;
  }
  .wallet-info {
    padding-top: 0;
  }
  .wallet-info__body {
    min-height: 0;
  }
}
</style>
