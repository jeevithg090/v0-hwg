"use client"

import type React from "react"
import { Suspense, useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { ArrowLeft, Chrome, Github, Mail } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { BrandMark } from "@/components/brand"
import { PasswordInput } from "@/components/password-input"
import { FullPageSpinner } from "@/components/auth-guard"
import { createDemoUser, safeRedirectPath, validateSignIn } from "@/lib/auth"
import { useUser } from "@/lib/user-context"

function SignInForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { signIn, setUser } = useUser()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const redirectTo = safeRedirectPath(searchParams.get("next"))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const validationError = validateSignIn(email, password)
    if (validationError) {
      setError(validationError)
      return
    }

    setIsSubmitting(true)
    const account = signIn(email)
    if (!account) {
      setIsSubmitting(false)
      setError("No account found for that email on this device. Create one to get started.")
      return
    }
    router.push(redirectTo)
  }

  const handleSocialLogin = (provider: "google" | "github") => {
    setIsSubmitting(true)
    setUser(createDemoUser(provider))
    router.push(redirectTo)
  }

  return (
    <div className="mx-auto w-full max-w-md">
      <div className="mb-8 text-center">
        <Link
          href="/auth"
          className="mb-4 inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="mr-2 h-4 w-4" aria-hidden="true" />
          Back to options
        </Link>
        <BrandMark className="mb-4 justify-center" />
        <h1 className="text-2xl font-bold">Welcome back</h1>
        <p className="text-muted-foreground">Sign in to your account to continue</p>
      </div>

      <Card>
        <CardHeader className="space-y-1">
          <CardTitle className="text-center text-xl">Sign in</CardTitle>
          <CardDescription className="text-center">Enter your credentials to access your account</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => handleSocialLogin("google")}
              disabled={isSubmitting}
            >
              <Chrome className="mr-2 h-4 w-4" aria-hidden="true" />
              Continue with Google (demo)
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => handleSocialLogin("github")}
              disabled={isSubmitting}
            >
              <Github className="mr-2 h-4 w-4" aria-hidden="true" />
              Continue with GitHub (demo)
            </Button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">Or continue with email</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail
                  className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                  aria-hidden="true"
                />
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="john@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link href="/auth/forgot-password" className="text-sm text-blue-600 hover:underline">
                  Forgot password?
                </Link>
              </div>
              <PasswordInput
                id="password"
                autoComplete="current-password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Signing in..." : "Sign in"}
            </Button>
          </form>

          <p className="text-center text-sm">
            <span className="text-muted-foreground">Don&apos;t have an account? </span>
            <Link href="/auth/signup" className="font-medium text-blue-600 hover:underline">
              Sign up
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

export default function SignInPage() {
  return (
    <Suspense fallback={<FullPageSpinner />}>
      <SignInForm />
    </Suspense>
  )
}
