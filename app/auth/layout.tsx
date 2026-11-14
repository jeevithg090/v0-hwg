import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Get Started",
  description: "Sign in or create a TechCollab account.",
}

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-background dark:via-background dark:to-slate-900">
      <main id="main-content" className="container mx-auto flex min-h-screen items-center justify-center px-4 py-8">
        {children}
      </main>
    </div>
  )
}
