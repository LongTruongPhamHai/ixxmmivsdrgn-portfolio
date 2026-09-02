import type { GlobalConfig } from 'payload'

export const Profile: GlobalConfig = {
  slug: 'profile',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'objective',
      label: 'Mục tiêu nghề nghiệp / Giới thiệu',
      type: 'textarea',
      required: true,
    },
  ],
}
