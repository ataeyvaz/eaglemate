// Dış bağlantı açma (video linkleri için).
// Native: Capacitor Browser (in-app custom tab). Web: yeni sekme.
// Statik import (dinamik import() WebView'da takılabiliyor — bkz. storage.js).
import { Capacitor } from '@capacitor/core'
import { Browser } from '@capacitor/browser'

export async function openExternal(url) {
  if (!url) return
  if (Capacitor.isNativePlatform()) {
    try {
      await Browser.open({ url })
      return
    } catch {
      /* düşerse web yöntemini dene */
    }
  }
  try {
    window.open(url, '_blank', 'noopener,noreferrer')
  } catch {
    /* yoksay */
  }
}
