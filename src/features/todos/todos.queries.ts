import { queryOptions } from '@tanstack/react-query'
import { fetchTodos } from './todos.functions.ts'

export const todosQueryOptions = () =>
  queryOptions({
    queryKey: ['todos'],
    queryFn: () => fetchTodos(),
  })
