import { ref, watch } from 'vue'
import { defineStore } from 'pinia'

export const useCalculationsStore = defineStore('calculations', () => {
  const savedCalculations = ref(JSON.parse(localStorage.getItem('savedCalculations')) || [])
  const currentCalculation = ref(null)

  // Watch for changes in savedCalculations and update localStorage
  watch(savedCalculations, (newCalculations) => {
    localStorage.setItem('savedCalculations', JSON.stringify(newCalculations))
  }, { deep: true })

  const saveCalculation = (calculation) => {
    const newCalc = {
      ...calculation,
      id: Date.now(),
      timestamp: new Date().toISOString()
    }
    savedCalculations.value.unshift(newCalc)
  }

  const deleteCalculation = (id) => {
    const index = savedCalculations.value.findIndex(calc => calc.id === id)
    if (index !== -1) {
      savedCalculations.value.splice(index, 1)
    }
  }

  const setCurrentCalculation = (calculation) => {
    currentCalculation.value = calculation
  }

  return {
    savedCalculations,
    currentCalculation,
    saveCalculation,
    deleteCalculation,
    setCurrentCalculation
  }
})
