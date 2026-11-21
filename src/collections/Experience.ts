import { CollectionConfig } from 'payload'

export const Experience: CollectionConfig = {
  slug: 'experience',
  admin: {
    useAsTitle: 'company',
    defaultColumns: ['company', 'role', 'startDate', 'endDate'],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'company',
      label: 'Tên công ty / Tổ chức',
      type: 'text',
      required: true,
    },
    {
      name: 'url',
      label: 'Website Công Ty',
      type: 'text',
    },
    {
      name: 'role',
      label: 'Vị trí công tác',
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
          label: 'Ngày kết thúc (Để trống nếu đang làm)',
          type: 'date',
          admin: { date: { pickerAppearance: 'monthOnly' } },
        },
      ],
    },
    {
      name: 'projects',
      label: 'Các dự án đóng góp',
      type: 'array',
      fields: [
        {
          name: 'projectName',
          label: 'Tên dự án',
          type: 'text',
          required: true,
          localized: true,
        },
        {
          name: 'url',
          label: 'Đường dẫn dự án (URL)',
          type: 'text',
        },
        {
          name: 'projectRole',
          label: 'Vị trí trong dự án',
          type: 'text',
          localized: true,
        },
        {
          name: 'description',
          label: 'Mô tả đóng góp',
          type: 'textarea',
          localized: true,
        },
      ],
    },
  ],
}
