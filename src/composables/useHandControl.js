/**
 * Hand control — steer the 3D gallery with one or both hands in front of the webcam.
 *
 * Uses MediaPipe's hand landmarker (loaded lazily, only when the visitor turns
 * hand control on — ~8 MB model + wasm from CDN, then browser-cached).
 *
 * Gestures (tracked per hand; hands are followed by position, so each keeps
 * its own cursor even when MediaPipe mixes up left / right):
 *   move                          →  onPointers([{ id, x, y, swiping }])  one cursor per
 *                                    hand (index fingertip), 0–1 across the stage,
 *                                    mirrored, adaptively smoothed; [] when no hand is in view
 *   sideways flick / sweep        →  onSwipe(dir)   dir = +1 hand moved right, -1 left
 *                                    fires as soon as the flick is recognised, then once more
 *                                    for every SWEEP_STEP the hand keeps travelling the same
 *                                    way — small flick = 1 card, long sweep = several.
 *                                    One hand (the other resting), or both hands the same way
 *   pinch thumb + index together  →  onPinch()
 * Both hands:
 *   spread apart / bring together →  onZoom(factor)  > 1 hands moving apart, < 1 together
 * onFrame(hands) fires every processed frame with [{ landmarks, pinched }] for the preview.
 */
const MP_VERSION = '1.0.1' // keep in sync with @mediapipe/tasks-vision in package.json
const WASM = `https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@${MP_VERSION}/wasm`
const MODEL =
  'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task'

const PINCH_ON = 0.3 // thumb–index gap ÷ palm length
const PINCH_OFF = 0.45
const PINCH_FRAMES = 2 // frames the pinch must hold — one glitchy frame isn't a pinch
const PINCH_COOLDOWN = 700 // ms
const SWIPE_WINDOW = 300 // ms of hand history checked for a flick
const SWIPE_DIST = 0.07 // share of the camera width covered inside that window
const SWIPE_STRAIGHT = 0.7 // vertical travel may be at most this share of the sideways travel
const SWIPE_COOLDOWN = 200 // ms after a sweep ends before another flick the same way
const SWIPE_RETURN_LOCK = 450 // ms after a sweep ends that the opposite way is ignored — the hand coming back isn't a flick
const SWEEP_STEP = 0.1 // further sideways travel (share of camera width) per extra card in one sweep
const SWEEP_REVERSE = 0.025 // turning back this far ends the sweep
const SWEEP_STALL = 150 // ms without progress that ends the sweep
const STILL_DIST = 0.08 // the other hand moved less than this → it's resting, not zooming
const WARMUP = 250 // ms after a hand appears before it can flick — entering the frame isn't a flick
const ZOOM_MIN_STEP = 0.004 // per-frame palm movement both hands need before a zoom counts
const ZOOM_ALIGN = 0.5 // the gap must change by this share of the hands' movement (apart / together, not side by side)
const GESTURE_GAP = 300 // ms a zoom blocks flicks and a flick blocks zoom
const TRACK_MATCH = 0.25 // max palm jump between frames that still counts as the same hand
const LOST_GRACE = 200 // ms a hand the tracker dropped is kept (cursor + history) before it's gone
// the cursor only needs the middle of the camera frame — no reaching for the edges
const REACH_X = [0.18, 0.82]
const REACH_Y = [0.15, 0.75]

let landmarkerPromise = null

function loadLandmarker() {
  landmarkerPromise ??= (async () => {
    const { FilesetResolver, HandLandmarker } = await import('@mediapipe/tasks-vision')
    const files = await FilesetResolver.forVisionTasks(WASM)
    const opts = (delegate) => ({
      baseOptions: { modelAssetPath: MODEL, delegate },
      runningMode: 'VIDEO',
      numHands: 2,
    })
    try {
      return await HandLandmarker.createFromOptions(files, opts('GPU'))
    } catch {
      return await HandLandmarker.createFromOptions(files, opts('CPU'))
    }
  })().catch((err) => {
    landmarkerPromise = null // allow a retry
    throw err
  })
  return landmarkerPromise
}

const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y)
const remap = (v, [a, b]) => Math.min(1, Math.max(0, (v - a) / (b - a)))

/**
 * One Euro filter — heavy smoothing while the hand is still (no jitter),
 * light smoothing while it moves (no lag). minCutoff in Hz, beta per unit/s.
 */
function oneEuro(minCutoff, beta, dCutoff = 1) {
  let x = null
  let dx = 0
  let last = 0
  const alpha = (cutoff, dt) => {
    const r = 2 * Math.PI * cutoff * dt
    return r / (r + 1)
  }
  return (v, now) => {
    if (x === null) {
      x = v
      last = now
      return v
    }
    const dt = Math.max(1e-3, (now - last) / 1000)
    last = now
    dx += alpha(dCutoff, dt) * ((v - x) / dt - dx)
    x += alpha(minCutoff + beta * Math.abs(dx), dt) * (v - x)
    return x
  }
}

function newHand(id, now) {
  return {
    id,
    born: now,
    seen: now,
    prevSeen: 0,
    raw: null, // unfiltered palm — used to match hands between frames
    palm: null, // smoothed palm — used for zoom
    prevPalm: null,
    cursor: null,
    lm: null,
    history: [],
    x: 0, // current flick-tracking x (knuckle / fingertip midpoint)
    sweep: null, // { dir, from, peak, advanced } while a sweep is under way
    lastSwipe: 0,
    pinched: false,
    pinchFrames: 0,
    lastPinch: 0,
    filt: {
      cx: oneEuro(1.2, 4),
      cy: oneEuro(1.2, 4),
      px: oneEuro(2, 3),
      py: oneEuro(2, 3),
    },
  }
}

/**
 * Start the camera + tracking loop. Resolves once the camera is live;
 * rejects if the camera is denied / unavailable or the model fails to load.
 * Returns a `stop()` function.
 */
export async function startHandControl({ video, onPointers, onSwipe, onPinch, onZoom, onFrame }) {
  if (!navigator.mediaDevices?.getUserMedia) throw new Error('unsupported')

  const [stream, landmarker] = await Promise.all([
    navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'user', width: { ideal: 320 }, height: { ideal: 240 } },
      audio: false,
    }),
    loadLandmarker(),
  ])
  video.srcObject = stream
  video.muted = true
  video.playsInline = true
  await video.play()

  let raf = 0
  let lastVideoTime = -1
  let hands = []
  let nextId = 1
  let lastSwipe = 0
  let lastDir = 0
  let lastZoom = 0

  /**
   * Hand travel over the swipe window: sideways travel measured from the
   * furthest point back (a small wind-up doesn't eat into it), plus how far
   * it wandered up / down.
   */
  const travel = (h) => {
    if (h.history.length < 2) return { dx: 0, dy: 0 }
    const last = h.history.at(-1).x
    let lo = last
    let hi = last
    let top = Infinity
    let bottom = -Infinity
    for (const p of h.history) {
      lo = Math.min(lo, p.x)
      hi = Math.max(hi, p.x)
      top = Math.min(top, p.y)
      bottom = Math.max(bottom, p.y)
    }
    return { dx: last - lo > hi - last ? last - lo : last - hi, dy: bottom - top }
  }

  /** +1 / -1 when this hand just made a clean sideways flick, else 0. */
  const flickDir = (h, now) => {
    if (h.pinched || now - h.born < WARMUP) return 0
    const { dx, dy } = travel(h)
    if (Math.abs(dx) < SWIPE_DIST || dy > SWIPE_STRAIGHT * Math.abs(dx)) return 0
    return Math.sign(dx)
  }

  function update(h, lm, raw, now) {
    h.prevSeen = h.seen
    h.seen = now
    h.lm = lm
    h.raw = raw

    // pinch, normalised by palm length so it works near or far from the camera
    const ratio = dist(lm[4], lm[8]) / Math.max(1e-4, dist(lm[0], lm[9]))
    if (!h.pinched) {
      h.pinchFrames = ratio < PINCH_ON ? h.pinchFrames + 1 : 0
      if (h.pinchFrames >= PINCH_FRAMES) {
        h.pinched = true
        h.pinchFrames = 0
        if (now - h.lastPinch > PINCH_COOLDOWN) {
          h.lastPinch = now
          onPinch()
        }
      }
    } else if (ratio > PINCH_OFF) {
      h.pinched = false
    }

    h.prevPalm = h.palm
    h.palm = { x: h.filt.px(raw.x, now), y: h.filt.py(raw.y, now) }

    // flicks are tracked between the knuckle and the middle fingertip — a wrist
    // flick swings the fingers much further than the palm, so small flicks register
    h.x = 1 - (lm[9].x + lm[12].x) / 2
    h.history.push({ t: now, x: h.x, y: (lm[9].y + lm[12].y) / 2 })
    while (h.history.length && now - h.history[0].t > SWIPE_WINDOW) h.history.shift()

    // cursor: index fingertip, mirrored + stretched, adaptively smoothed
    h.cursor = {
      x: h.filt.cx(remap(1 - lm[8].x, REACH_X), now),
      y: h.filt.cy(remap(lm[8].y, REACH_Y), now),
    }
  }

  function loop() {
    raf = requestAnimationFrame(loop)
    if (video.readyState < 2 || video.currentTime === lastVideoTime) return
    lastVideoTime = video.currentTime

    const now = performance.now()
    const res = landmarker.detectForVideo(video, now)
    const dets = (res.landmarks ?? []).map((lm) => ({ lm, raw: { x: 1 - lm[9].x, y: lm[9].y } }))

    // follow each hand by where it was last frame (closest pairs first)
    const pairs = []
    for (const h of hands) dets.forEach((d, j) => pairs.push({ h, j, d: dist(h.raw, d.raw) }))
    pairs.sort((a, b) => a.d - b.d)
    const usedH = new Set()
    const usedD = new Set()
    for (const { h, j, d } of pairs) {
      if (d > TRACK_MATCH || usedH.has(h) || usedD.has(j)) continue
      usedH.add(h)
      usedD.add(j)
      update(h, dets[j].lm, dets[j].raw, now)
    }
    dets.forEach((d, j) => {
      if (usedD.has(j)) return
      const h = newHand(nextId++, now)
      hands.push(h)
      update(h, d.lm, d.raw, now)
    })
    // a hand the tracker missed for a moment keeps its cursor; after LOST_GRACE it's gone
    hands = hands.filter((h) => now - h.seen < LOST_GRACE).slice(-2)

    const fresh = hands.filter((h) => h.seen === now)

    // a sweep under way: one more card per SWEEP_STEP, until the hand stalls or turns back
    const sweeper = hands.find((h) => h.sweep)
    if (sweeper) {
      const sw = sweeper.sweep
      const progress = (sweeper.x - sw.from) * sw.dir
      if (progress > sw.peak) {
        sw.peak = progress
        sw.advanced = now
      }
      if (progress >= SWEEP_STEP) {
        sw.from += SWEEP_STEP * sw.dir
        sw.peak -= SWEEP_STEP
        sweeper.lastSwipe = now
        onSwipe(sw.dir)
      }
      const gone = sweeper.seen !== now
      if (gone || sweeper.pinched || sw.peak - progress > SWEEP_REVERSE || now - sw.advanced > SWEEP_STALL) {
        sweeper.sweep = null
        sweeper.history = []
        lastSwipe = now // cooldown + return lock count from the end of the sweep
      }
    }

    // flick: one hand while the other rests, or both hands the same way
    if (!sweeper && now - lastZoom > GESTURE_GAP) {
      const flicks = fresh.map((h) => ({ h, dir: flickDir(h, now) })).filter((f) => f.dir)
      let swipers = []
      if (flicks.length === 2 && flicks[0].dir === flicks[1].dir) {
        swipers = flicks
      } else if (flicks.length === 1) {
        const other = fresh.find((o) => o !== flicks[0].h)
        if (!other || Math.abs(travel(other).dx) < STILL_DIST) swipers = flicks
      }
      if (swipers.length) {
        const { h, dir } = swipers[0]
        const wait = dir === lastDir ? SWIPE_COOLDOWN : SWIPE_RETURN_LOCK
        if (now - lastSwipe >= wait) {
          lastSwipe = now
          lastDir = dir
          for (const o of fresh) o.history = []
          h.sweep = { dir, from: h.x, peak: 0, advanced: now }
          for (const f of swipers) f.h.lastSwipe = now
          onSwipe(dir)
        }
      }
    }

    // two-hand zoom: both palms moving, and mostly apart / together (not side by side)
    if (fresh.length === 2 && onZoom && !hands.some((h) => h.sweep) && now - lastSwipe > GESTURE_GAP) {
      const [a, b] = fresh
      const consecutive = (h) => h.prevPalm && now - h.prevSeen < 100
      if (consecutive(a) && consecutive(b)) {
        const stepA = dist(a.palm, a.prevPalm)
        const stepB = dist(b.palm, b.prevPalm)
        const before = dist(a.prevPalm, b.prevPalm)
        const after = dist(a.palm, b.palm)
        if (
          stepA > ZOOM_MIN_STEP &&
          stepB > ZOOM_MIN_STEP &&
          before > 0.05 &&
          Math.abs(after - before) >= ZOOM_ALIGN * (stepA + stepB)
        ) {
          lastZoom = now
          onZoom(after / before)
        }
      }
    }

    onPointers(
      hands.map((h) => ({ id: h.id, ...h.cursor, swiping: !!h.sweep || now - h.lastSwipe < SWIPE_COOLDOWN })),
    )
    onFrame(fresh.map((h) => ({ landmarks: h.lm, pinched: h.pinched })))
  }
  raf = requestAnimationFrame(loop)

  return function stop() {
    cancelAnimationFrame(raf)
    stream.getTracks().forEach((t) => t.stop())
    video.srcObject = null
    onPointers([])
    onFrame([])
  }
}
