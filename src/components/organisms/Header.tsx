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
    <header className="border-b border-border-default sticky top-0 bg-bg-primary/90 backdrop-blur-md z-50 transition-all duration-300">
      <div className={`max-w-7xl mx-auto px-4 flex flex-row md:flex-col lg:flex-row items-center justify-between md:justify-center lg:justify-between gap-0 md:gap-3 lg:gap-0 transition-all duration-300 ${
        isScrolled 
          ? 'h-16 md:py-3 lg:h-16 lg:py-0' 
          : 'h-24 md:py-6 lg:h-24 lg:py-0'
      }`}>
        {/* Title */}
        <Link
          href={`/${locale}`}
          className="font-mono font-bold tracking-widest text-accent-amber hover:text-accent-lime transition-colors text-sm md:text-base"
        >
          IXXMMIVSDRGN PORTFOLIO
        </Link>

        {/* Tablet + Desktop Nav (>= md, ẩn dưới md) */}
        <nav className="hidden md:flex flex-wrap justify-center gap-6 font-mono text-sm items-center">
          <NavLinks />
        </nav>

        {/* Mobile Controls (< md) */}
        <div className="flex md:hidden items-center gap-3">
          <MobileNav locale={locale} />
        </div>
      </div>

      {/* Scanline Divider */}
      <div className="h-0.5 bg-gradient-to-r from-transparent via-accent-lime/20 to-transparent w-full"></div>
    </header>
  )
}
