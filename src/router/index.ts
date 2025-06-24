import { createRouter, createWebHistory } from 'vue-router'
import OrangopusWebapp from '@/screens/OrangopusWebapp.vue'
import ProjectDetail from '@/components/ProjectDetail.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: OrangopusWebapp
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

export default router 