import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import type { ColumnDef } from '@tanstack/react-table'
import type { DataTableState } from './use-data-table-state'

interface UseDataTableProps<TData, TValue> {
  data: TData[]
  columns: ColumnDef<TData, TValue>[]
  state: DataTableState
  isServerSide?: boolean
  pageCount?: number
  /** Must provide a unique ID per row (e.g. DB primary key) for server-side pagination to work correctly */
  getRowId?: (row: TData) => string
}

export function useDataTable<TData, TValue>({
  data,
  columns,
  state,
  isServerSide = false,
  pageCount,
  getRowId,
}: UseDataTableProps<TData, TValue>) {
  return useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    ...(getRowId ? { getRowId } : {}),
    // Only use client-side row models when NOT server-side
    ...(isServerSide
      ? {
          manualPagination: true,
          manualSorting: true,
          manualFiltering: true,
          pageCount: pageCount ?? -1,
          // Server controls pagination — don't auto-reset when data changes
          autoResetPageIndex: false,
        }
      : {
          getPaginationRowModel: getPaginationRowModel(),
          getSortedRowModel: getSortedRowModel(),
          getFilteredRowModel: getFilteredRowModel(),
        }),
    onSortingChange: state.setSorting,
    onPaginationChange: state.setPagination,
    onColumnFiltersChange: state.setColumnFilters,
    onColumnVisibilityChange: state.setColumnVisibility,
    onRowSelectionChange: state.setRowSelection,
    state: {
      sorting: state.sorting,
      pagination: state.pagination,
      columnFilters: state.columnFilters,
      columnVisibility: state.columnVisibility,
      rowSelection: state.rowSelection,
    },
  })
}
