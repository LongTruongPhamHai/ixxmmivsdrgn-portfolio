import { Inter, JetBrains_Mono } from 'next/font/google'
import { ThemeInitScript, ThemeProvider } from '@/components/providers/ThemeProvider'
import { ScrollToTopButton } from '@/components/atoms/ScrollToTopButton'
import { LanguageSwitcher } from '@/components/molecules/LanguageSwitcher'
import { ThemeToggle } from '@/components/molecules/ThemeToggle'
import { BackgroundPattern } from '@/components/organisms/BackgroundPattern'
import { Header } from '@/components/organisms/Header'
import { Footer } from '@/components/organisms/Footer'
import { notFound } from 'next/navigation'
import { getDictionary, isLocale } from '@/i18n/dictionaries'
import { getPlaylists } from '@/lib/music'
import { MusicPlayer } from '@/components/molecules/MusicPlayer'
import { VisitCounter } from '@/components/atoms/VisitCounter'
import '@/styles/globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-jetbrains' })

export const metadata = {
  title: 'Developer Portfolio',
  description: 'A modern developer portfolio',
}

export default async function RootLayout(props: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await props.params
  if (!isLocale(locale)) notFound()

  const t = getDictionary(locale)
  const playlists = await getPlaylists()

  return (
    <html
      lang={locale}
      className={`${inter.variable} ${jetbrainsMono.variable} scroll-smooth`}
      suppressHydrationWarning
    >
      <head>
        <ThemeInitScript />
      </head>
      <body className="bg-bg-primary text-text-primary antialiased min-h-screen flex flex-col relative">
        <ThemeProvider defaultTheme="dark">
          <BackgroundPattern />
          <Header locale={locale} />

          <main className="flex-1 max-w-7xl mx-auto px-4 w-full z-10 relative">
            {props.children}
          </main>

          <Footer />

          {/* Visit counter (bottom-left) */}
          <VisitCounter label={t.visits} locale={locale} />

          {/* Floating Action Controls Container */}
          <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 md:bottom-8 md:right-8 lg:bottom-10 lg:right-10 xl:bottom-12 xl:right-12 z-50 flex flex-col gap-2 sm:gap-3 lg:gap-4 items-center">
            {/* Nút 1: Scroll To Top (Tự động ẩn/hiện khi scroll) */}
            <ScrollToTopButton />

            {/* Nút 2: Switcher Ngôn ngữ */}
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-bg-elevated border border-border-default hover:border-accent-lime transition-all duration-300 flex items-center justify-center group relative">
              <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-transparent group-hover:border-accent-lime transition-colors" />
              <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-transparent group-hover:border-accent-lime transition-colors" />
              <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-transparent group-hover:border-accent-lime transition-colors" />
              <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-transparent group-hover:border-accent-lime transition-colors" />
              <LanguageSwitcher currentLocale={locale} />
            </div>

            {/* Nút 3: Toggle Dark/Light Theme */}
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-bg-elevated border border-border-default hover:border-accent-lime transition-all duration-300 flex items-center justify-center group relative">
              <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-transparent group-hover:border-accent-lime transition-colors" />
              <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-transparent group-hover:border-accent-lime transition-colors" />
              <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-transparent group-hover:border-accent-lime transition-colors" />
              <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-transparent group-hover:border-accent-lime transition-colors" />
              <ThemeToggle />
            </div>

            {/* Nút 4: Trình phát nhạc (chỉ hiện khi có file trong public/music) */}
            {playlists.length > 0 && (
              <MusicPlayer
                playlists={playlists}
                labels={{
                  menu: t.musicMenu,
                  play: t.musicPlay,
                  pause: t.musicPause,
                  next: t.musicNext,
                  seek: t.musicSeek,
                  modes: t.musicModes,
                  popup: t.musicPopup,
                  autoplayHint: t.musicHint,
                }}
              />
            )}
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
