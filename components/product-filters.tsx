"use client"

import Link from "next/link"
import { cn } from "@/lib/utils"

interface ProductFiltersProps {
  currentCategory?: string
}

const categories = [
  { slug: "", name: "ทั้งหมด" },
  { slug: "towers", name: "คอนโดแมว" },
  { slug: "beds", name: "ที่นอนแมว" },
  { slug: "scratchers", name: "เสาลับเล็บ" },
]

export function ProductFilters({ currentCategory }: ProductFiltersProps) {
  return (
    <div className="bg-card rounded-xl p-6 border border-border/50 sticky top-24">
      <h3 className="font-semibold text-foreground mb-4">หมวดหมู่</h3>
      <nav className="space-y-2">
        {categories.map((category) => (
          <Link
            key={category.slug}
            href={category.slug ? `/products?category=${category.slug}` : "/products"}
            className={cn(
              "block px-4 py-2 rounded-lg text-sm transition-colors",
              (currentCategory === category.slug || (!currentCategory && !category.slug))
                ? "bg-primary text-primary-foreground font-medium"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            {category.name}
          </Link>
        ))}
      </nav>
    </div>
  )
}
