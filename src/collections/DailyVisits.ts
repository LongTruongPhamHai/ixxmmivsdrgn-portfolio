import type { CollectionConfig } from 'payload'

/** One row per day (Vietnam time): visits counted that day. Filled by /api/visits. */
export const DailyVisits: CollectionConfig = {
  slug: 'daily-visits',
  labels: {
    singular: { vi: 'Lượt truy cập theo ngày', en: 'Daily visits' },
    plural: { vi: 'Lượt truy cập theo ngày', en: 'Daily visits' },
  },
  admin: {
    useAsTitle: 'date',
    defaultColumns: ['date', 'visits'],
    group: { vi: 'Thống kê', en: 'Stats' },
  },
  defaultSort: '-date',
  access: {
    read: () => true,
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    {
      name: 'date',
      label: { vi: 'Ngày (YYYY-MM-DD)', en: 'Date (YYYY-MM-DD)' },
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
