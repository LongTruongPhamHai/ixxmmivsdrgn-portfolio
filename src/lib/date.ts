// Dates from the CMS are stored in UTC. A "month only" date picked in Vietnam
// (e.g. 1 Jan 2021 00:00 +07) is 2020-12-31T17:00Z, so formatting it in the
// server's timezone (UTC in Docker) would show the previous month/year.
// Always format in the site's timezone instead.
const TIME_ZONE = 'Asia/Ho_Chi_Minh'

const toDate = (value?: string | null) => {
  if (!value) return null
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? null : date
}

export function formatYear(value?: string | null): string {
  const date = toDate(value)
  return date
    ? new Intl.DateTimeFormat('en-US', { year: 'numeric', timeZone: TIME_ZONE }).format(date)
    : ''
}

export function formatMonthYear(value: string | null | undefined, locale: string): string {
  const date = toDate(value)
  return date
    ? new Intl.DateTimeFormat(locale === 'vi' ? 'vi-VN' : 'en-US', {
        month: 'short',
        year: 'numeric',
        timeZone: TIME_ZONE,
      }).format(date)
    : ''
}

/** dd/mm/yyyy in both languages (en-GB, not en-US which would give mm/dd/yyyy) */
export function formatFullDate(value: string | null | undefined, locale: string): string {
  const date = toDate(value)
  return date
    ? new Intl.DateTimeFormat(locale === 'vi' ? 'vi-VN' : 'en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        timeZone: TIME_ZONE,
      }).format(date)
    : ''
}

/* ---------- Calendar days (YYYY-MM-DD) in Vietnam time ---------- */

/** The calendar day of `at` in Vietnam, as YYYY-MM-DD (Vercel runs in UTC) */
export const dayInVN = (at: Date = new Date()): string =>
  new Intl.DateTimeFormat('en-CA', {
    timeZone: TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(at)

/** YYYY-MM-DD + n days (pure calendar arithmetic) */
export const addDays = (day: string, n: number): string => {
  const d = new Date(`${day}T00:00:00Z`)
  d.setUTCDate(d.getUTCDate() + n)
  return d.toISOString().slice(0, 10)
}

/** The hour of `at` in Vietnam, as "YYYY-MM-DDTHH" (e.g. 2026-11-24T09) */
export const hourInVN = (at: Date = new Date()): string => {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat('en-CA', {
      timeZone: TIME_ZONE,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      hourCycle: 'h23',
    })
      .formatToParts(at)
      .map((p) => [p.type, p.value]),
  )
  return `${parts.year}-${parts.month}-${parts.day}T${parts.hour}`
}

/** "MM/YYYY" in Vietnam time (e.g. 01/2026) – same numeric style as dd/mm/yyyy */
export function formatMonthNumeric(value: string | null | undefined): string {
  const date = toDate(value)
  if (!date) return ''
  const parts = new Intl.DateTimeFormat('en-GB', {
    month: '2-digit',
    year: 'numeric',
    timeZone: TIME_ZONE,
  }).formatToParts(date)
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? ''
  return `${get('month')}/${get('year')}`
}
