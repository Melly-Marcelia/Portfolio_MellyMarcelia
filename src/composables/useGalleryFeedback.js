/**
 * useGalleryFeedback — the "click" you hear and feel when the gallery flips.
 *
 * Sounds are synthesised with Web Audio (no audio files): a short ratchet tick
 * per artwork passed, and a soft glide up / down when zooming in / out.
 * Haptics use navigator.vibrate — Android browsers only; iOS Safari ignores it.
 *
 * Browsers only allow audio after a user gesture, so call `unlock()` from a
 * pointer / key / click handler; until then everything stays silent.
 */
import { ref } from 'vue'

const STORAGE_KEY = 'gallery-sound'

function readMuted() {
  try {
    return localStorage.getItem(STORAGE_KEY) === 'off'
  } catch {
    return false
  }
}

export function useGalleryFeedback() {
  const muted = ref(readMuted())
  let ctx = null
  let master = null
  let noise = null
  let lastTick = 0

  function unlock() {
    if (!ctx) {
      const AC = window.AudioContext || window.webkitAudioContext
      if (!AC) return
      ctx = new AC()
      master = ctx.createGain()
      master.gain.value = 0.6
      master.connect(ctx.destination)
      // 50ms of white noise, reused for every tick's "click" transient
      noise = ctx.createBuffer(1, Math.ceil(ctx.sampleRate * 0.05), ctx.sampleRate)
      const d = noise.getChannelData(0)
      for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1
    }
    if (ctx.state === 'suspended') ctx.resume()
  }

  function canPlay() {
    return ctx && ctx.state === 'running' && !muted.value
  }

  function vibrate(pattern) {
    // Chrome refuses (and warns) before the visitor has interacted with the page
    if (navigator.userActivation && !navigator.userActivation.hasBeenActive) return
    navigator.vibrate?.(pattern)
  }

  /** One notch — fired for every artwork that passes the front. */
  function tick() {
    const now = performance.now()
    if (now - lastTick < 35) return // fast spins: keep it a ratchet, not a buzz
    lastTick = now
    vibrate(8)
    if (!canPlay()) return

    const t = ctx.currentTime
    const pitch = 1 + (Math.random() - 0.5) * 0.08

    // body: tiny wooden "tock"
    const osc = ctx.createOscillator()
    const og = ctx.createGain()
    osc.type = 'triangle'
    osc.frequency.setValueAtTime(1500 * pitch, t)
    osc.frequency.exponentialRampToValueAtTime(700 * pitch, t + 0.05)
    og.gain.setValueAtTime(0.0001, t)
    og.gain.exponentialRampToValueAtTime(0.22, t + 0.003)
    og.gain.exponentialRampToValueAtTime(0.0001, t + 0.07)
    osc.connect(og).connect(master)
    osc.start(t)
    osc.stop(t + 0.08)

    // transient: filtered noise click
    const src = ctx.createBufferSource()
    const hp = ctx.createBiquadFilter()
    const ng = ctx.createGain()
    src.buffer = noise
    hp.type = 'highpass'
    hp.frequency.value = 3500
    ng.gain.setValueAtTime(0.12, t)
    ng.gain.exponentialRampToValueAtTime(0.0001, t + 0.02)
    src.connect(hp).connect(ng).connect(master)
    src.start(t)
  }

  /** Hover countdown beat — n = 1, 2, 3, each a step higher. */
  function count(n) {
    vibrate(n >= 3 ? 18 : 10)
    if (!canPlay()) return

    const t = ctx.currentTime
    const osc = ctx.createOscillator()
    const g = ctx.createGain()
    osc.type = 'sine'
    osc.frequency.value = [660, 784, 988][Math.min(2, n - 1)]
    g.gain.setValueAtTime(0.0001, t)
    g.gain.exponentialRampToValueAtTime(0.16, t + 0.005)
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.14)
    osc.connect(g).connect(master)
    osc.start(t)
    osc.stop(t + 0.15)
  }

  /** Zoom in (true) / out (false). */
  function focus(on) {
    vibrate(on ? [10, 40, 16] : 12)
    if (!canPlay()) return

    const t = ctx.currentTime
    const osc = ctx.createOscillator()
    const g = ctx.createGain()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(on ? 420 : 760, t)
    osc.frequency.exponentialRampToValueAtTime(on ? 760 : 420, t + 0.18)
    g.gain.setValueAtTime(0.0001, t)
    g.gain.exponentialRampToValueAtTime(0.14, t + 0.02)
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.26)
    osc.connect(g).connect(master)
    osc.start(t)
    osc.stop(t + 0.28)
  }

  function toggleMute() {
    muted.value = !muted.value
    try {
      localStorage.setItem(STORAGE_KEY, muted.value ? 'off' : 'on')
    } catch {
      /* storage unavailable — the choice just won't survive a reload */
    }
    if (!muted.value) {
      unlock()
      tick()
    }
  }

  function dispose() {
    ctx?.close()
    ctx = null
  }

  return { muted, unlock, tick, count, focus, toggleMute, dispose }
}
