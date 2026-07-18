// Ses kaydı kalıcı depolama (kitap günlüğü — Faz 4).
// Native: kayıt dosyaya (Filesystem, Data dizini) yazılır; state'te yalnızca
// dosya yolu tutulur (büyük base64 Preferences'ı şişirmesin). Oynatma için
// convertFileSrc ile WebView'ın erişebileceği bir URL üretilir.
// Web (dev): base64 doğrudan data URL olarak saklanır ve oynatılır.
import { Capacitor } from '@capacitor/core'
import { Filesystem, Directory } from '@capacitor/filesystem'

const isNative = Capacitor.isNativePlatform()
const DIR = Directory.Data
const FOLDER = 'recordings'

function extFor(mime = '') {
  if (mime.includes('aac')) return 'aac'
  if (mime.includes('mp4') || mime.includes('m4a')) return 'm4a'
  if (mime.includes('webm')) return 'webm'
  if (mime.includes('ogg')) return 'ogg'
  if (mime.includes('wav')) return 'wav'
  return 'audio'
}

export const audioStore = {
  // base64 kaydı kalıcılaştırır, sonradan çözümlenecek bir "ref" döndürür.
  async save(id, base64, mime) {
    if (isNative) {
      try {
        await Filesystem.mkdir({ path: FOLDER, directory: DIR, recursive: true })
      } catch {
        /* zaten varsa yoksay */
      }
      const path = `${FOLDER}/${id}.${extFor(mime)}`
      await Filesystem.writeFile({ path, data: base64, directory: DIR })
      return path // native ref = dosya yolu
    }
    return `data:${mime || 'audio/webm'};base64,${base64}` // web ref = data URL
  },

  // ref'i <audio src> için oynatılabilir bir kaynağa çevirir.
  async getSrc(ref) {
    if (!ref) return null
    if (ref.startsWith('data:')) return ref // web
    const { uri } = await Filesystem.getUri({ path: ref, directory: DIR })
    return Capacitor.convertFileSrc(uri)
  },

  async remove(ref) {
    if (!ref || ref.startsWith('data:')) return // web: state'ten çıkması yeterli
    try {
      await Filesystem.deleteFile({ path: ref, directory: DIR })
    } catch {
      /* yoksay */
    }
  },
}
