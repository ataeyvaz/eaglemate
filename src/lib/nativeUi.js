// Faz 7: native arayüz cilası — durum çubuğu ve açılış ekranı.
// Statik import (dinamik import() WebView'da takılabiliyor — bkz. storage.js).
import { Capacitor } from '@capacitor/core'
import { StatusBar, Style } from '@capacitor/status-bar'
import { SplashScreen } from '@capacitor/splash-screen'

// Uygulama hazır olunca çağrılır: koyu tema durum çubuğu + splash'ı gizle.
export async function initNativeUi() {
  if (!Capacitor.isNativePlatform()) return
  try {
    // Koyu arka planda açık renk içerik (Style.Light = açık ikon/yazı).
    await StatusBar.setStyle({ style: Style.Light })
    await StatusBar.setBackgroundColor({ color: '#0B1120' })
  } catch {
    /* iOS'ta setBackgroundColor yok vb. — yoksay */
  }
  try {
    await SplashScreen.hide()
  } catch {
    /* yoksay */
  }
}
