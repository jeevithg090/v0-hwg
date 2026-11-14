"use client"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuBadge,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar"
import type React from "react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { BrandMark } from "@/components/brand"
import { getInitials } from "@/lib/auth"
import { Badge } from "@/components/ui/badge"
import {
  Home,
  Briefcase,
  Calendar,
  MessageCircle,
  Users,
  Settings,
  Bell,
  TrendingUp,
  Star,
  DollarSign,
  User,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useUser } from "@/lib/user-context"

interface NavItem {
  title: string
  url: string
  icon: React.ComponentType<{ className?: string }>
}

export function AppSidebar() {
  const pathname = usePathname()
  const { user, isClient, isFreelancer, isStartup } = useUser()

  const { setOpenMobile } = useSidebar()
  const isHost = isClient || isStartup

  const mainNavItems: NavItem[] = [
    { title: "Dashboard", url: "/dashboard", icon: Home },
    { title: isHost ? "Projects" : "Find Work", url: "/dashboard/freelancing", icon: Briefcase },
    { title: "Events", url: "/dashboard/events", icon: Calendar },
    { title: "Community", url: "/dashboard/community", icon: MessageCircle },
    ...(isFreelancer ? [{ title: "My Profile", url: "/dashboard/freelancing/profile", icon: User }] : []),
  ]

  // Planned sections that don't have pages yet.
  const comingSoon: NavItem[] = [
    { title: "Network", url: "", icon: Users },
    { title: "Analytics", url: "", icon: TrendingUp },
    { title: "Earnings", url: "", icon: DollarSign },
    { title: "Reviews", url: "", icon: Star },
    { title: "Notifications", url: "", icon: Bell },
    { title: "Settings", url: "", icon: Settings },
  ]

  const isActive = (url: string) => (url === "/dashboard" ? pathname === url : pathname.startsWith(url))

  return (
    <Sidebar className="border-r">
      <SidebarHeader className="p-4">
        <BrandMark size="sm" href="/dashboard" />
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNavItems.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)} tooltip={item.title}>
                    <Link href={item.url} onClick={() => setOpenMobile(false)}>
                      <item.icon className="h-4 w-4" aria-hidden="true" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Coming Soon</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {comingSoon.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton disabled aria-disabled="true" tooltip={`${item.title} (coming soon)`}>
                    <item.icon className="h-4 w-4" aria-hidden="true" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                  <SidebarMenuBadge>Soon</SidebarMenuBadge>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <div className="flex items-center space-x-3">
          <Avatar>
            <AvatarFallback>{getInitials(user?.name)}</AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{user?.name || "User"}</p>
            <div className="flex items-center gap-2">
              <p className="truncate text-xs text-muted-foreground">{user?.company || user?.email}</p>
              <Badge variant="secondary" className="text-xs capitalize">
                {user?.role}
              </Badge>
            </div>
          </div>
        </div>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
