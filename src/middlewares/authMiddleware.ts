import { createMiddleware } from '@tanstack/react-start'
import { getSession } from '#/features/auth'

export const authMiddleware = createMiddleware().server(async ({ next }) => {
  const session = await getSession()
  if (!session) {
    throw new Error('Unauthorized')
  }
  return next({ context: { session } })
})
