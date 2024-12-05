<template>
  <div class="calculator-container">
    <div class="calculator-grid">
      <div class="input-panel">
        <h2>{{ t[currentLanguage].calculator.title }}</h2>
        <div class="input-group">
          <label for="width">{{ t[currentLanguage].calculator.width }}</label>
          <div class="input-with-unit">
            <input type="number" id="width" v-model="inputs.width" step="0.1" min="0" />
            <span class="unit">{{ t[currentLanguage].units.meters }}</span>
          </div>
        </div>
        <div class="input-group">
          <label for="depth">{{ t[currentLanguage].calculator.depth }}</label>
          <div class="input-with-unit">
            <input type="number" id="depth" v-model="inputs.depth" step="0.1" min="0" />
            <span class="unit">{{ t[currentLanguage].units.meters }}</span>
          </div>
        </div>
        <div class="input-group">
          <label for="slope">{{ t[currentLanguage].calculator.slope }}</label>
          <div class="input-with-unit">
            <input type="number" id="slope" v-model="inputs.slope" step="0.001" min="0" />
            <span class="unit">{{ t[currentLanguage].units.meterPerMeter }}</span>
          </div>
        </div>
        <div class="input-group">
          <label for="roughness">{{ t[currentLanguage].calculator.roughness }}</label>
          <div class="input-with-unit">
            <input type="number" id="roughness" v-model="inputs.roughness" step="0.001" min="0" />
            <span class="unit">{{ t[currentLanguage].units.manningN }}</span>
          </div>
        </div>
      </div>

      <div class="results-panel">
        <h2>{{ t[currentLanguage].calculator.results }}</h2>
        <div class="results-grid">
          <div class="result-card" @click="copyToClipboard('area')">
            <div class="result-label">{{ t[currentLanguage].calculator.area }}</div>
            <div class="result-value">{{ formatNumber(area) }}</div>
            <div class="result-unit">{{ t[currentLanguage].units.metersSquared }}</div>
            <div class="copy-tooltip">{{ t[currentLanguage].calculator.copyTooltip }}</div>
          </div>
          <div class="result-card" @click="copyToClipboard('wettedPerimeter')">
            <div class="result-label">{{ t[currentLanguage].calculator.wettedPerimeter }}</div>
            <div class="result-value">{{ formatNumber(wettedPerimeter) }}</div>
            <div class="result-unit">{{ t[currentLanguage].units.meters }}</div>
            <div class="copy-tooltip">{{ t[currentLanguage].calculator.copyTooltip }}</div>
          </div>
          <div class="result-card" @click="copyToClipboard('hydraulicRadius')">
            <div class="result-label">{{ t[currentLanguage].calculator.hydraulicRadius }}</div>
            <div class="result-value">{{ formatNumber(hydraulicRadius) }}</div>
            <div class="result-unit">{{ t[currentLanguage].units.meters }}</div>
            <div class="copy-tooltip">{{ t[currentLanguage].calculator.copyTooltip }}</div>
          </div>
          <div class="result-card" @click="copyToClipboard('velocity')">
            <div class="result-label">{{ t[currentLanguage].calculator.velocity }}</div>
            <div class="result-value">{{ formatNumber(velocity) }}</div>
            <div class="result-unit">{{ t[currentLanguage].units.metersPerSecond }}</div>
            <div class="copy-tooltip">{{ t[currentLanguage].calculator.copyTooltip }}</div>
          </div>
          <div class="result-card" @click="copyToClipboard('discharge')">
            <div class="result-label">{{ t[currentLanguage].calculator.discharge }}</div>
            <div class="result-value">{{ formatNumber(results.discharge) }}</div>
            <div class="result-unit">{{ t[currentLanguage].units.cubicMetersPerSecond }}</div>
            <div class="copy-tooltip">{{ t[currentLanguage].calculator.copyTooltip }}</div>
          </div>
          <div class="result-card" @click="copyToClipboard('froudeNumber')">
            <div class="result-label">{{ t[currentLanguage].calculator.froudeNumber }}</div>
            <div class="result-value">{{ formatNumber(results.froudeNumber) }}</div>
            <div class="result-unit">-</div>
            <div class="copy-tooltip">{{ t[currentLanguage].calculator.copyTooltip }}</div>
          </div>
        </div>
        <div class="button-container">
          <button class="btn btn-save" @click="saveCalculation">
            <span class="btn-icon"><i class="fa-regular fa-floppy-disk"></i></span>
            {{ t[currentLanguage].calculator.saveButton }}
          </button>
          <button class="btn btn-pdf" @click="exportResults">
            <span class="btn-icon"><i class="fa-regular fa-file-lines"></i></span>
            {{ t[currentLanguage].calculator.exportButton }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useCalculationsStore } from '../stores/calculations'
import { useLanguageStore } from '../stores/language'
import { useRouter, useRoute } from 'vue-router'
import { jsPDF } from 'jspdf'
import 'jspdf-autotable'
import en from '../locales/en'
import tr from '../locales/tr'

const calculationsStore = useCalculationsStore()
const languageStore = useLanguageStore()
const router = useRouter()
const route = useRoute()
const currentLanguage = computed(() => languageStore.currentLanguage)
const t = { en, tr }

const inputs = ref({
  width: 0,
  depth: 0,
  slope: 0,
  roughness: 0.013,
})

const results = ref({
  area: 0,
  wettedPerimeter: 0,
  hydraulicRadius: 0,
  velocity: 0,
  discharge: 0,
  froudeNumber: 0,
})

// Load saved calculation if specified in route
onMounted(() => {
  const loadIndex = route.query.load
  if (loadIndex !== undefined) {
    const calculation = calculationsStore.savedCalculations[loadIndex]
    if (calculation) {
      inputs.value = { ...calculation.inputs }
    }
  }
})

// Computed properties for calculations
const area = computed(() => inputs.value.width * inputs.value.depth)
const wettedPerimeter = computed(() => inputs.value.width + (2 * inputs.value.depth))
const hydraulicRadius = computed(() => {
  return wettedPerimeter.value === 0 ? 0 : area.value / wettedPerimeter.value
})
const velocity = computed(() => {
  if (inputs.value.roughness === 0 || hydraulicRadius.value === 0 || inputs.value.slope === 0) return 0
  const manning = (1 / inputs.value.roughness) * Math.pow(hydraulicRadius.value, 2/3) * Math.pow(inputs.value.slope, 0.5)
  return manning
})
const discharge = computed(() => area.value * velocity.value)
const froudeNumber = computed(() => {
  if (inputs.value.depth === 0) return 0
  return velocity.value / Math.sqrt(9.81 * inputs.value.depth)
})

// Helper function to format numbers
const formatNumber = (value) => {
  return typeof value === 'number' ? value.toFixed(3) : '-'
}

const exportResults = () => {
  try {
    // Create PDF document
    const doc = new jsPDF('p', 'mm', 'a4')
    const pageWidth = doc.internal.pageSize.getWidth()

    // Format date in Turkish if language is Turkish
    const dateOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit'
    }
    const currentTime = new Date().toLocaleString(
      currentLanguage.value === 'tr' ? 'tr-TR' : 'en-US',
      dateOptions
    )

    // Function to encode Turkish characters
    const encodeTurkishChars = (text) => {
      const turkishChars = {
        'ğ': 'g', 'Ğ': 'G',
        'ü': 'u', 'Ü': 'U',
        'ş': 's', 'Ş': 'S',
        'ı': 'i', 'İ': 'I',
        'ö': 'o', 'Ö': 'O',
        'ç': 'c', 'Ç': 'C'
      }
      return text.replace(/[ğĞüÜşŞıİöÖçÇ]/g, match => turkishChars[match] || match)
    }

    // Add title
    doc.setFontSize(20)
    const title = encodeTurkishChars(currentLanguage.value === 'tr' ? 'Hidrolik Hesap Makinesi' : 'Hydraulic Calculator')
    doc.text(title, pageWidth / 2, 20, { align: 'center' })
    
    // Add timestamp
    doc.setFontSize(10)
    const datePrefix = encodeTurkishChars(currentLanguage.value === 'tr' ? 'Tarih: ' : 'Date: ')
    doc.text(datePrefix + currentTime, pageWidth / 2, 30, { align: 'center' })

    // Input parameters table
    doc.setFontSize(12)
    const inputTitle = encodeTurkishChars(currentLanguage.value === 'tr' ? 'Girdi Parametreleri' : 'Input Parameters')
    doc.text(inputTitle, 14, 45)

    const inputData = [
      [encodeTurkishChars(t[currentLanguage.value].calculator.width), `${formatNumber(inputs.value.width)} ${encodeTurkishChars(t[currentLanguage.value].units.meters)}`],
      [encodeTurkishChars(t[currentLanguage.value].calculator.depth), `${formatNumber(inputs.value.depth)} ${encodeTurkishChars(t[currentLanguage.value].units.meters)}`],
      [encodeTurkishChars(t[currentLanguage.value].calculator.slope), `${formatNumber(inputs.value.slope)} ${encodeTurkishChars(t[currentLanguage.value].units.meterPerMeter)}`],
      [encodeTurkishChars(t[currentLanguage.value].calculator.roughness), formatNumber(inputs.value.roughness)]
    ]
    
    doc.autoTable({
      startY: 50,
      head: [[
        encodeTurkishChars(currentLanguage.value === 'tr' ? 'Parametre' : 'Parameter'),
        encodeTurkishChars(currentLanguage.value === 'tr' ? 'Değer' : 'Value')
      ]],
      body: inputData,
      theme: 'grid',
      headStyles: { 
        fillColor: [66, 135, 245],
        textColor: [255, 255, 255],
        halign: 'center',
        fontSize: 12,
        cellPadding: 4
      },
      bodyStyles: {
        halign: 'left',
        fontSize: 10,
        cellPadding: 4
      },
      columnStyles: {
        0: { cellWidth: 'auto' },
        1: { cellWidth: 'auto', halign: 'right' }
      },
      margin: { top: 10, left: 14, right: 14, bottom: 10 }
    })

    // Results table
    const resultData = [
      [encodeTurkishChars(t[currentLanguage.value].calculator.area), `${formatNumber(area.value)} ${encodeTurkishChars(t[currentLanguage.value].units.metersSquared)}`],
      [encodeTurkishChars(t[currentLanguage.value].calculator.wettedPerimeter), `${formatNumber(wettedPerimeter.value)} ${encodeTurkishChars(t[currentLanguage.value].units.meters)}`],
      [encodeTurkishChars(t[currentLanguage.value].calculator.hydraulicRadius), `${formatNumber(hydraulicRadius.value)} ${encodeTurkishChars(t[currentLanguage.value].units.meters)}`],
      [encodeTurkishChars(t[currentLanguage.value].calculator.velocity), `${formatNumber(velocity.value)} ${encodeTurkishChars(t[currentLanguage.value].units.metersPerSecond)}`],
      [encodeTurkishChars(t[currentLanguage.value].calculator.discharge), `${formatNumber(discharge.value)} ${encodeTurkishChars(t[currentLanguage.value].units.cubicMetersPerSecond)}`],
      [encodeTurkishChars(t[currentLanguage.value].calculator.froudeNumber), formatNumber(froudeNumber.value)]
    ]

    const resultsTitle = encodeTurkishChars(currentLanguage.value === 'tr' ? 'Sonuçlar' : 'Results')
    doc.text(resultsTitle, 14, doc.previousAutoTable.finalY + 15)
    
    doc.autoTable({
      startY: doc.previousAutoTable.finalY + 20,
      head: [[
        encodeTurkishChars(currentLanguage.value === 'tr' ? 'Parametre' : 'Parameter'),
        encodeTurkishChars(currentLanguage.value === 'tr' ? 'Değer' : 'Value')
      ]],
      body: resultData,
      theme: 'grid',
      headStyles: { 
        fillColor: [66, 135, 245],
        textColor: [255, 255, 255],
        halign: 'center',
        fontSize: 12,
        cellPadding: 4
      },
      bodyStyles: {
        halign: 'left',
        fontSize: 10,
        cellPadding: 4
      },
      columnStyles: {
        0: { cellWidth: 'auto' },
        1: { cellWidth: 'auto', halign: 'right' }
      },
      margin: { top: 10, left: 14, right: 14, bottom: 10 }
    })

    // Save the PDF with localized filename
    const filePrefix = encodeTurkishChars(currentLanguage.value === 'tr' ? 'hidrolik-hesap' : 'hydraulic-calculation')
    const filename = `${filePrefix}-${new Date().toISOString().split('T')[0]}.pdf`
    doc.save(filename)
  } catch (error) {
    console.error('Error generating PDF:', error)
    const errorMessage = currentLanguage.value === 'tr' 
      ? 'PDF olusturulurken bir hata olustu. Lutfen tekrar deneyin.'
      : 'Error generating PDF. Please try again.'
    alert(errorMessage)
  }
}

const copyToClipboard = async (parameter) => {
  let value
  // Get the correct value based on the parameter
  switch (parameter) {
    case 'area':
      value = area.value
      break
    case 'wettedPerimeter':
      value = wettedPerimeter.value
      break
    case 'hydraulicRadius':
      value = hydraulicRadius.value
      break
    case 'velocity':
      value = velocity.value
      break
    case 'discharge':
      value = discharge.value
      break
    case 'froudeNumber':
      value = froudeNumber.value
      break
    default:
      value = 0
  }

  // Format the number with 3 decimal places
  const formattedValue = typeof value === 'number' ? value.toFixed(3) : value

  try {
    await navigator.clipboard.writeText(formattedValue)
    // Optional: Show a temporary tooltip or notification that the value was copied
  } catch (err) {
    console.error('Failed to copy:', err)
  }
}

const saveCalculation = () => {
  const calculation = {
    timestamp: new Date().toISOString(),
    inputs: { ...inputs.value },
    results: {
      velocity: results.value.velocity,
      discharge: results.value.discharge,
      froudeNumber: results.value.froudeNumber,
      flowType: results.value.flowType,
      area: area.value,
      wettedPerimeter: wettedPerimeter.value,
      hydraulicRadius: hydraulicRadius.value
    }
  }
  calculationsStore.saveCalculation(calculation)
  router.push('/saved')
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
  grid-template-columns: 1fr 1fr;
  background: var(--surface-color);
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-md);
  overflow: hidden;
  border: 1px solid var(--border-color);
  min-height: 540px;
}

.input-panel, .results-panel {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  height: 100%;
}

h2 {
  font-size: 1.15rem;
  margin-bottom: 1rem;
  color: var(--text-primary);
  font-weight: 600;
  position: relative;
  display: inline-block;
  padding-bottom: 0.5rem;
}

h2::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 0.3px;
  background: linear-gradient(to right, 
    var(--primary-color),
    var(--accent-color));
  border-radius: 2px;
}

.input-panel {
  background: var(--surface-color);
  border-right: 1px solid var(--border-color);
  background-color:rgba(124, 92, 191, 0.03);
}

.input-group {
  margin-bottom: 1rem;
}

.input-group:last-child {
  margin-bottom: auto;
}

.input-group label {
  display: block;
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin-bottom: 0.375rem;
  font-weight: 500;
}

.results-panel {
  background-color:rgba(74, 144, 226, 0.03);
  display: flex;
  flex-direction: column;
}

.results-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin-bottom: auto;
}

.result-card {
  background: var(--surface-color);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-sm);
  padding: 0.4rem;
  position: relative;
  cursor: pointer;
  transition: all var(--transition-fast);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  z-index: 1;
}

.result-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg,
    rgba(74, 144, 226, 0.1),
    rgba(124, 92, 191, 0.1));
  opacity: 0;
  transition: opacity var(--transition-fast);
  z-index: -1;
}

.result-card:hover::before {
  opacity: 1;
}

.result-card:hover {
  transform: translateY(-1px);
  border-color: var(--primary-light);
  box-shadow: var(--shadow-sm);
}

.copy-tooltip {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  text-align: center;
  background: rgba(74, 144, 226, 0.9);
  color: white;
  padding: 0.25rem;
  font-size: 0.75rem;
  transform: translateY(100%);
  transition: transform var(--transition-fast);
  z-index: 2;
}

.result-card:hover .copy-tooltip {
  transform: translateY(0);
}

.result-label {
  color: var(--text-secondary);
  font-size: 0.85rem;
  margin-bottom: 0.375rem;
  font-weight: 500;
  text-align: center;
}

.result-value {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--primary-color);
  margin-bottom: 0.25rem;
  text-align: center;
}

.result-unit {
  font-size: 0.8rem;
  color: var(--text-tertiary);
  text-align: center;
}

.input-with-unit {
  position: relative;
  display: flex;
  align-items: center;
}

.input-with-unit input {
  width: 100%;
  padding: 0.5rem 2.5rem 0.5rem 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-sm);
  font-size: 0.875rem;
  background: var(--input-background);
  color: var(--text-primary);
  transition: all var(--transition-fast);
  height: 2.5rem;
}

.input-with-unit input:hover {
  border-color: var(--primary-light);
}

.input-with-unit input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 2px rgba(74, 144, 226, 0.1);
}

.unit {
  position: absolute;
  right: 0.75rem;
  color: var(--text-tertiary);
  font-size: 0.85rem;
  font-weight: 500;
  pointer-events: none;
  padding: 0.25rem 0.5rem;
  background: var(--input-background);
  border-radius: var(--border-radius-sm);
}

.button-container {
  display: flex;
  gap: 0.75rem;
  margin-top: 1rem;
  justify-content: flex-end;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.625rem 1.25rem;
  border-radius: var(--border-radius-sm);
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition-fast);
  border: none;
  height: 2.5rem;
  min-width: 120px;
  position: relative;
  overflow: hidden;
  background: var(--surface-color);
  color: var(--text-primary);
}

/* Specific styles for Save and PDF buttons */
.btn-save,
.btn-pdf {
  background: var(--surface-color);
  border: 1px solid var(--border-color);
  color: var(--text-primary);
  transition: background-color var(--transition-fast), border-color var(--transition-fast);
  transform: none !important;
}

.btn-save:hover,
.btn-pdf:hover {
  background: var(--input-background);
  border-color: var(--primary-light);
  transform: none !important;
  box-shadow: none;
}

.btn-icon {
  font-size: 1rem;
}

@media (max-width: 768px) {
  .calculator-grid {
    grid-template-columns: 1fr;
    min-height: auto;
  }

  .input-panel {
    border-right: none;
    border-bottom: 1px solid var(--border-color);
  }

  .results-grid {
    grid-template-columns: 1fr;
  }

  .calculator-container {
    padding: 0.75rem;
  }

  .input-panel, .results-panel {
    padding: 1rem;
  }

  .button-container {
    flex-direction: column;
    gap: 0.5rem;
  }

  .btn {
    width: 100%;
  }
}
</style>
