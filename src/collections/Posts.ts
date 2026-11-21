import type { CollectionBeforeChangeHook, CollectionConfig } from 'payload'
import { slugField, slugify } from '../fields/slug'

type LexicalNode = { text?: string; children?: LexicalNode[]; type?: string }

/** Plain text of a Lexical rich-text value (paragraphs separated by new lines) */
export const lexicalToText = (value: unknown): string => {
  const root = (value as { root?: LexicalNode } | null)?.root
  if (!root) return ''
  const walk = (node: LexicalNode): string =>
    node.type === 'linebreak'
      ? '\n'
      : (node.text ?? '') + (node.children ?? []).map(walk).join('')
  return (root.children ?? []).map(walk).join('\n').trim()
}

/**
 * - Short posts (quotes, proverbs) may have no title: use the first line of the content
 * - Slug from that title when still empty (the slug field's own hook runs before this one)
 * - Reading time (~200 words / minute)
 */
const deriveFields: CollectionBeforeChangeHook = ({ data }) => {
  const text = lexicalToText(data.content)
  if (!data.title?.trim() && text) {
    const firstLine = text.split('\n')[0].trim()
    data.title = firstLine.length > 60 ? `${firstLine.slice(0, 57)}…` : firstLine
  }
  if (!data.slug && data.title) data.slug = slugify(data.title)
  const words = text.split(/\s+/).filter(Boolean).length
  data.readingTime = Math.max(1, Math.round(words / 200))
  return data
}

export const Posts: CollectionConfig = {
  slug: 'posts',
  labels: { singular: 'Bài viết', plural: 'Bài viết' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'tags', 'publishedAt', '_status'],
    group: 'Blog',
  },
  // Drafts: write now, publish when ready
  versions: { drafts: true },
  access: {
    // Visitors only see published posts; logged-in editors see drafts too
    read: ({ req: { user } }) => (user ? true : { _status: { equals: 'published' } }),
  },
  hooks: {
    beforeChange: [deriveFields],
  },
  fields: [
    {
      name: 'title',
      label: 'Tiêu đề',
      type: 'text',
      admin: {
        description: 'Có thể để trống với câu ngắn (ca dao, châm ngôn): sẽ lấy dòng đầu của nội dung.',
      },
    },
    {
      name: 'content',
      label: 'Nội dung',
      type: 'richText',
      required: true,
      admin: {
        description: 'Thơ: mỗi khổ là một đoạn, xuống dòng trong khổ bằng Shift + Enter.',
      },
    },
    {
      name: 'excerpt',
      label: 'Tóm tắt',
      type: 'textarea',
      admin: {
        description: 'Hiện trên thẻ bài ở trang danh sách (dành cho bài viết dài).',
      },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'author',
          label: 'Tác giả / Nguồn',
          type: 'text',
          admin: { description: 'Ví dụ: Hồ Xuân Hương, Ca dao, Khuyết danh…' },
        },
        {
          name: 'series',
          label: 'Series',
          type: 'text',
          admin: { description: 'Gom các bài cùng chuỗi, ví dụ: Học Git' },
        },
      ],
    },
    {
      name: 'meaning',
      label: 'Ý nghĩa / Giải thích',
      type: 'textarea',
      admin: { description: 'Tuỳ chọn – hữu ích cho ca dao, tục ngữ.' },
    },
    {
      name: 'coverImage',
      label: 'Ảnh bìa',
      type: 'upload',
      relationTo: 'media',
    },

    // ----- Sidebar -----
    {
      name: 'category',
      label: 'Chuyên mục',
      type: 'relationship',
      relationTo: 'categories',
      required: true,
      // the "+" button next to the field creates a new category without leaving the post
      admin: { position: 'sidebar', allowCreate: true },
    },
    {
      name: 'tags',
      label: 'Thẻ',
      type: 'relationship',
      relationTo: 'tags',
      hasMany: true,
      admin: { position: 'sidebar', allowCreate: true },
    },
    slugField('title'),
    {
      name: 'publishedAt',
      label: 'Ngày đăng',
      type: 'date',
      defaultValue: () => new Date().toISOString(),
      admin: { position: 'sidebar', date: { pickerAppearance: 'dayOnly', displayFormat: 'dd/MM/yyyy' } },
    },
    {
      name: 'featured',
      label: 'Nổi bật (ghim lên đầu)',
      type: 'checkbox',
      defaultValue: false,
      admin: { position: 'sidebar' },
    },
    {
      name: 'readingTime',
      label: 'Thời gian đọc (phút)',
      type: 'number',
      admin: { position: 'sidebar', readOnly: true },
    },
  ],
}
