const ICON_KEY_MAP: Record<string, string> = {
  '01': 'weather.clear_sky',
  '02': 'weather.few_clouds',
  '03': 'weather.scattered_clouds',
  '04': 'weather.broken_clouds',
  '09': 'weather.shower_rain',
  '10': 'weather.rain',
  '11': 'weather.thunderstorm',
  '13': 'weather.snow',
  '50': 'weather.mist',
}

export function iconToKey(icon?: string) {
  if (!icon) return undefined
  const base = icon.slice(0, 2)
  return ICON_KEY_MAP[base]
}

export function iconToEnText(icon?: string) {
  const key = iconToKey(icon)
  switch (key) {
    case 'weather.clear_sky': return 'clear sky'
    case 'weather.few_clouds': return 'few clouds'
    case 'weather.scattered_clouds': return 'scattered clouds'
    case 'weather.broken_clouds': return 'broken clouds'
    case 'weather.shower_rain': return 'shower rain'
    case 'weather.rain': return 'rain'
    case 'weather.thunderstorm': return 'thunderstorm'
    case 'weather.snow': return 'snow'
    case 'weather.mist': return 'mist'
    default: return ''
  }
}
