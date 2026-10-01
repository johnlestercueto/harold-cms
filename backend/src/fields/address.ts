import type { Field } from 'payload'

export const addressFields: Field[] = [
  {
    name: 'address',
    type: 'text',
    required: true,
  },
  {
    name: 'barangay',
    type: 'text',
    required: true,
  },
  {
    name: 'city',
    type: 'text',
    required: true,
  },
  {
    name: 'province',
    type: 'text',
    required: true,
  },
  {
    name: 'latitude',
    type: 'number',
    min: -90,
    max: 90,
  },
  {
    name: 'longitude',
    type: 'number',
    min: -180,
    max: 180,
  },
]
