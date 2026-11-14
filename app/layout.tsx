import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Providers } from "./providers"

const inter = Inter({ subsets: ["latin"] })

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "TechCollab - All-in-One Tech Collaboration Platform",
    template: "%s | TechCollab",
  },
  description:
    "Connect, collaborate, and grow with freelance projects, tech events, and community chat in one platform.",
  applicationName: "TechCollab",
  openGraph: {
    type: "website",
    siteName: "TechCollab",
    title: "TechCollab - All-in-One Tech Collaboration Platform",
    description: "Freelance projects, tech events, and communities in one platform.",
  },
  twitter: {
    card: "summary_large_image",
    title: "TechCollab - All-in-One Tech Collaboration Platform",
    description: "Freelance projects, tech events, and communities in one platform.",
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0b1120" },
  ],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
