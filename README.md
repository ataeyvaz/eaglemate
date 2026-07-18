# EagleMate

Günlük görev, antrenman, zamanlayıcı ve **gerçek arka plan alarmı** olan mobil uygulama.
Yol haritası için bkz. [`eaglemate-yol-haritasi.md`](./eaglemate-yol-haritasi.md).

Bu depo **Faz 1 (MVP)** çıktısıdır: `eaglemate.html` prototipi React + Vite + Capacitor
tabanlı, telefona kurulabilen bir uygulamaya taşınmıştır.

## Teknoloji

- **React + Vite** — arayüz
- **Capacitor** — tek kod tabanından Android + iOS native app
- **@capacitor/preferences** — kalıcı yerel depolama (internetsiz, telefon kapalıyken bile kalıcı)
- **@capacitor/local-notifications** — telefon kilitliyken bile çalan günlük alarm/hatırlatma

Tarayıcıda geliştirirken depolama `localStorage`'a, bildirimler Web Notification API'sine düşer;
gerçek arka plan alarmı yalnızca telefona kurulu native uygulamada çalışır.

## Geliştirme (tarayıcıda)

```bash
npm install
npm run dev        # http://localhost:5173 — telefondan da aynı ağ üzerinden açılabilir
npm run build      # dist/ üretir
npm run preview    # üretim derlemesini yerelde önizle
```

## Telefona kurma (native)

Android için Android Studio, iOS için (Mac + Xcode) gerekir.

```bash
# 1) Native platformları ekle (bir kez)
npx cap add android
npx cap add ios

# 2) Her web değişikliğinden sonra:
npm run build
npx cap sync

# 3) Aç ve cihaza/emülatöre çalıştır
npm run open:android   # Android Studio açılır
npm run open:ios       # Xcode açılır (Mac)
```

### Android alarm izni notu (Faz 5'te detaylandırılacak)

Android 12+ üzerinde tam zamanlı alarmların telefon uykudayken tetiklenmesi için
`SCHEDULE_EXACT_ALARM` / `USE_EXACT_ALARM` izinleri gerekebilir. Şu an bildirimler
`allowWhileIdle` ile planlanıyor; ince ayar Faz 5'te yapılacak.

## Proje yapısı

```
src/
  main.jsx              # giriş noktası
  App.jsx               # sekme yönlendirme + web alarm kontrolü + bildirim izni
  styles.css            # prototipten birebir taşınan tema
  components/
    Header.jsx          # tamamlanma halkası + seri
    Tabs.jsx            # 4 sekme
    TaskList.jsx        # Bugün / Antrenman ortak liste
    TimerTab.jsx        # Zamanlayıcı + günlük hatırlatmalar
    Progress.jsx        # 7 günlük performans grafiği
    Toast.jsx
  hooks/
    useEagleState.js    # kalıcı durum + görev/alarm aksiyonları + streak/pct
    useTimer.js         # geri sayım zamanlayıcısı
  lib/
    storage.js          # Preferences ⇄ localStorage soyutlaması
    notifications.js    # LocalNotifications ⇄ Web Notification soyutlaması
    date.js             # tarih/gün anahtarı yardımcıları
    sound.js            # zamanlayıcı bip sesi
```

## Sonraki fazlar

Yol haritasındaki Faz 2–7 (antrenman program mantığı, dil/dikte modülü, kitap günlüğü,
native alarm inceliği, opsiyonel ebeveyn takip paneli, cilalama) henüz yapılmadı.
