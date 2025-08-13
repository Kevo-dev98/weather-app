import { ref, watch } from 'vue'

export function useLocalStorage<T>(key: string, initial: T) {
  const state = ref<T>(initial) as { value: T }
  const raw = localStorage.getItem(key)
  if (raw) {
    try { state.value = JSON.parse(raw) } catch {}
  } else {
    localStorage.setItem(key, JSON.stringify(initial))
  }
  watch(state, (v) => localStorage.setItem(key, JSON.stringify(v)), { deep: true })
  return state
}
