/**
 * Shared handles for the scroll-linked brand logo (BrandLogo.vue).
 *
 * The logo is one fixed element that travels between two empty slots:
 *  - `logoAnchor` — the big slot in the homepage hero (set by HeroSection)
 *  - `logoSlot`   — the small slot at the top-left of the navbar (set by TheNavbar)
 */
import { shallowRef } from 'vue'

export const logoAnchor = shallowRef(null)
export const logoSlot = shallowRef(null)
// mobile menu open (set by TheNavbar): the undocked logo drops under it instead of covering it
export const menuOpen = shallowRef(false)

// intrinsic proportions of the active logo file, so both slots keep the drawing undistorted
// logo-blank.png / logo-face.png are both 1400×1600 (was 429/523 for the original logo.png)
export const LOGO_RATIO = 1400 / 1600
