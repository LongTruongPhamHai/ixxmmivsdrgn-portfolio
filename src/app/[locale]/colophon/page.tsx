import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { isLocale, type Locale } from '@/i18n/dictionaries'

/** cached (ISR); admin edits refresh it immediately via revalidatePath */
export const revalidate = 300

const REPO = 'https://github.com/LongTruongPhamHai/ixxmmivsdrgn-portfolio'

/** Static content of the colophon ("how this site is made"), vi + en */
const content = {
  vi: {
    title: 'Colophon',
    intro:
      'Trang này được làm như thế nào: công nghệ, font chữ, màu sắc và những thay đổi chính từ ngày đầu.',
    stackTitle: 'Công nghệ',
    stack: [
      ['Next.js 16', 'Khung web (App Router, React Server Components)'],
      ['React 19', 'Giao diện'],
      ['Payload CMS 3', 'Quản lý nội dung: hồ sơ, kinh nghiệm, dự án, blog, thống kê'],
      ['PostgreSQL · Supabase', 'Cơ sở dữ liệu'],
      ['Vercel', 'Hosting, tự deploy khi có commit mới'],
      ['Tailwind CSS 4', 'Giao diện, theme sáng/tối bằng biến CSS'],
      ['TypeScript', 'Toàn bộ mã nguồn'],
      ['Lucide', 'Bộ icon'],
    ],
    typeTitle: 'Font chữ',
    type: [
      ['Inter', 'Tiêu đề và nội dung'],
      ['JetBrains Mono', 'Nhãn, số liệu, mã và phong cách terminal'],
    ],
    colorTitle: 'Màu sắc',
    colorIntro:
      'Bảng màu "technical soldier": nền tối gần đen, chữ ngà, điểm nhấn vàng hổ phách và xanh chanh. Theme sáng dùng tông xanh rêu.',
    dark: 'Theme tối',
    light: 'Theme sáng',
    featuresTitle: 'Những chi tiết nhỏ',
    features: [
      'Song ngữ Việt – Anh, cả trang web lẫn trang quản trị.',
      'Theme sáng/tối, ghi nhớ lựa chọn và không nháy khi tải trang.',
      'Trình phát nhạc: nhạc nghi lễ QĐNDVN và bài hát; tự phát ở trang Về tôi, nghe tiếp từ chỗ đã dừng.',
      'Blog với chuyên mục và thẻ; thơ giữ xuống dòng, ca dao – châm ngôn hiển thị dạng trích dẫn.',
      'Đếm lượt truy cập (mỗi phiên trình duyệt một lượt) và trang thống kê theo ngày.',
      'Mục lục bám theo vị trí cuộn ở trang Về tôi.',
    ],
    timelineTitle: 'Dòng thời gian',
    timeline: [
      ['09/2026', 'Phiên bản đầu: trang hồ sơ từ CV, song ngữ, theme sáng/tối.'],
      ['11/2026', 'Đóng gói Docker; chuyển từ MongoDB sang PostgreSQL trên Supabase.'],
      ['11/2026', 'Trình phát nhạc nền với nhạc nghi lễ và bài hát.'],
      ['11/2026', 'Navbar cho các trang, mục lục, làm lại giao diện trên điện thoại.'],
      ['11/2026', 'Blog với chuyên mục và thẻ; trang quản trị song ngữ.'],
      ['11/2026', 'Trang chủ mới, trang Về tôi, đếm và thống kê lượt truy cập.'],
      ['11/2026', 'Colophon – trang bạn đang đọc.'],
    ],
    sourceTitle: 'Mã nguồn',
    source: 'Toàn bộ mã nguồn trang này công khai trên GitHub.',
    sourceLink: 'Xem trên GitHub',
  },
  en: {
    title: 'Colophon',
    intro:
      'How this site is made: technology, typefaces, colors and the main changes since day one.',
    stackTitle: 'Stack',
    stack: [
      ['Next.js 16', 'Web framework (App Router, React Server Components)'],
      ['React 19', 'UI'],
      ['Payload CMS 3', 'Content: profile, experience, projects, blog, stats'],
      ['PostgreSQL · Supabase', 'Database'],
      ['Vercel', 'Hosting, deploys on every commit'],
      ['Tailwind CSS 4', 'Styling, light/dark theme via CSS variables'],
      ['TypeScript', 'All of the code'],
      ['Lucide', 'Icons'],
    ],
    typeTitle: 'Typefaces',
    type: [
      ['Inter', 'Headings and body text'],
      ['JetBrains Mono', 'Labels, numbers, code and the terminal look'],
    ],
    colorTitle: 'Colors',
    colorIntro:
      'A "technical soldier" palette: near-black background, ivory text, amber and lime accents. The light theme uses moss greens.',
    dark: 'Dark theme',
    light: 'Light theme',
    featuresTitle: 'Small details',
    features: [
      'Vietnamese and English, for both the site and the admin panel.',
      'Light/dark theme, remembered and without a flash on load.',
      'Music player: Vietnam People’s Army ceremonial music and songs; autoplays on the About page and resumes where you stopped.',
      'Blog with categories and tags; poems keep their line breaks, sayings and quotes render as large quotes.',
      'Visit counter (one per browser session) and a daily stats page.',
      'A scroll-spy table of contents on the About page.',
    ],
    timelineTitle: 'Timeline',
    timeline: [
      ['09/2026', 'First version: a profile page built from my CV, bilingual, light/dark theme.'],
      ['11/2026', 'Docker; moved from MongoDB to PostgreSQL on Supabase.'],
      ['11/2026', 'Background music player with ceremonial music and songs.'],
      ['11/2026', 'Navbar for pages, table of contents, mobile redesign.'],
      ['11/2026', 'Blog with categories and tags; bilingual admin panel.'],
      ['11/2026', 'New home page, About page, visit counter and stats.'],
      ['11/2026', 'Colophon – the page you are reading.'],
    ],
    sourceTitle: 'Source',
    source: 'The full source code of this site is public on GitHub.',
    sourceLink: 'View on GitHub',
  },
} satisfies Record<Locale, unknown>

const PALETTE = {
  dark: [
    ['Background', '#0A0B0A'],
    ['Surface', '#14150F'],
    ['Elevated', '#1C1E17'],
    ['Text', '#E8E6DD'],
    ['Muted', '#8C8F82'],
    ['Amber', '#FFB020'],
    ['Lime', '#A8FF60'],
  ],
  light: [
    ['Background', '#839E78'],
    ['Surface', '#95B388'],
    ['Elevated', '#A8C799'],
    ['Text', '#121710'],
    ['Muted', '#2B3B28'],
    ['Amber', '#B05E00'],
    ['Lime', '#164010'],
  ],
}

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await props.params
  const c = content[isLocale(locale) ? locale : 'vi']
  return { title: `${c.title} · IXXMMIVSDRGN`, description: c.intro }
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-4">
      <div className="flex items-center gap-4">
        <h2 className="text-2xl font-bold">{title}</h2>
        <div className="h-[1px] flex-1 bg-border-default" />
      </div>
      {children}
    </section>
  )
}

function Rows({ rows }: { rows: string[][] }) {
  return (
    <dl className="divide-y divide-border-default border-y border-border-default">
      {rows.map(([name, desc]) => (
        <div key={name} className="grid sm:grid-cols-[14rem_1fr] gap-x-6 gap-y-1 py-3">
          <dt className="font-mono text-sm text-accent-amber">{name}</dt>
          <dd className="text-text-secondary text-sm">{desc}</dd>
        </div>
      ))}
    </dl>
  )
}

/** How this site is made */
export default async function ColophonPage(props: { params: Promise<{ locale: string }> }) {
  const { locale } = await props.params
  if (!isLocale(locale)) notFound()
  const c = content[locale]

  return (
    <article className="py-10 md:py-14 max-w-4xl space-y-14">
      <header className="space-y-3">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tighter uppercase">{c.title}</h1>
        <p className="font-mono text-text-secondary max-w-2xl">{c.intro}</p>
      </header>

      <Section title={c.stackTitle}>
        <Rows rows={c.stack} />
      </Section>

      <Section title={c.typeTitle}>
        <div className="grid sm:grid-cols-2 gap-4">
          {c.type.map(([name, desc], i) => (
            <div key={name} className="bg-bg-secondary border border-border-default p-5 space-y-2">
              <div className={`text-4xl ${i === 0 ? 'font-sans font-bold' : 'font-mono'}`}>
                Aa Ăă
              </div>
              <div className="font-mono text-sm text-accent-amber">{name}</div>
              <div className="text-sm text-text-secondary">{desc}</div>
            </div>
          ))}
        </div>
      </Section>

      <Section title={c.colorTitle}>
        <p className="text-text-secondary text-sm max-w-2xl">{c.colorIntro}</p>
        {(['dark', 'light'] as const).map((mode) => (
          <div key={mode} className="space-y-2">
            <h3 className="font-mono text-xs uppercase tracking-widest text-text-secondary">
              {mode === 'dark' ? c.dark : c.light}
            </h3>
            <ul className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-2">
              {PALETTE[mode].map(([name, hex]) => (
                <li key={name} className="border border-border-default bg-bg-secondary">
                  <div
                    className="h-14 border-b border-border-default"
                    style={{ background: hex }}
                  />
                  <div className="px-2 py-1.5 font-mono text-[11px] leading-tight">
                    <div className="text-text-primary">{name}</div>
                    <div className="text-text-secondary">{hex}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </Section>

      <Section title={c.featuresTitle}>
        <ul className="space-y-2">
          {c.features.map((f) => (
            <li key={f} className="flex gap-3 text-sm text-text-secondary">
              <span className="text-accent-lime font-mono shrink-0">{'>'}</span>
              <span>{f}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section title={c.timelineTitle}>
        <ol className="border-l border-border-default ml-2 pl-6 space-y-4">
          {c.timeline.map(([when, what], i) => (
            <li key={i} className="relative">
              <span className="absolute -left-[31px] top-1.5 w-3 h-3 rounded-full bg-bg-primary border-2 border-accent-amber" />
              <div className="font-mono text-xs text-accent-amber">{when}</div>
              <div className="text-sm">{what}</div>
            </li>
          ))}
        </ol>
      </Section>

      <Section title={c.sourceTitle}>
        <p className="text-sm text-text-secondary">{c.source}</p>
        <a
          href={REPO}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center h-10 px-5 border border-accent-lime text-accent-lime hover:bg-accent-lime/10 font-mono text-sm transition-colors"
        >
          <span className="mr-2">{'>'}</span>
          {c.sourceLink}
        </a>
      </Section>
    </article>
  )
}
