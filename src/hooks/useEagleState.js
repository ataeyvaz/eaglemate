import { useCallback, useEffect, useRef, useState } from 'react'
import { storage } from '../lib/storage'
import { notifications } from '../lib/notifications'
import { dayKey, todayKey } from '../lib/date'

const STORAGE_KEY = 'eaglemate-data'

const emptyData = {
  today: [],
  training: [],
  alarms: [],
  log: {}, // { 'YYYY-MM-DD': { done, total } }
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
          setData({ ...emptyData, ...parsed })
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
            training: data.training,
            alarms: data.alarms,
            log: data.log,
          })
        )
        .catch((e) => console.error('kaydetme hatası', e))
    }, 150)
    return () => saveTimer.current && clearTimeout(saveTimer.current)
  }, [data, loaded])

  // Bugünün tamamlanma kaydını günceller (görev listeleri değişince çağrılır)
  const withUpdatedLog = useCallback((next) => {
    const list = [...next.today, ...next.training]
    const done = list.filter((x) => x.done).length
    const total = list.length
    return {
      ...next,
      log: { ...next.log, [todayKey()]: { done, total } },
    }
  }, [])

  // ---- Görev / antrenman aksiyonları ----
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
    addAlarm,
    delAlarm,
  }
}

// ---- Türetilmiş değerler (prototipteki hesaplamalar) ----
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

export function completionPct(data) {
  const list = [...data.today, ...data.training]
  if (list.length === 0) return 0
  return Math.round((100 * list.filter((x) => x.done).length) / list.length)
}
