import type { ReactNode } from 'react'
import { ViewOptions } from './data-table-view-options'
import { GlobalQuery } from './data-table-global-query'

export function Toolbar({ children }: { children?: ReactNode }) {
  return (
    <div className="flex justify-end items-center gap-4">
      {!children ? (
        <>
          <GlobalQuery />
          <ViewOptions />
        </>
      ) : (
        children
      )}
    </div>
  )
}
