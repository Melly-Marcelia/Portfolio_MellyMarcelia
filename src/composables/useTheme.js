/**
 * useTheme — light / dark palette switch.
 *
 * The initial value is stamped onto <html data-theme> by the inline script in
 * index.html (before first paint). This module keeps a reactive mirror of it,
 * writes changes back to the element + localStorage, and — while the visitor
 * hasn't made an explicit choice — follows their OS setting live.
 */
import { ref } from 'vue'

const STORAGE_KEY = 'theme'
const root = typeof document !== 'undefined' ? document.documentElement : null

function current() {
  return root?.dataset.theme === 'dark' ? 'dark' : 'light'
}

const theme = ref(current())

const themeColor = typeof document !== 'undefined' ? document.querySelector('meta[name="theme-color"]') : null

function setTheme(next, { persist = true } = {}) {
  // stamp the element first: sync watchers (e.g. the 3D gallery) read the
  // computed tokens as soon as `theme` changes
  if (root) root.dataset.theme = next
  themeColor?.setAttribute('content', next === 'dark' ? '#171315' : '#fcfbfa')
  theme.value = next
  if (persist) {
    try {
      localStorage.setItem(STORAGE_KEY, next)
    } catch {
      /* storage unavailable — the choice just won't survive a reload */
    }
  }
}

// Follow the OS until the visitor picks a side themselves.
if (typeof window !== 'undefined' && window.matchMedia) {
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    let saved = null
    try {
      saved = localStorage.getItem(STORAGE_KEY)
    } catch {
      /* ignore */
    }
    if (saved !== 'light' && saved !== 'dark') {
      setTheme(e.matches ? 'dark' : 'light', { persist: false })
    }
  })
}

/**
 * Flip the palette. Given the click event, the new theme spreads out as a circle
 * from the pointer (View Transitions API); without support / with reduced motion
 * it just swaps.
 */
function toggleTheme(event) {
  const next = theme.value === 'dark' ? 'light' : 'dark'
  const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  if (!document.startViewTransition || reduce) return setTheme(next)

  const rect = event?.currentTarget?.getBoundingClientRect?.()
  const x = rect ? rect.left + rect.width / 2 : window.innerWidth / 2
  const y = rect ? rect.top + rect.height / 2 : 0
  // radius that reaches the farthest corner of the viewport
  const r = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y))

  const vt = document.startViewTransition(() => setTheme(next))
  vt.ready.then(() => {
    document.documentElement.animate(
      { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${r}px at ${x}px ${y}px)`] },
      {
        duration: 700,
        easing: 'cubic-bezier(0.65, 0, 0.35, 1)',
        pseudoElement: '::view-transition-new(root)',
      },
    )
  })
}

export function useTheme() {
  return { theme, toggleTheme }
}
