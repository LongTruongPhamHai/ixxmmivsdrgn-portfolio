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

/* ---------- Calendar days (YYYY-MM-DD) in Vietnam time – used by the daily log ---------- */

/** A calendar day as "YYYY-MM-DD" */
export type Day = string

export const DAY_RE = /^\d{4}-\d{2}-\d{2}$/

/** The calendar day of `at` in Vietnam (en-CA formats as YYYY-MM-DD) */
export const dayInVN = (at: Date = new Date()): Day =>
  new Intl.DateTimeFormat('en-CA', {
    timeZone: TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(at)

/** Today in Vietnam, regardless of the server's timezone (Vercel runs in UTC) */
export const todayVN = (): Day => dayInVN()

/** HH:mm in Vietnam time */
export const timeInVN = (at: Date = new Date()): string =>
  new Intl.DateTimeFormat('en-GB', {
    timeZone: TIME_ZONE,
    hour: '2-digit',
    minute: '2-digit',
  }).format(at)

/** day + n days (works on the calendar, no timezone involved) */
export const addDays = (day: Day, n: number): Day => {
  const d = new Date(`${day}T00:00:00Z`)
  d.setUTCDate(d.getUTCDate() + n)
  return d.toISOString().slice(0, 10)
}

/** Whole days from `a` to `b` (b - a) */
export const daysBetween = (a: Day, b: Day): number =>
  Math.round((Date.parse(`${b}T00:00:00Z`) - Date.parse(`${a}T00:00:00Z`)) / 86_400_000)
