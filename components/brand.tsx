import Link from "next/link"
import { cn } from "@/lib/utils"

const sizes = {
  sm: { box: "h-8 w-8 text-sm", text: "text-lg" },
  md: { box: "h-10 w-10", text: "text-xl" },
  lg: { box: "h-12 w-12 text-lg", text: "text-2xl" },
} as const

export function BrandMark({
  size = "md",
  href,
  className,
}: {
  size?: keyof typeof sizes
  href?: string
  className?: string
}) {
  const content = (
    <>
      <span
        aria-hidden="true"
        className={cn(
          "flex items-center justify-center rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 font-bold text-white",
          sizes[size].box,
        )}
      >
        TC
      </span>
      <span className={cn("font-bold", sizes[size].text)}>TechCollab</span>
    </>
  )
  const classes = cn("flex items-center space-x-2", className)
  return href ? (
    <Link href={href} className={classes} aria-label="TechCollab home">
      {content}
    </Link>
  ) : (
    <div className={classes}>{content}</div>
  )
}
