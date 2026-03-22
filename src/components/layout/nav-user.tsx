import {
  BadgeCheck,
  LogOut,
  Moon,
  Sun,
  ChevronsUpDown,
} from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { Link } from '@tanstack/react-router'

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '#/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '#/components/ui/dropdown-menu'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '#/components/ui/sidebar'
import { authClient } from '#/lib/auth-client'

export function NavUser({
  user,
}: {
  user: {
    name: string
    email: string
    image: string | null
  }
}) {
  const { isMobile } = useSidebar()
  const [theme, setTheme] = useState<'light' | 'dark' | 'auto'>('auto')

  useEffect(() => {
    const stored = localStorage.getItem('theme') as
      | 'light'
      | 'dark'
      | 'auto'
      | null
    if (stored === 'light' || stored === 'dark' || stored === 'auto') {
      setTheme(stored)
    }
  }, [])

  const cycleTheme = useCallback(() => {
    const next =
      theme === 'auto' ? 'light' : theme === 'light' ? 'dark' : 'auto'
    setTheme(next)
    localStorage.setItem('theme', next)

    const prefersDark = window.matchMedia(
      '(prefers-color-scheme: dark)',
    ).matches
    const resolved =
      next === 'auto' ? (prefersDark ? 'dark' : 'light') : next
    const root = document.documentElement
    root.classList.remove('light', 'dark')
    root.classList.add(resolved)
    root.style.colorScheme = resolved
    if (next === 'auto') {
      root.removeAttribute('data-theme')
    } else {
      root.setAttribute('data-theme', next)
    }
  }, [theme])

  const initials = user.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={user.image ?? undefined} alt={user.name} />
                <AvatarFallback className="rounded-lg">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user.name}</span>
                <span className="truncate text-xs">{user.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? 'bottom' : 'right'}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage
                    src={user.image ?? undefined}
                    alt={user.name}
                  />
                  <AvatarFallback className="rounded-lg">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{user.name}</span>
                  <span className="truncate text-xs">{user.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <Link to="/profile">
                  <BadgeCheck />
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={cycleTheme}>
                {theme === 'dark' ? <Moon /> : <Sun />}
                Theme: {theme.charAt(0).toUpperCase() + theme.slice(1)}
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                void authClient.signOut()
              }}
            >
              <LogOut />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
