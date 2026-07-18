import { useCallback, useEffect, useRef, useState } from 'react'
import { storage } from '../lib/storage'
import { notifications } from '../lib/notifications'
import { dayKey, todayKey } from '../lib/date'
import { sessionCountableIds } from '../data/program'
import { SEED_DECKS, normalizeCard } from '../data/languages'
import { schedule } from '../data/srs'
import { READY_DECKS } from '../data/readyDecks'
import { audioStore } from '../lib/audioStore'

const STORAGE_KEY = 'eaglemate-data'

const emptyData = {
  today: [], // "Bugün" sekmesindeki serbest günlük görevler
  alarms: [],
  log: {}, //      { 'YYYY-MM-DD': { done, total } }
  sessions: {}, // { 'YYYY-MM-DD': { checked: { itemId: true }, full: bool } }
  program: { level: 1, levelSince: '2000-01-01' }, // antrenman ilerlemesi
  lang: {
    activeLang: 'en',
    decks: SEED_DECKS, //  { en: [...], de: [...], es: [...] }
    srs: {}, //           { cardId: { stage, due, lastResult } }
  },
  books: [], //       { id, title, author, progress, createdAt }
  recordings: [], //  { id, bookId, date, durationMs, mimeType, audioRef, note }
}

// Bir günün toplam tamamlanma sayısını (serbest görevler + o günün antrenman
// seansı) hesaplar. Streak ve halka yüzdesi buradan beslenir.
function dayCounts(data, dateKey = todayKey()) {
  const level = data.program?.level || 1
  const ids = sessionCountableIds(dateKey, level)
  const checked = data.sessions?.[dateKey]?.checked || {}
  const sessionDone = ids.filter((id) => checked[id]).length
  const todayDone = data.today.filter((x) => x.done).length
  return {
    done: todayDone + sessionDone,
    total: data.today.length + ids.length,
  }
}

// Uygulamanın tüm kalıcı durumunu ve üzerinde işlem yapan aksiyonları döndürür.
export function useEagleState() {
  const [data, setData] = useState(emptyData)
  const [loaded, setLoaded] = useState(false)
  const saveTimer = useRef(null)

  // İlk yükleme
  useEffect(() => {
    let active = true

    // Güvence: depolama herhangi bir sebeple (WebView takılması vb.) 4 sn içinde
    // yanıt vermezse yine de arayüzü aç — "Yükleniyor…" ekranında donmayı önler.
    const safety = setTimeout(() => {
      if (active) setLoaded(true)
    }, 4000)

    ;(async () => {
      try {
        const raw = await storage.get(STORAGE_KEY)
        if (raw && active) {
          const parsed = JSON.parse(raw)
          setData({
            ...emptyData,
            ...parsed,
            program: { ...emptyData.program, ...(parsed.program || {}) },
            lang: {
              ...emptyData.lang,
              ...(parsed.lang || {}),
              decks: { ...emptyData.lang.decks, ...(parsed.lang?.decks || {}) },
            },
          })
        }
      } catch {
        /* henüz veri yok */
      } finally {
        if (active) {
          clearTimeout(safety)
          setLoaded(true)
        }
      }
    })()
    return () => {
      active = false
      clearTimeout(safety)
    }
  }, [])

  // Değişiklikleri (debounce ile) kalıcı depoya yaz
  useEffect(() => {
    if (!loaded) return
    if (saveTimer.current) clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(() => {
      storage
        .set(
          STORAGE_KEY,
          JSON.stringify({
            today: data.today,
            alarms: data.alarms,
            log: data.log,
            sessions: data.sessions,
            program: data.program,
            lang: data.lang,
            books: data.books,
            recordings: data.recordings,
          })
        )
        .catch((e) => console.error('kaydetme hatası', e))
    }, 150)
    return () => saveTimer.current && clearTimeout(saveTimer.current)
  }, [data, loaded])

  // Bugünün log kaydını (serbest görev + seans) yeniden hesaplar.
  const withUpdatedLog = useCallback((next) => {
    const { done, total } = dayCounts(next)
    return { ...next, log: { ...next.log, [todayKey()]: { done, total } } }
  }, [])

  // ---- Serbest günlük görev aksiyonları ("Bugün" sekmesi) ----
  const addTask = useCallback(
    (listName, text) => {
      const t = text.trim()
      if (!t) return
      setData((prev) =>
        withUpdatedLog({
          ...prev,
          [listName]: [
            ...prev[listName],
            { id: Date.now() + Math.random(), text: t, done: false },
          ],
        })
      )
    },
    [withUpdatedLog]
  )

  const toggleTask = useCallback(
    (listName, id) => {
      setData((prev) =>
        withUpdatedLog({
          ...prev,
          [listName]: prev[listName].map((x) =>
            x.id === id ? { ...x, done: !x.done } : x
          ),
        })
      )
    },
    [withUpdatedLog]
  )

  const delTask = useCallback(
    (listName, id) => {
      setData((prev) =>
        withUpdatedLog({
          ...prev,
          [listName]: prev[listName].filter((x) => x.id !== id),
        })
      )
    },
    [withUpdatedLog]
  )

  // ---- Antrenman seansı aksiyonları ----
  // Bir seans öğesini işaretler/kaldırır. allIds: o günün tüm sayılabilir
  // öğe id'leri (tam tamamlanma tespiti için).
  const toggleSessionItem = useCallback((itemId, allIds) => {
    const dk = todayKey()
    setData((prev) => {
      const cur = prev.sessions?.[dk]?.checked || {}
      const nextChecked = { ...cur, [itemId]: !cur[itemId] }
      const done = allIds.filter((id) => nextChecked[id]).length
      const full = allIds.length > 0 && done === allIds.length
      const sessions = { ...prev.sessions, [dk]: { checked: nextChecked, full } }
      const next = { ...prev, sessions }
      const counts = dayCounts(next)
      return { ...next, log: { ...next.log, [dk]: counts } }
    })
  }, [])

  // Program seviyesini değiştirir (atla / düşür). levelSince sıfırlanır ki
  // yeni seviyedeki tamamlanan günler baştan sayılsın.
  const setLevel = useCallback((level) => {
    const clamped = Math.max(1, Math.min(4, level))
    setData((prev) => ({
      ...prev,
      program: { level: clamped, levelSince: todayKey() },
    }))
  }, [])

  // ---- Dil modülü aksiyonları ----
  const setActiveLang = useCallback((code) => {
    setData((prev) => ({ ...prev, lang: { ...prev.lang, activeLang: code } }))
  }, [])

  // Kartı değerlendirir ve aralıklı tekrar planını günceller.
  const rateCard = useCallback((cardId, result) => {
    setData((prev) => {
      const entry = prev.lang.srs[cardId]
      const next = schedule(entry, result)
      return {
        ...prev,
        lang: { ...prev.lang, srs: { ...prev.lang.srs, [cardId]: next } },
      }
    })
  }, [])

  // aguilangevotr'dan gelen kartları içe aktarır (o dilin destesini değiştirir).
  // Dönen değer: içe aktarılan kart sayısı (0 = geçersiz).
  const importDeck = useCallback((code, rawCards) => {
    const cards = (Array.isArray(rawCards) ? rawCards : [])
      .map((c) => normalizeCard(code, c))
      .filter(Boolean)
    if (cards.length === 0) return 0
    setData((prev) => ({
      ...prev,
      lang: {
        ...prev.lang,
        activeLang: code,
        decks: { ...prev.lang.decks, [code]: cards },
      },
    }))
    return cards.length
  }, [])

  // aguilangevotr'dan üretilmiş hazır A1 destesini mevcut desteyle birleştirir
  // (id bazlı tekilleştirme — var olan tekrar durumu korunur).
  const loadReadyDeck = useCallback((code) => {
    const ready = (READY_DECKS[code] || [])
      .map((c) => normalizeCard(code, c))
      .filter(Boolean)
    if (ready.length === 0) return 0
    setData((prev) => {
      const existing = prev.lang.decks[code] || []
      const byId = new Map(existing.map((c) => [c.id, c]))
      for (const c of ready) if (!byId.has(c.id)) byId.set(c.id, c)
      return {
        ...prev,
        lang: {
          ...prev.lang,
          activeLang: code,
          decks: { ...prev.lang.decks, [code]: [...byId.values()] },
        },
      }
    })
    return ready.length
  }, [])

  // ---- Kitap günlüğü aksiyonları ----
  const addBook = useCallback((title, author, progress) => {
    const t = (title || '').trim()
    if (!t) return
    const book = {
      id: Date.now() + Math.random(),
      title: t,
      author: (author || '').trim(),
      progress: (progress || '').trim(),
      createdAt: todayKey(),
    }
    setData((prev) => ({ ...prev, books: [book, ...prev.books] }))
  }, [])

  const updateBookProgress = useCallback((id, progress) => {
    setData((prev) => ({
      ...prev,
      books: prev.books.map((b) => (b.id === id ? { ...b, progress } : b)),
    }))
  }, [])

  const delBook = useCallback((id) => {
    setData((prev) => {
      // kitabın kayıtlarının ses dosyalarını da sil
      prev.recordings
        .filter((r) => r.bookId === id)
        .forEach((r) => audioStore.remove(r.audioRef).catch(() => {}))
      return {
        ...prev,
        books: prev.books.filter((b) => b.id !== id),
        recordings: prev.recordings.filter((r) => r.bookId !== id),
      }
    })
  }, [])

  // Ses dosyası zaten audioStore ile kaydedilip audioRef alınmış olarak gelir.
  const addRecording = useCallback((bookId, { audioRef, durationMs, mimeType, note }) => {
    const rec = {
      id: Date.now() + Math.random(),
      bookId,
      date: todayKey(),
      durationMs: durationMs || 0,
      mimeType: mimeType || '',
      audioRef,
      note: (note || '').trim(),
    }
    setData((prev) => ({ ...prev, recordings: [rec, ...prev.recordings] }))
  }, [])

  const delRecording = useCallback((id) => {
    setData((prev) => {
      const rec = prev.recordings.find((r) => r.id === id)
      if (rec) audioStore.remove(rec.audioRef).catch(() => {})
      return { ...prev, recordings: prev.recordings.filter((r) => r.id !== id) }
    })
  }, [])

  // ---- Alarm aksiyonları ----
  const addAlarm = useCallback((time, label) => {
    if (!time) return
    const alarm = {
      id: Date.now() + Math.random(),
      time,
      label: label || 'Hatırlatma',
      firedToday: false,
    }
    setData((prev) => ({
      ...prev,
      alarms: [...prev.alarms, alarm].sort((a, b) => a.time.localeCompare(b.time)),
    }))
    notifications.scheduleDaily(alarm).catch(() => {})
  }, [])

  const delAlarm = useCallback((id) => {
    setData((prev) => ({ ...prev, alarms: prev.alarms.filter((a) => a.id !== id) }))
    notifications.cancel(id).catch(() => {})
  }, [])

  return {
    data,
    setData,
    loaded,
    addTask,
    toggleTask,
    delTask,
    toggleSessionItem,
    setLevel,
    setActiveLang,
    rateCard,
    importDeck,
    loadReadyDeck,
    addBook,
    updateBookProgress,
    delBook,
    addRecording,
    delRecording,
    addAlarm,
    delAlarm,
  }
}

// ---- Türetilmiş değerler ----
export function computeStreak(log) {
  let streak = 0
  const d = new Date()
  // sonsuz döngü koruması: en fazla 10 yıl geriye
  for (let guard = 0; guard < 3660; guard++) {
    const key = dayKey(d)
    const entry = log[key]
    if (entry && entry.total > 0 && entry.done === entry.total) {
      streak++
      d.setDate(d.getDate() - 1)
    } else break
  }
  return streak
}

// Bugünün tamamlanma yüzdesi (serbest görev + antrenman seansı birlikte).
export function completionPct(data) {
  const { done, total } = dayCounts(data)
  if (total === 0) return 0
  return Math.round((100 * done) / total)
}
