import { createServerFn } from '@tanstack/react-start'
import { asc, count, desc, ilike } from 'drizzle-orm'

import { db } from '#/db'
import { todos } from '#/db/schema/todo-schema'
import { createTodoSchema, fetchTodosSchema, todosSortableColsSchema } from './todos.validators'

export const fetchTodos = createServerFn({ method: 'GET' })
  // .middleware([authMiddleware])
  .inputValidator(fetchTodosSchema)
  .handler(async ({ data: params }) => {
    const { pagination, sorting, search } = params

    // Build WHERE conditions
    const whereCondition = search
      ? ilike(todos.title, `%${search}%`)
      : undefined
    
    const orderByColKey = todosSortableColsSchema.parse(sorting.id)
    const orderByCol = todos[orderByColKey]
    const orderBy= sorting.desc ? desc(orderByCol) : asc(orderByCol)

    // throw new Error("Something went wrong")

    // Run data query and count query in parallel
    const [rows, totalCountResult] = await Promise.all([
      db
        .select()
        .from(todos)
        .where(whereCondition)
        .orderBy(orderBy)
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

export const addTodo = createServerFn({ method: 'POST' })
  // .middleware([authMiddleware])
  .inputValidator(createTodoSchema)
  .handler(async ({ data }) => {
    await db.insert(todos).values({ title: data.title })
  })
