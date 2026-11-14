export type MessageType = "text" | "image" | "file" | "announcement"

export interface Message {
  id: string
  content: string
  senderId: string
  senderName: string
  senderAvatar?: string
  timestamp: Date
  type: MessageType
  edited?: boolean
  /** Emoji -> ids of users who reacted with it. */
  reactions?: Record<string, string[]>
  replyTo?: string
}

export type MessagesByChannel = Record<string, Message[]>

export interface ChatGroup {
  id: string
  name: string
  description?: string
  type: "public" | "private"
  avatar?: string
  members: string[]
  admins: string[]
  createdAt: Date
  lastMessage?: Message
  unreadCount: number
  category?: string
}

export interface DirectMessage {
  id: string
  participants: string[]
  lastMessage?: Message
  unreadCount: number
  createdAt: Date
}

export interface ChatUser {
  id: string
  name: string
  avatar?: string
  status: "online" | "away" | "offline"
  lastSeen?: Date
}
