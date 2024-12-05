import { createRouter, createWebHistory } from 'vue-router'
import HydraulicCalculator from '../components/HydraulicCalculator.vue'
import SavedCalculationsView from '../views/SavedCalculationsView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HydraulicCalculator
    },
    {
      path: '/saved',
      name: 'saved',
      component: SavedCalculationsView
    }
  ]
})

export default router
