import { queryOptions } from '@tanstack/react-query'
import { fetchTodos, fetchTags } from './todos.functions.ts'
import type z from 'zod'
import { fetchTodosSchema } from './todos.validators.ts'

export const todosQueryOptions = (params?: z.input<typeof fetchTodosSchema>) =>
  queryOptions({
    queryKey: ['todos', params],
    queryFn: () => fetchTodos({ data: params }),
  })

export const tagsQueryOptions = () =>
  queryOptions({
    queryKey: ['tags'],
    queryFn: () => fetchTags(),
    staleTime: 1000 * 60 * 5,
  })