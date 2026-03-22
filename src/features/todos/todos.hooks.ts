import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query'
import { addTodo } from './todos.functions.ts'
import { todosQueryOptions } from './todos.queries.ts'

export function useTodos() {
  return useSuspenseQuery(todosQueryOptions())
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
