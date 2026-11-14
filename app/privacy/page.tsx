import type { Metadata } from "next"
import { SimplePage } from "@/components/simple-page"

export const metadata: Metadata = { title: "Privacy Policy" }

export default function PrivacyPage() {
  return (
    <SimplePage title="Privacy Policy">
      <p>
        In this demo, the profile you create (name, email, role and company) is stored only in your browser&apos;s local
        storage. Passwords are never stored, and nothing is sent to a server.
      </p>
      <p>Signing out removes the active session; clearing site data removes saved demo accounts.</p>
    </SimplePage>
  )
}
