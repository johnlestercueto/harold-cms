import type { CollectionConfig } from 'payload'

import { canReadActive, isStaff } from '../access'

export const GcashAccounts: CollectionConfig = {
  slug: 'gcash-accounts',
  admin: {
    useAsTitle: 'accountName',
    defaultColumns: ['accountName', 'accountNumber', 'active', 'updatedAt'],
    description: 'GCash account details shown on the booking page.',
  },
  access: {
    read: canReadActive,
    create: isStaff,
    update: isStaff,
    delete: isStaff,
  },
  fields: [
    {
      name: 'accountName',
      type: 'text',
      required: true,
    },
    {
      name: 'accountNumber',
      type: 'text',
      required: true,
    },
    {
      name: 'instructions',
      type: 'textarea',
      required: true,
      defaultValue:
        'Send your payment to the GCash account below, then enter the reference number from your completed transaction.',
    },
    {
      name: 'active',
      type: 'checkbox',
      defaultValue: true,
    },
  ],
}
