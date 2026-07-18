import { useEffect, useRef, useState } from 'react'
import { speech } from '../lib/speech'
import { compareText } from '../lib/compare'

// Dikte ekranı: hedef cümleyi göster → oğlun sesli söyler → konuşma tanıma
// metne çevirir → yan yana karşılaştırma → kendi kendine değerlendirme (SRS).
export default function Dictation({ cards, langMeta, onRate, onExit }) {
  const [index, setIndex] = useState(0)
  const [listening, setListening] = useState(false)
  const [spoken, setSpoken] = useState('')
  const [result, setResult] = useState(null) // { words, score }
  const [supported, setSupported] = useState(true)
  const [showTranslation, setShowTranslation] = useState(false)
  const [manual, setManual] = useState('')
  const listeningRef = useRef(false)

  const card = cards[index]
  const done = index >= cards.length

  useEffect(() => {
    speech.isAvailable().then(setSupported)
  }, [])

  // Kart değişince durumu sıfırla
  useEffect(() => {
    setSpoken('')
    setResult(null)
    setShowTranslation(false)
    setManual('')
  }, [index])

  async function toggleListen() {
    if (listeningRef.current) {
      listeningRef.current = false
      setListening(false)
      await speech.stop((finalText) => {
        if (finalText) {
          setSpoken(finalText)
          setResult(compareText(card.target, finalText))
        }
      })
      return
    }
    const ok = await speech.requestPermission()
    if (!ok) {
      setSupported(false)
      return
    }
    setSpoken('')
    setResult(null)
    listeningRef.current = true
    setListening(true)
    await speech.start(langMeta.stt, {
      onPartial: (t) => setSpoken(t),
      onResult: (t) => {
        setSpoken(t)
        setResult(compareText(card.target, t))
        listeningRef.current = false
        setListening(false)
      },
      onError: () => {
        listeningRef.current = false
        setListening(false)
      },
    })
  }

  function checkManual() {
    if (!manual.trim()) return
    setSpoken(manual)
    setResult(compareText(card.target, manual))
  }

  function rateAndNext(res) {
    onRate(card.id, res)
    setIndex((i) => i + 1)
  }

  if (done) {
    return (
      <div className="card" style={{ textAlign: 'center' }}>
        <h2>Dikte bitti 🎉</h2>
        <p className="session-sub" style={{ marginBottom: 14 }}>
          {cards.length} kartı çalıştın. Yarın yeni tekrarlar seni bekliyor!
        </p>
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
          {index + 1} / {cards.length}
        </span>
      </div>

      <div className="card">
        {card.scenario && <div className="scenario-tag">{card.scenario}</div>}
        <div className="dict-target">{card.target}</div>

        {showTranslation ? (
          <div className="dict-translation">{card.translation}</div>
        ) : (
          <button className="link-btn" onClick={() => setShowTranslation(true)}>
            Anlamını göster
          </button>
        )}

        {/* Mikrofon */}
        {supported ? (
          <>
            <button
              className={`mic-btn ${listening ? 'listening' : ''}`}
              onClick={toggleListen}
            >
              {listening ? '● Dinliyorum… (durdur)' : '🎤 Söyle'}
            </button>
            {spoken && (
              <div className="dict-spoken">
                <span className="dict-spoken-label">Duyduğum:</span> {spoken}
              </div>
            )}
          </>
        ) : (
          <div className="manual-fallback">
            <div className="badge-note" style={{ marginBottom: 8 }}>
              Bu cihazda mikrofonla tanıma yok. Söylediğini buraya yazarak karşılaştırabilirsin.
            </div>
            <div className="row">
              <input
                type="text"
                placeholder="Söylediğini yaz…"
                value={manual}
                onChange={(e) => setManual(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && checkManual()}
              />
              <button className="btn-add" onClick={checkManual}>
                Kontrol
              </button>
            </div>
          </div>
        )}

        {/* Karşılaştırma sonucu */}
        {result && (
          <div className="dict-result">
            <div className="dict-score">
              Eşleşme: <b>%{result.score}</b>
            </div>
            <div className="dict-words">
              {result.words.map((w, i) => (
                <span key={i} className={w.ok ? 'w-ok' : 'w-bad'}>
                  {w.text}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Değerlendirme */}
      <div className="card">
        <p className="session-sub" style={{ marginBottom: 10 }}>
          Nasıl gitti? Buna göre tekrar zamanını ayarlarım.
        </p>
        <div className="rate-btns">
          <button className="rate again" onClick={() => rateAndNext('again')}>
            Zor · yarın tekrar
          </button>
          <button className="rate good" onClick={() => rateAndNext('good')}>
            İyi · ileri al
          </button>
        </div>
      </div>
    </>
  )
}
