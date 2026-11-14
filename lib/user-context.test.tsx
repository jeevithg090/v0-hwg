import { act, renderHook, waitFor } from "@testing-library/react"
import type React from "react"
import { describe, expect, it } from "vitest"
import { ACCOUNTS_STORAGE_KEY, SESSION_STORAGE_KEY, type User } from "./auth"
import { UserProvider, useUser } from "./user-context"

const client: User = {
  id: "c1",
  name: "Grace Hopper",
  email: "grace@navy.mil",
  role: "client",
  company: "Navy",
  verified: false,
  joinedAt: "2026-01-01T00:00:00.000Z",
}

const wrapper = ({ children }: { children: React.ReactNode }) => <UserProvider>{children}</UserProvider>

async function renderUser() {
  const hook = renderHook(() => useUser(), { wrapper })
  await waitFor(() => expect(hook.result.current.isLoading).toBe(false))
  return hook
}

describe("UserProvider", () => {
  it("starts signed out when nothing is stored", async () => {
    const { result } = await renderUser()
    expect(result.current.user).toBeNull()
    expect(result.current.isClient).toBe(false)
  })

  it("restores a persisted session and derives role flags", async () => {
    window.localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(client))
    const { result } = await renderUser()
    expect(result.current.user).toEqual(client)
    expect(result.current.isClient).toBe(true)
    expect(result.current.isFreelancer).toBe(false)
  })

  it("discards a corrupt session instead of crashing", async () => {
    window.localStorage.setItem(SESSION_STORAGE_KEY, "{broken")
    const { result } = await renderUser()
    expect(result.current.user).toBeNull()
    expect(window.localStorage.getItem(SESSION_STORAGE_KEY)).toBeNull()
  })

  it("registers, logs out and signs back in by email", async () => {
    const { result } = await renderUser()

    act(() => result.current.register(client))
    expect(result.current.user).toEqual(client)
    expect(JSON.parse(window.localStorage.getItem(ACCOUNTS_STORAGE_KEY)!)).toEqual([client])

    act(() => result.current.logout())
    expect(result.current.user).toBeNull()
    expect(window.localStorage.getItem(SESSION_STORAGE_KEY)).toBeNull()

    let signedIn: User | null = null
    act(() => {
      signedIn = result.current.signIn("GRACE@navy.mil")
    })
    expect(signedIn).toEqual(client)
    expect(result.current.user).toEqual(client)
  })

  it("returns null when signing in with an unknown email", async () => {
    const { result } = await renderUser()
    let signedIn: User | null = client
    act(() => {
      signedIn = result.current.signIn("nobody@example.com")
    })
    expect(signedIn).toBeNull()
    expect(result.current.user).toBeNull()
  })

  it("throws when used outside the provider", () => {
    expect(() => renderHook(() => useUser())).toThrow(/within a UserProvider/)
  })
})
