import type { Metadata } from "next"
import { SimplePage } from "@/components/simple-page"

export const metadata: Metadata = { title: "Terms of Service" }

export default function TermsPage() {
  return (
    <SimplePage title="Terms of Service">
      <p>
        TechCollab is currently a product demo. Formal terms of service will be published here before the platform
        accepts real users or payments.
      </p>
    </SimplePage>
  )
}
