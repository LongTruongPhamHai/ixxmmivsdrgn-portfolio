'use client'

import { useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import { ChevronDown } from 'lucide-react'
import { getDictionary } from '@/i18n/dictionaries'
import { getSections, isHomePath, scrollToSection, useActiveSection } from './navigation'

const num = (i: number) => String(i + 1).padStart(2, '0')

/**
 * Home page table of contents, at the bottom of the sticky header (home page only).
 * - >= 640px: centered horizontal strip, the section in view is highlighted
 * - <  640px: compact bar showing the current section + progress; tap to open the full list
 */
export function SectionStrip({ locale }: { locale: string }) {
  const pathname = usePathname()
  const isHome = isHomePath(pathname)
  const t = getDictionary(locale)
  const sections = getSections(t)
  const active = useActiveSection(
    sections.map((s) => s.id),
    isHome,
  )

  if (!isHome) return null

  const activeIndex = Math.max(
    0,
    sections.findIndex((s) => s.id === active),
  )

  return (
    <div className="border-t border-border-default/60">
      {/* >= 640px: horizontal strip */}
      <nav
        aria-label={t.sectionsLabel}
        className="hidden sm:block max-w-7xl mx-auto px-4 overflow-x-auto font-mono text-xs [scrollbar-width:none]"
      >
        {/* w-max + mx-auto: centered when it fits, horizontally scrollable when it doesn't */}
        <div className="flex gap-1 w-max mx-auto">
          {sections.map((s, i) => {
            const isActive = active === s.id
            return (
              <a
                key={s.id}
                href={`#${s.id}`}
                onClick={(e) => {
                  e.preventDefault()
                  scrollToSection(s.id)
                }}
                aria-current={isActive ? 'true' : undefined}
                className={`shrink-0 px-3 py-2 border-b-2 transition-colors whitespace-nowrap ${
                  isActive
                    ? 'border-accent-lime text-accent-lime'
                    : 'border-transparent text-text-secondary hover:text-text-primary'
                }`}
              >
                <span className="opacity-60 mr-1">{num(i)}</span>
                {s.label}
              </a>
            )
          })}
        </div>
      </nav>

      {/* < 640px: compact current-section bar */}
      <MobileSections label={t.sectionsLabel} sections={sections} activeIndex={activeIndex} />
    </div>
  )
}

function MobileSections({
  label,
  sections,
  activeIndex,
}: {
  label: string
  sections: { id: string; label: string }[]
  activeIndex: number
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  // close on outside tap
  useEffect(() => {
    if (!open) return
    const close = (e: PointerEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('pointerdown', close)
    return () => document.removeEventListener('pointerdown', close)
  }, [open])

  const current = sections[activeIndex]
  const progress = ((activeIndex + 1) / sections.length) * 100

  return (
    <div ref={ref} className="sm:hidden relative font-mono">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-label={label}
        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm"
      >
        <span className="text-accent-lime tabular-nums">
          {num(activeIndex)}
          <span className="text-text-secondary/60">/{num(sections.length - 1)}</span>
        </span>
        <span className="h-px w-4 bg-border-active" />
        <span className="flex-1 text-left text-text-primary truncate">{current?.label}</span>
        <ChevronDown
          size={16}
          className={`text-text-secondary transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {/* progress through the page's sections */}
      <div className="h-0.5 bg-border-default/40">
        <div
          className="h-full bg-accent-lime transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* full list */}
      <div
        className={`absolute left-0 right-0 top-full bg-bg-elevated border-b border-border-default shadow-lg overflow-hidden transition-all duration-200 ${
          open ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0 pointer-events-none'
        }`}
      >
        <nav aria-label={label} className="flex flex-col py-1">
          {sections.map((s, i) => {
            const isActive = i === activeIndex
            return (
              <a
                key={s.id}
                href={`#${s.id}`}
                onClick={(e) => {
                  e.preventDefault()
                  setOpen(false)
                  scrollToSection(s.id)
                }}
                aria-current={isActive ? 'true' : undefined}
                className={`flex items-center gap-3 px-4 py-3 text-sm transition-colors ${
                  isActive
                    ? 'text-accent-lime bg-accent-lime/5 border-l-2 border-accent-lime'
                    : 'text-text-secondary border-l-2 border-transparent active:bg-bg-secondary'
                }`}
              >
                <span className="opacity-60 tabular-nums">{num(i)}</span>
                {s.label}
              </a>
            )
          })}
        </nav>
      </div>
    </div>
  )
}
