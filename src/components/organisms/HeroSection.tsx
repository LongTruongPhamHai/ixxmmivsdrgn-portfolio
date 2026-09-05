'use client'

import { Button } from '@/components/atoms/Button'

interface HeroSectionProps {
  objective: string
  fullName: string | null
  dateOfBirth: string | null
  address: string | null
  translations: any
}

export function HeroSection({
  objective,
  fullName,
  dateOfBirth,
  address,
  translations: t,
}: HeroSectionProps) {
  const handleScrollToContact = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
  }
  return (
    <section id="about" className="pt-12 grid grid-cols-1 lg:grid-cols-5 gap-12 items-center scroll-mt-20">
      <div className="space-y-8 lg:col-span-3">
        <div className="inline-flex items-center gap-3 font-mono text-accent-lime text-xs tracking-widest border border-accent-lime/20 bg-accent-lime/5 px-3 py-1.5 uppercase">
          <span className="w-1.5 h-1.5 bg-accent-lime animate-pulse rounded-full"></span> 
          {t.available}
        </div>
        <h1 className="text-6xl md:text-8xl font-bold tracking-tighter text-text-primary uppercase">
          IXXMMIVSDRGN <br />
          <span className="text-text-secondary font-mono tracking-tight">PORTFOLIO</span>
        </h1>
        <div className="h-[1px] w-32 bg-border-active"></div>
        <p className="text-lg md:text-xl text-text-secondary max-w-3xl leading-relaxed font-mono whitespace-pre-line text-justify">
          {objective}
        </p>
        
        {/* Personal Information */}
        {(fullName || dateOfBirth || address) && (
          <div className="border border-border-default bg-bg-secondary p-4 space-y-2 text-sm font-mono">
            {fullName && <div><span className="text-accent-amber">{t.fullName}:</span> <span className="text-text-primary">{fullName}</span></div>}
            {dateOfBirth && <div><span className="text-accent-amber">{t.dateOfBirth}:</span> <span className="text-text-primary">{dateOfBirth}</span></div>}
            {address && <div><span className="text-accent-amber">{t.address}:</span> <span className="text-text-primary">{address}</span></div>}
          </div>
        )}
        
        <div className="flex gap-6 pt-6">
          <Button onClick={handleScrollToContact}>{t.contact}</Button>
          <Button className="bg-transparent border-border-default text-text-secondary hover:text-text-primary hover:border-text-primary">
            {t.resume}
          </Button>
        </div>
      </div>
      
      {/* Photo Placeholder Space */}
      <div className="hidden lg:flex lg:col-span-2 justify-end relative">
        <div className="aspect-[3/4] relative w-full max-w-[320px] border border-border-default bg-bg-secondary p-3">
          {/* Tactical decoration */}
          <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-accent-amber"></div>
          <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-accent-amber"></div>
          <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-accent-amber"></div>
          <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-accent-amber"></div>
          
          {/* The Image Area */}
          <div className="w-full h-full bg-bg-elevated flex flex-col items-center justify-center text-center p-6 grayscale hover:grayscale-0 transition-all overflow-hidden relative group">
            <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(var(--color-text-secondary) 1px, transparent 1px)', backgroundSize: '16px 16px' }}></div>
            <span className="font-mono text-text-secondary text-sm group-hover:text-text-primary transition-colors z-10">[ PROFILE_PHOTO ]</span>
            <span className="font-mono text-accent-lime text-xs mt-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">700x900</span>
          </div>
        </div>
      </div>
    </section>
  )
}
