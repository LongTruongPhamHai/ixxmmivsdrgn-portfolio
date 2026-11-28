import Link from 'next/link'
import { Corners, Photo } from './HeroSection'

interface HomeIntroProps {
  locale: string
  fullName: string | null
  avatar: { url: string; alt: string } | null
  address: string | null
  email: string | null
  currentRole: { role: string; company: string } | null
  stack: string[]
  t: Record<string, any>
}

/** Short home-page introduction: who, what now, main stack – full details live on /about */
export function HomeIntro({
  locale,
  fullName,
  avatar,
  address,
  email,
  currentRole,
  stack,
  t,
}: HomeIntroProps) {
  const intro = t.homeWelcome

  const facts = [
    currentRole && {
      label: t.homeCurrently,
      value: `${currentRole.role} ${t.homeAt} ${currentRole.company}`,
    },
    address && { label: t.homeLocation, value: address },
  ].filter(Boolean) as { label: string; value: string }[]

  return (
    <section className="pt-8 md:pt-12 space-y-8">
      <div className="inline-flex items-center gap-3 font-mono text-accent-lime text-xs tracking-widest border border-accent-lime/20 bg-accent-lime/5 px-3 py-1.5 uppercase">
        <span className="w-1.5 h-1.5 bg-accent-lime animate-pulse rounded-full"></span>
        {t.available}
      </div>

      <div className="flex flex-col md:flex-row gap-8 md:gap-12 md:items-center">
        <div className="flex-1 min-w-0 space-y-6">
          <h1 className="text-[12.5vw] sm:text-6xl lg:text-7xl font-bold tracking-tighter uppercase leading-[0.95]">
            IXXMMIVSDRGN
            <span className="hidden md:block text-text-secondary font-mono tracking-tight text-[0.55em] mt-2 normal-case">
              {fullName}
            </span>
          </h1>

          {/* < 768px: small photo + name, current role, location */}
          <div className="md:hidden flex gap-4 items-stretch">
            <div className="relative w-24 sm:w-28 shrink-0 aspect-[3/4] border border-border-default bg-bg-secondary p-1 shadow-xl">
              <Corners size="sm" />
              <div className="relative w-full h-full bg-bg-elevated flex items-center justify-center overflow-hidden">
                <Photo avatar={avatar} placeholder="[ PHOTO ]" />
              </div>
            </div>
            <div className="flex-1 min-w-0 flex flex-col justify-center gap-2 font-mono text-sm border-l border-border-default pl-4">
              {fullName && (
                <div className="text-text-primary font-bold text-base leading-snug">{fullName}</div>
              )}
              {facts.map((f) => (
                <div key={f.label}>
                  <div className="text-accent-amber text-[11px] uppercase tracking-wider">
                    {f.label}
                  </div>
                  <div className="text-text-primary leading-snug">{f.value}</div>
                </div>
              ))}
            </div>
          </div>

          {intro && (
            <p className="text-base sm:text-lg text-text-secondary max-w-2xl leading-relaxed font-mono line-clamp-5">
              {intro}
            </p>
          )}

          {(facts.length > 0 || stack.length > 0) && (
            <dl className="grid gap-3 font-mono text-sm max-w-2xl">
              {facts.map((f) => (
                <div key={f.label} className="hidden md:flex flex-wrap gap-x-2">
                  <dt className="text-accent-amber">{f.label}:</dt>
                  <dd className="text-text-primary">{f.value}</dd>
                </div>
              ))}
              {stack.length > 0 && (
                <div className="space-y-2">
                  <dt className="text-accent-amber">{t.homeStack}:</dt>
                  <dd className="flex flex-wrap gap-2">
                    {stack.map((s) => (
                      <span
                        key={s}
                        className="px-2 py-0.5 bg-bg-elevated border border-border-default text-xs"
                      >
                        {s}
                      </span>
                    ))}
                  </dd>
                </div>
              )}
            </dl>
          )}

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <Link
              href={`/${locale}/about`}
              className="inline-flex items-center justify-center h-10 px-5 border border-accent-lime text-accent-lime hover:bg-accent-lime/10 font-mono text-sm transition-colors"
            >
              <span className="mr-2">{'>'}</span>
              {t.homeViewAbout}
            </Link>
            <Link
              href={`/${locale}/blog`}
              className="inline-flex items-center justify-center h-10 px-5 border border-border-default text-text-secondary hover:text-text-primary hover:border-text-primary font-mono text-sm transition-colors"
            >
              <span className="mr-2 text-accent-lime">{'>'}</span>
              {t.homeReadBlog}
            </Link>
            {email && (
              <a
                href={`mailto:${email}`}
                className="inline-flex items-center justify-center h-10 px-5 border border-border-default text-text-secondary hover:text-text-primary hover:border-text-primary font-mono text-sm transition-colors"
              >
                <span className="mr-2 text-accent-lime">{'>'}</span>
                {t.contact}
              </a>
            )}
          </div>
        </div>

        {/* photo */}
        <div className="hidden md:block relative w-56 lg:w-64 shrink-0 aspect-[3/4] border border-border-default bg-bg-secondary p-2.5 shadow-xl">
          <Corners size="sm" />
          <div className="relative w-full h-full bg-bg-elevated flex items-center justify-center overflow-hidden">
            <Photo avatar={avatar} placeholder="[ PHOTO ]" />
          </div>
        </div>
      </div>
    </section>
  )
}
