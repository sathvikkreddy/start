import { Input } from '../../input'
import { useDataTable } from './data-table'

export function GlobalQuery({ className }: { className?: string }) {
  const { table } = useDataTable()
  const tableName = table.options.meta?.tableName ?? 'results'

  return (
    <Input
      value={table.getState().globalFilter}
      onChange={(e) => {
        table.setGlobalFilter(e.target.value)
      }}
      placeholder={`Search ${tableName}...`}
      className={`max-w-sm mr-auto ${className}`}
    />
  )
}
