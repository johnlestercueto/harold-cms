import type { CollectionConfig } from 'payload'

import { canReadActive, isStaff } from '../access'

export const FAQs: CollectionConfig = {
  slug: 'faqs',
  admin: {
    useAsTitle: 'question',
    defaultColumns: ['question', 'category', 'order', 'active'],
  },
  access: {
    read: canReadActive,
    create: isStaff,
    update: isStaff,
    delete: isStaff,
  },
  fields: [
    {
      name: 'question',
      type: 'text',
      required: true,
    },
    {
      name: 'answer',
      type: 'textarea',
      required: true,
    },
    {
      name: 'category',
      type: 'text',
      required: true,
      defaultValue: 'general',
    },
    {
      name: 'order',
      type: 'number',
      min: 0,
      defaultValue: 0,
    },
    {
      name: 'active',
      type: 'checkbox',
      defaultValue: true,
    },
  ],
}
