/**
 * Experience wallet (About page) — edit the cards and tools here.
 *
 * Each card is a ticket tucked into one side of the wallet (`panel`); up to
 * two per side — the second one sits a pocket lower.
 * `tone` picks the ticket stock ('sun' | 'leaf'). Tags print on the ticket;
 * `tools` appear as stamps next to the wallet when the ticket is pulled out.
 * Tool `logo` keys map to the marks drawn in ExperienceWallet.vue; an
 * optional `group` prints the tools under small headings (e.g. Front-end).
 */
export const walletCards = [
  {
    id: 'design',
    panel: 'right',
    tone: 'sun',
    title: 'Design',
    tags: ['UI / UX', 'Prototyping', 'Branding', '3D', 'Typography'],
    tools: [
      { name: 'Figma', logo: 'figma' },
      { name: 'Adobe Illustrator', logo: 'ai' },
      { name: 'Adobe After Effects', logo: 'ae' },
      { name: 'Blender', logo: 'blender' },
    ],
  },
  {
    id: 'frontend',
    panel: 'left',
    tone: 'leaf',
    title: 'Front-end',
    tags: ['Interactive 3D', 'Animation', 'Responsive UI'],
    tools: [
      { name: 'JavaScript', logo: 'js' },
      { name: 'Vue 3', logo: 'vue' },
      { name: 'Pinia', logo: 'pinia' },
      { name: 'HTML', logo: 'html' },
      { name: 'CSS', logo: 'css' },
      { name: 'SCSS', logo: 'scss' },
      { name: 'Vite', logo: 'vite' },
    ],
  },
  {
    id: 'backend',
    panel: 'left',
    tone: 'sun',
    title: 'Back-end',
    tags: ['REST APIs', 'Databases', 'Full-stack'],
    tools: [
      { name: 'Node.js', logo: 'node' },
      { name: 'Express', logo: 'express' },
      { name: 'REST API', logo: 'rest' },
      { name: 'PHP', logo: 'php' },
      { name: 'MySQL', logo: 'mysql' },
      { name: 'PostgreSQL', logo: 'postgres' },
    ],
  },
]

/**
 * The ID card in the wallet's right pocket — click it to pull it out and the
 * full card shows beside the wallet. An empty `value` prints as "—";
 * `wide` lets a long value span both columns.
 */
export const idCard = {
  name: 'Melly Marcelia',
  photo: '/assets/about/id-photo.jpg',
  fields: [
    { label: 'Born in', value: 'Jakarta, Indonesia' },
    { label: 'Date of birth', value: '10 May 2003' },
    { label: 'Based in', value: 'Brussels, Belgium' },
  ],
}
