import type { Access } from 'payload'

export const isAdmin: Access = ({ req: { user } }) => {
  const role = (user as { role?: string } | null | undefined)?.role

  return Boolean(user && role === 'admin')
}
