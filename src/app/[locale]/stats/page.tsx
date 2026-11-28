import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { getDictionary, isLocale } from '@/i18n/dictionaries'
import { addDays, dayInVN } from '@/lib/date'
import { VisitsChart, type ChartPoint } from '@/components/stats/VisitsChart'

export const dynamic = 'force-dynamic'

/** request time (one value for the whole render) */
const currentTime = () => Date.now()

const RANGES = ['day', 'week', 'month', 'year'] as const
type Range = (typeof RANGES)[number]

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await props.params
  return { title: `${getDictionary(locale).statsTitle} · IXXMMIVSDRGN` }
}

type Props = {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ range?: string; back?: string }>
}

/**
 * Visit statistics: totals + a chart of one period – a day (by hour), a week / month (by day)
 * or a year (by month). ‹ › step to the previous / next period (`back` = periods before now).
 */
export default async function StatsPage({ params, searchParams }: Props) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  const t = getDictionary(locale)
  const sp = await searchParams
  const range: Range = RANGES.includes(sp.range as Range) ? (sp.range as Range) : 'week'
  const back = Math.max(0, Math.floor(Number(sp.back) || 0))

  const now = currentTime()
  const today = dayInVN(new Date(now))
  const [ty, tm] = today.split('-').map(Number)
  const asDate = (s: string) => new Date(`${s}T00:00:00Z`)
  const iso = (d: Date) => d.toISOString().slice(0, 10)

  /* ---------- the period shown: [from, to] (inclusive days) ---------- */
  let from: string
  let to: string
  if (range === 'day') {
    from = to = addDays(today, -back)
  } else if (range === 'week') {
    const monday = addDays(today, -((asDate(today).getUTCDay() + 6) % 7) - 7 * back)
    from = monday
    to = addDays(monday, 6)
  } else if (range === 'month') {
    from = iso(new Date(Date.UTC(ty, tm - 1 - back, 1)))
    to = iso(new Date(Date.UTC(ty, tm - back, 0)))
  } else {
    from = `${ty - back}-01-01`
    to = `${ty - back}-12-31`
  }

  const payload = await getPayload({ config: configPromise })
  const [stats, recent, daily, hourly, first] = await Promise.all([
    payload.findGlobal({ slug: 'site-stats', depth: 0 }),
    // tiles: last 30 days
    payload.find({
      collection: 'daily-visits',
      where: { date: { greater_than_equal: addDays(today, -29) } },
      pagination: false,
      depth: 0,
    }),
    payload.find({
      collection: 'daily-visits',
      where: { and: [{ date: { greater_than_equal: from } }, { date: { less_than_equal: to } }] },
      sort: 'date',
      pagination: false,
      depth: 0,
    }),
    range === 'day'
      ? payload.find({
          collection: 'hourly-visits',
          where: {
            and: [
              { hour: { greater_than_equal: `${from}T00` } },
              { hour: { less_than_equal: `${from}T23` } },
            ],
          },
          pagination: false,
          depth: 0,
        })
      : null,
    // earliest recorded day: no "previous" before it
    payload.find({ collection: 'daily-visits', sort: 'date', limit: 1, depth: 0 }),
  ])

  const dtf = (opts: Intl.DateTimeFormatOptions) =>
    new Intl.DateTimeFormat(locale === 'vi' ? 'vi-VN' : 'en-GB', { ...opts, timeZone: 'UTC' })
  const dmy = (s: string) =>
    dtf({ day: '2-digit', month: '2-digit', year: 'numeric' }).format(asDate(s))
  const byDay = new Map(daily.docs.map((r) => [r.date, r.visits ?? 0]))
  const days = (a: string, b: string) => {
    const out: string[] = []
    for (let d = a; d <= b; d = addDays(d, 1)) out.push(d)
    return out
  }

  /* ---------- the series ---------- */
  let series: ChartPoint[] = []
  let title: string
  if (range === 'day') {
    const byHour = new Map((hourly?.docs ?? []).map((r) => [r.hour, r.visits ?? 0]))
    series = Array.from({ length: 24 }, (_, h) => {
      const hh = String(h).padStart(2, '0')
      return {
        key: `${from}T${hh}`,
        axis: `${hh}h`,
        full: `${hh}:00 – ${hh}:59, ${dmy(from)}`,
        visits: byHour.get(`${from}T${hh}`) ?? 0,
      }
    })
    title = `${t.statsChartDay} ${dtf({ weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' }).format(asDate(from))}`
  } else if (range === 'year') {
    const y = ty - back
    series = Array.from({ length: 12 }, (_, i) => {
      const d = new Date(Date.UTC(y, i, 1))
      const key = d.toISOString().slice(0, 7)
      return {
        key,
        axis: dtf({ month: '2-digit' }).format(d),
        full: dtf({ month: 'long', year: 'numeric' }).format(d),
        visits: daily.docs
          .filter((r) => r.date.startsWith(key))
          .reduce((s, r) => s + (r.visits ?? 0), 0),
      }
    })
    title = `${t.statsChartYear} ${y}`
  } else {
    series = days(from, to).map((date) => ({
      key: date,
      axis:
        range === 'week'
          ? dtf({ weekday: 'short' }).format(asDate(date))
          : dtf({ day: '2-digit' }).format(asDate(date)),
      full: dtf({ weekday: 'short', day: '2-digit', month: '2-digit', year: 'numeric' }).format(
        asDate(date),
      ),
      visits: byDay.get(date) ?? 0,
    }))
    title =
      range === 'week'
        ? `${t.statsChartWeek} ${dmy(from)} – ${dmy(to)}`
        : `${t.statsChartMonth} ${from.slice(5, 7)}/${from.slice(0, 4)}`
  }

  const href = (r: Range, n: number) => {
    const q = new URLSearchParams()
    if (r !== 'week') q.set('range', r)
    if (n > 0) q.set('back', String(n))
    const qs = q.toString()
    return `/${locale}/stats${qs ? `?${qs}` : ''}`
  }
  const firstDay = first.docs[0]?.date
  const hasPrev = Boolean(firstDay && firstDay < from)
  const hasNext = back > 0
  const total = series.reduce((s, d) => s + d.visits, 0)

  /* ---------- tiles (always from the daily rows) ---------- */
  const byRecent = new Map(recent.docs.map((r) => [r.date, r.visits ?? 0]))
  const sumDays = (n: number) =>
    Array.from({ length: n }, (_, i) => byRecent.get(addDays(today, -i)) ?? 0).reduce(
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

  const buttons: Record<Range, string> = {
    day: t.statsByDay,
    week: t.statsByWeek,
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
        <p className="font-mono text-text-secondary text-justify">{t.statsIntro}</p>
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
              href={href(r, 0)}
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

        {/* period: ‹ title › */}
        <div className="flex items-center gap-2">
          <PeriodLink to={hasPrev ? href(range, back + 1) : null} label={t.statsPrev} dir="prev" />
          <h2 className="flex-1 text-center text-base md:text-lg font-bold">{title}</h2>
          <PeriodLink to={hasNext ? href(range, back - 1) : null} label={t.statsNext} dir="next" />
        </div>
        <p className="font-mono text-xs text-text-secondary text-center">
          {t.statsPeriodTotal}:{' '}
          <span className="text-text-primary tabular-nums">{nf.format(total)}</span>
          {best && best.visits > 0 && (
            <>
              {' · '}
              {t.statsBest}: <span className="text-text-primary">{best.full}</span> (
              <span className="text-text-primary tabular-nums">{nf.format(best.visits)}</span>)
            </>
          )}
        </p>
        <VisitsChart key={`${range}-${back}`} data={series} locale={locale} label={title} />
        {range === 'day' && (
          <p className="font-mono text-[11px] text-text-secondary/70">{t.statsHourNote}</p>
        )}
      </section>

      <p className="font-mono text-xs text-text-secondary/70">{t.statsNote}</p>
    </div>
  )
}

/** ‹ / › link to the previous / next period; dimmed when there is none */
function PeriodLink({
  to,
  label,
  dir,
}: {
  to: string | null
  label: string
  dir: 'prev' | 'next'
}) {
  const cls =
    'shrink-0 inline-flex items-center justify-center w-9 h-9 border font-mono text-lg transition-colors'
  const icon = dir === 'prev' ? '‹' : '›'
  if (!to)
    return (
      <span aria-hidden className={`${cls} border-border-default text-text-secondary/40`}>
        {icon}
      </span>
    )
  return (
    <Link
      href={to}
      scroll={false}
      aria-label={label}
      title={label}
      className={`${cls} border-border-default text-text-secondary hover:text-accent-lime hover:border-accent-lime`}
    >
      {icon}
    </Link>
  )
}
