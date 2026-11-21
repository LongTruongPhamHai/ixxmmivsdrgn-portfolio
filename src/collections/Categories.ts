import type { CollectionConfig } from 'payload'
import { slugField } from '../fields/slug'

/**
 * Category = the *form* of a post (Tips, Thơ, Ca dao – tục ngữ, Châm ngôn, Bài viết...).
 * Every post has exactly one; its display type decides how the post is rendered.
 */
export const Categories: CollectionConfig = {
  slug: 'categories',
  labels: { singular: 'Chuyên mục', plural: 'Chuyên mục' },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'displayType', 'slug'],
    group: 'Blog',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'name',
      label: 'Tên chuyên mục',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'displayType',
      label: 'Kiểu hiển thị',
      type: 'select',
      required: true,
      defaultValue: 'article',
      options: [
        { label: 'Bài viết (tiêu đề, tóm tắt, trang chi tiết)', value: 'article' },
        { label: 'Thơ (giữ xuống dòng, căn giữa)', value: 'verse' },
        { label: 'Trích dẫn (chữ lớn + tác giả)', value: 'quote' },
      ],
      admin: {
        description: 'Quyết định cách các bài trong chuyên mục này được trình bày.',
      },
    },
    {
      name: 'color',
      label: 'Màu nhãn',
      type: 'select',
      defaultValue: 'amber',
      options: [
        { label: 'Vàng (amber)', value: 'amber' },
        { label: 'Xanh (lime)', value: 'lime' },
        { label: 'Xám', value: 'neutral' },
        { label: 'Đỏ', value: 'danger' },
      ],
    },
    {
      name: 'description',
      label: 'Mô tả',
      type: 'textarea',
      localized: true,
    },
    slugField('name'),
  ],
}
