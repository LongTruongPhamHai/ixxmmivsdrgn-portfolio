import { Button } from '@/components/atoms/Button'

interface ContactSectionProps {
  phone: string | null
  email: string | null
  translations: any
}

export function ContactSection({ phone, email, translations: t }: ContactSectionProps) {
  return (
    <section id="contact" className="bg-bg-elevated border border-border-default p-12 text-center relative overflow-hidden mt-32 scroll-mt-20">
      <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(var(--color-text-secondary) 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
      <div className="relative z-10 space-y-6">
        <h2 className="text-3xl font-bold">{t.ctaTitle}</h2>
        <p className="text-text-secondary max-w-md mx-auto text-justify">
          {t.ctaDesc}
        </p>
        
        {/* Contact Info */}
        {(phone || email) && (
          <div className="flex flex-col md:flex-row gap-4 justify-center items-center text-sm font-mono">
            {phone && (
              <div className="flex items-center gap-2">
                <span className="text-accent-amber">{t.phone}:</span>
                <a href={`tel:${phone}`} className="text-text-primary hover:text-accent-lime transition-colors">{phone}</a>
              </div>
            )}
            {email && (
              <div className="flex items-center gap-2">
                <span className="text-accent-amber">{t.email}:</span>
                <a href={`mailto:${email}`} className="text-text-primary hover:text-accent-lime transition-colors">{email}</a>
              </div>
            )}
          </div>
        )}
        
        <Button className="!border-accent-lime !text-accent-lime hover:!bg-accent-lime/10">{t.contact}</Button>
      </div>
    </section>
  )
}
