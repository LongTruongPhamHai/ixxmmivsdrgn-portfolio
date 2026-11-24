import type { Payload, PayloadRequest } from 'payload'
import type { DailyLog, Task } from '@/payload-types'
import { DAY_RE, timeInVN, todayVN, type Day } from './date'

/* ------------------------------------------------------------------ */
/* Pure logic (unit-tested in tests/int/dailyLog.int.spec.ts)          */
/* ------------------------------------------------------------------ */

const OPEN: Task['status'][] = ['todo', 'doing']

/**
 * Which tasks move to `today`: unfinished ones planned for an earlier day.
 * Returns the changes to apply; tasks already on/after today, done or dropped are left alone.
 */
export function planRollover(
  tasks: Pick<Task, 'id' | 'status' | 'plannedFor' | 'carryCount'>[],
  today: Day,
): { id: Task['id']; plannedFor: Day; carryCount: number }[] {
  return tasks
    .filter((t) => OPEN.includes(t.status) && t.plannedFor && t.plannedFor < today)
    .map((t) => ({ id: t.id, plannedFor: today, carryCount: (t.carryCount ?? 0) + 1 }))
}

/** Open tasks first (by order), then done/dropped ones (by completion time) */
export function sortTasks<T extends Pick<Task, 'status' | 'order' | 'completedAt' | 'id'>>(
  tasks: T[],
): T[] {
  const rank = (t: T) => (OPEN.includes(t.status) ? 0 : 1)
  return [...tasks].sort(
    (a, b) =>
      rank(a) - rank(b) ||
      (rank(a) === 0
        ? (a.order ?? 0) - (b.order ?? 0) || Number(a.id) - Number(b.id)
        : (a.completedAt ?? '').localeCompare(b.completedAt ?? '')),
  )
}

/* ------------------------------------------------------------------ */
/* Data access – every call runs with the user's permissions           */
/* ------------------------------------------------------------------ */

type Ctx = { payload: Payload; user: PayloadRequest['user'] }
const as = ({ user }: Ctx) => ({ user, overrideAccess: false as const })

export const assertDay = (day: string): Day => {
  if (!DAY_RE.test(day)) throw new Error(`Invalid day: ${day}`)
  return day
}

/** The DailyLog of `day`, created on first use */
export async function getOrCreateLog(ctx: Ctx, day: Day): Promise<DailyLog> {
  const found = await ctx.payload.find({
    collection: 'daily-logs',
    where: { date: { equals: day } },
    limit: 1,
    ...as(ctx),
  })
  if (found.docs[0]) return found.docs[0]
  try {
    return await ctx.payload.create({ collection: 'daily-logs', data: { date: day }, ...as(ctx) })
  } catch {
    // created concurrently (unique date) – read it back
    const again = await ctx.payload.find({
      collection: 'daily-logs',
      where: { date: { equals: day } },
      limit: 1,
      ...as(ctx),
    })
    if (!again.docs[0]) throw new Error(`Could not create daily log for ${day}`)
    return again.docs[0]
  }
}

/**
 * Move unfinished tasks from earlier days to today – at most once per day.
 * The day's log is stamped first (rolledOverAt), so opening the page again,
 * on another device or in parallel doesn't move/count tasks twice.
 */
export async function rolloverToToday(ctx: Ctx, log: DailyLog, today: Day): Promise<DailyLog> {
  if (log.rolledOverAt || log.date !== today) return log

  const stamped = await ctx.payload.update({
    collection: 'daily-logs',
    id: log.id,
    data: { rolledOverAt: new Date().toISOString() },
    ...as(ctx),
  })

  const stale = await ctx.payload.find({
    collection: 'tasks',
    where: { and: [{ status: { in: OPEN } }, { plannedFor: { less_than: today } }] },
    pagination: false,
    depth: 0,
    ...as(ctx),
  })

  for (const change of planRollover(stale.docs, today)) {
    await ctx.payload.update({
      collection: 'tasks',
      id: change.id,
      data: { plannedFor: change.plannedFor, carryCount: change.carryCount },
      ...as(ctx),
    })
  }
  return stamped
}

export type DayView = {
  date: Day
  today: Day
  isToday: boolean
  tasks: Task[]
  log: DailyLog
}

/** Everything shown for one day. Opening today also rolls unfinished tasks over. */
export async function getDay(ctx: Ctx, day: Day = todayVN()): Promise<DayView> {
  const today = todayVN()
  let log = await getOrCreateLog(ctx, assertDay(day))
  if (day === today) log = await rolloverToToday(ctx, log, today)

  const tasks = await ctx.payload.find({
    collection: 'tasks',
    where: { plannedFor: { equals: day } },
    pagination: false,
    depth: 0,
    ...as(ctx),
  })
  return { date: day, today, isToday: day === today, tasks: sortTasks(tasks.docs), log }
}

/** Append a timestamped entry to today's log */
export async function addEntry(ctx: Ctx, text: string): Promise<DailyLog> {
  const clean = text.trim()
  if (!clean) throw new Error('Empty entry')
  const log = await getOrCreateLog(ctx, todayVN())
  return ctx.payload.update({
    collection: 'daily-logs',
    id: log.id,
    data: { entries: [...(log.entries ?? []), { time: timeInVN(), text: clean }] },
    ...as(ctx),
  })
}

export type Review = NonNullable<DailyLog['review']>

/** Save (part of) a day's review */
export async function saveReview(ctx: Ctx, day: Day, review: Partial<Review>): Promise<DailyLog> {
  const log = await getOrCreateLog(ctx, assertDay(day))
  return ctx.payload.update({
    collection: 'daily-logs',
    id: log.id,
    data: { review: { ...(log.review ?? {}), ...review } },
    ...as(ctx),
  })
}
