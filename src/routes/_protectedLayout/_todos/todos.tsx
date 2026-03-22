import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'

import { Button } from '#/components/ui/button'
import { columns } from '#/features/todos/components/columns'
import { DataTable } from '#/components/ui/data-table/data-table'
import { useDataTable } from '#/components/ui/data-table/use-data-table'
import { todosQueryOptions, useTodos, useCreateTodo } from '#/features/todos'

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

  const table = useDataTable({
    data: todoList,
    columns,
  })

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-4">
      <h1 className="text-2xl font-semibold">Todos ({todoList.length})</h1>
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
      <div className="mt-4">
        <DataTable
          table={table}
          columns={columns}
          filterKey="title"
          filterPlaceholder="Filter todos..."
        />
      </div>
    </div>
  )
}
