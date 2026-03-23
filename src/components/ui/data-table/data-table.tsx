import {
  flexRender,
  type Table as TanStackTable,
  type ColumnDef,
} from '@tanstack/react-table'

import { DataTablePagination } from './data-table-pagination'
import { DataTableViewOptions } from './data-table-view-options'
import { Input } from '#/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '#/components/ui/table'

interface DataTableProps<TData, TValue> {
  table: TanStackTable<TData>
  columns: ColumnDef<TData, TValue>[]
  filterKey?: string
  filterPlaceholder?: string
  /** Controlled filter value (for server-side search) */
  filterValue?: string
  /** Controlled filter change handler (for server-side search) */
  onFilterChange?: (value: string) => void
}

export function DataTable<TData, TValue>({
  table,
  columns,
  filterKey,
  filterPlaceholder = 'Filter...',
  filterValue,
  onFilterChange,
}: DataTableProps<TData, TValue>) {
  // Use controlled value if provided, otherwise fall back to table column filter
  const isControlled = filterValue !== undefined && onFilterChange !== undefined
  const currentFilterValue = isControlled
    ? filterValue
    : ((table.getColumn(filterKey ?? '')?.getFilterValue() as string) ?? '')

  const handleFilterChange = (value: string) => {
    if (isControlled) {
      onFilterChange(value)
    } else if (filterKey) {
      table.getColumn(filterKey)?.setFilterValue(value)
    }
  }

  console.log('Table: ', table.getRowModel().rows.length)
  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex items-center">
        {filterKey && (
          <Input
            placeholder={filterPlaceholder}
            value={currentFilterValue}
            onChange={(event) => handleFilterChange(event.target.value)}
            className="max-w-sm"
          />
        )}
        <DataTableViewOptions table={table} />
      </div>

      {/* Table grid */}
      <div className="rounded-md border border-border bg-card">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <DataTablePagination table={table} />
    </div>
  )
}
