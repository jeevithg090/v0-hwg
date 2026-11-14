"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import {
  Calendar,
  MapPin,
  Clock,
  Users,
  Video,
  Plus,
  Search,
  Filter,
  Share,
  Bookmark,
  ExternalLink,
  Settings,
  BarChart3,
  DollarSign,
  Star,
  Zap,
  Trophy,
  Code,
  Lightbulb,
  Coffee,
} from "lucide-react"
import Link from "next/link"
import { useUser } from "@/lib/user-context"
import { useTabParam } from "@/hooks/use-tab-param"

const EVENT_TABS = ["discover", "registered", "hosting", "analytics", "saved", "calendar"] as const
import { EventRegistrationModal, type RegistrableEvent } from "@/components/event-registration-modal"
import { useState } from "react"

export default function EventsPage() {
  const [selectedEvent, setSelectedEvent] = useState<RegistrableEvent | null>(null)
  const [isRegistrationModalOpen, setIsRegistrationModalOpen] = useState(false)

  const handleRegisterClick = (event: RegistrableEvent) => {
    setSelectedEvent(event)
    setIsRegistrationModalOpen(true)
  }

  const featuredEvents = [
    {
      id: 1,
      title: "AI Innovation Hackathon 2024",
      type: "hackathon",
      description: "48-hour hackathon focused on building AI-powered solutions for social good.",
      startDate: "March 15, 2024",
      endDate: "March 17, 2024",
      time: "9:00 AM - 6:00 PM",
      location: "San Francisco, CA",
      isOnline: false,
      registered: 245,
      maxAttendees: 500,
      price: "Free",
      image: "/placeholder.svg?height=200&width=400",
      tags: ["AI", "Machine Learning", "Social Good"],
      organizer: "TechForGood",
      featured: true,
    },
    {
      id: 2,
      title: "React Advanced Patterns Workshop",
      type: "workshop",
      description: "Deep dive into advanced React patterns and performance optimization techniques.",
      startDate: "March 20, 2024",
      time: "2:00 PM - 6:00 PM",
      location: "Online",
      isOnline: true,
      registered: 89,
      maxAttendees: 100,
      price: "$49",
      image: "/placeholder.svg?height=200&width=400",
      tags: ["React", "JavaScript", "Frontend"],
      organizer: "React Masters",
      featured: true,
    },
    {
      id: 3,
      title: "Startup Pitch Night",
      type: "networking",
      description: "Monthly networking event where startups pitch their ideas to investors.",
      startDate: "March 25, 2024",
      time: "6:00 PM - 9:00 PM",
      location: "New York, NY",
      isOnline: false,
      registered: 156,
      maxAttendees: 200,
      price: "$25",
      image: "/placeholder.svg?height=200&width=400",
      tags: ["Startup", "Networking", "Investment"],
      organizer: "NYC Startup Hub",
      featured: true,
    },
  ]

  const upcomingEvents = [
    {
      id: 4,
      title: "Blockchain Development Bootcamp",
      type: "bootcamp",
      description: "5-day intensive bootcamp covering blockchain development from basics to advanced.",
      startDate: "April 1, 2024",
      time: "9:00 AM - 5:00 PM",
      location: "Online",
      isOnline: true,
      registered: 67,
      maxAttendees: 50,
      price: "$299",
      tags: ["Blockchain", "Web3", "Solidity"],
      organizer: "Crypto Academy",
    },
    {
      id: 5,
      title: "UX Design Meetup",
      type: "meetup",
      description: "Monthly meetup for UX designers to share insights and network.",
      startDate: "April 5, 2024",
      time: "7:00 PM - 9:00 PM",
      location: "Austin, TX",
      isOnline: false,
      registered: 34,
      maxAttendees: 80,
      price: "Free",
      tags: ["UX", "Design", "Networking"],
      organizer: "Austin Design Guild",
    },
    {
      id: 6,
      title: "DevOps & Cloud Security Conference",
      type: "conference",
      description: "Two-day conference covering the latest in DevOps practices and cloud security.",
      startDate: "April 10, 2024",
      time: "9:00 AM - 6:00 PM",
      location: "Seattle, WA",
      isOnline: false,
      registered: 423,
      maxAttendees: 800,
      price: "$199",
      tags: ["DevOps", "Cloud", "Security"],
      organizer: "CloudSec Events",
    },
  ]

  const myEvents = [
    {
      id: 7,
      title: "Frontend Development Workshop",
      type: "workshop",
      description: "Hands-on workshop covering modern frontend development techniques.",
      startDate: "March 20, 2024",
      time: "2:00 PM - 5:00 PM",
      location: "Online",
      isOnline: true,
      registered: 45,
      maxAttendees: 50,
      status: "upcoming",
      revenue: 2250,
    },
    {
      id: 8,
      title: "JavaScript Fundamentals Bootcamp",
      type: "bootcamp",
      description: "3-day intensive bootcamp for JavaScript beginners.",
      startDate: "February 15, 2024",
      time: "9:00 AM - 5:00 PM",
      location: "San Francisco, CA",
      isOnline: false,
      registered: 32,
      maxAttendees: 30,
      status: "completed",
      revenue: 9600,
    },
  ]

  const registeredEvents = [
    {
      id: 9,
      title: "Machine Learning Conference 2024",
      type: "conference",
      description: "Annual conference featuring the latest in ML research and applications.",
      startDate: "March 25, 2024",
      time: "9:00 AM - 6:00 PM",
      location: "New York, NY",
      isOnline: false,
      registrationDate: "February 10, 2024",
      ticketType: "Regular",
      price: "$299",
    },
    {
      id: 10,
      title: "Cybersecurity Webinar Series",
      type: "webinar",
      description: "Weekly webinar series covering cybersecurity best practices.",
      startDate: "March 22, 2024",
      time: "1:00 PM - 2:00 PM",
      location: "Online",
      isOnline: true,
      registrationDate: "February 20, 2024",
      ticketType: "Free",
      price: "Free",
    },
  ]

  const getEventTypeIcon = (type: string) => {
    switch (type) {
      case "hackathon":
        return <Trophy className="h-4 w-4" />
      case "workshop":
        return <Code className="h-4 w-4" />
      case "webinar":
        return <Video className="h-4 w-4" />
      case "conference":
        return <Users className="h-4 w-4" />
      case "meetup":
        return <Coffee className="h-4 w-4" />
      case "bootcamp":
        return <Zap className="h-4 w-4" />
      case "networking":
        return <Lightbulb className="h-4 w-4" />
      default:
        return <Calendar className="h-4 w-4" />
    }
  }

  const getEventTypeBadge = (type: string) => {
    const badges = {
      hackathon: { label: "🏆 Hackathon", variant: "default" as const },
      workshop: { label: "🛠️ Workshop", variant: "secondary" as const },
      webinar: { label: "💻 Webinar", variant: "outline" as const },
      conference: { label: "🎤 Conference", variant: "default" as const },
      meetup: { label: "🤝 Meetup", variant: "secondary" as const },
      bootcamp: { label: "📚 Bootcamp", variant: "destructive" as const },
      networking: { label: "🌐 Networking", variant: "outline" as const },
    }

    const badge = badges[type as keyof typeof badges] || { label: type, variant: "secondary" as const }
    return <Badge variant={badge.variant}>{badge.label}</Badge>
  }

  const { isClient, isFreelancer, isStartup } = useUser()
  const [tab, setTab] = useTabParam("discover", EVENT_TABS)

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">{isFreelancer ? "Discover Events" : "Events Hub"}</h1>
          <p className="text-muted-foreground">
            {isFreelancer
              ? "Find and join amazing tech events to grow your network"
              : "Discover and organize tech events"}
          </p>
        </div>
        {(isClient || isStartup) && (
          <Button className="gap-2" asChild>
            <Link href="/dashboard/events/create">
              <Plus className="h-4 w-4" />
              Create Event
            </Link>
          </Button>
        )}
      </div>

      <Tabs value={tab} onValueChange={setTab} className="space-y-6">
        <TabsList className="flex h-auto w-full flex-wrap justify-start sm:grid sm:grid-cols-4">
          <TabsTrigger value="discover">{isFreelancer ? "Browse Events" : "Discover Events"}</TabsTrigger>
          <TabsTrigger value="registered">{isFreelancer ? "My Events" : "My Registrations"}</TabsTrigger>
          {(isClient || isStartup) && <TabsTrigger value="hosting">Hosting</TabsTrigger>}
          {(isClient || isStartup) && <TabsTrigger value="analytics">Analytics</TabsTrigger>}
          {isFreelancer && <TabsTrigger value="saved">Saved Events</TabsTrigger>}
          {isFreelancer && <TabsTrigger value="calendar">My Calendar</TabsTrigger>}
        </TabsList>

        <TabsContent value="discover" className="space-y-6">
          {/* Search and Filters */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col gap-4 md:flex-row">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
                  <Input placeholder="Search events..." className="pl-10" />
                </div>
                <Select>
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue placeholder="Event Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="hackathon">🏆 Hackathon</SelectItem>
                    <SelectItem value="webinar">💻 Webinar</SelectItem>
                    <SelectItem value="meetup">🤝 Meetup</SelectItem>
                    <SelectItem value="conference">🎤 Conference</SelectItem>
                    <SelectItem value="workshop">🛠️ Workshop</SelectItem>
                    <SelectItem value="bootcamp">📚 Bootcamp</SelectItem>
                    <SelectItem value="networking">🌐 Networking</SelectItem>
                  </SelectContent>
                </Select>
                <Select>
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue placeholder="Location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Locations</SelectItem>
                    <SelectItem value="online">Online</SelectItem>
                    <SelectItem value="san-francisco">San Francisco</SelectItem>
                    <SelectItem value="new-york">New York</SelectItem>
                    <SelectItem value="london">London</SelectItem>
                    <SelectItem value="berlin">Berlin</SelectItem>
                  </SelectContent>
                </Select>
                <Select>
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue placeholder="Price" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Prices</SelectItem>
                    <SelectItem value="free">Free</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" className="gap-2">
                  <Filter className="h-4 w-4" />
                  More Filters
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Featured Events */}
          <div>
            <h2 className="mb-4 text-xl font-semibold">Featured Events</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {featuredEvents.map((event) => (
                <Card key={event.id} className="overflow-hidden transition-shadow hover:shadow-lg">
                  <div className="relative h-48 bg-gradient-to-r from-blue-500 to-purple-600">
                    <div className="absolute left-4 top-4">
                      <Badge className="bg-white text-black">Featured</Badge>
                    </div>
                    <div className="absolute right-4 top-4">
                      <Button variant="ghost" size="icon" className="text-white hover:bg-white/20" aria-label="Save">
                        <Bookmark className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <CardHeader>
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div className="space-y-2">
                        {getEventTypeBadge(event.type)}
                        <CardTitle className="text-lg">{event.title}</CardTitle>
                        <CardDescription>{event.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>{event.startDate}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>{event.time}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        {event.isOnline ? <Video className="h-4 w-4" /> : <MapPin className="h-4 w-4" />}
                        <span>{event.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Users className="h-4 w-4" />
                        <span>
                          {event.registered} registered • {event.maxAttendees} max
                        </span>
                      </div>

                      <div className="mt-2 flex flex-wrap gap-1">
                        {event.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex gap-2 pt-2">
                        <Button className="flex-1" onClick={() => handleRegisterClick(event)}>
                          {event.price === "Free" ? "Register Free" : `Register ${event.price}`}
                        </Button>
                        <Button variant="outline" size="icon" aria-label="Share">
                          <Share className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Upcoming Events */}
          <div>
            <h2 className="mb-4 text-xl font-semibold">Upcoming Events</h2>
            <div className="space-y-4">
              {upcomingEvents.map((event) => (
                <Card key={event.id} className="transition-shadow hover:shadow-md">
                  <CardContent className="p-6">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex min-w-0 items-center space-x-4">
                        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-gradient-to-r from-green-400 to-blue-500">
                          {getEventTypeIcon(event.type)}
                        </div>
                        <div className="min-w-0 space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="font-semibold">{event.title}</h3>
                            {getEventTypeBadge(event.type)}
                          </div>
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              <span>{event.startDate}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              <span>{event.time}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              {event.isOnline ? <Video className="h-4 w-4" /> : <MapPin className="h-4 w-4" />}
                              <span>{event.location}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Users className="h-4 w-4" />
                              <span>{event.registered} attending</span>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground">{event.description}</p>
                          <div className="mt-2 flex flex-wrap gap-1">
                            {event.tags.map((tag) => (
                              <Badge key={tag} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                        <Button size="sm" onClick={() => handleRegisterClick(event)}>
                          {event.price === "Free" ? "Register Free" : `Register ${event.price}`}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="registered" className="space-y-6">
          <div className="grid gap-6">
            {registeredEvents.map((event) => (
              <Card key={event.id}>
                <CardContent className="p-6">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center space-x-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-r from-purple-400 to-pink-500">
                        {getEventTypeIcon(event.type)}
                      </div>
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-semibold">{event.title}</h3>
                          {getEventTypeBadge(event.type)}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>{event.startDate}</span>
                          <span>{event.location}</span>
                          <span>Ticket: {event.ticketType}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">{event.description}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Event Details
                      </Button>
                      <Button variant="outline" size="sm">
                        Cancel Registration
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {(isClient || isStartup) && (
          <TabsContent value="hosting" className="space-y-6">
            <div className="grid gap-6">
              {myEvents.map((event) => (
                <Card key={event.id}>
                  <CardHeader>
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <CardTitle>{event.title}</CardTitle>
                        <CardDescription>
                          {event.startDate} • {event.registered}/{event.maxAttendees} registered
                        </CardDescription>
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge
                          variant={event.status === "upcoming" ? "default" : "secondary"}
                          className={event.status === "upcoming" ? "bg-green-100 text-green-800" : ""}
                        >
                          {event.status === "upcoming" ? "Upcoming" : "Completed"}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between text-sm">
                        <span>Registration Progress</span>
                        <span className="font-medium">
                          {event.registered}/{event.maxAttendees} spots filled
                        </span>
                      </div>
                      <Progress value={(event.registered / event.maxAttendees) * 100} className="h-2" />

                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="text-sm text-muted-foreground">
                          Revenue:{" "}
                          <span className="font-medium text-foreground">${event.revenue.toLocaleString()}</span>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/dashboard/events/manage/${event.id}`}>
                              <Settings className="mr-2 h-4 w-4" />
                              Manage
                            </Link>
                          </Button>
                          <Button variant="outline" size="sm">
                            <BarChart3 className="mr-2 h-4 w-4" />
                            Analytics
                          </Button>
                          <Button size="sm">View Event</Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        )}

        {(isClient || isStartup) && (
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Events Hosted</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">12</div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-green-600">+2</span> this month
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Attendees</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">1,247</div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-blue-600">+89</span> this month
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">$24,850</div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-green-600">+15%</span> from last month
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
                  <Star className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">4.8</div>
                  <p className="text-xs text-muted-foreground">Based on 156 reviews</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Event Performance</CardTitle>
                  <CardDescription>Registration trends over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex h-64 items-center justify-center text-muted-foreground">
                    Event performance chart would go here
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Event Types Distribution</CardTitle>
                  <CardDescription>Breakdown of events by type</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="mb-1 flex justify-between text-sm">
                        <span>Workshops</span>
                        <span>40%</span>
                      </div>
                      <Progress value={40} className="h-2" />
                    </div>
                    <div>
                      <div className="mb-1 flex justify-between text-sm">
                        <span>Webinars</span>
                        <span>30%</span>
                      </div>
                      <Progress value={30} className="h-2" />
                    </div>
                    <div>
                      <div className="mb-1 flex justify-between text-sm">
                        <span>Hackathons</span>
                        <span>20%</span>
                      </div>
                      <Progress value={20} className="h-2" />
                    </div>
                    <div>
                      <div className="mb-1 flex justify-between text-sm">
                        <span>Conferences</span>
                        <span>10%</span>
                      </div>
                      <Progress value={10} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        )}

        {isFreelancer && (
          <>
            <TabsContent value="saved" className="space-y-6">
              <div className="py-12 text-center">
                <Bookmark className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                <h3 className="mb-2 text-lg font-semibold">No Saved Events</h3>
                <p className="mb-4 text-muted-foreground">Save events you're interested in to view them later</p>
                <Button variant="outline">Browse Events</Button>
              </div>
            </TabsContent>

            <TabsContent value="calendar" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>My Event Calendar</CardTitle>
                  <CardDescription>Your upcoming registered events</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="py-8 text-center">
                    <Calendar className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                    <h3 className="mb-2 text-lg font-semibold">No Upcoming Events</h3>
                    <p className="text-muted-foreground">Register for events to see them in your calendar</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </>
        )}
      </Tabs>
      {selectedEvent && (
        <EventRegistrationModal
          isOpen={isRegistrationModalOpen}
          onClose={() => {
            setIsRegistrationModalOpen(false)
            setSelectedEvent(null)
          }}
          event={selectedEvent}
        />
      )}
    </div>
  )
}
