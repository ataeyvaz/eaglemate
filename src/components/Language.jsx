import { useMemo, useState } from 'react'
import { LANGUAGES, LANG_ORDER } from '../data/languages'
import { dueCards, isLearned } from '../data/srs'
import Dictation from './Dictation'
import Quiz from './Quiz'
import ImportDeck from './ImportDeck'

// Dil sekmesi: dil seçimi + günün tekrarları + dikte / quiz / içe aktarma.
export default function Language({ lang, onSetLang, onRate, onImport }) {
  const [view, setView] = useState('home') // home | dictation | quiz | import

  const active = lang.activeLang
  const langMeta = LANGUAGES[active]
  const deck = lang.decks[active] || []

  const due = useMemo(() => dueCards(deck, lang.srs), [deck, lang.srs])
  const learnedCount = deck.filter((c) => isLearned(lang.srs[c.id])).length

  if (view === 'dictation') {
    // Tekrarı olan varsa onları, yoksa tüm desteyi çalış
    const queue = due.length ? due : deck
    return (
      <Dictation
        cards={queue}
        langMeta={langMeta}
        onRate={onRate}
        onExit={() => setView('home')}
      />
    )
  }
  if (view === 'quiz') {
    return <Quiz deck={deck} onExit={() => setView('home')} />
  }
  if (view === 'import') {
    return (
      <ImportDeck
        activeLang={active}
        onImport={onImport}
        onExit={() => setView('home')}
      />
    )
  }

  return (
    <>
      {/* Dil seçimi */}
      <div className="card">
        <h2>Dil</h2>
        <div className="lang-pills">
          {LANG_ORDER.map((code) => (
            <button
              key={code}
              className={`lang-pill ${active === code ? 'active' : ''}`}
              onClick={() => onSetLang(code)}
            >
              {LANGUAGES[code].flag} {LANGUAGES[code].label}
            </button>
          ))}
        </div>
      </div>

      {/* Durum */}
      <div className="card">
        <div className="session-head">
          <div>
            <h2 style={{ marginBottom: 4 }}>{langMeta.label} ilerlemen</h2>
            <p className="session-sub">
              {deck.length} kart · {learnedCount} pekişti
            </p>
          </div>
          <div className="session-badge">{due.length}</div>
        </div>
        <div className="badge-note">
          {due.length > 0
            ? `Bugün ${due.length} kart tekrar zamanı. Dikte ile başla!`
            : 'Bugünlük tekrar yok 👏 İstersen yine de pratik yapabilirsin.'}
        </div>
      </div>

      {/* Aksiyonlar */}
      <div className="card">
        <button
          className="btn-add mode-btn"
          disabled={deck.length === 0}
          onClick={() => setView('dictation')}
        >
          🎤 Dikte pratiği
          <span className="mode-sub">Hedef cümleyi sesli söyle, karşılaştır</span>
        </button>
        <button
          className="mode-btn ghost"
          disabled={deck.length < 4}
          onClick={() => setView('quiz')}
        >
          🎯 Mini quiz
          <span className="mode-sub">Çoktan seçmeli anlam eşleştirme</span>
        </button>
        <button className="mode-btn ghost" onClick={() => setView('import')}>
          📥 Kartları içe aktar
          <span className="mode-sub">aguilangevotr'dan JSON ile</span>
        </button>
      </div>
    </>
  )
}
