import type { GeoLocation } from '../types/weather'
export type Lang = 'es'|'en'|'fr'
export const resolvePlaceName = (loc: GeoLocation, lang: Lang) =>
  loc.localNames?.[lang] ?? loc.name
