/**
 * Client-side demo authentication.
 *
 * TechCollab ships without a backend: accounts live in the browser's
 * localStorage so the role-based UI can be explored end to end. Passwords are
 * validated for shape but never stored. Replace this module with a real auth
 * provider before handling real users.
 */

export const USER_ROLES = ["freelancer", "client", "startup"] as const
export type UserRole = (typeof USER_ROLES)[number]

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  avatar?: string
  company?: string
  verified: boolean
  joinedAt: string
}

export interface SignUpInput {
  firstName: string
  lastName: string
  email: string
  password: string
  confirmPassword: string
  company: string
  role: UserRole | ""
  agreeToTerms: boolean
}

export type SignUpErrors = Partial<Record<keyof SignUpInput, string>>

export const SESSION_STORAGE_KEY = "techcollab_user"
export const ACCOUNTS_STORAGE_KEY = "techcollab_accounts"
export const MIN_PASSWORD_LENGTH = 8

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function isUserRole(value: unknown): value is UserRole {
  return typeof value === "string" && (USER_ROLES as readonly string[]).includes(value)
}

export function roleRequiresCompany(role: UserRole | ""): boolean {
  return role === "client" || role === "startup"
}

/** Roles allowed to post projects and host events. */
export function canHostContent(role: UserRole | undefined | null): boolean {
  return role === "client" || role === "startup"
}

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase()
}

export function isValidEmail(email: string): boolean {
  return EMAIL_PATTERN.test(email.trim())
}

export function validateSignUp(input: SignUpInput): SignUpErrors {
  const errors: SignUpErrors = {}

  if (!isUserRole(input.role)) errors.role = "Select a role to continue."
  if (!input.firstName.trim()) errors.firstName = "First name is required."
  if (!input.lastName.trim()) errors.lastName = "Last name is required."
  if (!isValidEmail(input.email)) errors.email = "Enter a valid email address."
  if (roleRequiresCompany(input.role) && !input.company.trim()) {
    errors.company = input.role === "startup" ? "Startup name is required." : "Company name is required."
  }
  if (input.password.length < MIN_PASSWORD_LENGTH) {
    errors.password = `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`
  }
  if (input.password !== input.confirmPassword) errors.confirmPassword = "Passwords don't match."
  if (!input.agreeToTerms) errors.agreeToTerms = "You must accept the terms to continue."

  return errors
}

export function validateSignIn(email: string, password: string): string | null {
  if (!isValidEmail(email)) return "Enter a valid email address."
  if (!password) return "Enter your password."
  return null
}

export function createUserFromSignUp(input: SignUpInput, options: { id?: string; now?: Date } = {}): User {
  if (!isUserRole(input.role)) throw new Error("A valid role is required to create a user")

  const company = roleRequiresCompany(input.role) ? input.company.trim() : undefined

  return {
    id: options.id ?? generateId(),
    name: `${input.firstName.trim()} ${input.lastName.trim()}`,
    email: normalizeEmail(input.email),
    role: input.role,
    ...(company ? { company } : {}),
    verified: false,
    joinedAt: (options.now ?? new Date()).toISOString(),
  }
}

/** Builds a throwaway account for the "continue with GitHub/Google" demo buttons. */
export function createDemoUser(provider: string, options: { id?: string; now?: Date } = {}): User {
  const label = provider.charAt(0).toUpperCase() + provider.slice(1)
  return {
    id: options.id ?? generateId(),
    name: `${label} Demo User`,
    email: `demo+${provider.toLowerCase()}@techcollab.dev`,
    role: "freelancer",
    verified: false,
    joinedAt: (options.now ?? new Date()).toISOString(),
  }
}

export function getInitials(name: string | undefined | null, fallback = "U"): string {
  const initials = (name ?? "")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]!.toUpperCase())
    .join("")
  return initials || fallback
}

function isUser(value: unknown): value is User {
  if (typeof value !== "object" || value === null) return false
  const candidate = value as Record<string, unknown>
  return (
    typeof candidate.id === "string" &&
    typeof candidate.name === "string" &&
    typeof candidate.email === "string" &&
    isUserRole(candidate.role) &&
    typeof candidate.verified === "boolean" &&
    typeof candidate.joinedAt === "string"
  )
}

/** Parses a persisted user, returning null for missing, corrupt or outdated data. */
export function parseStoredUser(raw: string | null): User | null {
  if (!raw) return null
  try {
    const parsed: unknown = JSON.parse(raw)
    return isUser(parsed) ? parsed : null
  } catch {
    return null
  }
}

export function parseStoredAccounts(raw: string | null): User[] {
  if (!raw) return []
  try {
    const parsed: unknown = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed.filter(isUser) : []
  } catch {
    return []
  }
}

/** Adds or replaces an account (matched by email). */
export function upsertAccount(accounts: User[], user: User): User[] {
  const email = normalizeEmail(user.email)
  return [...accounts.filter((account) => normalizeEmail(account.email) !== email), user]
}

export function findAccountByEmail(accounts: User[], email: string): User | undefined {
  const target = normalizeEmail(email)
  return accounts.find((account) => normalizeEmail(account.email) === target)
}

/** Only allow same-origin relative redirects to avoid open-redirect issues. */
export function safeRedirectPath(next: string | null | undefined, fallback = "/dashboard"): string {
  if (!next || !next.startsWith("/") || next.startsWith("//") || next.startsWith("/\\")) return fallback
  return next
}

function generateId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") return crypto.randomUUID()
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`
}
