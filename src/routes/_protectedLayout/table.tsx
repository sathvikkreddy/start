import { DataTable } from '#/components/ui/data-table/data-table'
import { useDataTable } from '#/components/ui/data-table/use-data-table'
import { useDataTableUrlState } from '#/components/ui/data-table/use-data-table-state'
import type { DataTableParams } from '#/components/ui/data-table/data-table.types'
import { fetchTodos, todosQueryOptions } from '#/features/todos'
import { columns } from '#/features/todos/components/columns'
import { todosSearchSchema } from '#/features/todos/todos.validators'
import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_protectedLayout/table')({
  component: RouteComponent,
  validateSearch: todosSearchSchema,
  loader: ({ context }) =>
    context.queryClient.ensureQueryData(todosQueryOptions()),
  wrapInSuspense: true,
})

function RouteComponent() {
  const tableState = useDataTableUrlState({
    keyMap: { page: 'page', size: 'size', sort: 'sort', search: 'search' },
  })

  // Build server params from the URL-backed state
  const params: DataTableParams = {
    pagination: tableState.pagination,
    sorting: tableState.sorting.map((s) => ({ id: s.id, desc: s.desc })),
  }

  const { data } = useSuspenseQuery({
    queryKey: ['todos', params],
    queryFn: () => fetchTodos({ data: params }),
  })

  const pageCount = Math.ceil(data.totalCount / tableState.pagination.pageSize)

  const table = useDataTable({
    data: data.rows,
    columns,
    state: tableState,
    isServerSide: true,
    pageCount,
    getRowId: (row) => row.id.toString(),
  })

  return (
    <div className="mx-auto w-full max-w-2xl">
      <h1 className="mb-4 text-2xl font-semibold">
        Table ({data.rows.length})
      </h1>
      <DataTable table={table} columns={columns} />
    </div>
  )
}
