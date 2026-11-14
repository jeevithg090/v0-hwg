import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Briefcase, Calendar, MessageCircle, Shield, Zap, Users } from "lucide-react"
import Link from "next/link"
import { BrandMark } from "@/components/brand"

export default function AuthPage() {
  return (
    <div className="mx-auto w-full max-w-6xl">
      {/* Header */}
      <div className="mb-12 text-center">
        <BrandMark size="lg" className="mb-6 justify-center" />
        <h1 className="mb-4 text-3xl font-bold sm:text-4xl">Join the Future of Tech Collaboration</h1>
        <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
          Connect with freelancers, discover events, and build communities. Choose how you&apos;d like to get started.
        </p>
      </div>

      {/* Auth Options */}
      <div className="mb-12 grid gap-8 md:grid-cols-2">
        {/* Sign In Card */}
        <Card className="relative overflow-hidden border-2 transition-all duration-300 hover:border-blue-200 hover:shadow-lg">
          <div className="absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-blue-600 to-purple-600"></div>
          <CardHeader className="pb-4 text-center">
            <CardTitle className="text-2xl">Welcome Back</CardTitle>
            <CardDescription className="text-base">
              Sign in to your existing account and continue your journey
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-3 text-sm text-muted-foreground">
                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                <span>Access your dashboard instantly</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-muted-foreground">
                <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                <span>Continue active projects</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-muted-foreground">
                <div className="h-2 w-2 rounded-full bg-purple-500"></div>
                <span>Rejoin your communities</span>
              </div>
            </div>

            <Button asChild className="h-12 w-full text-lg">
              <Link href="/auth/signin">
                Sign In
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              Forgot your password?{" "}
              <Link href="/auth/forgot-password" className="text-blue-600 hover:underline">
                Reset it here
              </Link>
            </p>
          </CardContent>
        </Card>

        {/* Sign Up Card */}
        <Card className="relative overflow-hidden border-2 transition-all duration-300 hover:border-purple-200 hover:shadow-lg">
          <div className="absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-purple-600 to-pink-600"></div>
          <CardHeader className="pb-4 text-center">
            <div className="mb-2 flex justify-center">
              <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                🎉 New User
              </Badge>
            </div>
            <CardTitle className="text-2xl">Start Your Journey</CardTitle>
            <CardDescription className="text-base">
              Create a new account and unlock all platform features
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-3 text-sm text-muted-foreground">
                <Briefcase className="h-4 w-4 text-blue-600" />
                <span>Access to freelancing marketplace</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4 text-purple-600" />
                <span>Create and join tech events</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-muted-foreground">
                <MessageCircle className="h-4 w-4 text-green-600" />
                <span>Join vibrant communities</span>
              </div>
            </div>

            <Button
              asChild
              className="h-12 w-full bg-gradient-to-r from-purple-600 to-pink-600 text-lg hover:from-purple-700 hover:to-pink-700"
            >
              <Link href="/auth/signup">
                Create Account
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              By signing up, you agree to our{" "}
              <Link href="/terms" className="text-purple-600 hover:underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="text-purple-600 hover:underline">
                Privacy Policy
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Features Preview */}
      <div className="mb-8 text-center">
        <h2 className="mb-6 text-2xl font-bold">Why Choose TechCollab?</h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="flex flex-col items-center space-y-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900">
              <Zap className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="font-semibold">Lightning Fast</h3>
            <p className="text-sm text-muted-foreground">Real-time collaboration tools</p>
          </div>
          <div className="flex flex-col items-center space-y-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900">
              <Shield className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="font-semibold">Role-Based Workspaces</h3>
            <p className="text-sm text-muted-foreground">Tailored for freelancers, clients and startups</p>
          </div>
          <div className="flex flex-col items-center space-y-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900">
              <Users className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="font-semibold">Global Community</h3>
            <p className="text-sm text-muted-foreground">Connect worldwide</p>
          </div>
        </div>
      </div>

      {/* Back to Home */}
      <div className="text-center">
        <Button variant="outline" asChild>
          <Link href="/">← Back to Home</Link>
        </Button>
      </div>
    </div>
  )
}
