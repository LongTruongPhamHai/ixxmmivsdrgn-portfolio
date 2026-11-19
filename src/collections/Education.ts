import type { CollectionConfig } from 'payload'

export const Education: CollectionConfig = {
  slug: 'education',
  admin: {
    useAsTitle: 'school',
    defaultColumns: ['school', 'major', 'startDate', 'endDate'],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'school',
      label: 'Trường / Cơ sở đào tạo',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'schoolUrl',
      label: 'Website Trường / Cơ sở đào tạo',
      type: 'text',
      admin: {
        description: 'Đường dẫn đến trang chủ của trường (ví dụ: https://tlu.edu.vn)',
      },
    },
    {
      name: 'major',
      label: 'Chuyên ngành',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      type: 'row',
      fields: [
        {
          name: 'startDate',
          label: 'Ngày bắt đầu',
          type: 'date',
          admin: { date: { pickerAppearance: 'monthOnly' } },
        },
        {
          name: 'endDate',
          label: 'Ngày kết thúc',
          type: 'date',
          admin: { date: { pickerAppearance: 'monthOnly' } },
        },
      ],
    },
    {
      name: 'gpa',
      label: 'GPA (Điểm tổng kết)',
      type: 'text',
    },
    {
      name: 'graduationType',
      label: 'Xếp loại tốt nghiệp',
      type: 'select',
      options: [
        { label: 'Xuất sắc (Excellent)', value: 'Excellent' },
        { label: 'Giỏi (Very good)', value: 'Very good' },
        { label: 'Khá (Good)', value: 'Good' },
        { label: 'Trung bình (Average / Ordinary)', value: 'Average' },
      ],
    },
  ],
}
