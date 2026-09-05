'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { getDictionary } from '@/i18n/dictionaries'

interface MobileNavProps {
  locale: string
}

export function MobileNav({ locale }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false)
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
    setIsOpen(false)
    setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    }, 300)
  }

  return (
    <>
      {/* Hamburger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden flex flex-col gap-1.5 w-8 h-8 items-center justify-center z-50 relative"
        aria-label="Toggle menu"
      >
        <span className={`w-6 h-0.5 bg-text-primary transition-all duration-300 ${isOpen ? 'rotate-45 translate-y-2' : ''}`} />
        <span className={`w-6 h-0.5 bg-text-primary transition-all duration-300 ${isOpen ? 'opacity-0' : ''}`} />
        <span className={`w-6 h-0.5 bg-text-primary transition-all duration-300 ${isOpen ? '-rotate-45 -translate-y-2' : ''}`} />
      </button>

      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-bg-primary/95 backdrop-blur-md z-40 md:hidden transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsOpen(false)}
      />
      
      {/* Menu Content */}
      <div className={`fixed top-16 left-0 right-0 bg-bg-elevated border-b border-border-default z-50 md:hidden transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-y-0' : '-translate-y-full'}`}>
        <nav className="flex flex-col font-mono text-sm">
          <a 
            href="#about" 
            onClick={(e) => { e.preventDefault(); handleScrollTo('about') }}
            className="px-4 py-4 text-text-secondary hover:text-text-primary hover:bg-bg-secondary transition-colors border-b border-border-default cursor-pointer"
          >
            {t.navAbout}
          </a>
          <a 
            href="#experience" 
            onClick={(e) => { e.preventDefault(); handleScrollTo('experience') }}
            className="px-4 py-4 text-text-secondary hover:text-text-primary hover:bg-bg-secondary transition-colors border-b border-border-default cursor-pointer"
          >
            {t.navExperience}
          </a>
          <a 
            href="#projects" 
            onClick={(e) => { e.preventDefault(); handleScrollTo('projects') }}
            className="px-4 py-4 text-text-secondary hover:text-text-primary hover:bg-bg-secondary transition-colors border-b border-border-default cursor-pointer"
          >
            {t.navProjects}
          </a>
          <a 
            href="#education" 
            onClick={(e) => { e.preventDefault(); handleScrollTo('education') }}
            className="px-4 py-4 text-text-secondary hover:text-text-primary hover:bg-bg-secondary transition-colors border-b border-border-default cursor-pointer"
          >
            {t.navEducation}
          </a>
          <a 
            href="#contact" 
            onClick={(e) => { e.preventDefault(); handleScrollTo('contact') }}
            className="px-4 py-4 text-text-secondary hover:text-text-primary hover:bg-bg-secondary transition-colors cursor-pointer"
          >
            {t.navContact}
          </a>
        </nav>
      </div>
    </>
  )
}
