/**
 * Info popup for each song in the "bài hát" playlist, keyed by the track title
 * (from public/music/bai-hat file names). Facts only from the cited sources; no lyrics.
 */
type Lang = 'vi' | 'en'
type Source = { label: string; url: string | null }
export type SongInfo = { title: string; body: string; sources: Source[] }

const WP = (page: string) => `https://vi.wikipedia.org/wiki/${page}`

const SONGS: Record<
  string,
  { title: Record<Lang, string>; body: Record<Lang, string>; sources: Source[] }
> = {
  'Bác đang cùng chúng cháu hành quân': {
    title: {
      vi: 'Bác đang cùng chúng cháu hành quân – Huy Thục',
      en: 'Bác đang cùng chúng cháu hành quân (Uncle Hồ Is Marching With Us) – Huy Thục',
    },
    body: {
      vi: `Ca khúc do nhạc sĩ Huy Thục (Lê Huy Thục, sinh năm 1935) sáng tác năm 1969 và được phát chính thức lần đầu trên Đài Tiếng nói Việt Nam năm 1970 [1][2].
Sau khi Chủ tịch Hồ Chí Minh qua đời, nhạc sĩ cùng đoàn nghệ thuật vào viếng Bác rồi lên đường vào mặt trận Đường 9 – Quảng Trị; chứng kiến bộ đội biến đau thương thành quyết tâm, ông viết bài hát khi đang điều trị tại một bệnh xá dã chiến [1].
Bài hát viết theo nhịp hành khúc 2/4 khoẻ khoắn, xoay quanh hình ảnh Bác Hồ như vẫn đang cùng các chiến sĩ hành quân [1].
Đây là một trong những bài hát chính thức của Quân đội nhân dân Việt Nam, thường vang lên trong các lễ kỷ niệm, duyệt binh, mít tinh và hội diễn [1].`,
      en: `The song was written by composer Huy Thục (Lê Huy Thục, born 1935) in 1969 and first officially broadcast on the Voice of Vietnam in 1970 [1][2].
After President Hồ Chí Minh's death, the composer paid his respects with an arts troupe and then left for the Route 9 – Quảng Trị front; seeing soldiers turn grief into resolve, he wrote the song while being treated at a field hospital [1].
It is a vigorous 2/4 march built around the image of Uncle Hồ still marching alongside the soldiers [1].
It is one of the official songs of the Vietnam People's Army, often heard at commemorations, parades, rallies and arts festivals [1].`,
    },
    sources: [
      {
        label: 'Bác đang cùng chúng cháu hành quân – Wikipedia',
        url: WP('B%C3%A1c_%C4%91ang_c%C3%B9ng_ch%C3%BAng_ch%C3%A1u_h%C3%A0nh_qu%C3%A2n'),
      },
      { label: 'Huy Thục – Wikipedia', url: WP('Huy_Th%E1%BB%A5c') },
    ],
  },
  'Hát mãi khúc quân hành': {
    title: {
      vi: 'Hát mãi khúc quân hành – Diệp Minh Tuyền',
      en: 'Hát mãi khúc quân hành (Forever Singing the Marching Song) – Diệp Minh Tuyền',
    },
    body: {
      vi: `Ca khúc do nhà thơ, nhạc sĩ Diệp Minh Tuyền (1941–1997), quê Mỹ Tho, viết cả nhạc và lời năm 1984 [1][2].
Bài hát đoạt giải Nhất cuộc thi sáng tác về lực lượng vũ trang do Quân đội nhân dân tổ chức năm 1984 [1][2].
Năm 1989, chính tác giả trình bày ca khúc tại Đại hội Nhà văn lần thứ IV; bài hát dần trở thành ca khúc gần như chính thức trong thanh niên và quân đội [1].
Hiện là bài hát truyền thống của Quân đội nhân dân Việt Nam; từ năm 2016, chương trình nghệ thuật mang tên "Hát mãi khúc quân hành" được tổ chức nhân dịp kỷ niệm ngày thành lập Quân đội nhân dân và Ngày hội Quốc phòng toàn dân (22/12) [1].`,
      en: `Poet and composer Diệp Minh Tuyền (1941–1997), from Mỹ Tho, wrote both the music and lyrics in 1984 [1][2].
The song won first prize in the 1984 People's Army songwriting contest on the armed forces [1][2].
In 1989 the author performed it himself at the 4th Writers' Congress; it gradually became an almost official song among young people and the army [1].
It is now a traditional song of the Vietnam People's Army; since 2016 an arts programme named after it has marked the army's founding day and National Defence Day (22 December) [1].`,
    },
    sources: [
      {
        label: 'Hát mãi khúc quân hành – Wikipedia',
        url: WP('H%C3%A1t_m%C3%A3i_kh%C3%BAc_qu%C3%A2n_h%C3%A0nh'),
      },
      { label: 'Diệp Minh Tuyền – Wikipedia', url: WP('Di%E1%BB%87p_Minh_Tuy%E1%BB%81n') },
    ],
  },
  'Tiến bước dưới quân kỳ': {
    title: {
      vi: 'Tiến bước dưới quân kỳ – Doãn Nho',
      en: 'Tiến bước dưới quân kỳ (Marching Under the Army Flag) – Doãn Nho',
    },
    body: {
      vi: `Ca khúc do nhạc sĩ, Đại tá Doãn Nho (sinh năm 1933 tại Hà Nội) sáng tác năm 1958, khi ông trở lại thăm Điện Biên Phủ [1][2].
Đây là một trong những bài hát truyền thống của Quân đội nhân dân Việt Nam, thường được dùng trong các nghi lễ của Nhà nước và quân đội [1].
Nhạc sĩ Doãn Nho được tặng Giải thưởng Nhà nước về văn học nghệ thuật (2001) và Giải thưởng Hồ Chí Minh về văn học nghệ thuật (2017) [2].`,
      en: `Composer and Colonel Doãn Nho (born 1933 in Hanoi) wrote the song in 1958, on a return visit to Điện Biên Phủ [1][2].
It is one of the traditional songs of the Vietnam People's Army, often used in state and army ceremonies [1].
Doãn Nho received the State Prize for Literature and Arts (2001) and the Hồ Chí Minh Prize for Literature and Arts (2017) [2].`,
    },
    sources: [
      {
        label: 'Tiến bước dưới quân kỳ – Wikipedia',
        url: WP('Ti%E1%BA%BFn_b%C6%B0%E1%BB%9Bc_d%C6%B0%E1%BB%9Bi_qu%C3%A2n_k%E1%BB%B3'),
      },
      { label: 'Doãn Nho – Wikipedia', url: WP('Do%C3%A3n_Nho') },
    ],
  },
  'Vì nhân dân quên mình': {
    title: {
      vi: 'Vì nhân dân quên mình – Doãn Quang Khải',
      en: 'Vì nhân dân quên mình (Selfless for the People) – Doãn Quang Khải',
    },
    body: {
      vi: `Ca khúc do Doãn Quang Khải, khi đó là trung đội trưởng tại trường sĩ quan lục quân, sáng tác tháng 5/1951 – viết trong một đêm, chỉ khoảng ba tiếng, bằng cây kèn harmonica [1].
Ngay hôm sau, học viên đã hát bài này trước trường; nhạc sĩ Nguyễn Xuân Khoát sau đó chỉnh sửa để phổ biến rộng rãi [1].
Bài hát được giải Nhì cuộc thi văn học nghệ thuật toàn quốc khoảng năm 1952–1953 [1].
Đây là bài hát truyền thống của Quân đội nhân dân Việt Nam, được dùng làm nhạc hiệu cho các chương trình phát thanh, truyền hình về quân đội và có trong Từ điển Bách khoa Quân sự Việt Nam [1].`,
      en: `Doãn Quang Khải, then a platoon leader at the army officers' school, wrote the song in May 1951 – in a single night, in about three hours, on a harmonica [1].
Students sang it in front of the school the next day; composer Nguyễn Xuân Khoát later revised it for wider use [1].
It won second prize in the national literature and arts contest around 1952–1953 [1].
It is a traditional song of the Vietnam People's Army, used as the theme for army radio and TV programmes, and is listed in the Vietnamese Military Encyclopedia [1].`,
    },
    sources: [
      {
        label: 'Vì nhân dân quên mình – Wikipedia',
        url: WP('V%C3%AC_nh%C3%A2n_d%C3%A2n_qu%C3%AAn_m%C3%ACnh'),
      },
    ],
  },
}

/** Song info for one language, keyed by track title */
export function getSongInfo(locale: string): Record<string, SongInfo> {
  const lang: Lang = locale === 'en' ? 'en' : 'vi'
  return Object.fromEntries(
    Object.entries(SONGS).map(([k, s]) => [
      k,
      { title: s.title[lang], body: s.body[lang], sources: s.sources },
    ]),
  )
}
