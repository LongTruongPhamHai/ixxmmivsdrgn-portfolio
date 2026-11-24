import type { GlobalConfig } from 'payload'

export const Profile: GlobalConfig = {
  slug: 'profile',
  label: { vi: 'Hồ sơ', en: 'Profile' },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'avatar',
      label: { vi: 'Ảnh đại diện', en: 'Avatar' },
      type: 'upload',
      relationTo: 'media',
      required: false,
    },
    {
      name: 'fullName',
      label: { vi: 'Họ và tên', en: 'Full name' },
      type: 'text',
      required: false,
      localized: true,
    },
    {
      name: 'dateOfBirth',
      label: { vi: 'Ngày sinh', en: 'Date of birth' },
      type: 'date',
      required: false,
    },
    {
      name: 'address',
      label: { vi: 'Địa chỉ', en: 'Address' },
      type: 'text',
      required: false,
      localized: true,
    },
    {
      name: 'phone',
      label: { vi: 'Số điện thoại', en: 'Phone' },
      type: 'text',
      required: false,
    },
    {
      name: 'email',
      label: { vi: 'Email', en: 'Email' },
      type: 'email',
      required: false,
    },
    {
      name: 'objective',
      label: { vi: 'Mục tiêu nghề nghiệp / Giới thiệu', en: 'Career objective / About' },
      type: 'textarea',
      required: true,
      localized: true,
    },
  ],
}
