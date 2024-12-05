import { createRouter, createWebHistory } from 'vue-router'
import HydraulicCalculator from '../components/HydraulicCalculator.vue'
import SavedCalculations from '../components/SavedCalculations.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'calculator',
      component: HydraulicCalculator
    },
    {
      path: '/saved',
      name: 'saved',
      component: SavedCalculations
    }
  ]
})

export default router
