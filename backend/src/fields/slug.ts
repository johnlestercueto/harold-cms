import type { Field } from 'payload'

export const slugField = (): Field => ({
  name: 'slug',
  type: 'text',
  index: true,
  unique: true,
  required: true,
  admin: {
    position: 'sidebar',
  },
  hooks: {
    beforeValidate: [
      ({ value, data, operation }) => {
        if (operation === 'create' || operation === 'update') {
          const sourceValue = data?.name ?? ''

          if (typeof value === 'string' && value.trim().length > 0) {
            return value.trim()
          }

          if (typeof sourceValue === 'string' && sourceValue.trim().length > 0) {
            return sourceValue
              .toLowerCase()
              .trim()
              .replace(/[^a-z0-9\s-]/g, '')
              .replace(/\s+/g, '-')
              .replace(/-+/g, '-')
          }
        }

        return value
      },
    ],
  },
})
