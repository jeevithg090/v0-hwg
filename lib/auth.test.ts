import { describe, expect, it } from "vitest"
import {
  canHostContent,
  createDemoUser,
  createUserFromSignUp,
  findAccountByEmail,
  getInitials,
  parseStoredAccounts,
  parseStoredUser,
  safeRedirectPath,
  upsertAccount,
  validateSignIn,
  validateSignUp,
  type SignUpInput,
  type User,
} from "./auth"

const validInput: SignUpInput = {
  firstName: "Ada",
  lastName: "Lovelace",
  email: "Ada@Example.com ",
  password: "correct-horse",
  confirmPassword: "correct-horse",
  company: "",
  role: "freelancer",
  agreeToTerms: true,
}

const sampleUser: User = {
  id: "u1",
  name: "Ada Lovelace",
  email: "ada@example.com",
  role: "freelancer",
  verified: false,
  joinedAt: "2026-01-01T00:00:00.000Z",
}

describe("validateSignUp", () => {
  it("accepts a complete freelancer sign-up", () => {
    expect(validateSignUp(validInput)).toEqual({})
  })

  it("requires a role", () => {
    expect(validateSignUp({ ...validInput, role: "" }).role).toBeDefined()
  })

  it("requires a company name for clients and startups only", () => {
    expect(validateSignUp({ ...validInput, role: "client" }).company).toBe("Company name is required.")
    expect(validateSignUp({ ...validInput, role: "startup" }).company).toBe("Startup name is required.")
    expect(validateSignUp({ ...validInput, role: "startup", company: "Acme" }).company).toBeUndefined()
    expect(validateSignUp({ ...validInput, role: "freelancer" }).company).toBeUndefined()
  })

  it("flags mismatched and short passwords", () => {
    const errors = validateSignUp({ ...validInput, password: "short", confirmPassword: "different" })
    expect(errors.password).toMatch(/at least 8/)
    expect(errors.confirmPassword).toBe("Passwords don't match.")
  })

  it("flags invalid email, blank names and unaccepted terms", () => {
    const errors = validateSignUp({ ...validInput, email: "nope", firstName: "  ", lastName: "", agreeToTerms: false })
    expect(Object.keys(errors).sort()).toEqual(["agreeToTerms", "email", "firstName", "lastName"])
  })
})

describe("validateSignIn", () => {
  it("returns an error for bad input and null when valid", () => {
    expect(validateSignIn("bad", "x")).toMatch(/valid email/)
    expect(validateSignIn("a@b.co", "")).toMatch(/password/)
    expect(validateSignIn("a@b.co", "secret")).toBeNull()
  })
})

describe("createUserFromSignUp", () => {
  const now = new Date("2026-03-04T05:06:07.000Z")

  it("builds a normalized user without storing the password", () => {
    const user = createUserFromSignUp(validInput, { id: "fixed", now })
    expect(user).toEqual({
      id: "fixed",
      name: "Ada Lovelace",
      email: "ada@example.com",
      role: "freelancer",
      verified: false,
      joinedAt: now.toISOString(),
    })
    expect(JSON.stringify(user)).not.toContain(validInput.password)
  })

  it("keeps the company only for roles that use it", () => {
    expect(createUserFromSignUp({ ...validInput, role: "client", company: " Acme " }, { now }).company).toBe("Acme")
    expect(createUserFromSignUp({ ...validInput, company: "Ignored" }, { now }).company).toBeUndefined()
  })

  it("throws without a role", () => {
    expect(() => createUserFromSignUp({ ...validInput, role: "" })).toThrow()
  })

  it("generates unique ids by default", () => {
    expect(createUserFromSignUp(validInput).id).not.toBe(createUserFromSignUp(validInput).id)
  })
})

describe("createDemoUser", () => {
  it("creates a freelancer account labelled with the provider", () => {
    const user = createDemoUser("github", { id: "d1" })
    expect(user).toMatchObject({ id: "d1", name: "Github Demo User", role: "freelancer" })
    expect(user.email).toBe("demo+github@techcollab.dev")
  })
})

describe("role helpers", () => {
  it("only lets clients and startups host content", () => {
    expect(canHostContent("client")).toBe(true)
    expect(canHostContent("startup")).toBe(true)
    expect(canHostContent("freelancer")).toBe(false)
    expect(canHostContent(null)).toBe(false)
  })
})

describe("getInitials", () => {
  it.each([
    ["Ada Lovelace", "AL"],
    ["  grace   brewster hopper ", "GB"],
    ["cher", "C"],
    ["", "U"],
    [undefined, "U"],
  ])("%s -> %s", (name, expected) => {
    expect(getInitials(name)).toBe(expected)
  })
})

describe("storage parsing", () => {
  it("parses a valid stored user", () => {
    expect(parseStoredUser(JSON.stringify(sampleUser))).toEqual(sampleUser)
  })

  it("returns null for missing, corrupt or invalid data", () => {
    expect(parseStoredUser(null)).toBeNull()
    expect(parseStoredUser("{not json")).toBeNull()
    expect(parseStoredUser(JSON.stringify({ ...sampleUser, role: "admin" }))).toBeNull()
    expect(parseStoredUser(JSON.stringify("string"))).toBeNull()
  })

  it("keeps only valid accounts", () => {
    const raw = JSON.stringify([sampleUser, { id: 1 }, null])
    expect(parseStoredAccounts(raw)).toEqual([sampleUser])
    expect(parseStoredAccounts("oops")).toEqual([])
    expect(parseStoredAccounts(JSON.stringify({}))).toEqual([])
  })
})

describe("account registry", () => {
  it("upserts by case-insensitive email", () => {
    const updated = { ...sampleUser, id: "u2", email: "ADA@example.com", name: "Ada L." }
    const accounts = upsertAccount([sampleUser], updated)
    expect(accounts).toEqual([updated])
  })

  it("finds accounts regardless of email case and whitespace", () => {
    expect(findAccountByEmail([sampleUser], "  ADA@EXAMPLE.COM ")).toEqual(sampleUser)
    expect(findAccountByEmail([sampleUser], "other@example.com")).toBeUndefined()
  })
})

describe("safeRedirectPath", () => {
  it("allows same-origin relative paths", () => {
    expect(safeRedirectPath("/dashboard/events?tab=hosting")).toBe("/dashboard/events?tab=hosting")
  })

  it.each([null, "", "https://evil.example", "//evil.example", "/\\evil.example", "dashboard"])(
    "falls back for %s",
    (next) => {
      expect(safeRedirectPath(next)).toBe("/dashboard")
    },
  )
})
