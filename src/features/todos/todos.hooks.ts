import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import { addTodo, createTag } from './todos.functions.ts'
import { todosQueryOptions, tagsQueryOptions } from './todos.queries.ts'
import type z from 'zod'
import type { createTodoWithTagsSchema, fetchTodosSchema } from './todos.validators.ts'

export function useTodos(params?: z.input<typeof fetchTodosSchema>) {
  return useQuery(todosQueryOptions(params))

}

export function useTags() {
  return useQuery(tagsQueryOptions())
}

export function useCreateTodo() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: z.infer<typeof createTodoWithTagsSchema>) =>
      addTodo({ data }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['todos'] })
      void queryClient.invalidateQueries({ queryKey: ['tags'] })
    },
  })
}

export function useCreateTag() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (name: string) => createTag({ data: { name } }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['tags'] })
    },
  })
}
