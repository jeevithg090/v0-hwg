import type React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { BrandMark } from "@/components/brand"

/** Centered single-message page used for 404s, errors and placeholder content. */
export function SimplePage({
  title,
  children,
  actions,
}: {
  title: string
  children: React.ReactNode
  actions?: React.ReactNode
}) {
  return (
    <main
      id="main-content"
      className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 px-4 py-16 dark:from-background dark:via-background dark:to-slate-900"
    >
      <div className="w-full max-w-xl text-center">
        <BrandMark href="/" className="mb-8 justify-center" />
        <h1 className="mb-4 text-3xl font-bold">{title}</h1>
        <div className="space-y-4 text-muted-foreground">{children}</div>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          {actions ?? (
            <Button asChild>
              <Link href="/">Back to home</Link>
            </Button>
          )}
        </div>
      </div>
    </main>
  )
}
