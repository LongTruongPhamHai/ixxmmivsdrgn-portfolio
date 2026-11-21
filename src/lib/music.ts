import type { Playlist } from '@/components/molecules/MusicPlayer'
import manifest from './music-manifest.json'

/**
 * Playlists generated from public/music by scripts/generate-music-manifest.mjs
 * (runs automatically before `npm run dev` and `npm run build`).
 * After adding or renaming music, restart the dev server or run `npm run music`.
 */
export async function getPlaylists(): Promise<Playlist[]> {
  return manifest as Playlist[]
}
