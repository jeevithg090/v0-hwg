"use client"

import type React from "react"
import { useEffect, useRef } from "react"
import { usePathname, useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { canHostContent } from "@/lib/auth"
import { useUser } from "@/lib/user-context"

export function FullPageSpinner({ label = "Loading…" }: { label?: string }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex min-h-[50vh] items-center justify-center gap-2 text-muted-foreground"
    >
      <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
      <span>{label}</span>
    </div>
  )
}

/** Redirects to sign-in when there is no active session. */
export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useUser()
  const router = useRouter()
  const pathname = usePathname()

  // Remember whether this guard has seen a session, so signing out goes home instead of to sign-in.
  const hadUser = useRef(false)
  if (user) hadUser.current = true

  useEffect(() => {
    if (isLoading || user) return
    router.replace(hadUser.current ? "/" : `/auth/signin?next=${encodeURIComponent(pathname)}`)
  }, [isLoading, user, router, pathname])

  if (isLoading || !user) return <FullPageSpinner />
  return <>{children}</>
}

/** Restricts a page to clients and startups, sending everyone else to `fallback`. */
export function RequireHost({ children, fallback }: { children: React.ReactNode; fallback: string }) {
  const { user, isLoading } = useUser()
  const router = useRouter()
  const allowed = canHostContent(user?.role)

  useEffect(() => {
    if (!isLoading && !allowed) router.replace(fallback)
  }, [isLoading, allowed, router, fallback])

  if (isLoading || !allowed) return <FullPageSpinner />
  return <>{children}</>
}
