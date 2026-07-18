import { useEffect, useRef, useState } from 'react'
import { recorder } from '../lib/recorder'
import { audioStore } from '../lib/audioStore'

// "Bugün ne okudun?" sesli kayıt kartı.
// Kaydı alır → audioStore ile kalıcılaştırır → not ile birlikte onSave'e verir.
export default function BookRecorder({ bookId, onSave }) {
  const [supported, setSupported] = useState(true)
  const [recording, setRecording] = useState(false)
  const [elapsed, setElapsed] = useState(0)
  const [pending, setPending] = useState(null) // { audioRef, durationMs, mimeType }
  const [note, setNote] = useState('')
  const [busy, setBusy] = useState(false)
  const timerRef = useRef(null)

  useEffect(() => {
    recorder.canRecord().then(setSupported)
    return () => timerRef.current && clearInterval(timerRef.current)
  }, [])

  async function start() {
    const ok = await recorder.requestPermission()
    if (!ok) {
      setSupported(false)
      return
    }
    try {
      await recorder.start()
    } catch {
      setSupported(false)
      return
    }
    setPending(null)
    setNote('')
    setElapsed(0)
    setRecording(true)
    timerRef.current = setInterval(() => setElapsed((e) => e + 1), 1000)
  }

  async function stop() {
    clearInterval(timerRef.current)
    setRecording(false)
    setBusy(true)
    try {
      const res = await recorder.stop() // { recordDataBase64, msDuration, mimeType }
      const id = Date.now() + '_' + Math.round(Math.random() * 1e6)
      const audioRef = await audioStore.save(id, res.recordDataBase64, res.mimeType)
      setPending({ audioRef, durationMs: res.msDuration, mimeType: res.mimeType })
    } catch {
      setPending(null)
    } finally {
      setBusy(false)
    }
  }

  function save() {
    if (!pending) return
    onSave(bookId, { ...pending, note })
    setPending(null)
    setNote('')
    setElapsed(0)
  }

  function discard() {
    if (pending) audioStore.remove(pending.audioRef).catch(() => {})
    setPending(null)
    setNote('')
    setElapsed(0)
  }

  const mm = String(Math.floor(elapsed / 60)).padStart(2, '0')
  const ss = String(elapsed % 60).padStart(2, '0')

  return (
    <div className="card">
      <h2>Bugün ne okudun?</h2>

      {!supported ? (
        <div className="badge-note">
          Bu cihazda ses kaydı kullanılamıyor. Mikrofon izni verildiğinden emin ol.
        </div>
      ) : pending ? (
        <>
          <div className="badge-note" style={{ marginBottom: 10 }}>
            Kayıt hazır ✓ İstersen kısa bir not ekle, sonra kaydet.
          </div>
          <input
            type="text"
            placeholder="Not (isteğe bağlı) — örn. konu, sevdiği bölüm"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            style={{ width: '100%', marginBottom: 10 }}
          />
          <div className="rate-btns">
            <button className="rate again" onClick={discard}>
              Sil
            </button>
            <button className="rate good" onClick={save}>
              Kaydet
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="rec-timer">{recording ? `● ${mm}:${ss}` : '00:00'}</div>
          <button
            className={`mic-btn ${recording ? 'listening' : ''}`}
            onClick={recording ? stop : start}
            disabled={busy}
          >
            {busy ? 'İşleniyor…' : recording ? '■ Kaydı bitir' : '🎙️ Kayda başla'}
          </button>
        </>
      )}
    </div>
  )
}
