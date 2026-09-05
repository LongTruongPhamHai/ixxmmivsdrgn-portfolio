'use client'

import { getDictionary } from '@/i18n/dictionaries'
import { useParams } from 'next/navigation'

export function NavLinks() {
  const params = useParams()
  const locale = (params?.locale as string) || 'vi'
  const t = getDictionary(locale)

  const handleScrollTo = (id: string) => (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  const links = [
    { id: 'about', label: t.navAbout },
    { id: 'experience', label: t.navExperience },
    { id: 'projects', label: t.navProjects },
    { id: 'education', label: t.navEducation },
    { id: 'contact', label: t.navContact },
  ]

  return (
    <>
      {links.map(({ id, label }) => (
        <a
          key={id}
          href={`#${id}`}
          onClick={handleScrollTo(id)}
          className="inline-flex w-auto shrink-0 whitespace-nowrap text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
        >
          {label}
        </a>
      ))}
    </>
  )
}
