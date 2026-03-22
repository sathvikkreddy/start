import 'dotenv/config'
import { drizzle } from 'drizzle-orm/node-postgres'
import { todos } from './schema/todo-schema.ts'

async function seed() {
  const db = drizzle(process.env.DATABASE_URL!)

  console.log('🌱 Seeding database...')

  // Insert sample todos
  await db.insert(todos).values([
    { title: 'Learn TanStack Start' },
    { title: 'Build a feature module' },
    { title: 'Write drizzle-zod validators' },
    { title: 'Add ESLint server-import rules' },
  ])

  console.log('✅ Seeding complete!')
  process.exit(0)
}

seed().catch((err) => {
  console.error('❌ Seeding failed:', err)
  process.exit(1)
})
