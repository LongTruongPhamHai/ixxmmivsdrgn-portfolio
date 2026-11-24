/**
 * Meanings and sources for the seeded blog posts – SOURCE-BASED ONLY.
 *
 * Rule (from the site owner): no original analysis or self-made translations.
 * Every explanation below summarizes, in our own words, what the listed sources say;
 * the [n] markers refer to the post's numbered "Sources" list. Where no source explains
 * a text, there is no explanation. All URLs were checked to resolve.
 *
 * Run: npx tsx scripts/seed-blog-references.ts
 */
import 'dotenv/config'

type Source = { label: string; url?: string; note?: string }
type Inline = string | { bold: string } | { italic: string }

/* ---------- tiny Lexical builders ---------- */
const text = (t: Inline) =>
  typeof t === 'string'
    ? { type: 'text', version: 1, text: t, format: 0, mode: 'normal', style: '', detail: 0 }
    : 'bold' in t
      ? { type: 'text', version: 1, text: t.bold, format: 1, mode: 'normal', style: '', detail: 0 }
      : {
          type: 'text',
          version: 1,
          text: t.italic,
          format: 2,
          mode: 'normal',
          style: '',
          detail: 0,
        }
const block = { version: 1, direction: 'ltr', format: '', indent: 0 }
const p = (...parts: Inline[]) => ({
  ...block,
  type: 'paragraph',
  textFormat: 0,
  textStyle: '',
  children: parts.map(text),
})
const h3 = (s: string) => ({ ...block, type: 'heading', tag: 'h3', children: [text(s)] })
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

const WP = (page: string) => `https://vi.wikipedia.org/wiki/${page}`
const WIKT = (page: string) => `https://vi.wiktionary.org/wiki/${page}`
const TEXT_NOTE =
  'Văn bản chép theo bản phổ biến; tác phẩm có dị bản – nên đối chiếu với sách giáo khoa.'

type Entry = {
  sources: Source[]
  /** null = remove any existing explanation (no source explains it) */
  meaningVi: object | null
  meaningEn?: object | null
  /** null = remove the self-made translation */
  translation?: string | null
}

const ENTRIES: Record<string, Entry> = {
  'chi-em-thuy-kieu': {
    sources: [
      { label: 'Truyện Kiều – Wikipedia tiếng Việt', url: WP('Truy%E1%BB%87n_Ki%E1%BB%81u') },
      {
        label: 'The Tale of Kieu – Wikipedia (English)',
        url: 'https://en.wikipedia.org/wiki/The_Tale_of_Kieu',
      },
      {
        label: 'Thúy Vân (Truyện Kiều) – Wikipedia tiếng Việt',
        url: WP('Th%C3%BAy_V%C3%A2n_(Truy%E1%BB%87n_Ki%E1%BB%81u)'),
      },
      { label: 'Nguyễn Du – Wikipedia tiếng Việt', url: WP('Nguy%E1%BB%85n_Du') },
      {
        label: 'Sách giáo khoa Ngữ văn 9, tập 1 (chương trình cũ)',
        note: 'Đoạn trích câu 15–38 của Truyện Kiều. ' + TEXT_NOTE,
      },
      {
        label:
          'Huỳnh Sanh Thông (dịch), The Tale of Kieu: A Bilingual Edition – Yale University Press, 1983',
        note: 'Bản dịch tiếng Anh đã xuất bản (song ngữ).',
      },
    ],
    meaningVi: doc(
      h3('Về tác phẩm'),
      ul(
        [
          { italic: 'Truyện Kiều' },
          ' (tên gốc ',
          { italic: 'Đoạn trường tân thanh' },
          ', nghĩa là "tiếng kêu mới về nỗi lòng đau đứt ruột") là truyện thơ của Nguyễn Du (1765–1820), gồm 3.254 câu thơ lục bát [1][2].',
        ],
        [
          'Cốt truyện dựa theo ',
          { italic: 'Kim Vân Kiều truyện' },
          ' của Thanh Tâm Tài Nhân (Trung Quốc); câu chuyện lấy bối cảnh đời Minh, thời Gia Tĩnh [1][2].',
        ],
        [
          'Nguyễn Du lấy thuyết "tài mệnh tương đố" – tài và mệnh ghét nhau – làm luận đề của truyện [1].',
        ],
        [
          'Dịch giả Huỳnh Sanh Thông gọi đây là kiệt tác hàng đầu của văn học Việt Nam ("the supreme masterwork of Vietnamese literature") [2][6].',
        ],
      ),
      h3('Về đoạn trích'),
      ul(
        [
          'Đoạn trích giới thiệu hai chị em trong gia đình viên ngoại họ Vương: Thúy Kiều là chị cả, Thúy Vân là em; ngoài ra còn em trai út Vương Quan [1].',
        ],
        [
          'Hai chị em "mỗi người một vẻ, mười phân vẹn mười", nhưng "so bề tài sắc" thì Kiều "lại là phần hơn" [1].',
        ],
        [
          'Thúy Vân được Nguyễn Du tả "khuôn trăng đầy đặn, nét ngài nở nang"; nàng được xem là người tài sắc chỉ sau chị và có cuộc đời ít sóng gió hơn, về sau kết hôn với Kim Trọng [3].',
        ],
        [
          'Thúy Kiều về sau phải bán mình để cứu cha và em, trải qua mười lăm năm lưu lạc trước khi đoàn tụ với gia đình [1][2].',
        ],
      ),
    ),
    meaningEn: doc(
      h3('About the work'),
      ul(
        [
          { italic: 'The Tale of Kiều' },
          ' (original title ',
          { italic: 'Đoạn trường tân thanh' },
          ', "a new cry from a broken heart") is a verse narrative by Nguyễn Du (1765–1820), 3,254 lines in the lục bát (six–eight) meter [1][2].',
        ],
        [
          'Its plot is based on the Chinese novel ',
          { italic: 'Jin Yun Qiao' },
          ' (Kim Vân Kiều) by Qingxin Cairen, set in the Jiajing era of the Ming dynasty [1][2].',
        ],
        [
          'Nguyễn Du frames the story around the idea that talent and destiny are at odds ("tài mệnh tương đố") [1].',
        ],
        [
          'Translator Huỳnh Sanh Thông called it "the supreme masterwork of Vietnamese literature" [2][6].',
        ],
      ),
      h3('About this passage'),
      ul(
        [
          'It introduces the daughters of the Vương family: Thúy Kiều, the elder, and Thúy Vân, the younger; there is also a youngest brother, Vương Quan [1].',
        ],
        [
          'The sisters are each "perfect in her own way", yet in talent and beauty Kiều is the finer [1].',
        ],
        [
          'Thúy Vân is described with a face "full as the moon"; she is considered second only to her sister and has a far calmer life, later marrying Kim Trọng [3].',
        ],
        [
          'Thúy Kiều later sells herself to save her father and brother and spends fifteen years adrift before being reunited with her family [1][2].',
        ],
      ),
    ),
    translation: null,
  },

  'co-cong-mai-sat-co-ngay-nen-kim': {
    sources: [
      {
        label: 'có công mài sắt có ngày nên kim – Wiktionary tiếng Việt',
        url: WIKT('c%C3%B3_c%C3%B4ng_m%C3%A0i_s%E1%BA%AFt_c%C3%B3_ng%C3%A0y_n%C3%AAn_kim'),
      },
      { label: 'Tục ngữ – Wikipedia tiếng Việt', url: WP('T%E1%BB%A5c_ng%E1%BB%AF') },
    ],
    meaningVi: doc(
      p(
        'Nghĩa bóng: có quyết tâm và kiên trì thì sẽ thành công, đạt được điều mình mong muốn [1].',
      ),
    ),
  },
  'uong-nuoc-nho-nguon': {
    sources: [
      {
        label: 'uống nước nhớ nguồn – Wiktionary tiếng Việt',
        url: WIKT('u%E1%BB%91ng_n%C6%B0%E1%BB%9Bc_nh%E1%BB%9B_ngu%E1%BB%93n'),
      },
      { label: 'Tục ngữ – Wikipedia tiếng Việt', url: WP('T%E1%BB%A5c_ng%E1%BB%AF') },
    ],
    meaningVi: doc(
      p(
        'Nghĩa bóng: luôn nhớ ơn những người đã nuôi dạy mình và nơi đã sinh ra, nuôi mình khôn lớn [1].',
      ),
    ),
  },
  'cong-cha-nhu-nui-thai-son': {
    sources: [
      { label: 'Hiếu thảo – Wikipedia tiếng Việt', url: WP('Hi%E1%BA%BFu_th%E1%BA%A3o') },
      { label: 'Thái Sơn – Wikipedia tiếng Việt', url: WP('Th%C3%A1i_S%C6%A1n') },
      {
        label: 'Ca dao – Wikipedia tiếng Việt',
        url: WP('Ca_dao'),
        note: 'Ca dao có nhiều dị bản.',
      },
    ],
    meaningVi: doc(
      p(
        'Câu ca dao được dẫn khi nói về lòng hiếu thảo – theo Nho giáo là đức tính tôn trọng cha mẹ và tổ tiên [1].',
      ),
      p(
        'Thái Sơn là ngọn núi ở tỉnh Sơn Đông (Trung Quốc), được coi là quan trọng nhất trong Ngũ Nhạc danh sơn và có lịch sử thờ cúng ít nhất 3.000 năm [2].',
      ),
    ),
  },
  'bau-oi-thuong-lay-bi-cung': {
    sources: [
      {
        label: 'Bí đao – Wikipedia tiếng Việt',
        url: WP('B%C3%AD_%C4%91ao'),
        note: 'Dẫn câu ca dao trong mục về văn hoá.',
      },
      { label: 'Ca dao – Wikipedia tiếng Việt', url: WP('Ca_dao') },
    ],
    meaningVi: null, // no source found that explains it
  },
  'simplicity-is-prerequisite-for-reliability': {
    sources: [
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
    ],
    meaningVi: null,
  },
  'make-it-work-make-it-right-make-it-fast': {
    sources: [
      {
        label: 'MakeItWorkMakeItRightMakeItFast – c2 wiki',
        url: 'https://wiki.c2.com/?MakeItWorkMakeItRightMakeItFast',
        note: 'Cách diễn đạt này được gán cho Kent Beck; ý tưởng đã có trước đó (B. Lampson 1983; S. C. Johnson & B. Kernighan, Byte 1983).',
      },
    ],
    meaningVi: doc(
      p(
        'Theo các cách hiểu được ghi trên c2 wiki: trước hết viết mã chạy được cho trường hợp phổ biến; sau đó làm cho đúng – xử lý các trường hợp đặc biệt, lỗi, và viết lại cho rõ ràng; cuối cùng mới tối ưu tốc độ. Nửa sau ("đúng trước, nhanh sau") được xem là cách phát biểu lại các nguyên tắc tối ưu hoá [1].',
      ),
    ),
  },
}

async function main() {
  const { getPayload } = await import('payload')
  const { default: config } = await import('../src/payload.config')
  const payload = await getPayload({ config })

  for (const [slug, e] of Object.entries(ENTRIES)) {
    const post = (
      await payload.find({ collection: 'posts', where: { slug: { equals: slug } }, limit: 1 })
    ).docs[0]
    if (!post) {
      console.log(`missing ${slug}`)
      continue
    }
    const base: Record<string, unknown> = { sources: e.sources, _status: 'published' }
    if (e.translation !== undefined) base.translation = e.translation
    await payload.update({
      collection: 'posts',
      id: post.id,
      locale: 'vi',
      data: { ...base, meaning: e.meaningVi } as never,
    })
    // English: an explicit English text, otherwise clear it (falls back to Vietnamese / nothing)
    await payload.update({
      collection: 'posts',
      id: post.id,
      locale: 'en',
      data: { meaning: e.meaningEn ?? null, _status: 'published' } as never,
    })
    console.log(`updated ${slug}`)
  }
  process.exit(0)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
