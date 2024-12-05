<template>
  <div class="saved-calculations">
    <div class="section-header">
      <h2>Saved Calculations</h2>
      <span class="count-badge">{{ calculations.length }}</span>
    </div>

    <div v-if="calculations.length === 0" class="empty-state">
      <div class="empty-icon"><i class="fa-regular fa-clipboard"></i></div>
      <p>No saved calculations yet</p>
      <p class="empty-hint">Save your calculations to access them later</p>
    </div>

    <div v-else class="calculations-list">
      <div v-for="(calc, index) in calculations" 
           :key="index" 
           class="calculation-card"
           @click="$emit('load', calc)">
        <div class="calculation-header">
          <span class="calculation-date">{{ formatDate(calc.timestamp) }}</span>
          <button class="delete-btn" @click.stop="$emit('delete', index)">
            <span class="delete-icon">×</span>
          </button>
        </div>
        
        <div class="calculation-content">
          <div class="params-section">
            <h3>Input Parameters</h3>
            <div class="param-grid">
              <div class="param-item">
                <span class="param-label">Width</span>
                <span class="param-value">{{ calc.inputs.width }} m</span>
              </div>
              <div class="param-item">
                <span class="param-label">Depth</span>
                <span class="param-value">{{ calc.inputs.depth }} m</span>
              </div>
              <div class="param-item">
                <span class="param-label">Slope</span>
                <span class="param-value">{{ calc.inputs.slope }} m/m</span>
              </div>
              <div class="param-item">
                <span class="param-label">Roughness</span>
                <span class="param-value">{{ calc.inputs.roughness }}</span>
              </div>
            </div>
          </div>

          <div class="results-section">
            <h3>Key Results</h3>
            <div class="results-grid">
              <div class="result-item">
                <span class="result-label">Area</span>
                <span class="result-value">{{ formatNumber(calc.results.area) }} m²</span>
              </div>
              <div class="result-item">
                <span class="result-label">Velocity</span>
                <span class="result-value">{{ formatNumber(calc.results.velocity) }} m/s</span>
              </div>
            </div>
          </div>
        </div>

        <div class="calculation-footer">
          <span class="load-hint">Click to load calculation</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  calculations: {
    type: Array,
    required: true,
    default: () => []
  }
})

defineEmits(['load', 'delete'])

const formatDate = (timestamp) => {
  return new Date(timestamp).toLocaleString('en-US', {
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
</script>

<style scoped>
.saved-calculations {
  padding: 2rem;
  background: var(--color-background-soft);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-md);
}

.section-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
  padding-bottom: 0.75rem;
  position: relative;
}

.section-header::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 1px;
  background: linear-gradient(to right, var(--color-primary) 0%, var(--color-accent) 100%);
  opacity: 0.2;
}

.section-header h2 {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--color-text);
  margin: 0;
}

.count-badge {
  background: var(--color-primary);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.875rem;
  font-weight: 500;
}

.empty-state {
  text-align: center;
  padding: 3rem 1rem;
  color: var(--color-text-light);
}

.empty-icon {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.empty-hint {
  font-size: 0.875rem;
  margin-top: 0.5rem;
}

.calculations-list {
  display: grid;
  gap: 1rem;
}

.calculation-card {
  background: var(--color-background);
  border-radius: var(--border-radius-sm);
  box-shadow: var(--shadow-sm);
  overflow: hidden;
  transition: transform 0.2s, box-shadow 0.2s;
  cursor: pointer;
}

.calculation-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.calculation-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: linear-gradient(to right, rgba(74, 144, 226, 0.05), rgba(124, 92, 191, 0.05));
}

.calculation-date {
  font-size: 0.875rem;
  color: var(--color-text-light);
}

.delete-btn {
  background: none;
  border: none;
  color: var(--color-text-light);
  cursor: pointer;
  padding: 0.25rem 0.5rem;
  border-radius: var(--border-radius-sm);
  transition: all 0.2s;
}

.delete-btn:hover {
  background: rgba(255, 0, 0, 0.1);
  color: #dc2626;
}

.delete-icon {
  font-size: 1.25rem;
  line-height: 1;
}

.calculation-content {
  padding: 1rem;
}

.params-section, .results-section {
  margin-bottom: 1rem;
}

.params-section h3, .results-section h3 {
  font-size: 0.875rem;
  color: var(--color-text-light);
  margin-bottom: 0.75rem;
  font-weight: 500;
}

.param-grid, .results-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 0.75rem;
}

.param-item, .result-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.param-label, .result-label {
  font-size: 0.75rem;
  color: var(--color-text-light);
}

.param-value, .result-value {
  font-size: 0.875rem;
  color: var(--color-text);
  font-weight: 500;
}

.calculation-footer {
  padding: 0.75rem 1rem;
  background: var(--color-background-soft);
  border-top: 1px solid var(--color-border);
}

.load-hint {
  font-size: 0.75rem;
  color: var(--color-text-light);
}

@media (max-width: 768px) {
  .saved-calculations {
    padding: 1rem;
    margin: 1rem;
  }

  .section-header {
    margin-bottom: 1.5rem;
  }

  .param-grid, .results-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
