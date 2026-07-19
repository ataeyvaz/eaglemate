// EagleMate — Antrenman program motoru (Faz 2 + genişletilmiş kütüphane)
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
// - Her hareketin 4 seviyesi (1→4), adım adım tarifi (steps) ve şekil anahtarı
//   (illo) var. Seanslar güne göre dönerek (rotasyon) çeşitlenir.

// ---- Sabit ısınma (her antrenman günü) — dinamik, düşük etkili ----
export const WARMUP = [
  { key: 'w_march', name: 'Yerinde marş', detail: '60 sn', illo: 'running',
    note: 'Kolları da salla, ritim tut.',
    steps: ['Dik dur, bakışın ileride.', 'Dizleri sırayla kalça hizasına çek.', 'Kolları zıt ritimde salla.', 'Yumuşak bas, gürültü yapma.'] },
  { key: 'w_arm', name: 'Kol çevirme', detail: '10 ileri + 10 geri', illo: 'armcircle',
    steps: ['Kolları yana aç.', 'Küçük daireler çizerek başla, büyüt.', 'Omuzları gevşek tut.', '10 ileri, sonra 10 geri.'] },
  { key: 'w_hip', name: 'Kalça açıcı diz çekme', detail: '8 / bacak', illo: 'running',
    note: 'Dizini göğsüne doğru kontrollü çek.',
    steps: ['Dik dur, karnını hafif sık.', 'Bir dizini iki elinle göğsüne çek.', '1 sn tut, yavaşça indir.', 'Bacak değiştir.'] },
  { key: 'w_side', name: 'Gövde yana esnetme', detail: '6 / yön', illo: 'stretch',
    steps: ['Ayaklar omuz genişliğinde.', 'Bir kolu yukarı uzat.', 'Gövdeni yana eğ, esnemeyi hisset.', 'Yavaşça geri gel, yön değiştir.'] },
  { key: 'w_ankle', name: 'Bilek & topuk-parmak ısıtma', detail: '30 sn', illo: 'calfraise',
    note: 'Yumuşak bas, zıplama yok.',
    steps: ['Parmak ucuna yüksel, indir.', 'Sonra topuk üstünde dur.', 'Bilekleri iki yöne çevir.', 'Kontrollü ve yumuşak.'] },
]

// ---- Sabit soğuma / hareketlilik (her gün) ----
export const COOLDOWN = [
  { key: 'c_ham', name: 'Uyluk arkası esnetme', detail: '20 sn / bacak', illo: 'stretchforward',
    note: 'Sıçramadan, yavaşça in.',
    steps: ['Ayakta veya otururken bir bacağı düz uzat.', 'Kalçadan öne eğil, ellerini ayağa doğru uzat.', 'Zıplamadan, nefes vererek esne.', '20 sn tut, bacak değiştir.'] },
  { key: 'c_hip', name: 'Kalça esnetme (figür-4)', detail: '20 sn / bacak', illo: 'stretchforward',
    note: 'Kalça açıklığı futbol için önemli.',
    steps: ['Sırt üstü yat.', 'Bir ayak bileğini diğer dizine koy (4 şekli).', 'Alttaki bacağı göğse doğru çek.', '20 sn tut, taraf değiştir.'] },
  { key: 'c_chest', name: 'Göğüs-omuz esnetme', detail: '20 sn', illo: 'stretch',
    steps: ['Kapı/duvar kenarına elini koy.', 'Gövdeni yavaşça karşı yöne çevir.', 'Göğüste esnemeyi hisset.', 'Taraf değiştir.'] },
  { key: 'c_catcow', name: 'Kedi-deve hareketi', detail: '8 tekrar', illo: 'catcow',
    note: 'Belini yavaşça yuvarla, hareketliliği açar.',
    steps: ['Elle-diz üstü dur (masa pozisyonu).', 'Nefes al, beli çukurlaştır (deve).', 'Nefes ver, sırtı yukarı yuvarla (kedi).', 'Yavaş ve akıcı tekrarla.'] },
  { key: 'c_breath', name: 'Derin nefes / gevşeme', detail: '5 nefes', illo: 'breathing',
    steps: ['Dik dur veya otur.', 'Burnundan 4 sn nefes al.', 'Ağızdan 6 sn yavaşça ver.', 'Omuzları gevşet.'] },
]

// ---- Aktif dinlenme / dinlenme günü öğeleri ----
export const RECOVERY = [
  { key: 'r_walk', name: 'Tempolu yürüyüş veya topla dokunuşlar', detail: '15-20 dk', illo: 'running',
    note: 'Zorlamadan, keyifli tempoda.',
    steps: ['Rahat bir tempoda yürü.', 'İstersen topla hafif dokunuşlar yap.', 'Nefesin düzenli kalsın.', 'Amaç dinlenip hareket etmek.'] },
  { key: 'c_ham', name: 'Uyluk arkası esnetme', detail: '20 sn / bacak', illo: 'stretchforward' },
  { key: 'c_hip', name: 'Kalça esnetme (figür-4)', detail: '20 sn / bacak', illo: 'stretchforward' },
  { key: 'c_catcow', name: 'Kedi-deve hareketi', detail: '8 tekrar', illo: 'catcow' },
]

export const REST = [
  { key: 'c_ham', name: 'Uyluk arkası esnetme', detail: '20 sn / bacak', illo: 'stretchforward' },
  { key: 'c_hip', name: 'Kalça esnetme (figür-4)', detail: '20 sn / bacak', illo: 'stretchforward' },
  { key: 'c_catcow', name: 'Kedi-deve hareketi', detail: '8 tekrar', illo: 'catcow' },
  { key: 'c_breath', name: 'Derin nefes / gevşeme', detail: '5 nefes', illo: 'breathing' },
]

// ---- Seviyeli hareket kütüphanesi (1-4) ----
// pattern: hareket paterni, muscles: kas grubu, caution: "dikkat" uyarısı,
// steps: adım adım tarif, illo: şekil anahtarı, levels: varyasyon + reçete.
export const MOVES = {
  // ================= BACAK =================
  squat: {
    name: 'Squat', pattern: 'Bacak (diz baskın)', muscles: ['bacak'], illo: 'squat',
    caution: 'Topuklar yerde kalsın, dizler içe düşmesin, göğüs dik.',
    steps: ['Ayaklar omuz genişliğinde, parmak uçları hafif dışa.', 'Kalçayı geriye it, sandalyeye oturur gibi in.', 'Dizler ayak parmağı yönüne baksın.', 'Topuktan güç alıp yukarı kalk, kalçayı sık.'],
    levels: {
      1: { label: 'Sandalyeye oturup kalkma', detail: '2 set × 8', rest: '60 sn' },
      2: { label: 'Yarım squat', detail: '2 set × 10', rest: '60 sn' },
      3: { label: 'Tam squat', detail: '3 set × 12', rest: '60 sn' },
      4: { label: 'Tempolu squat (3 sn inişte)', detail: '3 set × 12', rest: '75 sn' },
    },
  },
  lunge: {
    name: 'Öne hamle (lunge)', pattern: 'Bacak (tek taraf)', muscles: ['bacak'], illo: 'lunge',
    caution: 'Ön diz ayak ucunu geçmesin, gövde dik kalsın.',
    steps: ['Dik dur, bir ayakla öne adım at.', 'Arka dizi yere doğru indir (yere değmeden).', 'Ön diz 90° olsun, ayak ucunu geçmesin.', 'Öndeki topuktan itip başlangıca dön.'],
    levels: {
      1: { label: 'Tutunmalı yarım hamle', detail: '2 set × 6 / bacak', rest: '60 sn' },
      2: { label: 'Öne hamle', detail: '2 set × 8 / bacak', rest: '60 sn' },
      3: { label: 'Geriye hamle', detail: '3 set × 8 / bacak', rest: '60 sn' },
      4: { label: 'Yürüyen hamle', detail: '3 set × 10 / bacak', rest: '75 sn' },
    },
  },
  wallsit: {
    name: 'Duvar oturuşu (wall-sit)', pattern: 'Bacak (izometrik)', muscles: ['bacak'], illo: 'wallsit',
    caution: 'Dizler 90°yi geçip ayak ucunu aşmasın, sırt duvara yapışık.',
    steps: ['Sırtını duvara yasla.', 'Ayakları öne al, oturur gibi kay.', 'Dizler 90°, uyluklar yere paralel.', 'Nefes alarak pozisyonu koru.'],
    levels: {
      1: { label: 'Duvar oturuşu', detail: '3 × 15 sn', rest: '40 sn' },
      2: { label: 'Duvar oturuşu', detail: '3 × 25 sn', rest: '40 sn' },
      3: { label: 'Duvar oturuşu', detail: '3 × 40 sn', rest: '45 sn' },
      4: { label: 'Tek ayak yükseltilmiş', detail: '3 × 20 sn / bacak', rest: '45 sn' },
    },
  },
  stepup: {
    name: 'Basamağa çıkış (step-up)', pattern: 'Bacak (tek taraf)', muscles: ['bacak'], illo: 'stepup',
    caution: 'Sağlam bir basamak/sehpa kullan, ittirmek için arka ayağı kullanma.',
    steps: ['Sağlam, alçak bir basamağın önünde dur.', 'Bir ayağını tam basamağa koy.', 'Öndeki topuktan güç alıp yukarı çık.', 'Kontrollü in, bacak değiştir.'],
    levels: {
      1: { label: 'Alçak basamak', detail: '2 set × 6 / bacak', rest: '60 sn' },
      2: { label: 'Basamağa çıkış', detail: '2 set × 8 / bacak', rest: '60 sn' },
      3: { label: 'Diz çekmeli çıkış', detail: '3 set × 8 / bacak', rest: '60 sn' },
      4: { label: 'Tempolu çıkış', detail: '3 set × 10 / bacak', rest: '60 sn' },
    },
  },
  calfraise: {
    name: 'Baldır (calf raise)', pattern: 'Bacak (baldır)', muscles: ['bacak'], illo: 'calfraise',
    caution: 'Dengeni kaybedersen duvara dokun. Yavaş in.',
    steps: ['Ayaklar omuz genişliğinde dur.', 'Parmak uçlarına yüksel.', 'Tepede 1 sn bekle.', 'Topukları yavaşça yere indir.'],
    levels: {
      1: { label: 'Çift ayak', detail: '2 set × 12', rest: '30 sn' },
      2: { label: 'Çift ayak (yavaş)', detail: '3 set × 15', rest: '30 sn' },
      3: { label: 'Basamak kenarında', detail: '3 set × 15', rest: '40 sn' },
      4: { label: 'Tek ayak', detail: '3 set × 10 / bacak', rest: '40 sn' },
    },
  },

  // ================= İTİŞ (üst vücut) =================
  pushup: {
    name: 'Şınav', pattern: 'Üst vücut itiş', muscles: ['gogus'], illo: 'pushup',
    caution: 'Gövde tek çizgi, bel çukurlaşmasın, dirsekleri gövdene yakın tut.',
    steps: ['Elleri omuz hizasında yere/duvara koy.', 'Vücudu baştan topuğa düz tut.', 'Dirsekleri bükerek göğsü yaklaştır.', 'İterek başlangıca dön, karnı sık.'],
    levels: {
      1: { label: 'Duvar şınavı', detail: '2 set × 8', rest: '60 sn' },
      2: { label: 'Sehpaya eğik şınav', detail: '2 set × 8', rest: '60 sn' },
      3: { label: 'Diz üstü şınav', detail: '3 set × 8', rest: '60 sn' },
      4: { label: 'Tam şınav', detail: '3 set × 8', rest: '75 sn' },
    },
  },
  tricepsdip: {
    name: 'Kol arkası (triceps dip)', pattern: 'Üst vücut itiş', muscles: ['gogus'], illo: 'tricepsdip',
    caution: 'Sağlam sandalye kullan; omuzları kulaklardan uzak tut.',
    steps: ['Sağlam sandalyenin kenarına elleri koy.', 'Kalçayı öne, kenardan kaydır.', 'Dirsekleri geriye bükerek in.', 'İterek yukarı kalk.'],
    levels: {
      1: { label: 'Ayaklar bükük, sığ', detail: '2 set × 6', rest: '45 sn' },
      2: { label: 'Sandalye dip', detail: '2 set × 8', rest: '45 sn' },
      3: { label: 'Sandalye dip', detail: '3 set × 10', rest: '60 sn' },
      4: { label: 'Ayaklar uzakta', detail: '3 set × 10', rest: '60 sn' },
    },
  },
  pikepush: {
    name: 'Pike şınav (omuz)', pattern: 'Üst vücut itiş', muscles: ['gogus'], illo: 'pikepush',
    caution: 'Boynunu koru, başını nazikçe indir. Zorlanırsan diz üstü yap.',
    steps: ['Ters V şeklinde kalçayı yukarı it.', 'Eller omuz hizasında, bakış ayaklara.', 'Dirsekleri bükerek başı ellerin arasına indir.', 'İterek yukarı kalk.'],
    levels: {
      1: { label: 'Eğik yüzey pike', detail: '2 set × 5', rest: '60 sn' },
      2: { label: 'Pike şınav', detail: '2 set × 6', rest: '60 sn' },
      3: { label: 'Pike şınav', detail: '3 set × 8', rest: '60 sn' },
      4: { label: 'Ayak yükseltilmiş pike', detail: '3 set × 8', rest: '75 sn' },
    },
  },

  // ================= KALÇA / SIRT (arka zincir) =================
  glutebridge: {
    name: 'Kalça köprüsü', pattern: 'Kalça (menteşe)', muscles: ['kalca'], illo: 'bridge',
    caution: 'Tepede kalçayı sık, beli değil kalçayı çalıştır.',
    steps: ['Sırt üstü yat, dizler bükük, ayaklar yerde.', 'Topuklardan güç alıp kalçayı yukarı it.', 'Tepede kalçayı sık, 1 sn bekle.', 'Kontrollü indir.'],
    levels: {
      1: { label: 'Kalça köprüsü', detail: '2 set × 10', rest: '45 sn' },
      2: { label: '2 sn beklemeli köprü', detail: '2 set × 10', rest: '45 sn' },
      3: { label: 'Tek ayak köprü', detail: '3 set × 6 / bacak', rest: '60 sn' },
      4: { label: 'Ayak yükseltilmiş köprü', detail: '3 set × 12', rest: '60 sn' },
    },
  },
  superman: {
    name: 'Superman (sırt)', pattern: 'Sırt / postür', muscles: ['sirt'], illo: 'superman',
    caution: 'Boynunu zorlama, bakışın yere baksın. Postür için çok değerli.',
    steps: ['Yüzüstü yat, kollar öne uzansın.', 'Kolları ve bacakları aynı anda yerden kaldır.', 'Kürek kemiklerini sık, boynu uzat.', 'Kontrollü indir.'],
    levels: {
      1: { label: 'Superman tut', detail: '3 set × 10 sn', rest: '40 sn' },
      2: { label: 'Superman kaldır-indir', detail: '3 set × 8', rest: '40 sn' },
      3: { label: 'Yüzücü (çapraz kol-bacak)', detail: '3 set × 20 sn', rest: '45 sn' },
      4: { label: 'Superman + 3 sn bekle', detail: '3 set × 10', rest: '45 sn' },
    },
  },
  towelrow: {
    name: 'Havlu ile çekme (row)', pattern: 'Sırt (çekiş)', muscles: ['sirt'], illo: 'towelrow',
    caution: 'Sırtı düz tut, çekişi kürek kemiklerinden başlat.',
    steps: ['Havluyu sağlam bir kapı koluna/direğe dola.', 'Uçlarını tut, hafif geriye yaslan.', 'Kürek kemiklerini sıkarak gövdeni çek.', 'Kontrollü geri bırak.'],
    levels: {
      1: { label: 'Dik açı çekme', detail: '2 set × 8', rest: '45 sn' },
      2: { label: 'Havlu row', detail: '2 set × 10', rest: '45 sn' },
      3: { label: 'Daha yatık row', detail: '3 set × 10', rest: '60 sn' },
      4: { label: 'Tek kol row', detail: '3 set × 8 / kol', rest: '60 sn' },
    },
  },
  reverseplank: {
    name: 'Ters plank', pattern: 'Arka zincir (izometrik)', muscles: ['sirt'], illo: 'reverseplank',
    caution: 'Kalça düşmesin; boynu rahat bırak.',
    steps: ['Otur, elleri kalçanın arkasına koy.', 'Topuklardan destek al, kalçayı yukarı it.', 'Vücudu baştan topuğa düz tut.', 'Nefes alarak pozisyonu koru.'],
    levels: {
      1: { label: 'Masa pozisyonu (dizler bükük)', detail: '3 × 15 sn', rest: '40 sn' },
      2: { label: 'Ters plank', detail: '3 × 20 sn', rest: '40 sn' },
      3: { label: 'Ters plank', detail: '3 × 30 sn', rest: '45 sn' },
      4: { label: 'Tek bacak kaldırmalı', detail: '3 × 15 sn / bacak', rest: '45 sn' },
    },
  },

  // ================= MERKEZ (core) =================
  plank: {
    name: 'Plank', pattern: 'Merkez (core)', muscles: ['core'], illo: 'plank',
    caution: 'Kalça çok yükselmesin/düşmesin, karın sıkı.',
    steps: ['Dirsekler omuz altında, önkollar yerde.', 'Vücudu baştan topuğa düz tut.', 'Karnı ve kalçayı sık.', 'Normal nefes al, süreyi koru.'],
    levels: {
      1: { label: 'Diz üstü plank', detail: '3 set × 15 sn', rest: '40 sn' },
      2: { label: 'Plank', detail: '3 set × 20 sn', rest: '40 sn' },
      3: { label: 'Plank', detail: '3 set × 30 sn', rest: '45 sn' },
      4: { label: 'Plank + omuz dokunuş', detail: '3 set × 30 sn', rest: '45 sn' },
    },
  },
  sideplank: {
    name: 'Yan plank', pattern: 'Yan merkez', muscles: ['core'], illo: 'sideplank',
    caution: 'Kalça düşmesin, gövde tek çizgi olsun.',
    steps: ['Yan yat, dirsek omuz altında.', 'Kalçayı yukarı kaldır.', 'Vücut baştan ayağa tek çizgi.', 'Süreyi koru, taraf değiştir.'],
    levels: {
      1: { label: 'Diz üstü yan plank', detail: '2 set × 12 sn / yön', rest: '30 sn' },
      2: { label: 'Yan plank', detail: '2 set × 15 sn / yön', rest: '30 sn' },
      3: { label: 'Yan plank', detail: '2 set × 20 sn / yön', rest: '40 sn' },
      4: { label: 'Kalça iniş-kalkış', detail: '2 set × 10 / yön', rest: '40 sn' },
    },
  },
  deadbug: {
    name: 'Ölü böcek (dead bug)', pattern: 'Merkez (stabilite)', muscles: ['core'], illo: 'deadbug',
    caution: 'Belin yere yapışık kalsın, hareket yavaş ve kontrollü.',
    steps: ['Sırt üstü yat, kollar tavana, dizler 90°.', 'Zıt kol ve bacağı yavaşça yere doğru uzat.', 'Bel yere yapışık kalsın.', 'Başlangıca dön, taraf değiştir.'],
    levels: {
      1: { label: 'Dead bug (yavaş)', detail: '2 set × 6 / yön', rest: '30 sn' },
      2: { label: 'Dead bug', detail: '2 set × 8 / yön', rest: '30 sn' },
      3: { label: 'Dead bug', detail: '3 set × 8 / yön', rest: '40 sn' },
      4: { label: 'Uzun kol-bacak', detail: '3 set × 10 / yön', rest: '40 sn' },
    },
  },
  birddog: {
    name: 'Bird-dog', pattern: 'Merkez (denge)', muscles: ['core'], illo: 'birddog',
    caution: 'Bel sallanmasın; kalça yere paralel kalsın.',
    steps: ['Elle-diz üstü dur (masa pozisyonu).', 'Zıt kol ve bacağı aynı anda uzat.', 'Vücut baştan topuğa düz, 2 sn tut.', 'Geri çek, taraf değiştir.'],
    levels: {
      1: { label: 'Sadece kol veya bacak', detail: '2 set × 6 / yön', rest: '30 sn' },
      2: { label: 'Zıt kol-bacak', detail: '2 set × 8 / yön', rest: '30 sn' },
      3: { label: '2 sn beklemeli', detail: '3 set × 8 / yön', rest: '40 sn' },
      4: { label: 'Dirsek-diz dokunuşlu', detail: '3 set × 10 / yön', rest: '40 sn' },
    },
  },
  hollowhold: {
    name: 'Tekne (hollow hold)', pattern: 'Merkez (izometrik)', muscles: ['core'], illo: 'hollow',
    caution: 'Bel yere yapışık kalmıyorsa kol/bacağı daha yukarı al.',
    steps: ['Sırt üstü yat, bel yere yapışık.', 'Omuzları ve bacakları hafif yerden kaldır.', 'Vücut kayık gibi çukur olsun.', 'Karnı sık, süreyi koru.'],
    levels: {
      1: { label: 'Dizler bükük tut', detail: '3 × 15 sn', rest: '40 sn' },
      2: { label: 'Hollow hold', detail: '3 × 20 sn', rest: '40 sn' },
      3: { label: 'Hollow hold', detail: '3 × 30 sn', rest: '45 sn' },
      4: { label: 'Hollow sallanma', detail: '3 × 20 sn', rest: '45 sn' },
    },
  },
  mountainclimber: {
    name: 'Dağcı (mountain climber)', pattern: 'Merkez + kondisyon', muscles: ['core'], illo: 'mountainclimber',
    caution: 'Kalça yükselmesin; kontrollü tempo, sıçrama değil.',
    steps: ['Şınav (plank) pozisyonunda başla.', 'Bir dizini göğsüne doğru çek.', 'Bacak değiştir, yürür gibi.', 'Kalçayı sabit ve düz tut.'],
    levels: {
      1: { label: 'Yavaş dağcı', detail: '3 × 20 sn', rest: '40 sn' },
      2: { label: 'Dağcı', detail: '3 × 25 sn', rest: '40 sn' },
      3: { label: 'Dağcı', detail: '3 × 30 sn', rest: '40 sn' },
      4: { label: 'Çapraz dağcı', detail: '3 × 30 sn', rest: '40 sn' },
    },
  },

  // ================= FUTBOL ÇEVİKLİK / KONDİSYON =================
  fastfeet: {
    name: 'Yerinde hızlı ayak', pattern: 'Çeviklik', muscles: ['kondisyon'], illo: 'running',
    caution: 'Yumuşak bas, gürültüsüz. Dizler hafif bükük, eklemi koru.',
    steps: ['Hafif çömel, ağırlık ön ayakta.', 'Ayakları hızlıca sırayla yere vur.', 'Adımlar küçük ve hızlı olsun.', 'Kolları da hızlı salla.'],
    levels: {
      1: { label: 'Hızlı ayak', detail: '3 × 15 sn', rest: '30 sn' },
      2: { label: 'Hızlı ayak', detail: '3 × 20 sn', rest: '30 sn' },
      3: { label: 'Hızlı ayak', detail: '4 × 20 sn', rest: '30 sn' },
      4: { label: 'Hızlı ayak', detail: '4 × 30 sn', rest: '30 sn' },
    },
  },
  highknees: {
    name: 'Diz çekme koşusu', pattern: 'Çeviklik / kondisyon', muscles: ['kondisyon'], illo: 'running',
    caution: 'Yumuşak in, dizleri kontrollü çek. Sert basma.',
    steps: ['Yerinde koşar gibi başla.', 'Dizleri kalça hizasına çek.', 'Ön ayak ucuna yumuşak bas.', 'Kolları ritimle çalıştır.'],
    levels: {
      1: { label: 'Kontrollü diz çekme', detail: '3 × 15 sn', rest: '40 sn' },
      2: { label: 'Diz çekme', detail: '3 × 20 sn', rest: '40 sn' },
      3: { label: 'Diz çekme', detail: '4 × 20 sn', rest: '40 sn' },
      4: { label: 'Hızlı diz çekme', detail: '4 × 25 sn', rest: '40 sn' },
    },
  },
  shuffle: {
    name: 'Yana kayış adım (shuffle)', pattern: 'Yön değiştirme', muscles: ['kondisyon'], illo: 'shuffle',
    caution: 'Kısa mesafe, kontrollü dur. Ani sert dönüş yok.',
    steps: ['Hafif çömel, atletik duruş al.', 'Yana doğru kayarak adımla.', 'Ayakları birbirine çarptırma.', 'Kontrollü dur, yön değiştir.'],
    levels: {
      1: { label: 'Yana shuffle', detail: '2 × 20 sn', rest: '40 sn' },
      2: { label: 'Yana shuffle', detail: '3 × 20 sn', rest: '40 sn' },
      3: { label: 'Dokunuşlu shuffle', detail: '3 × 25 sn', rest: '40 sn' },
      4: { label: 'Hızlı shuffle', detail: '4 × 25 sn', rest: '40 sn' },
    },
  },
  carioca: {
    name: 'Çapraz adım (carioca)', pattern: 'Koordinasyon', muscles: ['kondisyon'], illo: 'shuffle',
    caution: 'Yavaş başla, kalçayı serbest bırak. Karışırsa yavaşla.',
    steps: ['Yana doğru hareket et.', 'Bir ayağı diğerinin önünden çapraz at.', 'Sonra arkasından çapraz at.', 'Kalçayı serbest, ritmik salla.'],
    levels: {
      1: { label: 'Yavaş carioca', detail: '2 × 20 sn', rest: '40 sn' },
      2: { label: 'Carioca', detail: '3 × 20 sn', rest: '40 sn' },
      3: { label: 'Carioca', detail: '3 × 25 sn', rest: '40 sn' },
      4: { label: 'Hızlı carioca', detail: '4 × 25 sn', rest: '40 sn' },
    },
  },
  balltap: {
    name: 'Top üstü ayak değiştirme', pattern: 'Futbol becerisi', muscles: ['kondisyon'], illo: 'balltap',
    caution: 'Top yoksa hayali topla yap. Dik dur, başını kaldır.',
    steps: ['Topu önüne koy (yoksa hayali).', 'Ayak tabanıyla topun üstüne hafif dokun.', 'Hızlıca ayak değiştir.', 'Dik dur, dengeni koru.'],
    levels: {
      1: { label: 'Top üstü dokunuş', detail: '3 × 20 sn', rest: '30 sn' },
      2: { label: 'Top üstü dokunuş', detail: '3 × 30 sn', rest: '30 sn' },
      3: { label: 'Geri çekmeli', detail: '4 × 30 sn', rest: '30 sn' },
      4: { label: 'Hızlı ritim', detail: '4 × 40 sn', rest: '30 sn' },
    },
  },
  balance: {
    name: 'Tek ayak denge', pattern: 'Denge / kontrol', muscles: ['denge'], illo: 'balance',
    caution: 'Zorlanınca duvara hafif dokun. Futbolda denge çok işe yarar.',
    steps: ['Tek ayak üstünde dur.', 'Diğer dizi hafif kaldır.', 'Karnı sık, bakışı sabitle.', 'Süreyi koru, bacak değiştir.'],
    levels: {
      1: { label: 'Tek ayak duruş', detail: '3 × 20 sn / bacak', rest: '20 sn' },
      2: { label: 'Kol hareketli', detail: '3 × 25 sn / bacak', rest: '20 sn' },
      3: { label: 'Öne uzanmalı', detail: '3 × 8 / bacak', rest: '30 sn' },
      4: { label: 'Gözler kapalı', detail: '3 × 20 sn / bacak', rest: '30 sn' },
    },
  },

  // ================= GÖLGE BOKSU / KİŞİSEL GÜVENLİK =================
  stance: {
    name: 'Boks duruşu & korunma', pattern: 'Savunma temeli', muscles: ['beceri'], illo: 'stance',
    caution: 'Eller çene hizasında, çene içeride, dizler hafif bükük.',
    steps: ['Zayıf ayak önde, güçlü ayak arkada dur.', 'Dizleri hafif bük, ağırlığı dağıt.', 'Elleri çene hizasında tut (korunma).', 'Dirsekleri gövdene yakın, çeneyi içeri al.'],
    levels: {
      1: { label: 'Duruş & korunmayı tut', detail: '2 × 30 sn', rest: '20 sn' },
      2: { label: 'Öne-arka adım', detail: '2 × 40 sn', rest: '20 sn' },
      3: { label: 'Yön değiştirme', detail: '3 × 40 sn', rest: '20 sn' },
      4: { label: 'Sürekli ayak', detail: '3 × 60 sn', rest: '20 sn' },
    },
  },
  footwork: {
    name: 'Ayak çalışması', pattern: 'Savunma / hareket', muscles: ['beceri'], illo: 'stance',
    caution: 'Ayakları birbirine çarptırma; ağırlık ön ayakta kalsın.',
    steps: ['Boks duruşunda başla.', 'Öne-arkaya küçük kaydırma adımları at.', 'Sonra yana adımla.', 'Elleri hep korunmada tut.'],
    levels: {
      1: { label: 'Öne-arka adım', detail: '2 × 30 sn', rest: '20 sn' },
      2: { label: 'Öne-arka-yan', detail: '3 × 30 sn', rest: '20 sn' },
      3: { label: 'Yön değiştirmeli', detail: '3 × 40 sn', rest: '20 sn' },
      4: { label: 'Hızlı ayak + korunma', detail: '3 × 45 sn', rest: '20 sn' },
    },
  },
  jab: {
    name: 'Sol direkt (jab)', pattern: 'Yumruk tekniği', muscles: ['beceri'], illo: 'punch',
    caution: 'Dirseği tam kilitleme, atınca diğer el çeneyi korusun. Omuz gevşek.',
    steps: ['Boks duruşunda başla.', 'Öndeki eli düz öne uzat.', 'Yumruğu atarken hafif döndür.', 'Hemen geri çek, çeneyi koru.'],
    levels: {
      1: { label: 'Jab tekrarı', detail: '2 × 30 sn', rest: '30 sn' },
      2: { label: 'Jab tekrarı', detail: '3 × 30 sn', rest: '30 sn' },
      3: { label: 'Jab + adım', detail: '3 × 40 sn', rest: '30 sn' },
      4: { label: 'Çift jab + adım', detail: '3 × 45 sn', rest: '30 sn' },
    },
  },
  cross: {
    name: 'Sağ direkt (cross)', pattern: 'Yumruk tekniği', muscles: ['beceri'], illo: 'punch',
    caution: 'Gücü kalçadan al, belini yumuşak çevir. Diğer el çenede.',
    steps: ['Boks duruşunda başla.', 'Arka eli düz öne uzat.', 'Arka topuğu döndürüp kalçayı çevir.', 'Geri çek, çeneyi koru.'],
    levels: {
      1: { label: 'Cross tekrarı', detail: '2 × 30 sn', rest: '30 sn' },
      2: { label: 'Cross tekrarı', detail: '3 × 30 sn', rest: '30 sn' },
      3: { label: 'Jab-Cross', detail: '3 × 40 sn', rest: '30 sn' },
      4: { label: 'Jab-Cross + kaçış', detail: '3 × 45 sn', rest: '30 sn' },
    },
  },
  hook: {
    name: 'Kroşe (hook)', pattern: 'Yumruk tekniği', muscles: ['beceri'], illo: 'punch',
    caution: 'Dirsek 90° kalsın; gücü gövde dönüşünden al, kolu savurma.',
    steps: ['Boks duruşunda başla.', 'Ön kolu 90° bük, yana getir.', 'Gövdeni döndürerek yatay yumruk at.', 'Diğer el çenede kalsın.'],
    levels: {
      1: { label: 'Yavaş hook (teknik)', detail: '2 × 30 sn', rest: '30 sn' },
      2: { label: 'Sol-sağ hook', detail: '3 × 30 sn', rest: '30 sn' },
      3: { label: 'Jab-Cross-Hook', detail: '3 × 40 sn', rest: '30 sn' },
      4: { label: 'Kombinasyon + kaçış', detail: '3 × 45 sn', rest: '30 sn' },
    },
  },
  jabcross: {
    name: 'Jab-Cross kombinasyonu', pattern: 'Kombinasyon', muscles: ['beceri'], illo: 'punch',
    caution: 'Her yumruktan sonra el çeneye dönsün. Nefesi tut.',
    steps: ['Jab (ön el) at.', 'Hemen cross (arka el) ile takip et.', 'Kalçayı cross\'ta döndür.', 'İki eli de korunmaya geri getir.'],
    levels: {
      1: { label: '1-2 yavaş', detail: '2 × 30 sn', rest: '30 sn' },
      2: { label: '1-2 kombinasyon', detail: '3 × 30 sn', rest: '30 sn' },
      3: { label: '1-2 + adım', detail: '3 × 40 sn', rest: '30 sn' },
      4: { label: '1-2-3 kombinasyon', detail: '3 × 45 sn', rest: '30 sn' },
    },
  },
  slip: {
    name: 'Baş kaçırma (slip)', pattern: 'Savunma', muscles: ['beceri'], illo: 'slip',
    caution: 'Belden değil dizden hafif bük; gözler hep ileride.',
    steps: ['Boks duruşunda, eller korunmada.', 'Dizleri hafif bükerek gövdeyi yana kaydır.', 'Başı hayali yumruğun dışına al.', 'Hemen merkeze dön, diğer yöne slip.'],
    levels: {
      1: { label: 'Yavaş sağ-sol slip', detail: '2 × 30 sn', rest: '30 sn' },
      2: { label: 'Slip', detail: '3 × 30 sn', rest: '30 sn' },
      3: { label: 'Slip + jab', detail: '3 × 40 sn', rest: '30 sn' },
      4: { label: 'Slip + kombinasyon', detail: '3 × 45 sn', rest: '30 sn' },
    },
  },
  shadowround: {
    name: 'Gölge boksu turu', pattern: 'Serbest kombinasyon', muscles: ['beceri'], illo: 'stance',
    caution: 'Kendi ritminde, sürekli hareket et, nefesini tut. Eğlen!',
    steps: ['Boks duruşunda sürekli hareket et.', 'Jab-cross-hook karıştır.', 'Arada slip ve ayak çalışması ekle.', 'Elleri hep korunmada tut, nefes al.'],
    levels: {
      1: { label: 'Gölge boksu', detail: '2 tur × 30 sn', rest: '30 sn' },
      2: { label: 'Gölge boksu', detail: '3 tur × 30 sn', rest: '30 sn' },
      3: { label: 'Gölge boksu', detail: '3 tur × 45 sn', rest: '30 sn' },
      4: { label: 'Gölge boksu', detail: '3 tur × 60 sn', rest: '45 sn' },
    },
  },
}

// ---- Kategori havuzları (rotasyon için) ----
const POOLS = {
  legs: ['squat', 'lunge', 'wallsit', 'stepup', 'calfraise'],
  push: ['pushup', 'tricepsdip', 'pikepush'],
  posterior: ['glutebridge', 'superman', 'towelrow', 'reverseplank'],
  core: ['plank', 'sideplank', 'deadbug', 'birddog', 'hollowhold', 'mountainclimber'],
  agility: ['fastfeet', 'highknees', 'shuffle', 'carioca', 'balltap'],
  strikes: ['jab', 'cross', 'hook', 'jabcross', 'slip'],
}

// ---- Haftalık şablon: hafta günü (0=Pazar) → seans tipi ----
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

// Yıl içindeki gün numarası (rotasyon tohumu — gün başına kararlı çeşitlilik).
function dayOfYear(dateKey) {
  const d = dateFromKey(dateKey)
  const start = new Date(d.getFullYear(), 0, 0)
  return Math.floor((d - start) / 86400000)
}

// Havuzdan tohuma göre tek eleman seç (kararlı rotasyon).
function rot(pool, seed) {
  const i = ((seed % pool.length) + pool.length) % pool.length
  return pool[i]
}

// Havuzdan k adet farklı eleman seç.
function pickN(pool, k, seed) {
  const out = []
  for (let i = 0; out.length < k && i < pool.length * 2; i++) {
    const c = rot(pool, seed + i)
    if (!out.includes(c)) out.push(c)
  }
  return out
}

// Seviyeyi 1-4 aralığına sabitler
function clampLevel(level) {
  return Math.max(1, Math.min(4, level || 1))
}

// Güne göre seans blok kompozisyonunu (hareket anahtarları) üretir — rotasyonlu.
function buildComposition(type, dateKey) {
  const s = dayOfYear(dateKey)
  if (type === 'strength_boxing') {
    return [
      { title: 'Kuvvet', keys: [rot(POOLS.legs, s), rot(POOLS.push, s), rot(POOLS.posterior, s), rot(POOLS.core, s)] },
      { title: 'Gölge Boksu', keys: uniq([...pickN(POOLS.strikes, 2, s), 'shadowround']) },
    ]
  }
  if (type === 'football_agility') {
    return [
      { title: 'Futbol & Çeviklik', keys: [...pickN(POOLS.agility, 3, s), 'balance'] },
      { title: 'Merkez (Core)', keys: pickN(POOLS.core, 2, s + 1) },
      { title: 'Gölge Boksu', keys: ['footwork', 'shadowround'] },
    ]
  }
  // strength_full
  return [
    { title: 'Tüm Vücut Kuvvet', keys: uniq([rot(POOLS.legs, s), rot(POOLS.legs, s + 1), rot(POOLS.push, s), rot(POOLS.posterior, s), rot(POOLS.core, s), rot(POOLS.core, s + 3)]) },
    { title: 'Kondisyon', keys: [rot(POOLS.agility, s)] },
  ]
}

function uniq(arr) {
  return [...new Set(arr)]
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
    steps: mv.steps || null,
    illo: mv.illo || null,
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
    steps: item.steps || null,
    illo: item.illo || null,
  }
}

// Verilen gün + seviye için tam seansı üretir.
export function generateSession(dateKey, level) {
  const type = getSessionType(dateKey)
  const meta = SESSION_META[type]
  const blocks = []

  if (type === 'active_recovery') {
    blocks.push({ title: 'Aktif Dinlenme', items: RECOVERY.map((i) => fixedItem(dateKey, i)) })
  } else if (type === 'rest') {
    blocks.push({ title: 'Hafif Esneme (isteğe bağlı)', items: REST.map((i) => fixedItem(dateKey, i)) })
  } else {
    // Antrenman günü: ısınma → ana bloklar → soğuma
    blocks.push({ title: 'Isınma', items: WARMUP.map((i) => fixedItem(dateKey, i)) })
    for (const block of buildComposition(type, dateKey)) {
      blocks.push({ title: block.title, items: block.keys.map((k) => moveItem(dateKey, k, level)) })
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

// Kartal'ın kendi seçtiği hareketlerden seansı üretir (ısınma + seçim + soğuma).
export function buildCustomSession(dateKey, level, customKeys) {
  const moves = (customKeys || []).filter((k) => MOVES[k])
  const blocks = [
    { title: 'Isınma', items: WARMUP.map((i) => fixedItem(dateKey, i)) },
    { title: 'Kartal’ın Seçimi', items: moves.map((k) => moveItem(dateKey, k, level)) },
    { title: 'Soğuma', items: COOLDOWN.map((i) => fixedItem(dateKey, i)) },
  ]
  const countableIds = blocks.flatMap((b) => b.items.map((i) => i.id))
  return {
    type: 'custom',
    title: 'Kendi Programın',
    est: `${moves.length} hareket`,
    isTraining: true,
    moveCount: moves.length,
    blocks,
    countableIds,
  }
}

// Kendi seçim modundaki sayılabilir id'ler (log/streak için).
export function customCountableIds(dateKey, level, customKeys) {
  return buildCustomSession(dateKey, level, customKeys).countableIds
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

// ---- Egzersiz kütüphanesi (tüm hareketleri kategoriye göre gözden geçirme) ----
// Antrenman sekmesi yalnızca o günün seansını gösterir; bu ise TÜM hareketleri
// (figür + 4 seviye + adım adım tarif) kategorilere ayırıp listeler.
const LIBRARY_GROUPS = [
  ['Bacak', POOLS.legs],
  ['İtiş (üst vücut)', POOLS.push],
  ['Sırt & Kalça', POOLS.posterior],
  ['Merkez (Core)', POOLS.core],
  ['Futbol & Çeviklik', POOLS.agility],
  ['Gölge Boksu', POOLS.strikes],
]

// Bir hareketi (tüm seviyeleriyle) kütüphane öğesine çevirir.
function libraryMove(key) {
  const mv = MOVES[key]
  return {
    key,
    name: mv.name,
    pattern: mv.pattern,
    caution: mv.caution || null,
    steps: mv.steps || null,
    illo: mv.illo || null,
    variants: [1, 2, 3, 4].map((lv) => ({
      level: lv,
      label: mv.levels[lv].label,
      detail: mv.levels[lv].detail,
      rest: mv.levels[lv].rest,
    })),
  }
}

function libraryFixed(item) {
  return {
    key: item.key,
    name: item.name,
    detail: item.detail,
    note: item.note || null,
    steps: item.steps || null,
    illo: item.illo || null,
    variants: null,
  }
}

// Kütüphaneyi bölümler halinde döndürür. MOVES'ta olup gruplara girmeyen
// hareketler (stance, footwork, shadowround, balance...) "Boks & Diğer"e düşer.
export function getLibrary() {
  const sections = []
  sections.push({ title: 'Isınma', items: WARMUP.map(libraryFixed) })

  const used = new Set()
  for (const [title, keys] of LIBRARY_GROUPS) {
    sections.push({ title, items: keys.map(libraryMove) })
    keys.forEach((k) => used.add(k))
  }

  const rest = Object.keys(MOVES).filter((k) => !used.has(k))
  if (rest.length) {
    sections.push({ title: 'Boks & Diğer', items: rest.map(libraryMove) })
  }

  sections.push({ title: 'Soğuma', items: COOLDOWN.map(libraryFixed) })
  return sections
}

// Kütüphanedeki toplam hareket sayısı (ısınma/soğuma hariç ana hareketler).
export const TOTAL_MOVE_COUNT = Object.keys(MOVES).length

// Bir hareket için hedefli YouTube arama bağlantısı üretir. Belirli video ID
// gömmek yerine arama linki kullanıyoruz: link asla ölmez, sonuç hep güncel.
export function videoUrl(name, extra = 'nasıl yapılır doğru teknik') {
  const q = `${name} ${extra}`.trim()
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(q)}`
}

// ---- Reçete ayrıştırma (rehberli antrenman için) ----
// "detail" metnini yapısal veriye çevirir: kaç set, tekrar mı süre mi, kaç sn.
// Örn: "3 set × 12" → {sets:3, reps:12}, "3 × 30 sn" → {sets:3, seconds:30},
// "20 sn / bacak" → {sets:1, seconds:20, perSide:true}, "5 nefes" → {sets:1, reps:5}.
export function parsePrescription(detail = '') {
  const d = String(detail).toLowerCase()
  const perSide = /\/\s*(bacak|yön|yon|taraf)/.test(d)

  let sets = 1
  const setsM = d.match(/(\d+)\s*(?:set|tur)\b/) || d.match(/^\s*(\d+)\s*[×x]/)
  if (setsM) sets = parseInt(setsM[1], 10)

  const snM = d.match(/(\d+)\s*sn/)
  if (snM) {
    return { sets, timed: true, seconds: parseInt(snM[1], 10), reps: null, perSide, raw: detail }
  }
  const dkM = d.match(/(\d+)(?:\s*-\s*\d+)?\s*dk/)
  if (dkM) {
    return { sets: 1, timed: true, seconds: parseInt(dkM[1], 10) * 60, reps: null, perSide, raw: detail }
  }

  let reps = null
  const repsM =
    d.match(/[×x]\s*(\d+)/) ||
    d.match(/(\d+)\s*tekrar/) ||
    d.match(/^\s*(\d+)\s*\//) ||
    d.match(/(\d+)\s*nefes/)
  if (repsM) reps = parseInt(repsM[1], 10)
  return { sets, timed: false, seconds: null, reps, perSide, raw: detail }
}
