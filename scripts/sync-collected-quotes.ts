/**
 * Syncs the collected sayings (scripts/calendar-quotes.ts) to the DB:
 * author + sources; a saying with no reputable source found is hidden.
 * Run: npx tsx scripts/sync-collected-quotes.ts
 */
import 'dotenv/config'
import { CALENDAR_QUOTES } from './calendar-quotes'

async function main() {
  const { getPayload } = await import('payload')
  const { default: config } = await import('../src/payload.config')
  const payload = await getPayload({ config })
  for (const q of CALENDAR_QUOTES) {
    const found = await payload.find({
      collection: 'posts',
      where: { slug: { equals: q.slug } },
      limit: 1,
    })
    const post = found.docs[0]
    if (!post) {
      console.log(`missing ${q.slug}`)
      continue
    }
    await payload.update({
      collection: 'posts',
      id: post.id,
      locale: 'vi',
      data: {
        author: q.author,
        sources: q.sources,
        visibility: q.sources.length ? 'public' : 'hidden',
      } as never,
    })
    console.log(`${q.sources.length ? 'public' : 'HIDDEN'} ${q.slug}`)
  }
  process.exit(0)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
