import type { CollectionConfig } from 'payload'

import { isAdmin, isStaff } from '../access'

export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  endpoints: [
    {
      path: '/register',
      method: 'post',
      handler: async (req) => {
        try {
          if (!req.json) {
            return Response.json({ error: 'Request body is required.' }, { status: 400 })
          }

          const body = await req.json()

          if (!body || typeof body !== 'object') {
            return Response.json({ error: 'Request body must be a JSON object.' }, { status: 400 })
          }

          const { email, password, firstName, lastName, phone } = body as Record<string, unknown>

          const user = await req.payload.create({
            collection: 'users',
            data: {
              email: String(email ?? ''),
              password: String(password ?? ''),
              firstName: String(firstName ?? ''),
              lastName: String(lastName ?? ''),
              ...(phone ? { phone: String(phone) } : {}),
              role: 'customer',
            },
            overrideAccess: true,
          })

          return Response.json({ user }, { status: 201 })
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Unable to create account.'

          return Response.json({ error: message }, { status: 400 })
        }
      },
    },
  ],
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'role', 'firstName', 'lastName'],
  },
  access: {
    read: isStaff,
    create: () => true,
    update: isAdmin,
    delete: isAdmin,
  },
  hooks: {
    beforeValidate: [
      ({ data, req }) => {
        const requesterRole = (req.user as { role?: string } | null | undefined)?.role
        const canAssignPrivilegedRole = requesterRole === 'admin' || requesterRole === 'staff'

        return {
          ...data,
          role: canAssignPrivilegedRole && data?.role ? data.role : 'customer',
        }
      },
    ],
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
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'customer',
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Staff', value: 'staff' },
        { label: 'Customer', value: 'customer' },
      ],
    },
    {
      name: 'phone',
      type: 'text',
      validate: (value: unknown) => {
        if (!value || String(value).trim().length === 0) {
          return true
        }

        return /^(\+63|0)\d{10,11}$/.test(String(value).replace(/\s+/g, ''))
          ? true
          : 'Phone number is not valid.'
      },
    },
    {
      name: 'avatar',
      type: 'relationship',
      relationTo: 'media',
    },
  ],
}
