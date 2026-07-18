// EagleMate — Antrenman program motoru (Faz 2)
//
// Profil: 11-13 yaş, futbol oynuyor, biraz kilolu (eklem dostu ve hareketlilik
// açıcı olmalı), sadece vücut ağırlığı. Hedef: kademeli güçlenme + kas kütlesi,
// futbolu destekleyen çeviklik/denge ve gölge boksu ile kişisel güvenlik.
//
// Tasarım ilkeleri:
// - Bu yaşta "kas kütlesi" ağır yükle değil; teknik + tekrar/tempo artışıyla,
//   vücut ağırlığı hareketleriyle güvenli şekilde gelişir.
// - Fazla kilo eklemleri zorladığı için YÜKSEK SIÇRAMA/PLİOMETRİ baştan yok;
//   yumuşak iniş, kontrollü tempo ve hareketlilik ön planda.
// - Her hareketin 4 seviyesi var; program tek bir "seviye" ile ilerler (1→4).

// ---- Sabit ısınma (her antrenman günü) — dinamik, düşük etkili ----
export const WARMUP = [
  { key: 'w_march', name: 'Yerinde marş', detail: '60 sn', note: 'Kolları da salla, ritim tut.' },
  { key: 'w_arm', name: 'Kol çevirme', detail: '10 ileri + 10 geri' },
  { key: 'w_hip', name: 'Kalça açıcı diz çekme (yürüyüş)', detail: '8 / bacak', note: 'Dizini göğsüne doğru kontrollü çek.' },
  { key: 'w_side', name: 'Gövde yana esnetme', detail: '6 / yön' },
  { key: 'w_ankle', name: 'Bilek & topuk-parmak ısıtma', detail: '30 sn', note: 'Yumuşak bas, zıplama yok.' },
]

// ---- Sabit soğuma / hareketlilik (her gün) ----
export const COOLDOWN = [
  { key: 'c_ham', name: 'Uyluk arkası esnetme', detail: '20 sn / bacak', note: 'Sıçramadan, yavaşça in.' },
  { key: 'c_hip', name: 'Kalça esnetme (figür-4)', detail: '20 sn / bacak', note: 'Kalça açıklığı futbol için önemli.' },
  { key: 'c_chest', name: 'Göğüs-omuz esnetme (kapı/duvar)', detail: '20 sn' },
  { key: 'c_catcow', name: 'Kedi-deve hareketi', detail: '8 tekrar', note: 'Belini yavaşça yuvarla, hareketliliği açar.' },
  { key: 'c_breath', name: 'Derin nefes / gevşeme', detail: '5 nefes' },
]

// ---- Aktif dinlenme / dinlenme günü öğeleri ----
export const RECOVERY = [
  { key: 'r_walk', name: 'Tempolu yürüyüş veya topla hafif dokunuşlar', detail: '15-20 dk', note: 'Zorlamadan, keyifli tempoda.' },
  { key: 'c_ham', name: 'Uyluk arkası esnetme', detail: '20 sn / bacak' },
  { key: 'c_hip', name: 'Kalça esnetme (figür-4)', detail: '20 sn / bacak' },
  { key: 'c_catcow', name: 'Kedi-deve hareketi', detail: '8 tekrar' },
]

export const REST = [
  { key: 'c_ham', name: 'Uyluk arkası esnetme', detail: '20 sn / bacak' },
  { key: 'c_hip', name: 'Kalça esnetme (figür-4)', detail: '20 sn / bacak' },
  { key: 'c_catcow', name: 'Kedi-deve hareketi', detail: '8 tekrar' },
  { key: 'c_breath', name: 'Derin nefes / gevşeme', detail: '5 nefes' },
]

// ---- Seviyeli hareket kütüphanesi (1-4) ----
// pattern: hareket paterni, muscles: kas grubu (üst üste yormamak için),
// caution: "dikkat" uyarısı, levels: seviyeye göre varyasyon + reçete.
export const MOVES = {
  // --- Kuvvet ---
  squat: {
    name: 'Squat', pattern: 'Bacak (diz baskın)', muscles: ['bacak'],
    caution: 'Topuklar yerde kalsın, dizler içe düşmesin, göğüs dik.',
    levels: {
      1: { label: 'Sandalyeye oturup kalkma', detail: '2 set × 8', rest: '60 sn' },
      2: { label: 'Yarım squat', detail: '2 set × 10', rest: '60 sn' },
      3: { label: 'Tam squat', detail: '3 set × 12', rest: '60 sn' },
      4: { label: 'Tempolu squat (3 sn inişte)', detail: '3 set × 12', rest: '75 sn' },
    },
  },
  pushup: {
    name: 'Şınav', pattern: 'Üst vücut itiş', muscles: ['gogus'],
    caution: 'Gövde tek çizgi, bel çukurlaşmasın, dirsekleri gövdene yakın tut.',
    levels: {
      1: { label: 'Duvar şınavı', detail: '2 set × 8', rest: '60 sn' },
      2: { label: 'Sehpaya/masaya eğik şınav', detail: '2 set × 8', rest: '60 sn' },
      3: { label: 'Diz üstü şınav', detail: '3 set × 8', rest: '60 sn' },
      4: { label: 'Tam şınav', detail: '3 set × 8', rest: '75 sn' },
    },
  },
  glutebridge: {
    name: 'Kalça köprüsü', pattern: 'Kalça (menteşe)', muscles: ['kalca'],
    caution: 'Tepede kalçayı sık, beli değil kalçayı çalıştır.',
    levels: {
      1: { label: 'Kalça köprüsü', detail: '2 set × 10', rest: '45 sn' },
      2: { label: '2 sn beklemeli köprü', detail: '2 set × 10', rest: '45 sn' },
      3: { label: 'Tek ayak köprü', detail: '3 set × 6 / bacak', rest: '60 sn' },
      4: { label: 'Ayak yükseltilmiş köprü', detail: '3 set × 12', rest: '60 sn' },
    },
  },
  superman: {
    name: 'Superman (sırt)', pattern: 'Sırt / postür', muscles: ['sirt'],
    caution: 'Boynunu zorlama, bakışın yere baksın. Postür için çok değerli.',
    levels: {
      1: { label: 'Superman tut', detail: '3 set × 10 sn', rest: '40 sn' },
      2: { label: 'Superman kaldır-indir', detail: '3 set × 8', rest: '40 sn' },
      3: { label: 'Yüzücü (çapraz kol-bacak)', detail: '3 set × 20 sn', rest: '45 sn' },
      4: { label: 'Superman + 3 sn tepede bekle', detail: '3 set × 10', rest: '45 sn' },
    },
  },
  plank: {
    name: 'Plank', pattern: 'Merkez (core)', muscles: ['core'],
    caution: 'Kalça çok yükselmesin/düşmesin, karın sıkı.',
    levels: {
      1: { label: 'Diz üstü plank', detail: '3 set × 15 sn', rest: '40 sn' },
      2: { label: 'Plank', detail: '3 set × 20 sn', rest: '40 sn' },
      3: { label: 'Plank', detail: '3 set × 30 sn', rest: '45 sn' },
      4: { label: 'Plank + omuz dokunuş', detail: '3 set × 30 sn', rest: '45 sn' },
    },
  },
  sideplank: {
    name: 'Yan plank', pattern: 'Yan merkez', muscles: ['core'],
    caution: 'Kalça düşmesin, gövde tek çizgi olsun.',
    levels: {
      1: { label: 'Diz üstü yan plank', detail: '2 set × 12 sn / yön', rest: '30 sn' },
      2: { label: 'Yan plank', detail: '2 set × 15 sn / yön', rest: '30 sn' },
      3: { label: 'Yan plank', detail: '2 set × 20 sn / yön', rest: '40 sn' },
      4: { label: 'Yan plank kalça iniş-kalkış', detail: '2 set × 10 / yön', rest: '40 sn' },
    },
  },
  deadbug: {
    name: 'Ölü böcek (dead bug)', pattern: 'Merkez (stabilite)', muscles: ['core'],
    caution: 'Belin yere yapışık kalsın, hareket yavaş ve kontrollü.',
    levels: {
      1: { label: 'Dead bug (yavaş)', detail: '2 set × 6 / yön', rest: '30 sn' },
      2: { label: 'Dead bug', detail: '2 set × 8 / yön', rest: '30 sn' },
      3: { label: 'Dead bug', detail: '3 set × 8 / yön', rest: '40 sn' },
      4: { label: 'Dead bug (uzun kol-bacak)', detail: '3 set × 10 / yön', rest: '40 sn' },
    },
  },

  // --- Futbol çeviklik / kondisyon (eklem dostu, yumuşak) ---
  fastfeet: {
    name: 'Yerinde hızlı ayak', pattern: 'Çeviklik', muscles: ['kondisyon'],
    caution: 'Yumuşak bas, gürültüsüz. Dizler hafif bükük, eklemi koru.',
    levels: {
      1: { label: 'Hızlı ayak', detail: '3 × 15 sn', rest: '30 sn' },
      2: { label: 'Hızlı ayak', detail: '3 × 20 sn', rest: '30 sn' },
      3: { label: 'Hızlı ayak', detail: '4 × 20 sn', rest: '30 sn' },
      4: { label: 'Hızlı ayak', detail: '4 × 30 sn', rest: '30 sn' },
    },
  },
  shuffle: {
    name: 'Yana kayış adım (shuffle)', pattern: 'Yön değiştirme', muscles: ['kondisyon'],
    caution: 'Kısa mesafe, kontrollü dur. Ani sert dönüş yok.',
    levels: {
      1: { label: 'Yana shuffle', detail: '2 × 20 sn', rest: '40 sn' },
      2: { label: 'Yana shuffle', detail: '3 × 20 sn', rest: '40 sn' },
      3: { label: 'Yana shuffle + dokunuş', detail: '3 × 25 sn', rest: '40 sn' },
      4: { label: 'Yana shuffle (hızlı)', detail: '4 × 25 sn', rest: '40 sn' },
    },
  },
  balltap: {
    name: 'Top üstü ayak değiştirme', pattern: 'Futbol becerisi', muscles: ['kondisyon'],
    caution: 'Top yoksa hayali topla yap. Dik dur, başını kaldır.',
    levels: {
      1: { label: 'Top üstü dokunuş', detail: '3 × 20 sn', rest: '30 sn' },
      2: { label: 'Top üstü dokunuş', detail: '3 × 30 sn', rest: '30 sn' },
      3: { label: 'Top üstü + geri çekme', detail: '4 × 30 sn', rest: '30 sn' },
      4: { label: 'Top üstü (hızlı ritim)', detail: '4 × 40 sn', rest: '30 sn' },
    },
  },
  balance: {
    name: 'Tek ayak denge', pattern: 'Denge / kontrol', muscles: ['denge'],
    caution: 'Zorlanınca duvara hafif dokun. Futbolda denge çok işe yarar.',
    levels: {
      1: { label: 'Tek ayak duruş', detail: '3 × 20 sn / bacak', rest: '20 sn' },
      2: { label: 'Tek ayak + kol hareketi', detail: '3 × 25 sn / bacak', rest: '20 sn' },
      3: { label: 'Tek ayak + öne uzanma', detail: '3 × 8 / bacak', rest: '30 sn' },
      4: { label: 'Tek ayak gözler kapalı', detail: '3 × 20 sn / bacak', rest: '30 sn' },
    },
  },

  // --- Gölge boksu / kişisel güvenlik ---
  stance: {
    name: 'Boks duruşu & korunma', pattern: 'Savunma temeli', muscles: ['beceri'],
    caution: 'Eller çene hizasında, çene içeride, dizler hafif bükük.',
    levels: {
      1: { label: 'Duruş & korunmayı tut', detail: '2 × 30 sn', rest: '20 sn' },
      2: { label: 'Duruşta öne-arka adım', detail: '2 × 40 sn', rest: '20 sn' },
      3: { label: 'Duruşta yön değiştirme', detail: '3 × 40 sn', rest: '20 sn' },
      4: { label: 'Duruş + sürekli ayak', detail: '3 × 60 sn', rest: '20 sn' },
    },
  },
  jab: {
    name: 'Sol direkt (jab)', pattern: 'Yumruk tekniği', muscles: ['beceri'],
    caution: 'Dirseği tam kilitleme, atınca diğer el çeneyi korusun. Omuz gevşek.',
    levels: {
      1: { label: 'Jab tekrarı', detail: '2 × 30 sn', rest: '30 sn' },
      2: { label: 'Jab tekrarı', detail: '3 × 30 sn', rest: '30 sn' },
      3: { label: 'Jab + adım', detail: '3 × 40 sn', rest: '30 sn' },
      4: { label: 'Çift jab + adım', detail: '3 × 45 sn', rest: '30 sn' },
    },
  },
  cross: {
    name: 'Sağ direkt (cross)', pattern: 'Yumruk tekniği', muscles: ['beceri'],
    caution: 'Gücü kalçadan al, belini yumuşak çevir. Diğer el çenede.',
    levels: {
      1: { label: 'Cross tekrarı', detail: '2 × 30 sn', rest: '30 sn' },
      2: { label: 'Cross tekrarı', detail: '3 × 30 sn', rest: '30 sn' },
      3: { label: 'Jab-Cross', detail: '3 × 40 sn', rest: '30 sn' },
      4: { label: 'Jab-Cross + kaçış', detail: '3 × 45 sn', rest: '30 sn' },
    },
  },
  shadowround: {
    name: 'Gölge boksu turu', pattern: 'Serbest kombinasyon', muscles: ['beceri'],
    caution: 'Kendi ritminde, sürekli hareket et, nefesini tut. Eğlen!',
    levels: {
      1: { label: 'Gölge boksu', detail: '2 tur × 30 sn', rest: '30 sn' },
      2: { label: 'Gölge boksu', detail: '3 tur × 30 sn', rest: '30 sn' },
      3: { label: 'Gölge boksu', detail: '3 tur × 45 sn', rest: '30 sn' },
      4: { label: 'Gölge boksu', detail: '3 tur × 60 sn', rest: '45 sn' },
    },
  },
}

// ---- Haftalık şablon: hafta günü (0=Pazar) → seans tipi ----
// Kas grubunu üst üste yormamak için kuvvet günleri arasına dinlenme/çeviklik
// serpiştirildi. Futbol kursu genelde hafta içi/sonu olduğundan Sal/Cmt aktif
// dinlenme (kursa denk gelirse kurs zaten antrenman sayılır).
export const WEEK_TEMPLATE = {
  1: 'strength_boxing', // Pazartesi
  2: 'active_recovery', // Salı
  3: 'football_agility', // Çarşamba
  4: 'rest', //           Perşembe
  5: 'strength_full', //  Cuma
  6: 'active_recovery', // Cumartesi
  0: 'rest', //           Pazar
}

const TRAINING_TYPES = new Set(['strength_boxing', 'football_agility', 'strength_full'])

export function isTrainingType(type) {
  return TRAINING_TYPES.has(type)
}

const SESSION_META = {
  strength_boxing: { title: 'Kuvvet + Gölge Boksu', est: '~35 dk' },
  football_agility: { title: 'Futbol Çeviklik + Core', est: '~30 dk' },
  strength_full: { title: 'Tüm Vücut Kuvvet', est: '~40 dk' },
  active_recovery: { title: 'Aktif Dinlenme', est: '~20 dk' },
  rest: { title: 'Dinlenme Günü', est: 'Hafif' },
}

function dateFromKey(dateKey) {
  const [y, m, d] = dateKey.split('-').map(Number)
  return new Date(y, m - 1, d)
}

export function getSessionType(dateKey) {
  const wd = dateFromKey(dateKey).getDay()
  return WEEK_TEMPLATE[wd]
}

// Seviyeyi 1-4 aralığına sabitler
function clampLevel(level) {
  return Math.max(1, Math.min(4, level || 1))
}

// Bir hareket anahtarını, tarihe göre kararlı id'li bir seans öğesine çevirir.
function moveItem(dateKey, key, level) {
  const mv = MOVES[key]
  const v = mv.levels[clampLevel(level)]
  return {
    id: `${dateKey}|${key}`,
    name: mv.name,
    variant: v.label,
    detail: v.detail,
    rest: v.rest,
    note: mv.pattern,
    caution: mv.caution,
  }
}

// Sabit öğeyi (ısınma/soğuma) seans öğesine çevirir.
function fixedItem(dateKey, item) {
  return {
    id: `${dateKey}|${item.key}`,
    name: item.name,
    detail: item.detail,
    note: item.note || null,
    caution: null,
  }
}

// Seans tipine göre blok kompozisyonu (hareket anahtarları)
const COMPOSITION = {
  strength_boxing: [
    { title: 'Kuvvet', keys: ['squat', 'pushup', 'superman', 'plank'] },
    { title: 'Gölge Boksu', keys: ['jab', 'cross', 'shadowround'] },
  ],
  football_agility: [
    { title: 'Futbol & Çeviklik', keys: ['fastfeet', 'shuffle', 'balltap', 'balance'] },
    { title: 'Merkez (Core)', keys: ['deadbug', 'sideplank'] },
    { title: 'Gölge Boksu', keys: ['shadowround'] },
  ],
  strength_full: [
    { title: 'Tüm Vücut Kuvvet', keys: ['squat', 'pushup', 'glutebridge', 'superman', 'plank', 'sideplank'] },
    { title: 'Kondisyon', keys: ['fastfeet'] },
  ],
}

// Verilen gün + seviye için tam seansı üretir.
export function generateSession(dateKey, level) {
  const type = getSessionType(dateKey)
  const meta = SESSION_META[type]
  const blocks = []

  if (type === 'active_recovery') {
    blocks.push({
      title: 'Aktif Dinlenme',
      items: RECOVERY.map((i) => fixedItem(dateKey, i)),
    })
  } else if (type === 'rest') {
    blocks.push({
      title: 'Hafif Esneme (isteğe bağlı)',
      items: REST.map((i) => fixedItem(dateKey, i)),
    })
  } else {
    // Antrenman günü: ısınma → ana bloklar → soğuma
    blocks.push({ title: 'Isınma', items: WARMUP.map((i) => fixedItem(dateKey, i)) })
    for (const block of COMPOSITION[type]) {
      blocks.push({
        title: block.title,
        items: block.keys.map((k) => moveItem(dateKey, k, level)),
      })
    }
    blocks.push({ title: 'Soğuma', items: COOLDOWN.map((i) => fixedItem(dateKey, i)) })
  }

  const countableIds = blocks.flatMap((b) => b.items.map((i) => i.id))
  return {
    type,
    title: meta.title,
    est: meta.est,
    isTraining: isTrainingType(type),
    blocks,
    countableIds,
  }
}

// Yalnızca sayılabilir öğe id'lerini döndürür (log/streak hesabı için).
export function sessionCountableIds(dateKey, level) {
  return generateSession(dateKey, level).countableIds
}

// Seviye atlama eşiği: mevcut seviyede bu kadar TAM tamamlanmış antrenman günü.
export const LEVEL_UP_SESSIONS = 6

// levelSince tarihinden bu yana tam tamamlanan antrenman günü sayısı.
export function completedTrainingDaysSince(sessions, sinceKey) {
  let count = 0
  for (const [dk, s] of Object.entries(sessions || {})) {
    if (s && s.full && dk >= (sinceKey || '') && isTrainingType(getSessionType(dk))) {
      count++
    }
  }
  return count
}
