export interface EventSummary {
  title: string
  description: string
  type: string
  location: string
  isOnline: boolean
  /** Display price such as "Free" or "$299". */
  price: string
  tags?: string[]
}

export type PriceFilter = "all" | "free" | "paid"

export interface EventFilters {
  search?: string
  /** Event type such as `hackathon`, or `all`. */
  type?: string
  /** `online`, a city slug such as `san-francisco`, or `all`. */
  location?: string
  price?: PriceFilter
}

export function isFreeEvent(event: Pick<EventSummary, "price">): boolean {
  return event.price.trim().toLowerCase() === "free"
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

export function matchesLocation(event: Pick<EventSummary, "location" | "isOnline">, location = "all"): boolean {
  if (location === "all") return true
  if (location === "online") return event.isOnline
  // "San Francisco, CA" -> "san-francisco-ca", which starts with the "san-francisco" filter slug.
  return !event.isOnline && slugify(event.location).startsWith(location)
}

export function matchesEventSearch(event: Pick<EventSummary, "title" | "description" | "tags">, search = ""): boolean {
  const terms = search.toLowerCase().split(/\s+/).filter(Boolean)
  if (terms.length === 0) return true
  const haystack = [event.title, event.description, ...(event.tags ?? [])].join(" ").toLowerCase()
  return terms.every((term) => haystack.includes(term))
}

export function filterEvents<T extends EventSummary>(events: readonly T[], filters: EventFilters): T[] {
  const type = filters.type ?? "all"
  const price = filters.price ?? "all"
  return events.filter(
    (event) =>
      matchesEventSearch(event, filters.search) &&
      (type === "all" || event.type === type) &&
      matchesLocation(event, filters.location) &&
      (price === "all" || (price === "free") === isFreeEvent(event)),
  )
}
