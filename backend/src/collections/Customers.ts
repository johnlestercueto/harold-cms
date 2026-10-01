import type { Access, CollectionConfig } from 'payload'

import { isStaff } from '../access'
import { isValidEmail, isValidPhone } from '../utils/validation'

const canReadOwnCustomer: Access = ({ req }) => {
  const user = req.user as { role?: string; email?: string } | null | undefined

  if (!user) return false
  if (user.role === 'admin' || user.role === 'staff') return true
  if (!user.email) return false

  return { email: { equals: user.email } }
}

export const Customers: CollectionConfig = {
  slug: 'customers',
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['firstName', 'lastName', 'email', 'phone'],
  },
  access: {
    read: canReadOwnCustomer,
    create: () => true,
    update: isStaff,
    delete: isStaff,
  },
  fields: [
    {
      name: 'firstName',
      type: 'text',
      required: true,
    },
    {
      name: 'lastName',
      type: 'text',
      required: true,
    },
    {
      name: 'email',
      type: 'email',
      required: true,
      unique: true,
      validate: (value: unknown) =>
        value && isValidEmail(String(value)) ? true : 'Enter a valid email address.',
    },
    {
      name: 'phone',
      type: 'text',
      required: true,
      validate: (value: unknown) =>
        value && isValidPhone(String(value))
          ? true
          : 'Phone number must be valid and include at least 10 digits.',
    },
    {
      name: 'address',
      type: 'textarea',
    },
    {
      name: 'notes',
      type: 'textarea',
    },
  ],
}
