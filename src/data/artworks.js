/**
 * Artworks shown in the 3D gallery on the Playground page.
 *
 * Each item: { title, year?, medium?, color, ratio?, image? }
 *   color  — flat placeholder colour, used until `image` is set (and while it loads)
 *   ratio  — width / height of the piece; ignored once `image` loads (the real
 *            photo's proportions win)
 *   image  — path in /public, e.g. '/assets/art/sunset.jpg'
 *
 * Photos live in public/assets/art/ (≤1200px long edge, JPEG q82 — keeps GPU
 * memory sane with every piece loaded as a texture at once).
 */
export const artworks = [
  {
    title: 'Thank You, Heroes',
    medium: 'Coloured pencil & ink',
    color: '#9e9b8d',
    ratio: 0.658,
    image: '/assets/art/thank-you-heroes.jpg',
  },
  {
    title: 'The City on My Head',
    year: '2020',
    medium: 'Watercolour & ink',
    color: '#7e766a',
    ratio: 0.711,
    image: '/assets/art/city-on-my-head.jpg',
  },
  {
    title: 'Staircase Study',
    medium: 'Ink & pencil',
    color: '#918e88',
    ratio: 0.659,
    image: '/assets/art/staircase-study.jpg',
  },
  {
    title: 'Victorian House at Night',
    medium: 'Marker & ink',
    color: '#63605b',
    ratio: 0.731,
    image: '/assets/art/victorian-house.jpg',
  },
  {
    title: 'Flowing Architecture',
    medium: 'Ink & marker',
    color: '#9a958e',
    ratio: 0.691,
    image: '/assets/art/flowing-architecture.jpg',
  },
  {
    title: 'Corner Store',
    year: '2020',
    medium: 'Watercolour & ink',
    color: '#a69990',
    ratio: 0.707,
    image: '/assets/art/corner-store.jpg',
  },
  {
    title: 'Winter Bell Tower',
    medium: 'Gouache & ink',
    color: '#927e69',
    ratio: 0.694,
    image: '/assets/art/winter-bell-tower.jpg',
  },
  {
    title: 'Boutique',
    medium: 'Watercolour & ink',
    color: '#b5ad9f',
    ratio: 0.763,
    image: '/assets/art/boutique.jpg',
  },
  {
    title: 'Neptune',
    medium: 'Ink stippling',
    color: '#928b81',
    ratio: 0.659,
    image: '/assets/art/neptune-stippled.jpg',
  },
  {
    title: 'Mountain Trail',
    medium: 'Acrylic',
    color: '#554e3c',
    ratio: 1.39,
    image: '/assets/art/mountain-trail.jpg',
  },
  {
    title: 'Café Corner',
    medium: 'Watercolour & ink',
    color: '#655b46',
    ratio: 1.381,
    image: '/assets/art/cafe-corner.jpg',
  },
  {
    title: "London's Tower Bridge",
    year: '2020',
    medium: 'Ink & marker',
    color: '#b0a38f',
    ratio: 0.687,
    image: '/assets/art/tower-bridge.jpg',
  },
  {
    title: 'Baroque Church, Rome',
    year: '2020',
    medium: 'Ink & pencil',
    color: '#ada89f',
    ratio: 0.705,
    image: '/assets/art/baroque-church-rome.jpg',
  },
  {
    title: 'Fractured City',
    medium: 'Ink',
    color: '#988c80',
    ratio: 0.761,
    image: '/assets/art/fractured-city.jpg',
  },
  {
    title: 'Modern Houses',
    medium: 'Watercolour & fineliner',
    color: '#888e95',
    ratio: 0.583,
    image: '/assets/art/modern-houses.jpg',
  },
  {
    title: 'Mountain Lake',
    medium: 'Watercolour on wood',
    color: '#888a91',
    ratio: 0.823,
    image: '/assets/art/mountain-lake.jpg',
  },
  {
    title: 'Canyon River',
    medium: 'Watercolour on wood',
    color: '#8d807a',
    ratio: 0.748,
    image: '/assets/art/canyon-river.jpg',
  },
  {
    title: 'Blossom Canal',
    medium: 'Gouache',
    color: '#6d6e5d',
    ratio: 0.73,
    image: '/assets/art/blossom-canal.jpg',
  },
]
