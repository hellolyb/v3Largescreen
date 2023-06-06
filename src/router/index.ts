import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'screen',
      component: () => import('../views/ScreenView.vue')
    },
    {
      path: '/home',
      name: 'home',
      component: HomeView
    },
    {
      path: '/about',
      name: 'about',

      component: () => import('../views/AboutView.vue')
    },
    {
      path: '/chinamap',
      name: 'chinamap',

      component: () => import('../views/mapView.vue')
    },
    {
      path: '/ranks',
      name: 'ranks',

      component: () => import('../views/RanksView.vue')
    },
    {
      path: '/hotproduct',
      name: 'hotproduct',
      component: () => import('../views/hotproductView.vue')
    },
    {
      path: '/stock',
      name: 'stock',
      component: () => import('../views/stockView.vue')
    }
  ]
})

export default router
