import { queryOptions } from '@tanstack/react-query'
import type { DataTableParams } from '#/components/ui/data-table/data-table.types'
import { defaultDataTableParams } from '#/components/ui/data-table/data-table.types'
import { fetchTodos, fetchTodosPagination } from './todos.functions.ts'
import type { PaginationState } from '@tanstack/react-table'

export const todosQueryOptions = (params: DataTableParams = defaultDataTableParams) =>
  queryOptions({
    queryKey: ['todos', params],
    queryFn: () => fetchTodos({ data: params }),
    placeholderData: (prev) => prev,
    // staleTime: 1000 * 60 * 10,
  })

  export const todosQueryOptionsPagination = (pagination: PaginationState = {pageIndex: 0, pageSize: 10}) =>
  queryOptions({
    queryKey: ['todos', pagination],
    queryFn: () => fetchTodosPagination({ data: { pagination } }),
    placeholderData: (prev) => prev,
    staleTime: 1000 * 60 * 10,
  })