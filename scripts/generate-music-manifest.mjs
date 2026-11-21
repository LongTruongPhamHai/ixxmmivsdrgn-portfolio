/**
 * Builds the music playlists from public/music into src/lib/music-manifest.json.
 * Runs before `dev` and `build` (predev/prebuild). It has to happen at build time because
 * on Vercel the files in public/ are served by the CDN and aren't readable by the server.
 *
 * Each sub-folder of public/music is one playlist (a mode in the player).
 * File name format: "01 - Artist - Title.mp3" (number and artist optional).
 * A file numbered "00" is an intro played before every other track of that folder.
 */
import fs from 'fs'
import path from 'path'

const MUSIC_DIR = path.join(process.cwd(), 'public', 'music')
const OUT_FILE = path.join(process.cwd(), 'src', 'lib', 'music-manifest.json')
const AUDIO_EXT = new Set(['.mp3', '.m4a', '.ogg', '.wav'])
/** Playlist order in the player; the first one is the default. Others follow alphabetically. */
const PLAYLIST_ORDER = ['nghi-le', 'bai-hat']

const byName = (a, b) => a.localeCompare(b, undefined, { numeric: true })

function toTrack(folder, file) {
  const url = `/music/${encodeURIComponent(folder)}/${encodeURIComponent(file)}`
  const name = path.parse(file).name.replace(/^\d+\s*[-._]\s*/, '')
  const [first, ...rest] = name.split(' - ')
  return rest.length
    ? { artist: first.trim(), title: rest.join(' - ').trim(), url }
    : { title: name.trim(), url }
}

let folders = []
if (fs.existsSync(MUSIC_DIR)) {
  folders = fs
    .readdirSync(MUSIC_DIR, { withFileTypes: true })
    .filter((e) => e.isDirectory())
    .map((e) => e.name)
    .sort((a, b) => {
      const ia = PLAYLIST_ORDER.indexOf(a)
      const ib = PLAYLIST_ORDER.indexOf(b)
      return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib) || byName(a, b)
    })
}

const playlists = []
for (const folder of folders) {
  const files = fs
    .readdirSync(path.join(MUSIC_DIR, folder))
    .filter((f) => AUDIO_EXT.has(path.extname(f).toLowerCase()))
    .sort(byName)
  const introFile = files.find((f) => /^00\s*[-._]/.test(f))
  const mainFiles = files.filter((f) => f !== introFile)
  if (mainFiles.length === 0) continue

  const intro = introFile ? { ...toTrack(folder, introFile), isIntro: true } : null
  const tracks = mainFiles.flatMap((f) => (intro ? [intro, toTrack(folder, f)] : [toTrack(folder, f)]))
  playlists.push({ id: folder, tracks })
}

fs.writeFileSync(OUT_FILE, JSON.stringify(playlists, null, 2) + '\n')
console.log(`music manifest: ${playlists.map((p) => `${p.id} (${p.tracks.length})`).join(', ') || 'no music'}`)
