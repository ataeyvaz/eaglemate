// aguilangevotr → EagleMate içerik köprüsü
//
// aguilangevotr'un çekirdek kelime verisini (src/content/words/{A1..B2}.json,
// düz 5-dilli şema: tr + en/de/es/pt + kategori) okur ve EagleMate'in dil
// modülü için içe aktarma formatına ("target"/"translation"/"type"/"scenario")
// dönüştürür.
//
// Kullanım (EagleMate kök klasöründen):
//   node scripts/import-from-aguilang.mjs                # A1, en+de+es
//   node scripts/import-from-aguilang.mjs --level A1,A2 --langs en,de
//   AGUILANG_DIR=/başka/yol node scripts/import-from-aguilang.mjs
//
// Çıktı: src/content/aguilang-<lang>.json (uygulamaya gömülü hazır desteler)

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')

// --- argümanlar ---
const args = process.argv.slice(2)
function argVal(name, def) {
  const i = args.indexOf(name)
  return i >= 0 && args[i + 1] ? args[i + 1] : def
}
const LEVELS = argVal('--level', 'A1').split(',').map((s) => s.trim())
const LANGS = argVal('--langs', 'en,de,es').split(',').map((s) => s.trim())

const AGUILANG_DIR =
  process.env.AGUILANG_DIR ||
  path.resolve(ROOT, '..', 'aguilangevotr', 'src', 'content', 'words')

const OUT_DIR = path.resolve(ROOT, 'src', 'content')

// Kategori adlarını Türkçe senaryo etiketine çevir (bulunamazsa ham hali kalır)
const CATEGORY_TR = {
  adjectives: 'Sıfatlar',
  animals: 'Hayvanlar',
  body: 'Vücut',
  clothing: 'Giysiler',
  colors: 'Renkler',
  family: 'Aile',
  food: 'Yiyecek',
  fruits: 'Meyveler',
  greetings: 'Selamlaşma',
  home: 'Ev',
  jobs: 'Meslekler',
  numbers: 'Sayılar',
  places: 'Yerler',
  questions: 'Sorular',
  school: 'Okul',
  sports: 'Spor',
  time: 'Zaman',
  transport: 'Ulaşım',
  vegetables: 'Sebzeler',
  verbs: 'Fiiller',
}

function loadLevel(level) {
  const p = path.join(AGUILANG_DIR, `${level}.json`)
  if (!fs.existsSync(p)) {
    console.warn(`! ${level}.json bulunamadı: ${p}`)
    return []
  }
  return JSON.parse(fs.readFileSync(p, 'utf8'))
}

function main() {
  console.log(`aguilangevotr kaynağı: ${AGUILANG_DIR}`)
  console.log(`Seviyeler: ${LEVELS.join(', ')} | Diller: ${LANGS.join(', ')}\n`)

  const words = LEVELS.flatMap(loadLevel)
  if (words.length === 0) {
    console.error('Hiç kelime yüklenemedi. AGUILANG_DIR yolunu kontrol et.')
    process.exit(1)
  }

  fs.mkdirSync(OUT_DIR, { recursive: true })

  for (const lang of LANGS) {
    const seen = new Set()
    const cards = []
    for (const w of words) {
      const target = w[lang]
      const translation = w.tr
      if (!target || !translation) continue // o dilde karşılığı yoksa atla
      const key = target.toLowerCase()
      if (seen.has(key)) continue
      seen.add(key)
      cards.push({
        target,
        translation,
        type: 'word',
        scenario: CATEGORY_TR[w.category] || w.category || null,
      })
    }
    const outPath = path.join(OUT_DIR, `aguilang-${lang}.json`)
    fs.writeFileSync(outPath, JSON.stringify(cards, null, 0), 'utf8')
    console.log(`✓ ${lang}: ${cards.length} kart → ${path.relative(ROOT, outPath)}`)
  }

  console.log('\nBitti. src/data/readyDecks.js bunları uygulamaya bağlar.')
}

main()
