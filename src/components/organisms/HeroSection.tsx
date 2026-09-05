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
    <section id="about" className="pt-8 md:pt-12 scroll-mt-20">
      <div className="space-y-6 md:space-y-8">
        {/* Top Status Badge */}
        <div className="inline-flex items-center gap-3 font-mono text-accent-lime text-xs tracking-widest border border-accent-lime/20 bg-accent-lime/5 px-3 py-1.5 uppercase">
          <span className="w-1.5 h-1.5 bg-accent-lime animate-pulse rounded-full"></span>
          {t.available}
        </div>

        {/* 
          ===================================================================
          1. HEADER SECTION (TITLE + MOBILE IMAGE OVERLAY NEO BOTTOM)
          ===================================================================
        */}
        <div className="relative pb-2 sm:pb-4 md:pb-0">
          {/* Title */}
          <h1 className="pr-24 sm:pr-32 md:pr-0 text-[9vw] sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tighter text-text-primary uppercase leading-[0.95]">
            IXXMMIVSDRGN <br />
            <span className="text-text-secondary font-mono tracking-tight">PORTFOLIO</span>
          </h1>

          {/* 
            Khung ảnh nhỏ (< 768px): 
            - Dùng `bottom-0 right-0` để neo chặt khung ảnh ở đáy vùng Title.
            - Không lo đè xuống Paragraph bên dưới.
          */}
          <div className="md:hidden absolute bottom-0 right-0 z-10 w-[24vw] max-w-[120px] sm:max-w-[140px] aspect-[3/4] border border-border-default bg-bg-secondary p-1 shadow-xl">
            <div className="absolute top-0 left-0 w-2.5 h-2.5 border-t-2 border-l-2 border-accent-amber"></div>
            <div className="absolute top-0 right-0 w-2.5 h-2.5 border-t-2 border-r-2 border-accent-amber"></div>
            <div className="absolute bottom-0 left-0 w-2.5 h-2.5 border-b-2 border-l-2 border-accent-amber"></div>
            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b-2 border-r-2 border-accent-amber"></div>

            <div className="w-full h-full bg-bg-elevated flex flex-col items-center justify-center text-center p-1 grayscale overflow-hidden relative">
              <span className="font-mono text-text-secondary text-[9px] leading-tight">
                [ PHOTO ]
              </span>
            </div>
          </div>
        </div>

        <div className="h-[1px] w-32 bg-border-active"></div>

        {/* 
          ===================================================================
          2. MAIN CONTENT SECTION (PARAGRAPH + INFO | DESKTOP IMAGE)
          ===================================================================
        */}
        <div className="grid grid-cols-1 md:grid-cols-12 md:gap-8 lg:gap-12 md:items-stretch">
          {/* Cột bên trái: Đoạn văn + Thông tin cơ bản + Buttons */}
          <div className="flex flex-col justify-between space-y-6 md:col-span-7 lg:col-span-8">
            <div className="space-y-6">
              <p className="text-base sm:text-lg md:text-xl text-text-secondary max-w-3xl leading-relaxed font-mono whitespace-pre-line text-justify">
                {objective}
              </p>

              {/* Thông tin cơ bản */}
              {(fullName || dateOfBirth || address) && (
                <div className="border border-border-default bg-bg-secondary p-4 space-y-2 text-sm font-mono">
                  {fullName && (
                    <div>
                      <span className="text-accent-amber">{t.fullName}:</span>{' '}
                      <span className="text-text-primary">{fullName}</span>
                    </div>
                  )}
                  {dateOfBirth && (
                    <div>
                      <span className="text-accent-amber">{t.dateOfBirth}:</span>{' '}
                      <span className="text-text-primary">{dateOfBirth}</span>
                    </div>
                  )}
                  {address && (
                    <div>
                      <span className="text-accent-amber">{t.address}:</span>{' '}
                      <span className="text-text-primary">{address}</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Action Buttons (<640px xếp dọc, >=640px xếp ngang) */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-6 pt-4 w-full sm:w-auto">
              <Button onClick={handleScrollToContact} className="w-full sm:w-auto">
                {t.contact}
              </Button>
              <Button className="w-full sm:w-auto bg-transparent border-border-default text-text-secondary hover:text-text-primary hover:border-text-primary">
                {t.resume}
              </Button>
            </div>
          </div>

          {/* Cột bên phải: Khung ảnh cho Desktop (>= 768px) */}
          <div className="hidden md:flex md:col-span-5 lg:col-span-4 h-full">
            <div className="w-full h-full min-h-[320px] border border-border-default bg-bg-secondary p-3 relative flex flex-col">
              {/* Tactical decoration */}
              <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-accent-amber"></div>
              <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-accent-amber"></div>
              <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-accent-amber"></div>
              <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-accent-amber"></div>

              {/* Inner Area tự động kéo full height */}
              <div className="w-full h-full bg-bg-elevated flex flex-col items-center justify-center text-center p-6 grayscale hover:grayscale-0 transition-all overflow-hidden relative group">
                <div
                  className="absolute inset-0 opacity-5"
                  style={{
                    backgroundImage:
                      'radial-gradient(var(--color-text-secondary) 1px, transparent 1px)',
                    backgroundSize: '16px 16px',
                  }}
                ></div>
                <span className="font-mono text-text-secondary text-sm group-hover:text-text-primary transition-colors z-10">
                  [ PROFILE_PHOTO ]
                </span>
                <span className="font-mono text-accent-lime text-xs mt-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                  700x900
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
