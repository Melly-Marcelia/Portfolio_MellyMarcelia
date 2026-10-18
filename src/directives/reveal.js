/**
 * v-reveal — scroll-into-view entrance.
 *
 * Elements start slightly lowered + transparent and settle into place the first
 * time they enter the viewport. One shared IntersectionObserver drives them all.
 * After a one-shot reveal the helper classes/vars are stripped, so the element's
 * own transitions (hover, etc.) are left untouched.
 *
 * Usage:
 *   v-reveal                       default rise + fade
 *   v-reveal="2"                   stagger: 2 × --reveal-stagger delay
 *   v-reveal="{ delay: 120, y: 32, once: false }"
 *   v-reveal="{ blur: true }"     also de-blurs as it settles (for big type)
 *   v-reveal="{ words: true }"    the element stays put; its child
 *                                 <span class="reveal-word" style="--w: i">
 *                                 words rise + focus one after another
 *
 * Honours prefers-reduced-motion (elements just appear).
 */
const prefersReducedMotion =
  typeof window !== 'undefined' &&
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

let observer = null
// one-shot elements still waiting to be revealed
const pending = new Set()

function getObserver() {
  if (observer || typeof IntersectionObserver === 'undefined') return observer
  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        const el = entry.target
        if (entry.isIntersecting) {
          el.classList.add('is-revealed')
          if (el.__revealOnce !== false) {
            observer.unobserve(el)
            pending.delete(el)
          }
        } else if (el.__revealOnce === false) {
          el.classList.remove('is-revealed')
        }
      }
    },
    { threshold: 0.01, rootMargin: '0px 0px -12% 0px' },
  )
  window.addEventListener('scroll', revealAtPageEnd, { passive: true })
  return observer
}

// The -12% bottom margin can never be crossed by elements in the last ~12% of
// the page (e.g. the footer links on tall screens), so once the visitor hits
// the bottom, show whatever is on screen and still hidden.
let ticking = false
function revealAtPageEnd() {
  if (ticking || !pending.size) return
  ticking = true
  requestAnimationFrame(() => {
    ticking = false
    const doc = document.documentElement
    if (window.scrollY + window.innerHeight < doc.scrollHeight - 2) return
    for (const el of pending) {
      const r = el.getBoundingClientRect()
      if (r.top < window.innerHeight && r.bottom > 0) {
        el.classList.add('is-revealed')
        observer.unobserve(el)
        pending.delete(el)
      }
    }
  })
}

function cleanup(el) {
  el.classList.remove('reveal', 'reveal--blur', 'reveal--words', 'is-revealed')
  el.style.removeProperty('--reveal-delay')
  el.style.removeProperty('--reveal-shift')
}

export const reveal = {
  mounted(el, binding) {
    const v = binding.value
    const opts = typeof v === 'number' ? { delay: v } : v || {}

    if (prefersReducedMotion) return

    el.classList.add('reveal')
    if (opts.blur) el.classList.add('reveal--blur')
    if (opts.words) el.classList.add('reveal--words')
    el.__revealOnce = opts.once !== false // default: reveal once

    const stagger = Number.isFinite(opts.delay) ? opts.delay : 0
    // 1–39 → treat as a stagger index; 40+ → explicit milliseconds
    if (stagger >= 40) {
      el.style.setProperty('--reveal-delay', `${stagger}ms`)
    } else if (stagger > 0) {
      el.style.setProperty(
        '--reveal-delay',
        `calc(${stagger} * var(--reveal-stagger))`,
      )
    }
    if (Number.isFinite(opts.y)) {
      el.style.setProperty('--reveal-shift', `${opts.y}px`)
    }

    if (el.__revealOnce) {
      // word mode settles when the last word does
      const done = () => {
        if (!opts.words) return el
        const words = el.querySelectorAll('.reveal-word')
        return words[words.length - 1] || el
      }
      el.addEventListener('transitionend', function onEnd(e) {
        if (e.target === done() && e.propertyName === 'transform') {
          el.removeEventListener('transitionend', onEnd)
          if (el.classList.contains('is-revealed')) cleanup(el)
        }
      })
    }

    const io = getObserver()
    if (io) {
      io.observe(el)
      if (el.__revealOnce) pending.add(el)
    } else cleanup(el)
  },
  updated(el) {
    // element reused by Vue (e.g. navigating between two case studies):
    // if it's still hiding but already on screen, just show it
    if (
      el.classList.contains('reveal') &&
      !el.classList.contains('is-revealed')
    ) {
      const r = el.getBoundingClientRect()
      if (r.top < window.innerHeight && r.bottom > 0) el.classList.add('is-revealed')
    }
  },
  unmounted(el) {
    observer?.unobserve(el)
    pending.delete(el)
  },
}

export default {
  install(app) {
    app.directive('reveal', reveal)
  },
}
