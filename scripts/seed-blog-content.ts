/**
 * Seeds real starter content for the blog (poems, folk sayings, quotes, tips, an article).
 * Meanings/explanations are NOT written here – they come only from sources, see seed-blog-references.ts.
 * Idempotent: posts whose slug already exists are skipped. Tags are created when missing.
 * Run: npx tsx scripts/seed-blog-content.ts
 */
import 'dotenv/config'

/* ---------- tiny Lexical builders ---------- */
type Inline = string | { code: string } | { bold: string }
const text = (t: Inline) =>
  typeof t === 'string'
    ? { type: 'text', version: 1, text: t, format: 0, mode: 'normal', style: '', detail: 0 }
    : 'code' in t
      ? { type: 'text', version: 1, text: t.code, format: 16, mode: 'normal', style: '', detail: 0 }
      : { type: 'text', version: 1, text: t.bold, format: 1, mode: 'normal', style: '', detail: 0 }
const block = { version: 1, direction: 'ltr', format: '', indent: 0 }
/** paragraph; `lines` = soft line breaks inside it (Shift+Enter) */
const p = (...lines: Inline[][]) => ({
  ...block,
  type: 'paragraph',
  textFormat: 0,
  textStyle: '',
  children: lines.flatMap((parts, i) => [
    ...(i ? [{ type: 'linebreak', version: 1 }] : []),
    ...parts.map(text),
  ]),
})
const line = (s: string) => [s]
const h2 = (s: string) => ({ ...block, type: 'heading', tag: 'h2', children: [text(s)] })
const ul = (...items: Inline[][]) => ({
  ...block,
  type: 'list',
  listType: 'bullet',
  tag: 'ul',
  start: 1,
  children: items.map((parts, i) => ({
    ...block,
    type: 'listitem',
    value: i + 1,
    children: parts.map(text),
  })),
})
const doc = (...children: object[]) => ({ root: { ...block, type: 'root', children } })
/** a poem: stanzas separated by blank lines, lines by \n */
const verse = (poem: string) =>
  doc(
    ...poem
      .trim()
      .split(/\n\s*\n/)
      .map((stanza) =>
        p(
          ...stanza
            .trim()
            .split('\n')
            .map((l) => line(l.trim())),
        ),
      ),
  )

/* ---------- content ---------- */
type Seed = {
  slug: string
  category: string
  title?: string
  author?: string
  meaning?: string
  excerpt?: string
  tags: string[]
  featured?: boolean
  daysAgo: number
  content: object
}

const POSTS: Seed[] = [
  // ---- Thơ ----
  {
    slug: 'banh-troi-nuoc',
    category: 'tho',
    title: 'Bánh trôi nước',
    author: 'Hồ Xuân Hương',
    tags: ['Thơ Nôm', 'Phụ nữ'],
    featured: true,
    daysAgo: 1,
    content: verse(`
      Thân em vừa trắng lại vừa tròn,
      Bảy nổi ba chìm với nước non.
      Rắn nát mặc dầu tay kẻ nặn,
      Mà em vẫn giữ tấm lòng son.`),
  },
  {
    slug: 'qua-deo-ngang',
    category: 'tho',
    title: 'Qua Đèo Ngang',
    author: 'Bà Huyện Thanh Quan',
    tags: ['Thơ Đường luật', 'Quê hương'],
    daysAgo: 6,
    content: verse(`
      Bước tới Đèo Ngang, bóng xế tà,
      Cỏ cây chen đá, lá chen hoa.
      Lom khom dưới núi, tiều vài chú,
      Lác đác bên sông, chợ mấy nhà.

      Nhớ nước đau lòng, con quốc quốc,
      Thương nhà mỏi miệng, cái gia gia.
      Dừng chân đứng lại, trời, non, nước,
      Một mảnh tình riêng, ta với ta.`),
  },
  {
    slug: 'thu-dieu',
    category: 'tho',
    title: 'Thu điếu',
    author: 'Nguyễn Khuyến',
    tags: ['Thơ Đường luật', 'Mùa thu'],
    daysAgo: 12,
    content: verse(`
      Ao thu lạnh lẽo nước trong veo,
      Một chiếc thuyền câu bé tẻo teo.
      Sóng biếc theo làn hơi gợn tí,
      Lá vàng trước gió sẽ đưa vèo.

      Tầng mây lơ lửng trời xanh ngắt,
      Ngõ trúc quanh co khách vắng teo.
      Tựa gối, ôm cần lâu chẳng được,
      Cá đâu đớp động dưới chân bèo.`),
  },

  {
    slug: 'chi-em-thuy-kieu',
    category: 'tho',
    title: 'Chị em Thúy Kiều',
    author: 'Nguyễn Du (trích Truyện Kiều)',
    tags: ['Truyện Kiều', 'Thơ lục bát'],
    daysAgo: 0,
    content: verse(`
      Đầu lòng hai ả tố nga,
      Thúy Kiều là chị, em là Thúy Vân.
      Mai cốt cách, tuyết tinh thần,
      Mỗi người một vẻ, mười phân vẹn mười.

      Vân xem trang trọng khác vời,
      Khuôn trăng đầy đặn, nét ngài nở nang.
      Hoa cười ngọc thốt đoan trang,
      Mây thua nước tóc, tuyết nhường màu da.

      Kiều càng sắc sảo, mặn mà,
      So bề tài, sắc, lại là phần hơn.
      Làn thu thủy, nét xuân sơn,
      Hoa ghen thua thắm, liễu hờn kém xanh.
      Một hai nghiêng nước nghiêng thành,
      Sắc đành đòi một, tài đành họa hai.
      Thông minh vốn sẵn tính trời,
      Pha nghề thi họa, đủ mùi ca ngâm.
      Cung thương làu bậc ngũ âm,
      Nghề riêng ăn đứt Hồ cầm một trương.
      Khúc nhà tay lựa nên chương,
      Một thiên bạc mệnh, lại càng não nhân.

      Phong lưu rất mực hồng quần,
      Xuân xanh xấp xỉ tới tuần cập kê.
      Êm đềm trướng rủ màn che,
      Tường đông ong bướm đi về mặc ai.`),
  },

  // ---- Ca dao – tục ngữ ----
  {
    slug: 'co-cong-mai-sat-co-ngay-nen-kim',
    category: 'ca-dao-tuc-ngu',
    author: 'Tục ngữ',
    tags: ['Kiên trì'],
    daysAgo: 2,
    content: doc(p(line('Có công mài sắt, có ngày nên kim.'))),
  },
  {
    slug: 'cong-cha-nhu-nui-thai-son',
    category: 'ca-dao-tuc-ngu',
    author: 'Ca dao',
    tags: ['Gia đình'],
    daysAgo: 8,
    content: doc(
      p(
        line('Công cha như núi Thái Sơn'),
        line('Nghĩa mẹ như nước trong nguồn chảy ra'),
        line('Một lòng thờ mẹ kính cha'),
        line('Cho tròn chữ hiếu mới là đạo con.'),
      ),
    ),
  },
  {
    slug: 'uong-nuoc-nho-nguon',
    category: 'ca-dao-tuc-ngu',
    author: 'Tục ngữ',
    tags: ['Biết ơn'],
    daysAgo: 15,
    content: doc(p(line('Uống nước nhớ nguồn.'))),
  },
  {
    slug: 'bau-oi-thuong-lay-bi-cung',
    category: 'ca-dao-tuc-ngu',
    author: 'Ca dao',
    tags: ['Đoàn kết'],
    daysAgo: 20,
    content: doc(
      p(line('Bầu ơi thương lấy bí cùng'), line('Tuy rằng khác giống nhưng chung một giàn.')),
    ),
  },

  // ---- Châm ngôn ----
  {
    slug: 'khong-co-viec-gi-kho',
    category: 'cham-ngon',
    author: 'Hồ Chí Minh',
    tags: ['Kiên trì', 'Động lực'],
    featured: true,
    daysAgo: 3,
    content: doc(
      p(
        line('Không có việc gì khó'),
        line('Chỉ sợ lòng không bền'),
        line('Đào núi và lấp biển'),
        line('Quyết chí ắt làm nên.'),
      ),
    ),
  },
  {
    slug: 'simplicity-is-prerequisite-for-reliability',
    category: 'cham-ngon',
    author: 'Edsger W. Dijkstra',
    tags: ['Lập trình'],
    daysAgo: 9,
    content: doc(p(line('Simplicity is prerequisite for reliability.'))),
  },
  {
    slug: 'make-it-work-make-it-right-make-it-fast',
    category: 'cham-ngon',
    author: 'Kent Beck',
    tags: ['Lập trình'],
    daysAgo: 16,
    content: doc(p(line('Make it work, make it right, make it fast.'))),
  },
  {
    slug: 'hoc-hoc-nua-hoc-mai',
    category: 'cham-ngon',
    author: 'V. I. Lênin',
    tags: ['Học tập'],
    daysAgo: 22,
    content: doc(p(line('Học, học nữa, học mãi.'))),
  },

  // ---- Tips ----
  {
    slug: 'tinh-ngay-theo-gio-viet-nam-tren-server-utc',
    category: 'tips',
    title: 'Tính "hôm nay" theo giờ Việt Nam khi server chạy UTC',
    excerpt:
      'Vercel chạy giờ UTC, nên từ 0h đến 7h sáng giờ Việt Nam, new Date() vẫn còn là "hôm qua". Một dòng Intl.DateTimeFormat là đủ để sửa.',
    tags: ['Lập trình', 'JavaScript', 'Múi giờ'],
    daysAgo: 4,
    content: doc(
      p([
        'Server trên Vercel chạy giờ UTC. Nếu lấy ngày bằng ',
        { code: 'new Date().toISOString().slice(0, 10)' },
        ' thì từ 0h đến 7h sáng giờ Việt Nam, kết quả vẫn là ngày hôm qua. Các ngày tháng chọn từ ô "chỉ tháng" cũng có thể bị lệch sang tháng trước khi hiển thị.',
      ]),
      p(['Cách sửa: luôn định dạng theo múi giờ cố định thay vì múi giờ của server:']),
      p([
        {
          code: "new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Ho_Chi_Minh' }).format(new Date())",
        },
      ]),
      p([
        'Locale ',
        { code: 'en-CA' },
        ' trả về đúng dạng ',
        { code: 'YYYY-MM-DD' },
        ', tiện để lưu và so sánh. Khi hiển thị năm hoặc tháng của một mốc thời gian, cũng truyền ',
        { code: "timeZone: 'Asia/Ho_Chi_Minh'" },
        ' để không bị lệch.',
      ]),
    ),
  },
  {
    slug: 'supabase-vercel-dung-transaction-pooler',
    category: 'tips',
    title: 'Supabase + Vercel: dùng Transaction pooler cho serverless',
    excerpt:
      'Session pooler (cổng 5432) của gói miễn phí chỉ cho 15 kết nối; mỗi instance serverless mở một nhóm riêng nên rất nhanh báo EMAXCONNSESSION.',
    tags: ['Lập trình', 'Supabase', 'Vercel'],
    daysAgo: 7,
    content: doc(
      p([
        'Lỗi gặp phải: ',
        { code: '(EMAXCONNSESSION) max clients reached in session mode' },
        '. Session pooler của Supabase (cổng 5432) giới hạn 15 kết nối, mà trên Vercel mỗi instance serverless lại mở một nhóm kết nối riêng.',
      ]),
      ul(
        [
          { bold: 'Dùng Transaction pooler' },
          ' (cổng ',
          { code: '6543' },
          ') khi chạy trên Vercel: nhiều client dùng chung một số kết nối thật.',
        ],
        ['Giữ nhóm kết nối nhỏ (', { code: 'max: 3' }, ') và đóng kết nối rảnh sau vài giây.'],
        [
          'Đừng đặt ',
          { code: 'max: 1' },
          ' nếu thư viện chạy migration trong transaction lúc khởi động – nó giữ kết nối duy nhất và chờ mãi kết nối thứ hai.',
        ],
        [
          'Không dùng Direct connection trên Vercel: địa chỉ đó chỉ có IPv6, Vercel không kết nối được.',
        ],
      ),
    ),
  },
  {
    slug: 'window-confirm-co-the-bi-chan',
    category: 'tips',
    title: 'window.confirm() có thể bị chặn âm thầm',
    excerpt:
      'Một số trình duyệt nhúng tự huỷ hộp thoại confirm() mà không hiện gì – nút "Xoá" trông như không hoạt động.',
    tags: ['Lập trình', 'Frontend'],
    daysAgo: 11,
    content: doc(
      p([
        'Nút xoá dùng ',
        { code: "if (window.confirm('Xoá?')) remove()" },
        ' chạy tốt trên Chrome, nhưng trong một số trình duyệt nhúng (webview, khung trình duyệt trong app) hộp thoại bị tự huỷ: ',
        { code: 'confirm()' },
        ' trả về false ngay, không có lỗi, không có gì hiện lên.',
      ]),
      p([
        'Cách an toàn hơn: xác nhận ngay trong giao diện – bấm "Xoá" lần đầu thì nút đổi thành "Bấm lần nữa để xoá", bấm lần hai mới xoá thật. Chạy được ở mọi nơi và không chặn luồng.',
      ]),
    ),
  },
  {
    slug: 'slug-tieng-viet-bo-dau',
    category: 'tips',
    title: 'Tạo slug tiếng Việt: bỏ dấu đúng cách',
    excerpt: 'Hàm slug mặc định thường xoá luôn chữ có dấu: "Bánh trôi nước" thành "bnh-tri-nc".',
    tags: ['Lập trình', 'JavaScript'],
    daysAgo: 18,
    content: doc(
      p([
        'Tách chữ và dấu bằng ',
        { code: "normalize('NFD')" },
        ', xoá các dấu kết hợp, rồi xử lý riêng chữ đ (không tách được theo cách trên):',
      ]),
      p([
        {
          code: "s.normalize('NFD').replace(/[\\u0300-\\u036f]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D')",
        },
      ]),
      p([
        'Sau đó đổi chữ thường và thay mọi ký tự không phải chữ/số bằng dấu gạch: "Bánh trôi nước" → ',
        { code: 'banh-troi-nuoc' },
        '.',
      ]),
    ),
  },

  // ---- Bài viết ----
  {
    slug: 'chuyen-portfolio-tu-mongodb-sang-supabase',
    category: 'bai-viet',
    title: 'Chuyển portfolio từ MongoDB sang Supabase: những gì mình học được',
    excerpt:
      'Đổi database cho một trang Payload CMS đang chạy trên Vercel: chuyển dữ liệu, migration, pooler và vài lần trang sập để học bài.',
    tags: ['Lập trình', 'Supabase', 'Payload CMS', 'Vercel'],
    featured: true,
    daysAgo: 5,
    content: doc(
      p([
        'Trang portfolio này ban đầu dùng Payload CMS với MongoDB. Khi muốn thêm blog, thống kê và nhiều loại nội dung có quan hệ với nhau, mình chuyển sang PostgreSQL trên Supabase. Đây là những gì đáng nhớ.',
      ]),
      h2('1. Payload đổi database khá dễ'),
      p([
        'Payload có adapter cho cả MongoDB và Postgres. Chọn adapter theo tiền tố của ',
        { code: 'DATABASE_URL' },
        ' (mongodb:// hay postgresql://) giúp chuyển dần mà không phải sửa code ở nhiều nơi.',
      ]),
      h2('2. Chuyển dữ liệu theo hai bước'),
      ul(
        ['Export từ MongoDB với mọi ngôn ngữ (', { code: "locale: 'all'" }, ') ra một file JSON.'],
        ['Import vào Postgres qua Local API, đổi ID cũ sang ID mới cho các quan hệ.'],
        ['Ảnh upload phải chuyển riêng – database chỉ lưu thông tin, không lưu file.'],
      ),
      h2('3. Migration là chỗ dễ sập nhất'),
      p([
        'Một migration tự sinh xoá bảng bằng ',
        { code: 'DROP TABLE … CASCADE' },
        ' rồi lại xoá ràng buộc đã mất theo – lỗi này làm mọi trang trả 500 ngay sau khi deploy. Bài học: luôn đọc SQL của migration trước khi đưa lên, và dùng ',
        { code: 'IF EXISTS' },
        ' cho các lệnh xoá.',
      ]),
      h2('4. Serverless cần Transaction pooler'),
      p([
        'Trên Vercel, Session pooler nhanh chóng hết 15 kết nối. Chuyển sang Transaction pooler (cổng 6543) và giữ nhóm kết nối nhỏ là hết lỗi.',
      ]),
      h2('Kết'),
      p([
        'Build thành công chưa chắc trang đã chạy: sau mỗi lần deploy, mở thử vài trang và đọc log là thói quen đáng giữ.',
      ]),
    ),
  },
]

async function main() {
  const { getPayload } = await import('payload')
  const { default: config } = await import('../src/payload.config')
  const payload = await getPayload({ config })

  const categories = await payload.find({ collection: 'categories', pagination: false, depth: 0 })
  const catId = new Map(categories.docs.map((c) => [c.slug, c.id]))

  const tagId = new Map<string, number>()
  const ensureTag = async (name: string) => {
    if (tagId.has(name)) return tagId.get(name)!
    const found = await payload.find({
      collection: 'tags',
      where: { name: { equals: name } },
      limit: 1,
    })
    const id =
      found.docs[0]?.id ?? (await payload.create({ collection: 'tags', data: { name } })).id
    tagId.set(name, id)
    return id
  }

  let created = 0
  for (const s of POSTS) {
    const exists = await payload.find({
      collection: 'posts',
      where: { slug: { equals: s.slug } },
      limit: 1,
    })
    if (exists.docs.length) {
      console.log(`skip   ${s.slug}`)
      continue
    }
    const category = catId.get(s.category)
    if (!category)
      throw new Error(`Missing category "${s.category}" – run scripts/seed-blog-categories.ts`)
    const published = new Date(Date.now() - s.daysAgo * 86_400_000).toISOString()
    await payload.create({
      collection: 'posts',
      data: {
        title: s.title,
        slug: s.slug,
        author: s.author,
        meaning: s.meaning ? (doc(p(line(s.meaning))) as never) : undefined,
        excerpt: s.excerpt,
        category,
        tags: await Promise.all(s.tags.map(ensureTag)),
        featured: s.featured ?? false,
        visibility: 'public',
        publishedAt: published,
        content: s.content as never,
        _status: 'published',
      },
    })
    created++
    console.log(`create ${s.slug}`)
  }
  console.log(`\n${created} created, ${POSTS.length - created} skipped`)
  process.exit(0)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
