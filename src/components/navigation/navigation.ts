'use client'

import { useEffect, useState } from 'react'
import { getDictionary } from '@/i18n/dictionaries'

type Dict = ReturnType<typeof getDictionary>

/** Pages shown in the main navbar. `ready: false` = not built yet (shown as "coming soon"). */
export const getPages = (locale: string, t: Dict) => [
  { href: `/${locale}`, label: t.pageHome, ready: true },
  { href: `/${locale}/projects`, label: t.pageProjects, ready: false },
  { href: `/${locale}/blog`, label: t.pageBlog, ready: true },
  { href: `/${locale}/about`, label: t.pageAbout, ready: true },
]

/** Secondary pages, grouped under "More ▾" in the navbar */
export const getMorePages = (locale: string, t: Dict) => [
  { href: `/${locale}/colophon`, label: t.pageColophon },
]

/** Sections of the About page (ids match the <section> elements) */
export const getSections = (t: Dict) => [
  { id: 'about', label: t.navAbout },
  { id: 'experience', label: t.navExperience },
  { id: 'projects', label: t.navProjects },
  { id: 'education', label: t.navEducation },
  { id: 'contact', label: t.navContact },
]

export const isHomePath = (pathname: string) => /^\/[a-z]{2}\/?$/.test(pathname)

/** The About page (/vi/about, /en/about) – shows the section table of contents */
export const isAboutPath = (pathname: string) => /^\/[a-z]{2}\/about\/?$/.test(pathname)

export const scrollToSection = (id: string) =>
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

/** Scroll-spy: id of the section currently around the middle of the viewport */
export function useActiveSection(ids: string[], enabled = true) {
  const [active, setActive] = useState<string | null>(null)
  const key = ids.join(',')

  useEffect(() => {
    if (!enabled) return
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting)
        if (visible.length) setActive(visible[0].target.id)
      },
      { rootMargin: '-45% 0px -50% 0px' }, // a thin band around the middle of the screen
    )
    key.split(',').forEach((id) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [key, enabled])

  return active
}
