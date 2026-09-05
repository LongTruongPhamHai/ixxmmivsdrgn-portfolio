'use client'

import { useEffect } from 'react'
import { getDictionary } from '@/i18n/dictionaries'

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

  const handleScrollTo = (id: string) => {
    onClose()
    setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    }, 300)
  }

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
          <a
            href="#about"
            onClick={(e) => {
              e.preventDefault()
              handleScrollTo('about')
            }}
            className="px-4 py-4 text-text-secondary hover:text-text-primary hover:bg-bg-secondary transition-colors border-b border-border-default cursor-pointer"
          >
            {t.navAbout}
          </a>
          <a
            href="#experience"
            onClick={(e) => {
              e.preventDefault()
              handleScrollTo('experience')
            }}
            className="px-4 py-4 text-text-secondary hover:text-text-primary hover:bg-bg-secondary transition-colors border-b border-border-default cursor-pointer"
          >
            {t.navExperience}
          </a>
          <a
            href="#projects"
            onClick={(e) => {
              e.preventDefault()
              handleScrollTo('projects')
            }}
            className="px-4 py-4 text-text-secondary hover:text-text-primary hover:bg-bg-secondary transition-colors border-b border-border-default cursor-pointer"
          >
            {t.navProjects}
          </a>
          <a
            href="#education"
            onClick={(e) => {
              e.preventDefault()
              handleScrollTo('education')
            }}
            className="px-4 py-4 text-text-secondary hover:text-text-primary hover:bg-bg-secondary transition-colors border-b border-border-default cursor-pointer"
          >
            {t.navEducation}
          </a>
          <a
            href="#contact"
            onClick={(e) => {
              e.preventDefault()
              handleScrollTo('contact')
            }}
            className="px-4 py-4 text-text-secondary hover:text-text-primary hover:bg-bg-secondary transition-colors cursor-pointer"
          >
            {t.navContact}
          </a>
        </nav>
      </div>
    </>
  )
}
