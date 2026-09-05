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
          admin: { date: { pickerAppearance: 'monthOnly' } }
        },
        {
          name: 'endDate',
          label: 'Ngày kết thúc',
          type: 'date',
          admin: { date: { pickerAppearance: 'monthOnly' } }
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
        { label: 'Xuất sắc', value: 'Excellent' },
        { label: 'Giỏi', value: 'Good' },
        { label: 'Khá', value: 'Fair' },
        { label: 'Trung bình', value: 'Average' },
      ],
    },
  ],
}
