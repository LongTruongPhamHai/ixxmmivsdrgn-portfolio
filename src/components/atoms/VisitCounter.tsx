'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

const SESSION_KEY = 'visit-counted'

/**
 * Small floating visit counter (bottom-left).
 * The visit is counted once per browser session; navigating or reloading only reads the number.
 */
export function VisitCounter({ label, locale }: { label: string; locale: string }) {
  const [visits, setVisits] = useState<number | null>(null)

  useEffect(() => {
    let counted = false
    try {
      counted = sessionStorage.getItem(SESSION_KEY) === '1'
    } catch {
      // storage blocked: count anyway (worst case once per page load)
    }
    fetch('/api/visits', { method: counted ? 'GET' : 'POST', cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (typeof data?.visits !== 'number') return
        setVisits(data.visits)
        try {
          sessionStorage.setItem(SESSION_KEY, '1')
        } catch {}
      })
      .catch(() => {})
  }, [])

  if (visits === null) return null

  const formatted = new Intl.NumberFormat(locale === 'vi' ? 'vi-VN' : 'en-US').format(visits)

  return (
    <Link
      href={`/${locale}/stats`}
      className="fixed bottom-4 left-4 sm:bottom-6 sm:left-6 z-40 flex items-center gap-2 bg-bg-elevated/90 backdrop-blur border border-border-default hover:border-accent-lime px-2.5 py-1.5 font-mono text-[11px] text-text-secondary hover:text-text-primary transition-colors select-none"
      title={label}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-accent-lime animate-pulse" />
      <span className="text-text-primary tabular-nums">{formatted}</span>
      <span className="hidden sm:inline">{label}</span>
    </Link>
  )
}
