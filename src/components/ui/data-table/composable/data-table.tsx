import type { ColumnDef, RowData, Table } from '@tanstack/react-table'
import React, { createContext, useContext } from 'react'
import { Header } from './data-table-header'
import { Body } from './data-table-body'
import { Pagination } from './data-table-pagination'
import { Toolbar } from './data-table-toolbar'
import { ViewOptions } from './data-table-view-options'
import { GlobalQuery } from './data-table-global-query'

declare module '@tanstack/table-core' {
  interface TableMeta<TData extends RowData> {
    tableName: string
  }
}

type DataTableProps<TData> = {
  table: Table<TData>
  columns: ColumnDef<TData>[]
  children: React.ReactNode
  className?: string
}

type DataTableContextType<TData> = {
  table: Table<TData>
  columns: ColumnDef<TData>[]
}

const DataTableContext = createContext<DataTableContextType<any> | null>(null)

export function useDataTable<TData = any>() {
  const context = useContext(DataTableContext)
  if (!context) {
    throw new Error('useDataTable must be used within DataTable')
  }
  return context as DataTableContextType<TData>
}

export function DataTableRoot<TData>({
  table,
  columns,
  className,
  children,
}: DataTableProps<TData>) {
  return (
    <DataTableContext.Provider value={{ table, columns }}>
      <div className={className}>{children}</div>
    </DataTableContext.Provider>
  )
}

export const DataTable = Object.assign(DataTableRoot, {
  Toolbar,
  ViewOptions,
  GlobalQuery,
  Header,
  Body,
  Pagination,
})
