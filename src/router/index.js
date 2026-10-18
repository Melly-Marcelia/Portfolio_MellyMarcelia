import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition
    if (to.hash) return { el: to.hash, behavior: 'smooth' }
    return { top: 0 }
  },
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/projects',
      name: 'works',
      component: () => import('@/views/WorksView.vue'),
    },
    {
      // redirect the old /works URLs
      path: '/works',
      redirect: { name: 'works' },
    },
    {
      path: '/projects/:slug',
      name: 'project',
      component: () => import('@/views/ProjectDetailView.vue'),
      props: true,
    },
    {
      path: '/works/:slug',
      redirect: (to) => ({ name: 'project', params: { slug: to.params.slug } }),
    },
    {
      path: '/playground',
      name: 'playground',
      component: () => import('@/views/PlaygroundView.vue'),
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('@/views/AboutView.vue'),
    },
    {
      path: '/contact',
      name: 'contact',
      component: () => import('@/views/ContactView.vue'),
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/views/NotFoundView.vue'),
    },
  ],
})

export default router
