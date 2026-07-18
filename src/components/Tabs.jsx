const TABS = [
  { key: 'today', label: 'Bugün' },
  { key: 'training', label: 'Antrenman' },
  { key: 'timer', label: 'Zamanlayıcı' },
  { key: 'progress', label: 'İlerleme' },
]

export default function Tabs({ active, onChange }) {
  return (
    <div className="tabs" role="tablist">
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
