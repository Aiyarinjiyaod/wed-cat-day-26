"use client"

import { ProductCard } from "@/components/product-card"
import type { Product } from "@/lib/db"
import { useRouter } from "next/navigation"

interface ProductGridProps {
  products: Product[]
}

export function ProductGrid({ products }: ProductGridProps) {
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

  if (products.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-muted-foreground text-lg">ไม่พบสินค้าในหมวดหมู่นี้</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
      {products.map((product) => (
        <ProductCard 
          key={product.id} 
          product={product} 
          onAddToCart={handleAddToCart}
        />
      ))}
    </div>
  )
}
