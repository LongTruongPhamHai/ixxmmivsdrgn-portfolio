import { CollectionConfig } from 'payload'

export const Experience: CollectionConfig = {
  slug: 'experience',
  labels: {
    singular: { vi: 'Kinh nghiệm', en: 'Experience' },
    plural: { vi: 'Kinh nghiệm làm việc', en: 'Work experience' },
  },
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
      label: { vi: 'Tên công ty / Tổ chức', en: 'Company / Organization' },
      type: 'text',
      required: true,
    },
    {
      name: 'url',
      label: { vi: 'Website công ty', en: 'Company website' },
      type: 'text',
    },
    {
      name: 'role',
      label: { vi: 'Vị trí công tác', en: 'Role' },
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
          label: {
            vi: 'Ngày kết thúc (để trống nếu đang làm)',
            en: 'End date (leave empty if current)',
          },
          type: 'date',
          admin: { date: { pickerAppearance: 'monthOnly' } },
        },
      ],
    },
    {
      name: 'projects',
      label: { vi: 'Các dự án đóng góp', en: 'Contributed projects' },
      type: 'array',
      fields: [
        {
          name: 'projectName',
          label: { vi: 'Tên dự án', en: 'Project name' },
          type: 'text',
          required: true,
          localized: true,
        },
        {
          name: 'url',
          label: { vi: 'Đường dẫn dự án', en: 'Project URL' },
          type: 'text',
        },
        {
          name: 'projectRole',
          label: { vi: 'Vị trí trong dự án', en: 'Role in project' },
          type: 'text',
          localized: true,
        },
        {
          name: 'description',
          label: { vi: 'Mô tả đóng góp', en: 'Contribution' },
          type: 'textarea',
          localized: true,
        },
      ],
    },
  ],
}
