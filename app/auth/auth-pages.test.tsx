import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { ACCOUNTS_STORAGE_KEY, SESSION_STORAGE_KEY, type User } from "@/lib/auth"
import { UserProvider } from "@/lib/user-context"
import SignInPage from "./signin/page"
import SignUpPage from "./signup/page"

const push = vi.fn()
let searchParams = new URLSearchParams()

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push, replace: push, back: vi.fn(), prefetch: vi.fn() }),
  useSearchParams: () => searchParams,
  usePathname: () => "/auth",
}))

function renderWithUser(ui: React.ReactElement) {
  return render(<UserProvider>{ui}</UserProvider>)
}

beforeEach(() => {
  push.mockReset()
  searchParams = new URLSearchParams()
})

describe("SignUpPage", () => {
  it("shows validation errors and does not create an account", async () => {
    const user = userEvent.setup()
    renderWithUser(<SignUpPage />)

    await user.click(screen.getByRole("radio", { name: /client/i }))
    await user.click(screen.getByRole("button", { name: /create client account/i }))

    expect(screen.getByText("First name is required.")).toBeInTheDocument()
    expect(screen.getByText("Company name is required.")).toBeInTheDocument()
    expect(screen.getByText("You must accept the terms to continue.")).toBeInTheDocument()
    expect(push).not.toHaveBeenCalled()
    expect(window.localStorage.getItem(SESSION_STORAGE_KEY)).toBeNull()
  })

  it("creates a session with the chosen role and redirects to the dashboard", async () => {
    const user = userEvent.setup()
    renderWithUser(<SignUpPage />)

    await user.click(screen.getByRole("radio", { name: /startup/i }))
    await user.type(screen.getByLabelText(/first name/i), "Ada")
    await user.type(screen.getByLabelText(/last name/i), "Lovelace")
    await user.type(screen.getByLabelText(/email address/i), "ada@example.com")
    await user.type(screen.getByLabelText(/startup name/i), "Analytical Engines")
    await user.type(screen.getByLabelText(/^password/i), "difference-engine")
    await user.type(screen.getByLabelText(/confirm password/i), "difference-engine")
    await user.click(screen.getByRole("checkbox"))
    await user.click(screen.getByRole("button", { name: /create startup account/i }))

    expect(push).toHaveBeenCalledWith("/dashboard")
    const stored = JSON.parse(window.localStorage.getItem(SESSION_STORAGE_KEY)!) as User
    expect(stored).toMatchObject({
      name: "Ada Lovelace",
      email: "ada@example.com",
      role: "startup",
      company: "Analytical Engines",
    })
    expect(window.localStorage.getItem(SESSION_STORAGE_KEY)).not.toContain("difference-engine")
  })

  it("supports keyboard selection of roles", async () => {
    const user = userEvent.setup()
    renderWithUser(<SignUpPage />)

    const freelancer = screen.getByRole("radio", { name: /freelancer/i })
    freelancer.focus()
    await user.keyboard("{ArrowDown}")

    expect(screen.getByRole("radio", { name: /client/i })).toHaveAttribute("aria-checked", "true")
    expect(screen.getByRole("radio", { name: /client/i })).toHaveFocus()
  })
})

describe("SignInPage", () => {
  const account: User = {
    id: "a1",
    name: "Ada Lovelace",
    email: "ada@example.com",
    role: "freelancer",
    verified: false,
    joinedAt: "2026-01-01T00:00:00.000Z",
  }

  it("signs in a registered account and honours a safe ?next redirect", async () => {
    window.localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify([account]))
    searchParams = new URLSearchParams({ next: "/dashboard/events" })
    const user = userEvent.setup()
    renderWithUser(<SignInPage />)

    await user.type(screen.getByLabelText("Email"), "ADA@example.com")
    await user.type(screen.getByLabelText("Password"), "whatever")
    await user.click(screen.getByRole("button", { name: /^sign in$/i }))

    expect(push).toHaveBeenCalledWith("/dashboard/events")
    expect(JSON.parse(window.localStorage.getItem(SESSION_STORAGE_KEY)!)).toEqual(account)
  })

  it("ignores an off-site ?next redirect", async () => {
    window.localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify([account]))
    searchParams = new URLSearchParams({ next: "https://evil.example" })
    const user = userEvent.setup()
    renderWithUser(<SignInPage />)

    await user.type(screen.getByLabelText("Email"), "ada@example.com")
    await user.type(screen.getByLabelText("Password"), "whatever")
    await user.click(screen.getByRole("button", { name: /^sign in$/i }))

    expect(push).toHaveBeenCalledWith("/dashboard")
  })

  it("shows an error for an unknown account", async () => {
    const user = userEvent.setup()
    renderWithUser(<SignInPage />)

    await user.type(screen.getByLabelText("Email"), "nobody@example.com")
    await user.type(screen.getByLabelText("Password"), "whatever")
    await user.click(screen.getByRole("button", { name: /^sign in$/i }))

    await waitFor(() => expect(screen.getByText(/no account found/i)).toBeInTheDocument())
    expect(push).not.toHaveBeenCalled()
  })
})
