'use client'

import Link from 'next/link'
import { useParams, usePathname } from 'next/navigation'
import { FileText, FolderGit2, House, Newspaper } from 'lucide-react'
import { getDictionary } from '@/i18n/dictionaries'
import { getPages } from '@/components/navigation/navigation'

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
    </>
  )
}
