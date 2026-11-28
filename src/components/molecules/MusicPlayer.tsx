'use client'

import { useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import { Info, Music, Pause, Play, SkipForward, VolumeX, X } from 'lucide-react'

export interface Track {
  title: string
  artist?: string | null
  url: string
  /** Intro (e.g. drum roll) played before each piece of the playlist */
  isIntro?: boolean
}

export interface Playlist {
  /** Folder name in public/music, e.g. "nghi-le" */
  id: string
  tracks: Track[]
}

interface MusicPlayerProps {
  playlists: Playlist[]
  labels: {
    menu: string
    play: string
    pause: string
    next: string
    seek: string
    modes: Record<string, string>
    /** Popup text per playlist (falls back to the mode name) */
    popup?: Record<string, string>
    /** Shown when the browser blocks autoplay, until the visitor clicks */
    autoplayHint: string
    info: string
    /** Small link under the now-playing popup, e.g. "Xem thông tin" */
    infoLink: string
    close: string
    sources: string
  }
  /** "i" popup about the ceremonial music (edited in the admin); null = no button */
  info?: {
    title: string
    body: string
    image: { url: string; alt: string } | null
    /** Picture shown beside each paragraph (by index) */
    paragraphImages?: string[]
    sources: { label: string; url: string | null }[]
  } | null
}

/** Playlist that gets the "i" info button */
const INFO_PLAYLIST = 'nghi-le'

const VOLUME = 0.4
const AUTOPLAY_DELAY_MS = 5000
const FADE_IN_MS = 500
const TOAST_MS = 5000
/** Close the panel after this long without any interaction inside it */
const PANEL_IDLE_MS = 10000
/** Set when the visitor pauses manually, so we don't autoplay on their next visits */
const OPT_OUT_KEY = 'music-autoplay-off'

const isOptedOut = () => {
  try {
    return localStorage.getItem(OPT_OUT_KEY) === '1'
  } catch {
    return false
  }
}
const setOptOut = (off: boolean) => {
  try {
    if (off) localStorage.setItem(OPT_OUT_KEY, '1')
    else localStorage.removeItem(OPT_OUT_KEY)
  } catch {
    // storage unavailable – ignore
  }
}

/** Where the visitor stopped (playlist, track, position), so any page can resume from there */
const STATE_KEY = 'music-state'
type SavedState = { playlist: string; url: string; time: number }
const loadState = (): SavedState | null => {
  try {
    const raw = localStorage.getItem(STATE_KEY)
    return raw ? (JSON.parse(raw) as SavedState) : null
  } catch {
    return null
  }
}
const saveState = (state: SavedState) => {
  try {
    localStorage.setItem(STATE_KEY, JSON.stringify(state))
  } catch {
    // storage unavailable – ignore
  }
}

/** Only the About page (/vi/about, /en/about) autoplays */
const isAutoplayPath = (pathname: string) => /^\/[a-z]{2}\/about\/?$/.test(pathname)

const formatTime = (s: number) => {
  if (!Number.isFinite(s) || s < 0) return '0:00'
  const m = Math.floor(s / 60)
  return `${m}:${String(Math.floor(s % 60)).padStart(2, '0')}`
}

/**
 * Ramp the volume from 0 to VOLUME over FADE_IN_MS.
 * Uses timers rather than requestAnimationFrame: rAF doesn't run in background tabs,
 * which would leave the music stuck at volume 0. The last step always lands on VOLUME.
 */
let fadeTimer: number | undefined
function fadeIn(audio: HTMLAudioElement) {
  window.clearInterval(fadeTimer)
  audio.volume = 0
  const start = Date.now()
  fadeTimer = window.setInterval(() => {
    const progress = Math.min(Math.max((Date.now() - start) / FADE_IN_MS, 0), 1)
    audio.volume = VOLUME * progress
    if (progress >= 1) window.clearInterval(fadeTimer)
  }, 25)
}
const corner =
  'absolute w-2 h-2 border-transparent group-hover:border-accent-lime transition-colors'

export function MusicPlayer({ playlists, labels, info }: MusicPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const rootRef = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false)
  const [infoOpen, setInfoOpen] = useState(false)
  // Esc closes the info popup
  useEffect(() => {
    if (!infoOpen) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setInfoOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [infoOpen])
  const [mode, setMode] = useState(0) // first playlist (nhạc nghi lễ) is the default
  const [index, setIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [time, setTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const lastSaved = useRef(0)
  const pathname = usePathname()
  const autoplayHere = isAutoplayPath(pathname)
  /** Position to jump to once the (restored) track has loaded */
  const pendingSeek = useRef<{ url: string; time: number } | null>(null)
  /** Latest mode/index for callbacks created in long-lived effects */
  const current = useRef({ mode: 0, index: 0 })
  useEffect(() => {
    current.current = { mode, index }
  }, [mode, index])

  // Restore where the visitor stopped last time (any page, any visit)
  useEffect(() => {
    const saved = loadState()
    if (!saved) return
    const m = playlists.findIndex((p) => p.id === saved.playlist)
    const i = m === -1 ? -1 : playlists[m].tracks.findIndex((t) => t.url === saved.url)
    if (m === -1 || i === -1) return
    pendingSeek.current = { url: saved.url, time: saved.time }
    // Restoring persisted client-only state after hydration is the intended use here
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMode(m)
    setIndex(i)
    setTime(saved.time)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const tracks = playlists[mode]?.tracks ?? []
  const track = tracks[index]
  const hasIntro = tracks.some((t) => t.isIntro)

  /**
   * Popup text: playlists with an intro (nhạc nghi lễ) show the playlist name,
   * normal playlists (bài hát) show the song name.
   */
  const labelFor = (m: number, i: number) => {
    const list = playlists[m]
    if (!list) return ''
    if (list.tracks.some((t) => t.isIntro))
      return labels.popup?.[list.id] ?? labels.modes[list.id] ?? list.id
    const t = list.tracks[i]
    return t ? (t.artist ? `${t.title} — ${t.artist}` : t.title) : ''
  }

  // "Now playing" popup next to the button, shown for TOAST_MS when music starts / the song changes
  const [toast, setToast] = useState<{ text: string; id: number; visible: boolean } | null>(null)
  const lastToastText = useRef('')
  // Browser refused autoplay: show a hint until the music actually starts
  const [autoplayBlocked, setAutoplayBlocked] = useState(false)
  const announce = (text: string, force = false) => {
    if (!text || (!force && text === lastToastText.current)) return
    lastToastText.current = text
    setAutoplayBlocked(false)
    setToast({ text, id: Date.now(), visible: true })
  }
  useEffect(() => {
    if (!toast?.visible) return
    const timer = window.setTimeout(
      () => setToast((t) => (t ? { ...t, visible: false } : t)),
      TOAST_MS,
    )
    return () => window.clearTimeout(timer)
  }, [toast?.id, toast?.visible])

  // Start the new source whenever the track/mode changes while playing
  useEffect(() => {
    const audio = audioRef.current
    if (!audio || !isPlaying) return
    audio.volume = VOLUME
    audio.play().catch(() => setIsPlaying(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, index])

  // Auto-close the panel after PANEL_IDLE_MS without interaction; any click inside restarts the timer
  const [panelActivity, setPanelActivity] = useState(0)
  useEffect(() => {
    if (!open) return
    const timer = window.setTimeout(() => setOpen(false), PANEL_IDLE_MS)
    return () => window.clearTimeout(timer)
  }, [open, panelActivity])

  // Close the panel when clicking outside of it
  useEffect(() => {
    if (!open) return
    const onClick = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [open])

  // Autoplay ~5s after load. Browsers block sound until the visitor interacts with the page,
  // so if that attempt is refused, start on their first click/tap/key press instead.
  useEffect(() => {
    if (!autoplayHere || isOptedOut()) return
    let started = false
    const events = ['pointerdown', 'keydown'] as const

    const cleanup = () => events.forEach((e) => document.removeEventListener(e, onGesture))
    const tryStart = () => {
      const audio = audioRef.current
      if (started || !audio || !audio.paused) return Promise.resolve(true)
      audio.volume = 0
      return audio
        .play()
        .then(() => {
          started = true
          fadeIn(audio)
          setIsPlaying(true)
          announce(labelFor(current.current.mode, current.current.index), true)
          cleanup()
          return true
        })
        .catch(() => false)
    }
    function onGesture() {
      void tryStart()
    }

    const timer = window.setTimeout(async () => {
      if (!(await tryStart())) {
        setAutoplayBlocked(true)
        events.forEach((e) => document.addEventListener(e, onGesture, { once: true }))
      }
    }, AUTOPLAY_DELAY_MS)

    return () => {
      window.clearTimeout(timer)
      cleanup()
      setAutoplayBlocked(false) // left the About page: no autoplay, no hint
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoplayHere])

  if (!track) return null

  const play = () => {
    const audio = audioRef.current
    if (!audio) return
    setOptOut(false)
    audio.volume = 0 // start silent so there's no loud blip before the fade
    audio
      .play()
      .then(() => {
        fadeIn(audio)
        setIsPlaying(true)
        announce(labelFor(mode, index), true)
      })
      .catch(() => setIsPlaying(false))
  }

  const pause = () => {
    audioRef.current?.pause()
    setIsPlaying(false)
    setOptOut(true)
  }

  const selectMode = (m: number) => {
    if (m === mode) {
      if (!isPlaying) play()
      return
    }
    setMode(m)
    setIndex(0)
    setTime(0)
    setIsPlaying(true) // effect above starts the first track of the new mode
    announce(labelFor(m, 0), true)
  }

  // Auto-advance: intro -> piece -> intro -> next piece ... then loop
  // Round: play the whole playlist (intro -> piece -> intro -> next piece ...), then loop
  const onEnded = () => {
    setTime(0)
    const i = (index + 1) % tracks.length
    setIndex(i)
    announce(labelFor(mode, i))
  }

  // "Next" skips to the next piece (including its intro), not just the next file
  const next = () => {
    let j = index + 1
    if (hasIntro) while (j < tracks.length && !tracks[j].isIntro) j++
    setIndex(j % tracks.length)
    setTime(0)
    if (!isPlaying) setIsPlaying(true)
    announce(labelFor(mode, j % tracks.length))
  }

  const persist = (t: number) =>
    saveState({ playlist: playlists[mode].id, url: track.url, time: t })

  const onTimeUpdate = () => {
    const audio = audioRef.current
    if (!audio) return
    setTime(audio.currentTime)
    // save at most every 2s while playing
    if (Math.abs(audio.currentTime - lastSaved.current) >= 2) {
      lastSaved.current = audio.currentTime
      persist(audio.currentTime)
    }
  }

  const onLoadedMetadata = () => {
    const audio = audioRef.current
    if (!audio) return
    setDuration(audio.duration)
    // only apply to the track it was saved for (the default track may load first)
    if (pendingSeek.current && pendingSeek.current.url === track.url) {
      audio.currentTime = Math.min(pendingSeek.current.time, Math.max(audio.duration - 1, 0))
      pendingSeek.current = null
    }
  }

  const seek = (t: number) => {
    const audio = audioRef.current
    if (!audio) return
    if (audio.readyState === 0)
      pendingSeek.current = { url: track.url, time: t } // apply once loaded
    else audio.currentTime = t
    setTime(t)
    persist(t)
  }

  const nowPlaying = track.artist ? `${track.title} — ${track.artist}` : track.title
  const showInfoButton = Boolean(info) && isPlaying && playlists[mode]?.id === INFO_PLAYLIST

  return (
    <div ref={rootRef} className="relative">
      <audio
        ref={audioRef}
        src={track.url}
        // a playlist with a single file (nhạc nghi lễ is one merged mp3) just repeats it
        loop={tracks.length === 1}
        preload="metadata"
        onEnded={onEnded}
        onTimeUpdate={onTimeUpdate}
        onLoadedMetadata={onLoadedMetadata}
        onDurationChange={() => setDuration(audioRef.current?.duration ?? 0)}
        onPause={() => persist(audioRef.current?.currentTime ?? 0)}
      />

      {/* Now-playing popup (hidden while the panel is open) */}
      <div
        className={`absolute right-full top-1/2 -translate-y-1/2 mr-2 flex items-center gap-2 bg-bg-elevated border border-accent-lime/40 px-3 py-2 max-w-[60vw] sm:max-w-xs shadow-lg pointer-events-none transition-all duration-300 ${
          (toast?.visible || autoplayBlocked) && !open
            ? 'opacity-100 translate-x-0'
            : 'opacity-0 translate-x-2'
        }`}
        role="status"
        aria-live="polite"
      >
        {autoplayBlocked ? (
          <>
            <VolumeX size={12} className="shrink-0 text-accent-amber" />
            <span className="font-mono text-xs text-text-primary truncate">
              {labels.autoplayHint}
            </span>
          </>
        ) : (
          <>
            <Music size={12} className="shrink-0 text-accent-lime self-start mt-0.5" />
            <span className="min-w-0 flex flex-col">
              <span className="font-mono text-xs text-text-primary truncate">{toast?.text}</span>
              {/* ceremonial music: a small link to the info popup */}
              {showInfoButton && (
                <button
                  type="button"
                  onClick={() => setInfoOpen(true)}
                  className={`self-start font-mono text-[11px] text-accent-amber hover:underline ${
                    toast?.visible && !open ? 'pointer-events-auto' : ''
                  }`}
                >
                  {labels.infoLink} →
                </button>
              )}
            </span>
          </>
        )}
      </div>

      {/* Panel: mode selection + now playing + controls */}
      <div
        className={`absolute right-full bottom-0 mr-2 w-64 max-w-[70vw] bg-bg-elevated border border-border-default p-3 space-y-3 shadow-lg transition-all duration-200 ${
          open ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2 pointer-events-none'
        }`}
        role="dialog"
        aria-label={labels.menu}
        onPointerDown={() => setPanelActivity((n) => n + 1)}
        onKeyDown={() => setPanelActivity((n) => n + 1)}
      >
        {/* Mode selection */}
        <div className="grid grid-cols-2 gap-1 font-mono text-xs">
          {playlists.map((p, i) => (
            <button
              key={p.id}
              type="button"
              onClick={() => selectMode(i)}
              aria-pressed={i === mode}
              className={`px-2 py-1.5 border transition-colors ${
                i === mode
                  ? 'border-accent-lime text-accent-lime bg-accent-lime/5'
                  : 'border-border-default text-text-secondary hover:text-text-primary'
              }`}
            >
              {labels.modes[p.id] ?? p.id}
            </button>
          ))}
        </div>

        {/* Now playing + controls */}
        <div className="flex items-center gap-2">
          <span
            className={`w-1.5 h-1.5 shrink-0 rounded-full ${isPlaying ? 'bg-accent-lime animate-pulse' : 'bg-text-secondary'}`}
          />
          <span
            className="flex-1 font-mono text-xs text-text-secondary truncate"
            title={nowPlaying}
          >
            {nowPlaying}
          </span>
          <button
            type="button"
            onClick={isPlaying ? pause : play}
            className="shrink-0 p-1 text-text-secondary hover:text-accent-lime transition-colors"
            aria-label={isPlaying ? labels.pause : labels.play}
            title={isPlaying ? labels.pause : labels.play}
          >
            {isPlaying ? <Pause size={14} /> : <Play size={14} />}
          </button>
          <button
            type="button"
            onClick={next}
            className="shrink-0 p-1 text-text-secondary hover:text-accent-lime transition-colors"
            aria-label={labels.next}
            title={labels.next}
          >
            <SkipForward size={14} />
          </button>
        </div>

        {/* Seek bar: drag to rewind / fast-forward */}
        <div className="flex items-center gap-2 font-mono text-[10px] text-text-secondary">
          <span className="w-8 text-right tabular-nums">{formatTime(time)}</span>
          <input
            type="range"
            min={0}
            max={duration || 0}
            step={0.1}
            value={Math.min(time, duration || 0)}
            onChange={(e) => seek(Number(e.target.value))}
            disabled={!duration}
            className="flex-1 h-1 accent-[var(--color-accent-lime)] cursor-pointer disabled:cursor-default disabled:opacity-40"
            aria-label={labels.seek}
          />
          <span className="w-8 tabular-nums">{formatTime(duration)}</span>
        </div>
      </div>

      {/* Main floating button – opens the panel */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`w-10 h-10 sm:w-12 sm:h-12 bg-bg-elevated border hover:border-accent-lime transition-all duration-300 flex items-center justify-center group relative ${
          isPlaying
            ? 'border-accent-lime text-accent-lime'
            : 'border-border-default text-text-secondary hover:text-text-primary'
        }`}
        aria-label={labels.menu}
        aria-expanded={open}
        title={labels.menu}
      >
        <div className={`${corner} top-0 left-0 border-t border-l`} />
        <div className={`${corner} top-0 right-0 border-t border-r`} />
        <div className={`${corner} bottom-0 left-0 border-b border-l`} />
        <div className={`${corner} bottom-0 right-0 border-b border-r`} />
        <Music size={18} className={isPlaying ? 'animate-pulse' : ''} />
      </button>

      {/* "i" badge: info about the ceremonial music, shown while it plays */}
      {showInfoButton && (
        <button
          type="button"
          onClick={() => setInfoOpen(true)}
          className="absolute -top-3 -left-3 z-10 w-7 h-7 border-2 border-bg-primary rounded-full bg-accent-amber text-bg-primary flex items-center justify-center shadow-md hover:scale-110 transition-transform"
          aria-label={labels.info}
          title={labels.info}
        >
          <span className="absolute inset-0 rounded-full bg-accent-amber animate-ping opacity-40" />
          <Info size={16} strokeWidth={3} className="relative" />
        </button>
      )}

      {infoOpen && info && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4"
          onClick={() => setInfoOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="music-info-title"
            className="relative w-full max-w-lg sm:max-w-3xl max-h-[85vh] overflow-y-auto bg-bg-elevated border border-border-default shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setInfoOpen(false)}
              className="absolute top-2 right-2 z-10 p-1.5 bg-bg-elevated/80 border border-border-default text-text-secondary hover:text-accent-amber"
              aria-label={labels.close}
              title={labels.close}
            >
              <X size={16} />
            </button>
            {info.image && !info.paragraphImages?.length && (
              // eslint-disable-next-line @next/next/no-img-element -- CMS media URL
              <img
                src={info.image.url}
                alt={info.image.alt}
                className="w-full max-h-72 object-cover border-b border-border-default"
              />
            )}
            <div className="p-5 space-y-5">
              <h2 id="music-info-title" className="text-xl font-bold pr-8">
                {info.title}
              </h2>
              {info.body
                .split(/\n+/)
                .filter((line) => line.trim())
                .map((line, i) => {
                  const img = info.paragraphImages?.[i]
                  const text = <p className="text-sm text-text-secondary leading-relaxed">{line}</p>
                  if (!img) return <div key={i}>{text}</div>
                  // picture beside its paragraph, alternating sides; stacked on phones
                  return (
                    <div key={i} className="grid gap-3 sm:grid-cols-2 sm:gap-5 sm:items-center">
                      {/* eslint-disable-next-line @next/next/no-img-element -- static picture */}
                      <img
                        src={img}
                        alt=""
                        loading="lazy"
                        className={`w-full aspect-[3/2] object-cover border border-border-default ${
                          i % 2 ? 'sm:order-2' : ''
                        }`}
                      />
                      {text}
                    </div>
                  )
                })}
              {info.sources.length > 0 && (
                <div className="pt-2 border-t border-border-default space-y-1">
                  <p className="font-mono text-[11px] uppercase tracking-widest text-accent-amber">
                    {labels.sources}
                  </p>
                  <ol className="list-decimal pl-5 text-xs text-text-secondary space-y-0.5">
                    {info.sources.map((s, i) => (
                      <li key={i}>
                        {s.url ? (
                          <a
                            href={s.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline decoration-dotted hover:text-accent-amber"
                          >
                            {s.label}
                          </a>
                        ) : (
                          s.label
                        )}
                      </li>
                    ))}
                  </ol>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
