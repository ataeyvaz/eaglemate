import { useState } from 'react'
import { dayKey, weekdayShort } from '../lib/date'
import { computeStreak } from '../hooks/useEagleState'

// Son 7 günün performans grafiği + toplam istatistikler + isim.
export default function Progress({ log, name, onSetName }) {
  const [draft, setDraft] = useState(name || '')
  const days = []
  for (let i = 6; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    const entry = log[dayKey(d)] || { done: 0, total: 0 }
    const pct = entry.total > 0 ? Math.round((100 * entry.done) / entry.total) : 0
    days.push({ label: weekdayShort(d), pct })
  }

  const streak = computeStreak(log)
  const totalDoneEver = Object.values(log).reduce((s, e) => s + e.done, 0)

  return (
    <>
      <div className="card">
        <h2>Bu haftaki performans</h2>
        <div className="stat-grid">
          <div className="stat">
            <span className="num">{streak}</span>
            <span className="lbl">Günlük seri 🔥</span>
          </div>
          <div className="stat">
            <span className="num">{totalDoneEver}</span>
            <span className="lbl">Toplam tamamlanan görev</span>
          </div>
        </div>
        <div className="bars">
          {days.map((d, i) => (
            <div className="bar-col" key={i}>
              <div className="bar" style={{ height: 70 }}>
                <div className="bar-fill" style={{ height: `${d.pct}%` }} />
              </div>
              <div className="bar-day">{d.label}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="badge-note">
        İpucu: Bir günü %100 tamamlayınca seri artar. Seriyi bozmamak oyunun asıl hedefi!
      </div>

      {onSetName && (
        <div className="card">
          <h2>İsmin</h2>
          <div className="row" style={{ marginBottom: 0 }}>
            <input
              type="text"
              placeholder="Adın"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && onSetName(draft)}
            />
            <button className="btn-add" onClick={() => onSetName(draft)}>
              Kaydet
            </button>
          </div>
          <p className="session-sub" style={{ marginTop: 8 }}>
            Üstteki selamlamada bu isim görünür.
          </p>
        </div>
      )}
    </>
  )
}
