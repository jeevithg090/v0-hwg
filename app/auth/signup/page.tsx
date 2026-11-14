"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
import { RoleSelector } from "@/components/role-selector"
import { FieldError, PasswordInput } from "@/components/password-input"
import {
  MIN_PASSWORD_LENGTH,
  createUserFromSignUp,
  roleRequiresCompany,
  validateSignUp,
  type SignUpErrors,
  type SignUpInput,
  type UserRole,
} from "@/lib/auth"
import { useUser } from "@/lib/user-context"

const ROLE_LABELS: Record<UserRole, string> = {
  freelancer: "Freelancer",
  client: "Client",
  startup: "Startup",
}

const initialForm: SignUpInput = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  confirmPassword: "",
  company: "",
  role: "",
  agreeToTerms: false,
}

export default function SignUpPage() {
  const router = useRouter()
  const { register } = useUser()
  const [formData, setFormData] = useState<SignUpInput>(initialForm)
  const [errors, setErrors] = useState<SignUpErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const updateField = <K extends keyof SignUpInput>(field: K, value: SignUpInput[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const nextErrors = validateSignUp(formData)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    setIsSubmitting(true)
    register(createUserFromSignUp(formData))
    router.push("/dashboard")
  }

  const fieldProps = (field: keyof SignUpInput) => ({
    "aria-invalid": errors[field] ? true : undefined,
    "aria-describedby": errors[field] ? `${field}-error` : undefined,
  })

  const role = formData.role

  return (
    <div className="mx-auto w-full max-w-2xl">
      <div className="mb-8 flex items-center space-x-4">
        <Button variant="ghost" size="icon" asChild aria-label="Go back">
          <Link href="/auth" aria-label="Back to sign-in options">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">Create Your Account</h1>
          <p className="text-muted-foreground">Join TechCollab and start collaborating</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Sign Up</CardTitle>
          <CardDescription>Create your account to access all platform features</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6" noValidate>
            <RoleSelector
              selectedRole={role}
              onRoleSelect={(value) => updateField("role", value)}
              error={errors.role}
            />

            {role && (
              <>
                <Separator className="my-6" />

                <fieldset className="space-y-4">
                  <legend className="text-lg font-semibold">Personal Information</legend>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input
                        id="firstName"
                        autoComplete="given-name"
                        placeholder="John"
                        value={formData.firstName}
                        onChange={(e) => updateField("firstName", e.target.value)}
                        required
                        {...fieldProps("firstName")}
                      />
                      <FieldError id="firstName-error" message={errors.firstName} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input
                        id="lastName"
                        autoComplete="family-name"
                        placeholder="Doe"
                        value={formData.lastName}
                        onChange={(e) => updateField("lastName", e.target.value)}
                        required
                        {...fieldProps("lastName")}
                      />
                      <FieldError id="lastName-error" message={errors.lastName} />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      autoComplete="email"
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={(e) => updateField("email", e.target.value)}
                      required
                      {...fieldProps("email")}
                    />
                    <FieldError id="email-error" message={errors.email} />
                  </div>

                  {roleRequiresCompany(role) && (
                    <div className="space-y-2">
                      <Label htmlFor="company">{role === "startup" ? "Startup Name" : "Company Name"} *</Label>
                      <Input
                        id="company"
                        autoComplete="organization"
                        placeholder={role === "startup" ? "Your Startup" : "Your Company"}
                        value={formData.company}
                        onChange={(e) => updateField("company", e.target.value)}
                        required
                        {...fieldProps("company")}
                      />
                      <FieldError id="company-error" message={errors.company} />
                    </div>
                  )}

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="password">Password *</Label>
                      <PasswordInput
                        id="password"
                        autoComplete="new-password"
                        placeholder={`At least ${MIN_PASSWORD_LENGTH} characters`}
                        value={formData.password}
                        onChange={(e) => updateField("password", e.target.value)}
                        required
                        {...fieldProps("password")}
                      />
                      <FieldError id="password-error" message={errors.password} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm Password *</Label>
                      <PasswordInput
                        id="confirmPassword"
                        autoComplete="new-password"
                        placeholder="Confirm your password"
                        value={formData.confirmPassword}
                        onChange={(e) => updateField("confirmPassword", e.target.value)}
                        required
                        {...fieldProps("confirmPassword")}
                      />
                      <FieldError id="confirmPassword-error" message={errors.confirmPassword} />
                    </div>
                  </div>
                </fieldset>

                <Separator />

                <div className="space-y-2">
                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="terms"
                      checked={formData.agreeToTerms}
                      onCheckedChange={(checked) => updateField("agreeToTerms", checked === true)}
                      {...fieldProps("agreeToTerms")}
                    />
                    <Label htmlFor="terms" className="text-sm leading-snug">
                      I agree to the{" "}
                      <Link href="/terms" className="text-blue-600 hover:underline">
                        Terms of Service
                      </Link>{" "}
                      and{" "}
                      <Link href="/privacy" className="text-blue-600 hover:underline">
                        Privacy Policy
                      </Link>{" "}
                      *
                    </Label>
                  </div>
                  <FieldError id="agreeToTerms-error" message={errors.agreeToTerms} />
                </div>

                <Button type="submit" className="h-12 w-full" disabled={isSubmitting}>
                  {isSubmitting ? "Creating Account..." : `Create ${ROLE_LABELS[role]} Account`}
                </Button>

                <p className="text-center text-xs text-muted-foreground">
                  Demo mode: your profile is stored only in this browser and your password is never saved.
                </p>

                <p className="text-center text-sm">
                  Already have an account?{" "}
                  <Link href="/auth/signin" className="text-blue-600 hover:underline">
                    Sign in here
                  </Link>
                </p>
              </>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
