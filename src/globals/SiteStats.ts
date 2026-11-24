import type { GlobalConfig } from 'payload'

/** Site-wide counters. Visits are incremented atomically by /api/visits (see src/endpoints/visits.ts). */
export const SiteStats: GlobalConfig = {
  slug: 'site-stats',
  label: { vi: 'Thống kê trang', en: 'Site stats' },
  admin: { group: { vi: 'Thống kê', en: 'Stats' } },
  access: {
    read: () => true,
    // only admins can edit by hand (e.g. reset); visitors go through the endpoint
    update: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    {
      name: 'visits',
      label: { vi: 'Lượt truy cập', en: 'Visits' },
      type: 'number',
      defaultValue: 0,
      min: 0,
      admin: {
        description: {
          vi: 'Mỗi phiên trình duyệt tính 1 lượt (bot không được tính).',
          en: 'One per browser session (bots are not counted).',
        },
      },
    },
  ],
}
