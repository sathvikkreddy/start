import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { z } from 'zod'
import { todos, tags } from '#/db/schema/todo-schema'

// ── Todo schemas (from Drizzle) ────────────────────────────

export const insertTodoSchema = createInsertSchema(todos, {
  title: (schema) => schema.min(1, 'Title is required'),
})

export const selectTodoSchema = createSelectSchema(todos)

// ── Tag schemas (from Drizzle) ─────────────────────────────

export const insertTagSchema = createInsertSchema(tags, {
  name: (schema) => schema.min(1, 'Tag name is required'),
})

export const selectTagSchema = createSelectSchema(tags)

export const createTagSchema = insertTagSchema.pick({ name: true })

// ── Mutation schemas ───────────────────────────────────────

/** Used by the add-todo dialog: title + existing tagIds + inline new tags */
export const createTodoWithTagsSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  tagIds: z.array(z.number()).default([]),
  newTags: z.array(createTagSchema).default([]),
})

export const updateTodoSchema = insertTodoSchema
  .partial({ title: true, isDone: true })
  .refine(
    ({ title, isDone }) => {
      if (!title && !isDone) {
        return false
      }
      return true
    },
    {
      message: 'At least one field must be provided',
    },
  )

// ── Route search params ────────────────────────────────────

export const todosSearchSchema = z
  .object({
    todos_page_index: z.coerce.number().int().min(0).catch(0),
    todos_page_size: z.coerce.number().int().positive().catch(10),
    todos_sort: z.string().catch('updatedAt'),
    todos_sort_desc: z.coerce.boolean().catch(true),
    todos_search: z.string().catch(''),
  })
  .default({
    todos_page_index: 0,
    todos_page_size: 10,
    todos_sort: 'updatedAt',
    todos_sort_desc: true,
    todos_search: '',
  })

export const todosSortableColsSchema = z
  .enum(['title', 'createdAt', 'isDone', 'updatedAt'])
  .catch('updatedAt')

// ── Data table params validation ───────────────────────────

export const fetchTodosSchema = z
  .object({
    pagination: z
      .object({
        pageIndex: z.number().int().min(0).optional().default(0),
        pageSize: z.number().int().min(1).max(100).optional().default(10),
      })
      .default({ pageIndex: 0, pageSize: 10 }),
    sorting: z
      .object({
        id: z.string().optional().default('updatedAt'),
        desc: z.boolean().optional().default(true),
      })
      .default({ id: 'updatedAt', desc: true }),
    search: z.string().optional(),
  })
  .default({
    pagination: { pageIndex: 0, pageSize: 10 },
    sorting: { id: 'updatedAt', desc: true },
    search: undefined,
  })