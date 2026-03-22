import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_protectedLayout/profile')({
  component: RouteComponent,
  loader: ({ context }) => {
    return { session: context.session }
  },
  head: ({ loaderData }) => {
    const name = loaderData?.session.user.name
    return {
      meta: [
        {
          title: name ?? 'Profile',
        },
      ],
    }
  },
})

function RouteComponent() {
  const { session } = Route.useRouteContext()
  const user = session.user
  return <div>{`Hello - ${user.name}`}</div>
}
