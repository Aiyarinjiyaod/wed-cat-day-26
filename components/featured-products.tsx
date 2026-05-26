"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ProductCard } from "@/components/product-card"
import type { Product } from "@/lib/db"
import { useRouter } from "next/navigation"

interface FeaturedProductsProps {
  products: Product[]
}

export function FeaturedProducts({ products }: FeaturedProductsProps) {
  const router = useRouter()

  const handleAddToCart = async (productId: number) => {
    try {
      await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      })
      router.refresh()
    } catch (error) {
      console.error("Error adding to cart:", error)
    }
  }

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
          <div>
            <span className="text-primary font-medium text-sm uppercase tracking-wide">สินค้าแนะนำ</span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2">
              ขายดีประจำเดือน
            </h2>
          </div>
          <Link href="/products">
            <Button variant="outline" className="group">
              ดูทั้งหมด
              <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <p>ยังไม่มีสินค้าแนะนำ</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
