import type { Access, CollectionBeforeChangeHook, CollectionConfig, Validate } from 'payload'
import { DAY_RE, todayVN } from '../lib/date'

/** Daily log data is private: only logged-in users (you) can read or write it */
export const loggedIn: Access = ({ req: { user } }) => Boolean(user)

export const validateDay: Validate = (value) =>
  value == null || value === '' || (typeof value === 'string' && DAY_RE.test(value))
    ? true
    : 'Định dạng YYYY-MM-DD / Format YYYY-MM-DD'

/**
 * - New task: plannedFor defaults to today (VN), originalDate = plannedFor
 * - Marking done sets completedAt; un-marking clears it
 */
const beforeChange: CollectionBeforeChangeHook = ({ data, operation, originalDoc }) => {
  if (operation === 'create') {
    data.plannedFor ||= todayVN()
    data.originalDate ||= data.plannedFor
    data.carryCount ??= 0
  }
  const status = data.status ?? originalDoc?.status
  if (status === 'done') {
    data.completedAt ||= originalDoc?.completedAt || new Date().toISOString()
  } else if (data.status !== undefined) {
    data.completedAt = null
  }
  return data
}

export const Tasks: CollectionConfig = {
  slug: 'tasks',
  labels: {
    singular: { vi: 'Việc cần làm', en: 'Task' },
    plural: { vi: 'Việc cần làm', en: 'Tasks' },
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'status', 'plannedFor', 'carryCount', 'priority'],
    group: { vi: 'Nhật ký', en: 'Daily log' },
  },
  access: {
    read: loggedIn,
    create: loggedIn,
    update: loggedIn,
    delete: loggedIn,
  },
  hooks: { beforeChange: [beforeChange] },
  defaultSort: 'order',
  fields: [
    {
      name: 'title',
      label: { vi: 'Việc cần làm', en: 'Task' },
      type: 'text',
      required: true,
    },
    {
      name: 'notes',
      label: { vi: 'Ghi chú', en: 'Notes' },
      type: 'textarea',
    },
    {
      type: 'row',
      fields: [
        {
          name: 'status',
          label: { vi: 'Trạng thái', en: 'Status' },
          type: 'select',
          required: true,
          defaultValue: 'todo',
          index: true,
          options: [
            { label: { vi: 'Cần làm', en: 'To do' }, value: 'todo' },
            { label: { vi: 'Đang làm', en: 'In progress' }, value: 'doing' },
            { label: { vi: 'Xong', en: 'Done' }, value: 'done' },
            { label: { vi: 'Bỏ', en: 'Dropped' }, value: 'dropped' },
          ],
        },
        {
          name: 'priority',
          label: { vi: 'Ưu tiên', en: 'Priority' },
          type: 'select',
          defaultValue: 'normal',
          options: [
            { label: { vi: 'Thấp', en: 'Low' }, value: 'low' },
            { label: { vi: 'Thường', en: 'Normal' }, value: 'normal' },
            { label: { vi: 'Cao', en: 'High' }, value: 'high' },
          ],
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'plannedFor',
          label: { vi: 'Ngày dự định (YYYY-MM-DD)', en: 'Planned for (YYYY-MM-DD)' },
          type: 'text',
          index: true,
          validate: validateDay,
          admin: {
            description: {
              vi: 'Việc chưa xong sẽ tự dời sang ngày hôm sau.',
              en: 'Unfinished tasks move to the next day automatically.',
            },
          },
        },
        {
          name: 'originalDate',
          label: { vi: 'Ngày tạo ban đầu', en: 'Originally planned for' },
          type: 'text',
          validate: validateDay,
          admin: { readOnly: true },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'carryCount',
          label: { vi: 'Số lần bị dời', en: 'Times carried over' },
          type: 'number',
          defaultValue: 0,
          admin: { readOnly: true },
        },
        {
          name: 'completedAt',
          label: { vi: 'Hoàn thành lúc', en: 'Completed at' },
          type: 'date',
          admin: { readOnly: true, date: { pickerAppearance: 'dayAndTime' } },
        },
        {
          name: 'order',
          label: { vi: 'Thứ tự', en: 'Order' },
          type: 'number',
          defaultValue: 0,
        },
      ],
    },
  ],
}
