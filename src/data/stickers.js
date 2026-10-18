/**
 * "What I bring to the table" — draggable stickers on the Playground page.
 *
 * Each item: { label, image?, tone?, shape?, x, y, rot?, scale? }
 *   label  — skill name, hand-lettered under the sticker; also its alt text
 *   image  — die-cut sticker PNG (transparent background) in /public,
 *            e.g. '/assets/stickers/sun.png'. Without it, a CSS sticker is drawn.
 *   tone   — CSS-sticker colour: 'skin' | 'leaf' | 'blush' | 'ink' | 'paper'
 *   shape  — CSS-sticker shape: 'pill' | 'circle' | 'tag' | 'star'
 *   x, y   — starting position of the sticker's centre, in % of the tabletop
 *            (must land on the table's curved top)
 *   rot    — starting tilt in degrees
 *   scale  — size relative to the other image stickers (default 1)
 */
export const stickers = [
  { label: 'UX research', image: '/assets/stickers/pumpkin-bear.png', x: 14, y: 40, rot: -8 },
  { label: 'Visual design', image: '/assets/stickers/sun.png', x: 30, y: 30, rot: 7 },
  { label: 'Illustration', image: '/assets/stickers/tulip-pot.png', x: 43, y: 38, rot: -5 },
  { label: 'Prototyping', image: '/assets/stickers/bunny-bear.png', x: 64, y: 42, rot: 6 },
  { label: 'Design systems', image: '/assets/stickers/penguin.png', x: 80, y: 30, rot: -6 },
  { label: 'Product strategy', image: '/assets/stickers/sandcastle.png', x: 20, y: 66, rot: 5 },
  { label: 'Motion', image: '/assets/stickers/cake.png', x: 36, y: 70, rot: -7 },
  { label: 'Development', image: '/assets/stickers/cherries.png', x: 54, y: 72, rot: 9 },
  { label: 'User testing', image: '/assets/stickers/bear.png', x: 72, y: 70, rot: -4 },
  { label: 'Branding', image: '/assets/stickers/duck.png', x: 88, y: 60, rot: 8 },
]
