"use client"

import { useEffect, useState } from "react"

/**
 * Tab state that can be pre-selected via `?tab=<value>` (e.g. after a redirect).
 * Reads `window.location` on mount so pages don't need a Suspense boundary.
 */
export function useTabParam<T extends string>(defaultTab: T, allowed: readonly T[]) {
  const [tab, setTab] = useState<T>(defaultTab)

  useEffect(() => {
    const requested = new URLSearchParams(window.location.search).get("tab")
    if (requested && (allowed as readonly string[]).includes(requested)) setTab(requested as T)
    // `allowed` is expected to be a stable literal list.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return [tab, (value: string) => setTab(value as T)] as const
}
