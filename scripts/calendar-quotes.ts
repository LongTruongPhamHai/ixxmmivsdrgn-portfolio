/**
 * Sayings copied from the HDBank wall calendars (2023–2024), with the author line as printed.
 * Shared by seed-blog-content.ts (creates the posts) and seed-blog-references.ts (adds the source).
 */
export type CalendarQuote = {
  slug: string
  author: string
  /** lines as printed */
  lines: string[]
  tags: string[]
  /** calendar sheet the saying is printed on */
  sheet: string
}

export const CALENDAR_QUOTES: CalendarQuote[] = [
  {
    slug: 'chang-ai-chet-duoi-trong-mo-hoi',
    author: 'Khuyết danh',
    lines: ['Chẳng ai chết đuối trong mồ hôi', 'mà chỉ chết chìm trong lười biếng.'],
    tags: ['Chăm chỉ', 'Động lực'],
    sheet: 'tờ ngày 17/11/2023',
  },
  {
    slug: 'hanh-phuc-khong-phai-la-thu-xay-den',
    author: 'Maxwell Maltz',
    lines: [
      'Hạnh phúc không phải là thứ xảy đến với bạn.',
      'Nó là thứ chính bạn thực hiện và quyết định.',
    ],
    tags: ['Hạnh phúc'],
    sheet: 'tờ ngày 4/8/2024',
  },
  {
    slug: 'mot-cuon-sach-hay-tren-gia-sach',
    author: 'Khuyết danh',
    lines: [
      'Một cuốn sách hay trên giá sách là một người bạn',
      'dù quay lưng lại nhưng vẫn là bạn tốt.',
    ],
    tags: ['Đọc sách'],
    sheet: 'tờ ngày 10/9/2024',
  },
  {
    slug: 'moi-cong-viec-thanh-dat',
    author: 'Ngạn ngữ Tây Ban Nha',
    lines: ['Mọi công việc thành đạt đều nhờ', 'sự kiên trì và lòng say mê.'],
    tags: ['Kiên trì', 'Động lực'],
    sheet: 'một tờ tháng 10/2024',
  },
  {
    slug: 'giau-co-gom-co-hai-canh-tay',
    author: 'Tục ngữ Italia',
    lines: ['Giàu có gồm có hai cánh tay:', 'một là sự khôn khéo và một là tính tiết kiệm.'],
    tags: ['Tiết kiệm'],
    sheet: 'tờ ngày 28/10/2024',
  },
  {
    slug: 'nguoi-giau-co-nhat',
    author: 'Socrates',
    lines: [
      'Người giàu có nhất là người hài lòng với ít nhất,',
      'bởi sự mãn nguyện là của cải tự nhiên.',
    ],
    tags: ['Hạnh phúc', 'Tiết kiệm'],
    sheet: 'tờ ngày 29/10/2024',
  },
  {
    slug: 'ngay-bo-phi-nhat',
    author: 'Chamfort',
    lines: ['Ngày bỏ phí nhất là ngày mà người ta không cười.'],
    tags: ['Hạnh phúc'],
    sheet: 'tờ ngày 31/10/2024',
  },
  {
    slug: 'nguoi-biet-doc',
    author: 'Huxley',
    lines: [
      'Người biết đọc nắm trong tay sức mạnh để khuếch đại',
      'bản thân mình, để nhân lên những cách mình tồn tại,',
      'để lấp đầy cuộc đời mình một cách đáng kể và thú vị.',
    ],
    tags: ['Đọc sách'],
    sheet: 'tờ ngày 2/11/2024',
  },
  {
    slug: 'tinh-gian-di',
    author: 'Khuyết danh',
    lines: [
      'Tính giản dị giúp người ta được thanh thản, nhẹ nhàng,',
      'xóa bỏ được những ưu tư, phiền muộn.',
    ],
    tags: ['Giản dị'],
    sheet: 'tờ ngày 3/11/2024',
  },
  {
    slug: 'hay-biet-vua-phai',
    author: 'Adams',
    lines: ['Hãy biết vừa phải, có lòng khoan dung,', 'sống nhún nhường, như thế là đủ.'],
    tags: ['Giản dị'],
    sheet: 'tờ ngày 4/11/2024',
  },
  {
    slug: 'su-kien-nhan-dang-chat',
    author: 'Rousseau',
    lines: ['Sự kiên nhẫn đắng chát,', 'nhưng quả của nó lại ngọt ngào.'],
    tags: ['Kiên trì'],
    sheet: 'tờ ngày 5/11/2024',
  },
  {
    slug: 'hap-thu-nhung-gi-huu-ich',
    author: 'Bruce Lee',
    lines: [
      'Hấp thụ những gì hữu ích, từ chối những gì vô ích,',
      'thêm những gì cụ thể là của riêng bạn.',
    ],
    tags: ['Học tập'],
    sheet: 'tờ ngày 15/11/2024',
  },
  {
    slug: 'ky-luat-mang-trong-minh-tiem-nang',
    author: 'Jim Rohn',
    lines: ['Kỷ luật mang trong mình tiềm năng để tạo ra', 'những điều kỳ diệu ở tương lai.'],
    tags: ['Kỷ luật', 'Động lực'],
    sheet: 'tháng 12/2024 (Ngày Toàn quốc kháng chiến 19/12)',
  },
]
