import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { z } from 'zod'
import { todos } from '#/db/schema/todo-schema'

export const insertTodoSchema = createInsertSchema(todos, {
  title: (schema) => schema.min(1, 'Title is required'),
})

export const selectTodoSchema = createSelectSchema(todos)

// Common partial schemas for mutations
export const createTodoSchema = insertTodoSchema.pick({ title: true })
export const updateTodoSchema = insertTodoSchema.partial({ title: true, isDone: true }).refine(({title, isDone}) => {
  if (!title && !isDone) {
    return false
  }
  return true
}, {
  message: 'At least one field must be provided',
})

// Data table params validation
export const fetchTodosSchema = z.object({
  pagination: z.object({
    pageIndex: z.number().int().min(0),
    pageSize: z.number().int().min(1).max(100),
  }),
  sorting: z.array(
    z.object({
      id: z.string(),
      desc: z.boolean(),
    })
  ),
  search: z.string().optional(),
})
