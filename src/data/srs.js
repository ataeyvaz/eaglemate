// Basit aralıklı tekrar (spaced repetition) planlayıcısı.
// Yol haritası: bugün öğrenileni 1, 3, 7 gün sonra tekrar sor. Sonrasında
// pekişmesi için 16 gün. "Zor/tekrar" seçilirse aşama sıfırlanır.
import { addDays, todayKey } from '../lib/date'

export const INTERVALS = [1, 3, 7, 16] // aşamaya göre gün

// Kartı bir sonraki tekrara planlar. result: 'good' | 'again'
export function schedule(entry, result, today = todayKey()) {
  const stage = entry?.stage || 0
  if (result === 'again') {
    return { stage: 0, due: addDays(today, 1), lastResult: 'again' }
  }
  const days = INTERVALS[Math.min(stage, INTERVALS.length - 1)]
  const nextStage = Math.min(stage + 1, INTERVALS.length)
  return { stage: nextStage, due: addDays(today, days), lastResult: 'good' }
}

// Kart bugün tekrar edilmeli mi? (Hiç çalışılmamış kartlar da "due" sayılır.)
export function isDue(entry, today = todayKey()) {
  if (!entry || !entry.due) return true
  return entry.due <= today
}

// Kart tamamen öğrenildi mi? (son aşamayı geçmiş)
export function isLearned(entry) {
  return !!entry && entry.stage >= INTERVALS.length
}

// Bir deste içinde bugün tekrar edilecek kartları döndürür.
export function dueCards(deck, srs, today = todayKey()) {
  return deck.filter((c) => isDue(srs?.[c.id], today))
}
