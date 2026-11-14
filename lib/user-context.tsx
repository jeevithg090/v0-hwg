"use client"

import type React from "react"
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react"
import {
  ACCOUNTS_STORAGE_KEY,
  SESSION_STORAGE_KEY,
  findAccountByEmail,
  parseStoredAccounts,
  parseStoredUser,
  upsertAccount,
  type User,
} from "@/lib/auth"

export type { User, UserRole } from "@/lib/auth"

interface UserContextType {
  user: User | null
  /** True until the persisted session has been read on the client. */
  isLoading: boolean
  isClient: boolean
  isFreelancer: boolean
  isStartup: boolean
  /** Persists a new account and starts a session for it. */
  register: (user: User) => void
  /** Starts a session for a previously registered email. Returns the user, or null if none exists. */
  signIn: (email: string) => User | null
  /** Starts a session for an arbitrary user (used by the demo social login). */
  setUser: (user: User) => void
  logout: () => void
}

const UserContext = createContext<UserContextType | undefined>(undefined)

function readStorage(key: string): string | null {
  try {
    return window.localStorage.getItem(key)
  } catch {
    return null
  }
}

function writeStorage(key: string, value: string | null) {
  try {
    if (value === null) window.localStorage.removeItem(key)
    else window.localStorage.setItem(key, value)
  } catch {
    // Storage can be unavailable (private mode, quota); the session stays in memory.
  }
}

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUserState] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const stored = parseStoredUser(readStorage(SESSION_STORAGE_KEY))
    if (!stored) writeStorage(SESSION_STORAGE_KEY, null)
    setUserState(stored)
    setIsLoading(false)
  }, [])

  const setUser = useCallback((next: User) => {
    setUserState(next)
    writeStorage(SESSION_STORAGE_KEY, JSON.stringify(next))
  }, [])

  const register = useCallback(
    (next: User) => {
      const accounts = parseStoredAccounts(readStorage(ACCOUNTS_STORAGE_KEY))
      writeStorage(ACCOUNTS_STORAGE_KEY, JSON.stringify(upsertAccount(accounts, next)))
      setUser(next)
    },
    [setUser],
  )

  const signIn = useCallback(
    (email: string) => {
      const account = findAccountByEmail(parseStoredAccounts(readStorage(ACCOUNTS_STORAGE_KEY)), email)
      if (!account) return null
      setUser(account)
      return account
    },
    [setUser],
  )

  const logout = useCallback(() => {
    setUserState(null)
    writeStorage(SESSION_STORAGE_KEY, null)
  }, [])

  const value = useMemo<UserContextType>(
    () => ({
      user,
      isLoading,
      isClient: user?.role === "client",
      isFreelancer: user?.role === "freelancer",
      isStartup: user?.role === "startup",
      register,
      signIn,
      setUser,
      logout,
    }),
    [user, isLoading, register, signIn, setUser, logout],
  )

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider")
  }
  return context
}
