import { useEffect, useRef, useState } from 'react'
import Header from './components/Header'
import Tabs from './components/Tabs'
import TaskList from './components/TaskList'
import Training from './components/Training'
import Language from './components/Language'
import Books from './components/Books'
import TimerTab from './components/TimerTab'
import Progress from './components/Progress'
import Toast from './components/Toast'
import { useEagleState, completionPct, computeStreak } from './hooks/useEagleState'
import { useTimer } from './hooks/useTimer'
import { notifications } from './lib/notifications'
import { playBeep } from './lib/sound'

export default function App() {
  const {
    data,
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
  } = useEagleState()
  const [tab, setTab] = useState('today')
  const [toast, setToast] = useState(null)

  const showToast = (text) => setToast({ text, id: Date.now() })

  const timer = useTimer(() => {
    playBeep()
    showToast('Süre doldu! Harika iş çıkardın 💪')
  })

  // Açılışta bildirim izni iste
  useEffect(() => {
    notifications.requestPermission().catch(() => {})
  }, [])

  // Native tarafta alarmları uygulama açılışında native zamanlayıcıyla senkronla
  useEffect(() => {
    if (loaded && notifications.isNative) {
      notifications.syncAll(data.alarms).catch(() => {})
    }
    // yalnızca ilk yüklemede
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loaded])

  // Web fallback: sayfa açıkken dakikalık alarm kontrolü.
  // (Native tarafta OS bildirimleri hallettiği için buna gerek yok.)
  const firedRef = useRef({}) // { alarmId: "HH:MM" en son tetiklenen dakika }
  useEffect(() => {
    if (notifications.isNative) return
    const check = () => {
      const now = new Date()
      const cur =
        String(now.getHours()).padStart(2, '0') + ':' + String(now.getMinutes()).padStart(2, '0')
      data.alarms.forEach((a) => {
        if (a.time === cur && firedRef.current[a.id] !== cur) {
          firedRef.current[a.id] = cur
          playBeep()
          showToast('⏰ ' + a.label)
          notifications.fireWebNotification(a.label)
        }
      })
    }
    check()
    const id = setInterval(check, 15000)
    return () => clearInterval(id)
  }, [data.alarms])

  if (!loaded) {
    return (
      <div className="wrap">
        <p style={{ color: 'var(--muted)', textAlign: 'center', marginTop: 40 }}>Yükleniyor…</p>
      </div>
    )
  }

  const pct = completionPct(data)
  const streak = computeStreak(data.log)

  return (
    <div className="wrap">
      <Header pct={pct} streak={streak} />
      <Tabs active={tab} onChange={setTab} />

      {tab === 'today' && (
        <TaskList
          listName="today"
          title="Günlük görevler"
          placeholder="Yeni görev ekle..."
          items={data.today}
          onAdd={addTask}
          onToggle={toggleTask}
          onDelete={delTask}
        />
      )}

      {tab === 'training' && (
        <Training
          program={data.program}
          sessions={data.sessions}
          onToggleItem={toggleSessionItem}
          onSetLevel={setLevel}
        />
      )}

      {tab === 'lang' && (
        <Language
          lang={data.lang}
          onSetLang={setActiveLang}
          onRate={rateCard}
          onImport={importDeck}
          onLoadReady={loadReadyDeck}
        />
      )}

      {tab === 'books' && (
        <Books
          books={data.books}
          recordings={data.recordings}
          onAddBook={addBook}
          onUpdateProgress={updateBookProgress}
          onDelBook={delBook}
          onAddRecording={addRecording}
          onDelRecording={delRecording}
        />
      )}

      {tab === 'timer' && (
        <TimerTab
          timer={timer}
          alarms={data.alarms}
          onAddAlarm={addAlarm}
          onDelAlarm={delAlarm}
        />
      )}

      {tab === 'progress' && <Progress log={data.log} />}

      <Toast message={toast} />
    </div>
  )
}
