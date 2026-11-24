'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { getDictionary } from '@/i18n/dictionaries'
import { getMorePages, getPages } from '@/components/navigation/navigation'

interface MobileNavProps {
  locale: string
  isOpen: boolean
  onClose: () => void
}

export function MobileNav({ locale, isOpen, onClose }: MobileNavProps) {
  const t = getDictionary(locale)

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  return (
    <>
      {/* Backdrop nền tối phía dưới Header */}
      <div
        className={`fixed inset-0 top-0 bg-bg-primary/80 backdrop-blur-sm -z-10 sm:hidden transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Menu Content: Căn top-full để luôn nằm ngay dưới mép Header */}
      <div
        className={`absolute top-full left-0 right-0 bg-bg-elevated border-b border-border-default -z-10 sm:hidden transform transition-all duration-300 ease-in-out shadow-lg ${
          isOpen
            ? 'translate-y-0 opacity-100 pointer-events-auto'
            : '-translate-y-4 opacity-0 pointer-events-none'
        }`}
      >
        <nav className="flex flex-col font-mono text-sm">
          {getPages(locale, t).map(({ href, label, ready }) =>
            ready ? (
              <Link
                key={href}
                href={href}
                onClick={onClose}
                className="px-4 py-4 text-text-secondary hover:text-text-primary hover:bg-bg-secondary transition-colors border-b border-border-default last:border-b-0"
              >
                {label}
              </Link>
            ) : (
              <span
                key={href}
                aria-disabled="true"
                className="px-4 py-4 text-text-secondary/40 border-b border-border-default last:border-b-0 flex items-center justify-between"
              >
                {label}
                <span className="text-[10px] border border-border-default px-1 uppercase">
                  {t.comingSoon}
                </span>
              </span>
            ),
          )}
          <div className="px-4 pt-4 pb-1 text-[10px] uppercase tracking-widest text-text-secondary/60 border-t border-border-default">
            {t.pageMore}
          </div>
          {getMorePages(locale, t).map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={onClose}
              className="px-4 py-3 text-text-secondary hover:text-text-primary hover:bg-bg-secondary transition-colors"
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </>
  )
}
