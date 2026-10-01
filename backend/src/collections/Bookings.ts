import type { Access, CollectionConfig, Validate } from 'payload'

import { isStaff } from '../access'
import { isNonNegativeNumber } from '../utils/validation'

const canReadOwnBooking: Access = async ({ req }) => {
  const user = req.user as { role?: string; email?: string } | null | undefined

  if (!user) return false
  if (user.role === 'admin' || user.role === 'staff') return true
  if (!user.email) return false

  const customerDocs = await req.payload.find({
    collection: 'customers',
    where: {
      email: { equals: user.email },
    },
    limit: 1,
    pagination: false,
  })

  const customerIds = customerDocs.docs.map((doc) => doc.id)

  if (!customerIds.length) return false

  return {
    customer: {
      in: customerIds,
    },
  }
}

export const Bookings: CollectionConfig = {
  slug: 'bookings',
  admin: {
    useAsTitle: 'bookingReference',
    defaultColumns: ['bookingReference', 'status', 'paymentStatus', 'totalAmount', 'checkIn'],
  },
  access: {
    read: canReadOwnBooking,
    create: () => true,
    update: isStaff,
    delete: isStaff,
  },
  fields: [
    {
      name: 'bookingReference',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        readOnly: true,
      },
      hooks: {
        beforeValidate: [
          ({ value, operation }) => {
            if (operation === 'create' && (!value || !String(value).trim())) {
              const prefix = 'CTH'
              const timestamp = new Date().toISOString().slice(2, 10).replace(/-/g, '')
              const random = Math.random().toString(36).slice(2, 7).toUpperCase()
              return `${prefix}-${timestamp}-${random}`
            }

            return value
          },
        ],
      },
    },
    {
      name: 'transientHouse',
      type: 'relationship',
      relationTo: 'transient-houses',
      required: true,
    },
    {
      name: 'customer',
      type: 'relationship',
      relationTo: 'customers',
      required: true,
    },
    {
      name: 'checkIn',
      type: 'date',
      required: true,
      admin: {
        date: {
          pickerAppearance: 'dayOnly',
        },
      },
    },
    {
      name: 'checkOut',
      type: 'date',
      required: true,
      admin: {
        date: {
          pickerAppearance: 'dayOnly',
        },
      },
    },
    {
      name: 'guests',
      type: 'number',
      required: true,
      min: 1,
    },
    {
      name: 'numberOfNights',
      type: 'number',
      min: 1,
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'pricePerNight',
      type: 'number',
      required: true,
      min: 0,
      admin: {
        readOnly: true,
      },
      validate: (value: unknown) =>
        isNonNegativeNumber(value) ? true : 'Price per night must be zero or greater.',
    },
    {
      name: 'subtotal',
      type: 'number',
      min: 0,
      admin: {
        readOnly: true,
      },
      validate: (value: unknown) =>
        isNonNegativeNumber(value) ? true : 'Subtotal must be zero or greater.',
    },
    {
      name: 'additionalFees',
      type: 'number',
      min: 0,
      defaultValue: 0,
      validate: (value: unknown) =>
        isNonNegativeNumber(value) ? true : 'Additional fees must be zero or greater.',
    },
    {
      name: 'totalAmount',
      type: 'number',
      required: true,
      min: 0,
      admin: {
        readOnly: true,
      },
      validate: (value: unknown) =>
        isNonNegativeNumber(value) ? true : 'Total amount must be zero or greater.',
    },
    {
      name: 'specialRequest',
      type: 'textarea',
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'pending',
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Confirmed', value: 'confirmed' },
        { label: 'Cancelled', value: 'cancelled' },
        { label: 'Completed', value: 'completed' },
      ],
    },
    {
      name: 'paymentStatus',
      type: 'select',
      required: true,
      defaultValue: 'unpaid',
      options: [
        { label: 'Unpaid', value: 'unpaid' },
        { label: 'Pending', value: 'pending' },
        { label: 'Paid', value: 'paid' },
        { label: 'Refunded', value: 'refunded' },
      ],
    },
    {
      name: 'paymentMethod',
      type: 'select',
      required: true,
      options: [
        { label: 'Cash', value: 'cash' },
        { label: 'Gcash', value: 'gcash' },
      ],
    },
    {
      name: 'gcashReferenceNumber',
      type: 'text',
      admin: {
        condition: (_, siblingData) => siblingData?.paymentMethod === 'gcash',
        description: 'Required when the payment method is GCash.',
      },
      validate: ((value, { siblingData }) => {
        if (siblingData?.paymentMethod === 'gcash' && !value) {
          return 'A GCash reference number is required.'
        }

        return true
      }) as Validate,
    },
  ],
  hooks: {
    beforeValidate: [
      async ({ data, req, operation }) => {
        if (!data) return data

        if (data.paymentMethod !== 'gcash') {
          delete data.gcashReferenceNumber
        } else if (
          typeof data.gcashReferenceNumber === 'string' &&
          data.gcashReferenceNumber.trim() === ''
        ) {
          data.gcashReferenceNumber = undefined
        }

        const checkIn = data.checkIn ? new Date(String(data.checkIn)) : null
        const checkOut = data.checkOut ? new Date(String(data.checkOut)) : null

        if (!checkIn || !checkOut) {
          throw new Error('Both check-in and check-out dates are required.')
        }

        if (checkOut <= checkIn) {
          throw new Error('checkOut must be after checkIn.')
        }

        if (typeof data.guests !== 'number' || Number(data.guests) <= 0) {
          throw new Error('Guests must be at least 1.')
        }

        if (!data.transientHouse) {
          throw new Error('A transient house is required.')
        }

        if (operation === 'create' && !data.customer) {
          throw new Error('Customer is required.')
        }

        const house = await req.payload.findByID({
          collection: 'transient-houses',
          id: data.transientHouse as number | string,
        })

        if (operation === 'create') {
          if (house.status === 'unavailable' || house.available === false) {
            throw new Error('This house is currently unavailable.')
          }

          const overlappingBookings = await req.payload.find({
            collection: 'bookings',
            where: {
              and: [
                { transientHouse: { equals: data.transientHouse } },
                { status: { in: ['pending', 'confirmed'] } },
                { checkIn: { less_than: checkOut.toISOString() } },
                { checkOut: { greater_than: checkIn.toISOString() } },
              ],
            },
            limit: 1,
          })

          if (overlappingBookings.totalDocs > 0) {
            throw new Error('This house is already booked for the selected dates.')
          }
        }

        if (typeof house.capacity === 'number' && Number(data.guests) > Number(house.capacity)) {
          throw new Error('Guests cannot exceed the house capacity.')
        }

        const nights = Math.round((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24))

        if (nights <= 0) {
          throw new Error('The booking duration must be at least one night.')
        }

        const roomPrice = Number(house.pricePerNight ?? 0)
        if (!Number.isFinite(roomPrice) || roomPrice < 0) {
          throw new Error('The chosen house has an invalid price.')
        }

        const additionalFees = Number(data.additionalFees ?? 0)
        const subtotalValue = roomPrice * nights
        const totalValue = subtotalValue + additionalFees

        data.numberOfNights = nights
        data.pricePerNight = roomPrice
        data.subtotal = subtotalValue
        data.totalAmount = totalValue

        if (typeof data.pricePerNight === 'number' && data.pricePerNight < 0) {
          throw new Error('Price per night cannot be negative.')
        }

        if (typeof data.subtotal === 'number' && data.subtotal < 0) {
          throw new Error('Subtotal cannot be negative.')
        }

        if (typeof data.additionalFees === 'number' && data.additionalFees < 0) {
          throw new Error('Additional fees cannot be negative.')
        }

        if (typeof data.totalAmount === 'number' && data.totalAmount < 0) {
          throw new Error('Total amount cannot be negative.')
        }

        return data
      },
    ],
  },
}
