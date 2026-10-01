import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Amenities } from './collections/Amenities'
import { Announcements } from './collections/Announcements'
import { Bookings } from './collections/Bookings'
import { Customers } from './collections/Customers'
import { FAQs } from './collections/FAQs'
import { GcashAccounts } from './collections/GcashAccounts'
import { Media } from './collections/Media'
import { TransientHouses } from './collections/TransientHouses'
import { Users } from './collections/Users'
import { SiteSettings } from './globals/SiteSettings'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [
    Users,
    Media,
    Amenities,
    TransientHouses,
    Customers,
    Bookings,
    FAQs,
    Announcements,
    GcashAccounts,
  ],
  globals: [SiteSettings],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: sqliteAdapter({
    client: {
      url: process.env.DATABASE_URL || '',
    },
    migrationDir: path.resolve(dirname, 'migrations'),
  }),
  sharp,
  plugins: [],
})
