'use client'

import { Button } from '@/components/atoms/Button'

interface HeroSectionProps {
  objective: string
  fullName: string | null
  dateOfBirth: string | null
  address: string | null
  avatar: { url: string; alt: string } | null
  translations: any
}

/** Amber corner brackets around a frame */
function Corners({ size }: { size: 'sm' | 'lg' }) {
  const s = size === 'sm' ? 'w-2.5 h-2.5' : 'w-6 h-6'
  return (
    <>
      <div className={`absolute top-0 left-0 ${s} border-t-2 border-l-2 border-accent-amber z-10`} />
      <div className={`absolute top-0 right-0 ${s} border-t-2 border-r-2 border-accent-amber z-10`} />
      <div className={`absolute bottom-0 left-0 ${s} border-b-2 border-l-2 border-accent-amber z-10`} />
      <div className={`absolute bottom-0 right-0 ${s} border-b-2 border-r-2 border-accent-amber z-10`} />
    </>
  )
}

/** Profile photo from the CMS, or a placeholder when none is uploaded */
function Photo({ avatar, placeholder }: { avatar: HeroSectionProps['avatar']; placeholder: string }) {
  if (avatar) {
    // eslint-disable-next-line @next/next/no-img-element -- CMS media URL, size varies
    return <img src={avatar.url} alt={avatar.alt} className="absolute inset-0 w-full h-full object-cover" />
  }
  return (
    <span className="font-mono text-text-secondary text-[10px] sm:text-sm group-hover:text-text-primary transition-colors z-10">
      {placeholder}
    </span>
  )
}

export function HeroSection({
  objective,
  fullName,
  dateOfBirth,
  address,
  avatar,
  translations: t,
}: HeroSectionProps) {
  const handleScrollToContact = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
  }

  const hasInfo = Boolean(fullName || dateOfBirth || address)

  const infoRows = [
    { label: t.dateOfBirth, value: dateOfBirth },
    { label: t.address, value: address },
  ].filter((r) => r.value)

  return (
    <section id="about" className="pt-8 md:pt-12 scroll-mt-32">
      <div className="space-y-6 md:space-y-8">
        {/* Status badge */}
        <div className="inline-flex items-center gap-3 font-mono text-accent-lime text-xs tracking-widest border border-accent-lime/20 bg-accent-lime/5 px-3 py-1.5 uppercase">
          <span className="w-1.5 h-1.5 bg-accent-lime animate-pulse rounded-full"></span>
          {t.available}
        </div>

        {/* Title – full width on every screen */}
        <h1 className="text-[12.5vw] sm:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tighter text-text-primary uppercase leading-[0.95]">
          IXXMMIVSDRGN <br />
          <span className="text-text-secondary font-mono tracking-tight">PORTFOLIO</span>
        </h1>

        <div className="h-[1px] w-32 bg-border-active"></div>

        {/*
          < 768px: "ID card" – photo on the left, personal info on the right
        */}
        <div className="md:hidden flex gap-4 items-stretch">
          <div className="relative w-28 sm:w-36 shrink-0 aspect-[3/4] border border-border-default bg-bg-secondary p-1 shadow-xl">
            <Corners size="sm" />
            <div className="relative w-full h-full bg-bg-elevated flex items-center justify-center overflow-hidden">
              <Photo avatar={avatar} placeholder="[ PHOTO ]" />
            </div>
          </div>

          {hasInfo && (
            <div className="flex-1 min-w-0 flex flex-col justify-center gap-3 font-mono text-sm border-l border-border-default pl-4">
              {fullName && (
                <div>
                  <div className="text-accent-amber text-[11px] uppercase tracking-wider">{t.fullName}</div>
                  <div className="text-text-primary font-bold leading-snug">{fullName}</div>
                </div>
              )}
              {infoRows.map((r) => (
                <div key={r.label}>
                  <div className="text-accent-amber text-[11px] uppercase tracking-wider">{r.label}</div>
                  <div className="text-text-primary leading-snug">{r.value}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Main content: paragraph (+ info on desktop) + buttons | desktop photo */}
        <div className="grid grid-cols-1 md:grid-cols-12 md:gap-8 lg:gap-12 md:items-stretch">
          <div className="flex flex-col justify-between space-y-6 md:col-span-7 lg:col-span-8">
            <div className="space-y-6">
              <p className="text-base sm:text-lg md:text-xl text-text-secondary max-w-3xl leading-relaxed font-mono whitespace-pre-line text-justify">
                {objective}
              </p>

              {/* Personal info – desktop (on mobile it sits next to the photo) */}
              {hasInfo && (
                <div className="hidden md:block border border-border-default bg-bg-secondary p-4 space-y-2 text-sm font-mono">
                  {fullName && (
                    <div>
                      <span className="text-accent-amber">{t.fullName}:</span>{' '}
                      <span className="text-text-primary">{fullName}</span>
                    </div>
                  )}
                  {infoRows.map((r) => (
                    <div key={r.label}>
                      <span className="text-accent-amber">{r.label}:</span>{' '}
                      <span className="text-text-primary">{r.value}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Action buttons (< 640px stacked, >= 640px side by side) */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-6 pt-2 md:pt-4 w-full sm:w-auto">
              <Button onClick={handleScrollToContact} className="w-full sm:w-auto">
                {t.contact}
              </Button>
              <Button className="w-full sm:w-auto bg-transparent border-border-default text-text-secondary hover:text-text-primary hover:border-text-primary">
                {t.resume}
              </Button>
            </div>
          </div>

          {/* Desktop photo (>= 768px) */}
          <div className="hidden md:flex md:col-span-5 lg:col-span-4 h-full">
            <div className="w-full h-full min-h-[320px] border border-border-default bg-bg-secondary p-3 relative flex flex-col">
              <Corners size="lg" />
              <div className="w-full h-full bg-bg-elevated flex flex-col items-center justify-center text-center p-6 grayscale hover:grayscale-0 transition-all overflow-hidden relative group">
                {!avatar && (
                  <div
                    className="absolute inset-0 opacity-5"
                    style={{
                      backgroundImage: 'radial-gradient(var(--color-text-secondary) 1px, transparent 1px)',
                      backgroundSize: '16px 16px',
                    }}
                  ></div>
                )}
                <Photo avatar={avatar} placeholder="[ PROFILE_PHOTO ]" />
                {!avatar && (
                  <span className="font-mono text-accent-lime text-xs mt-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                    700x900
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
