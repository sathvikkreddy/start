import { queryOptions } from '@tanstack/react-query'
import { fetchTodos } from './todos.functions.ts'
import type z from 'zod'
import { fetchTodosSchema } from './todos.validators.ts'

export const todosQueryOptions = (params?: z.input<typeof fetchTodosSchema>) =>
  queryOptions({
    queryKey: ['todos', params],
    queryFn: () => fetchTodos({ data: params }),
    // placeholderData: (prev) => prev,
    // staleTime: 1000 * 60 * 10,
  })