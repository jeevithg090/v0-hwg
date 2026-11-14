"use client"

import type React from "react"
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react"
import { getInitials } from "@/lib/auth"
import type { ChatGroup, ChatUser, DirectMessage, Message, MessageType, MessagesByChannel } from "@/lib/chat-types"
import {
  addMember,
  appendMessage,
  findDirectMessage,
  removeMember,
  removeMessage,
  toggleReaction,
  updateMessage,
} from "@/lib/chat-utils"
import { createMockChatData, CURRENT_USER_ID } from "@/lib/mock-chat-data"
import { useUser } from "@/lib/user-context"

export type { ChatGroup, ChatUser, DirectMessage, Message } from "@/lib/chat-types"

interface ChatContextType {
  /** Whether the (simulated) realtime connection is up. */
  isConnected: boolean

  messages: MessagesByChannel
  sendMessage: (content: string, channelId: string, type?: MessageType) => void
  editMessage: (messageId: string, content: string) => void
  deleteMessage: (messageId: string) => void
  addReaction: (messageId: string, emoji: string) => void

  groups: ChatGroup[]
  joinGroup: (groupId: string) => void
  leaveGroup: (groupId: string) => void
  createGroup: (name: string, description: string, type: "public" | "private") => void

  directMessages: DirectMessage[]
  startDirectMessage: (userId: string) => string

  users: Record<string, ChatUser>
  currentUser: ChatUser | null

  activeChannel: string | null
  setActiveChannel: (channelId: string) => void

  typingUsers: Record<string, string[]>
  setTyping: (channelId: string, isTyping: boolean) => void
}

const ChatContext = createContext<ChatContextType | null>(null)

export function useChatContext() {
  const context = useContext(ChatContext)
  if (!context) {
    throw new Error("useChatContext must be used within a ChatProvider")
  }
  return context
}

function newId(prefix = ""): string {
  const random =
    typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
      ? crypto.randomUUID()
      : `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`
  return `${prefix}${random}`
}

/**
 * In-memory chat state seeded with demo data. There is no realtime backend yet;
 * swap the state updates here for socket/API calls when one exists.
 */
export function ChatProvider({ children }: { children: React.ReactNode }) {
  const { user } = useUser()

  const currentUser = useMemo<ChatUser>(
    () => ({
      id: CURRENT_USER_ID,
      name: user?.name ?? "You",
      avatar: getInitials(user?.name),
      status: "online",
    }),
    [user?.name],
  )

  const [seed] = useState(() => createMockChatData(currentUser))
  const [isConnected, setIsConnected] = useState(false)
  const [messages, setMessages] = useState<MessagesByChannel>(seed.messages)
  const [groups, setGroups] = useState<ChatGroup[]>(seed.groups)
  const [directMessages, setDirectMessages] = useState<DirectMessage[]>(seed.directMessages)
  const [activeChannel, setActiveChannel] = useState<string | null>(null)
  const [typingUsers] = useState<Record<string, string[]>>({})

  const users = useMemo(() => ({ ...seed.users, [CURRENT_USER_ID]: currentUser }), [seed.users, currentUser])

  useEffect(() => {
    const timer = setTimeout(() => setIsConnected(true), 500)
    return () => clearTimeout(timer)
  }, [])

  const sendMessage = useCallback(
    (content: string, channelId: string, type: MessageType = "text") => {
      const trimmed = content.trim()
      if (!trimmed) return

      const message: Message = {
        id: newId("msg-"),
        content: trimmed,
        senderId: currentUser.id,
        senderName: currentUser.name,
        senderAvatar: currentUser.avatar,
        timestamp: new Date(),
        type,
      }
      setMessages((prev) => appendMessage(prev, channelId, message))
    },
    [currentUser],
  )

  const editMessage = useCallback((messageId: string, content: string) => {
    setMessages((prev) => updateMessage(prev, messageId, (msg) => ({ ...msg, content, edited: true })))
  }, [])

  const deleteMessage = useCallback((messageId: string) => {
    setMessages((prev) => removeMessage(prev, messageId))
  }, [])

  const addReaction = useCallback(
    (messageId: string, emoji: string) => {
      setMessages((prev) => updateMessage(prev, messageId, (msg) => toggleReaction(msg, emoji, currentUser.id)))
    },
    [currentUser.id],
  )

  const joinGroup = useCallback(
    (groupId: string) => {
      setGroups((prev) => prev.map((group) => (group.id === groupId ? addMember(group, currentUser.id) : group)))
    },
    [currentUser.id],
  )

  const leaveGroup = useCallback(
    (groupId: string) => {
      setGroups((prev) => prev.map((group) => (group.id === groupId ? removeMember(group, currentUser.id) : group)))
    },
    [currentUser.id],
  )

  const createGroup = useCallback(
    (name: string, description: string, type: "public" | "private") => {
      const newGroup: ChatGroup = {
        id: newId("group-"),
        name: name.trim(),
        description: description.trim() || undefined,
        type,
        members: [currentUser.id],
        admins: [currentUser.id],
        createdAt: new Date(),
        unreadCount: 0,
      }
      setGroups((prev) => [...prev, newGroup])
    },
    [currentUser.id],
  )

  const startDirectMessage = useCallback(
    (userId: string): string => {
      const existing = findDirectMessage(directMessages, currentUser.id, userId)
      if (existing) return existing.id

      const newDM: DirectMessage = {
        id: newId("dm-"),
        participants: [currentUser.id, userId],
        unreadCount: 0,
        createdAt: new Date(),
      }
      setDirectMessages((prev) => [...prev, newDM])
      return newDM.id
    },
    [currentUser.id, directMessages],
  )

  // Typing indicators come from other participants; without a backend there is nothing to broadcast.
  const setTyping = useCallback((_channelId: string, _isTyping: boolean) => {}, [])

  const value: ChatContextType = {
    isConnected,
    messages,
    sendMessage,
    editMessage,
    deleteMessage,
    addReaction,
    groups,
    joinGroup,
    leaveGroup,
    createGroup,
    directMessages,
    startDirectMessage,
    users,
    currentUser,
    activeChannel,
    setActiveChannel,
    typingUsers,
    setTyping,
  }

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>
}
