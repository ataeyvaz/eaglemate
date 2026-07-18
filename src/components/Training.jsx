import { useMemo } from 'react'
import { todayKey } from '../lib/date'
import {
  generateSession,
  completedTrainingDaysSince,
  LEVEL_UP_SESSIONS,
} from '../data/program'

// Antrenman sekmesi: o günün programını üretir, öğeleri işaretletir, seviye
// ilerlemesini yönetir.
export default function Training({ program, sessions, onToggleItem, onSetLevel }) {
  const dk = todayKey()
  const session = useMemo(() => generateSession(dk, program.level), [dk, program.level])
  const checked = sessions?.[dk]?.checked || {}

  const doneCount = session.countableIds.filter((id) => checked[id]).length
  const total = session.countableIds.length

  const completedSince = completedTrainingDaysSince(sessions, program.levelSince)
  const canLevelUp = program.level < 4 && completedSince >= LEVEL_UP_SESSIONS

  return (
    <>
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
      {session.blocks.map((block) => (
        <div className="card" key={block.title}>
          <h2>{block.title}</h2>
          {block.items.map((it) => (
            <button
              key={it.id}
              className={`ex ${checked[it.id] ? 'done' : ''}`}
              onClick={() => onToggleItem(it.id, session.countableIds)}
            >
              <span className={`check ${checked[it.id] ? 'done' : ''}`}>
                {checked[it.id] ? '✓' : ''}
              </span>
              <span className="ex-body">
                <span className="ex-title">
                  {it.variant ? `${it.name} — ${it.variant}` : it.name}
                </span>
                <span className="ex-detail">
                  {it.detail}
                  {it.rest ? ` · dinlenme ${it.rest}` : ''}
                </span>
                {it.note && <span className="ex-note">{it.note}</span>}
                {it.caution && <span className="ex-caution">⚠️ {it.caution}</span>}
              </span>
            </button>
          ))}
        </div>
      ))}

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
