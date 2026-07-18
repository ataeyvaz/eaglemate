// Dikte karşılaştırması: söylenen metni hedef metinle kıyaslar.
// Büyük/küçük harf, noktalama ve aksan farklarını göz ardı eder (çocuk için
// affedici olması amaçlı).

function fold(s) {
  return s
    .toLowerCase()
    .replace(/ß/g, 'ss') // Almanca eszett affı
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '') // aksanları kaldır
    .replace(/[¿¡?!.,;:"'’()]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

export function tokenize(s) {
  const f = fold(s)
  return f ? f.split(' ') : []
}

// Hedef cümlenin her kelimesi, söylenen metinde var mı? Sonuç:
// { words: [{ text, ok }], score } — score 0-100 arası eşleşme yüzdesi.
export function compareText(target, spoken) {
  const targetWordsRaw = target.split(/\s+/).filter(Boolean)
  const spokenSet = new Set(tokenize(spoken))
  let matched = 0
  const words = targetWordsRaw.map((w) => {
    const ok = spokenSet.has(fold(w))
    if (ok) matched++
    return { text: w, ok }
  })
  const score = targetWordsRaw.length
    ? Math.round((100 * matched) / targetWordsRaw.length)
    : 0
  return { words, score }
}
