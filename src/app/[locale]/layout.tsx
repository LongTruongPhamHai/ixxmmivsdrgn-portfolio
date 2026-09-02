import { Inter, JetBrains_Mono } from 'next/font/google'
import { ThemeProvider } from '@/components/providers/ThemeProvider'
import { ThemeToggle } from '@/components/molecules/ThemeToggle'
import { LanguageSwitcher } from '@/components/molecules/LanguageSwitcher'
import '@/styles/globals.css'
import Link from 'next/link'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-jetbrains' })

export const metadata = {
  title: 'Developer Portfolio',
  description: 'A modern developer portfolio',
}

export default async function RootLayout(
  props: {
    children: React.ReactNode
    params: Promise<{ locale: string }>
  }
) {
  const params = await props.params;
  const { locale } = params;
  return (
    <html lang={locale} className={`${inter.variable} ${jetbrainsMono.variable}`} suppressHydrationWarning>
      <body className="bg-bg-primary text-text-primary antialiased min-h-screen flex flex-col relative">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
        {/* Global Camo Background & Grid */}
        <svg className="fixed inset-0 w-full h-full opacity-30 pointer-events-none z-0" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="pixel-camo" width="120" height="120" patternUnits="userSpaceOnUse" patternTransform="scale(3)">
              {/* Background Color */}
              <rect width="120" height="120" fill="var(--color-bg-primary)" />
              {/* Pattern Layer 1 */}
              <path d="M0 0h20v20H0zm40 20h20v20H40zm-20 40h20v20H20zm40-20h20v20H60zm20-40h20v20H80zm-40 80h20v20H40z" fill="var(--color-bg-secondary)" />
              {/* Pattern Layer 2 */}
              <path d="M20 0h20v20H20zm40 0h20v20H60zM0 40h20v20H0zm40 20h20v20H40zm-20 20h20v20H20zm60 20h20v20H80zM80 40h20v20H80z" fill="var(--color-bg-elevated)" />
              {/* Pattern Layer 3 */}
              <path d="M0 20h20v20H0zm20 20h20v20H20zm40 20h20v20H60zm20 40h20v20H80zM100 0h20v20h-20z" fill="var(--color-border-default)" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#pixel-camo)" />
        </svg>
        <div className="pointer-events-none fixed inset-0 z-0 opacity-[0.15] mix-blend-overlay" style={{ backgroundImage: 'linear-gradient(var(--color-text-secondary) 1px, transparent 1px), linear-gradient(90deg, var(--color-text-secondary) 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>
        
        {/* Navbar */}
        <header className="border-b border-border-default sticky top-0 bg-bg-primary/90 backdrop-blur-md z-50">
          <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
            <Link href={`/${locale}`} className="font-mono font-bold tracking-widest text-accent-amber hover:text-accent-lime transition-colors">
              IXXMMIVSDRGN PORTFOLIO
            </Link>
            <nav className="flex gap-6 font-mono text-sm items-center">
              <Link href={`/${locale}/projects`} className="text-text-secondary hover:text-text-primary transition-colors">Projects</Link>
              <Link href={`/${locale}/about`} className="text-text-secondary hover:text-text-primary transition-colors">About</Link>
              <Link href="/admin" className="text-text-secondary hover:text-accent-amber transition-colors mr-4">Admin</Link>
              
              <div className="flex items-center gap-2 border-l border-border-default pl-4">
                <LanguageSwitcher currentLocale={locale} />
                <ThemeToggle />
              </div>
            </nav>
          </div>
          {/* Scanline Divider */}
        <div className="h-0.5 bg-gradient-to-r from-transparent via-accent-lime/20 to-transparent w-full"></div>
        </header>
        
        <main className="flex-1 max-w-7xl mx-auto px-4 py-8 w-full z-10 relative">
          {props.children}
        </main>
        
        <footer className="border-t border-border-default py-8 mt-auto z-10 relative bg-bg-primary/80 backdrop-blur">
          <div className="max-w-7xl mx-auto px-4 text-center font-mono text-xs text-text-secondary">
            © {new Date().getFullYear()} ixxmmivsdrgn
          </div>
        </footer>
        </ThemeProvider>
      </body>
    </html>
  )
}
