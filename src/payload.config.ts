import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { s3Storage } from '@payloadcms/storage-s3'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'
import { en } from '@payloadcms/translations/languages/en'
import { vi } from '@payloadcms/translations/languages/vi'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Projects } from './collections/Projects'
import { Skills } from './collections/Skills'
import { Experience } from './collections/Experience'
import { Posts } from './collections/Posts'
import { Categories } from './collections/Categories'
import { Tags } from './collections/Tags'
import { Tasks } from './collections/Tasks'
import { DailyLogs } from './collections/DailyLogs'
import { Education } from './collections/Education'
import { Profile } from './globals/Profile'
import { migrations } from './migrations'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

/**
 * On Vercel (serverless) use Supabase's *transaction* pooler (port 6543) instead of the session
 * pooler (5432): every function instance opens its own pool, and the session pooler is capped at
 * 15 clients on the free plan (EMAXCONNSESSION). The transaction pooler shares real connections.
 */
const toServerlessUrl = (url: string) =>
  process.env.VERCEL && /\.pooler\.supabase\.com:5432\//.test(url)
    ? url.replace(/\.pooler\.supabase\.com:5432\//, '.pooler.supabase.com:6543/')
    : url

const databaseUrl = toServerlessUrl(process.env.DATABASE_URL || '')

// mongodb:// or mongodb+srv:// -> MongoDB, anything else (postgresql://, Supabase) -> Postgres
const db = databaseUrl.startsWith('mongodb')
  ? mongooseAdapter({ url: databaseUrl })
  : postgresAdapter({
      pool: {
        connectionString: databaseUrl,
        // Supabase's session pooler allows only 15 clients in total (free plan). Every serverless
        // instance (Vercel) and every dev hot-reload opens its own pool, so keep each pool small
        // and release idle connections quickly.
        // Must be >= 2: on startup Payload runs migrations inside a transaction (holding one
        // client) and needs a second client meanwhile – with max: 1 it waits forever (timeout).
        max: 3,
        idleTimeoutMillis: 10_000,
        // fail with a clear error instead of hanging forever when the pooler is full
        connectionTimeoutMillis: 15_000,
        // Supabase requires SSL; disable for local Postgres with DATABASE_SSL=false
        ssl: process.env.DATABASE_SSL === 'false' ? false : { rejectUnauthorized: false },
      },
      migrationDir: path.resolve(dirname, 'migrations'),
      // Schema changes go through migrations only (dev push would block prod migrations)
      push: false,
      // Run pending migrations automatically when the production server starts
      prodMigrations: migrations,
    })

// Supabase Storage (S3-compatible). Enabled only when S3_BUCKET is set;
// otherwise media is stored on local disk in public/media.
const storagePlugins = process.env.S3_BUCKET
  ? [
      s3Storage({
        collections: { media: true },
        bucket: process.env.S3_BUCKET,
        config: {
          endpoint: process.env.S3_ENDPOINT,
          region: process.env.S3_REGION || 'auto',
          forcePathStyle: true,
          credentials: {
            accessKeyId: process.env.S3_ACCESS_KEY_ID || '',
            secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || '',
          },
        },
      }),
    ]
  : []

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  // Admin UI languages: each user picks one under Account; Vietnamese by default
  i18n: {
    supportedLanguages: { vi, en },
    fallbackLanguage: 'vi',
  },
  globals: [Profile],
  collections: [
    Users,
    Media,
    Projects,
    Skills,
    Experience,
    Education,
    Posts,
    Categories,
    Tags,
    Tasks,
    DailyLogs,
  ],
  localization: {
    locales: ['vi', 'en'],
    defaultLocale: 'vi',
    fallback: true,
  },
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db,
  sharp,
  plugins: [...storagePlugins],
})
