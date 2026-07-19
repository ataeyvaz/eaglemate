import { videoUrl } from '../data/program'
import { openExternal } from '../lib/openUrl'

// Bir hareketin YouTube video (arama) bağlantısını açan küçük düğme.
export default function ExerciseVideoLink({ name, label = '▶ Videoyu izle', className = 'ex-video' }) {
  if (!name) return null
  return (
    <button
      type="button"
      className={className}
      onClick={(e) => {
        e.stopPropagation()
        openExternal(videoUrl(name))
      }}
    >
      {label}
    </button>
  )
}
