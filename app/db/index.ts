import { createClient } from '@libsql/client/web'
import 'dotenv/config'
import { drizzle } from 'drizzle-orm/libsql/web'

const client = createClient({
  url: process.env.DATABASE_URL || '',
  authToken: process.env.DATABASE_AUTH_TOKEN,
})

export const db = drizzle({ client })
