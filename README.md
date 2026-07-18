# EagleMate

Günlük görev, antrenman, zamanlayıcı ve **gerçek arka plan alarmı** olan mobil uygulama.
Yol haritası için bkz. [`eaglemate-yol-haritasi.md`](./eaglemate-yol-haritasi.md).

Bu depo **Faz 1 (MVP)** + **Faz 2 (Antrenman program mantığı)** + **Faz 3 (Dil modülü)**
çıktısıdır: `eaglemate.html` prototipi React + Vite + Capacitor tabanlı, telefona
kurulabilen bir uygulamaya taşınmış; antrenman sekmesi gerçek bir program motoruna
dönüştürülmüş; dikte + aralıklı tekrar tabanlı bir dil öğrenme modülü eklenmiştir.

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

### Faz 3 — Dil öğrenme modülü

Diller: **İngilizce, Almanca, İspanyolca** (dil seçici; her dilin ayrı destesi ve tekrar takibi).

- **Dikte**: hedef cümle gösterilir → oğlun sesli söyler → konuşma tanıma metne çevirir →
  kelime kelime yan yana karşılaştırma + %eşleşme puanı.
- **Konuşma tanıma** (`src/lib/speech.js`): native'de `@capacitor-community/speech-recognition`
  (cihaz üstü, ücretsiz), tarayıcıda Web Speech API. Mikrofonsuz cihazda "yazarak kontrol"
  yedeği var. Karşılaştırma büyük/küçük harf, noktalama, aksan ve `ß`'ye karşı affedici.
- **Aralıklı tekrar** (`src/data/srs.js`): bir kart doğru bilinince 1 → 3 → 7 → 16 gün
  sonra tekrar sorulur; "zor" denilince ertesi güne döner. Ana ekranda "bugün tekrar
  edilecek" sayısı gösterilir.
- **Mini quiz**: Türkçe anlamı ver, 4 seçenekten doğru hedef cümleyi seç.
- **İçe aktarma** (`src/components/ImportDeck.jsx`): aguilangevotr'dan JSON ile kart
  aktarma. Biçim: `{ "language": "en", "cards": [{ "target", "translation", "type", "scenario" }] }`
  (veya doğrudan kart dizisi). Kart id'leri hedef metinden türetildiği için yeniden
  aktarımda tekrar durumu korunur.
- **Hazır desteler (aguilangevotr köprüsü)**: `scripts/import-from-aguilang.mjs`, komşu
  `aguilangevotr` projesinin çekirdek kelime verisini (A1, 5-dilli şema) EagleMate
  formatına çevirip `src/content/aguilang-{en,de,es}.json` üretir. Uygulamada "Hazır A1
  destesini yükle" ile tek dokunuşla eklenir (~570 kelime/dil). Büyük destede günde en
  fazla `DAILY_NEW_LIMIT` (10) yeni kart sunulur; gerisi aralıklı tekrarla açılır.

> **Android WebView notu:** Capacitor eklentileri **statik** import edilir (dinamik
> `import()` bazı WebView'larda açılışta takılıp "Yükleniyor…" ekranında donmaya yol
> açıyordu). Ayrıca ilk yüklemede 4 sn'lik güvence zamanlayıcısı var.

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
    Language.jsx        # Dil modülü ana ekranı (Faz 3)
    Dictation.jsx       # Dikte: konuşma tanıma + karşılaştırma (Faz 3)
    Quiz.jsx            # Çoktan seçmeli mini quiz (Faz 3)
    ImportDeck.jsx      # JSON kart içe aktarma (Faz 3)
    TimerTab.jsx        # Zamanlayıcı + günlük hatırlatmalar
    Progress.jsx        # 7 günlük performans grafiği
    Toast.jsx
  hooks/
    useEagleState.js    # kalıcı durum + görev/seans/dil/alarm aksiyonları + streak/pct
    useTimer.js         # geri sayım zamanlayıcısı
  data/
    program.js          # egzersiz kütüphanesi + haftalık şablon + seans üreteci (Faz 2)
    languages.js        # 3 dilin başlangıç desteleri + kart id/normalize (Faz 3)
    srs.js              # aralıklı tekrar planlayıcı (Faz 3)
  lib/
    storage.js          # Preferences ⇄ localStorage soyutlaması
    notifications.js    # LocalNotifications ⇄ Web Notification soyutlaması
    speech.js           # konuşma tanıma soyutlaması (native plugin ⇄ Web Speech) (Faz 3)
    compare.js          # dikte metin karşılaştırma (Faz 3)
    date.js             # tarih/gün anahtarı yardımcıları
    sound.js            # zamanlayıcı bip sesi
```

## Sonraki fazlar

Faz 1, 2 ve 3 tamamlandı. Sıradaki: Faz 4 (kitap günlüğü), Faz 5 (native alarm inceliği),
Faz 6 (opsiyonel ebeveyn takip paneli), Faz 7 (cilalama).
