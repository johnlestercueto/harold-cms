import { getPayload, Payload } from 'payload'
import config from '@/payload.config'
import { Bookings } from '@/collections/Bookings'

import { describe, it, beforeAll, expect } from 'vitest'

let payload: Payload

describe('API', () => {
  beforeAll(async () => {
    const payloadConfig = await config
    payload = await getPayload({ config: payloadConfig })
  })

  it('fetches users', async () => {
    const users = await payload.find({
      collection: 'users',
    })
    expect(users).toBeDefined()
  })

  it('strips the GCash reference number for cash bookings before validation', async () => {
    const hook = Bookings.hooks?.beforeValidate?.[0] as (args: any) => Promise<any>

    const checkIn = new Date(Date.now() + 86400000)
    const checkOut = new Date(checkIn.getTime() + 86400000 * 2)

    const result = await hook({
      data: {
        transientHouse: 1,
        customer: 2,
        checkIn: checkIn.toISOString(),
        checkOut: checkOut.toISOString(),
        guests: 1,
        paymentMethod: 'cash',
        gcashReferenceNumber: 'unused-reference',
        additionalFees: 0,
      },
      req: {
        payload: {
          findByID: async () => ({
            status: 'published',
            available: true,
            capacity: 2,
            pricePerNight: 1500,
          }),
          find: async () => ({ totalDocs: 0 }),
        },
      },
      operation: 'create',
    })

    expect(result.paymentMethod).toBe('cash')
    expect(result.gcashReferenceNumber).toBeUndefined()
    expect(result.totalAmount).toBe(3000)
  })
})
