'use client'

import { usePathname, useRouter } from 'next/navigation'

export function LanguageSwitcher({ currentLocale }: { currentLocale: string }) {
  const router = useRouter()
  const pathname = usePathname()

  const toggleLocale = () => {
    const nextLocale = currentLocale === 'vi' ? 'en' : 'vi'
    // This is a naive replacement. In a real robust app, you'd properly split paths.
    // For simple use case where path is /[locale]/...
    const segments = pathname.split('/')
    if (segments[1] === currentLocale) {
      segments[1] = nextLocale
    } else {
      segments.splice(1, 0, nextLocale)
    }
    const newPath = segments.join('/') || '/'
    // keep the query string and hash (e.g. /stats?range=hour, /blog?category=tho)
    router.push(newPath + window.location.search + window.location.hash)
  }

  return (
    <button
      onClick={toggleLocale}
      className="font-mono text-sm font-bold text-text-secondary hover:text-text-primary transition-colors focus:outline-none"
      aria-label="Toggle Language"
    >
      {currentLocale === 'vi' ? 'EN' : 'VI'}
    </button>
  )
}
