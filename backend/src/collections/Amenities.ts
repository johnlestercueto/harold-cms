import type { CollectionConfig } from 'payload'

import { canReadActive, isStaff } from '../access'
import { slugField } from '../fields/slug'

export const Amenities: CollectionConfig = {
  slug: 'amenities',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'active', 'icon'],
  },
  access: {
    read: canReadActive,
    create: isStaff,
    update: isStaff,
    delete: isStaff,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    slugField(),
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'icon',
      type: 'text',
      admin: {
        description: 'Optional icon key or emoji used by the frontend.',
      },
    },
    {
      name: 'active',
      type: 'checkbox',
      defaultValue: true,
    },
  ],
}
