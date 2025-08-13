<script setup lang="ts">
import { useLocationsStore } from '../stores/useLocationsStore'
import { useI18n } from 'vue-i18n'
const store = useLocationsStore()
const { t } = useI18n()
</script>

<template>
<div class="list" v-if="store.saved.length > 0">
  <div v-for="loc in store.saved" :key="loc.id" class="list-item">
    <div>
      <div><b>{{ loc.name }}</b> <span class="badge">({{ loc.country }})</span></div>
      <div class="small">{{ loc.lat.toFixed(2) }}, {{ loc.lon.toFixed(2) }}</div>
    </div>
    <div class="row">
      <button class="button" @click="store.select(loc.id)">{{ t('saved.view') }}</button>
      <button class="button" @click="store.remove(loc.id)">{{ t('saved.remove') }}</button>
    </div>
  </div>
</div>
<p v-else class="small">{{ t('saved.empty') }}</p>
</template>
