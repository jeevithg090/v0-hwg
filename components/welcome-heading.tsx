"use client"

import { useUser } from "@/lib/user-context"

export function WelcomeHeading() {
  const { user } = useUser()
  const firstName = user?.name.split(" ")[0]
  return <h1 className="text-2xl font-bold sm:text-3xl">Welcome back{firstName ? `, ${firstName}` : ""}! 👋</h1>
}
