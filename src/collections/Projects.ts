import type { CollectionConfig } from 'payload'

export const Projects: CollectionConfig = {
  slug: 'projects',
  labels: {
    singular: { vi: 'Dự án cá nhân', en: 'Personal project' },
    plural: { vi: 'Dự án cá nhân', en: 'Personal projects' },
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
      label: { vi: 'Tên dự án', en: 'Project name' },
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'slug',
      label: { vi: 'Đường dẫn (slug)', en: 'Slug' },
      type: 'text',
      required: true,
      unique: true,
    },
    {
      name: 'completionDate',
      label: { vi: 'Thời gian hoàn thiện', en: 'Completed on' },
      type: 'date',
      admin: { date: { pickerAppearance: 'monthOnly' } },
    },
    {
      name: 'summary',
      label: { vi: 'Mô tả ngắn gọn', en: 'Summary' },
      type: 'textarea',
      localized: true,
    },
    {
      name: 'content',
      label: { vi: 'Mô tả chi tiết', en: 'Details' },
      type: 'richText',
      localized: true,
    },
    {
      name: 'techStack',
      label: { vi: 'Công nghệ sử dụng', en: 'Tech stack' },
      type: 'relationship',
      relationTo: 'skills',
      hasMany: true,
    },
    {
      name: 'coverImage',
      label: { vi: 'Ảnh bìa', en: 'Cover image' },
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'links',
      label: { vi: 'Liên kết', en: 'Links' },
      type: 'group',
      fields: [
        { name: 'repo', label: { vi: 'Link mã nguồn', en: 'Source code URL' }, type: 'text' },
        { name: 'demo', label: { vi: 'Link demo', en: 'Live demo URL' }, type: 'text' },
      ],
    },
  ],
}
