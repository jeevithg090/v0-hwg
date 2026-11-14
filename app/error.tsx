"use client"

import { useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { SimplePage } from "@/components/simple-page"

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <SimplePage
      title="Something went wrong"
      actions={
        <>
          <Button onClick={reset}>Try again</Button>
          <Button variant="outline" asChild>
            <Link href="/">Back to home</Link>
          </Button>
        </>
      }
    >
      <p>An unexpected error occurred while loading this page.</p>
      {error.digest && <p className="text-xs">Reference: {error.digest}</p>}
    </SimplePage>
  )
}
