import { Inter, JetBrains_Mono } from 'next/font/google'
import { ThemeProvider } from '@/components/providers/ThemeProvider'
import { ScrollToTopButton } from '@/components/atoms/ScrollToTopButton'
import { LanguageSwitcher } from '@/components/molecules/LanguageSwitcher'
import { ThemeToggle } from '@/components/molecules/ThemeToggle'
import { BackgroundPattern } from '@/components/organisms/BackgroundPattern'
import { Header } from '@/components/organisms/Header'
import { Footer } from '@/components/organisms/Footer'
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
  const params = await props.params
  const { locale } = params
  return (
    <html
      lang={locale}
      className={`${inter.variable} ${jetbrainsMono.variable} scroll-smooth`}
      suppressHydrationWarning
    >
      <body className="bg-bg-primary text-text-primary antialiased min-h-screen flex flex-col relative">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <BackgroundPattern />
          <Header locale={locale} />

          <main className="flex-1 max-w-7xl mx-auto px-4 py-8 w-full z-10 relative">
            {props.children}
          </main>

          <Footer />
          <ScrollToTopButton />
          
          {/* Floating Controls */}
          <div className="fixed bottom-24 right-8 z-50 w-12 h-12 bg-bg-elevated border border-border-default hover:border-accent-lime transition-all duration-300 flex items-center justify-center group">
            <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-transparent group-hover:border-accent-lime transition-colors" />
            <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-transparent group-hover:border-accent-lime transition-colors" />
            <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-transparent group-hover:border-accent-lime transition-colors" />
            <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-transparent group-hover:border-accent-lime transition-colors" />
            <LanguageSwitcher currentLocale={locale} />
          </div>
          
          <div className="fixed bottom-8 right-8 z-50 w-12 h-12 bg-bg-elevated border border-border-default hover:border-accent-lime transition-all duration-300 flex items-center justify-center group">
            <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-transparent group-hover:border-accent-lime transition-colors" />
            <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-transparent group-hover:border-accent-lime transition-colors" />
            <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-transparent group-hover:border-accent-lime transition-colors" />
            <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-transparent group-hover:border-accent-lime transition-colors" />
            <ThemeToggle />
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
