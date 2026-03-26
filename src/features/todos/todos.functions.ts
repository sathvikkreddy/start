import { createServerFn } from '@tanstack/react-start'
import { asc, count, desc, ilike } from 'drizzle-orm'

import { db } from '#/db'
import { todos } from '#/db/schema/todo-schema'
import { createTodoSchema, fetchTodosSchema } from './todos.validators'
import { authMiddleware } from '#/middlewares/authMiddleware'
import type { PaginatedResult } from '#/components/ui/data-table/data-table.types'
import type { SelectTodo } from '#/db/schema/todo-schema'

// Map column id strings to actual Drizzle column references
const sortableColumns: Record<string, typeof todos.title | typeof todos.createdAt | typeof todos.isDone> = {
  title: todos.title,
  createdAt: todos.createdAt,
  isDone: todos.isDone,
}

export const fetchTodos = createServerFn({ method: 'GET' })
  // .middleware([authMiddleware])
  .inputValidator(fetchTodosSchema)
  .handler(async ({ data: params }): Promise<PaginatedResult<SelectTodo>> => {
    const { pagination, sorting, search } = params

    // Build WHERE conditions
    const whereCondition = search
      ? ilike(todos.title, `%${search}%`)
      : undefined

    // Build ORDER BY from sorting array
    const orderByColumns = sorting
      .filter((s) => s.id in sortableColumns)
      .map((s) => {
        const column = sortableColumns[s.id]!
        return s.desc ? desc(column) : asc(column)
      })

    // Default sort if none provided
    if (orderByColumns.length === 0) {
      orderByColumns.push(asc(todos.createdAt))
    }

    // Run data query and count query in parallel
    const [rows, totalCountResult] = await Promise.all([
      db
        .select()
        .from(todos)
        .where(whereCondition)
        .orderBy(...orderByColumns)
        .limit(pagination.pageSize)
        .offset(pagination.pageIndex * pagination.pageSize),
      db
        .select({ count: count() })
        .from(todos)
        .where(whereCondition),
    ])

    console.log("Made a db call")

    return {
      rows,
      totalCount: totalCountResult[0]?.count ?? 0,
    }
  })

export const fetchTodosPagination = createServerFn({ method: 'GET' })
  // .middleware([authMiddleware])
  .inputValidator(fetchTodosSchema.pick({pagination: true}))
  .handler(async ({ data: params }): Promise<PaginatedResult<SelectTodo>> => {
    const { pagination } = params

    // Run data query and count query in parallel
    const [rows, totalCountResult] = await Promise.all([
      db
        .select()
        .from(todos)
        .limit(pagination.pageSize)
        .offset(pagination.pageIndex * pagination.pageSize),
      db
        .select({ count: count() })
        .from(todos)
    ])

    console.log("Made a page db call")

    return {
      rows,
      totalCount: totalCountResult[0]?.count ?? 0,
    }
  })

export const addTodo = createServerFn({ method: 'POST' })
  // .middleware([authMiddleware])
  .inputValidator(createTodoSchema)
  .handler(async ({ data }) => {
    await db.insert(todos).values({ title: data.title })
  })
