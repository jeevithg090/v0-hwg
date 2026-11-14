import type { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { SimplePage } from "@/components/simple-page"

export const metadata: Metadata = { title: "Page not found" }

export default function NotFound() {
  return (
    <SimplePage
      title="Page not found"
      actions={
        <>
          <Button asChild>
            <Link href="/">Back to home</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/dashboard">Open dashboard</Link>
          </Button>
        </>
      }
    >
      <p>The page you&apos;re looking for doesn&apos;t exist or has moved.</p>
    </SimplePage>
  )
}
