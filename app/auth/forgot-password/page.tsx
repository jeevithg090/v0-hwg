import type { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card"

export const metadata: Metadata = { title: "Reset password" }

export default function ForgotPasswordPage() {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <h1 className="text-2xl font-semibold leading-none tracking-tight">Reset your password</h1>
        <CardDescription>Password reset isn&apos;t available in demo mode.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 text-sm text-muted-foreground">
        <p>
          Demo accounts don&apos;t store passwords, so you can sign in with your registered email and any password, or
          create a new account.
        </p>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button asChild className="flex-1">
            <Link href="/auth/signin">Back to sign in</Link>
          </Button>
          <Button asChild variant="outline" className="flex-1">
            <Link href="/auth/signup">Create account</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
