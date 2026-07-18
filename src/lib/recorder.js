// Sesli kayıt soyutlaması (kitap günlüğü — Faz 4).
// capacitor-voice-recorder hem native (Android/iOS) hem web'de çalışır.
// NOT: Eklenti STATİK import edilir (dinamik import() Android WebView'da
// açılışta takılabildiği için — bkz. storage.js notu).
import { VoiceRecorder } from 'capacitor-voice-recorder'

export const recorder = {
  async canRecord() {
    try {
      const r = await VoiceRecorder.canDeviceVoiceRecord()
      return !!r.value
    } catch {
      return false
    }
  },

  async requestPermission() {
    try {
      const r = await VoiceRecorder.requestAudioRecordingPermission()
      return !!r.value
    } catch {
      return false
    }
  },

  async start() {
    await VoiceRecorder.startRecording()
  },

  // Kaydı bitirir: { recordDataBase64, msDuration, mimeType }
  async stop() {
    const r = await VoiceRecorder.stopRecording()
    return r.value
  },
}
