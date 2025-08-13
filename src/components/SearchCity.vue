<script setup lang="ts">
import { ref } from "vue";
import { searchCity } from "../services/weatherService";
import { useLocationsStore } from "../stores/useLocationsStore";
import type { GeoLocation } from "../types/weather";
import { useI18n } from "vue-i18n";
const { t } = useI18n();

const q = ref("");
const loading = ref(false);
const error = ref<string | null>(null);
const results = ref<GeoLocation[]>([]);
const store = useLocationsStore();

async function onSearch() {
  const term = q.value.trim();
  if (!term || loading.value) return;

  loading.value = true;
  error.value = null;
  results.value = [];

  try {
    const res = await searchCity(term);
    if (res && res.length) {
      add(res[0]);
    } else {
      error.value = "No results";
    }
  } catch (e: any) {
    error.value = e?.message || "Search failed";
  } finally {
    loading.value = false;
    q.value = "";
  }
}

function add(loc: GeoLocation) {
  store.add(loc);
  q.value = "";
  results.value = [];
}
</script>

<template>
  <div>
    <div class="row" style="margin-bottom: 8px">
      <input
        class="input"
        v-model="q"
        :placeholder="t('search.placeholder')"
        @keyup.enter="onSearch"
      />
      <button class="button primary" @click="onSearch" :disabled="loading">
        {{ loading ? "…" : t("search.button") }}
      </button>
    </div>

    <p v-if="error" class="small">{{ error }}</p>

    <div v-if="results.length" class="list">
      <div v-for="r in results" :key="r.id" class="list-item">
        <div>
          <div>
            <b>{{ r.name }}</b>
            <span class="badge"
              >({{ r.country }}{{ r.state ? ", " + r.state : "" }})</span
            >
          </div>
          <div class="small">
            {{ r.lat.toFixed(3) }}, {{ r.lon.toFixed(3) }}
          </div>
        </div>
        <button class="button" @click="add(r)">{{ t("saved.view") }}</button>
      </div>
    </div>
  </div>
</template>
