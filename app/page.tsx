import { sql } from "@/lib/db"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { HeroSection } from "@/components/hero-section"
import { FeaturedProducts } from "@/components/featured-products"
import { FeaturesSection } from "@/components/features-section"
import { CategorySection } from "@/components/category-section"
import type { Product } from "@/lib/db"

export const dynamic = 'force-dynamic'

async function getFeaturedProducts(): Promise<Product[]> {
  try {
    const products = await sql`
      SELECT * FROM products 
      WHERE featured = true 
      ORDER BY created_at DESC 
      LIMIT 4
    `
    return products as Product[]
  } catch (error) {
    console.error("Error fetching featured products:", error)
    return []
  }
}

export default async function HomePage() {
  const featuredProducts = await getFeaturedProducts()

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <FeaturedProducts products={featuredProducts} />
        <FeaturesSection />
        <CategorySection />
      </main>
      <Footer />
    </div>
  )
}
