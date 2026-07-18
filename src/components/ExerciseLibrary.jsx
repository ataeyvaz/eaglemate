import { useMemo, useState } from 'react'
import { getLibrary, TOTAL_MOVE_COUNT } from '../data/program'
import ExerciseFigure from './ExerciseFigure'

// Tek kütüphane kartı: figür + isim + (varsa) 4 seviye + açılır tarif.
function LibraryItem({ item }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="lib-item">
      {item.illo && (
        <div className="ex-figure-wrap">
          <ExerciseFigure pose={item.illo} />
        </div>
      )}
      <div className="ex-body">
        <span className="ex-title">{item.name}</span>
        {item.pattern && <span className="ex-note">{item.pattern}</span>}
        {item.detail && <span className="ex-detail">{item.detail}</span>}

        {item.variants && (
          <div className="lib-levels">
            {item.variants.map((v) => (
              <div key={v.level} className="lib-level">
                <span className="lib-level-badge">{v.level}</span>
                <span className="lib-level-text">
                  {v.label} · <b>{v.detail}</b>
                </span>
              </div>
            ))}
          </div>
        )}

        {item.caution && <span className="ex-caution">⚠️ {item.caution}</span>}
        {item.steps && (
          <button className="ex-how" onClick={() => setOpen((o) => !o)}>
            {open ? '▾ Nasıl yapılır?' : '▸ Nasıl yapılır?'}
          </button>
        )}
        {open && item.steps && (
          <ol className="ex-steps">
            {item.steps.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ol>
        )}
      </div>
    </div>
  )
}

// Tüm egzersizleri kategoriye göre listeleyen ekran.
export default function ExerciseLibrary({ onExit }) {
  const sections = useMemo(() => getLibrary(), [])

  return (
    <>
      <div className="dict-topbar">
        <button className="link-btn" onClick={onExit}>
          ← Antrenman
        </button>
        <span className="session-sub">{TOTAL_MOVE_COUNT} hareket</span>
      </div>

      <div className="card">
        <h2>Tüm hareketler</h2>
        <p className="session-sub">
          Günlük seans bu havuzdan rotasyonla seçilir; burada hepsini seviyeleri ve
          tarifleriyle görebilirsin.
        </p>
      </div>

      {sections.map((sec) => (
        <div className="card" key={sec.title}>
          <h2>{sec.title}</h2>
          {sec.items.map((it) => (
            <LibraryItem key={it.key} item={it} />
          ))}
        </div>
      ))}
    </>
  )
}
