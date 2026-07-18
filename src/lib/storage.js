// Kalıcı yerel depolama katmanı.
// Native (telefon) tarafında Capacitor Preferences kullanır; tarayıcıda
// localStorage'a düşer. Böylece aynı kod hem `npm run dev` ile tarayıcıda
// hem de kurulu uygulamada çalışır.
import { Capacitor } from '@capacitor/core'

let Preferences = null
const isNative = Capacitor.isNativePlatform()

async function getPrefs() {
  if (!isNative) return null
  if (!Preferences) {
    const mod = await import('@capacitor/preferences')
    Preferences = mod.Preferences
  }
  return Preferences
}

export const storage = {
  async get(key) {
    const prefs = await getPrefs()
    if (prefs) {
      const { value } = await prefs.get({ key })
      return value ?? null
    }
    return localStorage.getItem(key)
  },

  async set(key, value) {
    const prefs = await getPrefs()
    if (prefs) {
      await prefs.set({ key, value })
      return
    }
    localStorage.setItem(key, value)
  },

  async remove(key) {
    const prefs = await getPrefs()
    if (prefs) {
      await prefs.remove({ key })
      return
    }
    localStorage.removeItem(key)
  },
}
