'use no memo'

import type { ColumnDef } from '@tanstack/react-table'
import { Badge } from '#/components/ui/badge'
import { Checkbox } from '#/components/ui/checkbox'
import { DataTableColumnHeader } from '#/components/ui/data-table/data-table-column-header'
import type { TodoWithTags } from '#/db/schema/todo-schema'

export const columns: ColumnDef<TodoWithTags>[] = [
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
      if (!tags || tags.length === 0) return null
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
