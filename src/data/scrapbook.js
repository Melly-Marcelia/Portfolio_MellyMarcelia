/**
 * Scrapbook pages for the flip book on the Playground page.
 *
 * Pages are read in order: the first is the front cover, the last the back
 * cover, and everything between pairs up into spreads (left, right).
 * Keep an even count so the back cover lands on its own; a blank page is
 * added automatically if the count is odd.
 *
 * Each item: { image?, caption?, color? }
 *   image    — full-page image in /public, e.g. '/assets/scrapbook/01.jpg'
 *              (portrait ~0.68 : 1, ≤1400px tall; transparent WebP keeps the
 *              paper's real torn outline)
 *   caption  — shown on the placeholder until `image` is set; also the alt text
 *   color    — placeholder background until `image` is set (inner pages only;
 *              covers are leather unless they have an `image`)
 *
 * The front cover also takes:
 *   title    — lines of the white script title, e.g. ['tour of', 'my', 'scrapbook']
 *   strip    — photo-booth frames tucked under the band, top to bottom:
 *              { image, focus: 'x% y%' (the point to zoom on), zoom }
 */
// Inner pages alternate left / right: pages whose binding holes sit on the
// right go on the left of a spread (odd positions), like a real book.
const S = '/assets/scrapbook/'
export const scrapbook = [
  {
    caption: 'Scrapbook',
    strip: [
      { image: `${S}booth-4.webp`, focus: '50% 30%', zoom: 1 },
      { image: `${S}booth-2.webp`, focus: '50% 30%', zoom: 1 },
      { image: `${S}booth-3.webp`, focus: '50% 30%', zoom: 1 },
      { image: `${S}booth-4.webp`, focus: '50% 30%', zoom: 1 },
    ],
  },
  { caption: 'Quarantine', image: `${S}quarantine.webp` },
  { caption: 'European', image: `${S}european.webp` },
  { caption: 'What is vintage?', image: `${S}vintage.webp` },
  { caption: 'Red', image: `${S}red.webp` },
  { caption: 'Aladdin', image: `${S}aladdin.webp` },
  { caption: 'Unicorn', image: `${S}unicorn.webp` },
  { caption: "You're so gorgeous", image: `${S}gorgeous.webp` },
  { caption: 'Random', image: `${S}random.webp` },
  { caption: 'Kraft paper washi tape', image: `${S}kraft.webp` },
  { caption: 'Be amazing today', image: `${S}be-amazing.webp` },
  {},
]
