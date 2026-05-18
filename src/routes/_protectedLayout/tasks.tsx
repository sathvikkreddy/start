import { Badge } from '#/components/ui/badge'
import { Checkbox } from '#/components/ui/checkbox'
import { DataTable } from '#/components/ui/data-table/data-table'
import { DataTableColumnHeader } from '#/components/ui/data-table/data-table-column-header'
import { Input } from '#/components/ui/input'
import type { TodoWithTags } from '#/db/schema/todo-schema'
import { fetchTodos } from '#/features/todos'
import {
  defaultTodosSearch,
  todosSearchSchema,
  todosSortableColsSchema,
} from '#/features/todos/todos.validators'
import { createFileRoute } from '@tanstack/react-router'
import { getCoreRowModel, useReactTable } from '@tanstack/react-table'
import type { ColumnDef } from '@tanstack/react-table'
import { useState } from 'react'

export const Route = createFileRoute('/_protectedLayout/tasks')({
  component: RouteComponent,
  validateSearch: todosSearchSchema,
  beforeLoad: () => {
    console.info('Inside beforeLoad of tasks')
  },
  loaderDeps: ({ search }) => {
    return {
      pageIndex: search.todos_page_index,
      pageSize: search.todos_page_size,
      sortId: search.todos_sort,
      sortDesc: search.todos_sort_desc,
      query: search.todos_search,
    }
  },
  loader: async ({ deps }) => {
    const { pageIndex, pageSize, sortDesc, sortId, query } = deps
    return await fetchTodos({
      data: {
        pagination: { pageSize, pageIndex },
        sorting: { id: sortId, desc: sortDesc },
        search: query,
      },
    })
  },
})

const todosColsDef: ColumnDef<TodoWithTags>[] = [
  {
    accessorKey: 'isDone',
    header: 'Status',
    cell: ({ row }) => (
      <Checkbox
        checked={row.original.isDone}
        disabled
        aria-label="Todo status"
      />
    ),
  },
  {
    accessorKey: 'title',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Title" />
    ),
    cell: ({ row }) => <div className="font-medium">{row.original.title}</div>,
  },
  {
    id: 'tags',
    header: 'Tags',
    cell: ({ row }) => {
      const tags = row.original.tags
      if (tags.length === 0) return null
      return (
        <div className="flex flex-wrap gap-1">
          {tags.map((tag) => (
            <Badge key={tag.id} variant="secondary" className="text-xs">
              {tag.name}
            </Badge>
          ))}
        </div>
      )
    },
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created At" />
    ),
    cell: ({ row }) => {
      const date = new Date(row.original.createdAt)
      return <div>{date.toLocaleDateString()}</div>
    },
  },
  {
    accessorKey: 'updatedAt',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Updated At" />
    ),
    cell: ({ row }) => {
      const date = new Date(row.original.updatedAt)
      return <div>{date.toLocaleDateString()}</div>
    },
  },
]

function RouteComponent() {
  const todos = Route.useLoaderData()
  const search = Route.useSearch()
  const navigate = Route.useNavigate()

  const pagination = {
    pageIndex: search.todos_page_index,
    pageSize: search.todos_page_size,
  }

  const sorting = [{ id: search.todos_sort, desc: search.todos_sort_desc }]

  const [query, setQuery] = useState(search.todos_search)

  const todosTable = useReactTable<TodoWithTags>({
    data: todos.rows,
    columns: todosColsDef,
    rowCount: todos.totalCount,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    manualSorting: true,
    state: {
      pagination,
      sorting,
    },
    onPaginationChange: (updater) => {
      const nextPagination =
        typeof updater === 'function' ? updater(pagination) : updater

      navigate({
        search: (prev) => ({
          ...defaultTodosSearch,
          ...prev,
          todos_page_index: nextPagination.pageIndex,
          todos_page_size: nextPagination.pageSize,
        }),
        replace: true,
      })
    },
    onSortingChange: (updater) => {
      const newSorting =
        typeof updater === 'function' ? updater(sorting)[0] : updater[0]

      navigate({
        search: (prev) => ({
          ...defaultTodosSearch,
          ...prev,
          // should parse the id aganist schema to satisfy typescript as ColumnSort.id is typed as 'string' by @tanstack/react-table
          todos_sort: todosSortableColsSchema.parse(newSorting.id),
          todos_sort_desc: newSorting.desc,
        }),
        replace: true,
      })
    },
  })

  return (
    <div>
      {/* {todos.rows.map((todo) => {
        return <div key={todo.id}>{todo.title}</div>
      })} */}
      <Input
        value={query}
        onChange={(e) => {
          setQuery(e.target.value)

          navigate({
            search: (prev) => ({
              ...defaultTodosSearch,
              ...prev,
              // should parse the id aganist schema to satisfy typescript as ColumnSort.id is typed as 'string' by @tanstack/react-table
              todos_search: e.target.value,
            }),
            replace: true,
          })
        }}
      />
      <DataTable table={todosTable} columns={todosColsDef} />
    </div>
  )
}
