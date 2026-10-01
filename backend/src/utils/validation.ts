export const normalizeSlug = (value: string): string =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')

export const isValidEmail = (value?: string | null): boolean => {
  if (!value) {
    return false
  }

  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
}

export const isValidPhone = (value?: string | null): boolean => {
  if (!value) {
    return false
  }

  const cleaned = value.replace(/[\s()+-]/g, '')

  return /^\d{10,15}$/.test(cleaned)
}

export const isNonNegativeNumber = (value: unknown): boolean => {
  if (typeof value === 'number') {
    return Number.isFinite(value) && value >= 0
  }

  if (typeof value === 'string') {
    const parsed = Number(value)
    return Number.isFinite(parsed) && parsed >= 0
  }

  return false
}

export const getNumberValue = (value: unknown): number => {
  if (typeof value === 'number') {
    return value
  }

  if (typeof value === 'string' && value.trim().length > 0) {
    return Number(value)
  }

  return 0
}
