export interface DataTableSorting {
  id: string
  desc: boolean
}

export interface DataTablePagination {
  pageIndex: number
  pageSize: number
}

export interface DataTableParams {
  pagination?: DataTablePagination
  sorting?: DataTableSorting[]
  search?: string
}

export interface PaginatedResult<T> {
  rows: T[]
  totalCount: number
}

export const DEFAULT_PAGE_SIZE = 10

export const defaultDataTableParams: DataTableParams = {
  pagination: { pageIndex: 0, pageSize: DEFAULT_PAGE_SIZE },
  sorting: [],
  search: '',
}
