import { useCallback, useEffect, useState } from 'react'
import { notifications } from '../lib/notifications'

// Faz 5: bildirim/alarm sağlığı — izin durumu, Android tam-zamanlı alarm ayarı
// ve arka planda çalışmayı doğrulamak için test bildirimi.
function StatusBadge({ state }) {
  const map = {
    granted: { text: 'Verildi', cls: 'ok' },
    denied: { text: 'Kapalı', cls: 'bad' },
    prompt: { text: 'Sorulacak', cls: 'warn' },
    'prompt-with-rationale': { text: 'Sorulacak', cls: 'warn' },
    default: { text: 'Sorulacak', cls: 'warn' },
    unsupported: { text: 'Gerekmiyor', cls: 'muted' },
  }
  const m = map[state] || { text: state, cls: 'muted' }
  return <span className={`status-badge ${m.cls}`}>{m.text}</span>
}

export default function NotificationSettings() {
  const [status, setStatus] = useState(null)
  const [msg, setMsg] = useState(null)

  const refresh = useCallback(() => {
    notifications.checkStatus().then(setStatus).catch(() => {})
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  async function grant() {
    await notifications.requestPermission()
    refresh()
  }

  async function openExact() {
    await notifications.openExactAlarmSettings()
    // ayardan dönünce durum değişmiş olabilir
    setTimeout(refresh, 500)
  }

  async function test() {
    const ok = await notifications.sendTest(8)
    setMsg(
      ok
        ? notifications.isNative
          ? '🔔 Test bildirimi 8 sn sonra gelecek. İstersen şimdi uygulamayı kapat, arka planda gelecek.'
          : '🔔 Test bildirimi gönderildi (web — yalnızca sayfa açıkken).'
        : 'Bildirim izni kapalı görünüyor. Önce izin ver.'
    )
    setTimeout(() => setMsg(null), 6000)
  }

  if (!status) return null

  const displayOk = status.display === 'granted'
  const exactRelevant = status.platform === 'native' && status.exact !== 'unsupported'
  const exactOk = status.exact === 'granted'

  return (
    <div className="card">
      <h2>Bildirim & alarm</h2>

      <div className="setting-row">
        <div className="setting-label">
          Bildirim izni
          <span className="setting-hint">Alarmların çalması için gerekli</span>
        </div>
        <StatusBadge state={status.display} />
      </div>
      {!displayOk && status.platform !== 'web' && (
        <button className="rate good" style={{ width: '100%', marginBottom: 10 }} onClick={grant}>
          İzin ver
        </button>
      )}

      {exactRelevant && (
        <>
          <div className="setting-row">
            <div className="setting-label">
              Tam zamanlı alarm
              <span className="setting-hint">
                Alarmın tam dakikasında çalması için (Android 12+)
              </span>
            </div>
            <StatusBadge state={status.exact} />
          </div>
          {!exactOk && (
            <button
              className="rate again"
              style={{ width: '100%', marginBottom: 10 }}
              onClick={openExact}
            >
              Ayarları aç
            </button>
          )}
        </>
      )}

      <button
        className="mode-btn ghost"
        style={{ marginTop: 4 }}
        onClick={test}
        disabled={status.platform === 'web' && !displayOk}
      >
        🔔 Test bildirimi gönder
        <span className="mode-sub">Arka planda çalıştığını doğrula (8 sn)</span>
      </button>

      {msg && (
        <div className="badge-note" style={{ marginTop: 10 }}>
          {msg}
        </div>
      )}

      {status.platform === 'web' && (
        <div className="badge-note" style={{ marginTop: 10 }}>
          Tarayıcıda alarmlar yalnızca sayfa açıkken çalışır. Telefon kilitliyken bile
          çalan gerçek arka plan alarmı için uygulamayı telefona kur.
        </div>
      )}
    </div>
  )
}
