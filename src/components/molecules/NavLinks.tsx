'use client'

import Link from 'next/link'
import { useParams, usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { ChevronDown, Ellipsis, FileText, FolderGit2, House, Newspaper } from 'lucide-react'
import { getDictionary } from '@/i18n/dictionaries'
import { getMorePages, getPages } from '@/components/navigation/navigation'

const ICONS = [House, FolderGit2, Newspaper, FileText]

/** Main navbar: links to the site's pages */
export function NavLinks() {
  const params = useParams()
  const pathname = usePathname()
  const locale = (params?.locale as string) || 'vi'
  const t = getDictionary(locale)

  return (
    <>
      {getPages(locale, t).map(({ href, label, ready }, i) => {
        const Icon = ICONS[i]
        const isCurrent = pathname === href || (i > 0 && pathname.startsWith(href))

        if (!ready) {
          return (
            <span
              key={href}
              title={`${label} · ${t.comingSoon}`}
              aria-disabled="true"
              className="inline-flex items-center justify-center p-2 md:p-0 gap-1.5 shrink-0 whitespace-nowrap text-text-secondary/40 cursor-not-allowed"
            >
              <Icon className="w-5 h-5 block md:hidden" />
              <span className="hidden md:inline">{label}</span>
              <span className="hidden lg:inline text-[10px] border border-border-default px-1 uppercase">
                {t.comingSoon}
              </span>
            </span>
          )
        }

        return (
          <Link
            key={href}
            href={href}
            title={label}
            aria-current={isCurrent ? 'page' : undefined}
            className={`inline-flex items-center justify-center p-2 md:p-0 shrink-0 whitespace-nowrap transition-colors ${
              isCurrent ? 'text-accent-lime' : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            <Icon className="w-5 h-5 block md:hidden" />
            <span className="hidden md:inline">{label}</span>
          </Link>
        )
      })}
      <MoreMenu locale={locale} pathname={pathname} t={t} />
    </>
  )
}

/** "More ▾" dropdown with the secondary pages (colophon, …) */
function MoreMenu({
  locale,
  pathname,
  t,
}: {
  locale: string
  pathname: string
  t: ReturnType<typeof getDictionary>
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const pages = getMorePages(locale, t)
  const isCurrent = pages.some((p) => pathname.startsWith(p.href))

  useEffect(() => {
    if (!open) return
    const close = (e: PointerEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false)
    }
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('pointerdown', close)
    document.addEventListener('keydown', esc)
    return () => {
      document.removeEventListener('pointerdown', close)
      document.removeEventListener('keydown', esc)
    }
  }, [open])

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="menu"
        title={t.pageMore}
        className={`inline-flex items-center gap-1 p-2 md:p-0 whitespace-nowrap transition-colors ${
          isCurrent ? 'text-accent-lime' : 'text-text-secondary hover:text-text-primary'
        }`}
      >
        <Ellipsis className="w-5 h-5 block md:hidden" />
        <span className="hidden md:inline">{t.pageMore}</span>
        <ChevronDown
          size={14}
          className={`hidden md:block transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>
      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full mt-3 w-48 bg-bg-elevated border border-border-default py-1 shadow-lg z-50"
        >
          {pages.map((p) => (
            <Link
              key={p.href}
              href={p.href}
              role="menuitem"
              onClick={() => setOpen(false)}
              aria-current={pathname.startsWith(p.href) ? 'page' : undefined}
              className={`block px-3 py-2 transition-colors hover:bg-bg-secondary ${
                pathname.startsWith(p.href)
                  ? 'text-accent-lime'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              {p.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
