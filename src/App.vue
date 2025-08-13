<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import AppBar from './components/AppBar.vue'
import SavedLocations from './components/SavedLocations.vue'
import SearchCity from './components/SearchCity.vue'
import WeatherPanel from './components/WeatherPanel.vue'
import { useLocationsStore } from './stores/useLocationsStore'
const { t } = useI18n()
const store = useLocationsStore()
</script>

<template>
  <AppBar />
  <div class="container">
    <div class="grid">
      <section class="card section--saved">
        <h3>{{ t('saved.title') }}</h3>
        <p class="small">{{ t('saved.subtitle') }}</p>
        <SearchCity class="row" />
        <SavedLocations />
      </section>

      <section class="card section--panel">
        <WeatherPanel :selected="store.selected" />
      </section>
    </div>
  </div>
</template>
