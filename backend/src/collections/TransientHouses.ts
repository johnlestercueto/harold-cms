import type { CollectionConfig } from 'payload'

import { canReadPublished, isStaff } from '../access'
import { addressFields } from '../fields/address'
import { slugField } from '../fields/slug'
import { isNonNegativeNumber, isValidPhone } from '../utils/validation'

export const TransientHouses: CollectionConfig = {
  slug: 'transient-houses',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'status', 'featured', 'available', 'pricePerNight'],
  },
  access: {
    read: canReadPublished,
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
      required: true,
    },
    {
      name: 'shortDescription',
      type: 'text',
      maxLength: 180,
    },
    {
      name: 'featuredImage',
      type: 'relationship',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'gallery',
      type: 'relationship',
      relationTo: 'media',
      hasMany: true,
    },
    {
      name: 'pricePerNight',
      type: 'number',
      required: true,
      min: 0,
      validate: (value: unknown) =>
        isNonNegativeNumber(value) ? true : 'Price must be zero or greater.',
    },
    {
      name: 'weekendPrice',
      type: 'number',
      min: 0,
      validate: (value: unknown) =>
        isNonNegativeNumber(value) ? true : 'Weekend price must be zero or greater.',
    },
    {
      name: 'capacity',
      type: 'number',
      required: true,
      min: 1,
    },
    {
      name: 'bedrooms',
      type: 'number',
      min: 0,
    },
    {
      name: 'beds',
      type: 'number',
      min: 0,
    },
    {
      name: 'bathrooms',
      type: 'number',
      min: 0,
    },
    {
      name: 'houseType',
      type: 'select',
      required: true,
      options: [
        { label: 'Entire House', value: 'entire-house' },
        { label: 'Apartment', value: 'apartment' },
        { label: 'Room', value: 'room' },
        { label: 'Studio', value: 'studio' },
        { label: 'Other', value: 'other' },
      ],
    },
    {
      name: 'amenities',
      type: 'relationship',
      relationTo: 'amenities',
      hasMany: true,
    },
    ...addressFields,
    {
      name: 'contactNumber',
      type: 'text',
      required: true,
      validate: (value: unknown) =>
        value && isValidPhone(String(value))
          ? true
          : 'Contact number must be a valid Philippine mobile or landline number.',
    },
    {
      name: 'checkInTime',
      type: 'text',
      defaultValue: '14:00',
    },
    {
      name: 'checkOutTime',
      type: 'text',
      defaultValue: '12:00',
    },
    {
      name: 'minimumStay',
      type: 'number',
      min: 1,
      defaultValue: 1,
    },
    {
      name: 'maximumGuests',
      type: 'number',
      min: 1,
      defaultValue: 1,
    },
    {
      name: 'available',
      type: 'checkbox',
      defaultValue: true,
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'draft',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
        { label: 'Unavailable', value: 'unavailable' },
      ],
    },
  ],
  hooks: {
    beforeValidate: [
      async ({ data, originalDoc, operation, req }) => {
        if (operation === 'create' || operation === 'update') {
          const values = data ?? {}

          if (
            operation === 'update' &&
            (values.status === 'unavailable' || values.available === false)
          ) {
            const activeBookings = await req.payload.find({
              collection: 'bookings',
              where: {
                and: [
                  { transientHouse: { equals: originalDoc?.id } },
                  { status: { in: ['pending', 'confirmed'] } },
                ],
              },
              limit: 1,
            })

            if (activeBookings.totalDocs > 0) {
              throw new Error(
                'This house has an active booking. Mark the booking completed or cancelled before setting it unavailable.',
              )
            }
          }

          if (typeof values.maximumGuests === 'number' && typeof values.capacity === 'number') {
            if (values.maximumGuests > values.capacity) {
              return { ...data, maximumGuests: values.capacity }
            }
          }
        }

        return data
      },
    ],
  },
}
