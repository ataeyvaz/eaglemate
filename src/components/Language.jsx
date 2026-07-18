import { useMemo, useState } from 'react'
import { LANGUAGES, LANG_ORDER } from '../data/languages'
import { sessionQueue, isLearned } from '../data/srs'
import { READY_META } from '../data/readyDecks'
import Dictation from './Dictation'
import Quiz from './Quiz'
import ImportDeck from './ImportDeck'

// Dil sekmesi: dil seçimi + günün tekrarları + dikte / quiz / içe aktarma.
export default function Language({ lang, onSetLang, onRate, onImport, onLoadReady }) {
  const [view, setView] = useState('home') // home | dictation | quiz | import
  const [msg, setMsg] = useState(null)

  const active = lang.activeLang
  const langMeta = LANGUAGES[active]
  const deck = lang.decks[active] || []

  const { queue, reviews, news } = useMemo(
    () => sessionQueue(deck, lang.srs),
    [deck, lang.srs]
  )
  const learnedCount = deck.filter((c) => isLearned(lang.srs[c.id])).length
  const readyMeta = READY_META[active]
  // Hazır deste zaten yüklü mü? (deste boyutu hazır deste kadar veya fazlaysa)
  const readyLoaded = deck.length >= (readyMeta?.count || Infinity)

  function loadReady() {
    const n = onLoadReady(active)
    setMsg(`${langMeta.label} A1 destesi yüklendi (${n} kelime) ✓`)
    setTimeout(() => setMsg(null), 3000)
  }

  if (view === 'dictation') {
    return (
      <Dictation
        cards={queue.length ? queue : deck.slice(0, 10)}
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
      <ImportDeck activeLang={active} onImport={onImport} onExit={() => setView('home')} />
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
          <div className="session-badge">{queue.length}</div>
        </div>
        <div className="badge-note">
          {queue.length > 0
            ? `Bugün ${reviews} tekrar + ${news} yeni kart seni bekliyor. Dikte ile başla!`
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
      </div>

      {/* İçerik yönetimi */}
      <div className="card">
        <h2>Kelime desteleri</h2>
        {readyMeta && !readyLoaded && (
          <button className="mode-btn ghost" onClick={loadReady}>
            📦 Hazır {readyMeta.level} destesini yükle
            <span className="mode-sub">
              aguilangevotr'dan {readyMeta.count} kelime — tek dokunuşla
            </span>
          </button>
        )}
        {readyLoaded && (
          <div className="badge-note" style={{ marginBottom: 10 }}>
            Hazır {readyMeta.level} destesi yüklü ✓ ({deck.length} kart)
          </div>
        )}
        <button className="mode-btn ghost" onClick={() => setView('import')}>
          📥 JSON ile içe aktar
          <span className="mode-sub">aguilangevotr dışa aktarımı veya elle</span>
        </button>
        {msg && (
          <div className="badge-note" style={{ marginTop: 10, color: 'var(--green)' }}>
            {msg}
          </div>
        )}
      </div>
    </>
  )
}
