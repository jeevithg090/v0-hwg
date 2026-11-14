"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import {
  ArrowLeft,
  Users,
  Calendar,
  DollarSign,
  Download,
  Send,
  Edit,
  MoreVertical,
  Clock,
  Mail,
  Filter,
  Search,
  UserCheck,
  UserX,
  Upload,
} from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { RequireHost } from "@/components/auth-guard"
import { useState } from "react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function ManageEventPage() {
  return (
    <RequireHost fallback="/dashboard/events">
      <ManageEvent />
    </RequireHost>
  )
}

function ManageEvent() {
  const params = useParams<{ id: string }>()
  const [selectedAttendees, setSelectedAttendees] = useState<string[]>([])
  const [filterStatus, setFilterStatus] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("attendees")

  // Mock event data
  const event = {
    id: params.id,
    title: "AI Innovation Hackathon 2024",
    type: "Hackathon",
    description: "48-hour hackathon focused on building AI-powered solutions for social good.",
    startDate: "2024-03-15",
    endDate: "2024-03-17",
    startTime: "09:00",
    endTime: "18:00",
    isOnline: false,
    venue: "TechHub Conference Center",
    address: "123 Tech Street, San Francisco, CA 94105",
    maxAttendees: 500,
    registeredCount: 245,
    waitlistCount: 23,
    checkedInCount: 0,
    isPaid: true,
    ticketPrice: 50,
    totalRevenue: 12250,
    status: "upcoming",
    tags: ["AI", "Machine Learning", "Hackathon", "Social Good"],
  }

  // Mock attendees data
  const attendees = [
    {
      id: "1",
      name: "Alice Johnson",
      email: "alice@example.com",
      phone: "+1 (555) 123-4567",
      registrationDate: "2024-02-15",
      status: "confirmed",
      paymentStatus: "paid",
      checkedIn: false,
      ticketType: "regular",
      company: "TechCorp",
      role: "Software Engineer",
    },
    {
      id: "2",
      name: "Bob Smith",
      email: "bob@example.com",
      phone: "+1 (555) 234-5678",
      registrationDate: "2024-02-16",
      status: "confirmed",
      paymentStatus: "paid",
      checkedIn: false,
      ticketType: "regular",
      company: "StartupXYZ",
      role: "Product Manager",
    },
    {
      id: "3",
      name: "Carol Davis",
      email: "carol@example.com",
      phone: "+1 (555) 345-6789",
      registrationDate: "2024-02-17",
      status: "waitlist",
      paymentStatus: "pending",
      checkedIn: false,
      ticketType: "regular",
      company: "InnovateLab",
      role: "Designer",
    },
    {
      id: "4",
      name: "David Wilson",
      email: "david@example.com",
      phone: "+1 (555) 456-7890",
      registrationDate: "2024-02-18",
      status: "confirmed",
      paymentStatus: "paid",
      checkedIn: false,
      ticketType: "student",
      company: "University",
      role: "Student",
    },
    {
      id: "5",
      name: "Emily Brown",
      email: "emily@example.com",
      phone: "+1 (555) 567-8901",
      registrationDate: "2024-02-19",
      status: "cancelled",
      paymentStatus: "refunded",
      checkedIn: false,
      ticketType: "regular",
      company: "DevStudio",
      role: "Developer",
    },
  ]

  const filteredAttendees = attendees.filter((attendee) => {
    const matchesSearch =
      attendee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      attendee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      attendee.company.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === "all" || attendee.status === filterStatus
    return matchesSearch && matchesFilter
  })

  const handleSelectAttendee = (attendeeId: string) => {
    setSelectedAttendees((prev) =>
      prev.includes(attendeeId) ? prev.filter((id) => id !== attendeeId) : [...prev, attendeeId],
    )
  }

  const handleSelectAll = () => {
    if (selectedAttendees.length === filteredAttendees.length) {
      setSelectedAttendees([])
    } else {
      setSelectedAttendees(filteredAttendees.map((a) => a.id))
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return <Badge className="bg-green-100 text-green-800">Confirmed</Badge>
      case "waitlist":
        return <Badge className="bg-yellow-100 text-yellow-800">Waitlist</Badge>
      case "cancelled":
        return <Badge className="bg-red-100 text-red-800">Cancelled</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getPaymentBadge = (status: string) => {
    switch (status) {
      case "paid":
        return <Badge className="bg-green-100 text-green-800">Paid</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
      case "refunded":
        return <Badge className="bg-gray-100 text-gray-800">Refunded</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-4">
        <Button variant="ghost" size="icon" asChild aria-label="Go back">
          <Link href="/dashboard/events">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold sm:text-3xl">{event.title}</h1>
          <p className="text-muted-foreground">Event Management Dashboard</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setActiveTab("settings")}>
            <Edit className="mr-2 h-4 w-4" />
            Edit Event
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" aria-label="More options">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Download className="mr-2 h-4 w-4" />
                Export Attendees
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Send className="mr-2 h-4 w-4" />
                Send Announcement
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Calendar className="mr-2 h-4 w-4" />
                Duplicate Event
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Event Overview */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Registered</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{event.registeredCount}</div>
            <p className="text-xs text-muted-foreground">of {event.maxAttendees} max capacity</p>
            <Progress value={(event.registeredCount / event.maxAttendees) * 100} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Waitlist</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{event.waitlistCount}</div>
            <p className="text-xs text-muted-foreground">people waiting</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${event.totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">from {event.registeredCount} tickets</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Check-ins</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{event.checkedInCount}</div>
            <p className="text-xs text-muted-foreground">of {event.registeredCount} registered</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="flex h-auto w-full flex-wrap justify-start sm:grid sm:grid-cols-5">
          <TabsTrigger value="attendees">Attendees</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="communications">Communications</TabsTrigger>
          <TabsTrigger value="check-in">Check-in</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="attendees" className="space-y-6">
          {/* Attendee Management Tools */}
          <Card>
            <CardHeader>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <CardTitle>Attendee Management</CardTitle>
                <div className="flex gap-2">
                  {selectedAttendees.length > 0 && (
                    <>
                      <Button variant="outline" size="sm">
                        <Mail className="mr-2 h-4 w-4" />
                        Email Selected ({selectedAttendees.length})
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="mr-2 h-4 w-4" />
                        Export Selected
                      </Button>
                    </>
                  )}
                  <Button size="sm">
                    <Download className="mr-2 h-4 w-4" />
                    Export All
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-6 flex flex-col gap-4 md:flex-row">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
                  <Input
                    placeholder="Search attendees..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="waitlist">Waitlist</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" className="gap-2">
                  <Filter className="h-4 w-4" />
                  More Filters
                </Button>
              </div>

              <div className="rounded-lg border">
                <div className="border-b bg-muted/50 p-4">
                  <div className="flex items-center space-x-4">
                    <input
                      type="checkbox"
                      checked={selectedAttendees.length === filteredAttendees.length && filteredAttendees.length > 0}
                      onChange={handleSelectAll}
                      className="rounded"
                    />
                    <span className="font-medium">{filteredAttendees.length} attendees</span>
                  </div>
                </div>

                <div className="divide-y">
                  {filteredAttendees.map((attendee) => (
                    <div key={attendee.id} className="p-4 hover:bg-muted/50">
                      <div className="flex items-center space-x-4">
                        <input
                          type="checkbox"
                          checked={selectedAttendees.includes(attendee.id)}
                          onChange={() => handleSelectAttendee(attendee.id)}
                          className="rounded"
                        />
                        <Avatar className="h-10 w-10">
                          <AvatarImage src="/placeholder.svg?height=40&width=40" />
                          <AvatarFallback>
                            {attendee.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <div>
                              <p className="font-medium">{attendee.name}</p>
                              <p className="text-sm text-muted-foreground">{attendee.email}</p>
                              <p className="text-sm text-muted-foreground">
                                {attendee.company} • {attendee.role}
                              </p>
                            </div>
                            <div className="flex items-center space-x-2">
                              {getStatusBadge(attendee.status)}
                              {getPaymentBadge(attendee.paymentStatus)}
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" aria-label="More options">
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem>
                                    <Mail className="mr-2 h-4 w-4" />
                                    Send Email
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <UserCheck className="mr-2 h-4 w-4" />
                                    Check In
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <Edit className="mr-2 h-4 w-4" />
                                    Edit Details
                                  </DropdownMenuItem>
                                  <DropdownMenuItem className="text-red-600">
                                    <UserX className="mr-2 h-4 w-4" />
                                    Cancel Registration
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>
                          <div className="mt-2 flex items-center space-x-4 text-xs text-muted-foreground">
                            <span>Registered: {attendee.registrationDate}</span>
                            <span>Ticket: {attendee.ticketType}</span>
                            <span>Phone: {attendee.phone}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Registration Timeline</CardTitle>
                <CardDescription>Daily registration count over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex h-64 items-center justify-center text-muted-foreground">
                  Registration chart would go here
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Attendee Demographics</CardTitle>
                <CardDescription>Breakdown by company and role</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="mb-1 flex justify-between text-sm">
                      <span>Software Engineers</span>
                      <span>45%</span>
                    </div>
                    <Progress value={45} className="h-2" />
                  </div>
                  <div>
                    <div className="mb-1 flex justify-between text-sm">
                      <span>Product Managers</span>
                      <span>25%</span>
                    </div>
                    <Progress value={25} className="h-2" />
                  </div>
                  <div>
                    <div className="mb-1 flex justify-between text-sm">
                      <span>Designers</span>
                      <span>20%</span>
                    </div>
                    <Progress value={20} className="h-2" />
                  </div>
                  <div>
                    <div className="mb-1 flex justify-between text-sm">
                      <span>Students</span>
                      <span>10%</span>
                    </div>
                    <Progress value={10} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Revenue Analytics</CardTitle>
                <CardDescription>Ticket sales and revenue breakdown</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Regular Tickets (200)</span>
                    <span>$10,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Student Tickets (45)</span>
                    <span>$2,250</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-medium">
                    <span>Total Revenue</span>
                    <span>$12,250</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Engagement Metrics</CardTitle>
                <CardDescription>Event page views and conversion rates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Page Views</span>
                    <span>2,450</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Registrations</span>
                    <span>245</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Conversion Rate</span>
                    <span>10%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Social Shares</span>
                    <span>89</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="communications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Send Announcement</CardTitle>
              <CardDescription>Communicate with your attendees</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Recipients</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select recipients" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Attendees</SelectItem>
                    <SelectItem value="confirmed">Confirmed Only</SelectItem>
                    <SelectItem value="waitlist">Waitlist Only</SelectItem>
                    <SelectItem value="checked-in">Checked-in Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Subject</label>
                <Input placeholder="Enter email subject" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Message</label>
                <textarea className="w-full rounded-md border p-3" rows={6} placeholder="Write your message..." />
              </div>
              <Button>
                <Send className="mr-2 h-4 w-4" />
                Send Announcement
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Communication History</CardTitle>
              <CardDescription>Previous announcements and emails sent</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between rounded-lg border p-3">
                  <div>
                    <p className="font-medium">Event Reminder - 1 Week</p>
                    <p className="text-sm text-muted-foreground">Sent to 245 attendees • 2 days ago</p>
                  </div>
                  <Button variant="outline" size="sm">
                    View
                  </Button>
                </div>
                <div className="flex items-center justify-between rounded-lg border p-3">
                  <div>
                    <p className="font-medium">Welcome & Event Details</p>
                    <p className="text-sm text-muted-foreground">Sent to 200 attendees • 1 week ago</p>
                  </div>
                  <Button variant="outline" size="sm">
                    View
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="check-in" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Event Check-in</CardTitle>
              <CardDescription>Manage attendee check-ins for the event</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Quick Check-in</label>
                  <div className="flex gap-2">
                    <Input placeholder="Scan QR code or enter email" />
                    <Button>Check In</Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Bulk Check-in</label>
                  <Button variant="outline" className="w-full">
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Check-in List
                  </Button>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium">Recent Check-ins</h4>
                <div className="space-y-2">
                  {/* This would show recent check-ins */}
                  <div className="py-8 text-center text-muted-foreground">No check-ins yet. Event hasn't started.</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Event Settings</CardTitle>
              <CardDescription>Manage event configuration and preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="font-medium">Registration Open</p>
                    <p className="text-sm text-muted-foreground">Allow new registrations</p>
                  </div>
                  <input type="checkbox" defaultChecked className="rounded" />
                </div>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="font-medium">Waitlist Enabled</p>
                    <p className="text-sm text-muted-foreground">Allow waitlist when full</p>
                  </div>
                  <input type="checkbox" defaultChecked className="rounded" />
                </div>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="font-medium">Auto-confirm from Waitlist</p>
                    <p className="text-sm text-muted-foreground">Automatically confirm when spots open</p>
                  </div>
                  <input type="checkbox" defaultChecked className="rounded" />
                </div>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="font-medium">Send Reminders</p>
                    <p className="text-sm text-muted-foreground">Email reminders before event</p>
                  </div>
                  <input type="checkbox" defaultChecked className="rounded" />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium">Danger Zone</h4>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full">
                    Cancel Event
                  </Button>
                  <Button variant="destructive" className="w-full">
                    Delete Event
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
