import { resolveVideoUrl } from '../data/program'
import { openExternal } from '../lib/openUrl'

// Bir hareketin YouTube video bağlantısını açan küçük düğme.
// moveKey varsa araştırılmış tekil video; yoksa isimle arama bağlantısı.
export default function ExerciseVideoLink({
  moveKey,
  name,
  label = '▶ Videoyu izle',
  className = 'ex-video',
}) {
  if (!name && !moveKey) return null
  return (
    <button
      type="button"
      className={className}
      onClick={(e) => {
        e.stopPropagation()
        openExternal(resolveVideoUrl(moveKey, name))
      }}
    >
      {label}
    </button>
  )
}
