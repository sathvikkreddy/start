import { queryOptions } from '@tanstack/react-query'
import { getSession } from './auth.functions.ts'

export const sessionQueryOptions = () =>
  queryOptions({
    queryKey: ['session'],
    queryFn: () => getSession(),
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  })
