export interface GeoLocation {
  id: string
  name: string
  baseName?: string 
  country: string
  lat: number
  lon: number
  state?: string
  localNames?: Record<string, string> 
}

export interface CurrentWeather {
  name: string
  country: string
  dt: number
  temp: number
  temp_min: number
  temp_max: number
  pressure: number
  humidity: number
  visibility: number
  wind_speed: number
  wind_deg: number
  description: string
  icon: string
}

export interface DailyForecast {
  date: string // YYYY-MM-DD
  temp_min: number
  temp_max: number
  icon: string
  description: string
}
