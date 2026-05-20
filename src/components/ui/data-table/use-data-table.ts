import { useReactTable } from '@tanstack/react-table'
import type { ColumnDef, Table, TableOptions } from '@tanstack/react-table'
import { createContext, useContext } from 'react'

type DataTableContextType<TData> = {
  table: Table<TData>
  columns: ColumnDef<TData>[]
}

const DataTableContext = createContext<DataTableContextType<any> | null>(null)

export function useDataTable<TData>() {
  const context = useContext(DataTableContext)
  if (!context) {
    throw new Error('useDataTable must be used within DataTable')
  }
  return context as DataTableContextType<TData>
}

export const useNoMemoTable = <TData>(
  reactTableOptions: TableOptions<TData>,
) => {
  const table = useReactTable(reactTableOptions)
  return { ...table } as typeof table
}
