import fs from 'fs/promises'
import path from 'path'
import type { Playlist, Track } from '@/components/molecules/MusicPlayer'

const MUSIC_DIR = path.join(process.cwd(), 'public', 'music')
const AUDIO_EXT = new Set(['.mp3', '.m4a', '.ogg', '.wav'])

/** Playlist order in the player; the first one is the default. Other folders follow alphabetically. */
const PLAYLIST_ORDER = ['nghi-le', 'bai-hat']

const isAudio = (file: string) => AUDIO_EXT.has(path.extname(file).toLowerCase())
const byName = (a: string, b: string) => a.localeCompare(b, undefined, { numeric: true })

/** "01 - Artist - Title.mp3" -> { artist, title }; number and artist are optional. */
function toTrack(folder: string, file: string): Track {
  const url = `/music/${encodeURIComponent(folder)}/${encodeURIComponent(file)}`
  const name = path.parse(file).name.replace(/^\d+\s*[-._]\s*/, '')
  const [first, ...rest] = name.split(' - ')
  return rest.length
    ? { artist: first.trim(), title: rest.join(' - ').trim(), url }
    : { title: name.trim(), url }
}

/**
 * Each sub-folder of public/music is one playlist (a mode in the player).
 * A file numbered "00" is an intro: it is played before every other track of that folder
 * (e.g. the drum roll before each ceremonial piece).
 */
export async function getPlaylists(): Promise<Playlist[]> {
  let folders: string[]
  try {
    const entries = await fs.readdir(MUSIC_DIR, { withFileTypes: true })
    folders = entries.filter((e) => e.isDirectory()).map((e) => e.name)
  } catch {
    return [] // no music folder -> no player
  }

  folders.sort((a, b) => {
    const ia = PLAYLIST_ORDER.indexOf(a)
    const ib = PLAYLIST_ORDER.indexOf(b)
    return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib) || byName(a, b)
  })

  const playlists: Playlist[] = []
  for (const folder of folders) {
    const files = (await fs.readdir(path.join(MUSIC_DIR, folder))).filter(isAudio).sort(byName)
    const introFile = files.find((f) => /^00\s*[-._]/.test(f))
    const mainFiles = files.filter((f) => f !== introFile)
    if (mainFiles.length === 0) continue

    const intro = introFile ? { ...toTrack(folder, introFile), isIntro: true } : null
    const tracks = mainFiles.flatMap((f) => (intro ? [intro, toTrack(folder, f)] : [toTrack(folder, f)]))
    playlists.push({ id: folder, tracks })
  }
  return playlists
}
