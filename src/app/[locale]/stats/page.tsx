import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { getDictionary, isLocale } from '@/i18n/dictionaries'
import { addDays, dayInVN } from '@/lib/date'
import { VisitsChart, type DayPoint } from '@/components/stats/VisitsChart'

export const dynamic = 'force-dynamic'

const DAYS = 30

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await props.params
  return { title: `${getDictionary(locale).statsTitle} · IXXMMIVSDRGN` }
}

/** Visit statistics: totals + daily visits for the last 30 days */
export default async function StatsPage(props: { params: Promise<{ locale: string }> }) {
  const { locale } = await props.params
  if (!isLocale(locale)) notFound()
  const t = getDictionary(locale)

  const today = dayInVN()
  const from = addDays(today, -(DAYS - 1))
  const payload = await getPayload({ config: configPromise })
  const [stats, rows] = await Promise.all([
    payload.findGlobal({ slug: 'site-stats', depth: 0 }),
    payload.find({
      collection: 'daily-visits',
      where: { date: { greater_than_equal: from } },
      sort: 'date',
      pagination: false,
      depth: 0,
    }),
  ])

  // full 30-day series, days without visits = 0
  const byDay = new Map(rows.docs.map((r) => [r.date, r.visits ?? 0]))
  const series: DayPoint[] = Array.from({ length: DAYS }, (_, i) => {
    const date = addDays(from, i)
    return { date, visits: byDay.get(date) ?? 0 }
  })

  const sum = (n: number) => series.slice(-n).reduce((s, d) => s + d.visits, 0)
  const best = series.reduce((b, d) => (d.visits > b.visits ? d : b), series[0])
  const nf = new Intl.NumberFormat(locale === 'vi' ? 'vi-VN' : 'en-US')
  const fmtDay = (d: string) =>
    new Intl.DateTimeFormat(locale === 'vi' ? 'vi-VN' : 'en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      timeZone: 'UTC',
    }).format(new Date(`${d}T00:00:00Z`))

  const tiles = [
    { label: t.statsToday, value: nf.format(sum(1)) },
    { label: t.stats7Days, value: nf.format(sum(7)) },
    { label: t.stats30Days, value: nf.format(sum(DAYS)) },
    { label: t.statsTotal, value: nf.format(stats.visits ?? 0) },
  ]

  return (
    <div className="py-10 md:py-14 space-y-10">
      <header className="space-y-3">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tighter uppercase">
          {t.statsTitle}
        </h1>
        <p className="font-mono text-text-secondary">{t.statsIntro}</p>
      </header>

      {/* stat tiles */}
      <dl className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {tiles.map((tile) => (
          <div key={tile.label} className="bg-bg-secondary border border-border-default p-4 md:p-5">
            <dt className="font-mono text-xs uppercase tracking-widest text-text-secondary">
              {tile.label}
            </dt>
            <dd className="mt-2 text-3xl md:text-4xl font-bold tabular-nums">{tile.value}</dd>
          </div>
        ))}
      </dl>

      {/* chart */}
      <section className="bg-bg-secondary border border-border-default p-4 md:p-6 space-y-4">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="text-lg font-bold">{t.statsChartTitle}</h2>
          {best.visits > 0 && (
            <p className="font-mono text-xs text-text-secondary">
              {t.statsBestDay}: <span className="text-text-primary">{fmtDay(best.date)}</span> ·{' '}
              <span className="text-text-primary tabular-nums">{nf.format(best.visits)}</span>
            </p>
          )}
        </div>
        <VisitsChart data={series} locale={locale} label={t.statsChartTitle} />

        {/* table view (accessible alternative to the chart) */}
        <details className="font-mono text-sm">
          <summary className="cursor-pointer text-accent-amber select-none">{t.statsTable}</summary>
          <table className="mt-3 w-full max-w-sm text-left">
            <thead>
              <tr className="text-text-secondary text-xs uppercase">
                <th className="py-1 font-normal">{t.statsDate}</th>
                <th className="py-1 font-normal text-right">{t.visits}</th>
              </tr>
            </thead>
            <tbody>
              {[...series].reverse().map((d) => (
                <tr key={d.date} className="border-t border-border-default">
                  <td className="py-1">{fmtDay(d.date)}</td>
                  <td className="py-1 text-right tabular-nums">{nf.format(d.visits)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </details>
      </section>

      <p className="font-mono text-xs text-text-secondary/70">{t.statsNote}</p>
    </div>
  )
}
