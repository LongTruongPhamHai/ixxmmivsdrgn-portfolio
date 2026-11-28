/**
 * Sayings collected by the site owner, each checked against sources found online.
 * Shared by seed-blog-content.ts (creates the posts) and seed-blog-references.ts (adds the source).
 */
export type CalendarQuote = {
  slug: string
  author: string
  /** lines as printed */
  lines: string[]
  tags: string[]
  /** reputable sources found online; empty = none found → the post stays hidden */
  sources: { label: string; url?: string; note?: string }[]
}

export const CALENDAR_QUOTES: CalendarQuote[] = [
  {
    slug: 'chang-ai-chet-duoi-trong-mo-hoi',
    author: 'Khuyết danh',
    lines: ['Chẳng ai chết đuối trong mồ hôi', 'mà chỉ chết chìm trong lười biếng.'],
    tags: ['Chăm chỉ', 'Động lực'],
    sources: [
      {
        label: '"No one ever drowned in sweat" – Barry Popik (The Big Apple)',
        url: 'https://barrypopik.com/blog/no_one_ever_drowned_in_sweat',
        note: 'Câu nói dân gian của dân cao bồi Mỹ, xuất hiện trên báo từ năm 1946; không rõ tác giả.',
      },
    ],
  },
  {
    slug: 'hanh-phuc-khong-phai-la-thu-xay-den',
    author: 'Maxwell Maltz',
    lines: [
      'Hạnh phúc không phải là thứ xảy đến với bạn.',
      'Nó là thứ chính bạn thực hiện và quyết định.',
    ],
    tags: ['Hạnh phúc'],
    sources: [
      {
        label: 'Maxwell Maltz – Psycho-Cybernetics (1960) – LibQuotes',
        url: 'https://libquotes.com/maxwell-maltz/works/psycho-cybernetics',
        note: 'Nguyên văn: "Happiness isn’t something that happens to you. It is what you yourself do and determine upon."',
      },
    ],
  },
  {
    slug: 'mot-cuon-sach-hay-tren-gia-sach',
    author: 'Khuyết danh',
    lines: [
      'Một cuốn sách hay trên giá sách là một người bạn',
      'dù quay lưng lại nhưng vẫn là bạn tốt.',
    ],
    tags: ['Đọc sách'],
    sources: [
      {
        label: 'Some Thoughts About Books & Reading – Goodreads',
        url: 'https://www.goodreads.com/author_blog_posts/21979368-some-thoughts-about-books-reading',
        note: 'Nguyên văn: "A good book on your shelf is a friend that turns its back on you and remains a friend." – không rõ tác giả.',
      },
    ],
  },
  {
    slug: 'moi-cong-viec-thanh-dat',
    author: 'Ngạn ngữ Tây Ban Nha',
    lines: ['Mọi công việc thành đạt đều nhờ', 'sự kiên trì và lòng say mê.'],
    tags: ['Kiên trì', 'Động lực'],
    sources: [],
  },
  {
    slug: 'giau-co-gom-co-hai-canh-tay',
    author: 'Tục ngữ Italia',
    lines: ['Giàu có gồm có hai cánh tay:', 'một là sự khôn khéo và một là tính tiết kiệm.'],
    tags: ['Tiết kiệm'],
    sources: [],
  },
  {
    slug: 'nguoi-giau-co-nhat',
    author: 'Socrates',
    lines: [
      'Người giàu có nhất là người hài lòng với ít nhất,',
      'bởi sự mãn nguyện là của cải tự nhiên.',
    ],
    tags: ['Hạnh phúc', 'Tiết kiệm'],
    sources: [
      {
        label: 'Talk:Socrates – Wikiquote',
        url: 'https://en.wikiquote.org/wiki/Talk:Socrates',
        note: 'Nguyên văn: "He is richest who is content with the least, for content is the wealth of nature." Wikiquote chưa xác minh được xuất xứ; Socrates không để lại tác phẩm viết.',
      },
    ],
  },
  {
    slug: 'ngay-bo-phi-nhat',
    author: 'Nicolas Chamfort',
    lines: ['Ngày bỏ phí nhất là ngày mà người ta không cười.'],
    tags: ['Hạnh phúc'],
    sources: [
      {
        label: 'Laughter – Wikiquote',
        url: 'https://en.wikiquote.org/wiki/Laughter',
        note: 'Trích Maximes et pensées (1805): "La plus perdue de toutes les journées est celle où l’on n’a pas ri."',
      },
      {
        label: 'A Day Without Laughter Is a Day Wasted – Quote Investigator',
        url: 'https://quoteinvestigator.com/2011/07/16/laughter-day/',
      },
    ],
  },
  {
    slug: 'nguoi-biet-doc',
    author: 'Aldous Huxley',
    lines: [
      'Người biết đọc nắm trong tay sức mạnh để khuếch đại',
      'bản thân mình, để nhân lên những cách mình tồn tại,',
      'để lấp đầy cuộc đời mình một cách đáng kể và thú vị.',
    ],
    tags: ['Đọc sách'],
    sources: [
      {
        label: 'Jesting Pilate (1926) Quotes – Goodreads',
        url: 'https://www.goodreads.com/work/quotes/3239895',
        note: 'Trích sách du ký Jesting Pilate của Aldous Huxley.',
      },
    ],
  },
  {
    slug: 'tinh-gian-di',
    author: 'Khuyết danh',
    lines: [
      'Tính giản dị giúp người ta được thanh thản, nhẹ nhàng,',
      'xóa bỏ được những ưu tư, phiền muộn.',
    ],
    tags: ['Giản dị'],
    sources: [],
  },
  {
    slug: 'hay-biet-vua-phai',
    author: 'Adams',
    lines: ['Hãy biết vừa phải, có lòng khoan dung,', 'sống nhún nhường, như thế là đủ.'],
    tags: ['Giản dị'],
    sources: [],
  },
  {
    slug: 'su-kien-nhan-dang-chat',
    author: 'Jean-Jacques Rousseau',
    lines: ['Sự kiên nhẫn đắng chát,', 'nhưng quả của nó lại ngọt ngào.'],
    tags: ['Kiên trì'],
    sources: [
      {
        label: 'Jean-Jacques Rousseau: Quotes – Britannica',
        url: 'https://www.britannica.com/quotes/Jean-Jacques-Rousseau',
        note: 'Trích Émile (1762): "Patience is bitter, but its fruit is sweet."',
      },
      {
        label: 'Jean-Jacques Rousseau – WIST Quotations',
        url: 'https://wist.info/rousseau-jean-jacques/86011/',
      },
    ],
  },
  {
    slug: 'hap-thu-nhung-gi-huu-ich',
    author: 'Bruce Lee',
    lines: [
      'Hấp thụ những gì hữu ích, từ chối những gì vô ích,',
      'thêm những gì cụ thể là của riêng bạn.',
    ],
    tags: ['Học tập'],
    sources: [
      {
        label: 'Bruce Lee Philosophies: Absorb What Is Useful – Black Belt Magazine',
        url: 'https://www.blackbeltmag.com/post/bruce-lee-philosophies-part-2-of-2-absorb-what-is-useful',
        note: 'Nguyên văn: "Absorb what is useful, discard what is useless and add what is specifically your own."',
      },
    ],
  },
  {
    slug: 'ky-luat-mang-trong-minh-tiem-nang',
    author: 'Jim Rohn',
    lines: ['Kỷ luật mang trong mình tiềm năng để tạo ra', 'những điều kỳ diệu ở tương lai.'],
    tags: ['Kỷ luật', 'Động lực'],
    sources: [
      {
        label: '17 Remarkable Quotes by Jim Rohn – SUCCESS',
        url: 'https://www.success.com/17-remarkable-quotes-by-jim-rohn',
      },
      {
        label: 'The Miracle Factory You Already Own – JimRohn.com',
        url: 'https://www.jimrohn.com/wisdom/articles/weekly-wisdom-the-miracle-factory-you-already-own',
      },
    ],
  },
]
