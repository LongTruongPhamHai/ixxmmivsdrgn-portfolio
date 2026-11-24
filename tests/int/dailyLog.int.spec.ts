import { describe, expect, it } from 'vitest'
import { planRollover, sortTasks } from '@/lib/dailyLog'
import { addDays, dayInVN, daysBetween } from '@/lib/date'

describe('dayInVN – calendar day in Vietnam time', () => {
  it('uses Vietnam time, not UTC (Vercel runs in UTC)', () => {
    // 2026-11-23 18:30 UTC = 2026-11-24 01:30 in Vietnam
    expect(dayInVN(new Date('2026-11-23T18:30:00Z'))).toBe('2026-11-24')
    // 2026-11-24 16:59 UTC = 23:59 in Vietnam, still the 24th
    expect(dayInVN(new Date('2026-11-24T16:59:00Z'))).toBe('2026-11-24')
    // 17:00 UTC = midnight in Vietnam → next day
    expect(dayInVN(new Date('2026-11-24T17:00:00Z'))).toBe('2026-11-25')
    // 00:00 UTC (07:00 VN) is the same Vietnamese day
    expect(dayInVN(new Date('2026-11-24T00:00:00Z'))).toBe('2026-11-24')
  })

  it('adds and counts days across month/year boundaries', () => {
    expect(addDays('2026-11-30', 1)).toBe('2026-12-01')
    expect(addDays('2026-12-31', 1)).toBe('2027-01-01')
    expect(addDays('2028-02-28', 1)).toBe('2028-02-29') // leap year
    expect(daysBetween('2026-11-21', '2026-11-24')).toBe(3)
  })
})

describe('planRollover', () => {
  const today = '2026-11-24'
  const task = (
    id: number,
    status: 'todo' | 'doing' | 'done' | 'dropped',
    plannedFor: string,
    carryCount = 0,
  ) => ({
    id,
    status,
    plannedFor,
    carryCount,
  })

  it("moves yesterday's unfinished tasks to today and counts the carry", () => {
    expect(planRollover([task(1, 'todo', '2026-11-23')], today)).toEqual([
      { id: 1, plannedFor: today, carryCount: 1 },
    ])
  })

  it('moves tasks left for several days in one go (after not opening the app)', () => {
    expect(planRollover([task(1, 'doing', '2026-11-20', 2)], today)).toEqual([
      { id: 1, plannedFor: today, carryCount: 3 },
    ])
  })

  it('leaves done, dropped, today and future tasks alone', () => {
    expect(
      planRollover(
        [
          task(1, 'done', '2026-11-23'),
          task(2, 'dropped', '2026-11-23'),
          task(3, 'todo', today),
          task(4, 'todo', '2026-11-25'),
        ],
        today,
      ),
    ).toEqual([])
  })

  it('is idempotent: running again after moving changes nothing', () => {
    const moved = planRollover([task(1, 'todo', '2026-11-23')], today).map((c) =>
      task(c.id as number, 'todo', c.plannedFor, c.carryCount),
    )
    expect(planRollover(moved, today)).toEqual([])
  })
})

describe('sortTasks', () => {
  it('lists open tasks by order, then finished ones by completion time', () => {
    const sorted = sortTasks([
      { id: 1, status: 'done', order: 0, completedAt: '2026-11-24T10:00:00Z' },
      { id: 2, status: 'todo', order: 2, completedAt: null },
      { id: 3, status: 'doing', order: 1, completedAt: null },
      { id: 4, status: 'done', order: 0, completedAt: '2026-11-24T08:00:00Z' },
    ])
    expect(sorted.map((t) => t.id)).toEqual([3, 2, 4, 1])
  })
})
