import { useState } from 'react'
import BookRecorder from './BookRecorder'
import RecordingRow from './RecordingRow'

// Kitap günlüğü (Faz 4): kitap ekleme + kitaba göre sesli özet kayıtları.
export default function Books({
  books,
  recordings,
  onAddBook,
  onUpdateProgress,
  onDelBook,
  onAddRecording,
  onDelRecording,
}) {
  const [selectedId, setSelectedId] = useState(null)
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [progress, setProgress] = useState('')

  const selected = books.find((b) => b.id === selectedId)

  function submitBook() {
    if (!title.trim()) return
    onAddBook(title, author, progress)
    setTitle('')
    setAuthor('')
    setProgress('')
  }

  // ---- Kitap detayı ----
  if (selected) {
    const recs = recordings.filter((r) => r.bookId === selected.id)
    return (
      <BookDetail
        book={selected}
        recs={recs}
        onBack={() => setSelectedId(null)}
        onUpdateProgress={onUpdateProgress}
        onDelBook={(id) => {
          onDelBook(id)
          setSelectedId(null)
        }}
        onAddRecording={onAddRecording}
        onDelRecording={onDelRecording}
      />
    )
  }

  // ---- Kitap listesi ----
  return (
    <>
      <div className="card">
        <h2>Kitap ekle</h2>
        <div className="row">
          <input
            type="text"
            placeholder="Kitap adı"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && submitBook()}
          />
        </div>
        <div className="row">
          <input
            type="text"
            placeholder="Yazar (isteğe bağlı)"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
          />
        </div>
        <div className="row">
          <input
            type="text"
            placeholder="İlerleme — örn. sayfa 45 / 3. bölüm"
            value={progress}
            onChange={(e) => setProgress(e.target.value)}
          />
          <button className="btn-add" onClick={submitBook}>
            Ekle
          </button>
        </div>
      </div>

      <div className="card">
        <h2>Kitaplarım</h2>
        {books.length === 0 ? (
          <div className="empty">Henüz kitap yok. Yukarıdan ekle, sonra sesli özet kaydet.</div>
        ) : (
          books.map((b) => {
            const count = recordings.filter((r) => r.bookId === b.id).length
            return (
              <button key={b.id} className="book-row" onClick={() => setSelectedId(b.id)}>
                <div className="book-body">
                  <div className="book-title">{b.title}</div>
                  <div className="book-sub">
                    {b.author ? b.author + ' · ' : ''}
                    {b.progress || 'ilerleme yok'} · {count} kayıt
                  </div>
                </div>
                <span className="book-arrow">›</span>
              </button>
            )
          })
        )}
      </div>
    </>
  )
}

// ---- Detay görünümü ----
function BookDetail({ book, recs, onBack, onUpdateProgress, onDelBook, onAddRecording, onDelRecording }) {
  const [prog, setProg] = useState(book.progress || '')

  return (
    <>
      <div className="dict-topbar">
        <button className="link-btn" onClick={onBack}>
          ← Kitaplar
        </button>
        <button className="link-btn" style={{ color: 'var(--red)' }} onClick={() => onDelBook(book.id)}>
          Kitabı sil
        </button>
      </div>

      <div className="card">
        <h2 style={{ color: '#fff', textTransform: 'none', letterSpacing: 0, fontSize: 20 }}>
          {book.title}
        </h2>
        {book.author && <p className="session-sub">{book.author}</p>}
        <div className="row" style={{ marginTop: 12 }}>
          <input
            type="text"
            placeholder="İlerleme — örn. sayfa 60"
            value={prog}
            onChange={(e) => setProg(e.target.value)}
          />
          <button className="btn-add" onClick={() => onUpdateProgress(book.id, prog.trim())}>
            Kaydet
          </button>
        </div>
      </div>

      <BookRecorder bookId={book.id} onSave={onAddRecording} />

      <div className="card">
        <h2>Kayıtlar</h2>
        {recs.length === 0 ? (
          <div className="empty">Henüz kayıt yok. Yukarıdan bugünkü özetini kaydet.</div>
        ) : (
          recs.map((r) => <RecordingRow key={r.id} rec={r} onDelete={onDelRecording} />)
        )}
      </div>
    </>
  )
}
