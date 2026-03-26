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
  const table = useReactTable({
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

  // useReactTable returns a stable reference that mutates internally.
  // React Compiler can't track mutations on a stable ref, so children
  // that receive `table` as a prop would skip re-renders.
  // Spreading into a new object gives a fresh reference on each render.
  // This is safe because useReactTable only triggers re-renders on
  // actual state changes — no unnecessary copies.
  return { ...table } as typeof table
}
