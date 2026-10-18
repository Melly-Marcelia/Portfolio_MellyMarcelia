<script setup>
/**
 * ArtGallery3D — artworks as frosted glass cards standing on a ring.
 *
 * Each card stands radially (edge-on to the ring), so seen from just above
 * and in front, the pieces fan out: edge-on in the middle, opening up face-on
 * towards both sides, the far half softer and hazier than the near half.
 * The ring drifts slowly on its own; drag / swipe or horizontal trackpad
 * scroll spins it (with inertia). Hovering a card slides it out and clears
 * its haze; tapping one opens it in a full-screen viewer. Pinch (touch) zooms;
 * arrow keys browse and Enter opens when the stage has focus.
 *
 * The ring repeats the artworks until it holds at least MIN_CARDS cards so it
 * always reads as dense. Artwork faces use unlit materials so colours / photos
 * stay true. Rendering pauses while the stage is off-screen.
 *
 * Optional extras: webcam hand control (useHandControl) and a ratchet tick +
 * vibration as cards pass (useGalleryFeedback). One or two hands: each gets
 * its own cursor, and resting one on a card counts 1 · 2 · 3, then opens it;
 * spreading both hands apart / together zooms.
 *
 * The earlier flat-board ring is shelved in src/_shelved/art-gallery-ring/.
 */
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import * as THREE from 'three'
import { useTheme } from '@/composables/useTheme'
import { useGalleryFeedback } from '@/composables/useGalleryFeedback'
import { startHandControl } from '@/composables/useHandControl'

const props = defineProps({
  items: { type: Array, required: true },
})

const stage = ref(null)
const canvas = ref(null)
const active = ref(0)
const webglFailed = ref(false)
const camVideo = ref(null)
const camCanvas = ref(null)
const cursorEls = [] // one hand cursor per tracked hand
const viewer = ref(false) // full-screen view of the current piece
const viewerClose = ref(null)
const hand = ref('off') // off | loading | on | error
const handError = ref('')
const handSupported = typeof navigator !== 'undefined' && !!navigator.mediaDevices?.getUserMedia
// touch screens can't hover the chip, so an info button opens its note on tap
const handNoteOpen = ref(false)
const handInfo = ref(null)
function closeHandNote(e) {
  if (e.type === 'keydown' ? e.key === 'Escape' : !handInfo.value?.contains(e.target))
    handNoteOpen.value = false
}
watch(handNoteOpen, (open) => {
  const fn = open ? 'addEventListener' : 'removeEventListener'
  document[fn]('pointerdown', closeHandNote)
  document[fn]('keydown', closeHandNote)
})
const current = computed(() => props.items[active.value])
const counter = computed(
  () =>
    `${String(active.value + 1).padStart(2, '0')} / ${String(props.items.length).padStart(2, '0')}`,
)

const { theme } = useTheme()
const feedback = useGalleryFeedback()

const hint = computed(() => {
  if (hand.value === 'on') return 'Hold still on a piece for 3s to open · flick or sweep to spin · two hands apart to zoom'
  if (hand.value === 'loading') return 'Starting camera…'
  if (hand.value === 'error') return handError.value
  return 'Drag to spin · tap a piece to view'
})

const CARD_H = 2.1 // card height in world units
const CARD_MAX_W = 2.6 // wide pieces shrink to fit this
const MIN_CARDS = 32 // the ring repeats the artworks until it holds this many
const RADIUS = 4.2
const TILT = 0.13 // camera elevation above the ring, radians
const FOV = 22
const DRIFT = 0.22 // idle spin, cards per second
const IDLE_MS = 2500 // quiet time before the idle spin resumes
const POP = 0.4 // how far a hovered card slides outwards
const DWELL_MS = 3000 // hand cursor resting on a piece this long opens it
const DWELL_STEPS = 3 // counted out loud on the cursor: 1, 2, 3
const DWELL_GRACE = 600 // ms the cursor must settle on a piece before the count starts
const DWELL_STEADY = 0.05 // drifting further than this (share of the stage) restarts it
const TAP_SLOP = 10 // px a press may wander and still count as a tap
const RING_C = 2 * Math.PI * 18 // circumference of the cursor's progress ring

const reduceMotion =
  typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

// three.js state lives outside Vue's reactivity
let renderer, scene, camera, ring, raf, io, ro
let slots = [] // { item, card, artF, artB, hazeF, hazeB, edges, shadow, mats, pop }
let textures = [] // one per artwork, shared by its repeats
let hazeTex, shadowTex
let step = 1
let rot = 0 // ring position in cards (float)
let target = 0
let lastSlot = 0
let lastInteract = 0
let zoom = 1 // pinch multiplier
let camDist = 10
let visible = false
let lastT = 0
const pointers = new Map()
let drag = null // { x, y, t, moved, vel, lastX, lastT }
let pinch = null // { startDist, startZoom }
let hoverSlot = -1 // card under the mouse
let stopHand = null
// one cursor per hand, each with its own hold-to-open countdown
const newCursor = () => ({
  ptr: null, // { id, x, y, swiping } 0–1 across the stage, from that hand's index fingertip
  slot: -1, // card under it
  key: null, // card slot, or a [data-dwell] button in the viewer
  start: 0,
  done: false,
  count: 0,
  ax: 0, // where it was when the countdown (re)started
  ay: 0,
  x: 0, // viewport px
  y: 0,
})
const cursors = [newCursor(), newCursor()]
let alive = true
const raycaster = new THREE.Raycaster()
const ndc = new THREE.Vector2()

const mod = (n, m) => ((n % m) + m) % m
const clamp = (v, a, b) => Math.min(b, Math.max(a, v))
const ease = (dt, k) => 1 - Math.exp(-dt * k)

function cssColor(name, fallback) {
  const v = getComputedStyle(stage.value).getPropertyValue(name).trim()
  return v || fallback
}

function sizeFor(ratio) {
  let w = CARD_H * ratio
  let h = CARD_H
  if (w > CARD_MAX_W) {
    h *= CARD_MAX_W / w
    w = CARD_MAX_W
  }
  return [w, h]
}

// cards stand on the floor (y = 0), so mixed heights line up at the bottom
function fitSlot(slot, ratio) {
  const [w, h] = sizeFor(ratio)
  for (const m of [slot.artF, slot.artB, slot.hazeF, slot.hazeB, slot.edges]) {
    m.scale.set(w, h, 1)
    m.position.y = h / 2
  }
  slot.shadow.scale.set(w * 1.2, 0.55, 1)
}

/** Small canvas texture: frosted haze, thick at the top and clearing downwards. */
function makeHazeTexture() {
  const c = document.createElement('canvas')
  c.width = 4
  c.height = 128
  const ctx = c.getContext('2d')
  const g = ctx.createLinearGradient(0, 0, 0, 128)
  g.addColorStop(0, 'rgba(255,255,255,0.95)')
  g.addColorStop(0.55, 'rgba(255,255,255,0.6)')
  g.addColorStop(1, 'rgba(255,255,255,0.12)')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, 4, 128)
  return new THREE.CanvasTexture(c)
}

/** Soft oval contact shadow under each card. */
function makeShadowTexture() {
  const c = document.createElement('canvas')
  c.width = c.height = 64
  const ctx = c.getContext('2d')
  const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32)
  g.addColorStop(0, 'rgba(0,0,0,0.55)')
  g.addColorStop(1, 'rgba(0,0,0,0)')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, 64, 64)
  return new THREE.CanvasTexture(c)
}

function buildScene() {
  const n = props.items.length
  const count = n * Math.max(1, Math.ceil(MIN_CARDS / n))
  step = (Math.PI * 2) / count

  scene = new THREE.Scene()
  camera = new THREE.PerspectiveCamera(FOV, 1, 0.1, 100)
  ring = new THREE.Group()
  scene.add(ring)

  const planeGeo = new THREE.PlaneGeometry(1, 1)
  const edgeGeo = new THREE.EdgesGeometry(planeGeo)
  hazeTex = makeHazeTexture()
  shadowTex = makeShadowTexture()
  const hazeColor = cssColor('--color-bg', '#fcfbfa')
  const edgeColor = cssColor('--color-ink', '#1a1517')

  const basic = (opts) => new THREE.MeshBasicMaterial({ transparent: true, depthWrite: false, ...opts })

  slots = Array.from({ length: count }, (_, i) => {
    const item = i % n
    const a = i * step
    // radial card: its width runs outwards from the centre, its face looks along the ring
    const holder = new THREE.Group()
    holder.position.set(Math.sin(a) * RADIUS, 0, Math.cos(a) * RADIUS)
    holder.rotation.y = a - Math.PI / 2
    const card = new THREE.Group()
    holder.add(card)
    ring.add(holder)

    // flat colour until (and unless) the photo arrives
    const artMat = basic({ color: props.items[item].color || '#cccccc' })
    const hazeMat = basic({ color: hazeColor, map: hazeTex })
    const edgeMat = new THREE.LineBasicMaterial({ color: edgeColor, transparent: true, depthWrite: false })
    const shadowMat = basic({ color: '#000000', map: shadowTex })

    // front + back as two single-sided planes, so neither side shows the image mirrored
    const artF = new THREE.Mesh(planeGeo, artMat)
    const artB = new THREE.Mesh(planeGeo, artMat)
    artB.rotation.y = Math.PI
    const hazeF = new THREE.Mesh(planeGeo, hazeMat)
    hazeF.position.z = 0.004
    const hazeB = new THREE.Mesh(planeGeo, hazeMat)
    hazeB.rotation.y = Math.PI
    hazeB.position.z = -0.004
    const edges = new THREE.LineSegments(edgeGeo, edgeMat)
    const shadow = new THREE.Mesh(planeGeo, shadowMat)
    shadow.rotation.x = -Math.PI / 2
    shadow.position.y = 0.002
    artF.userData.slot = artB.userData.slot = i

    card.add(shadow, artF, artB, hazeF, hazeB, edges)
    const slot = { item, card, artF, artB, hazeF, hazeB, edges, shadow, pop: 0 }
    slot.mats = { art: artMat, haze: hazeMat, edge: edgeMat, shadow: shadowMat }
    fitSlot(slot, props.items[item].ratio || 1)
    return slot
  })

  const loader = new THREE.TextureLoader()
  textures = props.items.map(() => null)
  props.items.forEach((it, idx) => {
    if (!it.image) return
    loader.load(it.image, (tex) => {
      if (!renderer) return tex.dispose() // unmounted mid-load
      tex.colorSpace = THREE.SRGBColorSpace
      tex.anisotropy = renderer.capabilities.getMaxAnisotropy()
      textures[idx] = tex
      slots.forEach((s) => {
        if (s.item !== idx) return
        s.mats.art.map = tex
        s.mats.art.color.set('#ffffff')
        s.mats.art.needsUpdate = true
        fitSlot(s, tex.image.width / tex.image.height)
      })
    })
  })
}

function resize() {
  const el = stage.value
  if (!el || !renderer) return
  const w = el.clientWidth
  const h = el.clientHeight
  renderer.setSize(w, h, false)
  camera.aspect = w / h
  // phones: the chips + caption bar fill the bottom of the stage, so centre
  // the ring in the space above them instead of in the whole stage
  const top = el.querySelector('.gal__top')
  if (window.matchMedia('(max-width: 760px)').matches && top) {
    camera.setViewOffset(w, h, 0, (h - top.offsetTop) / 2, w, h)
  } else {
    camera.clearViewOffset()
  }
  camera.updateProjectionMatrix()
  // fit the whole ring across the width; on narrow screens let its ends run off
  const halfTan = Math.tan(THREE.MathUtils.degToRad(FOV / 2))
  const fitH = (CARD_H * 2.4) / (2 * halfTan)
  const fitW = (RADIUS + CARD_MAX_W / 2 + 0.2) / (halfTan * camera.aspect)
  camDist = clamp(fitW, fitH, fitH * 1.8)
}

function tick(t) {
  raf = requestAnimationFrame(tick)
  const dt = Math.min(0.05, (t - lastT) / 1000 || 0)
  lastT = t

  const idle = !drag && !pinch && hoverSlot < 0 && !cursors.some((c) => c.ptr) && !viewer.value
  if (idle && !reduceMotion && t - lastInteract > IDLE_MS) target += dt * DRIFT
  if (!drag) rot += (target - rot) * ease(dt, reduceMotion ? 20 : 6)
  ring.rotation.y = rot * step

  // ratchet tick as cards pass the front — only while someone is spinning it
  const s0 = Math.round(rot)
  if (s0 !== lastSlot) {
    lastSlot = s0
    if (t - lastInteract < 1200) feedback.tick()
  }

  // camera: a little above the ring, looking down at its centre; pinch multiplies
  const d = camDist * zoom
  camera.position.z += (Math.cos(TILT) * d - camera.position.z) * ease(dt, 6)
  camera.position.y = Math.sin(TILT) * camera.position.z
  camera.lookAt(0, CARD_H * 0.3, 0)

  updateDwell(t)

  const time = t / 1000
  const aimed = new Set([hoverSlot, ...cursors.map((c) => c.slot)])
  slots.forEach((s, i) => {
    const facing = Math.cos(i * step + rot * step) // 1 = nearest the camera, -1 = far side
    const near = (facing + 1) / 2
    const want = aimed.has(i) ? 1 : 0
    s.pop += (want - s.pop) * ease(dt, 10)

    const o = 0.45 + 0.55 * Math.pow(near, 1.2)
    s.mats.art.opacity = o
    s.mats.haze.opacity = (0.85 - 0.35 * near) * (1 - s.pop)
    s.mats.edge.opacity = 0.18 * o
    s.mats.shadow.opacity = 0.5 * o * (1 - s.pop * 0.4)

    s.card.position.x = s.pop * POP
    s.card.position.y = (reduceMotion ? 0 : Math.sin(time * 0.7 + i * 1.3) * 0.03) + s.pop * 0.08
    s.card.scale.setScalar(1 + s.pop * 0.06)
  })

  renderer.render(scene, camera)
}

function start() {
  if (raf || !renderer) return
  lastT = performance.now()
  raf = requestAnimationFrame(tick)
}
function stop() {
  cancelAnimationFrame(raf)
  raf = 0
}
function onVisibility() {
  document.hidden || !visible ? stop() : start()
}

// ---- navigation ----------------------------------------------------------

function touch() {
  lastInteract = performance.now()
}

/** Next / previous artwork: the caption steps, and the ring turns one card with it. */
function go(delta) {
  touch()
  active.value = mod(active.value + delta, props.items.length)
  target = Math.round(target) + delta
}

function openPiece(item) {
  touch()
  active.value = item
  viewer.value = true
}

function closeViewer() {
  viewer.value = false
}

function hitIndex(e) {
  const r = canvas.value.getBoundingClientRect()
  return hitAt((e.clientX - r.left) / r.width, (e.clientY - r.top) / r.height)
}

/** Card slot under a point given as 0–1 across / down the stage, or -1. */
function hitAt(x, y) {
  ndc.set(x * 2 - 1, -(y * 2 - 1))
  raycaster.setFromCamera(ndc, camera)
  const hits = raycaster.intersectObjects(slots.flatMap((s) => [s.artF, s.artB]))
  return hits.length ? hits[0].object.userData.slot : -1
}

function setHover(i) {
  if (i === hoverSlot) return
  hoverSlot = i
  if (i >= 0) active.value = slots[i].item
}

// ---- pointer input -------------------------------------------------------

function onDown(e) {
  touch()
  pointers.set(e.pointerId, { x: e.clientX, y: e.clientY })
  canvas.value.setPointerCapture(e.pointerId)
  if (pointers.size === 2) {
    const [a, b] = [...pointers.values()]
    pinch = { startDist: Math.hypot(a.x - b.x, a.y - b.y), startZoom: zoom }
    drag = null
    return
  }
  const now = performance.now()
  drag = { x: e.clientX, y: e.clientY, t: now, moved: 0, vel: 0, lastX: e.clientX, lastT: now }
}

function onMove(e) {
  if (!pointers.has(e.pointerId)) {
    if (e.pointerType === 'mouse') {
      setHover(hitIndex(e))
      canvas.value.style.cursor = hoverSlot >= 0 ? 'pointer' : 'grab'
    }
    return
  }
  touch()
  pointers.set(e.pointerId, { x: e.clientX, y: e.clientY })

  if (pinch && pointers.size === 2) {
    const [a, b] = [...pointers.values()]
    const d = Math.hypot(a.x - b.x, a.y - b.y)
    zoom = clamp(pinch.startZoom * (pinch.startDist / d), 0.6, 1.4)
    return
  }
  if (!drag) return

  const now = performance.now()
  const dx = e.clientX - drag.lastX
  // one full stage width ≈ 8 cards
  const di = (dx / stage.value.clientWidth) * 8
  rot += di
  target = rot
  const dtm = Math.max(1, now - drag.lastT)
  drag.vel = drag.vel * 0.6 + (di / dtm) * 0.4
  drag.moved = Math.max(drag.moved, Math.hypot(e.clientX - drag.x, e.clientY - drag.y))
  drag.lastX = e.clientX
  drag.lastT = now
  if (drag.moved > TAP_SLOP) {
    setHover(-1)
    canvas.value.style.cursor = 'grabbing'
  }
}

function onUp(e) {
  pointers.delete(e.pointerId)
  if (pinch) {
    if (pointers.size < 2) pinch = null
    return
  }
  if (!drag) return

  const isTap = drag.moved <= TAP_SLOP && performance.now() - drag.t < 450
  if (isTap) {
    const i = hitIndex(e)
    if (i >= 0) openPiece(slots[i].item)
  } else {
    // fling: carry the release velocity on, then ease out
    const idle = performance.now() - drag.lastT > 90
    target = rot + (idle ? 0 : clamp(drag.vel * 300, -10, 10))
  }
  drag = null
  if (e.pointerType === 'mouse') canvas.value.style.cursor = 'grab'
}

// the browser took the pointer (e.g. the page started scrolling) — never a tap
function onCancel(e) {
  pointers.delete(e.pointerId)
  if (pointers.size < 2) pinch = null
  drag = null
}

function onLeave(e) {
  if (e.pointerType === 'mouse' && !pointers.size) setHover(-1)
}

function onWheel(e) {
  if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return // vertical = page scroll
  e.preventDefault()
  touch()
  target -= e.deltaX / 60
}

function onKey(e) {
  feedback.unlock()
  if (viewer.value) return // the viewer has its own keys
  if (e.key === 'ArrowRight') go(1)
  else if (e.key === 'ArrowLeft') go(-1)
  else if (e.key === 'Enter' || e.key === ' ') openPiece(active.value)
  else return
  e.preventDefault()
}

// ---- hand control --------------------------------------------------------

async function toggleHand() {
  feedback.unlock()
  handNoteOpen.value = false
  if (stopHand) {
    stopHand()
    stopHand = null
    hand.value = 'off'
    return
  }
  if (hand.value === 'loading') return
  hand.value = 'loading'
  try {
    const stop = await startHandControl({
      video: camVideo.value,
      onPointers: assignPointers,
      // hand moves right = content follows right, like dragging
      onSwipe: (dir) => go(dir),
      // pinch only closes — opening is left to the deliberate 3s hold
      onPinch: () => viewer.value && closeViewer(),
      // hands apart = closer in
      onZoom: (f) => {
        if (!viewer.value) zoom = clamp(zoom / f, 0.6, 1.4)
      },
      onFrame: drawHands,
    })
    if (!alive) return stop() // left the page while the camera was starting
    stopHand = stop
    hand.value = 'on'
  } catch (err) {
    hand.value = 'error'
    handError.value =
      err?.name === 'NotAllowedError'
        ? 'Camera access was blocked. Allow it to use hand control'
        : 'Hand control isn’t available on this device'
  }
}

/** Keep each hand on the same cursor from frame to frame. */
function assignPointers(ptrs) {
  for (const c of cursors) {
    const p = c.ptr && ptrs.find((q) => q.id === c.ptr.id)
    c.ptr = p ?? null
  }
  for (const p of ptrs) {
    if (cursors.some((c) => c.ptr?.id === p.id)) continue
    const free = cursors.find((c) => !c.ptr)
    if (free) free.ptr = p
  }
}

/**
 * Hover-to-open: rest a hand cursor on a card for DWELL_MS — it counts
 * 1, 2, 3 — then the piece opens full screen. Inside the viewer the same
 * countdown presses the close / prev / next buttons ([data-dwell]).
 * Each hand runs its own countdown.
 */
function updateDwell(now) {
  cursors.forEach((c, i) => {
    c.slot = -1
    let aim = null
    const p = c.ptr
    if (p) {
      touch()
      placeCursor(c)
      if (viewer.value) {
        aim = document.elementFromPoint(c.x, c.y)?.closest('[data-dwell]') ?? null
      } else {
        c.slot = hitAt(p.x, p.y)
        if (c.slot >= 0) {
          aim = c.slot
          active.value = slots[c.slot].item
        }
      }
      if (p.swiping) aim = null // a flick resets the countdown
    }
    // a new target, or a hand that's still wandering, starts the countdown over
    const wandered = p && Math.hypot(p.x - c.ax, p.y - c.ay) > DWELL_STEADY
    if (aim !== c.key || (wandered && !c.done)) {
      c.key = aim
      c.start = now
      c.done = false
      c.count = 0
      if (p) [c.ax, c.ay] = [p.x, p.y]
    }

    let progress = 0
    let count = 0
    if (aim != null && !c.done) {
      const elapsed = now - c.start - DWELL_GRACE
      progress = clamp(elapsed / DWELL_MS, 0, 1)
      count = elapsed < 0 ? 0 : Math.min(DWELL_STEPS, Math.floor(elapsed / (DWELL_MS / DWELL_STEPS)) + 1)
      if (count !== c.count) {
        c.count = count
        if (count) feedback.count(count)
      }
      if (progress >= 1) {
        c.done = true // don't fire again until the cursor leaves and comes back
        count = 0
        progress = 0
        if (typeof aim === 'number') openPiece(slots[aim].item)
        else aim.click()
      }
    }
    drawCursor(cursorEls[i], c, progress, count)
  })
}

// the stage maps to the camera frame; once the viewer is open, the whole screen does
function placeCursor(c) {
  if (viewer.value) {
    c.x = c.ptr.x * window.innerWidth
    c.y = c.ptr.y * window.innerHeight
  } else {
    const r = stage.value.getBoundingClientRect()
    c.x = r.left + c.ptr.x * r.width
    c.y = r.top + c.ptr.y * r.height
  }
}

function drawCursor(el, c, progress, count) {
  if (!el) return
  if (!c.ptr) {
    el.style.opacity = '0'
    return
  }
  el.style.opacity = '1'
  el.style.transform = `translate(${c.x}px, ${c.y}px)`
  el.classList.toggle('is-aiming', count > 0)
  el.querySelector('.gal__cursor-ring').style.strokeDashoffset = String(RING_C * (1 - progress))
  const num = el.querySelector('.gal__cursor-num')
  const label = count ? String(count) : ''
  if (num.textContent !== label) num.textContent = label
}

function onViewerKey(e) {
  if (e.key === 'Escape') closeViewer()
  else if (e.key === 'ArrowRight') go(1)
  else if (e.key === 'ArrowLeft') go(-1)
  else return
  e.preventDefault()
}

// landmark dots over the little mirrored camera preview, for every hand in view
function drawHands(hands) {
  const c = camCanvas.value
  if (!c) return
  const ctx = c.getContext('2d')
  const w = (c.width = c.clientWidth * devicePixelRatio)
  const hgt = (c.height = c.clientHeight * devicePixelRatio)
  ctx.clearRect(0, 0, w, hgt)
  for (const h of hands) {
    const dot = h.pinched ? cssColor('--color-accent', '#e01e6e') : cssColor('--color-leaf', '#5fb43a')
    h.landmarks.forEach((p, i) => {
      const big = i === 4 || i === 8
      ctx.beginPath()
      ctx.arc((1 - p.x) * w, p.y * hgt, (big ? 3.5 : 2) * devicePixelRatio, 0, Math.PI * 2)
      ctx.fillStyle = big ? dot : 'rgba(255,255,255,0.85)'
      ctx.fill()
    })
  }
}

// ---- lifecycle -----------------------------------------------------------

watch(viewer, async (open) => {
  feedback.focus(open)
  document.documentElement.style.overflow = open ? 'hidden' : ''
  if (open) {
    window.addEventListener('keydown', onViewerKey)
    await nextTick()
    viewerClose.value?.focus({ preventScroll: true })
  } else {
    window.removeEventListener('keydown', onViewerKey)
    stage.value?.focus({ preventScroll: true })
  }
})

// sync, so the materials are recoloured before the theme-switch view
// transition snapshots the page (otherwise the canvas reveals a frame late)
watch(theme, () => {
  if (!renderer) return
  const haze = cssColor('--color-bg', '#fcfbfa')
  const edge = cssColor('--color-ink', '#1a1517')
  slots.forEach((s) => {
    s.mats.haze.color.set(haze)
    s.mats.edge.color.set(edge)
  })
}, { flush: 'sync' })

onMounted(() => {
  try {
    renderer = new THREE.WebGLRenderer({ canvas: canvas.value, antialias: true, alpha: true })
  } catch {
    webglFailed.value = true
    return
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.outputColorSpace = THREE.SRGBColorSpace

  buildScene()
  resize()
  camera.position.set(0, Math.sin(TILT) * camDist, Math.cos(TILT) * camDist)

  ro = new ResizeObserver(resize)
  ro.observe(stage.value)
  io = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting
    onVisibility()
  })
  io.observe(stage.value)
  document.addEventListener('visibilitychange', onVisibility)
  canvas.value.addEventListener('wheel', onWheel, { passive: false })
})

onBeforeUnmount(() => {
  alive = false
  stopHand?.()
  window.removeEventListener('keydown', onViewerKey)
  document.documentElement.style.overflow = ''
  feedback.dispose()
  stop()
  ro?.disconnect()
  io?.disconnect()
  document.removeEventListener('visibilitychange', onVisibility)
  canvas.value?.removeEventListener('wheel', onWheel)
  if (!renderer) return
  const geos = new Set()
  slots.forEach((s) => {
    geos.add(s.artF.geometry).add(s.edges.geometry)
    Object.values(s.mats).forEach((m) => m.dispose())
  })
  geos.forEach((g) => g.dispose())
  textures.forEach((t) => t?.dispose())
  hazeTex?.dispose()
  shadowTex?.dispose()
  renderer.dispose()
  renderer = null
})
</script>

<template>
  <div class="gal">
    <div
      v-if="!webglFailed"
      ref="stage"
      class="gal__stage"
      tabindex="0"
      role="region"
      aria-roledescription="3D gallery"
      :aria-label="`Artwork gallery: ${current.title}, ${counter}. Use arrow keys to browse, Enter to open.`"
      @keydown="onKey"
      @pointerdown.capture="feedback.unlock"
    >
      <canvas
        ref="canvas"
        class="gal__canvas"
        @pointerdown="onDown"
        @pointermove="onMove"
        @pointerup="onUp"
        @pointercancel="onCancel"
        @pointerleave="onLeave"
      />

      <Teleport to="body">
        <Transition name="gal-view">
          <div
            v-if="viewer"
            class="gal-view"
            role="dialog"
            aria-modal="true"
            :aria-label="current.title"
            @click.self="closeViewer"
          >
            <button
              ref="viewerClose"
              data-dwell
              class="gal__btn gal-view__close"
              type="button"
              aria-label="Close"
              @click="closeViewer"
            >
              ✕
            </button>
            <button
              data-dwell
              class="gal__btn gal-view__nav gal-view__nav--prev"
              type="button"
              aria-label="Previous artwork"
              @click="go(-1)"
            >
              ←
            </button>

            <figure class="gal-view__fig" @click.self="closeViewer">
              <Transition name="gal-view-img" mode="out-in">
                <img
                  v-if="current.image"
                  :key="active"
                  class="gal-view__img"
                  :src="current.image"
                  :alt="current.title"
                />
                <div
                  v-else
                  :key="`c${active}`"
                  class="gal-view__img gal-view__swatch"
                  :style="{ background: current.color, aspectRatio: current.ratio || 1 }"
                />
              </Transition>
              <figcaption class="gal-view__cap">
                <span class="gal__count">{{ counter }}</span>
                <span class="gal__title">{{ current.title }}</span>
                <span v-if="current.year || current.medium" class="gal__meta">
                  {{ [current.year, current.medium].filter(Boolean).join(' · ') }}
                </span>
                <span v-if="hand === 'on'" class="gal-view__hint">
                  Flick to browse · pinch or hold ✕ to close
                </span>
              </figcaption>
            </figure>

            <button
              data-dwell
              class="gal__btn gal-view__nav gal-view__nav--next"
              type="button"
              aria-label="Next artwork"
              @click="go(1)"
            >
              →
            </button>
          </div>
        </Transition>

        <!-- hand cursors, one per hand: count 1 · 2 · 3 while resting on a piece, then open it -->
        <div
          v-for="n in cursors.length"
          :key="n"
          :ref="(el) => (cursorEls[n - 1] = el)"
          class="gal__cursor"
          aria-hidden="true"
        >
          <svg viewBox="0 0 44 44" width="60" height="60">
            <circle class="gal__cursor-track" cx="22" cy="22" r="18" />
            <circle
              class="gal__cursor-ring"
              cx="22"
              cy="22"
              r="18"
              :stroke-dasharray="RING_C"
              :stroke-dashoffset="RING_C"
            />
            <circle class="gal__cursor-dot" cx="22" cy="22" r="4" />
          </svg>
          <span class="gal__cursor-num" />
        </div>
      </Teleport>

      <div class="gal__top">
        <div v-if="handSupported" class="gal__hand">
          <button
            class="gal__chip"
            :class="{ 'is-on': hand === 'on' }"
            type="button"
            :aria-pressed="hand === 'on'"
            aria-describedby="gal-hand-note"
            @click="toggleHand"
          >
            <template v-if="hand === 'on'">Turn off the gesture control</template>
            <template v-else-if="hand === 'loading'">Starting…</template>
            <template v-else>
              <span class="gal__chip-long">Click here to activate the gesture control</span>
              <span class="gal__chip-short">Try gesture control</span>
            </template>
          </button>
          <button
            v-if="hand === 'off'"
            ref="handInfo"
            class="gal__chip gal__chip--icon gal__info"
            type="button"
            aria-label="How does gesture control work?"
            :aria-expanded="handNoteOpen"
            aria-controls="gal-hand-note"
            @click="handNoteOpen = !handNoteOpen"
          >
            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
              <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="2" />
              <path d="M12 11v6" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
              <circle cx="12" cy="7.5" r="1.25" fill="currentColor" />
            </svg>
          </button>
          <!-- only shown while the chip is hovered or focused (or the info button
               is tapped open), so it never sits over the gallery -->
          <p
            v-if="hand === 'off'"
            id="gal-hand-note"
            class="gal__hand-note"
            :class="{ 'is-open': handNoteOpen }"
            role="tooltip"
          >
            ✋ Control the gallery with your hand: turn this on, allow your webcam, then hold a
            hand up in front of the camera. Move your finger to steer, flick sideways to spin,
            and hold still on a piece for 3 seconds to open it. The video stays on your device.
          </p>
        </div>
        <span v-else />

        <button
          class="gal__chip gal__chip--icon"
          type="button"
          :aria-label="feedback.muted.value ? 'Turn sound on' : 'Turn sound off'"
          :aria-pressed="!feedback.muted.value"
          @click="feedback.toggleMute"
        >
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
            <path d="M4 9v6h4l5 4V5L8 9H4z" fill="currentColor" />
            <template v-if="!feedback.muted.value">
              <path d="M16 8.5a5 5 0 0 1 0 7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
              <path d="M18.5 6a8.5 8.5 0 0 1 0 12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
            </template>
            <path v-else d="M16 9l5 6m0-6l-5 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
          </svg>
        </button>
      </div>

      <p
        class="gal__hint"
        :class="{ 'is-error': hand === 'error', 'is-hidden': hand === 'off' }"
        aria-live="polite"
      >
        {{ hint }}
      </p>

      <div v-show="hand === 'on' || hand === 'loading'" class="gal__cam" aria-hidden="true">
        <video ref="camVideo" muted playsinline />
        <canvas ref="camCanvas" />
      </div>

      <div class="gal__bar">
        <button class="gal__btn" type="button" aria-label="Previous artwork" @click="go(-1)">
          ←
        </button>
        <div class="gal__info" aria-live="polite">
          <span class="gal__count">{{ counter }}</span>
          <span class="gal__title">{{ current.title }}</span>
          <span v-if="current.year || current.medium" class="gal__meta">
            {{ [current.year, current.medium].filter(Boolean).join(' · ') }}
          </span>
        </div>
        <button class="gal__btn" type="button" aria-label="Next artwork" @click="go(1)">→</button>
      </div>
    </div>

    <!-- no WebGL: a plain grid so the work is still viewable -->
    <ul v-else class="gal__fallback">
      <li v-for="(item, i) in items" :key="i">
        <img v-if="item.image" :src="item.image" :alt="item.title" loading="lazy" />
        <div
          v-else
          class="gal__swatch"
          :style="{ background: item.color, aspectRatio: item.ratio || 1 }"
        />
        <p class="gal__title">{{ item.title }}</p>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.gal__stage {
  position: relative;
  height: clamp(32.5rem, min(88svh, 100svh - var(--nav-h) - 2rem), 61.25rem); /* fits under the navbar */
  border-radius: var(--radius-l);
  overflow: hidden;
  background:
    radial-gradient(ellipse 60% 50% at 50% 55%, color-mix(in srgb, var(--glow-soft) 30%, transparent), transparent 70%),
    var(--color-bg);
  outline-offset: 4px;
}

.gal__canvas {
  display: block;
  width: 100%;
  height: 100%;
  cursor: grab;
  /* keep vertical page scroll on touch; horizontal drag + pinch go to the gallery */
  touch-action: pan-y;
  user-select: none;
  -webkit-user-select: none;
}

.gal__top {
  position: absolute;
  inset: 0 0 auto;
  display: flex;
  justify-content: space-between;
  padding: 1rem clamp(1rem, 3vw, 1.5rem);
  pointer-events: none;
}
/* on phones the playground note's arrow drops onto the top of the stage —
   move the chips down above the bar so the arrow lands on the ring, not a button */
@media (max-width: 760px) {
  /* the narrow ring only fills a strip, so a full-height stage left a big empty band above it */
  .gal__stage {
    height: 25rem;
  }
  .gal__top {
    inset: auto 0 7.5rem;
    padding-block: 0;
  }
}

.gal__chip {
  pointer-events: auto;
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  height: 2.25rem;
  padding: 0 0.9rem;
  border: 1px solid var(--color-border-strong);
  border-radius: 62.4375rem;
  background: var(--color-surface);
  color: var(--color-ink);
  font: inherit;
  font-size: var(--step--1);
  font-weight: 600;
  cursor: pointer;
  transition:
    background 0.2s,
    color 0.2s,
    border-color 0.2s;
}
.gal__chip:hover {
  border-color: var(--color-accent);
}
.gal__chip-short {
  display: none;
}
/* phones: the full label wraps out of the pill */
@media (max-width: 760px) {
  .gal__chip {
    white-space: nowrap;
  }
  .gal__chip-long {
    display: none;
  }
  .gal__chip-short {
    display: inline;
  }
}
.gal__chip.is-on {
  background: var(--color-accent);
  border-color: var(--color-accent);
  color: var(--color-accent-ink);
}
.gal__hand {
  position: relative;
  display: flex;
  gap: 0.4rem;
}
/* the info button is for touch screens only: a mouse can just hover the chip */
.gal__info {
  display: none;
}
@media (hover: none) {
  .gal__info {
    display: inline-flex;
  }
}
.gal__info[aria-expanded='true'] {
  border-color: var(--color-accent);
  color: var(--color-accent);
}
.gal__hand-note {
  position: absolute;
  top: calc(100% + 0.5rem);
  left: 0;
  z-index: 1;
  width: max-content;
  max-width: 34ch;
  margin: 0;
  padding: 0.6rem 0.8rem;
  border-radius: var(--radius);
  background: var(--color-surface);
  border: 1px solid var(--color-border-strong);
  color: var(--color-ink-soft);
  opacity: 0;
  visibility: hidden;
  transform: translateY(-4px);
  transition:
    opacity 0.15s,
    transform 0.15s,
    visibility 0.15s;
  font-size: var(--step--1);
  line-height: 1.4;
  pointer-events: none;
}
.gal__chip:hover ~ .gal__hand-note,
.gal__chip:focus-visible ~ .gal__hand-note,
.gal__hand-note.is-open {
  opacity: 1;
  visibility: visible;
  transform: none;
}
/* on phones the chip sits near the bottom of the stage, so open the note upwards */
@media (max-width: 760px) {
  .gal__hand-note {
    top: auto;
    bottom: calc(100% + 0.5rem);
    transform: translateY(4px);
  }
}
.gal__chip--icon {
  width: 2.25rem;
  padding: 0;
  justify-content: center;
}

.gal__cam {
  position: absolute;
  top: 6.25rem;
  left: clamp(1rem, 3vw, 1.5rem);
  width: clamp(7rem, 16vw, 10.5rem);
  aspect-ratio: 4 / 3;
  border-radius: var(--radius);
  overflow: hidden;
  border: 1px solid var(--color-border-strong);
  background: var(--color-surface);
  pointer-events: none;
}
.gal__cam video,
.gal__cam canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.gal__cam video {
  transform: scaleX(-1); /* selfie view — matches the mirrored gestures */
  opacity: 0.75;
}

.gal__cursor {
  position: fixed;
  top: -1.875rem;
  left: -1.875rem;
  z-index: calc(var(--z-overlay) + 1);
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s;
  will-change: transform;
}
.gal__cursor svg {
  display: block;
  overflow: visible;
  transform: rotate(-90deg); /* progress starts at 12 o'clock */
}
.gal__cursor-track {
  fill: color-mix(in srgb, var(--color-surface) 55%, transparent);
  stroke: var(--color-surface);
  stroke-width: 3;
  opacity: 0.9;
}
.gal__cursor-ring {
  fill: none;
  stroke: var(--color-accent);
  stroke-width: 4;
  stroke-linecap: round;
}
.gal__cursor-dot {
  fill: var(--color-ink);
}
.gal__cursor.is-aiming .gal__cursor-dot {
  opacity: 0;
}
.gal__cursor-num {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  font-size: 1.35rem;
  font-weight: 800;
  font-variant-numeric: tabular-nums;
  color: var(--color-accent);
}

/* ---- full-screen viewer ---- */
.gal-view {
  position: fixed;
  inset: 0;
  z-index: var(--z-overlay);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: clamp(1rem, 3vw, 2rem) clamp(4rem, 8vw, 6rem);
  background: color-mix(in srgb, var(--color-bg) 94%, transparent);
  backdrop-filter: blur(0.875rem);
  -webkit-backdrop-filter: blur(0.875rem);
}

.gal-view__fig {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  width: 100%;
  height: 100%;
  justify-content: center;
  margin: 0;
}

.gal-view__img {
  display: block;
  max-width: 100%;
  max-height: calc(100dvh - 10rem);
  min-height: 0;
  object-fit: contain;
  border-radius: 4px;
  box-shadow: 0 1.5rem 3.75rem -1.25rem rgba(0, 0, 0, 0.45);
}
.gal-view__swatch {
  height: calc(100dvh - 10rem);
}

.gal-view__cap {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.gal-view__hint {
  margin-top: 0.4rem;
  font-size: var(--step--1);
  color: var(--color-ink-faint);
}

.gal-view__close {
  position: absolute;
  top: clamp(1rem, 3vw, 1.5rem);
  right: clamp(1rem, 3vw, 1.5rem);
}

.gal-view__nav {
  position: absolute;
  top: 50%;
  translate: 0 -50%;
}
.gal-view__nav--prev {
  left: clamp(0.75rem, 2vw, 1.5rem);
}
.gal-view__nav--next {
  right: clamp(0.75rem, 2vw, 1.5rem);
}

.gal-view-enter-active,
.gal-view-leave-active {
  transition: opacity 0.3s var(--ease-out, ease);
}
.gal-view-enter-active .gal-view__img,
.gal-view-leave-active .gal-view__img {
  transition: transform 0.4s var(--ease-out, ease);
}
.gal-view-enter-from,
.gal-view-leave-to {
  opacity: 0;
}
.gal-view-enter-from .gal-view__img,
.gal-view-leave-to .gal-view__img {
  transform: scale(0.92);
}

.gal-view-img-enter-active,
.gal-view-img-leave-active {
  transition:
    opacity 0.2s,
    transform 0.2s;
}
.gal-view-img-enter-from {
  opacity: 0;
  transform: scale(0.97);
}
.gal-view-img-leave-to {
  opacity: 0;
}

@media (prefers-reduced-motion: reduce) {
  .gal-view-enter-active .gal-view__img,
  .gal-view-leave-active .gal-view__img {
    transition: none;
  }
}

.gal__hint {
  position: absolute;
  top: 4.25rem;
  left: 50%;
  translate: -50% 0;
  font-size: var(--step--1);
  color: var(--color-ink-soft);
  pointer-events: none;
  transition: opacity 0.3s;
}
.gal__hint.is-hidden {
  opacity: 0;
}
.gal__hint.is-error {
  color: var(--color-accent);
}

.gal__bar {
  position: absolute;
  inset: auto 0 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1rem clamp(1rem, 3vw, 1.5rem);
  pointer-events: none;
}

.gal__info {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  min-width: 0;
}

.gal__count {
  font-size: var(--step--1);
  font-variant-numeric: tabular-nums;
  color: var(--color-ink-faint);
}

.gal__title {
  font-weight: 700;
  color: var(--color-ink);
}

.gal__meta {
  font-size: var(--step--1);
  color: var(--color-ink-soft);
}

.gal__btn {
  pointer-events: auto;
  display: grid;
  place-items: center;
  width: 2.75rem;
  height: 2.75rem;
  flex-shrink: 0;
  border: 1px solid var(--color-border-strong);
  border-radius: 50%;
  background: var(--color-surface);
  color: var(--color-ink);
  font-size: 1.1rem;
  cursor: pointer;
  transition:
    background 0.2s,
    color 0.2s;
}
.gal__btn:hover {
  background: var(--color-accent);
  color: var(--color-accent-ink);
}

.gal__fallback {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(12.5rem, 1fr));
  gap: 1.5rem;
  list-style: none;
  padding: 0;
}
.gal__fallback img,
.gal__swatch {
  width: 100%;
  border-radius: var(--radius);
  margin-bottom: 0.5rem;
}
</style>
