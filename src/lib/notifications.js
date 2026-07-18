// Gerçek, arka planda çalışan alarm/bildirim katmanı.
// Native tarafta Capacitor LocalNotifications kullanır: telefon kilitliyken,
// hatta uygulama kapalıyken bile her gün tekrarlanan bildirim/alarm verir.
// Tarayıcıda ise Web Notification API'sine düşer (yalnızca sayfa açıkken).
// NOT: Eklenti STATİK import edilir (dinamik import() Android WebView'da
// açılışta takılabildiği için).
import { Capacitor } from '@capacitor/core'
import { LocalNotifications } from '@capacitor/local-notifications'

const isNative = Capacitor.isNativePlatform()

async function getLN() {
  return isNative ? LocalNotifications : null
}

// "HH:MM" biçimindeki alarm için kararlı bir sayısal id üretir.
// Aynı alarm id'si tekrar planlanınca eskisini ezer (çift tetikleme olmaz).
export function notifIdFor(alarmId) {
  // alarmId Date.now()+Math.random() olabilir; 32-bit güvenli aralığa indir.
  const s = String(alarmId)
  let h = 0
  for (let i = 0; i < s.length; i++) {
    h = (h * 31 + s.charCodeAt(i)) | 0
  }
  return Math.abs(h) % 2000000000
}

export const notifications = {
  isNative,

  // Uygulama açılışında izin ister. Web'de Notification.requestPermission,
  // native'de LocalNotifications izin akışı.
  async requestPermission() {
    const ln = await getLN()
    if (ln) {
      const res = await ln.requestPermissions()
      return res.display === 'granted'
    }
    if (typeof Notification !== 'undefined' && Notification.permission === 'default') {
      try {
        const p = await Notification.requestPermission()
        return p === 'granted'
      } catch {
        return false
      }
    }
    return typeof Notification !== 'undefined' && Notification.permission === 'granted'
  },

  // Her gün belirtilen saatte tekrarlanan bir alarm planlar (native).
  // time: "HH:MM"
  async scheduleDaily(alarm) {
    const ln = await getLN()
    if (!ln) return // web'de zamanlama App.jsx'teki dakikalık kontrol yapar
    const [hour, minute] = alarm.time.split(':').map(Number)
    await ln.schedule({
      notifications: [
        {
          id: notifIdFor(alarm.id),
          title: 'EagleMate',
          body: alarm.label || 'Hatırlatma',
          schedule: { on: { hour, minute }, allowWhileIdle: true },
          sound: undefined, // varsayılan bildirim sesi
        },
      ],
    })
  },

  async cancel(alarmId) {
    const ln = await getLN()
    if (!ln) return
    await ln.cancel({ notifications: [{ id: notifIdFor(alarmId) }] })
  },

  // Tüm alarmları native zamanlayıcıyla yeniden senkronlar.
  async syncAll(alarms) {
    const ln = await getLN()
    if (!ln) return
    // Önce hepsini iptal et, sonra baştan planla (basit ve güvenli).
    const pending = await ln.getPending()
    if (pending.notifications.length) {
      await ln.cancel({ notifications: pending.notifications.map((n) => ({ id: n.id })) })
    }
    for (const a of alarms) {
      await this.scheduleDaily(a)
    }
  },

  // ---- Faz 5: durum teşhisi + tam-zamanlı alarm + test ----

  // Bildirim ve tam-zamanlı alarm durumunu döndürür.
  // display: 'granted'|'denied'|'prompt'... , exact: 'granted'|'denied'|'unsupported'
  async checkStatus() {
    const ln = await getLN()
    if (ln) {
      let display = 'prompt'
      let exact = 'unsupported'
      try {
        const p = await ln.checkPermissions()
        display = p.display
      } catch {
        /* yoksay */
      }
      try {
        const e = await ln.checkExactNotificationSetting()
        exact = e.exact_alarm // Android 12+; diğerlerinde granted/unsupported döner
      } catch {
        exact = 'unsupported'
      }
      return { platform: 'native', display, exact }
    }
    const webPerm =
      typeof Notification !== 'undefined' ? Notification.permission : 'unsupported'
    return { platform: 'web', display: webPerm, exact: 'unsupported' }
  },

  // Android tam-zamanlı alarm ayar ekranını açar (kullanıcı elle izin verir).
  async openExactAlarmSettings() {
    const ln = await getLN()
    if (!ln) return
    try {
      await ln.changeExactNotificationSetting()
    } catch {
      /* yoksay */
    }
  },

  // Test bildirimi: birkaç saniye sonra tetiklenir; kullanıcı bu sırada
  // uygulamayı kapatıp arka planda geldiğini görebilir.
  async sendTest(secondsFromNow = 8) {
    const ln = await getLN()
    if (ln) {
      const at = new Date(Date.now() + secondsFromNow * 1000)
      await ln.schedule({
        notifications: [
          {
            id: 999999,
            title: 'EagleMate testi',
            body: `Test bildirimi — ${secondsFromNow} sn sonra geldi ✓`,
            schedule: { at, allowWhileIdle: true },
          },
        ],
      })
      return true
    }
    this.fireWebNotification('Test bildirimi ✓ (web — yalnızca sayfa açıkken)')
    return typeof Notification !== 'undefined' && Notification.permission === 'granted'
  },

  // Web fallback: sayfa açıkken anlık bildirim.
  fireWebNotification(label) {
    if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
      try {
        new Notification('EagleMate', { body: label })
      } catch {
        /* yoksay */
      }
    }
  },
}
