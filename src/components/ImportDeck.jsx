import { useState } from 'react'
import { LANGUAGES, LANG_ORDER } from '../data/languages'

const TEMPLATE = `{
  "language": "en",
  "cards": [
    { "target": "Good morning", "translation": "Günaydın", "type": "sentence", "scenario": "Selamlaşma" },
    { "target": "Book", "translation": "Kitap", "type": "word" }
  ]
}`

// aguilangevotr'dan (veya elle) JSON içe aktarma ekranı.
export default function ImportDeck({ activeLang, onImport, onExit }) {
  const [lang, setLang] = useState(activeLang)
  const [text, setText] = useState('')
  const [msg, setMsg] = useState(null) // { ok, text }

  function doImport() {
    let parsed
    try {
      parsed = JSON.parse(text)
    } catch {
      setMsg({ ok: false, text: 'Geçersiz JSON. Biçimi kontrol et.' })
      return
    }
    // İki biçim kabul edilir: { language, cards:[...] } veya doğrudan [...]
    let code = lang
    let cards = parsed
    if (!Array.isArray(parsed)) {
      cards = parsed.cards
      if (parsed.language && LANGUAGES[parsed.language]) code = parsed.language
    }
    if (!Array.isArray(cards)) {
      setMsg({ ok: false, text: 'Kart listesi bulunamadı (cards dizisi bekleniyor).' })
      return
    }
    const n = onImport(code, cards)
    if (n === 0) {
      setMsg({ ok: false, text: 'Hiç geçerli kart yok (her kartta target + translation olmalı).' })
    } else {
      setMsg({ ok: true, text: `${LANGUAGES[code].label} destesine ${n} kart aktarıldı ✓` })
      setText('')
    }
  }

  return (
    <>
      <div className="dict-topbar">
        <button className="link-btn" onClick={onExit}>
          ← Çık
        </button>
        <span className="session-sub">Kart içe aktar</span>
      </div>

      <div className="card">
        <h2>Hedef dil</h2>
        <div className="lang-pills">
          {LANG_ORDER.map((code) => (
            <button
              key={code}
              className={`lang-pill ${lang === code ? 'active' : ''}`}
              onClick={() => setLang(code)}
            >
              {LANGUAGES[code].flag} {LANGUAGES[code].label}
            </button>
          ))}
        </div>
        <p className="session-sub" style={{ marginTop: 8 }}>
          JSON içinde "language" belirtilmişse o dil kullanılır; yoksa seçtiğin dil.
          İçe aktarma o dilin destesinin yerine geçer.
        </p>
      </div>

      <div className="card">
        <h2>JSON verisi</h2>
        <textarea
          className="import-area"
          placeholder={TEMPLATE}
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={10}
        />
        <div className="rate-btns" style={{ marginTop: 10 }}>
          <button className="rate again" onClick={() => setText(TEMPLATE)}>
            Örnek biçimi doldur
          </button>
          <button className="rate good" onClick={doImport}>
            İçe aktar
          </button>
        </div>
        {msg && (
          <div
            className="badge-note"
            style={{ marginTop: 10, color: msg.ok ? 'var(--green)' : 'var(--red)' }}
          >
            {msg.text}
          </div>
        )}
      </div>

      <div className="card">
        <h2>Biçim</h2>
        <p className="session-sub">
          Her kart: <b>target</b> (öğrenilen dildeki metin), <b>translation</b> (Türkçe
          karşılık), isteğe bağlı <b>type</b> ("word"/"sentence") ve <b>scenario</b>.
          aguilangevotr'dan bu biçimde dışa aktarım tanımlayabilirsin.
        </p>
      </div>
    </>
  )
}
