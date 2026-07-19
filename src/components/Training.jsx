import { useMemo, useState } from 'react'
import { todayKey } from '../lib/date'
import {
  generateSession,
  buildCustomSession,
  completedTrainingDaysSince,
  LEVEL_UP_SESSIONS,
  TOTAL_MOVE_COUNT,
} from '../data/program'
import ExerciseFigure from './ExerciseFigure'
import ExerciseLibrary from './ExerciseLibrary'
import WorkoutRunner from './WorkoutRunner'

// Tek egzersiz satırı: şekil + işaretleme + "nasıl yapılır?" açılır tarifi.
function ExerciseItem({ item, checked, onToggle }) {
  const [open, setOpen] = useState(false)
  return (
    <div className={`ex-row ${checked ? 'done' : ''}`}>
      <div className="ex-main">
        <button
          className={`check ${checked ? 'done' : ''}`}
          aria-label={checked ? 'İşareti kaldır' : 'Tamamla'}
          onClick={onToggle}
        >
          {checked ? '✓' : ''}
        </button>
        {item.illo && (
          <div className="ex-figure-wrap">
            <ExerciseFigure pose={item.illo} />
          </div>
        )}
        <div className="ex-body">
          <span className="ex-title">
            {item.variant ? `${item.name} — ${item.variant}` : item.name}
          </span>
          <span className="ex-detail">
            {item.detail}
            {item.rest ? ` · dinlenme ${item.rest}` : ''}
          </span>
          {item.note && <span className="ex-note">{item.note}</span>}
          {item.caution && <span className="ex-caution">⚠️ {item.caution}</span>}
          {item.steps && (
            <button className="ex-how" onClick={() => setOpen((o) => !o)}>
              {open ? '▾ Nasıl yapılır?' : '▸ Nasıl yapılır?'}
            </button>
          )}
        </div>
      </div>
      {open && item.steps && (
        <ol className="ex-steps">
          {item.steps.map((s, i) => (
            <li key={i}>{s}</li>
          ))}
        </ol>
      )}
    </div>
  )
}

// Antrenman sekmesi: hazır (rotasyonlu) veya Kartal'ın kendi seçtiği program.
export default function Training({
  program,
  sessions,
  onToggleItem,
  onSetLevel,
  onSetMode,
  onToggleExercise,
}) {
  const [view, setView] = useState('session') // session | picker | run
  const dk = todayKey()
  const isCustom = program.mode === 'custom'
  const customKeys = program.customKeys || []

  const session = useMemo(
    () =>
      isCustom
        ? buildCustomSession(dk, program.level, customKeys)
        : generateSession(dk, program.level),
    [dk, program.level, isCustom, customKeys]
  )
  const checked = sessions?.[dk]?.checked || {}

  // Hareket listesi + seçim: her zaman seçilebilir. Hazır moddayken bir hareket
  // seçilince otomatik "Kendim seçerim" moduna geçer (seçim listeden çalışsın).
  function handleSelect(key) {
    if (!isCustom) onSetMode('custom')
    onToggleExercise(key)
  }
  if (view === 'picker') {
    return (
      <ExerciseLibrary
        selectable
        selectedKeys={customKeys}
        onToggleSelect={handleSelect}
        onExit={() => setView('session')}
      />
    )
  }
  if (view === 'run') {
    return (
      <WorkoutRunner
        session={session}
        checked={checked}
        onToggleItem={onToggleItem}
        onExit={() => setView('session')}
      />
    )
  }

  const doneCount = session.countableIds.filter((id) => checked[id]).length
  const total = session.countableIds.length

  const completedSince = completedTrainingDaysSince(sessions, program.levelSince)
  const canLevelUp = program.level < 4 && completedSince >= LEVEL_UP_SESSIONS
  const customEmpty = isCustom && session.moveCount === 0

  return (
    <>
      {/* Mod seçimi: hazır program / kendim seçerim */}
      <div className="card">
        <div className="mode-switch">
          <button
            className={`mode-tab ${!isCustom ? 'active' : ''}`}
            onClick={() => onSetMode('auto')}
          >
            Hazır program
          </button>
          <button
            className={`mode-tab ${isCustom ? 'active' : ''}`}
            onClick={() => onSetMode('custom')}
          >
            Kendim seçerim
          </button>
        </div>
      </div>

      {/* Seans başlığı */}
      <div className="card">
        <div className="session-head">
          <div>
            <h2 style={{ marginBottom: 4 }}>{session.title}</h2>
            <p className="session-sub">
              {session.est}
              {session.isTraining && ` · Seviye ${program.level}/4`}
            </p>
          </div>
          <div className={`session-badge ${session.isTraining ? '' : 'rest'}`}>
            {session.isTraining ? `${doneCount}/${total}` : 'Dinlenme'}
          </div>
        </div>

        {session.isTraining ? (
          <div className="session-bar">
            <div
              className="session-bar-fill"
              style={{ width: total ? `${(doneCount / total) * 100}%` : '0%' }}
            />
          </div>
        ) : (
          <div className="badge-note">
            Bugün kaslar onarılıyor — bu da programın parçası. İstersen aşağıdaki hafif
            esnemeleri yap. Futbol kursun bugünse, kurs zaten günün antrenmanı sayılır.
          </div>
        )}
      </div>

      {/* Rehberli antrenman başlat */}
      {total > 0 && (
        <div className="card">
          <button className="btn-start start-workout" onClick={() => setView('run')}>
            ▶ {session.isTraining ? 'Antrenmana başla' : 'Esnemeye başla'}
            <span className="mode-sub">Sayaç, set ve tekrar takibiyle adım adım</span>
          </button>
        </div>
      )}

      {/* Kendi seçim modu: hareket seç/düzenle */}
      {isCustom && (
        <div className="card">
          <button className="btn-add mode-btn" onClick={() => setView('picker')}>
            {customEmpty ? '➕ Hareketlerini seç' : '✏️ Hareketleri düzenle'}
            <span className="mode-sub">
              {customEmpty
                ? 'Tüm hareketler arasından kendi antrenmanını kur'
                : `${session.moveCount} hareket seçtin — değiştirmek için dokun`}
            </span>
          </button>
        </div>
      )}

      {/* Seviye atlama önerisi */}
      {canLevelUp && (
        <div className="card levelup">
          <h2 style={{ color: 'var(--green)' }}>🎉 Seviye atlamaya hazırsın!</h2>
          <p className="session-sub" style={{ marginBottom: 10 }}>
            Bu seviyede {completedSince} antrenmanı tamamladın. Hareketler artık daha
            zorlaşacak — kademeli güçleniyorsun.
          </p>
          <button className="btn-levelup" onClick={() => onSetLevel(program.level + 1)}>
            Seviye {program.level + 1}'e geç
          </button>
        </div>
      )}

      {/* Bloklar */}
      {customEmpty ? (
        <div className="card">
          <div className="empty">
            Henüz hareket seçmedin. Yukarıdaki “Hareketlerini seç” ile başla — ısınma ve
            soğuma senin için hazır.
          </div>
        </div>
      ) : (
        session.blocks.map((block) => (
          <div className="card" key={block.title}>
            <h2>{block.title}</h2>
            {block.items.map((it) => (
              <ExerciseItem
                key={it.id}
                item={it}
                checked={!!checked[it.id]}
                onToggle={() => onToggleItem(it.id, session.countableIds)}
              />
            ))}
          </div>
        ))
      )}

      {/* Tüm hareketler — görüntüle ve seç (seçince kendi programına geçer) */}
      {!isCustom && (
        <div className="card">
          <button className="mode-btn ghost" onClick={() => setView('picker')}>
            📚 Tüm hareketler ({TOTAL_MOVE_COUNT})
            <span className="mode-sub">
              Hepsini seviye ve tarifleriyle gör — beğendiğini + ile kendi programına ekle
            </span>
          </button>
        </div>
      )}

      {/* Program bilgi / seviye kontrolü */}
      <div className="card">
        <h2>Program</h2>
        <p className="session-sub" style={{ marginBottom: 10 }}>
          11-13 yaş · vücut ağırlığı · futbol destekli. Hareketler eklem dostu ve
          kademeli; zorlanırsan seviyeyi düşür, kolay gelirse yükselt.
        </p>
        <div className="level-ctl">
          <span>Seviye</span>
          {[1, 2, 3, 4].map((lv) => (
            <button
              key={lv}
              className={`level-pill ${program.level === lv ? 'active' : ''}`}
              onClick={() => onSetLevel(lv)}
            >
              {lv}
            </button>
          ))}
        </div>
        {program.level < 4 && (
          <p className="session-sub" style={{ marginTop: 10 }}>
            Otomatik seviye atlama: {Math.min(completedSince, LEVEL_UP_SESSIONS)}/
            {LEVEL_UP_SESSIONS} antrenman
          </p>
        )}
      </div>
    </>
  )
}
