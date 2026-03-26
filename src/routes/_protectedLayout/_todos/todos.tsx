import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'

import { Button } from '#/components/ui/button'
import { columns } from '#/features/todos/components/columns'
import { DataTable } from '#/components/ui/data-table/data-table'
import { useDataTable } from '#/components/ui/data-table/use-data-table'
import { useDataTableState } from '#/components/ui/data-table/use-data-table-state'
import type { DataTableParams } from '#/components/ui/data-table/data-table.types'
import { todosQueryOptions, useCreateTodo, fetchTodos } from '#/features/todos'
import { useSuspenseQuery } from '@tanstack/react-query'

export const Route = createFileRoute('/_protectedLayout/_todos/todos')({
  component: RouteComponent,
  wrapInSuspense: true,
  loader: async ({ context }) =>
    await context.queryClient.ensureQueryData(todosQueryOptions()),
})

function RouteComponent() {
  const [title, setTitle] = useState('')
  const createTodo = useCreateTodo()
  const [search, setSearch] = useState('')

  // Table state — owned here, visible to both query and table
  const tableState = useDataTableState()

  // Build server params from the state
  const params: DataTableParams = {
    pagination: tableState.pagination,
    sorting: tableState.sorting.map((s) => ({ id: s.id, desc: s.desc })),
    search: search || undefined,
  }

  const { data } = useSuspenseQuery({
    queryKey: ['todos', params],
    queryFn: () => fetchTodos({ data: params }),
  })
  const todoList = data?.rows ?? []
  const totalCount = data?.totalCount ?? 0
  const pageCount = Math.ceil(totalCount / tableState.pagination.pageSize)

  console.log('length', todoList.length)

  const table = useDataTable({
    data: data.rows,
    columns,
    state: tableState,
    isServerSide: true,
    pageCount,
    getRowId: (row) => row.id.toString(),
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
          filterPlaceholder="Search todos..."
          filterValue={search}
          onFilterChange={(value) => {
            setSearch(value)
            tableState.setPagination((prev) => ({ ...prev, pageIndex: 0 }))
          }}
        />
      </div>
    </div>
  )
}
