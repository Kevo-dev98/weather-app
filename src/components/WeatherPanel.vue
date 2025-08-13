<script setup lang="ts">
import type { GeoLocation } from "../types/weather";
import { useLocationsStore } from "../stores/useLocationsStore";
import { useSettingsStore } from "../stores/useSettingsStore";
import { computed, onBeforeUnmount, onMounted, watch } from "vue";
import { iconUrl } from "../services/weatherService";
import { fmtTemp, fmtWind, fmtVisibility, windDir  } from "../utils/format";
import { iconToKey } from "../utils/weatherIcons";
import { useI18n } from "vue-i18n";

const props = defineProps<{ selected: GeoLocation | null }>();
const { t } = useI18n();
const store = useLocationsStore();

const current = computed(() =>
  props.selected ? store.weatherCache[props.selected.id]?.current : null
);
const forecast = computed(() =>
  props.selected ? store.weatherCache[props.selected.id]?.forecast ?? [] : []
);

const settings = useSettingsStore()
const unit = computed(() => settings.unit)  

function reloadByUnit() {
  if (props.selected) store.ensureWeather(props.selected.id);
}

async function load() {
  if (props.selected) await store.ensureWeather(props.selected.id);
  console.log("WeatherPanel load", props);
}

onMounted(load);

onMounted(() => {
  window.addEventListener("gw:unitChanged", reloadByUnit as any);
});
onBeforeUnmount(() => {
  window.removeEventListener("gw:unitChanged", reloadByUnit as any);
});
watch(() => props.selected?.id, load);
</script>

<template>
  <div v-if="!selected">
    <h3>{{ t("panel.empty.title") }}</h3>
    <p class="small">{{ t("panel.empty.subtitle") }}</p>
  </div>

  <div v-else>
    <div v-if="current" class="mw-panel">
      <div class="mw-title">{{ t("panel.weatherOf") }}</div>
      <h2 class="mw-place">
        {{ selected?.name }}
        <span class="mw-country">{{ selected?.country }}</span>
      </h2>

      <div class="mw-now">
        <img
          v-if="current?.icon"
          :src="iconUrl(current.icon)"
          alt="icon"
          class="mw-icon"
        />
        <div class="mw-temp-box">
          <div class="mw-temp">
            {{ fmtTemp(current!.temp, unit) }}
          </div>
          <div class="mw-sub">
            <span class="mw-down">▼</span>
            {{ current ? Math.round(current.temp_min) : "—" }}°
            <span class="mw-sep">/</span>
            <span class="mw-up">▲</span>
            {{ current ? Math.round(current.temp_max) : "—" }}°
          </div>
        </div>
      </div>

      <ul class="mw-metrics" v-if="current">
        <li class="mw-metric">
          <span class="mw-label">{{ t("panel.pressure") }}</span>
          <span class="mw-value">{{ current.pressure }} hPa</span>
        </li>
        <li class="mw-metric">
          <span class="mw-label">{{ t("panel.humidity") }}</span>
          <span class="mw-value">{{ current.humidity }} %</span>
        </li>
        <li class="mw-metric">
          <span class="mw-label">{{ t("panel.visibility") }}</span>
          <span class="mw-value"
            >{{ fmtVisibility(current!.visibility, unit) }}</span
          >
        </li>
        <li class="mw-metric">
          <span class="mw-label">{{ t("panel.wind") }}</span>
          <span class="mw-value"
            >{{ fmtWind(current!.wind_speed, unit) }} ({{ windDir(current!.wind_deg) }})</span
          >
        </li>
      </ul>
    </div>

    <div class="card" style="margin-top: 12px">
      <h3 style="margin: 0 0 8px">{{ t("forecast.5.days") }}</h3>
      <div class="forecast">
        <div v-for="d in forecast" :key="d.date" class="forecast-item">
          <div style="font-weight: 600">{{ d.date }}</div>
          <img :src="iconUrl(d.icon)" alt="i" width="48" height="48" />
          <div class="small">{{ t(iconToKey(d.icon) || "") }}</div>
          <div>
            <b>{{ Math.round(d.temp_max) }}°</b> /
            <span class="small">{{ Math.round(d.temp_min) }}°</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Contenedor principal tipo “card” blanco */
.mw-panel {
  background: #fff;
  color: #111;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.18), 0 1px 2px rgba(0, 0, 0, 0.12);
  padding: 16px;
  max-width: 680px; /* para que recuerde al mock */
  margin: 0 auto; /* centrado */
}

/* Títulos */
.mw-title {
  font-size: 13px;
  font-weight: 600;
  color: #444;
  margin-bottom: 6px;
}
.mw-place {
  margin: 0 0 8px 0;
  font-size: 34px; /* tamaño grande como imagen */
  font-weight: 600;
  line-height: 1.15;
}
.mw-country {
  font-size: 0.7em;
  font-weight: 600;
  color: #666;
  margin-left: 6px;
}

/* Bloque “ahora” */
.mw-now {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 8px 0 6px;
}
.mw-icon {
  width: 42px;
  height: 42px;
  object-fit: contain;
}
.mw-temp-box {
  display: flex;
  flex-direction: column;
}
.mw-temp {
  font-size: 30px;
  font-weight: 700;
  line-height: 1;
}
.mw-unit {
  font-weight: 600;
  margin-left: 6px;
}
.mw-sub {
  font-size: 13px;
  color: #666;
  margin-top: 4px;
}
.mw-up {
  color: #2e7d32;
  font-weight: 600;
}
.mw-down {
  color: #c62828;
  font-weight: 600;
  margin-right: 4px;
}
.mw-sep {
  margin: 0 6px;
  color: #999;
}

/* Lista de métricas con separadores finos */
.mw-metrics {
  list-style: none;
  margin: 12px 0 0 0;
  padding: 0;
  border-top: 1px solid #eee;
}
.mw-metric {
  display: grid;
  grid-template-columns: 140px 1fr;
  gap: 8px;
  padding: 10px 0;
  border-bottom: 1px solid #eee;
}
.mw-label {
  font-weight: 700;
  color: #333;
}
.mw-value {
  text-align: left;
  color: #222;
}

/* Responsivo */
@media (max-width: 420px) {
  .mw-place {
    font-size: 28px;
  }
  .mw-metric {
    grid-template-columns: 120px 1fr;
  }
}
</style>
