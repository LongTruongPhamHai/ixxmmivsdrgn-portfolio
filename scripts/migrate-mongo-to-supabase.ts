/**
 * Move content from MongoDB to Supabase (Postgres).
 *
 * Step 1 – export from Mongo (uses MONGO_URL):
 *   npm run db:export
 * Step 2 – import into Supabase (uses DATABASE_URL, must be postgresql://...):
 *   npm run db:import
 *
 * Media files are read from public/media, or downloaded from the old site if
 * MEDIA_SOURCE_URL is set (e.g. http://localhost:3000 while the old app is running).
 *
 * Users are NOT migrated (password hashes can't be copied through the API) —
 * create a new admin at /admin after importing.
 */
import 'dotenv/config'
import fs from 'fs'
import path from 'path'

const STEP = process.argv[2]
const OUT_DIR = path.resolve(process.cwd(), 'scripts/.mongo-export')
const OUT_FILE = path.join(OUT_DIR, 'data.json')
const MEDIA_DIR = path.resolve(process.cwd(), 'public/media')
const LOCALES = ['vi', 'en'] as const

// Order matters: referenced collections first
const COLLECTIONS = ['media', 'skills', 'experience', 'education', 'posts', 'projects'] as const
const GLOBALS = ['profile'] as const

type Doc = Record<string, any>
type Dump = { collections: Record<string, Doc[]>; globals: Record<string, Doc> }

async function loadPayload() {
  const { getPayload } = await import('payload')
  const { default: config } = await import('../src/payload.config')
  return getPayload({ config })
}

async function exportFromMongo() {
  if (!process.env.MONGO_URL) throw new Error('Set MONGO_URL in .env to your old MongoDB connection string')
  process.env.DATABASE_URL = process.env.MONGO_URL
  const payload = await loadPayload()

  const dump: Dump = { collections: {}, globals: {} }
  for (const slug of COLLECTIONS) {
    const res = await payload.find({ collection: slug, locale: 'all', depth: 0, limit: 0, pagination: false } as any)
    dump.collections[slug] = res.docs as Doc[]
    console.log(`exported ${slug}: ${res.docs.length}`)
  }
  for (const slug of GLOBALS) {
    dump.globals[slug] = (await payload.findGlobal({ slug, locale: 'all', depth: 0 } as any)) as Doc
    console.log(`exported global ${slug}`)
  }

  fs.mkdirSync(OUT_DIR, { recursive: true })
  fs.writeFileSync(OUT_FILE, JSON.stringify(dump, null, 2))
  console.log(`\nSaved to ${OUT_FILE}`)
  process.exit(0)
}

const isLocaleMap = (v: unknown): v is Record<string, unknown> =>
  !!v &&
  typeof v === 'object' &&
  !Array.isArray(v) &&
  Object.keys(v).length > 0 &&
  Object.keys(v).every((k) => (LOCALES as readonly string[]).includes(k))

/** Pick one locale out of `locale: 'all'` data and swap old Mongo IDs for new Postgres IDs. */
const OBJECT_ID = /^[a-f0-9]{24}$/

function transform(value: any, locale: string, idMap: Map<string, string | number>, key = ''): any {
  if (isLocaleMap(value)) {
    // Missing translation: fall back to the default locale (same as Payload's `fallback: true`)
    const v = value[locale] ?? value[LOCALES[0]]
    return transform(v, locale, idMap, key)
  }
  if (typeof value === 'string' && key !== 'id' && OBJECT_ID.test(value)) {
    // A reference to another doc: use its new ID, or drop it if that doc wasn't migrated
    return idMap.get(value) ?? null
  }
  if (Array.isArray(value))
    return value.map((v) => transform(v, locale, idMap)).filter((v) => v !== null)
  if (value && typeof value === 'object') {
    const out: Doc = {}
    for (const [k, v] of Object.entries(value)) out[k] = transform(v, locale, idMap, k)
    return out
  }
  return value
}

/** Find the media file locally, or download it from the old running site (MEDIA_SOURCE_URL). */
async function resolveMediaFile(doc: Doc): Promise<string | null> {
  const local = path.join(MEDIA_DIR, doc.filename)
  if (fs.existsSync(local)) return local
  const base = process.env.MEDIA_SOURCE_URL
  if (!base || !doc.url) return null
  const res = await fetch(new URL(doc.url, base))
  if (!res.ok) return null
  const tmp = path.join(OUT_DIR, 'media', doc.filename)
  fs.mkdirSync(path.dirname(tmp), { recursive: true })
  fs.writeFileSync(tmp, Buffer.from(await res.arrayBuffer()))
  return tmp
}

const SYSTEM_FIELDS = ['id', '_id', 'createdAt', 'updatedAt', 'globalType', '__v']
const MEDIA_FIELDS = ['url', 'thumbnailURL', 'filename', 'mimeType', 'filesize', 'width', 'height', 'focalX', 'focalY', 'sizes', 'prefix']

function strip(doc: Doc, extra: string[] = []) {
  const out = { ...doc }
  for (const k of [...SYSTEM_FIELDS, ...extra]) delete out[k]
  return out
}

async function importToPostgres() {
  if (!process.env.DATABASE_URL || process.env.DATABASE_URL.startsWith('mongodb'))
    throw new Error('DATABASE_URL must point to Supabase (postgresql://...) for the import step')
  if (!fs.existsSync(OUT_FILE)) throw new Error('Run `npm run db:export` first')

  const dump: Dump = JSON.parse(fs.readFileSync(OUT_FILE, 'utf8'))
  const payload = await loadPayload()
  const idMap = new Map<string, string | number>()
  const [first, ...rest] = LOCALES

  // Start clean so the import can be re-run safely
  for (const slug of [...COLLECTIONS].reverse()) {
    await payload.delete({ collection: slug, where: { id: { exists: true } } } as any)
  }

  for (const slug of COLLECTIONS) {
    for (const doc of dump.collections[slug] ?? []) {
      let created: Doc
      if (slug === 'media') {
        const filePath = await resolveMediaFile(doc)
        if (!filePath) {
          console.warn(`  skip media ${doc.filename}: not in public/media (set MEDIA_SOURCE_URL to download it)`)
          continue
        }
        created = await payload.create({
          collection: 'media',
          locale: first,
          data: transform(strip(doc, MEDIA_FIELDS), first, idMap),
          filePath,
        } as any)
      } else {
        created = await payload.create({
          collection: slug,
          locale: first,
          data: transform(strip(doc), first, idMap),
        } as any)
      }
      idMap.set(String(doc.id), created.id)

      for (const locale of rest) {
        const extra = slug === 'media' ? MEDIA_FIELDS : []
        await payload.update({
          collection: slug,
          id: created.id,
          locale,
          data: transform(strip(doc, extra), locale, idMap),
        } as any)
      }
    }
    console.log(`imported ${slug}: ${dump.collections[slug]?.length ?? 0}`)
  }

  for (const slug of GLOBALS) {
    const doc = dump.globals[slug]
    if (!doc) continue
    for (const locale of LOCALES) {
      await payload.updateGlobal({ slug, locale, data: transform(strip(doc), locale, idMap) } as any)
    }
    console.log(`imported global ${slug}`)
  }

  console.log('\nDone. Open /admin to create a new admin user.')
  process.exit(0)
}

const run = STEP === 'export' ? exportFromMongo : STEP === 'import' ? importToPostgres : null
if (!run) {
  console.error('Usage: tsx scripts/migrate-mongo-to-supabase.ts <export|import>')
  process.exit(1)
}
run().catch((err) => {
  if (err?.data?.errors) console.error(JSON.stringify(err.data.errors, null, 2))
  console.error(err)
  process.exit(1)
})
