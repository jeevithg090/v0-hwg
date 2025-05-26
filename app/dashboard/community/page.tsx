"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
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
} from "lucide-react"
import { useState } from "react"

export default function CommunityPage() {
  const [selectedChat, setSelectedChat] = useState("general")
  const [message, setMessage] = useState("")

  const groups = [
    { id: "general", name: "General Discussion", members: 1234, unread: 5, type: "public" },
    { id: "frontend", name: "Frontend Developers", members: 856, unread: 2, type: "public" },
    { id: "backend", name: "Backend Engineers", members: 743, unread: 0, type: "public" },
    { id: "design", name: "UI/UX Designers", members: 567, unread: 8, type: "public" },
    { id: "startup", name: "Startup Founders", members: 234, unread: 1, type: "private" },
  ]

  const directMessages = [
    { id: "alice", name: "Alice Johnson", status: "online", unread: 3, lastMessage: "Hey, how's the project going?" },
    { id: "bob", name: "Bob Smith", status: "away", unread: 0, lastMessage: "Thanks for the help!" },
    { id: "carol", name: "Carol Davis", status: "offline", unread: 1, lastMessage: "Can we schedule a call?" },
  ]

  const messages = [
    {
      id: 1,
      user: "Alice Johnson",
      avatar: "AJ",
      time: "10:30 AM",
      message: "Hey everyone! Just deployed our new React app to production 🚀",
    },
    {
      id: 2,
      user: "Bob Smith",
      avatar: "BS",
      time: "10:32 AM",
      message: "Congrats Alice! How was the deployment process?",
    },
    {
      id: 3,
      user: "Carol Davis",
      avatar: "CD",
      time: "10:35 AM",
      message: "That's awesome! Would love to hear about any challenges you faced",
    },
    {
      id: 4,
      user: "David Wilson",
      avatar: "DW",
      time: "10:38 AM",
      message: "We should do a tech talk about deployment best practices",
    },
    {
      id: 5,
      user: "Alice Johnson",
      avatar: "AJ",
      time: "10:40 AM",
      message: "Great idea! I can share our CI/CD pipeline setup",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Community Hub</h1>
          <p className="text-muted-foreground">Connect and collaborate with the tech community</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Create Group
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-200px)]">
        {/* Sidebar */}
        <Card className="lg:col-span-1">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Conversations</CardTitle>
              <Button variant="ghost" size="icon">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search..." className="pl-10 h-8" />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Tabs defaultValue="groups" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mx-4 mb-4">
                <TabsTrigger value="groups" className="text-xs">
                  Groups
                </TabsTrigger>
                <TabsTrigger value="dms" className="text-xs">
                  Direct
                </TabsTrigger>
              </TabsList>

              <TabsContent value="groups" className="mt-0">
                <ScrollArea className="h-[400px]">
                  <div className="space-y-1 px-4">
                    {groups.map((group) => (
                      <div
                        key={group.id}
                        className={`flex items-center space-x-3 p-2 rounded-lg cursor-pointer hover:bg-muted transition-colors ${
                          selectedChat === group.id ? "bg-muted" : ""
                        }`}
                        onClick={() => setSelectedChat(group.id)}
                      >
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                          <Hash className="h-4 w-4 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium truncate">{group.name}</p>
                            {group.unread > 0 && (
                              <Badge
                                variant="destructive"
                                className="h-5 w-5 flex items-center justify-center p-0 text-xs"
                              >
                                {group.unread}
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground">{group.members} members</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </TabsContent>

              <TabsContent value="dms" className="mt-0">
                <ScrollArea className="h-[400px]">
                  <div className="space-y-1 px-4">
                    {directMessages.map((dm) => (
                      <div
                        key={dm.id}
                        className={`flex items-center space-x-3 p-2 rounded-lg cursor-pointer hover:bg-muted transition-colors ${
                          selectedChat === dm.id ? "bg-muted" : ""
                        }`}
                        onClick={() => setSelectedChat(dm.id)}
                      >
                        <div className="relative">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src="/placeholder.svg?height=32&width=32" />
                            <AvatarFallback className="text-xs">
                              {dm.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div
                            className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
                              dm.status === "online"
                                ? "bg-green-500"
                                : dm.status === "away"
                                  ? "bg-yellow-500"
                                  : "bg-gray-400"
                            }`}
                          ></div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium truncate">{dm.name}</p>
                            {dm.unread > 0 && (
                              <Badge
                                variant="destructive"
                                className="h-5 w-5 flex items-center justify-center p-0 text-xs"
                              >
                                {dm.unread}
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground truncate">{dm.lastMessage}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Chat Area */}
        <Card className="lg:col-span-3 flex flex-col">
          {/* Chat Header */}
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Hash className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold">General Discussion</h3>
                  <p className="text-sm text-muted-foreground">1,234 members • 45 online</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="icon">
                  <Phone className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Video className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon">
                  <UserPlus className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>

          <Separator />

          {/* Messages */}
          <CardContent className="flex-1 p-0">
            <ScrollArea className="h-[400px] p-4">
              <div className="space-y-4">
                {messages.map((msg) => (
                  <div key={msg.id} className="flex items-start space-x-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/placeholder.svg?height=32&width=32" />
                      <AvatarFallback className="text-xs">{msg.avatar}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium">{msg.user}</span>
                        <span className="text-xs text-muted-foreground">{msg.time}</span>
                      </div>
                      <p className="text-sm">{msg.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>

          <Separator />

          {/* Message Input */}
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="icon">
                <Paperclip className="h-4 w-4" />
              </Button>
              <div className="flex-1 relative">
                <Input
                  placeholder="Type a message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="pr-20"
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      // Handle send message
                      setMessage("")
                    }
                  }}
                />
                <Button variant="ghost" size="icon" className="absolute right-8 top-1/2 transform -translate-y-1/2">
                  <Smile className="h-4 w-4" />
                </Button>
              </div>
              <Button size="icon" disabled={!message.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Community Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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
            <div className="text-2xl font-bold">47</div>
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
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">342</div>
            <p className="text-xs text-muted-foreground">Peak: 456 at 2 PM</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
