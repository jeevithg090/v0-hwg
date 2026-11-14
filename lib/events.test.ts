import { describe, expect, it } from "vitest"
import { filterEvents, isFreeEvent, matchesLocation, type EventSummary } from "./events"

const events: (EventSummary & { id: number })[] = [
  {
    id: 1,
    title: "AI Innovation Hackathon",
    description: "Build AI for social good",
    type: "hackathon",
    location: "San Francisco, CA",
    isOnline: false,
    price: "Free",
    tags: ["AI", "Machine Learning"],
  },
  {
    id: 2,
    title: "React Advanced Patterns",
    description: "Performance techniques",
    type: "workshop",
    location: "Online",
    isOnline: true,
    price: "$49",
    tags: ["React"],
  },
  {
    id: 3,
    title: "Startup Pitch Night",
    description: "Pitch to investors",
    type: "networking",
    location: "New York, NY",
    isOnline: false,
    price: " free ",
  },
]

const ids = (list: { id: number }[]) => list.map((e) => e.id)

describe("isFreeEvent", () => {
  it("treats 'Free' case-insensitively and anything else as paid", () => {
    expect(isFreeEvent({ price: "Free" })).toBe(true)
    expect(isFreeEvent({ price: " free " })).toBe(true)
    expect(isFreeEvent({ price: "$299" })).toBe(false)
  })
})

describe("matchesLocation", () => {
  it("matches online events and city slugs", () => {
    expect(matchesLocation(events[1]!, "online")).toBe(true)
    expect(matchesLocation(events[0]!, "online")).toBe(false)
    expect(matchesLocation(events[0]!, "san-francisco")).toBe(true)
    expect(matchesLocation(events[2]!, "san-francisco")).toBe(false)
    expect(matchesLocation(events[1]!, "all")).toBe(true)
  })
})

describe("filterEvents", () => {
  it("returns everything with no filters", () => {
    expect(ids(filterEvents(events, {}))).toEqual([1, 2, 3])
  })

  it("filters by type, location, price and search", () => {
    expect(ids(filterEvents(events, { type: "workshop" }))).toEqual([2])
    expect(ids(filterEvents(events, { location: "new-york" }))).toEqual([3])
    expect(ids(filterEvents(events, { price: "free" }))).toEqual([1, 3])
    expect(ids(filterEvents(events, { price: "paid" }))).toEqual([2])
    expect(ids(filterEvents(events, { search: "machine learning" }))).toEqual([1])
  })

  it("combines filters", () => {
    expect(ids(filterEvents(events, { price: "free", location: "online" }))).toEqual([])
    expect(ids(filterEvents(events, { search: "pitch", type: "networking", price: "free" }))).toEqual([3])
  })
})
