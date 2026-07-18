// aguilangevotr'dan üretilmiş hazır kelime desteleri (A1).
// scripts/import-from-aguilang.mjs ile üretilir; burada uygulamaya bağlanır.
import en from '../content/aguilang-en.json'
import de from '../content/aguilang-de.json'
import es from '../content/aguilang-es.json'

export const READY_DECKS = { en, de, es }

export const READY_META = {
  en: { level: 'A1', count: en.length },
  de: { level: 'A1', count: de.length },
  es: { level: 'A1', count: es.length },
}
