import { Button } from '@/components/atoms/Button'

interface ContactSectionProps {
  phone: string | null
  email: string | null
  translations: any
}

export function ContactSection({ phone, email, translations: t }: ContactSectionProps) {
  return (
    <section
      id="contact"
      className="bg-bg-elevated border border-border-default p-12 text-center md:text-left relative overflow-hidden mt-32 scroll-mt-20"
    >
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: 'radial-gradient(var(--color-text-secondary) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      ></div>

      {/* Dàn ngang 2 bên khi lên màn hình lớn */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-8">
        {/* Khối bên trái: Tiêu đề & Lời nhắn */}
        <div className="space-y-4 md:max-w-xl">
          <h2 className="text-3xl font-bold">{t.ctaTitle}</h2>
          <p className="text-text-secondary text-justify">{t.ctaDesc}</p>
        </div>

        {/* Khối bên phải: 2 Button đồng bộ Style */}
        <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row gap-4 justify-center items-center md:items-end shrink-0">
          {email && (
            <a href={`mailto:${email}`} className="max-w-full">
              <Button className="!border-accent-lime !text-accent-lime hover:!bg-accent-lime/10 font-mono text-sm max-w-full flex items-center">
                <span className="opacity-70 mr-1.5 shrink-0">{t.email}:</span>
                <span className="truncate max-w-[180px] xs:max-w-[240px] sm:max-w-none">
                  {email}
                </span>
              </Button>
            </a>
          )}

          {phone && (
            <a href={`tel:${phone}`} className="max-w-full">
              <Button className="!border-accent-lime !text-accent-lime hover:!bg-accent-lime/10 font-mono text-sm max-w-full flex items-center">
                <span className="opacity-70 mr-1.5 shrink-0">{t.phone}:</span>
                <span className="truncate">{phone}</span>
              </Button>
            </a>
          )}
        </div>
      </div>
    </section>
  )
}
