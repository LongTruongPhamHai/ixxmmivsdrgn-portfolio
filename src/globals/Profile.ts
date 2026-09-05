import type { GlobalConfig } from 'payload'

export const Profile: GlobalConfig = {
  slug: 'profile',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'avatar',
      label: 'Ảnh đại diện',
      type: 'upload',
      relationTo: 'media',
      required: false,
    },
    {
      name: 'fullName',
      label: 'Họ và tên',
      type: 'text',
      required: false,
      localized: true,
    },
    {
      name: 'dateOfBirth',
      label: 'Ngày sinh',
      type: 'date',
      required: false,
    },
    {
      name: 'address',
      label: 'Địa chỉ',
      type: 'text',
      required: false,
      localized: true,
    },
    {
      name: 'phone',
      label: 'Số điện thoại',
      type: 'text',
      required: false,
    },
    {
      name: 'email',
      label: 'Email',
      type: 'email',
      required: false,
    },
    {
      name: 'objective',
      label: 'Mục tiêu nghề nghiệp / Giới thiệu',
      type: 'textarea',
      required: true,
      localized: true,
    },
  ],
}
