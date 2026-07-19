import { useEffect, useMemo, useState } from 'react'
import { parsePrescription } from '../data/program'
import ExerciseFigure from './ExerciseFigure'
import ExerciseVideoLink from './ExerciseVideoLink'
import { playBeep } from '../lib/sound'

function fmt(s) {
  const m = Math.floor(s / 60)
  return `${m}:${String(s % 60).padStart(2, '0')}`
}

function restSeconds(item) {
  const m = String(item.rest || '').match(/(\d+)\s*sn/)
  return m ? parseInt(m[1], 10) : 0
}

// Rehberli antrenman: seansın hareketlerini set set gezer; süreli hareketlerde
// geri sayım, tekrarlı hareketlerde "Set bitti", setler arası dinlenme sayacı.
export default function WorkoutRunner({ session, checked, onToggleItem, onExit }) {
  const steps = useMemo(
    () =>
      session.blocks.flatMap((b) =>
        b.items.map((it) => ({ ...it, block: b.title, presc: parsePrescription(it.detail) }))
      ),
    [session]
  )

  const [idx, setIdx] = useState(0)
  const [setNum, setSetNum] = useState(1)
  const [phase, setPhase] = useState('set') // 'set' | 'rest' | 'done'
  const [secs, setSecs] = useState(0)
  const [running, setRunning] = useState(false)

  const cur = steps[idx]
  const presc = cur?.presc || {}

  // Sete girerken sayaç/koşu durumunu ilkle
  useEffect(() => {
    if (phase !== 'set' || !cur) return
    if (presc.timed) {
      setSecs(presc.seconds)
      setRunning(false) // "Başla"yı bekle
    } else {
      setRunning(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idx, setNum, phase])

  // Geri sayım tik'i
  useEffect(() => {
    if (!running) return
    const id = setInterval(() => setSecs((s) => Math.max(0, s - 1)), 1000)
    return () => clearInterval(id)
  }, [running])

  // Sayaç bitince
  useEffect(() => {
    if (!running || secs !== 0) return
    setRunning(false)
    playBeep()
    if (phase === 'set') completeSet()
    else if (phase === 'rest') nextSet()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [secs, running, phase])

  function completeSet() {
    if (setNum < (presc.sets || 1)) {
      const rs = restSeconds(cur)
      if (rs > 0) {
        setPhase('rest')
        setSecs(rs)
        setRunning(true)
      } else {
        setSetNum((n) => n + 1)
        setPhase('set')
      }
    } else {
      finishExercise(true)
    }
  }

  function nextSet() {
    setSetNum((n) => n + 1)
    setPhase('set')
  }

  function finishExercise(markDone) {
    if (markDone && cur && !checked[cur.id]) {
      onToggleItem(cur.id, session.countableIds)
    }
    if (idx + 1 >= steps.length) {
      setPhase('done')
    } else {
      setIdx((i) => i + 1)
      setSetNum(1)
      setPhase('set')
    }
  }

  if (!cur && phase !== 'done') {
    return (
      <div className="card">
        <div className="empty">Bu seansta hareket yok.</div>
        <button className="btn-add" style={{ padding: '10px 18px' }} onClick={onExit}>
          Geri
        </button>
      </div>
    )
  }

  if (phase === 'done') {
    return (
      <div className="card" style={{ textAlign: 'center' }}>
        <div className="run-figure big">
          <ExerciseFigure pose="running" />
        </div>
        <h2 style={{ color: 'var(--green)' }}>Antrenman tamamlandı 🎉</h2>
        <p className="session-sub" style={{ marginBottom: 14 }}>
          Harika iş çıkardın! Tamamladığın hareketler işaretlendi.
        </p>
        <button className="btn-add" style={{ padding: '12px 20px' }} onClick={onExit}>
          Bitir
        </button>
      </div>
    )
  }

  const totalSets = presc.sets || 1
  const isRest = phase === 'rest'

  return (
    <>
      <div className="dict-topbar">
        <button className="link-btn" onClick={onExit}>
          ← Bitir
        </button>
        <span className="session-sub">
          {idx + 1} / {steps.length} · {cur.block}
        </span>
      </div>

      <div className="card" style={{ textAlign: 'center' }}>
        <div className="run-figure">
          <ExerciseFigure pose={cur.illo || 'standing'} />
        </div>
        <h2 style={{ color: '#fff', textTransform: 'none', letterSpacing: 0, fontSize: 20 }}>
          {cur.variant ? `${cur.name} — ${cur.variant}` : cur.name}
        </h2>
        <div className="run-setline">
          {Array.from({ length: totalSets }).map((_, i) => (
            <span key={i} className={`set-dot ${i < setNum - (isRest ? 0 : 1) ? 'done' : ''} ${!isRest && i === setNum - 1 ? 'cur' : ''}`} />
          ))}
          <span className="run-setnum">
            Set {Math.min(setNum, totalSets)} / {totalSets}
          </span>
        </div>

        {isRest ? (
          <>
            <div className="run-rest-label">Dinlen</div>
            <div className="run-timer rest">{fmt(secs)}</div>
            <button className="btn-reset run-btn" onClick={nextSet}>
              Geç →
            </button>
          </>
        ) : presc.timed ? (
          <>
            <div className="run-timer">{fmt(secs)}</div>
            {presc.perSide && <div className="session-sub">Her iki taraf</div>}
            {running ? (
              <button className="btn-pause run-btn" onClick={() => setRunning(false)}>
                Duraklat
              </button>
            ) : (
              <button className="btn-start run-btn" onClick={() => setRunning(true)}>
                {secs === presc.seconds ? '▶ Başla' : 'Devam'}
              </button>
            )}
          </>
        ) : (
          <>
            <div className="run-reps">
              {presc.reps ? (
                <>
                  <b>{presc.reps}</b> tekrar
                </>
              ) : (
                cur.detail
              )}
            </div>
            {presc.perSide && <div className="session-sub">Her iki taraf</div>}
            <button className="btn-start run-btn" onClick={completeSet}>
              Set bitti ✓
            </button>
          </>
        )}

        <div style={{ marginTop: 10 }}>
          <ExerciseVideoLink moveKey={cur.key} name={cur.name} label="▶ Bu hareketin videosu" />
        </div>

        <button className="run-skip" onClick={() => finishExercise(false)}>
          Bu hareketi geç
        </button>
      </div>

      {(cur.caution || cur.steps) && (
        <div className="card">
          {cur.caution && <div className="ex-caution">⚠️ {cur.caution}</div>}
          {cur.steps && (
            <ol className="ex-steps" style={{ marginTop: cur.caution ? 10 : 0 }}>
              {cur.steps.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ol>
          )}
        </div>
      )}
    </>
  )
}
