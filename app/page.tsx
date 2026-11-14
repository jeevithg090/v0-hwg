import type React from "react"
import Link from "next/link"
import { ArrowRight, Briefcase, Building, Calendar, Globe, Layers, MessageCircle, Users, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Header } from "@/components/header"

const features = [
  {
    icon: Briefcase,
    color: "text-blue-600",
    border: "hover:border-blue-200",
    title: "Freelancing Marketplace",
    description:
      "Connect with tech talent or find your next gig. Post projects, submit proposals, and manage everything in one place.",
    points: [
      "Searchable project listings",
      "Proposal submission",
      "Freelancer profiles & portfolios",
      "Project tracking",
    ],
  },
  {
    icon: Calendar,
    color: "text-purple-600",
    border: "hover:border-purple-200",
    title: "Event Management",
    description:
      "Organize hackathons, webinars, and meetups. Manage registrations, send updates, and build your tech community.",
    points: [
      "Event creation wizard",
      "Registration & ticket types",
      "Attendee management",
      "Virtual & in-person events",
    ],
  },
  {
    icon: MessageCircle,
    color: "text-green-600",
    border: "hover:border-green-200",
    title: "Community Chat",
    description:
      "Build communities with group chat, direct messages, and reactions. Connect with like-minded developers.",
    points: ["Public & private groups", "Direct messaging", "Emoji reactions", "Group moderation tools"],
  },
]

const roles = [
  {
    icon: Briefcase,
    title: "Freelancers",
    description: "Browse projects, send proposals, showcase your portfolio, and discover events to grow your network.",
  },
  {
    icon: Users,
    title: "Clients",
    description: "Post projects, review proposals, and host events to find and engage the right talent.",
  },
  {
    icon: Building,
    title: "Startups",
    description: "Recruit early team members, run hackathons and meetups, and build a community around your product.",
  },
]

const highlights: { icon: React.ComponentType<{ className?: string }>; title: string; text: string; color: string }[] =
  [
    { icon: Layers, title: "All in One", text: "Gigs, events and chat without juggling tools", color: "text-blue-500" },
    {
      icon: Zap,
      title: "Role-Aware",
      text: "Every screen adapts to how you use the platform",
      color: "text-yellow-500",
    },
    {
      icon: Globe,
      title: "Remote-Friendly",
      text: "Built for distributed teams and online events",
      color: "text-green-500",
    },
  ]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Header />

      <main id="main-content">
        <section className="container mx-auto px-4 pb-16 pt-20">
          <div className="mx-auto max-w-4xl text-center">
            <Badge variant="secondary" className="mb-4">
              🚀 The Future of Tech Collaboration
            </Badge>
            <h1 className="mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-4xl font-bold text-transparent sm:text-5xl md:text-7xl">
              Connect. Collaborate. Create.
            </h1>
            <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground sm:text-xl">
              The all-in-one platform where freelancers find gigs, communities thrive, and tech events come to life.
              Stop juggling multiple tools and start building the future together.
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Button size="lg" className="px-8 text-lg" asChild>
                <Link href="/auth/signup">
                  Get Started Free <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="px-8 text-lg" asChild>
                <Link href="#features">Explore Features</Link>
              </Button>
            </div>
          </div>
        </section>

        <section id="features" className="container mx-auto scroll-mt-20 px-4 py-16">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold">Everything You Need in One Platform</h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              Streamline your tech collaboration with an integrated suite of tools
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {features.map((feature) => (
              <Card key={feature.title} className={`border-2 transition-colors ${feature.border}`}>
                <CardHeader>
                  <feature.icon className={`mb-4 h-12 w-12 ${feature.color}`} aria-hidden="true" />
                  <CardTitle>{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="list-inside list-disc space-y-2 text-sm text-muted-foreground">
                    {feature.points.map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section id="roles" className="scroll-mt-20 bg-white/50 py-16 dark:bg-gray-800/50">
          <div className="container mx-auto px-4">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-3xl font-bold">Built for Every Side of Tech</h2>
              <p className="mx-auto max-w-2xl text-muted-foreground">
                Pick a role when you sign up and the dashboard tailors itself to you.
              </p>
            </div>
            <div className="grid gap-8 md:grid-cols-3">
              {roles.map((role) => (
                <div key={role.title} className="text-center">
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-purple-600">
                    <role.icon className="h-7 w-7 text-white" aria-hidden="true" />
                  </div>
                  <h3 className="mb-2 text-xl font-semibold">{role.title}</h3>
                  <p className="text-muted-foreground">{role.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 py-16">
          <h2 className="mb-12 text-center text-3xl font-bold">Why Choose TechCollab?</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {highlights.map((item) => (
              <div key={item.title} className="text-center">
                <item.icon className={`mx-auto mb-4 h-12 w-12 ${item.color}`} aria-hidden="true" />
                <h3 className="mb-2 font-semibold">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-gradient-to-r from-blue-600 to-purple-600 py-16 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="mb-4 text-3xl font-bold">Ready to Transform Your Tech Collaboration?</h2>
            <p className="mb-8 text-xl opacity-90">Create an account in seconds and explore the full dashboard.</p>
            <Button size="lg" variant="secondary" className="px-8 text-lg" asChild>
              <Link href="/auth/signup">
                Start Your Journey <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </section>
      </main>

      <footer className="bg-gray-900 py-12 text-white">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-3">
            <div>
              <h2 className="mb-4 text-xl font-bold">TechCollab</h2>
              <p className="text-gray-400">The future of tech collaboration starts here.</p>
            </div>
            <nav aria-label="Platform">
              <h3 className="mb-4 font-semibold">Platform</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="#features" className="hover:text-white">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#roles" className="hover:text-white">
                    Who it&apos;s for
                  </Link>
                </li>
                <li>
                  <Link href="/auth" className="hover:text-white">
                    Get started
                  </Link>
                </li>
              </ul>
            </nav>
            <nav aria-label="Legal">
              <h3 className="mb-4 font-semibold">Legal</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/terms" className="hover:text-white">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="hover:text-white">
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
          <div className="mt-8 border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} TechCollab. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
