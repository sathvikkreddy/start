import { queryOptions } from '@tanstack/react-query'
import type { DataTableParams } from '#/components/ui/data-table/data-table.types'
import { defaultDataTableParams } from '#/components/ui/data-table/data-table.types'
import { fetchTodos } from './todos.functions.ts'

export const todosQueryOptions = (params: DataTableParams = defaultDataTableParams) =>
  queryOptions({
    queryKey: ['todos', params],
    queryFn: () => fetchTodos({ data: params }),
    placeholderData: (prev) => prev,
  })
