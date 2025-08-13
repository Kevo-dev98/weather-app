import { createI18n } from 'vue-i18n'
import es from '../locales/es.json'
import en from '../locales/en.json'
import fr from '../locales/fr.json'

const stored = localStorage.getItem('gw:lang')
const envDefault = import.meta.env.VITE_DEFAULT_LANG || 'es'
const browser = navigator.language?.slice(0,2)
const fallback = 'en'

const locale = (stored || envDefault || browser || fallback) as 'en'|'es'|'fr'

export const i18n = createI18n({
  legacy: false,
  locale,
  fallbackLocale: fallback,
  messages: { en, es, fr }
})
