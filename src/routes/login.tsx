import { Button } from '#/components/ui/button'
import { getSession } from '#/lib/auth.functions'
import { createFileRoute, redirect } from '@tanstack/react-router'
import { authClient } from '#/lib/auth-client'

export const Route = createFileRoute('/login')({
  component: RouteComponent,
  beforeLoad: async () => {
    const session = await getSession()
    if (session) {
      throw redirect({ to: '/todos' })
    }
    return { session }
  },
})

function RouteComponent() {
  return (
    <Button
      onClick={() => {
        void authClient.signIn.social({
          provider: 'github',
        })
      }}
    >
      Login with GitHub
    </Button>
  )
}
