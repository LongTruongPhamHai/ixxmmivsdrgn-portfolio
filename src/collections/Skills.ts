import type { CollectionConfig } from 'payload'

export const Skills: CollectionConfig = {
  slug: 'skills',
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
      label: 'Tên kỹ năng',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      type: 'row',
      fields: [
        {
          name: 'category',
          label: 'Phân loại chính',
          type: 'select',
          options: [
            { label: 'Chuyên môn', value: 'Technical' },
            { label: 'Ngoại ngữ', value: 'Language' },
            { label: 'Kỹ năng mềm / Khác', value: 'Other' },
          ],
          required: true,
        },
        {
          name: 'subCategory',
          label: 'Phân loại chuyên môn sâu',
          type: 'select',
          options: [
            { label: 'Ngôn ngữ lập trình (Programming Languages)', value: 'Programming Language' },
            {
              label: 'Framework / Thư viện (Frameworks & Libraries)',
              value: 'Framework / Library',
            },
            { label: 'Cơ sở dữ liệu (Databases)', value: 'Database' },
            { label: 'Công cụ & DevOps (Tools & DevOps)', value: 'Tools & DevOps' },
            { label: 'Nền tảng Cloud (Cloud Platforms)', value: 'Cloud' },
            { label: 'Khác', value: 'Other' },
          ],
          admin: {
            condition: (data) => data?.category === 'Technical',
          },
        },
      ],
    },
    {
      name: 'docsUrl',
      label: 'Trang tài liệu (Docs URL)',
      type: 'text',
      admin: {
        description: 'Đường dẫn đến trang documentation chính thức (ví dụ: https://react.dev)',
      },
    },
    {
      name: 'icon',
      label: 'Icon (tuỳ chọn)',
      type: 'text',
      admin: {
        description: 'Tên icon (ví dụ: Code, Database, Globe)',
      },
    },
  ],
}
