import { defineStore } from "pinia";
import { ref, watch } from "vue";

export type Lang = "es" | "en" | "fr";
export type Unit = "metric" | "imperial"; // metric = °C + m/s, imperial = °F + mph

export const useSettingsStore = defineStore("settings", () => {
  // idioma
  const locale = ref<Lang>((localStorage.getItem("gw:lang") as Lang) || "es");
  watch(locale, (v) => localStorage.setItem("gw:lang", v), { immediate: true });

  // unidad
  const unit = ref<Unit>((localStorage.getItem("gw:unit") as Unit) || "metric");
  watch(
    unit,
    (v) => {
      localStorage.setItem("gw:unit", v);
      // avisa para que se recarguen los datos si hace falta
      window.dispatchEvent(new CustomEvent("gw:unitChanged", { detail: v }));
    },
    { immediate: true }
  );

  function toggleUnit() {
    unit.value = unit.value === "metric" ? "imperial" : "metric";
  }

  // watch(locale, (newLang) => {
  //   const locationsStore = useLocationsStore();
  //   locationsStore.updateCityNamesForLang(newLang as "es" | "en" | "fr");
  // });

  return { locale, unit, toggleUnit };
});
