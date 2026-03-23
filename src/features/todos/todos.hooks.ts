import {
  useMutation,
  useQuery,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query'
import type { DataTableParams } from '#/components/ui/data-table/data-table.types'
import { defaultDataTableParams } from '#/components/ui/data-table/data-table.types'
import { addTodo } from './todos.functions.ts'
import { todosQueryOptions } from './todos.queries.ts'

export function useTodos(params: DataTableParams = defaultDataTableParams) {
  return useQuery(todosQueryOptions(params))
}

export function useCreateTodo() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (title: string) => addTodo({ data: { title } }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['todos'] })
    },
  })
}
