import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { todos } from '#/db/schema/todo-schema'

export const insertTodoSchema = createInsertSchema(todos, {
  title: (schema) => schema.min(1, 'Title is required'),
})

export const selectTodoSchema = createSelectSchema(todos)

// Common partial schemas for mutations
export const createTodoSchema = insertTodoSchema.pick({ title: true })
