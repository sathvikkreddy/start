import {
  createFileRoute,
  Outlet,
  redirect,
  useMatches,
} from '@tanstack/react-router'

import { AppSidebar } from '#/components/layout/app-sidebar'
import { Separator } from '#/components/ui/separator'
import {
  BuddyChatTrigger,
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
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '#/components/ui/resizable'
import { useState } from 'react'
import type { OnPanelResize } from 'react-resizable-panels'
import BuddyChat from '#/features/buddy/buddy-chat'
import { getSession, sessionQueryOptions } from '#/features/auth'
import { authClient } from '#/lib/auth-client'

export const Route = createFileRoute('/_protectedLayout')({
  component: RouteComponent,
  errorComponent: (e) => {
    return (
      <div className="flex justify-center items-center h-full">
        <p>{e.error.message}</p>
      </div>
    )
  },
  beforeLoad: async ({ context }) => {
    const session = await context.queryClient.ensureQueryData(
      sessionQueryOptions(),
    )
    if (!session) {
      console.warn('User not logged in. Redirecting to login')
      throw redirect({ to: '/login' })
    }
    return { session }
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
  const pageTitle = routeTitles[currentMatch.fullPath] ?? 'Page'
  const [buddyChatOpen, setBuddyChatOpen] = useState(true)
  const handleResize: OnPanelResize = (panelSize) => {
    panelSize.asPercentage === 0
      ? setBuddyChatOpen(false)
      : setBuddyChatOpen(true)
  }
  // console.log(session)
  return (
    <SidebarProvider>
      {/* <ResizablePanelGroup className="min-h-svh"> */}
      <AppSidebar user={session.user} />
      {/* <ResizablePanel defaultSize={'50%'}> */}
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
            {/* <Separator
                  orientation="vertical"
                  className="mr-2 data-[orientation=vertical]:h-4"
                />
                <BuddyChatTrigger /> */}
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <Outlet />
        </div>
      </SidebarInset>
      {/* </ResizablePanel> */}
      {/* <ResizableHandle withHandle /> */}
      {/* <ResizablePanel
          defaultValue={'50%'}
          maxSize={'50%'}
          minSize={'25%'}
          className="max-w-svh"
          // onResize={}
          // collapsible
        >
          <BuddyChat />
        </ResizablePanel> */}
      {/* <BuddyChatSidebar /> */}
      {/* </ResizablePanelGroup> */}
    </SidebarProvider>
  )
}
