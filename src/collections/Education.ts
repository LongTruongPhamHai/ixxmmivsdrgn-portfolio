import type { CollectionConfig } from 'payload'

export const Education: CollectionConfig = {
  slug: 'education',
  labels: {
    singular: { vi: 'Học vấn', en: 'Education' },
    plural: { vi: 'Học vấn', en: 'Education' },
  },
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
      label: { vi: 'Trường / Cơ sở đào tạo', en: 'School / Institution' },
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'schoolUrl',
      label: { vi: 'Website trường', en: 'School website' },
      type: 'text',
      admin: {
        description: {
          vi: 'Đường dẫn đến trang chủ của trường (ví dụ: https://tlu.edu.vn)',
          en: 'Link to the school homepage (e.g. https://tlu.edu.vn)',
        },
      },
    },
    {
      name: 'major',
      label: { vi: 'Chuyên ngành', en: 'Major' },
      type: 'text',
      required: true,
      localized: true,
    },
    {
      type: 'row',
      fields: [
        {
          name: 'startDate',
          label: { vi: 'Ngày bắt đầu', en: 'Start date' },
          type: 'date',
          admin: { date: { pickerAppearance: 'monthOnly' } },
        },
        {
          name: 'endDate',
          label: { vi: 'Ngày kết thúc', en: 'End date' },
          type: 'date',
          admin: { date: { pickerAppearance: 'monthOnly' } },
        },
      ],
    },
    {
      name: 'gpa',
      label: { vi: 'GPA (Điểm tổng kết)', en: 'GPA' },
      type: 'text',
    },
    {
      name: 'graduationType',
      label: { vi: 'Xếp loại tốt nghiệp', en: 'Graduation rank' },
      type: 'select',
      options: [
        { label: { vi: 'Xuất sắc', en: 'Excellent' }, value: 'Excellent' },
        { label: { vi: 'Giỏi', en: 'Very good' }, value: 'Very good' },
        { label: { vi: 'Khá', en: 'Good' }, value: 'Good' },
        { label: { vi: 'Trung bình', en: 'Average' }, value: 'Average' },
      ],
    },
  ],
}
