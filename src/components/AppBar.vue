<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { useSettingsStore } from "../stores/useSettingsStore";
import LangSelect from "./LangSelect.vue";
import { watch } from "vue";
const { t } = useI18n();
const i18n = useI18n();
const settings = useSettingsStore();

watch(
  () => settings.locale,
  (l) => {
    i18n.locale.value = l;
  }
);
</script>

<template>
  <header class="app-bar">
    <h1 class="app-bar__title">{{ t("app.title") }}</h1>
        <div class="unit-toggle" role="group" aria-label="units">
      <button
        class="unit-pill"
        :class="{ active: settings.unit==='metric' }"
        @click="settings.unit='metric'"
      >°C</button>
      <button
        class="unit-pill"
        :class="{ active: settings.unit==='imperial' }"
        @click="settings.unit='imperial'"
      >°F</button>
    </div>
    <LangSelect v-model="settings.locale" />
  </header>
</template>

<style scoped>
.app-bar {
  height: 56px;
  background: #1976d2;
  color: #fff;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0 12px;
}
.app-bar__title {
  font-size: 16px;
  font-weight: 600;
  margin: 0;
  flex: 1;
}
.icon-btn {
  background: transparent;
  border: none;
  color: white;
  font-size: 20px;
  cursor: pointer;
}
.lang-select {
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: #fff;
  border-radius: 8px;
  padding: 6px 8px;
}
.unit-toggle{ display:flex; background:rgba(255,255,255,.15); border:1px solid rgba(255,255,255,.35); border-radius:999px; padding:2px; margin-right:8px; }
.unit-pill{
  min-width:38px; padding:6px 10px; border-radius:999px; border:0; background:transparent; color:#fff; cursor:pointer;
}
.unit-pill.active{ background:#fff; color:#1976d2; font-weight:700; }
</style>
