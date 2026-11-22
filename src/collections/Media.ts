import type { CollectionConfig } from 'payload'
import path from 'path'

export const Media: CollectionConfig = {
  slug: 'media',
  labels: {
    singular: { vi: 'Tệp media', en: 'Media file' },
    plural: { vi: 'Ảnh & tệp', en: 'Media' },
  },
  access: {
    read: () => true,
  },

  upload: {
    staticDir: path.resolve(process.cwd(), 'public/media'),
    mimeTypes: ['image/*'],
  },

  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
      label: { vi: 'Mô tả ảnh (alt)', en: 'Alt text' },
    },
  ],
}
