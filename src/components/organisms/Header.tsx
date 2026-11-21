'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { NavLinks } from '@/components/molecules/NavLinks'
import { MobileNav } from '@/components/molecules/MobileNav'
import { SectionStrip } from '@/components/navigation/SectionNav'

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
        className={`max-w-7xl mx-auto px-4 flex flex-row items-center justify-between gap-4 transition-all duration-300 ${
          isScrolled ? 'h-16' : 'h-20 sm:h-24'
        }`}
      >
        {/* Title */}
        <Link
          href={`/${locale}`}
          className="font-mono font-bold whitespace-nowrap tracking-wider sm:tracking-widest text-accent-amber hover:text-accent-lime transition-colors text-[15px] min-[360px]:text-base sm:text-lg md:text-xl lg:text-2xl"
        >
          IXXMMIVSDRGN PORTFOLIO
        </Link>

        {/* Tablet + Desktop Nav (>= 640px / sm) */}
        <nav className="hidden sm:flex flex-nowrap justify-end gap-3 md:gap-5 lg:gap-6 font-mono text-sm items-center">
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

      {/* Home page table of contents (only on the home page) */}
      <SectionStrip locale={locale} />

      {/* Scanline Divider */}
      <div className="h-0.5 bg-gradient-to-r from-transparent via-accent-lime/20 to-transparent w-full"></div>
    </header>
  )
}
