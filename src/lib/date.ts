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
  return date ? new Intl.DateTimeFormat('en-US', { year: 'numeric', timeZone: TIME_ZONE }).format(date) : ''
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
