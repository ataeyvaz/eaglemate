import { useState } from 'react'
import { fmtTime } from '../lib/date'
import { notifications } from '../lib/notifications'

const QUICK = [5, 10, 20, 25, 45]

// Zamanlayıcı + günlük hatırlatma (alarm) sekmesi.
export default function TimerTab({ timer, alarms, onAddAlarm, onDelAlarm }) {
  const [time, setTime] = useState('')
  const [label, setLabel] = useState('')

  function submitAlarm() {
    if (!time) return
    onAddAlarm(time, label)
    setTime('')
    setLabel('')
  }

  return (
    <>
      <div className="card">
        <h2>Zamanlayıcı</h2>
        <div className="timer-display">{fmtTime(timer.seconds)}</div>
        <div className="timer-btns">
          {timer.running ? (
            <button className="btn-pause" onClick={timer.pause}>
              Duraklat
            </button>
          ) : (
            <button className="btn-start" onClick={timer.start}>
              Başlat
            </button>
          )}
          <button className="btn-reset" onClick={timer.reset}>
            Sıfırla
          </button>
        </div>
        <div className="quick-times">
          {QUICK.map((m) => (
            <button key={m} className="qt" onClick={() => timer.setMinutes(m)}>
              {m} dk
            </button>
          ))}
        </div>
        <div className="badge-note">
          Zamanlayıcı uygulama açıkken çalışır. Belirli bir saatte gerçek alarm için aşağıdaki
          günlük hatırlatmaları kullan — bunlar telefon kilitliyken de çalar.
        </div>
      </div>

      <div className="card">
        <h2>Günlük hatırlatmalar</h2>
        <div className="row">
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            style={{ flex: '0 0 120px' }}
          />
          <input
            type="text"
            placeholder="Ne için? (örn. Antrenman zamanı)"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && submitAlarm()}
          />
          <button className="btn-add" onClick={submitAlarm}>
            Ekle
          </button>
        </div>

        {alarms.length === 0 ? (
          <div className="empty">Henüz hatırlatma yok.</div>
        ) : (
          alarms.map((a) => (
            <div className="alarm" key={a.id}>
              <div className="alarm-time">{a.time}</div>
              <div className="alarm-label">{a.label}</div>
              <button className="del" aria-label="Sil" onClick={() => onDelAlarm(a.id)}>
                ✕
              </button>
            </div>
          ))
        )}

        <div className="badge-note" style={{ marginTop: 10 }}>
          {notifications.isNative
            ? 'Hatırlatmalar her gün belirtilen saatte, telefon kilitliyken bile bildirim olarak çalar.'
            : 'Tarayıcıda hatırlatmalar yalnızca bu sayfa açıkken çalar. Gerçek arka plan alarmı için uygulamayı telefona kurmalısın.'}
        </div>
      </div>
    </>
  )
}
