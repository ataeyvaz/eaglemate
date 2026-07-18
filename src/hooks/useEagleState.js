import { useCallback, useEffect, useRef, useState } from 'react'
import { storage } from '../lib/storage'
import { notifications } from '../lib/notifications'
import { dayKey, todayKey } from '../lib/date'
import { sessionCountableIds } from '../data/program'

const STORAGE_KEY = 'eaglemate-data'

const emptyData = {
  today: [], // "Bugün" sekmesindeki serbest günlük görevler
  alarms: [],
  log: {}, //      { 'YYYY-MM-DD': { done, total } }
  sessions: {}, // { 'YYYY-MM-DD': { checked: { itemId: true }, full: bool } }
  program: { level: 1, levelSince: '2000-01-01' }, // antrenman ilerlemesi
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
    ;(async () => {
      try {
        const raw = await storage.get(STORAGE_KEY)
        if (raw && active) {
          const parsed = JSON.parse(raw)
          setData({
            ...emptyData,
            ...parsed,
            program: { ...emptyData.program, ...(parsed.program || {}) },
          })
        }
      } catch {
        /* henüz veri yok */
      } finally {
        if (active) setLoaded(true)
      }
    })()
    return () => {
      active = false
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
