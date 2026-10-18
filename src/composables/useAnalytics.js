/**
 * useAnalytics — Google Analytics 4, gated behind explicit consent (GDPR / ePrivacy).
 *
 * Nothing from Google is loaded, and no cookie is set, until the visitor clicks
 * "Accept" in the cookie banner. The choice is kept in localStorage for 13
 * months (the CNIL's recommended maximum), after which the banner asks again.
 * Withdrawing consent stops tracking immediately and deletes the _ga cookies.
 *
 * The measurement ID comes from VITE_GA_MEASUREMENT_ID (e.g. in .env.local).
 * Without it, analytics and the banner are switched off entirely.
 */
import { ref, nextTick } from 'vue'
import { START_LOCATION } from 'vue-router'

const GA_ID = import.meta.env.VITE_GA_MEASUREMENT_ID
const STORAGE_KEY = 'analytics-consent'
const MAX_AGE = 1000 * 60 * 60 * 24 * 395 // ~13 months

export const analyticsEnabled = Boolean(GA_ID)

// 'granted' | 'denied' | null (not asked yet)
const consent = ref(readConsent())
// lets the footer reopen the banner after a choice was made
const bannerOpen = ref(analyticsEnabled && consent.value === null)

let loaded = false
let router = null

function readConsent() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY))
    if (saved && Date.now() - saved.at < MAX_AGE) return saved.value
  } catch {
    /* storage unavailable or malformed — ask again */
  }
  return null
}

function writeConsent(value) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ value, at: Date.now() }))
  } catch {
    /* storage unavailable — the banner will just ask again next visit */
  }
}

function gtag() {
  window.dataLayer.push(arguments)
}

function loadGa() {
  if (loaded) return
  loaded = true
  window[`ga-disable-${GA_ID}`] = false
  window.dataLayer = window.dataLayer || []
  window.gtag = gtag

  // Consent Mode v2: analytics only, never ads
  gtag('consent', 'default', {
    analytics_storage: 'granted',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
  })
  gtag('js', new Date())
  gtag('config', GA_ID, {
    send_page_view: false, // the SPA sends its own on every route change
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
  })

  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`
  document.head.appendChild(script)

  // accepting mid-visit counts the current page; on startup the router's
  // first afterEach will do it instead
  if (router?.currentRoute.value !== START_LOCATION) trackPage()
}

function trackPage() {
  if (!loaded || consent.value !== 'granted') return
  // wait a tick so views that set document.title have done so
  nextTick(() => {
    gtag('event', 'page_view', {
      page_path: router?.currentRoute.value.fullPath ?? location.pathname,
      page_location: location.href,
      page_title: document.title,
    })
  })
}

function clearGaCookies() {
  const host = location.hostname
  const domains = ['', host, `.${host}`, `.${host.split('.').slice(-2).join('.')}`]
  document.cookie.split(';').forEach((c) => {
    const name = c.split('=')[0].trim()
    if (name === '_ga' || name.startsWith('_ga_') || name === '_gid' || name === '_gat') {
      domains.forEach((d) => {
        document.cookie = `${name}=; Max-Age=0; path=/${d ? `; domain=${d}` : ''}`
      })
    }
  })
}

function setConsent(value) {
  consent.value = value
  writeConsent(value)
  bannerOpen.value = false

  if (value === 'granted') {
    loadGa()
  } else {
    if (loaded) {
      gtag('consent', 'update', { analytics_storage: 'denied' })
      window[`ga-disable-${GA_ID}`] = true
    }
    clearGaCookies()
  }
}

/** Call once at startup with the app router. */
export function initAnalytics(appRouter) {
  if (!analyticsEnabled) return
  router = appRouter
  router.afterEach(() => trackPage())
  if (consent.value === 'granted') loadGa()
}

export function useAnalytics() {
  return {
    consent,
    bannerOpen,
    accept: () => setConsent('granted'),
    decline: () => setConsent('denied'),
    openSettings: () => (bannerOpen.value = true),
  }
}
