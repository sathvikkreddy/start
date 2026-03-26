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

// Route search params — used in validateSearch for URL persistence
// z.coerce.number() is required because URL search params are always strings
export const todosSearchSchema = z.object({
  page: z.coerce.number().int().min(0).optional().catch(undefined),
  size: z.coerce.number().int().positive().optional().catch(undefined),
  sort: z.string().optional().catch(undefined),
  search: z.string().optional().catch(undefined),
})

// Data table params validation — used for server function input
export const fetchTodosSchema = z.object({
  pagination: z.object({
    pageIndex: z.number().int().min(0),
    pageSize: z.number().int().min(1).max(100),
  }).default({pageIndex: 0, pageSize: 10}),
  sorting: z.array(
    z.object({
      id: z.string(),
      desc: z.boolean(),
    })
  ).default([]),
  search: z.string().optional(),
})
