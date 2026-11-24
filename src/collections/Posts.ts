import type { CollectionBeforeChangeHook, CollectionConfig } from 'payload'
import { slugField, slugify } from '../fields/slug'

type LexicalNode = { text?: string; children?: LexicalNode[]; type?: string }

/** Plain text of a Lexical rich-text value (paragraphs separated by new lines) */
export const lexicalToText = (value: unknown): string => {
  const root = (value as { root?: LexicalNode } | null)?.root
  if (!root) return ''
  const walk = (node: LexicalNode): string =>
    node.type === 'linebreak' ? '\n' : (node.text ?? '') + (node.children ?? []).map(walk).join('')
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
  labels: {
    singular: { vi: 'Bài viết', en: 'Post' },
    plural: { vi: 'Bài viết', en: 'Posts' },
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'tags', 'publishedAt', '_status'],
    group: { vi: 'Blog', en: 'Blog' },
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
      label: { vi: 'Tiêu đề', en: 'Title' },
      type: 'text',
      admin: {
        description: {
          vi: 'Có thể để trống với câu ngắn (ca dao, châm ngôn): sẽ lấy dòng đầu của nội dung.',
          en: 'May be left empty for short sayings: the first line of the content is used.',
        },
      },
    },
    {
      name: 'content',
      label: { vi: 'Nội dung', en: 'Content' },
      type: 'richText',
      required: true,
      admin: {
        description: {
          vi: 'Thơ: mỗi khổ là một đoạn, xuống dòng trong khổ bằng Shift + Enter.',
          en: 'Poems: one paragraph per stanza, Shift + Enter for a line break.',
        },
      },
    },
    {
      name: 'excerpt',
      label: { vi: 'Tóm tắt', en: 'Excerpt' },
      type: 'textarea',
      admin: {
        description: {
          vi: 'Hiện trên thẻ bài ở trang danh sách (dành cho bài viết dài).',
          en: 'Shown on the post card in the list (for long articles).',
        },
      },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'author',
          label: { vi: 'Tác giả / Nguồn', en: 'Author / Source' },
          type: 'text',
          admin: {
            description: {
              vi: 'Ví dụ: Hồ Xuân Hương, Ca dao, Khuyết danh…',
              en: 'E.g. Hồ Xuân Hương, Folk song, Anonymous…',
            },
          },
        },
        {
          name: 'series',
          label: { vi: 'Series', en: 'Series' },
          type: 'text',
          admin: {
            description: {
              vi: 'Gom các bài cùng chuỗi, ví dụ: Học Git',
              en: 'Groups posts of the same series, e.g. Learning Git',
            },
          },
        },
      ],
    },
    {
      name: 'meaning',
      label: { vi: 'Ý nghĩa / Giải thích', en: 'Meaning / Explanation' },
      type: 'richText',
      // vi + en: switch "Locale" at the top of the editor to write each language
      localized: true,
      admin: {
        description: {
          vi: 'Tuỳ chọn – giải nghĩa, phân tích. Viết bản tiếng Việt ở Locale "vi" và bản tiếng Anh ở Locale "en" (bản tiếng Anh trống thì hiện bản tiếng Việt).',
          en: 'Optional – meaning, analysis. Write Vietnamese under Locale "vi" and English under Locale "en" (empty English falls back to Vietnamese).',
        },
      },
    },
    {
      name: 'translation',
      label: { vi: 'Bản dịch tiếng Anh', en: 'English translation' },
      type: 'textarea',
      admin: {
        description: {
          vi: 'Tuỳ chọn – bản dịch tham khảo của bài thơ/câu nói, giữ nguyên xuống dòng. Hiện bên dưới nguyên văn ở trang tiếng Anh.',
          en: 'Optional – a reference translation of the poem/saying, line breaks kept. Shown below the original on the English site.',
        },
      },
    },
    {
      name: 'coverImage',
      label: { vi: 'Ảnh bìa', en: 'Cover image' },
      type: 'upload',
      relationTo: 'media',
    },

    // ----- Sidebar -----
    {
      name: 'category',
      label: { vi: 'Chuyên mục', en: 'Category' },
      type: 'relationship',
      relationTo: 'categories',
      required: true,
      // the "+" button next to the field creates a new category without leaving the post
      admin: { position: 'sidebar', allowCreate: true },
    },
    {
      name: 'tags',
      label: { vi: 'Thẻ', en: 'Tags' },
      type: 'relationship',
      relationTo: 'tags',
      hasMany: true,
      admin: { position: 'sidebar', allowCreate: true },
    },
    slugField('title'),
    {
      name: 'publishedAt',
      label: { vi: 'Ngày đăng', en: 'Published on' },
      type: 'date',
      defaultValue: () => new Date().toISOString(),
      admin: {
        position: 'sidebar',
        date: { pickerAppearance: 'dayOnly', displayFormat: 'dd/MM/yyyy' },
      },
    },
    {
      name: 'featured',
      label: { vi: 'Nổi bật (ghim lên đầu)', en: 'Featured (pinned to top)' },
      type: 'checkbox',
      defaultValue: false,
      admin: { position: 'sidebar' },
    },
    {
      name: 'readingTime',
      label: { vi: 'Thời gian đọc (phút)', en: 'Reading time (min)' },
      type: 'number',
      admin: { position: 'sidebar', readOnly: true },
    },
  ],
}
