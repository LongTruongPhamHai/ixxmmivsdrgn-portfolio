import type { CollectionConfig } from 'payload'

export const Skills: CollectionConfig = {
  slug: 'skills',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'category'],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'name',
      label: 'Tên kỹ năng',
      type: 'text',
      required: true,
    },
    {
      name: 'category',
      label: 'Phân loại',
      type: 'select',
      options: [
        { label: 'Chuyên môn (Lập trình, Framework, v.v.)', value: 'Technical' },
        { label: 'Ngoại ngữ', value: 'Language' },
        { label: 'Khác', value: 'Other' },
      ],
      required: true,
    },
    {
      name: 'icon',
      label: 'Icon (tuỳ chọn)',
      type: 'text',
      admin: {
        description: 'Tên icon (ví dụ: Code, Database, Globe)',
      },
    },
    {
      name: 'yearsOfUse',
      label: 'Số năm kinh nghiệm',
      type: 'number',
    },
  ],
}
