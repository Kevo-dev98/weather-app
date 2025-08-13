import type {
  CurrentWeather,
  DailyForecast,
  GeoLocation,
} from "../types/weather";

const BASE =
  import.meta.env.VITE_OWM_BASE_URL || "https://api.openweathermap.org";
const KEY = import.meta.env.VITE_OWM_KEY;
if (!KEY) console.warn("⚠️ Falta VITE_OWM_KEY en el .env");

// leemos la unidad e idioma actuales desde localStorage
const getUnit = () => localStorage.getItem("gw:unit") || "metric"; // 'metric'|'imperial'
const getLang = () =>
  (localStorage.getItem("gw:lang") || "es") as "es" | "en" | "fr";
const withKey = (url: string) =>
  url + (url.includes("?") ? "&" : "?") + `appid=${KEY}`;

export async function searchCity(q: string): Promise<GeoLocation[]> {
  if (!q.trim()) return [];
  const url = withKey(
    `${BASE}/geo/1.0/direct?q=${encodeURIComponent(q)}&limit=1`
  );
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Geo search failed: ${res.status}`);
  const data = await res.json();
  const lang = getLang();
  return (data || []).map((x: any) => {
    const localized =
      (x.local_names &&
        (x.local_names[lang] || x.local_names[lang.toUpperCase?.()])) ||
      x.name;

    const loc: GeoLocation = {
      id: `${x.lat},${x.lon}`,
      name: localized,
      country: x.country,
      lat: x.lat,
      lon: x.lon,
      state: x.state,
    };
    return loc;
  });
}

export async function fetchCurrent(loc: GeoLocation): Promise<CurrentWeather> {
  const url = withKey(
    `${BASE}/data/2.5/weather?lat=${loc.lat}&lon=${
      loc.lon
    }&units=${getUnit()}&lang=${getLang()}`
  );
  const res = await fetch(url);
  const d = await res.json();
  return {
    name: d.name,
    country: d.sys?.country,
    dt: d.dt,
    temp: d.main?.temp,
    temp_min: d.main?.temp_min,
    temp_max: d.main?.temp_max,
    pressure: d.main?.pressure,
    humidity: d.main?.humidity,
    visibility: d.visibility, // OWM devuelve en metros
    wind_speed: d.wind?.speed, // m/s (metric) o mph (imperial)
    wind_deg: d.wind?.deg,
    description: d.weather?.[0]?.description,
    icon: d.weather?.[0]?.icon,
  };
}

export async function fetchForecast(
  loc: GeoLocation
): Promise<DailyForecast[]> {
  const url = withKey(
    `${BASE}/data/2.5/forecast?lat=${loc.lat}&lon=${
      loc.lon
    }&units=${getUnit()}&lang=${getLang()}`
  );
  const res = await fetch(url);
  const data = await res.json();
  const groups: Record<string, any[]> = {};
  for (const item of data.list || []) {
    const date = (item.dt_txt || "").slice(0, 10);
    (groups[date] ??= []).push(item);
  }
  return Object.keys(groups)
    .slice(0, 5)
    .map((date) => {
      const arr = groups[date];
      let tmin = +Infinity,
        tmax = -Infinity;
      const iconCount: Record<string, number> = {};
      const descCount: Record<string, number> = {};
      for (const it of arr) {
        tmin = Math.min(tmin, it.main.temp_min);
        tmax = Math.max(tmax, it.main.temp_max);
        const ic = it.weather?.[0]?.icon;
        const ds = it.weather?.[0]?.description;
        if (ic) iconCount[ic] = (iconCount[ic] || 0) + 1;
        if (ds) descCount[ds] = (descCount[ds] || 0) + 1;
      }
      const icon =
        Object.entries(iconCount).sort((a, b) => b[1] - a[1])[0]?.[0] || "01d";
      const description =
        Object.entries(descCount).sort((a, b) => b[1] - a[1])[0]?.[0] || "";
      return { date, temp_min: tmin, temp_max: tmax, icon, description };
    });
}

export const iconUrl = (icon: string) =>
  `https://openweathermap.org/img/wn/${icon}@2x.png`;
