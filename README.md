# EagleMate

Günlük görev, antrenman, zamanlayıcı ve **gerçek arka plan alarmı** olan mobil uygulama.
Yol haritası için bkz. [`eaglemate-yol-haritasi.md`](./eaglemate-yol-haritasi.md).

Bu depo **Faz 1 (MVP)** + **Faz 2 (Antrenman program mantığı)** çıktısıdır:
`eaglemate.html` prototipi React + Vite + Capacitor tabanlı, telefona kurulabilen bir
uygulamaya taşınmış ve "rastgele checklist" olan antrenman sekmesi gerçek bir program
motoruna dönüştürülmüştür.

### Faz 2 — Antrenman programı

Profil: **11-13 yaş, futbol oynuyor, biraz kilolu, sadece vücut ağırlığı.**

- **Seviyeli (1-4) egzersiz kütüphanesi** (`src/data/program.js`): her hareketin paterni,
  set/tekrar reçetesi, dinlenme süresi, teknik notu ve "⚠️ dikkat" uyarısı var.
- **Isınma → ana hareketler → beceri → soğuma** akışı her gün otomatik üretilir.
- **Haftalık şablon + dinlenme günü mantığı**: kuvvet günleri arasına çeviklik/dinlenme
  serpiştirilerek aynı kas grubu üst üste yorulmaz.
- **Eklem dostu tasarım**: fazla kilo eklemleri zorladığı için yüksek sıçrama/pliometri yok;
  yumuşak iniş, kontrollü tempo, hareketlilik ön planda.
- **Futbol desteği**: hızlı ayak, shuffle, top üstü dokunuş, tek ayak denge.
- **Kişisel güvenlik**: gölge boksu (duruş, jab, cross, kombinasyon, serbest tur).
- **Otomatik seviye atlama**: mevcut seviyede yeterli antrenman tamamlanınca "seviye atla"
  önerisi (streak/tamamlama tabanlı); manuel seviye seçimi de var.

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
    TaskList.jsx        # "Bugün" serbest görev listesi
    Training.jsx        # Antrenman programı görünümü + seviye kontrolü (Faz 2)
    TimerTab.jsx        # Zamanlayıcı + günlük hatırlatmalar
    Progress.jsx        # 7 günlük performans grafiği
    Toast.jsx
  hooks/
    useEagleState.js    # kalıcı durum + görev/seans/alarm aksiyonları + streak/pct
    useTimer.js         # geri sayım zamanlayıcısı
  data/
    program.js          # egzersiz kütüphanesi + haftalık şablon + seans üreteci (Faz 2)
  lib/
    storage.js          # Preferences ⇄ localStorage soyutlaması
    notifications.js    # LocalNotifications ⇄ Web Notification soyutlaması
    date.js             # tarih/gün anahtarı yardımcıları
    sound.js            # zamanlayıcı bip sesi
```

## Sonraki fazlar

Faz 1 ve Faz 2 tamamlandı. Sıradaki: Faz 3 (dil/dikte modülü), Faz 4 (kitap günlüğü),
Faz 5 (native alarm inceliği), Faz 6 (opsiyonel ebeveyn takip paneli), Faz 7 (cilalama).
