"use client"

import Link from "next/link"
import { useState } from "react"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { BrandMark } from "@/components/brand"
import { ThemeToggle } from "@/components/theme-toggle"
import { useUser } from "@/lib/user-context"

const navLinks = [
  { href: "/#features", label: "Features" },
  { href: "/#roles", label: "Who It's For" },
  { href: "/dashboard/freelancing", label: "Freelancing" },
  { href: "/dashboard/events", label: "Events" },
]

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { user } = useUser()

  const authButtons = user ? (
    <Button asChild>
      <Link href="/dashboard">Go to Dashboard</Link>
    </Button>
  ) : (
    <>
      <Button variant="ghost" asChild>
        <Link href="/auth/signin">Sign In</Link>
      </Button>
      <Button asChild>
        <Link href="/auth">Get Started</Link>
      </Button>
    </>
  )

  return (
    <header className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur-sm dark:bg-gray-900/80">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-background focus:px-3 focus:py-2"
      >
        Skip to content
      </a>
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <BrandMark size="sm" href="/" />

        <nav aria-label="Main" className="hidden items-center space-x-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center space-x-2 sm:space-x-4">
          <ThemeToggle />
          <div className="hidden items-center space-x-2 md:flex">{authButtons}</div>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMenuOpen((open) => !open)}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {isMenuOpen && (
        <div id="mobile-menu" className="border-t bg-white p-4 dark:bg-gray-900 md:hidden">
          <nav aria-label="Mobile" className="flex flex-col space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-muted-foreground hover:text-foreground"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="flex flex-col space-y-2 border-t pt-4">{authButtons}</div>
          </nav>
        </div>
      )}
    </header>
  )
}
