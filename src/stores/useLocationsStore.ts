import { defineStore } from "pinia";
import { ref, computed, watch } from "vue";
import type {
  GeoLocation,
  CurrentWeather,
  DailyForecast,
} from "../types/weather";
import { fetchCurrent, fetchForecast } from "../services/weatherService";

const withKey = (url: string) =>
  url + (url.includes("?") ? "&" : "?") + `appid=${KEY}`;
const BASE =
  import.meta.env.VITE_OWM_BASE_URL || "https://api.openweathermap.org";
const KEY = import.meta.env.VITE_OWM_KEY;

function useLocalStorage<T>(key: string, initial: T) {
  const v = ref<T>(initial) as any;
  try {
    const raw = localStorage.getItem(key);
    if (raw) v.value = JSON.parse(raw);
    else localStorage.setItem(key, JSON.stringify(initial));
  } catch {}
  watch(v, (val) => localStorage.setItem(key, JSON.stringify(val)), {
    deep: true,
  });
  return v as { value: T };
}

type Unit = "metric" | "imperial";

export const useLocationsStore = defineStore("locations", () => {
  const saved = useLocalStorage<GeoLocation[]>("gw:saved", []);
  const selectedId = ref<string | null>(null);

  const weatherCache = ref<
    Record<
      string,
      {
        current?: CurrentWeather;
        forecast?: DailyForecast[];
        ts: number;
        unit: Unit;
      }
    >
  >({});

  const selected = computed(
    () => saved.value.find((x) => x.id === selectedId.value) || null
  );

  function add(loc: GeoLocation) {
    if (!saved.value.find((x) => x.id === loc.id)) {
      saved.value = [...saved.value, loc];
    }
    selectedId.value = loc.id;
  }

  function remove(id: string) {
    const i = saved.value.findIndex((x) => x.id === id);
    if (i >= 0) saved.value.splice(i, 1);
    if (selectedId.value === id) selectedId.value = saved.value[0]?.id || null;
  }
  function select(id: string) {
    selectedId.value = id;
  }

  const getUnit = () => (localStorage.getItem("gw:unit") as Unit) || "metric";

  async function ensureWeather(id: string) {
    const unit = getUnit();
    const entry = weatherCache.value[id];
    const stale = !entry || Date.now() - entry.ts > 5 * 60 * 1000;
    const unitChanged = !entry || entry.unit !== unit;
    const loc = saved.value.find((x) => x.id === id);
    if (!loc) return;
    if (stale || unitChanged) {
      const [curr, fore] = await Promise.all([
        fetchCurrent(loc),
        fetchForecast(loc),
      ]);
      weatherCache.value = {
        ...weatherCache.value,
        [id]: { current: curr, forecast: fore, ts: Date.now(), unit },
      };
    }
  }

  async function updateCityNamesForLang(lang: "es" | "en" | "fr") {
    const updated = [];
    for (const loc of saved.value) {
      const url = withKey(
        `${BASE}/geo/1.0/reverse?lat=${loc.lat}&lon=${loc.lon}&limit=1`
      );
      const res = await fetch(url);
      if (!res.ok) continue;
      const data = await res.json();
      if (data[0]?.local_names?.[lang]) {
        loc.name = data[0].local_names[lang];
      }
      updated.push(loc);
    }
    saved.value = [...updated]; // forzar reactividad
  }

  function clearCache() {
    weatherCache.value = {};
  }

  if (!selectedId.value && saved.value.length) {
    selectedId.value = saved.value[0].id;
  }

  return {
    saved,
    selectedId,
    selected,
    add,
    remove,
    select,
    ensureWeather,
    clearCache,
    weatherCache,
    updateCityNamesForLang,
  };
});
