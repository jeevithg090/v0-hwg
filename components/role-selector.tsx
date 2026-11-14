"use client"

import type React from "react"
import { Briefcase, Building, Check, Users } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import type { UserRole } from "@/lib/auth"
import { cn } from "@/lib/utils"

const roleOptions: {
  value: UserRole
  label: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  benefits: string[]
}[] = [
  {
    value: "freelancer",
    label: "Freelancer",
    description: "I want to find projects, showcase my skills, and work with amazing clients",
    icon: Briefcase,
    benefits: ["Find Projects", "Build Portfolio", "Earn Money"],
  },
  {
    value: "client",
    label: "Client",
    description: "I need to hire talented freelancers for my business projects",
    icon: Users,
    benefits: ["Hire Talent", "Manage Projects", "Scale Team"],
  },
  {
    value: "startup",
    label: "Startup",
    description: "I'm building a startup and need to find co-founders and talent",
    icon: Building,
    benefits: ["Find Co-founders", "Build MVP", "Network"],
  },
]

interface RoleSelectorProps {
  selectedRole: UserRole | ""
  onRoleSelect: (role: UserRole) => void
  error?: string
  className?: string
}

export function RoleSelector({ selectedRole, onRoleSelect, error, className }: RoleSelectorProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const keys = ["ArrowDown", "ArrowRight", "ArrowUp", "ArrowLeft"]
    if (!keys.includes(e.key)) return
    e.preventDefault()
    // Move relative to the focused option so arrows work before anything is selected.
    const focusedRole = (document.activeElement as HTMLElement | null)?.dataset.role ?? selectedRole
    const current = Math.max(
      0,
      roleOptions.findIndex((r) => r.value === focusedRole),
    )
    const delta = e.key === "ArrowDown" || e.key === "ArrowRight" ? 1 : -1
    const next = roleOptions[(current + delta + roleOptions.length) % roleOptions.length]!
    onRoleSelect(next.value)
    e.currentTarget.querySelector<HTMLButtonElement>(`[data-role="${next.value}"]`)?.focus()
  }

  return (
    <div className={cn("space-y-4", className)}>
      <div className="text-center">
        <h2 id="role-heading" className="mb-2 text-xl font-semibold">
          What brings you to TechCollab?
        </h2>
        <p className="text-sm text-muted-foreground">Choose the option that best describes you</p>
      </div>

      <div role="radiogroup" aria-labelledby="role-heading" className="grid gap-3" onKeyDown={handleKeyDown}>
        {roleOptions.map((role, index) => {
          const selected = selectedRole === role.value
          const focusable = selected || (!selectedRole && index === 0)
          return (
            <button
              key={role.value}
              type="button"
              role="radio"
              aria-checked={selected}
              aria-labelledby={`role-${role.value}-label`}
              aria-describedby={`role-${role.value}-description`}
              tabIndex={focusable ? 0 : -1}
              data-role={role.value}
              onClick={() => onRoleSelect(role.value)}
              className={cn(
                "relative w-full rounded-lg border-2 p-4 text-left transition-all hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                selected
                  ? "border-blue-500 bg-blue-50 shadow-md dark:bg-blue-950"
                  : "border-border hover:border-muted-foreground/40",
              )}
            >
              <div className="flex items-center space-x-4">
                <div
                  className={cn(
                    "rounded-lg p-3",
                    selected ? "bg-blue-100 dark:bg-blue-900" : "bg-gray-100 dark:bg-gray-800",
                  )}
                >
                  <role.icon
                    className={cn(
                      "h-6 w-6",
                      selected ? "text-blue-600 dark:text-blue-400" : "text-gray-600 dark:text-gray-400",
                    )}
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span id={`role-${role.value}-label`} className="text-lg font-semibold">
                      {role.label}
                    </span>
                    {selected && (
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-500">
                        <Check className="h-4 w-4 text-white" aria-hidden="true" />
                      </span>
                    )}
                  </div>
                  <p id={`role-${role.value}-description`} className="mt-1 text-sm text-muted-foreground">
                    {role.description}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {role.benefits.map((benefit) => (
                      <Badge key={benefit} variant="outline" className="text-xs">
                        {benefit}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </button>
          )
        })}
      </div>

      {error ? (
        <p role="alert" className="text-center text-sm text-destructive">
          {error}
        </p>
      ) : (
        !selectedRole && (
          <p className="text-center text-sm text-muted-foreground">Please select your role to continue</p>
        )
      )}
    </div>
  )
}
