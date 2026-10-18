import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import reveal from './directives/reveal'
import { initAnalytics } from './composables/useAnalytics'

// Global styles — order matters: tokens → base → type styles → motion
import './styles/tokens.css'
import './styles/base.css'
import './styles/typography.css'
import './styles/motion.css'

initAnalytics(router)

createApp(App).use(router).use(reveal).mount('#app')
