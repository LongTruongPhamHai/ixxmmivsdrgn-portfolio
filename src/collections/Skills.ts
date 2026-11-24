import type { CollectionConfig } from 'payload'

export const Skills: CollectionConfig = {
  slug: 'skills',
  labels: {
    singular: { vi: 'Kỹ năng', en: 'Skill' },
    plural: { vi: 'Kỹ năng', en: 'Skills' },
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'category', 'subCategory'],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'name',
      label: { vi: 'Tên kỹ năng', en: 'Skill name' },
      type: 'text',
      required: true,
      localized: true,
    },
    {
      type: 'row',
      fields: [
        {
          name: 'category',
          label: { vi: 'Phân loại chính', en: 'Main category' },
          type: 'select',
          options: [
            { label: { vi: 'Chuyên môn', en: 'Technical' }, value: 'Technical' },
            { label: { vi: 'Ngoại ngữ', en: 'Languages' }, value: 'Language' },
            { label: { vi: 'Kỹ năng mềm / Khác', en: 'Soft skills / Other' }, value: 'Other' },
          ],
          required: true,
        },
        {
          name: 'subCategory',
          label: { vi: 'Phân loại chuyên môn sâu', en: 'Technical sub-category' },
          type: 'select',
          options: [
            {
              label: { vi: 'Ngôn ngữ lập trình', en: 'Programming languages' },
              value: 'Programming Language',
            },
            {
              label: { vi: 'Framework / Thư viện', en: 'Frameworks & Libraries' },
              value: 'Framework / Library',
            },
            { label: { vi: 'Cơ sở dữ liệu', en: 'Databases' }, value: 'Database' },
            { label: { vi: 'Công cụ & DevOps', en: 'Tools & DevOps' }, value: 'Tools & DevOps' },
            { label: { vi: 'Nền tảng Cloud', en: 'Cloud platforms' }, value: 'Cloud' },
            { label: { vi: 'Khác', en: 'Other' }, value: 'Other' },
          ],
          admin: {
            condition: (data) => data?.category === 'Technical',
          },
        },
      ],
    },
    {
      name: 'docsUrl',
      label: { vi: 'Trang tài liệu', en: 'Docs URL' },
      type: 'text',
      admin: {
        description: {
          vi: 'Đường dẫn tới trang tài liệu chính thức (ví dụ: https://react.dev)',
          en: 'Link to the official documentation (e.g. https://react.dev)',
        },
      },
    },
    {
      name: 'icon',
      label: { vi: 'Icon (tuỳ chọn)', en: 'Icon (optional)' },
      type: 'text',
      admin: {
        description: {
          vi: 'Tên icon (ví dụ: Code, Database, Globe)',
          en: 'Icon name (e.g. Code, Database, Globe)',
        },
      },
    },
  ],
}
