import { useMemo, useState } from 'react'

// Verilen desteden çoktan seçmeli quiz üretir: Türkçe anlam gösterilir,
// 4 seçenek arasından doğru hedef cümle seçilir.
function buildQuestions(deck, count) {
  const pool = [...deck]
  // karıştır
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[pool[i], pool[j]] = [pool[j], pool[i]]
  }
  const picked = pool.slice(0, Math.min(count, pool.length))
  return picked.map((card) => {
    const distractors = deck
      .filter((c) => c.id !== card.id)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
    const options = [...distractors, card].sort(() => Math.random() - 0.5)
    return { card, options }
  })
}

export default function Quiz({ deck, onExit }) {
  const questions = useMemo(() => buildQuestions(deck, 8), [deck])
  const [index, setIndex] = useState(0)
  const [picked, setPicked] = useState(null)
  const [score, setScore] = useState(0)

  const q = questions[index]
  const done = index >= questions.length

  function choose(opt) {
    if (picked) return
    setPicked(opt.id)
    if (opt.id === q.card.id) setScore((s) => s + 1)
  }

  function next() {
    setPicked(null)
    setIndex((i) => i + 1)
  }

  if (done) {
    return (
      <div className="card" style={{ textAlign: 'center' }}>
        <h2>Quiz bitti 🎯</h2>
        <p className="session-sub" style={{ marginBottom: 6 }}>Skorun</p>
        <div className="timer-display" style={{ fontSize: 40 }}>
          {score} / {questions.length}
        </div>
        <button className="btn-add" style={{ padding: '10px 18px' }} onClick={onExit}>
          Bitir
        </button>
      </div>
    )
  }

  return (
    <>
      <div className="dict-topbar">
        <button className="link-btn" onClick={onExit}>
          ← Çık
        </button>
        <span className="session-sub">
          {index + 1} / {questions.length} · Skor {score}
        </span>
      </div>

      <div className="card">
        <p className="session-sub">Bunun karşılığı hangisi?</p>
        <div className="dict-target" style={{ fontSize: 24 }}>
          {q.card.translation}
        </div>

        <div className="quiz-options">
          {q.options.map((opt) => {
            let cls = 'quiz-opt'
            if (picked) {
              if (opt.id === q.card.id) cls += ' correct'
              else if (opt.id === picked) cls += ' wrong'
            }
            return (
              <button key={opt.id} className={cls} onClick={() => choose(opt)}>
                {opt.target}
              </button>
            )
          })}
        </div>

        {picked && (
          <button className="btn-add" style={{ width: '100%', padding: 12, marginTop: 12 }} onClick={next}>
            {index + 1 < questions.length ? 'Sonraki' : 'Sonucu gör'}
          </button>
        )}
      </div>
    </>
  )
}
