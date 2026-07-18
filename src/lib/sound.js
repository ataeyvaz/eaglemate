// Tarayıcıda / web önizlemede zamanlayıcı ve alarm için kısa bir "bip" sesi.
// Native alarm sesini işletim sistemi bildirim sesi olarak verir; bu yalnızca
// uygulama açıkken zamanlayıcı bittiğinde ekstra geri bildirim içindir.
let audioCtx = null

export function playBeep() {
  try {
    if (!audioCtx) {
      const Ctx = window.AudioContext || window.webkitAudioContext
      if (!Ctx) return
      audioCtx = new Ctx()
    }
    for (let i = 0; i < 3; i++) {
      const o = audioCtx.createOscillator()
      const g = audioCtx.createGain()
      o.type = 'sine'
      o.frequency.value = 880
      g.gain.value = 0.001
      o.connect(g)
      g.connect(audioCtx.destination)
      const t = audioCtx.currentTime + i * 0.35
      g.gain.setValueAtTime(0.0001, t)
      g.gain.exponentialRampToValueAtTime(0.25, t + 0.02)
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.3)
      o.start(t)
      o.stop(t + 0.32)
    }
  } catch {
    /* ses yoksa sessizce geç */
  }
}
