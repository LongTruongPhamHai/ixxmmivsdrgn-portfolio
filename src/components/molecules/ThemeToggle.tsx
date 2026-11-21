'use client'

import { Moon, Sun } from 'lucide-react'
import { useMounted, useTheme } from '../providers/ThemeProvider'

export function ThemeToggle() {
  const { setTheme, theme } = useTheme()
  const mounted = useMounted()

  if (!mounted) {
    return <div className="w-8 h-8" />
  }

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="p-2 text-text-secondary hover:text-text-primary transition-colors focus:outline-none"
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  )
}
