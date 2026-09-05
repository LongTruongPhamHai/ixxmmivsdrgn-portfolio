'use client'

import { useState, useEffect } from 'react'

export function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    window.addEventListener('scroll', toggleVisibility)
    return () => window.removeEventListener('scroll', toggleVisibility)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  if (!isVisible) return null

  return (
    <button
      onClick={scrollToTop}
      className="w-10 h-10 sm:w-12 sm:h-12 bg-bg-elevated border border-border-default hover:border-accent-lime text-text-secondary hover:text-accent-lime transition-all duration-300 flex items-center justify-center group relative"
      aria-label="Scroll to top"
    >
      {/* Corner brackets */}
      <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-transparent group-hover:border-accent-lime transition-colors" />
      <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-transparent group-hover:border-accent-lime transition-colors" />
      <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-transparent group-hover:border-accent-lime transition-colors" />
      <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-transparent group-hover:border-accent-lime transition-colors" />

      {/* Arrow up icon */}
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 10l7-7m0 0l7 7m-7-7v18"
        />
      </svg>
    </button>
  )
}
