import type { CollectionConfig } from 'payload'
import { slugField } from '../fields/slug'

/** Tag = the *topic* of a post (gia đình, động lực, lập trình...). A post can have many. */
export const Tags: CollectionConfig = {
  slug: 'tags',
  labels: { singular: 'Thẻ', plural: 'Thẻ' },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug'],
    group: 'Blog',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'name',
      label: 'Tên thẻ',
      type: 'text',
      required: true,
    },
    slugField('name'),
  ],
}
