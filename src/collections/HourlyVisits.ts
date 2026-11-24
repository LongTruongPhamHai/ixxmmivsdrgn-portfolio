import type { CollectionConfig } from 'payload'

/** One row per hour (Vietnam time, "YYYY-MM-DDTHH"): visits counted in that hour. Filled by /api/visits. */
export const HourlyVisits: CollectionConfig = {
  slug: 'hourly-visits',
  labels: {
    singular: { vi: 'Lượt truy cập theo giờ', en: 'Hourly visits' },
    plural: { vi: 'Lượt truy cập theo giờ', en: 'Hourly visits' },
  },
  admin: {
    useAsTitle: 'hour',
    defaultColumns: ['hour', 'visits'],
    group: { vi: 'Thống kê', en: 'Stats' },
  },
  defaultSort: '-hour',
  access: {
    read: () => true,
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    {
      name: 'hour',
      label: { vi: 'Giờ (YYYY-MM-DDTHH)', en: 'Hour (YYYY-MM-DDTHH)' },
      type: 'text',
      required: true,
      unique: true,
      index: true,
    },
    {
      name: 'visits',
      label: { vi: 'Lượt truy cập', en: 'Visits' },
      type: 'number',
      defaultValue: 0,
      min: 0,
    },
  ],
}
