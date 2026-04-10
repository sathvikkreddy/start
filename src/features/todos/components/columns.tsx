'use no memo'

import type { ColumnDef } from '@tanstack/react-table'
import { Checkbox } from '#/components/ui/checkbox'
import { DataTableColumnHeader } from '#/components/ui/data-table/data-table-column-header'
import type { SelectTodo } from '#/db/schema/todo-schema'

export const columns: ColumnDef<SelectTodo>[] = [
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
  // {
  //   id: 'actions',
  //   enableHiding: false,
  //   cell: ({ row }) => {
  //     const todo = row.original

  //     return (
  //       <DropdownMenu>
  //         <DropdownMenuTrigger asChild>
  //           <Button variant="ghost" className="h-8 w-8 p-0">
  //             <span className="sr-only">Open menu</span>
  //             <MoreHorizontal className="size-4" />
  //           </Button>
  //         </DropdownMenuTrigger>
  //         <DropdownMenuContent align="end">
  //           <DropdownMenuLabel>Actions</DropdownMenuLabel>
  //           <DropdownMenuItem
  //             onClick={() => navigator.clipboard.writeText(todo.id.toString())}
  //           >
  //             Copy Todo ID
  //           </DropdownMenuItem>
  //           <DropdownMenuSeparator />
  //           <DropdownMenuItem>Edit Todo</DropdownMenuItem>
  //           <DropdownMenuItem className="text-destructive">
  //             Delete Todo
  //           </DropdownMenuItem>
  //         </DropdownMenuContent>
  //       </DropdownMenu>
  //     )
  //   },
  // },
]
