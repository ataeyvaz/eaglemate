import { useEffect, useRef, useState } from 'react'
import { audioStore } from '../lib/audioStore'

function fmtDur(ms) {
  const s = Math.round((ms || 0) / 1000)
  const m = Math.floor(s / 60)
  return `${m}:${String(s % 60).padStart(2, '0')}`
}

function fmtDate(key) {
  const [y, m, d] = key.split('-')
  return `${d}.${m}.${y}`
}

// Tek bir sesli kaydın satırı: tarih, süre, oynat/duraklat, not, sil.
export default function RecordingRow({ rec, onDelete }) {
  const [src, setSrc] = useState(null)
  const [playing, setPlaying] = useState(false)
  const audioRef = useRef(null)

  useEffect(() => {
    let active = true
    audioStore
      .getSrc(rec.audioRef)
      .then((s) => active && setSrc(s))
      .catch(() => {})
    return () => {
      active = false
    }
  }, [rec.audioRef])

  function toggle() {
    const a = audioRef.current
    if (!a) return
    if (playing) {
      a.pause()
    } else {
      a.play().catch(() => {})
    }
  }

  return (
    <div className="rec-row">
      <button
        className={`rec-play ${playing ? 'playing' : ''}`}
        onClick={toggle}
        disabled={!src}
        aria-label={playing ? 'Duraklat' : 'Oynat'}
      >
        {playing ? '❚❚' : '▶'}
      </button>
      <div className="rec-body">
        <div className="rec-meta">
          {fmtDate(rec.date)} · {fmtDur(rec.durationMs)}
        </div>
        {rec.note && <div className="rec-note">{rec.note}</div>}
      </div>
      <button className="del" aria-label="Sil" onClick={() => onDelete(rec.id)}>
        ✕
      </button>
      {src && (
        <audio
          ref={audioRef}
          src={src}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onEnded={() => setPlaying(false)}
          preload="none"
        />
      )}
    </div>
  )
}
