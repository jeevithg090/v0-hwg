export type BudgetType = "fixed" | "hourly"

export interface GigSummary {
  title: string
  description: string
  skills: string[]
  category: string
  budget: number
  budgetType: BudgetType
}

interface BudgetRange {
  label: string
  min?: number
  max?: number
}

export const BUDGET_FILTERS = {
  all: { label: "All Budgets" },
  "under-1k": { label: "Under $1,000", min: 0, max: 1_000 },
  "1k-5k": { label: "$1,000 - $5,000", min: 1_000, max: 5_000 },
  "5k-10k": { label: "$5,000 - $10,000", min: 5_000, max: 10_000 },
  "over-10k": { label: "Over $10,000", min: 10_000, max: Infinity },
  hourly: { label: "Hourly rate" },
} as const satisfies Record<string, BudgetRange>

export type BudgetFilter = keyof typeof BUDGET_FILTERS

export interface GigFilters {
  search?: string
  /** Category slug such as `mobile-development`, or `all`. */
  category?: string
  budget?: BudgetFilter
}

/** Converts a display category ("UI/UX Design") to its filter slug ("ui-ux-design"). */
export function slugifyCategory(category: string): string {
  return category
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

/**
 * Fixed-price ranges are inclusive of the lower bound and exclusive of the upper bound.
 * Hourly gigs only match the "all" and "hourly" filters, since a rate isn't comparable to a total.
 */
export function matchesBudget(gig: Pick<GigSummary, "budget" | "budgetType">, filter: BudgetFilter = "all"): boolean {
  if (filter === "all") return true
  if (filter === "hourly") return gig.budgetType === "hourly"
  if (gig.budgetType !== "fixed") return false
  const range: BudgetRange = BUDGET_FILTERS[filter]
  return gig.budget >= (range.min ?? 0) && gig.budget < (range.max ?? Infinity)
}

/** Every whitespace-separated term must appear in the title, description or skills. */
export function matchesSearch(gig: Pick<GigSummary, "title" | "description" | "skills">, search = ""): boolean {
  const terms = search.toLowerCase().split(/\s+/).filter(Boolean)
  if (terms.length === 0) return true
  const haystack = [gig.title, gig.description, ...gig.skills].join(" ").toLowerCase()
  return terms.every((term) => haystack.includes(term))
}

export function filterGigs<T extends GigSummary>(gigs: readonly T[], filters: GigFilters): T[] {
  const category = filters.category ?? "all"
  return gigs.filter(
    (gig) =>
      matchesSearch(gig, filters.search) &&
      (category === "all" || slugifyCategory(gig.category) === category) &&
      matchesBudget(gig, filters.budget),
  )
}

export function formatBudget(gig: Pick<GigSummary, "budget" | "budgetType">): string {
  const amount = `$${gig.budget.toLocaleString("en-US")}`
  return gig.budgetType === "hourly" ? `${amount}/hr` : `${amount} fixed`
}
