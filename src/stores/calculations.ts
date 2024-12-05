import { defineStore } from 'pinia'
import { ref } from 'vue'
import { SavedCalculation } from '@/core/types/hydraulic.types'
import { WebStorageService } from '@/platforms/web/storage/web.storage'

const storageService = new WebStorageService()

export const useCalculationsStore = defineStore('calculations', () => {
  const savedCalculations = ref<SavedCalculation[]>([])

  async function loadCalculations() {
    savedCalculations.value = await storageService.getCalculations()
  }

  async function saveCalculation(calculation: SavedCalculation) {
    await storageService.saveCalculation(calculation)
    await loadCalculations()
  }

  async function deleteCalculation(id: string) {
    await storageService.deleteCalculation(id)
    await loadCalculations()
  }

  async function clearCalculations() {
    await storageService.clearCalculations()
    savedCalculations.value = []
  }

  return {
    savedCalculations,
    loadCalculations,
    saveCalculation,
    deleteCalculation,
    clearCalculations
  }
})
