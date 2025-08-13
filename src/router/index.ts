import { createRouter, createWebHistory } from 'vue-router'
import OrangopusWebapp from '@/screens/OrangopusWebapp.vue'
import ProjectDetail from '@/components/ProjectDetail.vue'
import Globe from '@/components/Globe.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: OrangopusWebapp
  },
  {
    path: '/observatory',
    name: 'Observatory',
    component: OrangopusWebapp,
    props: { initialView: 'observatory' }
  },
  {
    path: '/project/:slug',
    name: 'ProjectDetail',
    component: ProjectDetail,
    props: true
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: OrangopusWebapp,
    props: { initialView: 'dashboard' }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: OrangopusWebapp,
    props: { initialView: 'profile' }
  },
  {
    path: '/globe',
    name: 'Globe',
    component: Globe
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

// Update page title based on route
router.beforeEach((to, from, next) => {
  const titles: { [key: string]: string } = {
    'Home': 'Orangopus - Simplifying Development',
    'Observatory': 'News Observatory - Orangopus',
    'Dashboard': 'Dashboard - Orangopus',
    'Profile': 'Profile - Orangopus',
    'ProjectDetail': 'Project Details - Orangopus',
    'Globe': 'Earth Data Globe - Orangopus'
  }
  
  const title = titles[to.name as string] || 'Orangopus - Simplifying Development'
  document.title = title
  
  next()
})

export default router 