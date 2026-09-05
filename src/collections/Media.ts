import type { CollectionConfig } from 'payload'
import path from 'path'

export const Media: CollectionConfig = {
  slug: 'media',

  upload: {
    staticDir: path.resolve(process.cwd(), 'public/media'),
    mimeTypes: ['image/*'],
  },

  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
      label: 'Alt Text',
    },
  ],
}
