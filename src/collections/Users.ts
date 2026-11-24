import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  labels: {
    singular: { vi: 'Người dùng', en: 'User' },
    plural: { vi: 'Người dùng', en: 'Users' },
  },
  admin: {
    useAsTitle: 'email',
  },
  // useAPIKey: generate a key under Users → your account, for the Android app
  auth: { useAPIKey: true },
  fields: [
    // Email added by default
    // Add more fields as needed
  ],
}
