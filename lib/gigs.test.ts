import { describe, expect, it } from "vitest"
import { filterGigs, formatBudget, matchesBudget, matchesSearch, slugifyCategory, type GigSummary } from "./gigs"

const gigs: (GigSummary & { id: string })[] = [
  {
    id: "mobile",
    title: "React Native E-commerce App",
    description: "Cross-platform shopping app with payments",
    skills: ["React Native", "Stripe"],
    category: "Mobile Development",
    budget: 5000,
    budgetType: "fixed",
  },
  {
    id: "data",
    title: "Analytics Dashboard",
    description: "Machine learning insights",
    skills: ["Python", "D3.js"],
    category: "Data Science",
    budget: 75,
    budgetType: "hourly",
  },
  {
    id: "design",
    title: "Landing page redesign",
    description: "Fresh look for a SaaS site",
    skills: ["Figma"],
    category: "UI/UX Design",
    budget: 800,
    budgetType: "fixed",
  },
]

describe("slugifyCategory", () => {
  it("matches the slugs used by the category filter", () => {
    expect(slugifyCategory("Mobile Development")).toBe("mobile-development")
    expect(slugifyCategory("UI/UX Design")).toBe("ui-ux-design")
    expect(slugifyCategory("  Data Science ")).toBe("data-science")
  })
})

describe("matchesBudget", () => {
  it("uses inclusive lower and exclusive upper bounds for fixed budgets", () => {
    expect(matchesBudget({ budget: 1000, budgetType: "fixed" }, "under-1k")).toBe(false)
    expect(matchesBudget({ budget: 1000, budgetType: "fixed" }, "1k-5k")).toBe(true)
    expect(matchesBudget({ budget: 5000, budgetType: "fixed" }, "5k-10k")).toBe(true)
    expect(matchesBudget({ budget: 250000, budgetType: "fixed" }, "over-10k")).toBe(true)
  })

  it("never puts hourly rates into fixed-price ranges", () => {
    expect(matchesBudget({ budget: 75, budgetType: "hourly" }, "under-1k")).toBe(false)
    expect(matchesBudget({ budget: 75, budgetType: "hourly" }, "hourly")).toBe(true)
    expect(matchesBudget({ budget: 75, budgetType: "hourly" }, "all")).toBe(true)
    expect(matchesBudget({ budget: 500, budgetType: "fixed" }, "hourly")).toBe(false)
  })
})

describe("matchesSearch", () => {
  it("matches every term case-insensitively across title, description and skills", () => {
    expect(matchesSearch(gigs[0]!, "react stripe")).toBe(true)
    expect(matchesSearch(gigs[0]!, "  PAYMENTS ")).toBe(true)
    expect(matchesSearch(gigs[0]!, "react python")).toBe(false)
    expect(matchesSearch(gigs[0]!, "")).toBe(true)
  })
})

describe("filterGigs", () => {
  const ids = (list: { id: string }[]) => list.map((g) => g.id)

  it("returns everything with default filters", () => {
    expect(ids(filterGigs(gigs, {}))).toEqual(["mobile", "data", "design"])
  })

  it("combines search, category and budget filters", () => {
    expect(ids(filterGigs(gigs, { category: "ui-ux-design" }))).toEqual(["design"])
    expect(ids(filterGigs(gigs, { budget: "under-1k" }))).toEqual(["design"])
    expect(ids(filterGigs(gigs, { budget: "hourly", search: "python" }))).toEqual(["data"])
    expect(ids(filterGigs(gigs, { category: "data-science", budget: "1k-5k" }))).toEqual([])
  })

  it("does not mutate the input", () => {
    const copy = [...gigs]
    filterGigs(gigs, { search: "react" })
    expect(gigs).toEqual(copy)
  })
})

describe("formatBudget", () => {
  it("formats fixed and hourly budgets", () => {
    expect(formatBudget({ budget: 12500, budgetType: "fixed" })).toBe("$12,500 fixed")
    expect(formatBudget({ budget: 75, budgetType: "hourly" })).toBe("$75/hr")
  })
})
