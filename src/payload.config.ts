import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { s3Storage } from '@payloadcms/storage-s3'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Projects } from './collections/Projects'
import { Skills } from './collections/Skills'
import { Experience } from './collections/Experience'
import { Posts } from './collections/Posts'
import { Education } from './collections/Education'
import { Profile } from './globals/Profile'
import { migrations } from './migrations'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const databaseUrl = process.env.DATABASE_URL || ''

// mongodb:// or mongodb+srv:// -> MongoDB, anything else (postgresql://, Supabase) -> Postgres
const db = databaseUrl.startsWith('mongodb')
  ? mongooseAdapter({ url: databaseUrl })
  : postgresAdapter({
      pool: {
        connectionString: databaseUrl,
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
  globals: [Profile],
  collections: [Users, Media, Projects, Skills, Experience, Posts, Education],
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
