import { drizzle } from 'drizzle-orm/node-postgres'

import * as schema from './schema/schema.ts'

export const db = drizzle(process.env.DATABASE_URL!, { schema })
