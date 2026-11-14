import { dirname } from "node:path"
import { fileURLToPath } from "node:url"
import { FlatCompat } from "@eslint/eslintrc"

const compat = new FlatCompat({ baseDirectory: dirname(fileURLToPath(import.meta.url)) })

const config = [
  { ignores: [".next/**", "node_modules/**", "out/**", "coverage/**", "next-env.d.ts"] },
  ...compat.extends("next/core-web-vitals", "next/typescript", "prettier"),
  {
    rules: {
      "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }],
      // Apostrophes and quotes in JSX copy render correctly; escaping them only hurts readability.
      "react/no-unescaped-entities": "off",
    },
  },
  {
    // Generated shadcn/ui primitives are kept close to upstream.
    files: ["components/ui/**"],
    rules: { "@typescript-eslint/no-empty-object-type": "off" },
  },
]

export default config
