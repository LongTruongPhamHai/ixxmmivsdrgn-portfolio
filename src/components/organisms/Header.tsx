'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { NavLinks } from '@/components/molecules/NavLinks'
import { MobileNav } from '@/components/molecules/MobileNav'

interface HeaderProps {
  locale: string
}

export function Header({ locale }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header className="border-b border-border-default sticky top-0 bg-bg-primary/90 backdrop-blur-md z-50 transition-all duration-300 relative">
      <div
        className={`max-w-7xl mx-auto px-4 flex items-center justify-between transition-all duration-300 flex-row md:flex-col lg:flex-row md:justify-center lg:justify-between gap-0 md:gap-3 lg:gap-0 ${
          isScrolled ? 'h-16 md:py-3 lg:h-16 lg:py-0' : 'h-24 md:py-6 lg:h-24 lg:py-0'
        }`}
      >
        {/* Title */}
        <Link
          href={`/${locale}`}
          className="font-mono font-bold tracking-widest text-accent-amber hover:text-accent-lime transition-colors text-sm sm:text-base md:text-xl lg:text-base"
        >
          IXXMMIVSDRGN PORTFOLIO
        </Link>

        {/* Tablet + Desktop Nav (>= 640px / sm) */}
        <nav className="hidden sm:flex flex-wrap justify-center gap-4 lg:gap-6 font-mono text-sm items-center">
          <NavLinks />
        </nav>

        {/* Mobile Hamburger Button (< 640px / sm) */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="sm:hidden flex flex-col gap-1.5 w-8 h-8 items-center justify-center z-50 relative"
          aria-label="Toggle menu"
        >
          <span
            className={`w-6 h-0.5 bg-text-primary transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`}
          />
          <span
            className={`w-6 h-0.5 bg-text-primary transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : ''}`}
          />
          <span
            className={`w-6 h-0.5 bg-text-primary transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}
          />
        </button>
      </div>

      {/* Mobile Menu Overlay & Nav (< 640px) */}
      <MobileNav
        locale={locale}
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      {/* Scanline Divider */}
      <div className="h-0.5 bg-gradient-to-r from-transparent via-accent-lime/20 to-transparent w-full"></div>
    </header>
  )
}
