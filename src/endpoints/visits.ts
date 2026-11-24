import { sql } from '@payloadcms/db-postgres'
import type { Endpoint, PayloadRequest } from 'payload'
import { dayInVN } from '@/lib/date'

const BOT_RE =
  /bot|crawl|spider|slurp|preview|facebookexternalhit|headless|lighthouse|pingdom|uptime/i

/** Current visit count */
async function readVisits(req: PayloadRequest): Promise<number> {
  const stats = await req.payload.findGlobal({ slug: 'site-stats', depth: 0 })
  return stats.visits ?? 0
}

/**
 * +1 in a single SQL statement, so concurrent visits are never lost
 * (read-then-write through the Local API could overwrite each other).
 * Falls back to the Local API when the row doesn't exist yet / not on Postgres.
 */
async function incrementVisits(req: PayloadRequest): Promise<number> {
  const db = req.payload.db as unknown as {
    drizzle?: { execute: (q: unknown) => Promise<{ rows: { visits: number }[] }> }
  }
  if (db.drizzle) {
    // per-day counter (insert today's row on the first visit of the day)
    await db.drizzle.execute(
      sql`INSERT INTO "daily_visits" ("date", "visits", "updated_at", "created_at")
          VALUES (${dayInVN()}, 1, now(), now())
          ON CONFLICT ("date") DO UPDATE SET "visits" = COALESCE("daily_visits"."visits", 0) + 1, "updated_at" = now()`,
    )
    const res = await db.drizzle.execute(
      sql`UPDATE "site_stats" SET "visits" = COALESCE("visits", 0) + 1, "updated_at" = now() RETURNING "visits"`,
    )
    if (res.rows[0]) return Number(res.rows[0].visits)
  }
  const current = await readVisits(req)
  const updated = await req.payload.updateGlobal({
    slug: 'site-stats',
    data: { visits: current + 1 },
    overrideAccess: true,
  })
  return updated.visits ?? current + 1
}

export const visitEndpoints: Endpoint[] = [
  {
    // GET /api/visits → { visits }
    path: '/visits',
    method: 'get',
    handler: async (req) =>
      Response.json(
        { visits: await readVisits(req) },
        { headers: { 'Cache-Control': 'no-store' } },
      ),
  },
  {
    // POST /api/visits → count this visit (the client sends it once per browser session)
    path: '/visits',
    method: 'post',
    handler: async (req) => {
      const ua = req.headers.get('user-agent') ?? ''
      const visits = BOT_RE.test(ua) || !ua ? await readVisits(req) : await incrementVisits(req)
      return Response.json({ visits }, { headers: { 'Cache-Control': 'no-store' } })
    },
  },
]
