<script setup>
import { computed } from 'vue'
import HydraulicCalculator from './components/HydraulicCalculator.vue'
import { RouterLink, RouterView } from 'vue-router'
import { useLanguageStore } from './stores/language'
import en from './locales/en'
import tr from './locales/tr'

const languageStore = useLanguageStore()
const currentLanguage = computed(() => languageStore.currentLanguage)
const t = { en, tr }

const toggleLanguage = () => {
  languageStore.setLanguage(currentLanguage.value === 'en' ? 'tr' : 'en')
}
</script>
<template>
  <div class="app-container">
    <header>
      <nav>
        <div class="logo">Hydraulic Calculator</div>
        <div class="nav-links">
          <RouterLink to="/" class="nav-link" active-class="active">{{ t[currentLanguage].nav.calculator }}</RouterLink>
          <RouterLink to="/saved" class="nav-link" active-class="active">{{ t[currentLanguage].nav.savedCalculations }}</RouterLink>
          <button class="lang-toggle" @click="toggleLanguage">
            {{ currentLanguage.toUpperCase() }}
          </button>
        </div>
      </nav>
    </header>

    <main>
      <RouterView />
    </main>
    <footer>
      <p> 2024 Hydraulic Calculator. Designed for State Hydraulic Works</p>
    </footer>
  </div>
</template>
<style>
:root {
  /* New modern color palette */
  --primary-color: #4a90e2;
  --primary-dark: #357abd;
  --primary-light: #6ba5e9;
  --accent-color: #7c5cbf;
  --accent-light: #9b83d1;
  --success-color: #34c759;
  --background-color: #f8fafc;
  --surface-color: #ffffff;
  --input-background: #f0f4f8;
  --text-primary: #2d3748;
  --text-secondary: #4a5568;
  --text-tertiary: #718096;
  --border-color: #e2e8f0;
  
  /* Shadows and effects */
  --border-radius: 12px;
  --border-radius-sm: 8px;
  --shadow-sm: 0 2px 4px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.07);
  --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);
  
  /* Transitions */
  --transition-fast: 0.15s ease;
  --transition-normal: 0.25s ease;
}
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
body {
  font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
  background-color: var(--background-color);
  color: var(--text-primary);
  line-height: 1.6;
  min-height: 100vh;
}
.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
header {
  background: var(--surface-color);
  box-shadow: var(--shadow-sm);
  padding: 0.75rem 0;
  position: sticky;
  top: 0;
  z-index: 100;
  border-bottom: 1px solid var(--border-color);
}
nav {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 2.75rem;
}
.nav-links {
  display: flex;
  gap: 1rem;
}
.nav-link {
  text-decoration: none;
  color: var(--text-secondary);
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: var(--border-radius-sm);
  transition: all var(--transition-fast);
  font-size: 0.9rem;
}
.nav-link:hover {
  background: var(--input-background);
  color: var(--primary-color);
}
.nav-link.active {
  color: var(--primary-color);
  background: linear-gradient(to right, rgba(74, 144, 226, 0.1), rgba(74, 144, 226, 0.05));
  font-weight: 600;
}
.logo {
  background: linear-gradient(135deg, var(--primary-color), var(--accent-color));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-size: 1.5rem;
  font-weight: 700;
}
main {
  flex: 1;
  padding: 1rem 0;
  background: var(--background-color);
}
footer {
  background: var(--surface-color);
  padding: 1rem;
  text-align: center;
  color: var(--text-tertiary);
  font-size: 0.85rem;
  box-shadow: var(--shadow-sm);
  border-top: 1px solid var(--border-color);
}
.lang-toggle {
  padding: 0.5rem 1rem;
  background: var(--surface-color);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-sm);
  color: var(--text-primary);
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition-fast);
  margin-left: 1rem;
}

.lang-toggle:hover {
  background: linear-gradient(to right, rgba(74, 144, 226, 0.1), rgba(74, 144, 226, 0.05));
  border-color: var(--primary-light);
}
/* Remove number input arrows */
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
input[type="number"] {
  -moz-appearance: textfield;
}
@media (max-width: 768px) {
  nav {
    padding: 0 1rem;
    height: auto;
  }
  .nav-links {
    gap: 0.5rem;
  }
  .nav-link {
    padding: 0.375rem 0.75rem;
    font-size: 0.85rem;
  }
  main {
    padding: 0.5rem 0;
  }
  .logo {
    font-size: 1.25rem;
  }
  footer {
    padding: 0.75rem;
    font-size: 0.8rem;
  }
}
</style>