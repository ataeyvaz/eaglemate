import { useCallback, useEffect, useRef, useState } from 'react'

// Geri sayım zamanlayıcısı. Durum App seviyesinde tutulur ki sekme değişince
// sayaç sıfırlanmasın / çalışmaya devam etsin.
export function useTimer(onDone) {
  const [seconds, setSeconds] = useState(0)
  const [total, setTotal] = useState(0)
  const [running, setRunning] = useState(false)
  const intervalRef = useRef(null)
  const secondsRef = useRef(0)
  secondsRef.current = seconds
  const doneRef = useRef(onDone)
  doneRef.current = onDone

  const clear = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }

  const start = useCallback(() => {
    if (secondsRef.current <= 0) return // 0 iken başlatma
    setRunning(true)
  }, [])

  // running true olduğunda sayaç interval'ini kur
  useEffect(() => {
    if (!running) return
    intervalRef.current = setInterval(() => {
      setSeconds((s) => {
        if (s <= 1) {
          clear()
          setRunning(false)
          if (doneRef.current) doneRef.current()
          return 0
        }
        return s - 1
      })
    }, 1000)
    return clear
  }, [running])

  const pause = useCallback(() => {
    setRunning(false)
    clear()
  }, [])

  const reset = useCallback(() => {
    setRunning(false)
    clear()
    setSeconds(total)
  }, [total])

  const setMinutes = useCallback((mins) => {
    setRunning(false)
    clear()
    setTotal(mins * 60)
    setSeconds(mins * 60)
  }, [])

  return { seconds, total, running, start, pause, reset, setMinutes }
}
