import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'

import { Button } from '#/components/ui/button'
import {
  todosQueryOptions,
  useTodos,
  useCreateTodo,
} from '#/features/todos'
import ThemeToggle from '#/components/ThemeToggle'

export const Route = createFileRoute('/_protectedLayout/_todos/todos')({
  component: RouteComponent,
  wrapInSuspense: true,
  loader: ({ context }) =>
    context.queryClient.ensureQueryData(todosQueryOptions()),
})

function RouteComponent() {
  const { data: todoList } = useTodos()
  const [title, setTitle] = useState('')
  const createTodo = useCreateTodo()

  return (
    <div className="mx-auto flex max-w-md flex-col gap-4 p-6">
      <ThemeToggle />
      <h1 className="text-xl font-semibold">Todos ({todoList.length})</h1>
      <form
        className="flex gap-2"
        onSubmit={(e) => {
          e.preventDefault()
          const trimmed = title.trim()
          if (!trimmed) return
          createTodo.mutate(trimmed)
          setTitle('')
        }}
      >
        <input
          className="border-input bg-background flex-1 rounded-md border px-3 py-2 text-sm"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="New todo"
          aria-label="Todo title"
        />
        <Button type="submit" disabled={createTodo.isPending}>
          Add
        </Button>
      </form>
      <ul className="list-inside list-disc space-y-1 text-sm">
        {todoList.map((t) => (
          <li key={t.id}>{t.title}</li>
        ))}
      </ul>
    </div>
  )
}
