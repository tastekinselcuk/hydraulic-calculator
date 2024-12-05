<template>
  <div class="calculator-container">
    <div class="calculator-grid">
      <div class="saved-panel">
        <div v-if="calculationsStore.savedCalculations.length === 0" class="empty-state">
          <div class="empty-icon"><i class="fa-regular fa-clipboard"></i></div>
          <p class="empty-message">{{ t[currentLanguage].saved.noCalculations }}</p>
          <p class="empty-hint">{{ t[currentLanguage].saved.hint }}</p>
          <RouterLink to="/" class="btn btn-primary">{{ t[currentLanguage].saved.backToCalculator }}</RouterLink>
        </div>

        <div v-else class="saved-calculations-grid">
          <div v-for="(calc, index) in calculationsStore.savedCalculations" 
               :key="index" 
               class="result-card saved-calculation-card"
               @click="navigateToCalculator(index)">
            <div class="card-header">
              <span class="timestamp">{{ t[currentLanguage].saved.timestamp }}: {{ formatDate(calc.timestamp) }}</span>
              <button class="delete-btn" @click.stop="deleteCalculation(index)">×</button>
            </div>
            
            <div class="card-content">
              <div class="input-summary">
                <h3>{{ t[currentLanguage].calculator.title }}</h3>
                <div class="params-grid">
                  <div class="param-item">
                    <span class="param-label">{{ t[currentLanguage].calculator.width }}:</span>
                    <span class="param-value">{{ calc.inputs.width }} {{ t[currentLanguage].units.meters }}</span>
                  </div>
                  <div class="param-item">
                    <span class="param-label">{{ t[currentLanguage].calculator.depth }}:</span>
                    <span class="param-value">{{ calc.inputs.depth }} {{ t[currentLanguage].units.meters }}</span>
                  </div>
                  <div class="param-item">
                    <span class="param-label">{{ t[currentLanguage].calculator.slope }}:</span>
                    <span class="param-value">{{ calc.inputs.slope }} {{ t[currentLanguage].units.meterPerMeter }}</span>
                  </div>
                  <div class="param-item">
                    <span class="param-label">{{ t[currentLanguage].calculator.roughness }}:</span>
                    <span class="param-value">{{ calc.inputs.roughness }}</span>
                  </div>
                </div>
              </div>

              <div class="results-summary">
                <h3>{{ t[currentLanguage].calculator.results }}</h3>
                <div class="results-grid">
                  <div class="result-item">
                    <span class="result-label">{{ t[currentLanguage].calculator.area }}:</span>
                    <span class="result-value">{{ formatNumber(calc.results.area) }} {{ t[currentLanguage].units.metersSquared }}</span>
                  </div>
                  <div class="result-item">
                    <span class="result-label">{{ t[currentLanguage].calculator.discharge }}:</span>
                    <span class="result-value">{{ formatNumber(calc.results.discharge) }} {{ t[currentLanguage].units.cubicMetersPerSecond }}</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="card-footer">
              {{ t[currentLanguage].saved.clickToLoad }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCalculationsStore } from '../stores/calculations'
import { useLanguageStore } from '../stores/language'
import en from '../locales/en'
import tr from '../locales/tr'

const router = useRouter()
const calculationsStore = useCalculationsStore()
const languageStore = useLanguageStore()
const currentLanguage = computed(() => languageStore.currentLanguage)
const t = { en, tr }

const formatDate = (timestamp) => {
  return new Date(timestamp).toLocaleString(currentLanguage.value === 'tr' ? 'tr-TR' : 'en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const formatNumber = (value) => {
  return typeof value === 'number' ? value.toFixed(3) : '-'
}

const deleteCalculation = (index) => {
  const calculation = calculationsStore.savedCalculations[index]
  if (calculation && confirm(t[currentLanguage.value].saved.deleteConfirm)) {
    calculationsStore.deleteCalculation(calculation.id)
  }
}

const navigateToCalculator = (index) => {
  router.push({ path: '/', query: { load: index } })
}
</script>

<style scoped>
.calculator-container {
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  padding: 0 1rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.calculator-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  background: var(--surface-color);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-md);
  border: 1px solid var(--border-color);
}

.saved-panel {
  background: var(--surface-color);
  border-radius: var(--border-radius-lg);
  padding: 2rem;
}

.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  background: var(--surface-color);
  border-radius: var(--border-radius-lg);
  border: 1px solid var(--border-color);
}

.empty-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
  color: var(--text-secondary);
}

.empty-message {
  color: var(--dark-border);
  font-size: 1.2rem;
}

.empty-hint {
  color: var(--text-secondary);
  margin: 1rem 0 2rem;
  font-size: 0.9rem;
}

.saved-calculations-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.25rem;
}

.saved-calculation-card {
  background: var(--surface-color);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-lg);
  overflow: hidden;
  transition: all var(--transition-fast);
  cursor: pointer;
}

.saved-calculation-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
  border-color: var(--primary-color);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: linear-gradient(to right, rgba(74, 144, 226, 0.05), rgba(124, 92, 191, 0.05));
  border-bottom: 1px solid var(--border-color);
}

.timestamp {
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.delete-btn {
  background: none;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  padding: 0.25rem 0.5rem;
  border-radius: var(--border-radius-sm);
  font-size: 1.25rem;
  line-height: 1;
  transition: all var(--transition-fast);
}

.delete-btn:hover {
  color: #dc2626;
  background: rgba(220, 38, 38, 0.1);
}

.card-content {
  padding: 1.5rem;
}

.input-summary, .results-summary {
  margin-bottom: 1.5rem;
}

.input-summary:last-child {
  margin-bottom: 0;
}

.input-summary h3, .results-summary h3 {
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin-bottom: 1rem;
  font-weight: 500;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--border-color);
}

.params-grid, .results-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.param-item, .result-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem;
  background: var(--color-background-soft);
  border-radius: var(--border-radius-sm);
}

.param-label, .result-label {
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.param-value, .result-value {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-primary);
}

.card-footer {
  padding: 1rem;
  background: var(--color-background-soft);
  color: var(--text-secondary);
  font-size: 0.875rem;
  text-align: center;
  border-top: 1px solid var(--border-color);
}

@media (max-width: 768px) {
  .calculator-container {
    padding: 1rem;
  }

  .calculator-grid {
    padding: 1rem;
    gap: 1rem;
  }

  .saved-panel {
    padding: 1rem;
  }

  .section-header {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }

  .saved-calculations-grid {
    grid-template-columns: 1fr;
  }

  .params-grid, .results-grid {
    grid-template-columns: 1fr;
  }
}
</style>
