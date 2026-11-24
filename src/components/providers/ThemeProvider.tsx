'use client'

import * as React from 'react'

type Theme = 'dark' | 'light'

const STORAGE_KEY = 'theme'
const listeners = new Set<() => void>()

const readTheme = (fallback: Theme): Theme => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved === 'light' || saved === 'dark' ? saved : fallback
  } catch {
    return fallback
  }
}

const applyTheme = (theme: Theme) => {
  document.documentElement.classList.toggle('dark', theme === 'dark')
}

/**
 * Runs before first paint (see layout) so a saved light theme doesn't flash dark.
 */
export const themeInitScript = `(function(){try{var t=localStorage.getItem('${STORAGE_KEY}');document.documentElement.classList.toggle('dark',t!=='light')}catch(e){document.documentElement.classList.add('dark')}})()`

type ThemeContextType = {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const ThemeContext = React.createContext<ThemeContextType>({
  theme: 'dark',
  setTheme: () => {},
})

export function ThemeProvider({
  children,
  defaultTheme = 'dark',
}: {
  children: React.ReactNode
  defaultTheme?: Theme
}) {
  const subscribe = React.useCallback((cb: () => void) => {
    listeners.add(cb)
    return () => listeners.delete(cb)
  }, [])

  const theme = React.useSyncExternalStore(
    subscribe,
    () => readTheme(defaultTheme),
    () => defaultTheme,
  )

  const setTheme = React.useCallback((next: Theme) => {
    try {
      localStorage.setItem(STORAGE_KEY, next)
    } catch {
      // storage unavailable (private mode) – still switch for this page view
    }
    applyTheme(next)
    listeners.forEach((cb) => cb())
  }, [])

  // The root layout renders <html className="…fonts…">; when the layout re-renders on the client
  // (e.g. switching /vi ↔ /en) React rewrites that attribute and drops the "dark" class added by
  // themeInitScript. Re-apply the theme after every render, before the browser paints.
  React.useLayoutEffect(() => {
    applyTheme(theme)
  })

  const value = React.useMemo(() => ({ theme, setTheme }), [theme, setTheme])

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export const useTheme = () => React.useContext(ThemeContext)

/** true only after hydration on the client */
export const useMounted = () =>
  React.useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  )

/**
 * Inline theme-init script. Executable only in the server HTML; on client re-renders of the root
 * layout (e.g. /vi ↔ /en) it becomes an inert text/plain block, so React doesn't warn about
 * rendering a <script> on the client (the theme is re-applied by ThemeProvider anyway).
 */
export function ThemeInitScript() {
  return (
    <script
      suppressHydrationWarning
      type={typeof window === 'undefined' ? 'text/javascript' : 'text/plain'}
      dangerouslySetInnerHTML={{ __html: themeInitScript }}
    />
  )
}
