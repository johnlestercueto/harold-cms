import type { Access } from 'payload'

export const canReadPublished: Access = ({ req: { user } }) => {
  const role = (user as { role?: string } | null | undefined)?.role

  if (user && (role === 'admin' || role === 'staff')) {
    return true
  }

  return {
    status: {
      equals: 'published',
    },
  }
}

export const canReadActive: Access = ({ req: { user } }) => {
  const role = (user as { role?: string } | null | undefined)?.role

  if (user && (role === 'admin' || role === 'staff')) {
    return true
  }

  return {
    active: {
      equals: true,
    },
  }
}
