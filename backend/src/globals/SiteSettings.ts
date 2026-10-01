import type { GlobalConfig } from 'payload'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Site Settings',
  access: {
    read: () => true,
    update: ({ req: { user } }) =>
      Boolean(
        user &&
        ((user as { role?: string }).role === 'admin' ||
          (user as { role?: string }).role === 'staff'),
      ),
  },
  fields: [
    {
      name: 'siteName',
      type: 'text',
      required: true,
      defaultValue: 'Calapan Transient Houses',
    },
    {
      name: 'tagline',
      type: 'text',
    },
    {
      name: 'logo',
      type: 'relationship',
      relationTo: 'media',
    },
    {
      name: 'favicon',
      type: 'relationship',
      relationTo: 'media',
    },
    {
      name: 'contactNumber',
      type: 'text',
    },
    {
      name: 'email',
      type: 'email',
    },
    {
      name: 'facebookUrl',
      type: 'text',
    },
    {
      name: 'messengerUrl',
      type: 'text',
    },
    {
      name: 'address',
      type: 'textarea',
    },
    {
      name: 'city',
      type: 'text',
    },
    {
      name: 'province',
      type: 'text',
    },
    {
      name: 'openingHours',
      type: 'text',
    },
    {
      name: 'defaultCurrency',
      type: 'text',
      defaultValue: 'PHP',
    },
    {
      name: 'defaultCheckInTime',
      type: 'text',
      defaultValue: '14:00',
    },
    {
      name: 'defaultCheckOutTime',
      type: 'text',
      defaultValue: '12:00',
    },
  ],
}
