'use client'

import { getDictionary } from '@/i18n/dictionaries'
import { useParams } from 'next/navigation'
import { UserRound, BriefcaseBusiness, FolderGit2, GraduationCap, Mail } from 'lucide-react'

export function NavLinks() {
  const params = useParams()
  const locale = (params?.locale as string) || 'vi'
  const t = getDictionary(locale)

  const handleScrollTo = (id: string) => (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  const links = [
    { id: 'about', label: t.navAbout, Icon: UserRound },
    { id: 'experience', label: t.navExperience, Icon: BriefcaseBusiness },
    { id: 'projects', label: t.navProjects, Icon: FolderGit2 },
    { id: 'education', label: t.navEducation, Icon: GraduationCap },
    { id: 'contact', label: t.navContact, Icon: Mail },
  ]

  return (
    <>
      {links.map(({ id, label, Icon }) => (
        <a
          key={id}
          href={`#${id}`}
          onClick={handleScrollTo(id)}
          title={label}
          className="inline-flex items-center justify-center p-2 md:p-0 w-auto shrink-0 whitespace-nowrap text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
        >
          {/* Icon hiển thị ở màn 640px - 768px (sm đến md) */}
          <Icon className="w-5 h-5 block md:hidden" />

          {/* Label hiển thị ở màn >= 768px (md) */}
          <span className="hidden md:inline">{label}</span>
        </a>
      ))}
    </>
  )
}
