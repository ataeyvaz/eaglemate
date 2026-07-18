// Üst başlık: tamamlanma yüzdesi halkası + seri sayısı.
export default function Header({ pct, streak }) {
  const r = 30
  const circ = 2 * Math.PI * r
  const offset = circ - (pct / 100) * circ

  return (
    <div className="top">
      <div className="ring-wrap">
        <svg width="74" height="74">
          <circle className="ring-bg" cx="37" cy="37" r={r} />
          <circle
            className="ring-fg"
            cx="37"
            cy="37"
            r={r}
            strokeDasharray={circ}
            strokeDashoffset={offset}
          />
        </svg>
        <div className="ring-label">%{pct}</div>
      </div>
      <div className="title-block">
        <h1 className="display">EagleMate</h1>
        <p>🔥 {streak} günlük seri</p>
      </div>
    </div>
  )
}
