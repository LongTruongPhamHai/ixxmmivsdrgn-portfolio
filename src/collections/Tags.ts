import type { CollectionConfig } from 'payload'
import { slugField } from '../fields/slug'

/** Tag = the *topic* of a post (gia đình, động lực, lập trình...). A post can have many. */
export const Tags: CollectionConfig = {
  slug: 'tags',
  labels: {
    singular: { vi: 'Thẻ', en: 'Tag' },
    plural: { vi: 'Thẻ', en: 'Tags' },
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug'],
    group: { vi: 'Blog', en: 'Blog' },
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'name',
      label: { vi: 'Tên thẻ', en: 'Tag name' },
      type: 'text',
      required: true,
    },
    slugField('name'),
  ],
}
