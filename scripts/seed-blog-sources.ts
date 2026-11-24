/**
 * Adds the "Sources" list to the seeded blog posts (overwrites the list of the posts below only).
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
  'chi-em-thuy-kieu': [
    { label: 'Truyện Kiều – Wikipedia tiếng Việt', url: WP('Truy%E1%BB%87n_Ki%E1%BB%81u') },
    {
      label: 'The Tale of Kieu – Wikipedia (English)',
      url: 'https://en.wikipedia.org/wiki/The_Tale_of_Kieu',
    },
    { label: 'Nguyễn Du – Wikipedia tiếng Việt', url: WP('Nguy%E1%BB%85n_Du') },
    {
      label: 'Sách giáo khoa Ngữ văn 9, tập 1 (chương trình cũ)',
      note: 'Đoạn trích câu 15–38 của Truyện Kiều. ' + TEXT_NOTE,
    },
    {
      label: `Phân tích (tiếng Việt, tiếng Anh) và bản dịch tiếng Anh: ${SELF}`,
      note: 'Tự viết, không trích từ tài liệu đã xuất bản.',
    },
  ],
  'co-cong-mai-sat-co-ngay-nen-kim': [
    { label: 'Tục ngữ – Wikipedia tiếng Việt', url: WP('T%E1%BB%A5c_ng%E1%BB%AF') },
    { label: `Phần giải nghĩa: ${SELF}` },
  ],
  'uong-nuoc-nho-nguon': [
    { label: 'Tục ngữ – Wikipedia tiếng Việt', url: WP('T%E1%BB%A5c_ng%E1%BB%AF') },
    { label: `Phần giải nghĩa: ${SELF}` },
  ],
  'cong-cha-nhu-nui-thai-son': [
    { label: 'Ca dao – Wikipedia tiếng Việt', url: WP('Ca_dao') },
    { label: `Phần giải nghĩa: ${SELF}`, note: 'Ca dao có nhiều dị bản.' },
  ],
  'bau-oi-thuong-lay-bi-cung': [
    { label: 'Ca dao – Wikipedia tiếng Việt', url: WP('Ca_dao') },
    { label: `Phần giải nghĩa: ${SELF}` },
  ],
  'khong-co-viec-gi-kho': [
    {
      label: 'Hồ Chí Minh, thơ tặng thanh niên xung phong (1951)',
      note: 'Văn bản chép theo bản phổ biến.',
    },
  ],
  'simplicity-is-prerequisite-for-reliability': [
    {
      label: 'Edsger W. Dijkstra – Wikiquote',
      url: 'https://en.wikiquote.org/wiki/Edsger_W._Dijkstra',
      note: 'Wikiquote xếp câu này vào mục "How do we tell truths that might hurt?" (EWD498, 1975).',
    },
    {
      label: 'EWD498 – E.W. Dijkstra Archive',
      url: 'https://www.cs.utexas.edu/~EWD/transcriptions/EWD04xx/EWD498.html',
      note: 'Chưa tìm thấy nguyên văn câu này trong bản chép EWD498 của trang lưu trữ – nguồn gốc chính xác chưa xác minh được.',
    },
    { label: `Phần giải nghĩa: ${SELF}` },
  ],
  'make-it-work-make-it-right-make-it-fast': [
    {
      label: 'MakeItWorkMakeItRightMakeItFast – c2 wiki',
      url: 'https://wiki.c2.com/?MakeItWorkMakeItRightMakeItFast',
      note: 'Cách diễn đạt này được gán cho Kent Beck; ý tưởng đã có trước đó (B. Lampson 1983; S. C. Johnson & B. Kernighan, Byte 1983).',
    },
    { label: `Phần giải nghĩa: ${SELF}` },
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
