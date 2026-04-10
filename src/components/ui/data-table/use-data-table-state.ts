import * as React from 'react'
import type {
  ColumnFiltersState,
  PaginationState,
  SortingState,
  VisibilityState,
} from '@tanstack/react-table'
import { useNavigate, useSearch } from '@tanstack/react-router'
import { DEFAULT_PAGE_SIZE } from './data-table.types'

export interface DataTableState {
  sorting: SortingState
  setSorting: React.Dispatch<React.SetStateAction<SortingState>>
  pagination: PaginationState
  setPagination: React.Dispatch<React.SetStateAction<PaginationState>>
  columnFilters: ColumnFiltersState
  setColumnFilters: React.Dispatch<React.SetStateAction<ColumnFiltersState>>
  columnVisibility: VisibilityState
  setColumnVisibility: React.Dispatch<React.SetStateAction<VisibilityState>>
  rowSelection: Record<string, boolean>
  setRowSelection: React.Dispatch<React.SetStateAction<Record<string, boolean>>>
}

/**
 * Provides all the state needed for a data table.
 * The consumer owns the state and can use it both for
 * driving server queries (DataTableParams) and passing to useDataTable.
 */
export function useDataTableState(
  initialPageSize: number = DEFAULT_PAGE_SIZE
): DataTableState {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: initialPageSize,
  })
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState<Record<string, boolean>>({})

  return {
    sorting,
    setSorting,
    pagination,
    setPagination,
    columnFilters,
    setColumnFilters,
    columnVisibility,
    setColumnVisibility,
    rowSelection,
    setRowSelection,
  }
}

/**
 * Maps table state fields to URL search param key names.
 * Allows each table to use its own key names (supporting multi-table pages).
 *
 * @example
 * // Single table on a page:
 * { page: 'page', size: 'size', sort: 'sort', search: 'search' }
 *
 * // Multiple tables — prefix keys:
 * { page: 'orders_page', size: 'orders_size', sort: 'orders_sort', search: 'orders_search' }
 */
export interface DataTableUrlKeyMap {
  page: string
  size: string
  sort: string
  search: string
}

export interface UseDataTableUrlStateOptions {
  /** Maps state fields to search param keys */
  keyMap: DataTableUrlKeyMap
  /** Default page size when not specified in URL */
  defaultPageSize?: number
}

// ── helpers ──────────────────────────────────────────────────────────

function parseSorting(raw: string | undefined): SortingState {
  if (!raw) return []
  // format: "col.desc" or "col.asc"
  const [id, dir] = raw.split('.')
  if (!id || (dir !== 'asc' && dir !== 'desc')) return []
  return [{ id, desc: dir === 'desc' }]
}

function serializeSorting(sorting: SortingState): string | undefined {
  if (sorting.length === 0) return undefined
  const s = sorting[0]
  return `${s.id}.${s.desc ? 'desc' : 'asc'}`
}

// ── hook ─────────────────────────────────────────────────────────────

/**
 * Like useDataTableState, but persists pagination, sorting, and search
 * in URL search params via TanStack Router.
 *
 * Returns the same DataTableState interface so downstream consumers
 * (useDataTable, DataTable, DataTablePagination, etc.) are unaffected.
 */
export function useDataTableUrlState({
  keyMap,
  defaultPageSize = DEFAULT_PAGE_SIZE,
}: UseDataTableUrlStateOptions): DataTableState {
  // strict: false gives us all search params across the route tree
  const search = useSearch({ strict: false }) as Record<string, unknown>
  const navigate = useNavigate()

  // ── derive state from URL ────────────────────────────────────────
  const pageIndex = (search[keyMap.page] as number | undefined) ?? 0
  const pageSize =
    (search[keyMap.size] as number | undefined) ?? defaultPageSize
  const sorting = parseSorting(search[keyMap.sort] as string | undefined)

  // ── local-only state (not URL-persisted) ─────────────────────────
  const [columnFilters, setColumnFilters] =
    React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState<
    Record<string, boolean>
  >({})

  // ── URL writer (replaces history entry, no back-stack spam) ──────
  const updateSearch = React.useCallback(
    (updates: Record<string, unknown>) => {
      void navigate({
        search: ((prev: Record<string, unknown>) => {
          const next = { ...prev, ...updates }
          // Strip undefined values so defaults produce a clean URL
          for (const key of Object.keys(next)) {
            if (next[key] === undefined) delete next[key]
          }
          return next
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        }) as any,
        replace: true,
      })
    },
    [navigate],
  )

  // ── TanStack Table compatible setters ────────────────────────────
  const setPagination: React.Dispatch<
    React.SetStateAction<PaginationState>
  > = React.useCallback(
    (updater) => {
      const current = { pageIndex, pageSize }
      const next =
        typeof updater === 'function' ? updater(current) : updater
      updateSearch({
        [keyMap.page]: next.pageIndex === 0 ? undefined : next.pageIndex,
        [keyMap.size]:
          next.pageSize === defaultPageSize ? undefined : next.pageSize,
      })
    },
    [pageIndex, pageSize, keyMap, defaultPageSize, updateSearch],
  )

  const setSorting: React.Dispatch<
    React.SetStateAction<SortingState>
  > = React.useCallback(
    (updater) => {
      const next =
        typeof updater === 'function' ? updater(sorting) : updater
      updateSearch({
        [keyMap.sort]: serializeSorting(next),
        // Reset to first page on sort change
        [keyMap.page]: undefined,
      })
    },
    [sorting, keyMap, updateSearch],
  )

  const pagination: PaginationState = { pageIndex, pageSize }

  return {
    sorting,
    setSorting,
    pagination,
    setPagination,
    columnFilters,
    setColumnFilters,
    columnVisibility,
    setColumnVisibility,
    rowSelection,
    setRowSelection,
  }
}