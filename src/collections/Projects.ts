import type { CollectionConfig } from 'payload'

export const Projects: CollectionConfig = {
  slug: 'projects',
  labels: {
    singular: 'Personal Project',
    plural: 'Personal Projects',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'completionDate'],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'title',
      label: 'Tên dự án',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
    },
    {
      name: 'completionDate',
      label: 'Thời gian hoàn thiện',
      type: 'date',
      admin: { date: { pickerAppearance: 'monthOnly' } }
    },
    {
      name: 'summary',
      label: 'Mô tả ngắn gọn',
      type: 'textarea',
      localized: true,
    },
    {
      name: 'content',
      label: 'Mô tả chi tiết',
      type: 'richText',
      localized: true,
    },
    {
      name: 'techStack',
      label: 'Công nghệ sử dụng',
      type: 'relationship',
      relationTo: 'skills',
      hasMany: true,
    },
    {
      name: 'coverImage',
      label: 'Ảnh bìa',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'links',
      label: 'Liên kết',
      type: 'group',
      fields: [
        { name: 'repo', label: 'Source Code URL', type: 'text' },
        { name: 'demo', label: 'Live Demo URL', type: 'text' },
      ],
    },
  ],
}
