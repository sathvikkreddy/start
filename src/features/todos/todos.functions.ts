import { createServerFn } from '@tanstack/react-start'
import { asc, count, desc, ilike } from 'drizzle-orm'

import { db } from '#/db'
import { tags, todoTags, todos } from '#/db/schema/todo-schema'
import {
  createTagSchema,
  createTodoWithTagsSchema,
  fetchTodosSchema,
  todosSortableColsSchema,
} from './todos.validators'

export const fetchTodos = createServerFn({ method: 'GET' })
  .inputValidator(fetchTodosSchema)
  .handler(async ({ data: params }) => {
    const { pagination, sorting, search } = params

    const whereCondition = search
      ? ilike(todos.title, `%${search}%`)
      : undefined

    const orderByColKey = todosSortableColsSchema.parse(sorting.id)
    const orderByCol = todos[orderByColKey]
    const orderBy = sorting.desc ? desc(orderByCol) : asc(orderByCol)

    // Use Drizzle relational query to get todos with tags
    const [rows, totalCountResult] = await Promise.all([
      db.query.todos.findMany({
        where: whereCondition,
        orderBy,
        limit: pagination.pageSize,
        offset: pagination.pageIndex * pagination.pageSize,
        with: {
          todoTags: {
            with: {
              tag: true,
            },
          },
        },
      }),
      db.select({ count: count() }).from(todos).where(whereCondition),
    ])

    // Flatten todoTags -> tags for a cleaner shape
    const todosWithTags = rows.map(({ todoTags: tts, ...todo }) => ({
      ...todo,
      tags: tts.map((tt) => tt.tag),
    }))

    return {
      rows: todosWithTags,
      totalCount: totalCountResult[0]?.count ?? 0,
    }
  })

export const fetchTags = createServerFn({ method: 'GET' }).handler(
  async () => {
    return db.query.tags.findMany({
      orderBy: asc(tags.name),
    })
  },
)

export const createTag = createServerFn({ method: 'POST' })
  .inputValidator(createTagSchema)
  .handler(async ({ data }) => {
    const [newTag] = await db
      .insert(tags)
      .values({ name: data.name })
      .returning()
    return newTag
  })

export const addTodo = createServerFn({ method: 'POST' })
  .inputValidator(createTodoWithTagsSchema)
  .handler(async ({ data }) => {
    const { title, tagIds, newTags } = data

    // 1. Insert the todo
    const [newTodo] = await db
      .insert(todos)
      .values({ title })
      .returning({ id: todos.id })

    // 2. Create any inline new tags
    const createdTagIds: number[] = []
    if (newTags.length > 0) {
      const created = await db
        .insert(tags)
        .values(newTags.map((t) => ({ name: t.name })))
        .returning({ id: tags.id })
      createdTagIds.push(...created.map((t) => t.id))
    }

    // 3. Link all tags (existing + newly created) to the todo
    const allTagIds = [...tagIds, ...createdTagIds]
    if (allTagIds.length > 0) {
      await db
        .insert(todoTags)
        .values(allTagIds.map((tagId) => ({ todoId: newTodo.id, tagId })))
    }

    return newTodo
  })
