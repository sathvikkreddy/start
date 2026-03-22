import { createServerFn } from '@tanstack/react-start'
import { asc } from 'drizzle-orm'

import { db } from '#/db'
import { todos } from '#/db/schema/todo-schema'
import { createTodoSchema } from './todos.validators'
import { authMiddleware } from '#/middlewares/authMiddleware'

export const fetchTodos = createServerFn({ method: 'GET' })
  .middleware([authMiddleware])
  .handler(async () => {
    return db.select().from(todos).orderBy(asc(todos.createdAt))
  })

export const addTodo = createServerFn({ method: 'POST' })
  .middleware([authMiddleware])
  .inputValidator(createTodoSchema)
  .handler(async ({ data }) => {
    await db.insert(todos).values({ title: data.title })
  })
