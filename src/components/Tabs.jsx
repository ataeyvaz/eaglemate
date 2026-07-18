import { useEffect, useRef } from 'react'

const TABS = [
  { key: 'today', label: 'Bugün' },
  { key: 'training', label: 'Antrenman' },
  { key: 'lang', label: 'Dil' },
  { key: 'books', label: 'Kitap' },
  { key: 'timer', label: 'Sayaç' },
  { key: 'progress', label: 'İlerleme' },
]

export default function Tabs({ active, onChange }) {
  const barRef = useRef(null)

  // Aktif sekmeyi görünür alana kaydır (çok sekme yatay taşınca).
  useEffect(() => {
    const bar = barRef.current
    if (!bar) return
    const el = bar.querySelector('.tab.active')
    if (el) el.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' })
  }, [active])

  return (
    <div className="tabs" role="tablist" ref={barRef}>
      {TABS.map((t) => (
        <button
          key={t.key}
          className={`tab ${active === t.key ? 'active' : ''}`}
          role="tab"
          aria-selected={active === t.key}
          onClick={() => onChange(t.key)}
        >
          {t.label}
        </button>
      ))}
    </div>
  )
}
