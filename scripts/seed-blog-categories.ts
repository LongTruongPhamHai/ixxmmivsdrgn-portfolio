/**
 * Creates the starter blog categories (skips ones that already exist).
 * Run: npx tsx scripts/seed-blog-categories.ts
 */
import 'dotenv/config'

const CATEGORIES = [
  { slug: 'bai-viet', vi: 'Bài viết', en: 'Articles', displayType: 'article', color: 'neutral' },
  { slug: 'tips', vi: 'Tips', en: 'Tips', displayType: 'article', color: 'lime' },
  { slug: 'tho', vi: 'Thơ', en: 'Poems', displayType: 'verse', color: 'amber' },
  { slug: 'ca-dao-tuc-ngu', vi: 'Ca dao – tục ngữ', en: 'Folk sayings', displayType: 'quote', color: 'amber' },
  { slug: 'cham-ngon', vi: 'Châm ngôn', en: 'Quotes', displayType: 'quote', color: 'lime' },
] as const

async function main() {
  const { getPayload } = await import('payload')
  const { default: config } = await import('../src/payload.config')
  const payload = await getPayload({ config })

  for (const c of CATEGORIES) {
    const existing = await payload.find({ collection: 'categories', where: { slug: { equals: c.slug } }, limit: 1 })
    if (existing.docs.length) {
      console.log(`skip ${c.slug} (exists)`)
      continue
    }
    const doc = await payload.create({
      collection: 'categories',
      locale: 'vi',
      data: { name: c.vi, slug: c.slug, displayType: c.displayType, color: c.color },
    })
    await payload.update({ collection: 'categories', id: doc.id, locale: 'en', data: { name: c.en } })
    console.log(`created ${c.slug}`)
  }
  process.exit(0)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
