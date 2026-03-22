import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_protectedLayout')({
  component: RouteComponent,
  beforeLoad: ({ context }) => {
    if (!context.session || !context.session.user) {
      throw redirect({ to: '/login' })
    }
    return { session: context.session }
  },
})

function RouteComponent() {
  return <Outlet />
}
