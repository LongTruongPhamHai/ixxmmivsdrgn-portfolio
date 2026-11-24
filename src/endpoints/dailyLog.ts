import { APIError, type Endpoint, type PayloadRequest } from 'payload'
import { addEntry, assertDay, getDay, saveReview, type Review } from '@/lib/dailyLog'
import { todayVN } from '@/lib/date'

/**
 * Private daily-log API (served under /api, e.g. GET /api/log/today).
 * Auth: admin session cookie (web), `Authorization: JWT <token>` or
 * `Authorization: users API-Key <key>` (Android app).
 * Tasks themselves use Payload's generated REST: /api/tasks.
 */

const ctxOf = (req: PayloadRequest) => {
  if (!req.user) throw new APIError('Unauthorized', 401)
  return { payload: req.payload, user: req.user }
}

const body = async (req: PayloadRequest): Promise<Record<string, unknown>> => {
  try {
    return (await req.json?.()) ?? {}
  } catch {
    throw new APIError('Invalid JSON body', 400)
  }
}

const REVIEW_KEYS = ['wins', 'blockers', 'lessons', 'tomorrow', 'energy'] as const

export const dailyLogEndpoints: Endpoint[] = [
  {
    // Today's tasks, log and review – rolls unfinished tasks over first (once per day)
    path: '/log/today',
    method: 'get',
    handler: async (req) => Response.json(await getDay(ctxOf(req))),
  },
  {
    // Any day (read-only view; no rollover except for today)
    path: '/log/day/:date',
    method: 'get',
    handler: async (req) => {
      const ctx = ctxOf(req)
      let day: string
      try {
        day = assertDay(String(req.routeParams?.date ?? ''))
      } catch {
        throw new APIError('Date must be YYYY-MM-DD', 400)
      }
      return Response.json(await getDay(ctx, day))
    },
  },
  {
    // Add a timestamped entry to today's log: { "text": "..." }
    path: '/log/entries',
    method: 'post',
    handler: async (req) => {
      const ctx = ctxOf(req)
      const { text } = await body(req)
      if (typeof text !== 'string' || !text.trim()) throw new APIError('"text" is required', 400)
      return Response.json(await addEntry(ctx, text), { status: 201 })
    },
  },
  {
    // Save (part of) a review: { "date"?: "YYYY-MM-DD", "wins"?, "blockers"?, "lessons"?, "tomorrow"?, "energy"? }
    path: '/log/review',
    method: 'patch',
    handler: async (req) => {
      const ctx = ctxOf(req)
      const data = await body(req)
      let day: string
      try {
        day = assertDay(typeof data.date === 'string' ? data.date : todayVN())
      } catch {
        throw new APIError('Date must be YYYY-MM-DD', 400)
      }
      const review: Partial<Review> = {}
      for (const key of REVIEW_KEYS)
        if (key in data) (review as Record<string, unknown>)[key] = data[key]
      if (review.energy != null && ![1, 2, 3, 4, 5].includes(Number(review.energy))) {
        throw new APIError('"energy" must be 1–5', 400)
      }
      return Response.json(await saveReview(ctx, day, review))
    },
  },
]
