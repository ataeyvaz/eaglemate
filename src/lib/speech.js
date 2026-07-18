// Konuşma tanıma (dikte) soyutlaması.
// Native (telefon): @capacitor-community/speech-recognition — cihaz üstü,
// ücretsiz, Android/iOS'ta çalışır. Tarayıcı (dev): Web Speech API.
// Not: Android WebView tarayıcı Web Speech'i desteklemediği için telefonda
// mutlaka native plugin kullanılır.
import { Capacitor } from '@capacitor/core'

const isNative = Capacitor.isNativePlatform()
let Plugin = null
let webRec = null
let lastPartial = ''

async function getPlugin() {
  if (!isNative) return null
  if (!Plugin) {
    const mod = await import('@capacitor-community/speech-recognition')
    Plugin = mod.SpeechRecognition
  }
  return Plugin
}

function webSupported() {
  return typeof window !== 'undefined' && (window.SpeechRecognition || window.webkitSpeechRecognition)
}

export const speech = {
  isNative,

  async isAvailable() {
    const p = await getPlugin()
    if (p) {
      try {
        const res = await p.available()
        return !!res.available
      } catch {
        return false
      }
    }
    return !!webSupported()
  },

  async requestPermission() {
    const p = await getPlugin()
    if (p) {
      try {
        const res = await p.requestPermissions()
        return res.speechRecognition === 'granted'
      } catch {
        return false
      }
    }
    return true // web izni start sırasında sorulur
  },

  // Dinlemeyi başlatır. callbacks: { onPartial(text), onResult(text), onError(e) }
  async start(langCode, { onPartial, onResult, onError } = {}) {
    lastPartial = ''
    const p = await getPlugin()

    if (p) {
      try {
        await p.removeAllListeners()
        await p.addListener('partialResults', (data) => {
          const text = (data.matches && data.matches[0]) || ''
          lastPartial = text
          onPartial && onPartial(text)
        })
        await p.start({
          language: langCode,
          maxResults: 1,
          partialResults: true,
          popup: false,
        })
      } catch (e) {
        onError && onError(e)
      }
      return
    }

    // --- Web fallback ---
    if (!webSupported()) {
      onError && onError(new Error('Bu tarayıcıda konuşma tanıma desteklenmiyor.'))
      return
    }
    const Rec = window.SpeechRecognition || window.webkitSpeechRecognition
    webRec = new Rec()
    webRec.lang = langCode
    webRec.interimResults = true
    webRec.maxAlternatives = 1
    webRec.continuous = false
    webRec.onresult = (ev) => {
      let interim = ''
      let final = ''
      for (let i = ev.resultIndex; i < ev.results.length; i++) {
        const r = ev.results[i]
        if (r.isFinal) final += r[0].transcript
        else interim += r[0].transcript
      }
      if (final) {
        lastPartial = final
        onResult && onResult(final.trim())
      } else if (interim) {
        lastPartial = interim
        onPartial && onPartial(interim.trim())
      }
    }
    webRec.onerror = (ev) => onError && onError(ev.error || ev)
    try {
      webRec.start()
    } catch (e) {
      onError && onError(e)
    }
  },

  // Dinlemeyi durdurur ve son metni onResult ile döndürür (native).
  async stop(onResult) {
    const p = await getPlugin()
    if (p) {
      try {
        await p.stop()
        await p.removeAllListeners()
      } catch {
        /* yoksay */
      }
      onResult && onResult((lastPartial || '').trim())
      return
    }
    if (webRec) {
      try {
        webRec.stop()
      } catch {
        /* yoksay */
      }
      webRec = null
    }
  },
}
