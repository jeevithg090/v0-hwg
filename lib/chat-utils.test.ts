import { describe, expect, it } from "vitest"
import type { ChatGroup, DirectMessage, Message, MessagesByChannel } from "./chat-types"
import {
  addMember,
  appendMessage,
  findDirectMessage,
  formatTypingIndicator,
  getOtherParticipant,
  removeMember,
  removeMessage,
  toggleReaction,
  updateMessage,
} from "./chat-utils"

const message = (id: string, extra: Partial<Message> = {}): Message => ({
  id,
  content: `message ${id}`,
  senderId: "alice",
  senderName: "Alice",
  timestamp: new Date(0),
  type: "text",
  ...extra,
})

const group: ChatGroup = {
  id: "g1",
  name: "General",
  type: "public",
  members: ["me", "alice"],
  admins: ["me"],
  createdAt: new Date(0),
  unreadCount: 0,
}

describe("toggleReaction", () => {
  it("adds a reaction for a new emoji", () => {
    expect(toggleReaction(message("1"), "🚀", "me").reactions).toEqual({ "🚀": ["me"] })
  })

  it("appends to an existing emoji without mutating the original", () => {
    const original = message("1", { reactions: { "🚀": ["bob"] } })
    const updated = toggleReaction(original, "🚀", "me")
    expect(updated.reactions).toEqual({ "🚀": ["bob", "me"] })
    expect(original.reactions).toEqual({ "🚀": ["bob"] })
  })

  it("removes the user's reaction and drops empty emoji lists", () => {
    const original = message("1", { reactions: { "🚀": ["me"], "👏": ["me", "bob"] } })
    const once = toggleReaction(original, "🚀", "me")
    expect(once.reactions).toEqual({ "👏": ["me", "bob"] })
    expect(toggleReaction(once, "👏", "me").reactions).toEqual({ "👏": ["bob"] })
  })
})

describe("message collection helpers", () => {
  const messages: MessagesByChannel = { a: [message("1"), message("2")], b: [message("3")] }

  it("appends to new and existing channels", () => {
    expect(appendMessage(messages, "a", message("4")).a!.map((m) => m.id)).toEqual(["1", "2", "4"])
    expect(appendMessage(messages, "c", message("5")).c!.map((m) => m.id)).toEqual(["5"])
    expect(messages.a).toHaveLength(2)
  })

  it("updates a message wherever it lives", () => {
    const next = updateMessage(messages, "3", (m) => ({ ...m, content: "edited", edited: true }))
    expect(next.b![0]).toMatchObject({ content: "edited", edited: true })
    expect(next.a).toEqual(messages.a)
    expect(messages.b![0]!.content).toBe("message 3")
  })

  it("removes a message by id", () => {
    const next = removeMessage(messages, "2")
    expect(next.a!.map((m) => m.id)).toEqual(["1"])
    expect(next.b).toHaveLength(1)
  })
})

describe("group membership", () => {
  it("adds a member only once", () => {
    expect(addMember(group, "bob").members).toEqual(["me", "alice", "bob"])
    expect(addMember(group, "alice")).toBe(group)
  })

  it("removes a member from members and admins", () => {
    const next = removeMember(group, "me")
    expect(next.members).toEqual(["alice"])
    expect(next.admins).toEqual([])
  })
})

describe("direct messages", () => {
  const dms: DirectMessage[] = [
    { id: "dm-1", participants: ["me", "alice"], unreadCount: 0, createdAt: new Date(0) },
    { id: "dm-2", participants: ["bob", "me"], unreadCount: 0, createdAt: new Date(0) },
  ]

  it("finds an existing conversation regardless of participant order", () => {
    expect(findDirectMessage(dms, "me", "bob")?.id).toBe("dm-2")
    expect(findDirectMessage(dms, "alice", "me")?.id).toBe("dm-1")
    expect(findDirectMessage(dms, "me", "carol")).toBeUndefined()
  })

  it("returns the other participant", () => {
    expect(getOtherParticipant(dms[0]!, "me")).toBe("alice")
  })
})

describe("formatTypingIndicator", () => {
  it.each([
    [[], ""],
    [["Alice"], "Alice is typing..."],
    [["Alice", "Bob"], "Alice and Bob are typing..."],
    [["Alice", "Bob", "Carol"], "Alice and 2 others are typing..."],
  ])("%j", (names, expected) => {
    expect(formatTypingIndicator(names)).toBe(expected)
  })
})
