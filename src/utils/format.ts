export const fmtTemp = (t: number, unit: "metric" | "imperial") =>
  unit === "metric" ? `${Math.round(t)}°C` : `${Math.round(t)}°F`;

export const fmtWind = (speed: number, unit: "metric" | "imperial") =>
  unit === "metric" ? `${speed.toFixed(1)} m/s` : `${speed.toFixed(1)} mph`;

export const fmtVisibility = (meters: number, unit: "metric" | "imperial") => {
  if (unit === "metric") return `${(meters / 1000).toFixed(1)} km`;
  const miles = meters / 1609.344;
  return `${miles.toFixed(1)} mi`;
};

export const windDir = (deg: number) => {
  const dirs = [
    "N",
    "NNE",
    "NE",
    "ENE",
    "E",
    "ESE",
    "SE",
    "SSE",
    "S",
    "SSW",
    "SW",
    "WSW",
    "W",
    "WNW",
    "NW",
    "NNW",
  ];
  return dirs[Math.round(deg / 22.5) % 16];
};
