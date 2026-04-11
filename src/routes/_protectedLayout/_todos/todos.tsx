import { DataTable } from '#/components/ui/data-table/data-table'
import { useNoMemoTable } from '#/components/ui/data-table/use-data-table'
import type { TodoWithTags } from '#/db/schema/todo-schema'
import { todosQueryOptions } from '#/features/todos'
import { columns } from '#/features/todos/components/columns'
import { AddTodoDialog } from '#/features/todos/components/add-todo-dialog'
import { todosSearchSchema } from '#/features/todos/todos.validators'
import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { getCoreRowModel } from '@tanstack/react-table'

export const Route = createFileRoute('/_protectedLayout/_todos/todos')({
  component: RouteComponent,
  validateSearch: todosSearchSchema,
  // loaderDeps({ search }) {
  //   return search
  // },
  // loader: ({ context, deps }) => {
  //   const searchParams = deps
  //   const pagination = {
  //     pageIndex: searchParams.todos_page_index,
  //     pageSize: searchParams.todos_page_size,
  //   }

  //   const sorting = {
  //     id: searchParams.todos_sort,
  //     desc: searchParams.todos_sort_desc,
  //   }
  //   return context.queryClient.ensureQueryData(
  //     todosQueryOptions({
  //       pagination,
  //       sorting,
  //       search: searchParams.todos_search,
  //     }),
  //   )
  // },
  wrapInSuspense: true,
})

function RouteComponent() {
  const searchParams = Route.useSearch()
  const navigate = Route.useNavigate()

  const pagination = {
    pageIndex: searchParams.todos_page_index,
    pageSize: searchParams.todos_page_size,
  }

  const sorting = {
    id: searchParams.todos_sort,
    desc: searchParams.todos_sort_desc,
  }

  // const { data } = useSuspenseQuery(
  //   todosQueryOptions({
  //     pagination,
  //     sorting,
  //     search: searchParams.todos_search,
  //   }),
  // )

  // const reactTable = useNoMemoTable<TodoWithTags>({
  //   columns,
  //   data: data?.rows ?? [],
  //   getCoreRowModel: getCoreRowModel(),
  //   manualPagination: true,
  //   manualSorting: true,
  //   enableMultiSort: false,
  //   pageCount: Math.ceil((data?.totalCount ?? 0) / pagination.pageSize),
  //   state: {
  //     pagination,
  //     sorting: [sorting],
  //   },
  //   onPaginationChange: (updater) => {
  //     const current = {
  //       pageIndex: searchParams.todos_page_index,
  //       pageSize: searchParams.todos_page_size,
  //     }
  //     const next = typeof updater === 'function' ? updater(current) : updater
  //     navigate({
  //       search: (prev) => ({
  //         ...prev,
  //         todos_page_index: next.pageIndex,
  //         todos_page_size: next.pageSize,
  //       }),
  //     })
  //   },
  //   onSortingChange: (updater) => {
  //     const current = [
  //       { id: searchParams.todos_sort, desc: searchParams.todos_sort_desc },
  //     ]
  //     const [primary] =
  //       typeof updater === 'function' ? updater(current) : updater
  //     navigate({
  //       search: (prev) => ({
  //         ...prev,
  //         todos_sort: primary?.id ?? '',
  //         todos_sort_desc: primary?.desc ?? false,
  //         // Reset page index when sorting changes
  //         todos_page_index: 0,
  //       }),
  //     })
  //   },
  // })

  return (
    <div className="mx-auto w-full max-w-2xl">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Table</h1>
        {/* <AddTodoDialog /> */}
      </div>
      {/* <DataTable table={reactTable} columns={columns} /> */}
    </div>
  )
}
