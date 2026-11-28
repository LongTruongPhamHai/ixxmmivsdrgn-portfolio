import type { GlobalConfig } from 'payload'

/**
 * Info shown in the "i" popup of the music player while the ceremonial playlist (nhạc nghi lễ) plays.
 * Edited in the admin; the popup only appears once a title is filled in.
 */
export const MusicInfo: GlobalConfig = {
  slug: 'music-info',
  label: { vi: 'Thông tin nhạc nghi lễ', en: 'Ceremonial music info' },
  access: { read: () => true },
  fields: [
    {
      name: 'title',
      label: { vi: 'Tiêu đề', en: 'Title' },
      type: 'text',
      localized: true,
    },
    {
      name: 'image',
      label: { vi: 'Hình ảnh', en: 'Image' },
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'body',
      label: { vi: 'Nội dung', en: 'Content' },
      type: 'textarea',
      localized: true,
      admin: {
        description: {
          vi: 'Mỗi dòng là một đoạn. Nên ghi nguồn ở mục "Nguồn tham khảo".',
          en: 'One paragraph per line. Cite sources below.',
        },
      },
    },
    {
      name: 'sources',
      label: { vi: 'Nguồn tham khảo', en: 'Sources' },
      type: 'array',
      fields: [
        { name: 'label', label: { vi: 'Tên nguồn', en: 'Label' }, type: 'text', required: true },
        { name: 'url', label: 'URL', type: 'text' },
      ],
    },
  ],
}
