import type { Field, FieldHook } from 'payload'

/** "Bánh trôi nước – Hồ Xuân Hương" -> "banh-troi-nuoc-ho-xuan-huong" (Vietnamese-aware) */
export const slugify = (value: string): string =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // strip accents
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)

/** Fill the slug from another field when it's left empty; always normalise what was typed */
const formatSlug =
  (fallbackField: string): FieldHook =>
  ({ value, data, originalDoc }) => {
    if (typeof value === 'string' && value.trim()) return slugify(value)
    const source = data?.[fallbackField] ?? originalDoc?.[fallbackField]
    return typeof source === 'string' && source.trim() ? slugify(source) : value
  }

/** Unique, URL-safe slug generated from `fallbackField` (editable in the sidebar) */
export const slugField = (fallbackField = 'title'): Field => ({
  name: 'slug',
  type: 'text',
  unique: true,
  index: true,
  admin: {
    position: 'sidebar',
    description: 'Để trống để tự tạo từ tiêu đề / tên.',
  },
  hooks: { beforeValidate: [formatSlug(fallbackField)] },
})
