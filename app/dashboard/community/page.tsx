"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  MessageCircle,
  Users,
  Hash,
  Plus,
  Search,
  Send,
  Smile,
  Paperclip,
  Phone,
  Video,
  MoreVertical,
  Settings,
  UserPlus,
  Lock,
  Globe,
  Pin,
  Edit,
  Trash,
  Reply,
  ImageIcon,
  File,
  Mic,
  Camera,
  Gift,
  Bell,
  Zap,
} from "lucide-react"
import { useState, useRef, useEffect } from "react"
import { useChatContext } from "@/lib/chat-context"
import { formatTypingIndicator } from "@/lib/chat-utils"

function CommunityContent() {
  const {
    isConnected,
    messages,
    sendMessage,
    addReaction,
    groups,
    directMessages,
    users,
    currentUser,
    activeChannel,
    setActiveChannel,
    typingUsers,
    setTyping,
    startDirectMessage,
    createGroup,
    leaveGroup,
  } = useChatContext()

  const [message, setMessage] = useState("")
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [showCreateGroup, setShowCreateGroup] = useState(false)
  const [newGroupName, setNewGroupName] = useState("")
  const [newGroupDescription, setNewGroupDescription] = useState("")
  const [newGroupType, setNewGroupType] = useState<"public" | "private">("public")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTab, setSelectedTab] = useState("groups")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, activeChannel])

  const handleSendMessage = () => {
    if (!message.trim() || !activeChannel) return

    sendMessage(message, activeChannel)
    setMessage("")

    // Clear typing indicator
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }
    setTyping(activeChannel, false)
  }

  const handleTyping = (value: string) => {
    setMessage(value)

    if (!activeChannel) return

    // Set typing indicator
    setTyping(activeChannel, true)

    // Clear previous timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }

    // Clear typing after 3 seconds of inactivity
    typingTimeoutRef.current = setTimeout(() => {
      setTyping(activeChannel, false)
    }, 3000)
  }

  const handleCreateGroup = () => {
    if (!newGroupName.trim()) return

    createGroup(newGroupName, newGroupDescription, newGroupType)
    setNewGroupName("")
    setNewGroupDescription("")
    setShowCreateGroup(false)
  }

  const handleStartDM = (userId: string) => {
    const dmId = startDirectMessage(userId)
    setActiveChannel(dmId)
    setSelectedTab("dms")
  }

  const getChannelName = (channelId: string) => {
    const group = groups.find((g) => g.id === channelId)
    if (group) return group.name

    const dm = directMessages.find((d) => d.id === channelId)
    if (dm && currentUser) {
      const otherUserId = dm.participants.find((id) => id !== currentUser.id)
      const otherUser = users[otherUserId || ""]
      return otherUser?.name || "Unknown User"
    }

    return "Unknown Channel"
  }

  const getChannelType = (channelId: string) => {
    const group = groups.find((g) => g.id === channelId)
    if (group) return "group"

    const dm = directMessages.find((d) => d.id === channelId)
    if (dm) return "dm"

    return "unknown"
  }

  const currentMessages = activeChannel ? messages[activeChannel] || [] : []
  const currentTypingUsers = activeChannel ? typingUsers[activeChannel] || [] : []

  const filteredGroups = groups.filter(
    (group) =>
      group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      group.description?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const filteredDMs = directMessages.filter((dm) => {
    if (!currentUser) return false
    const otherUserId = dm.participants.find((id) => id !== currentUser.id)
    const otherUser = users[otherUserId || ""]
    return otherUser?.name.toLowerCase().includes(searchTerm.toLowerCase())
  })

  const emojis = ["👍", "❤️", "😂", "😮", "😢", "😡", "🎉", "🚀", "👏", "🔥"]

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">Community Hub</h1>
          <p className="flex items-center gap-2 text-muted-foreground">
            Connect and collaborate with the tech community
            <div className={`h-2 w-2 rounded-full ${isConnected ? "bg-green-500" : "bg-red-500"}`}></div>
            <span className="text-xs">{isConnected ? "Connected" : "Disconnected"}</span>
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <UserPlus className="h-4 w-4" />
            Invite Members
          </Button>
          <Button className="gap-2" onClick={() => setShowCreateGroup(true)}>
            <Plus className="h-4 w-4" />
            Create Group
          </Button>
        </div>
      </div>

      <div className="grid h-[calc(100vh-200px)] grid-cols-1 gap-6 lg:grid-cols-4">
        {/* Sidebar */}
        <Card className="lg:col-span-1">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Conversations</CardTitle>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" className="h-6 w-6" aria-label="Settings">
                  <Settings className="h-3 w-3" />
                </Button>
                <Button variant="ghost" size="icon" className="h-6 w-6" aria-label="Notifications">
                  <Bell className="h-3 w-3" />
                </Button>
              </div>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
              <Input
                placeholder="Search..."
                className="h-8 pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
              <TabsList className="mx-4 mb-4 grid w-full grid-cols-2">
                <TabsTrigger value="groups" className="text-xs">
                  <Hash className="mr-1 h-3 w-3" />
                  Groups
                </TabsTrigger>
                <TabsTrigger value="dms" className="text-xs">
                  <MessageCircle className="mr-1 h-3 w-3" />
                  Direct
                </TabsTrigger>
              </TabsList>

              <TabsContent value="groups" className="mt-0">
                <ScrollArea className="h-[400px]">
                  <div className="space-y-1 px-4">
                    {filteredGroups.map((group) => (
                      <div
                        key={group.id}
                        className={`flex cursor-pointer items-center space-x-3 rounded-lg p-2 transition-colors hover:bg-muted ${
                          activeChannel === group.id ? "bg-muted" : ""
                        }`}
                        onClick={() => setActiveChannel(group.id)}
                      >
                        <div className="relative">
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-blue-500 to-purple-600">
                            {group.type === "private" ? (
                              <Lock className="h-4 w-4 text-white" />
                            ) : (
                              <Hash className="h-4 w-4 text-white" />
                            )}
                          </div>
                          {group.unreadCount > 0 && (
                            <Badge
                              variant="destructive"
                              className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center p-0 text-xs"
                            >
                              {group.unreadCount}
                            </Badge>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between">
                            <p className="flex items-center gap-1 truncate text-sm font-medium">
                              {group.name}
                              {group.type === "private" && <Lock className="h-3 w-3" />}
                            </p>
                          </div>
                          <p className="truncate text-xs text-muted-foreground">{group.members.length} members</p>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-6 w-6" aria-label="More options">
                              <MoreVertical className="h-3 w-3" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Bell className="mr-2 h-4 w-4" />
                              Mute Notifications
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Pin className="mr-2 h-4 w-4" />
                              Pin Channel
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Users className="mr-2 h-4 w-4" />
                              View Members
                            </DropdownMenuItem>
                            {group.type === "public" && (
                              <DropdownMenuItem onClick={() => leaveGroup(group.id)}>
                                <UserPlus className="mr-2 h-4 w-4" />
                                Leave Group
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </TabsContent>

              <TabsContent value="dms" className="mt-0">
                <ScrollArea className="h-[400px]">
                  <div className="space-y-1 px-4">
                    {filteredDMs.map((dm) => {
                      if (!currentUser) return null
                      const otherUserId = dm.participants.find((id) => id !== currentUser.id)
                      const otherUser = users[otherUserId || ""]
                      if (!otherUser) return null

                      return (
                        <div
                          key={dm.id}
                          className={`flex cursor-pointer items-center space-x-3 rounded-lg p-2 transition-colors hover:bg-muted ${
                            activeChannel === dm.id ? "bg-muted" : ""
                          }`}
                          onClick={() => setActiveChannel(dm.id)}
                        >
                          <div className="relative">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src="/placeholder.svg?height=32&width=32" />
                              <AvatarFallback className="text-xs">{otherUser.avatar}</AvatarFallback>
                            </Avatar>
                            <div
                              className={`absolute -bottom-1 -right-1 h-3 w-3 rounded-full border-2 border-white ${
                                otherUser.status === "online"
                                  ? "bg-green-500"
                                  : otherUser.status === "away"
                                    ? "bg-yellow-500"
                                    : "bg-gray-400"
                              }`}
                            ></div>
                            {dm.unreadCount > 0 && (
                              <Badge
                                variant="destructive"
                                className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center p-0 text-xs"
                              >
                                {dm.unreadCount}
                              </Badge>
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium">{otherUser.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {otherUser.status === "online"
                                ? "Online"
                                : otherUser.status === "away"
                                  ? "Away"
                                  : otherUser.lastSeen
                                    ? `Last seen ${otherUser.lastSeen.toLocaleTimeString()}`
                                    : "Offline"}
                            </p>
                          </div>
                        </div>
                      )
                    })}

                    {/* Online Users for Quick DM */}
                    <div className="pt-4">
                      <p className="mb-2 px-2 text-xs font-medium text-muted-foreground">Start New Conversation</p>
                      {Object.values(users)
                        .filter(
                          (user) =>
                            user.id !== currentUser?.id &&
                            !directMessages.some((dm) => dm.participants.includes(user.id)),
                        )
                        .map((user) => (
                          <div
                            key={user.id}
                            className="flex cursor-pointer items-center space-x-3 rounded-lg p-2 transition-colors hover:bg-muted"
                            onClick={() => handleStartDM(user.id)}
                          >
                            <div className="relative">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src="/placeholder.svg?height=32&width=32" />
                                <AvatarFallback className="text-xs">{user.avatar}</AvatarFallback>
                              </Avatar>
                              <div
                                className={`absolute -bottom-1 -right-1 h-3 w-3 rounded-full border-2 border-white ${
                                  user.status === "online"
                                    ? "bg-green-500"
                                    : user.status === "away"
                                      ? "bg-yellow-500"
                                      : "bg-gray-400"
                                }`}
                              ></div>
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-sm font-medium">{user.name}</p>
                              <p className="text-xs text-muted-foreground">{user.status}</p>
                            </div>
                            <MessageCircle className="h-4 w-4 text-muted-foreground" />
                          </div>
                        ))}
                    </div>
                  </div>
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Chat Area */}
        <Card className="flex flex-col lg:col-span-3">
          {activeChannel ? (
            <>
              {/* Chat Header */}
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-r from-blue-500 to-purple-600">
                      {getChannelType(activeChannel) === "group" ? (
                        <Hash className="h-5 w-5 text-white" />
                      ) : (
                        <MessageCircle className="h-5 w-5 text-white" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold">{getChannelName(activeChannel)}</h3>
                      <p className="text-sm text-muted-foreground">
                        {getChannelType(activeChannel) === "group"
                          ? `${groups.find((g) => g.id === activeChannel)?.members.length || 0} members`
                          : users[
                              directMessages
                                .find((d) => d.id === activeChannel)
                                ?.participants.find((id) => id !== currentUser?.id) || ""
                            ]?.status || "offline"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="icon" aria-label="Start voice call">
                      <Phone className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" aria-label="Start video call">
                      <Video className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" aria-label="Invite">
                      <UserPlus className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" aria-label="Search">
                      <Search className="h-4 w-4" />
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" aria-label="More options">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Bell className="mr-2 h-4 w-4" />
                          Mute Notifications
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Pin className="mr-2 h-4 w-4" />
                          Pinned Messages
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Search className="mr-2 h-4 w-4" />
                          Search Messages
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Settings className="mr-2 h-4 w-4" />
                          Channel Settings
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardHeader>

              <Separator />

              {/* Messages */}
              <CardContent className="flex-1 p-0">
                <ScrollArea className="h-[400px] p-4">
                  <div className="space-y-4">
                    {currentMessages.map((msg, index) => {
                      const isOwnMessage = msg.senderId === currentUser?.id
                      const showAvatar = index === 0 || currentMessages[index - 1].senderId !== msg.senderId

                      return (
                        <div
                          key={msg.id}
                          className={`group flex items-start space-x-3 ${isOwnMessage ? "flex-row-reverse space-x-reverse" : ""}`}
                        >
                          {showAvatar ? (
                            <Avatar className="h-8 w-8">
                              <AvatarImage src="/placeholder.svg?height=32&width=32" />
                              <AvatarFallback className="text-xs">{msg.senderAvatar}</AvatarFallback>
                            </Avatar>
                          ) : (
                            <div className="w-8" />
                          )}
                          <div className={`flex-1 space-y-1 ${isOwnMessage ? "text-right" : ""}`}>
                            {showAvatar && (
                              <div
                                className={`flex items-center space-x-2 ${isOwnMessage ? "flex-row-reverse space-x-reverse" : ""}`}
                              >
                                <span className="text-sm font-medium">{msg.senderName}</span>
                                <span className="text-xs text-muted-foreground">
                                  {msg.timestamp.toLocaleTimeString()}
                                </span>
                                {msg.edited && <span className="text-xs text-muted-foreground">(edited)</span>}
                              </div>
                            )}
                            <div className={`group/message relative ${isOwnMessage ? "flex justify-end" : ""}`}>
                              <div
                                className={`max-w-[70%] rounded-lg p-3 ${
                                  isOwnMessage ? "bg-blue-500 text-white" : "bg-muted"
                                } ${msg.type === "announcement" ? "border border-yellow-300 bg-yellow-100" : ""}`}
                              >
                                {msg.type === "announcement" && (
                                  <div className="mb-2 flex items-center gap-2">
                                    <Zap className="h-4 w-4 text-yellow-600" />
                                    <span className="text-sm font-medium text-yellow-800">Announcement</span>
                                  </div>
                                )}
                                <p className="whitespace-pre-wrap text-sm">{msg.content}</p>

                                {/* Reactions */}
                                {msg.reactions && Object.keys(msg.reactions).length > 0 && (
                                  <div className="mt-2 flex flex-wrap gap-1">
                                    {Object.entries(msg.reactions).map(([emoji, userIds]) => (
                                      <button
                                        key={emoji}
                                        onClick={() => addReaction(msg.id, emoji)}
                                        className={`flex items-center gap-1 rounded-full px-2 py-1 text-xs transition-colors ${
                                          userIds.includes(currentUser?.id || "")
                                            ? "border border-blue-300 bg-blue-100 text-blue-800"
                                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                        }`}
                                      >
                                        <span>{emoji}</span>
                                        <span>{userIds.length}</span>
                                      </button>
                                    ))}
                                  </div>
                                )}
                              </div>

                              {/* Message Actions */}
                              <div
                                className={`absolute top-0 ${isOwnMessage ? "left-0 -translate-x-full" : "right-0 translate-x-full"} opacity-0 transition-opacity group-hover/message:opacity-100`}
                              >
                                <div className="flex items-center gap-1 rounded-lg border bg-white p-1 shadow-lg">
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button variant="ghost" size="icon" className="h-6 w-6" aria-label="Add emoji">
                                        <Smile className="h-3 w-3" />
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                      <div className="grid grid-cols-5 gap-1 p-2">
                                        {emojis.map((emoji) => (
                                          <button
                                            key={emoji}
                                            onClick={() => addReaction(msg.id, emoji)}
                                            className="rounded p-1 text-lg hover:bg-accent"
                                          >
                                            {emoji}
                                          </button>
                                        ))}
                                      </div>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                  <Button variant="ghost" size="icon" className="h-6 w-6" aria-label="Reply">
                                    <Reply className="h-3 w-3" />
                                  </Button>
                                  {isOwnMessage && (
                                    <>
                                      <Button variant="ghost" size="icon" className="h-6 w-6" aria-label="Edit">
                                        <Edit className="h-3 w-3" />
                                      </Button>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-6 w-6 text-red-500"
                                        aria-label="Delete"
                                      >
                                        <Trash className="h-3 w-3" />
                                      </Button>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    })}

                    {/* Typing Indicators */}
                    {currentTypingUsers.length > 0 && (
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <div className="flex space-x-1">
                          <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400"></div>
                          <div
                            className="h-2 w-2 animate-bounce rounded-full bg-gray-400"
                            style={{ animationDelay: "0.1s" }}
                          ></div>
                          <div
                            className="h-2 w-2 animate-bounce rounded-full bg-gray-400"
                            style={{ animationDelay: "0.2s" }}
                          ></div>
                        </div>
                        <span>
                          {formatTypingIndicator(currentTypingUsers.map((userId) => users[userId]?.name ?? "Someone"))}
                        </span>
                      </div>
                    )}

                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>
              </CardContent>

              <Separator />

              {/* Message Input */}
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" aria-label="Attach file">
                        <Paperclip className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                      <DropdownMenuItem>
                        <ImageIcon className="mr-2 h-4 w-4" />
                        Upload Image
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <File className="mr-2 h-4 w-4" />
                        Upload File
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Camera className="mr-2 h-4 w-4" />
                        Take Photo
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Mic className="mr-2 h-4 w-4" />
                        Voice Message
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <div className="relative flex-1">
                    <Input
                      placeholder="Type a message..."
                      aria-label="Message"
                      value={message}
                      onChange={(e) => handleTyping(e.target.value)}
                      className="pr-20"
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault()
                          handleSendMessage()
                        }
                      }}
                    />
                    <div className="absolute right-2 top-1/2 flex -translate-y-1/2 transform items-center gap-1">
                      <DropdownMenu open={showEmojiPicker} onOpenChange={setShowEmojiPicker}>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-6 w-6" aria-label="Add emoji">
                            <Smile className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <div className="grid w-64 grid-cols-8 gap-1 p-2">
                            {emojis
                              .concat([
                                "😀",
                                "😃",
                                "😄",
                                "😁",
                                "😆",
                                "😅",
                                "🤣",
                                "😂",
                                "🙂",
                                "🙃",
                                "😉",
                                "😊",
                                "😇",
                                "🥰",
                                "😍",
                                "🤩",
                                "😘",
                                "😗",
                                "😚",
                                "😙",
                                "😋",
                                "😛",
                                "😜",
                                "🤪",
                                "😝",
                                "🤑",
                                "🤗",
                                "🤭",
                                "🤫",
                                "🤔",
                                "🤐",
                                "🤨",
                                "😐",
                                "😑",
                                "😶",
                                "😏",
                                "😒",
                                "🙄",
                                "😬",
                                "🤥",
                              ])
                              .map((emoji) => (
                                <button
                                  key={emoji}
                                  type="button"
                                  aria-label={`Insert ${emoji}`}
                                  onClick={() => {
                                    setMessage((prev) => prev + emoji)
                                    setShowEmojiPicker(false)
                                  }}
                                  className="rounded p-1 text-lg hover:bg-gray-100"
                                >
                                  {emoji}
                                </button>
                              ))}
                          </div>
                        </DropdownMenuContent>
                      </DropdownMenu>
                      <Button variant="ghost" size="icon" className="h-6 w-6" aria-label="Send gift">
                        <Gift className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <Button
                    onClick={handleSendMessage}
                    size="icon"
                    disabled={!message.trim()}
                    className="shrink-0"
                    aria-label="Send message"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </>
          ) : (
            <div className="flex flex-1 items-center justify-center">
              <div className="space-y-4 text-center">
                <MessageCircle className="mx-auto h-16 w-16 text-muted-foreground" />
                <div>
                  <h3 className="text-lg font-semibold">Welcome to Community Chat</h3>
                  <p className="text-muted-foreground">Select a channel or start a conversation to begin</p>
                </div>
                <div className="flex justify-center gap-2">
                  <Button variant="outline" onClick={() => setSelectedTab("groups")}>
                    Browse Groups
                  </Button>
                  <Button onClick={() => setShowCreateGroup(true)}>Create Group</Button>
                </div>
              </div>
            </div>
          )}
        </Card>
      </div>

      {/* Community Stats */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12,543</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+180</span> this week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Groups</CardTitle>
            <Hash className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{groups.length}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-blue-600">3</span> new this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Messages Today</CardTitle>
            <MessageCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,847</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-purple-600">+12%</span> from yesterday
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Online Now</CardTitle>
            <div className="h-2 w-2 rounded-full bg-green-500"></div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Object.values(users).filter((user) => user.status === "online").length}
            </div>
            <p className="text-xs text-muted-foreground">Peak: 456 at 2 PM</p>
          </CardContent>
        </Card>
      </div>

      <Dialog open={showCreateGroup} onOpenChange={setShowCreateGroup}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Group</DialogTitle>
            <DialogDescription>Start a space for your team or community.</DialogDescription>
          </DialogHeader>
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault()
              handleCreateGroup()
            }}
          >
            <div className="space-y-2">
              <Label htmlFor="group-name">Group Name</Label>
              <Input
                id="group-name"
                placeholder="Enter group name"
                value={newGroupName}
                onChange={(e) => setNewGroupName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="group-description">Description</Label>
              <Input
                id="group-description"
                placeholder="Enter group description"
                value={newGroupDescription}
                onChange={(e) => setNewGroupDescription(e.target.value)}
              />
            </div>
            <fieldset className="space-y-2">
              <legend className="text-sm font-medium">Privacy</legend>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant={newGroupType === "public" ? "default" : "outline"}
                  aria-pressed={newGroupType === "public"}
                  onClick={() => setNewGroupType("public")}
                  className="flex-1"
                >
                  <Globe className="mr-2 h-4 w-4" aria-hidden="true" />
                  Public
                </Button>
                <Button
                  type="button"
                  variant={newGroupType === "private" ? "default" : "outline"}
                  aria-pressed={newGroupType === "private"}
                  onClick={() => setNewGroupType("private")}
                  className="flex-1"
                >
                  <Lock className="mr-2 h-4 w-4" aria-hidden="true" />
                  Private
                </Button>
              </div>
            </fieldset>
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={() => setShowCreateGroup(false)} className="flex-1">
                Cancel
              </Button>
              <Button type="submit" className="flex-1" disabled={!newGroupName.trim()}>
                Create Group
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default function CommunityPage() {
  return <CommunityContent />
}
