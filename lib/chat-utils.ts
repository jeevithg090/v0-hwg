import type { ChatGroup, DirectMessage, Message, MessagesByChannel } from "@/lib/chat-types"

/** Adds `userId` to the emoji's reaction list, or removes it if already present. Empty lists are dropped. */
export function toggleReaction(message: Message, emoji: string, userId: string): Message {
  const reactions = { ...(message.reactions ?? {}) }
  const current = reactions[emoji] ?? []

  if (current.includes(userId)) {
    const remaining = current.filter((id) => id !== userId)
    if (remaining.length === 0) delete reactions[emoji]
    else reactions[emoji] = remaining
  } else {
    reactions[emoji] = [...current, userId]
  }

  return { ...message, reactions }
}

/** Applies `update` to the message with `messageId` in whichever channel holds it. */
export function updateMessage(
  messages: MessagesByChannel,
  messageId: string,
  update: (message: Message) => Message,
): MessagesByChannel {
  const next: MessagesByChannel = {}
  for (const [channelId, list] of Object.entries(messages)) {
    next[channelId] = list.map((msg) => (msg.id === messageId ? update(msg) : msg))
  }
  return next
}

export function removeMessage(messages: MessagesByChannel, messageId: string): MessagesByChannel {
  const next: MessagesByChannel = {}
  for (const [channelId, list] of Object.entries(messages)) {
    next[channelId] = list.filter((msg) => msg.id !== messageId)
  }
  return next
}

export function appendMessage(messages: MessagesByChannel, channelId: string, message: Message): MessagesByChannel {
  return { ...messages, [channelId]: [...(messages[channelId] ?? []), message] }
}

export function addMember(group: ChatGroup, userId: string): ChatGroup {
  return group.members.includes(userId) ? group : { ...group, members: [...group.members, userId] }
}

export function removeMember(group: ChatGroup, userId: string): ChatGroup {
  return {
    ...group,
    members: group.members.filter((id) => id !== userId),
    admins: group.admins.filter((id) => id !== userId),
  }
}

export function findDirectMessage(
  directMessages: readonly DirectMessage[],
  userA: string,
  userB: string,
): DirectMessage | undefined {
  return directMessages.find(
    (dm) => dm.participants.length === 2 && dm.participants.includes(userA) && dm.participants.includes(userB),
  )
}

export function getOtherParticipant(dm: DirectMessage, currentUserId: string): string | undefined {
  return dm.participants.find((id) => id !== currentUserId)
}

/** Formats a typing indicator such as "Alice is typing..." or "Alice and Bob are typing...". */
export function formatTypingIndicator(names: readonly string[]): string {
  if (names.length === 0) return ""
  if (names.length === 1) return `${names[0]} is typing...`
  if (names.length === 2) return `${names[0]} and ${names[1]} are typing...`
  return `${names[0]} and ${names.length - 1} others are typing...`
}
