import { useMemo, useState } from 'react'
import { getLibrary, TOTAL_MOVE_COUNT, videoUrl } from '../data/program'
import ExerciseFigure from './ExerciseFigure'
import ExerciseVideoLink from './ExerciseVideoLink'
import { openExternal } from '../lib/openUrl'

// Tek kütüphane kartı: figür + isim + (varsa) 4 seviye + açılır tarif.
// selectable ise sağda seç/kaldır (+ / ✓) düğmesi gösterir.
function LibraryItem({ item, selectable, selected, onToggleSelect }) {
  const [open, setOpen] = useState(false)
  const canSelect = selectable && item.variants // yalnızca ana hareketler seçilebilir
  return (
    <div className={`lib-item ${selected ? 'picked' : ''}`}>
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
        <div className="ex-links">
          {item.steps && (
            <button className="ex-how" onClick={() => setOpen((o) => !o)}>
              {open ? '▾ Nasıl yapılır?' : '▸ Nasıl yapılır?'}
            </button>
          )}
          <ExerciseVideoLink name={item.name} />
        </div>
        {open && item.steps && (
          <ol className="ex-steps">
            {item.steps.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ol>
        )}
      </div>

      {canSelect && (
        <button
          className={`lib-pick ${selected ? 'on' : ''}`}
          aria-label={selected ? 'Listeden çıkar' : 'Listeye ekle'}
          onClick={() => onToggleSelect(item.key)}
        >
          {selected ? '✓' : '+'}
        </button>
      )}
    </div>
  )
}

// Tüm egzersizleri kategoriye göre listeler. selectable ise seçim modunda çalışır.
export default function ExerciseLibrary({
  onExit,
  selectable = false,
  selectedKeys = [],
  onToggleSelect,
}) {
  const sections = useMemo(() => getLibrary(), [])
  const selectedSet = useMemo(() => new Set(selectedKeys), [selectedKeys])

  return (
    <>
      <div className="dict-topbar">
        <button className="link-btn" onClick={onExit}>
          {selectable ? '✓ Bitti' : '← Antrenman'}
        </button>
        <span className="session-sub">
          {selectable ? `${selectedSet.size} seçili` : `${TOTAL_MOVE_COUNT} hareket`}
        </span>
      </div>

      <div className="card">
        <h2>{selectable ? 'Hareket seç' : 'Tüm hareketler'}</h2>
        <p className="session-sub" style={{ marginBottom: 10 }}>
          {selectable
            ? 'Yapmak istediklerini + ile ekle. Dengeli olması için en az bir bacak, bir üst vücut ve bir core hareketi seçmeni öneririm. Isınma ve soğuma her zaman eklenir.'
            : 'Her hareketin yanında "▶ Videoyu izle" ile o hareketin doğru tekniğini YouTube\'da açabilirsin.'}
        </p>
        <button
          className="ex-video block"
          onClick={() =>
            openExternal(videoUrl('çocuklar gençler için vücut ağırlığı tüm vücut antrenman', ''))
          }
        >
          ▶ Tüm vücut antrenman videosu (tümü sırayla)
        </button>
      </div>

      {sections.map((sec) => (
        <div className="card" key={sec.title}>
          <h2>{sec.title}</h2>
          {sec.items.map((it) => (
            <LibraryItem
              key={it.key}
              item={it}
              selectable={selectable}
              selected={selectedSet.has(it.key)}
              onToggleSelect={onToggleSelect}
            />
          ))}
        </div>
      ))}
    </>
  )
}
