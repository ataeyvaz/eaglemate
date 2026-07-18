# EagleMate — Claude Code Yol Haritası

Bu doküman, şu ana kadar Claude.ai üzerinde prototiplediğimiz web uygulamasını Claude Code ile gerçek, telefonda kurulu, arka planda alarm/bildirim verebilen bir uygulamaya dönüştürmek için fazlara ayrılmış bir plan içerir. Her faz bağımsız çalıştırılabilir; birini bitirmeden diğerine geçmek zorunda değilsiniz.

---

## 0. Mimari Kararlar (Claude Code'a başlamadan önce)

| Konu | Öneri | Neden |
|---|---|---|
| Arayüz | React + Vite | Hızlı geliştirme, mevcut prototiple uyumlu |
| Mobil paketleme | Capacitor (iOS + Android) | Tek kod tabanından native app; gerçek arka plan bildirimi/alarm için şart — saf web/PWA'da bu çalışmaz |
| Yerel veri | SQLite (Capacitor `@capacitor-community/sqlite`) veya basitçe `Preferences`/`Filesystem` plugin'i | Telefon kapalıyken bile veri kalıcı olur, internete bağımlı değil |
| Bildirim/Alarm | `@capacitor/local-notifications` | Telefon kilitliyken de gerçek bildirim/alarm/ses verir |
| Ses kaydı | `@capacitor/voice-recorder` veya native MediaRecorder + dosya sistemi | Dikte ve kitap özeti kayıtları için |
| Konuşma-metin (dikte) | Aşama 1'de tarayıcı Web Speech API (ücretsiz, cihaz üstü); ihtiyaç olursa Aşama 2'de bulut tabanlı bir konuşma tanıma servisi | Basit başlayıp gerektiğinde büyütmek için |
| Senkron / yedekleme | Opsiyonel: Supabase (Postgres + Auth + Storage) | Sadece oğlunuzun tek cihazda kullanacağıysa GEREKMEZ; siz de ilerlemesini uzaktan görmek isterseniz gerekir |
| aguilangevotr entegrasyonu | Kendi programınızdan kelime/cümle listesini JSON/CSV olarak dışa aktarma noktası tanımlamak | İki uygulamayı gevşek bağlamak (tam entegrasyon yerine veri alışverişi) bakımı kolaylaştırır |

**Önerilen ilk karar:** Tek cihaz + internetsiz çalışsın istiyorsanız Supabase'i atlayıp tamamen yerel (SQLite) gidin — daha basit, daha az bakım, gizlilik açısından da daha iyi. Siz de uzaktan takip etmek isterseniz Faz 6'da senkron ekleriz.

---

## Faz 1 — Temel Kabuk ve Görev/Antrenman/Zamanlayıcı (MVP)
**Hedef:** Bugüne kadar yaptığımız web prototipini gerçek bir Capacitor uygulamasına taşımak.

- Vite + React proje iskeleti kurulumu
- Capacitor entegrasyonu (`npx cap add android`, `npx cap add ios`)
- Mevcut UI'nin (Bugün / Antrenman / Zamanlayıcı / İlerleme) React bileşenlerine dönüştürülmesi
- `window.storage` yerine gerçek yerel depolama (SQLite veya Preferences plugin)
- `local-notifications` ile gerçek, arka planda çalışan alarm/hatırlatma
- Android + iOS'ta temel test (emülatör yeterli)

**Çıktı:** Telefona kurulabilen, günlük görev + antrenman + zamanlayıcı + gerçek alarmı olan çalışan bir uygulama.

---

## Faz 2 — Antrenman Programı İçeriği ve Mantığı
**Hedef:** Rastgele bir checklist yerine, yaşına uygun, ilerlemeli, sakatlanmayı önleyici gerçek bir program yapısı.

- Egzersiz kütüphanesi veri modeli: hareket paterni, seviye (1-4), set/tekrar, dinlenme süresi, teknik notu, "dikkat" uyarısı
- Isınma → ana hareketler → soğuma akışı otomatik oluşturulsun
- Haftalık program şablonu + dinlenme günü mantığı (üst üste aynı kas grubunu yormama)
- "Bu hafta iyi gitti, seviye atla" türünde otomatik ilerleme önerisi (streak'e bağlı)
- İsteğe bağlı: her hareket için kısa GIF/görsel referans

*(Egzersiz seçimi ve ilkeleri için aşağıdaki "Antrenman Çerçevesi" bölümüne bakın — bu, Claude Code'a içerik olarak aktarılacak ham malzeme.)*

---

## Faz 3 — Dil Öğrenme Modülü (aguilangevotr bağlantısı + Dikte)
**Hedef:** Önceki mesajda konuştuğumuz hibrit yaklaşım: hedef metni göster → dikte et → kendi kendine karşılaştır → aralıklı tekrar hatırlatması.

- aguilangevotr'dan kelime/cümle/senaryo verisini JSON olarak alacak basit bir içe aktarma ekranı
- Dikte ekranı: hedef cümle gösterimi + mikrofon kaydı + Web Speech API ile anlık metne çevirme + yan yana karşılaştırma
- Kayıtların (ses + metin) yerel saklanması
- Basit aralıklı tekrar planlayıcı: bugün öğrenileni 1 gün, 3 gün, 7 gün sonra tekrar sor
- Senaryo bazlı mini-quiz ekranı (çoktan seçmeli veya cümle tamamlama)

---

## Faz 4 — Kitap Günlüğü
**Hedef:** Okunan kitap için günlük sesli özet kaydı.

- Kitap ekleme (ad, yazar, sayfa/bölüm ilerlemesi)
- Günlük "bugün ne okudun" sesli kayıt ekranı
- Kayıtların kitaba göre gruplanıp listelenmesi, oynatma
- Opsiyonel: kayıttan otomatik metin çıkarma (transkript)

---

## Faz 5 — Bildirim/Alarm Native İnceliği
**Hedef:** Faz 1'de temel alarm çalışıyor olsa da, platform kısıtlarını netleştirme.

- Android "tam zamanlı alarm" izinleri (Android 12+ kısıtlamaları)
- iOS bildirim izinleri ve günlük bildirim limiti yönetimi
- Uygulama tamamen kapatılsa bile alarmın tetiklenmesi için arka plan görev testleri

---

## Faz 6 — (Opsiyonel) Ebeveyn Takip Paneli / Senkron
**Hedef:** Siz de ilerlemesini uzaktan görmek isterseniz.

- Supabase kurulumu (Auth + Postgres + Storage)
- Oğlunuzun cihazından verilerin buluta senkronu
- Sizin için ayrı, salt-okunur bir "ebeveyn görünümü" (web veya aynı app içinde ayrı giriş)

---

## Faz 7 — Cilalama ve Kurulum
- Uygulama ikonu, açılış ekranı, isim
- Gerçek cihazda (oğlunuzun telefonu) test
- Mağazadan yayın yerine muhtemelen "sideload" (Android APK doğrudan kurulum / iOS TestFlight) yeterli — aile içi kullanım için mağaza onayına gerek yok

---

## Claude Code'a İlk Prompt Önerisi

Faz 1'i başlatmak için Claude Code'da şöyle bir açılış istemi işe yarar:

> "Elimde [eaglemate.html] adında çalışan bir HTML prototip var. Bunu React + Vite + Capacitor kullanarak Android ve iOS'ta çalışan gerçek bir mobil uygulamaya dönüştürmek istiyorum. Yerel depolama için SQLite, alarmlar için @capacitor/local-notifications kullanalım. Önce proje iskeletini kur, sonra prototipteki 4 sekmeyi (Bugün, Antrenman, Zamanlayıcı, İlerleme) React bileşenlerine taşı."

Prototip dosyasını Claude Code projesine kopyalayıp referans olarak vermeniz yeterli.
