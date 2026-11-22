import type { CollectionConfig } from 'payload'
import { slugField } from '../fields/slug'

/**
 * Category = the *form* of a post (Tips, Thơ, Ca dao – tục ngữ, Châm ngôn, Bài viết...).
 * Every post has exactly one; its display type decides how the post is rendered.
 */
export const Categories: CollectionConfig = {
  slug: 'categories',
  labels: {
    singular: { vi: 'Chuyên mục', en: 'Category' },
    plural: { vi: 'Chuyên mục', en: 'Categories' },
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'displayType', 'slug'],
    group: { vi: 'Blog', en: 'Blog' },
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'name',
      label: { vi: 'Tên chuyên mục', en: 'Category name' },
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'displayType',
      label: { vi: 'Kiểu hiển thị', en: 'Display type' },
      type: 'select',
      required: true,
      defaultValue: 'article',
      options: [
        {
          label: {
            vi: 'Bài viết (tiêu đề, tóm tắt, trang chi tiết)',
            en: 'Article (title, excerpt, detail page)',
          },
          value: 'article',
        },
        {
          label: {
            vi: 'Thơ (giữ xuống dòng, căn giữa)',
            en: 'Verse (keeps line breaks, centered)',
          },
          value: 'verse',
        },
        {
          label: { vi: 'Trích dẫn (chữ lớn + tác giả)', en: 'Quote (large text + author)' },
          value: 'quote',
        },
      ],
      admin: {
        description: {
          vi: 'Quyết định cách các bài trong chuyên mục này được trình bày.',
          en: 'Decides how posts in this category are displayed.',
        },
      },
    },
    {
      name: 'color',
      label: { vi: 'Màu nhãn', en: 'Badge color' },
      type: 'select',
      defaultValue: 'amber',
      options: [
        { label: { vi: 'Vàng', en: 'Amber' }, value: 'amber' },
        { label: { vi: 'Xanh lá', en: 'Lime' }, value: 'lime' },
        { label: { vi: 'Xám', en: 'Gray' }, value: 'neutral' },
        { label: { vi: 'Đỏ', en: 'Red' }, value: 'danger' },
      ],
    },
    {
      name: 'description',
      label: { vi: 'Mô tả', en: 'Description' },
      type: 'textarea',
      localized: true,
    },
    slugField('name'),
  ],
}
