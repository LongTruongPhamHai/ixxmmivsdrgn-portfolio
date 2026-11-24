import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { getDictionary, isLocale } from '@/i18n/dictionaries'
import { addDays, dayInVN, hourInVN } from '@/lib/date'
import { VisitsChart, type ChartPoint } from '@/components/stats/VisitsChart'

export const dynamic = 'force-dynamic'

/** request time (one value for the whole render) */
const currentTime = () => Date.now()

const RANGES = ['hour', 'day', 'month', 'year'] as const
type Range = (typeof RANGES)[number]

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await props.params
  return { title: `${getDictionary(locale).statsTitle} · IXXMMIVSDRGN` }
}

type Props = {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ range?: string }>
}

/** Visit statistics: totals + a chart by hour (24h) / day (30d) / month (12m) / year */
export default async function StatsPage({ params, searchParams }: Props) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  const t = getDictionary(locale)
  const { range: rangeParam } = await searchParams
  const range: Range = RANGES.includes(rangeParam as Range) ? (rangeParam as Range) : 'day'

  const now = currentTime()
  const today = dayInVN(new Date(now))
  const payload = await getPayload({ config: configPromise })

  // daily rows feed the tiles and the day/month/year views; hourly rows only the hour view
  const dailyFrom =
    range === 'year'
      ? undefined
      : range === 'month'
        ? `${addDays(today, -400).slice(0, 7)}-01`
        : addDays(today, -29)
  const [stats, daily, hourly] = await Promise.all([
    payload.findGlobal({ slug: 'site-stats', depth: 0 }),
    payload.find({
      collection: 'daily-visits',
      where: dailyFrom ? { date: { greater_than_equal: dailyFrom } } : {},
      sort: 'date',
      pagination: false,
      depth: 0,
    }),
    range === 'hour'
      ? payload.find({
          collection: 'hourly-visits',
          where: { hour: { greater_than_equal: hourInVN(new Date(now - 23 * 3_600_000)) } },
          sort: 'hour',
          pagination: false,
          depth: 0,
        })
      : null,
  ])

  const dtf = (opts: Intl.DateTimeFormatOptions) =>
    new Intl.DateTimeFormat(locale === 'vi' ? 'vi-VN' : 'en-GB', { ...opts, timeZone: 'UTC' })
  const asDate = (s: string) => new Date(`${s}T00:00:00Z`)
  const byDay = new Map(daily.docs.map((r) => [r.date, r.visits ?? 0]))

  /* ---------- the series for the chosen range ---------- */
  let series: ChartPoint[] = []
  if (range === 'hour') {
    const byHour = new Map((hourly?.docs ?? []).map((r) => [r.hour, r.visits ?? 0]))
    series = Array.from({ length: 24 }, (_, i) => {
      const key = hourInVN(new Date(now - (23 - i) * 3_600_000)) // YYYY-MM-DDTHH
      const [day, hh] = key.split('T')
      return {
        key,
        axis: `${hh}h`,
        full: `${hh}:00 – ${hh}:59, ${dtf({ day: '2-digit', month: '2-digit', year: 'numeric' }).format(asDate(day))}`,
        visits: byHour.get(key) ?? 0,
      }
    })
  } else if (range === 'day') {
    series = Array.from({ length: 30 }, (_, i) => {
      const date = addDays(today, i - 29)
      return {
        key: date,
        axis: dtf({ day: '2-digit', month: '2-digit' }).format(asDate(date)),
        full: dtf({ weekday: 'short', day: '2-digit', month: '2-digit', year: 'numeric' }).format(
          asDate(date),
        ),
        visits: byDay.get(date) ?? 0,
      }
    })
  } else if (range === 'month') {
    const [y, m] = today.split('-').map(Number)
    series = Array.from({ length: 12 }, (_, i) => {
      const d = new Date(Date.UTC(y, m - 1 - (11 - i), 1))
      const key = d.toISOString().slice(0, 7) // YYYY-MM
      const visits = daily.docs
        .filter((r) => r.date.startsWith(key))
        .reduce((s, r) => s + (r.visits ?? 0), 0)
      return {
        key,
        axis: dtf({ month: '2-digit', year: '2-digit' }).format(d),
        full: dtf({ month: 'long', year: 'numeric' }).format(d),
        visits,
      }
    })
  } else {
    const thisYear = Number(today.slice(0, 4))
    const firstYear = Math.min(thisYear, ...daily.docs.map((r) => Number(r.date.slice(0, 4))))
    series = Array.from({ length: thisYear - firstYear + 1 }, (_, i) => {
      const key = String(firstYear + i)
      return {
        key,
        axis: key,
        full: key,
        visits: daily.docs
          .filter((r) => r.date.startsWith(key))
          .reduce((s, r) => s + (r.visits ?? 0), 0),
      }
    })
  }

  /* ---------- tiles (always from the daily rows) ---------- */
  const sumDays = (n: number) =>
    Array.from({ length: n }, (_, i) => byDay.get(addDays(today, -i)) ?? 0).reduce(
      (a, b) => a + b,
      0,
    )
  const nf = new Intl.NumberFormat(locale === 'vi' ? 'vi-VN' : 'en-US')
  const tiles = [
    { label: t.statsToday, value: nf.format(sumDays(1)) },
    { label: t.stats7Days, value: nf.format(sumDays(7)) },
    { label: t.stats30Days, value: nf.format(sumDays(30)) },
    { label: t.statsTotal, value: nf.format(stats.visits ?? 0) },
  ]

  const titles: Record<Range, string> = {
    hour: t.statsChartHour,
    day: t.statsChartTitle,
    month: t.statsChartMonth,
    year: t.statsChartYear,
  }
  const buttons: Record<Range, string> = {
    hour: t.statsByHour,
    day: t.statsByDay,
    month: t.statsByMonth,
    year: t.statsByYear,
  }
  const best = series.reduce((b, d) => (d.visits > b.visits ? d : b), series[0])

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
        {/* range filter */}
        <nav aria-label={t.statsRange} className="flex flex-wrap gap-2">
          {RANGES.map((r) => (
            <Link
              key={r}
              href={r === 'day' ? `/${locale}/stats` : `/${locale}/stats?range=${r}`}
              scroll={false}
              aria-current={r === range ? 'page' : undefined}
              className={`px-3 py-1.5 border font-mono text-xs transition-colors ${
                r === range
                  ? 'border-accent-lime text-accent-lime bg-accent-lime/5'
                  : 'border-border-default text-text-secondary hover:text-text-primary hover:border-border-active'
              }`}
            >
              {buttons[r]}
            </Link>
          ))}
        </nav>

        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="text-lg font-bold">{titles[range]}</h2>
          {best && best.visits > 0 && (
            <p className="font-mono text-xs text-text-secondary">
              {t.statsBest}: <span className="text-text-primary">{best.full}</span> ·{' '}
              <span className="text-text-primary tabular-nums">{nf.format(best.visits)}</span>
            </p>
          )}
        </div>
        <VisitsChart key={range} data={series} locale={locale} label={titles[range]} />
        {range === 'hour' && (
          <p className="font-mono text-[11px] text-text-secondary/70">{t.statsHourNote}</p>
        )}

        {/* table view (accessible alternative to the chart) */}
        <details className="font-mono text-sm">
          <summary className="cursor-pointer text-accent-amber select-none">{t.statsTable}</summary>
          <table className="mt-3 w-full max-w-sm text-left">
            <thead>
              <tr className="text-text-secondary text-xs uppercase">
                <th className="py-1 font-normal">{t.statsPeriod}</th>
                <th className="py-1 font-normal text-right">{t.visits}</th>
              </tr>
            </thead>
            <tbody>
              {[...series].reverse().map((d) => (
                <tr key={d.key} className="border-t border-border-default">
                  <td className="py-1">{d.full}</td>
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
