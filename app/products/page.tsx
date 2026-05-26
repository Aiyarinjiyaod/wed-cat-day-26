import { sql } from "@/lib/db"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProductGrid } from "@/components/product-grid"
import { ProductFilters } from "@/components/product-filters"
import type { Product } from "@/lib/db"

export const dynamic = 'force-dynamic'

interface ProductsPageProps {
  searchParams: Promise<{ category?: string }>
}

async function getProducts(category?: string): Promise<Product[]> {
  try {
    if (category) {
      const products = await sql`
        SELECT * FROM products 
        WHERE category = ${category} 
        ORDER BY created_at DESC
      `
      return products as Product[]
    }
    
    const products = await sql`
      SELECT * FROM products ORDER BY created_at DESC
    `
    return products as Product[]
  } catch (error) {
    console.error("Error fetching products:", error)
    return []
  }
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const { category } = await searchParams
  const products = await getProducts(category)

  const categoryNames: Record<string, string> = {
    towers: "คอนโดแมว",
    beds: "ที่นอนแมว",
    shelves: "ชั้นติดผนัง",
    scratchers: "เสาลับเล็บ",
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">
              {category ? categoryNames[category] || "สินค้าทั้งหมด" : "สินค้าทั้งหมด"}
            </h1>
            <p className="text-muted-foreground mt-2">
              พบ {products.length} รายการ
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            <aside className="lg:w-64 flex-shrink-0">
              <ProductFilters currentCategory={category} />
            </aside>
            <div className="flex-1">
              <ProductGrid products={products} />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
