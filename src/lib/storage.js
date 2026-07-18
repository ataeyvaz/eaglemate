// Kalıcı yerel depolama katmanı.
// Native (telefon) tarafında Capacitor Preferences kullanır; tarayıcıda
// localStorage'a düşer. Böylece aynı kod hem `npm run dev` ile tarayıcıda
// hem de kurulu uygulamada çalışır.
//
// NOT: Eklenti STATİK import edilir. Dinamik import() bazı Android WebView'larda
// açılışta chunk yüklemesinde takılıp söz (promise) hiç sonuçlanmadan asılı
// kalabiliyor ve uygulama "Yükleniyor…" ekranında donuyordu.
import { Capacitor } from '@capacitor/core'
import { Preferences } from '@capacitor/preferences'

const isNative = Capacitor.isNativePlatform()

export const storage = {
  async get(key) {
    if (isNative) {
      const { value } = await Preferences.get({ key })
      return value ?? null
    }
    return localStorage.getItem(key)
  },

  async set(key, value) {
    if (isNative) {
      await Preferences.set({ key, value })
      return
    }
    localStorage.setItem(key, value)
  },

  async remove(key) {
    if (isNative) {
      await Preferences.remove({ key })
      return
    }
    localStorage.removeItem(key)
  },
}
