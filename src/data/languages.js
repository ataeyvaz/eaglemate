// EagleMate — Dil öğrenme modülü verisi (Faz 3)
// Üç dil: İngilizce, Almanca, İspanyolca. Konuşma tanıma dil kodu her dil için
// tanımlı. Başlangıç desteleri yeni başlayan / çocuk dostu (11-13 yaş).
// Gerçek içerik aguilangevotr'dan JSON ile içe aktarılabilir (bkz. ImportDeck).

export const LANGUAGES = {
  en: { code: 'en', label: 'İngilizce', flag: '🇬🇧', stt: 'en-US' },
  de: { code: 'de', label: 'Almanca', flag: '🇩🇪', stt: 'de-DE' },
  es: { code: 'es', label: 'İspanyolca', flag: '🇪🇸', stt: 'es-ES' },
}

export const LANG_ORDER = ['en', 'de', 'es']

// Kararlı kart id'si: aynı hedef metin her zaman aynı id'yi üretir; böylece
// yeniden içe aktarımda aralıklı tekrar durumu (SRS) korunur.
export function cardId(lang, target) {
  const s = `${lang}|${target}`
  let h = 0
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0
  return `${lang}:${Math.abs(h).toString(36)}`
}

// Ham kart nesnesini normalize eder + id ekler.
export function normalizeCard(lang, raw) {
  const target = String(raw.target || '').trim()
  const translation = String(raw.translation || '').trim()
  if (!target || !translation) return null
  return {
    id: cardId(lang, target),
    target,
    translation,
    type: raw.type === 'word' ? 'word' : 'sentence',
    scenario: raw.scenario ? String(raw.scenario).trim() : null,
  }
}

function buildDeck(lang, rows) {
  return rows.map((r) => normalizeCard(lang, r)).filter(Boolean)
}

const EN = [
  { target: 'Hello', translation: 'Merhaba', type: 'word', scenario: 'Selamlaşma' },
  { target: 'Good morning', translation: 'Günaydın', scenario: 'Selamlaşma' },
  { target: 'How are you?', translation: 'Nasılsın?', scenario: 'Selamlaşma' },
  { target: 'I am fine, thank you', translation: 'İyiyim, teşekkürler', scenario: 'Selamlaşma' },
  { target: 'What is your name?', translation: 'Adın ne?', scenario: 'Tanışma' },
  { target: 'My name is Eren', translation: 'Benim adım Eren', scenario: 'Tanışma' },
  { target: 'Nice to meet you', translation: 'Tanıştığıma memnun oldum', scenario: 'Tanışma' },
  { target: 'I am hungry', translation: 'Açım', scenario: 'Günlük' },
  { target: 'I like football', translation: 'Futbolu severim', scenario: 'Futbol' },
  { target: 'Where is the ball?', translation: 'Top nerede?', scenario: 'Futbol' },
  { target: "Let's play", translation: 'Hadi oynayalım', scenario: 'Futbol' },
  { target: 'See you tomorrow', translation: 'Yarın görüşürüz', scenario: 'Selamlaşma' },
  { target: 'Thank you very much', translation: 'Çok teşekkür ederim', scenario: 'Günlük' },
  { target: 'Excuse me', translation: 'Affedersiniz', scenario: 'Günlük' },
  { target: "I don't understand", translation: 'Anlamıyorum', scenario: 'Günlük' },
]

const DE = [
  { target: 'Hallo', translation: 'Merhaba', type: 'word', scenario: 'Selamlaşma' },
  { target: 'Guten Morgen', translation: 'Günaydın', scenario: 'Selamlaşma' },
  { target: "Wie geht's?", translation: 'Nasılsın?', scenario: 'Selamlaşma' },
  { target: 'Mir geht es gut, danke', translation: 'İyiyim, teşekkürler', scenario: 'Selamlaşma' },
  { target: 'Wie heißt du?', translation: 'Adın ne?', scenario: 'Tanışma' },
  { target: 'Ich heiße Eren', translation: 'Benim adım Eren', scenario: 'Tanışma' },
  { target: 'Freut mich', translation: 'Memnun oldum', scenario: 'Tanışma' },
  { target: 'Ich habe Hunger', translation: 'Açım', scenario: 'Günlük' },
  { target: 'Ich mag Fußball', translation: 'Futbolu severim', scenario: 'Futbol' },
  { target: 'Wo ist der Ball?', translation: 'Top nerede?', scenario: 'Futbol' },
  { target: 'Lass uns spielen', translation: 'Hadi oynayalım', scenario: 'Futbol' },
  { target: 'Bis morgen', translation: 'Yarın görüşürüz', scenario: 'Selamlaşma' },
  { target: 'Vielen Dank', translation: 'Çok teşekkürler', scenario: 'Günlük' },
  { target: 'Entschuldigung', translation: 'Affedersiniz', scenario: 'Günlük' },
  { target: 'Ich verstehe nicht', translation: 'Anlamıyorum', scenario: 'Günlük' },
]

const ES = [
  { target: 'Hola', translation: 'Merhaba', type: 'word', scenario: 'Selamlaşma' },
  { target: 'Buenos días', translation: 'Günaydın', scenario: 'Selamlaşma' },
  { target: '¿Cómo estás?', translation: 'Nasılsın?', scenario: 'Selamlaşma' },
  { target: 'Estoy bien, gracias', translation: 'İyiyim, teşekkürler', scenario: 'Selamlaşma' },
  { target: '¿Cómo te llamas?', translation: 'Adın ne?', scenario: 'Tanışma' },
  { target: 'Me llamo Eren', translation: 'Benim adım Eren', scenario: 'Tanışma' },
  { target: 'Mucho gusto', translation: 'Memnun oldum', scenario: 'Tanışma' },
  { target: 'Tengo hambre', translation: 'Açım', scenario: 'Günlük' },
  { target: 'Me gusta el fútbol', translation: 'Futbolu severim', scenario: 'Futbol' },
  { target: '¿Dónde está el balón?', translation: 'Top nerede?', scenario: 'Futbol' },
  { target: 'Vamos a jugar', translation: 'Hadi oynayalım', scenario: 'Futbol' },
  { target: 'Hasta mañana', translation: 'Yarın görüşürüz', scenario: 'Selamlaşma' },
  { target: 'Muchas gracias', translation: 'Çok teşekkürler', scenario: 'Günlük' },
  { target: 'Perdón', translation: 'Affedersiniz', scenario: 'Günlük' },
  { target: 'No entiendo', translation: 'Anlamıyorum', scenario: 'Günlük' },
]

export const SEED_DECKS = {
  en: buildDeck('en', EN),
  de: buildDeck('de', DE),
  es: buildDeck('es', ES),
}
