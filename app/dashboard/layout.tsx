import type React from "react"
import type { Metadata } from "next"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { RequireAuth } from "@/components/auth-guard"
import { ChatProvider } from "@/lib/chat-context"

export const metadata: Metadata = {
  title: "Dashboard",
  robots: { index: false },
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <RequireAuth>
      <ChatProvider>
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset className="min-w-0">
            <DashboardHeader />
            <main id="main-content" className="flex-1 p-4 sm:p-6">
              {children}
            </main>
          </SidebarInset>
        </SidebarProvider>
      </ChatProvider>
    </RequireAuth>
  )
}
