// Tarih yardımcıları — prototipteki mantığın birebir karşılığı.

export function dayKey(date = new Date()) {
  return (
    date.getFullYear() +
    '-' +
    String(date.getMonth() + 1).padStart(2, '0') +
    '-' +
    String(date.getDate()).padStart(2, '0')
  )
}

export function todayKey() {
  return dayKey(new Date())
}

const WEEKDAYS_TR = ['Pz', 'Pt', 'Sa', 'Ça', 'Pe', 'Cu', 'Ct']

export function weekdayShort(date) {
  return WEEKDAYS_TR[date.getDay()]
}

// Bir gün anahtarına gün ekler, yeni gün anahtarını döndürür.
export function addDays(dateKey, days) {
  const [y, m, d] = dateKey.split('-').map(Number)
  const date = new Date(y, m - 1, d)
  date.setDate(date.getDate() + days)
  return dayKey(date)
}

// Saniyeyi "MM:SS" biçimine çevirir.
export function fmtTime(sec) {
  const m = Math.floor(sec / 60)
  const s = sec % 60
  return String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0')
}
