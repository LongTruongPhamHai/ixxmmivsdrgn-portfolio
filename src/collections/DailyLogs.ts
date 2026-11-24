import type { CollectionConfig } from 'payload'
import { loggedIn, validateDay } from './Tasks'

/** One record per calendar day: timestamped log entries + end-of-day review */
export const DailyLogs: CollectionConfig = {
  slug: 'daily-logs',
  labels: {
    singular: { vi: 'Nhật ký ngày', en: 'Daily log' },
    plural: { vi: 'Nhật ký ngày', en: 'Daily logs' },
  },
  admin: {
    useAsTitle: 'date',
    defaultColumns: ['date', 'review.energy', 'updatedAt'],
    group: { vi: 'Nhật ký', en: 'Daily log' },
  },
  access: {
    read: loggedIn,
    create: loggedIn,
    update: loggedIn,
    delete: loggedIn,
  },
  defaultSort: '-date',
  fields: [
    {
      name: 'date',
      label: { vi: 'Ngày (YYYY-MM-DD)', en: 'Date (YYYY-MM-DD)' },
      type: 'text',
      required: true,
      unique: true,
      index: true,
      validate: validateDay,
    },
    {
      name: 'entries',
      label: { vi: 'Ghi chép trong ngày', en: 'Log entries' },
      type: 'array',
      labels: {
        singular: { vi: 'Dòng ghi chép', en: 'Entry' },
        plural: { vi: 'Ghi chép', en: 'Entries' },
      },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'time',
              label: { vi: 'Giờ (HH:mm)', en: 'Time (HH:mm)' },
              type: 'text',
              admin: { width: '20%' },
            },
            {
              name: 'text',
              label: { vi: 'Nội dung', en: 'Text' },
              type: 'textarea',
              required: true,
              admin: { width: '80%' },
            },
          ],
        },
      ],
    },
    {
      name: 'review',
      label: { vi: 'Review cuối ngày', en: 'End-of-day review' },
      type: 'group',
      fields: [
        { name: 'wins', label: { vi: 'Làm được', en: 'Wins' }, type: 'textarea' },
        { name: 'blockers', label: { vi: 'Vướng mắc', en: 'Blockers' }, type: 'textarea' },
        { name: 'lessons', label: { vi: 'Bài học', en: 'Lessons' }, type: 'textarea' },
        {
          name: 'tomorrow',
          label: { vi: 'Kế hoạch ngày mai', en: 'Plan for tomorrow' },
          type: 'textarea',
        },
        {
          name: 'energy',
          label: { vi: 'Năng lượng (1–5)', en: 'Energy (1–5)' },
          type: 'number',
          min: 1,
          max: 5,
        },
      ],
    },
    {
      name: 'rolledOverAt',
      label: { vi: 'Đã dời việc lúc', en: 'Tasks rolled over at' },
      type: 'date',
      admin: {
        readOnly: true,
        position: 'sidebar',
        description: {
          vi: 'Đánh dấu việc chưa xong của các ngày trước đã được dời sang ngày này (chỉ chạy 1 lần/ngày).',
          en: 'Unfinished tasks from earlier days were moved to this day (runs once per day).',
        },
      },
    },
  ],
}
