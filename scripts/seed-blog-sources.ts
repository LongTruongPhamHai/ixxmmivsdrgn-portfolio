/**
 * Adds the "Sources" list to the seeded blog posts (overwrites the list of the posts below only).
 * Posts with source-based explanations are handled by seed-blog-references.ts instead.
 * Every URL was checked to resolve before being added.
 * Run: npx tsx scripts/seed-blog-sources.ts
 */
import 'dotenv/config'

type Source = { label: string; url?: string; note?: string }

const WP = (page: string) => `https://vi.wikipedia.org/wiki/${page}`
const SELF = 'IXXMMIVSDRGN'
const TEXT_NOTE =
  'Văn bản chép theo bản phổ biến; tác phẩm có dị bản – nên đối chiếu với sách giáo khoa.'

const SOURCES: Record<string, Source[]> = {
  'banh-troi-nuoc': [
    {
      label: 'Hồ Xuân Hương – Wikipedia tiếng Việt',
      url: WP('H%E1%BB%93_Xu%C3%A2n_H%C6%B0%C6%A1ng'),
    },
    { label: 'Sách giáo khoa Ngữ văn 7 (chương trình cũ)', note: TEXT_NOTE },
  ],
  'qua-deo-ngang': [
    {
      label: 'Bà Huyện Thanh Quan – Wikipedia tiếng Việt',
      url: WP('B%C3%A0_Huy%E1%BB%87n_Thanh_Quan'),
    },
    { label: 'Sách giáo khoa Ngữ văn 7 (chương trình cũ)', note: TEXT_NOTE },
  ],
  'thu-dieu': [
    { label: 'Nguyễn Khuyến – Wikipedia tiếng Việt', url: WP('Nguy%E1%BB%85n_Khuy%E1%BA%BFn') },
    { label: 'Sách giáo khoa Ngữ văn 11 (chương trình cũ)', note: TEXT_NOTE },
  ],
  'khong-co-viec-gi-kho': [
    {
      label: 'Hồ Chí Minh, thơ tặng thanh niên xung phong (1951)',
      note: 'Văn bản chép theo bản phổ biến.',
    },
  ],
  'hoc-hoc-nua-hoc-mai': [
    {
      label: 'Thường được trích dẫn là lời của V. I. Lênin',
      note: 'Tiếng Nga: «Учиться, учиться и учиться». Nguồn văn bản gốc chưa được đối chiếu.',
    },
  ],
  'tinh-ngay-theo-gio-viet-nam-tren-server-utc': [
    {
      label: 'Intl.DateTimeFormat – MDN Web Docs',
      url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat',
    },
    { label: `Kinh nghiệm thực tế khi làm trang này: ${SELF}` },
  ],
  'supabase-vercel-dung-transaction-pooler': [
    {
      label: 'Connect to your database – Supabase Docs',
      url: 'https://supabase.com/docs/guides/database/connecting-to-postgres',
    },
    { label: `Kinh nghiệm thực tế khi làm trang này: ${SELF}` },
  ],
  'window-confirm-co-the-bi-chan': [
    {
      label: 'Window: confirm() – MDN Web Docs',
      url: 'https://developer.mozilla.org/en-US/docs/Web/API/Window/confirm',
    },
    { label: `Kinh nghiệm thực tế khi làm trang này: ${SELF}` },
  ],
  'slug-tieng-viet-bo-dau': [
    {
      label: 'String.prototype.normalize() – MDN Web Docs',
      url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/normalize',
    },
    { label: `Kinh nghiệm thực tế khi làm trang này: ${SELF}` },
  ],
  'chuyen-portfolio-tu-mongodb-sang-supabase': [
    { label: 'Migrations – Payload Docs', url: 'https://payloadcms.com/docs/database/migrations' },
    { label: 'Postgres – Payload Docs', url: 'https://payloadcms.com/docs/database/postgres' },
    {
      label: 'Connect to your database – Supabase Docs',
      url: 'https://supabase.com/docs/guides/database/connecting-to-postgres',
    },
    { label: `Bài viết dựa trên quá trình chuyển đổi thực tế của trang này: ${SELF}` },
  ],
}

async function main() {
  const { getPayload } = await import('payload')
  const { default: config } = await import('../src/payload.config')
  const payload = await getPayload({ config })

  for (const [slug, sources] of Object.entries(SOURCES)) {
    const post = (
      await payload.find({ collection: 'posts', where: { slug: { equals: slug } }, limit: 1 })
    ).docs[0]
    if (!post) {
      console.log(`missing ${slug}`)
      continue
    }
    await payload.update({
      collection: 'posts',
      id: post.id,
      data: { sources, _status: 'published' },
    })
    console.log(`sources ${slug} (${sources.length})`)
  }
  process.exit(0)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
