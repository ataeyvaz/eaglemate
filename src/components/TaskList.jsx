import { useState } from 'react'

// "Bugün" ve "Antrenman" sekmelerinin ortak görev listesi bileşeni.
export default function TaskList({ listName, title, placeholder, items, onAdd, onToggle, onDelete }) {
  const [value, setValue] = useState('')

  function submit() {
    if (!value.trim()) return
    onAdd(listName, value)
    setValue('')
  }

  return (
    <div className="card">
      <h2>{title}</h2>
      <div className="row">
        <input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && submit()}
        />
        <button className="btn-add" onClick={submit}>
          Ekle
        </button>
      </div>

      {items.length === 0 ? (
        <div className="empty">Henüz görev yok. Yukarıdan ekle.</div>
      ) : (
        items.map((it) => (
          <div className="task" key={it.id}>
            <button
              className={`check ${it.done ? 'done' : ''}`}
              aria-label={it.done ? 'Tamamlandı olarak işaretle' : 'Tamamla'}
              onClick={() => onToggle(listName, it.id)}
            >
              {it.done ? '✓' : ''}
            </button>
            <div className={`task-text ${it.done ? 'done' : ''}`}>{it.text}</div>
            <button className="del" aria-label="Sil" onClick={() => onDelete(listName, it.id)}>
              ✕
            </button>
          </div>
        ))
      )}
    </div>
  )
}
