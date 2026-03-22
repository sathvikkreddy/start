import {
  createFileRoute,
  Outlet,
  redirect,
  useMatches,
} from '@tanstack/react-router'

import { AppSidebar } from '#/components/layout/app-sidebar'
import { Separator } from '#/components/ui/separator'
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '#/components/ui/sidebar'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from '#/components/ui/breadcrumb'

export const Route = createFileRoute('/_protectedLayout')({
  component: RouteComponent,
  beforeLoad: ({ context }) => {
    if (!context.session || !context.session.user) {
      throw redirect({ to: '/login' })
    }
    return { session: context.session }
  },
})

// Map route paths to display names
const routeTitles: Record<string, string> = {
  '/': 'Home',
  '/todos': 'Todos',
  '/profile': 'Profile',
}

function RouteComponent() {
  const { session } = Route.useRouteContext()
  const matches = useMatches()
  const currentMatch = matches[matches.length - 1]
  const pageTitle = routeTitles[currentMatch?.fullPath ?? ''] ?? 'Page'

  return (
    <SidebarProvider>
      <AppSidebar
        user={{
          name: session.user.name,
          email: session.user.email,
          image: session.user.image ?? null,
        }}
      />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbPage>{pageTitle}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
